// Tingo Server: Serves the app, manages SQLite database, and communicates with Groq AI API.
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const db = require("./db");

// Load .env automatically
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  }
} catch (e) {
  console.warn("Warning loading .env:", e.message);
}

const KEY = (process.env.GROQ_API_KEY || "").trim();
const PRIMARY_MODEL = process.env.TINGO_MODEL || "openai/gpt-oss-120b";
const FALLBACK_MODEL = process.env.FALLBACK_MODEL || "qwen/qwen3.8-27b";
const PORT = process.env.PORT || 3000;

if (!KEY.startsWith("gsk_")) {
  console.error("No valid Groq key found. Put GROQ_API_KEY=gsk_... in a file named .env next to server.js.");
  process.exit(1);
}

// Clean and extract valid JSON from LLM output
function extractJson(raw) {
  if (!raw) throw new Error("Empty AI response");
  let text = raw.trim();

  // Strip markdown code fences if present
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/i, "").trim();
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    // Try to find first balanced '{' and '}'
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const candidate = text.substring(start, end + 1);
      return JSON.parse(candidate);
    }
    throw new Error("Could not parse JSON response from tutor: " + text.slice(0, 100));
  }
}

// Groq chat completion with model fallback and automatic JSON validation recovery
async function callGroqWithModel(model, systemPrompt, conversationMessages) {
  const messages = [
    {
      role: "system",
      content: systemPrompt + "\nAlways reply strictly in valid JSON format matching: {\"zh\": \"...\", \"pinyin\": \"...\", \"en\": \"...\", \"fix\": \"...\"}."
    },
    ...conversationMessages
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  async function sendReq(useJsonFormat) {
    const payload = {
      model: model,
      max_tokens: 2048,
      temperature: 0.7,
      messages: messages
    };
    if (useJsonFormat) {
      payload.response_format = { type: "json_object" };
    }

    return await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + KEY
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  }

  try {
    let res = await sendReq(true);

    // If Groq rejects with 400 (json_validate_failed), retry without strict response_format
    if (!res.ok) {
      const errText = await res.text();
      if (res.status === 400 && errText.includes("json_validate_failed")) {
        console.warn(`Groq JSON validator failed on ${model}, retrying without response_format...`);
        res = await sendReq(false);
      } else {
        throw new Error(`Groq error (${res.status}): ${errText}`);
      }
    }

    if (!res.ok) {
      const errText2 = await res.text();
      throw new Error(`Groq error (${res.status}): ${errText2}`);
    }

    const data = await res.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    const parsed = extractJson(content);

    // Sanitize required fields
    return {
      zh: parsed.zh || "我们继续练习吧。",
      pinyin: parsed.pinyin || "Wǒmen jìxù liànxí ba.",
      en: parsed.en || "Let's continue practicing.",
      fix: parsed.fix || ""
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function chat(systemPrompt, conversationMessages) {
  try {
    return await callGroqWithModel(PRIMARY_MODEL, systemPrompt, conversationMessages);
  } catch (err1) {
    console.warn(`Primary model ${PRIMARY_MODEL} failed (${err1.message}). Trying fallback ${FALLBACK_MODEL}...`);
    try {
      return await callGroqWithModel(FALLBACK_MODEL, systemPrompt, conversationMessages);
    } catch (err2) {
      console.error(`Fallback model ${FALLBACK_MODEL} also failed:`, err2.message);
      throw new Error(err1.message || err2.message);
    }
  }
}

// Parse request body helper
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

// Send JSON helper
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "Content-Type",
    "access-control-allow-methods": "GET, POST, OPTIONS"
  });
  res.end(JSON.stringify(data !== undefined ? data : {}));
}

// MIME types dictionary
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = reqUrl.pathname;
  const searchParams = reqUrl.searchParams;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "Content-Type",
      "access-control-allow-methods": "GET, POST, OPTIONS"
    });
    res.end();
    return;
  }

  // --- API Endpoints ---
  try {
    // 1. Profile & Stats
    if (pathname === "/api/profile") {
      if (req.method === "GET") {
        const profile = db.getProfile();
        return sendJson(res, 200, profile);
      } else if (req.method === "POST") {
        const body = await parseBody(req);
        const updated = db.updateProfile(body);
        return sendJson(res, 200, updated);
      }
    }

    // 2. Vocabulary / Phrasebook
    if (pathname === "/api/vocabulary") {
      if (req.method === "GET") {
        const topic = searchParams.get("topic");
        const lang = searchParams.get("lang");
        const vocab = db.getVocabulary(topic, lang);
        return sendJson(res, 200, vocab);
      } else if (req.method === "POST") {
        const body = await parseBody(req);
        const item = db.addVocabulary(body);
        return sendJson(res, 201, item);
      }
    }

    if (pathname === "/api/vocabulary/master" && req.method === "POST") {
      const body = await parseBody(req);
      const updated = db.toggleVocabMastered(body.id);
      return sendJson(res, 200, updated);
    }

    // 3. Mistake Bank
    if (pathname === "/api/mistakes") {
      if (req.method === "GET") {
        const filter = searchParams.get("filter");
        const lang = searchParams.get("lang");
        const mistakes = db.getMistakes(filter, lang);
        return sendJson(res, 200, mistakes);
      }
    }

    if (pathname === "/api/mistakes/review" && req.method === "POST") {
      const body = await parseBody(req);
      const updated = db.toggleMistakeReviewed(body.id);
      return sendJson(res, 200, updated);
    }

    // 4. Session Management
    if (pathname === "/api/session/start" && req.method === "POST") {
      const body = await parseBody(req);
      const session = db.startSession(body.id || 'ses_' + Date.now(), body.topic, body.level, body.language);
      return sendJson(res, 200, session);
    }

    if (pathname === "/api/session/end" && req.method === "POST") {
      const body = await parseBody(req);
      const session = db.endSession(body.id, {
        score: body.score,
        feedback: body.feedback,
        durationSeconds: body.durationSeconds
      });
      return sendJson(res, 200, session);
    }

    if (pathname === "/api/sessions" && req.method === "GET") {
      const sessions = db.getRecentSessions(10);
      return sendJson(res, 200, sessions);
    }

    if (pathname === "/api/last-session" && req.method === "GET") {
      const summary = db.getLastSessionSummary();
      return sendJson(res, 200, summary || {});
    }

    // 5. Chat Turn with Lao Li
    if (pathname === "/api/chat" && req.method === "POST") {
      const body = await parseBody(req);
      const { system, messages, sessionId, userText } = body;

      // Save user message to database if present
      if (sessionId && userText) {
        db.saveMessage(sessionId, {
          role: "user",
          zh: userText,
          pinyin: "",
          en: "",
          fix: ""
        });
      }

      // Format conversation turns for LLM
      const formattedMessages = (messages || []).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.role === "assistant" 
          ? JSON.stringify({ zh: m.zh, pinyin: m.pinyin, en: m.en, fix: m.fix || "" })
          : m.content
      }));

      // Call AI Tutor
      const tutorResponse = await chat(system, formattedMessages);

      // Save AI tutor response to database
      if (sessionId) {
        db.saveMessage(sessionId, {
          role: "assistant",
          zh: tutorResponse.zh,
          pinyin: tutorResponse.pinyin,
          en: tutorResponse.en,
          fix: tutorResponse.fix
        });
      }

      return sendJson(res, 200, tutorResponse);
    }

  } catch (apiErr) {
    console.error("API Error at " + pathname + ":", apiErr.message);
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: apiErr.message }));
    return;
  }

  // --- Static Files Serving ---
  let safePath = pathname === "/" ? "/index.html" : pathname;
  // Prevent directory traversal
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, "");

  let filePath = path.join(__dirname, "public", safePath);

  // Fallback if not found in root public, check TingoAI/public
  if (!fs.existsSync(filePath)) {
    const altPath = path.join(__dirname, "TingoAI", "public", safePath);
    if (fs.existsSync(altPath)) filePath = altPath;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Default fallback to index.html for SPA routes
      const indexPath = path.join(__dirname, "public", "index.html");
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        return fs.createReadStream(indexPath).pipe(res);
      }
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "content-type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`   Tingo AI Tutor is running!`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Primary Model: ${PRIMARY_MODEL}`);
  console.log(`   Fallback Model: ${FALLBACK_MODEL}`);
  console.log(`   Database: SQLite (tingo.db) connected`);
  console.log(`===============================================`);
});
