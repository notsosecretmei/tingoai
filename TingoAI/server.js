// Tingo server: serves the app and relays chat requests to the Groq API.
// Run: GROQ_API_KEY=... node server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.TINGO_MODEL || "llama-3.3-70b-versatile";
const PORT = process.env.PORT || 3000;
if (!KEY) { console.error("Set GROQ_API_KEY first."); process.exit(1); }

async function chat(prompt) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: "Bearer " + KEY },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  const data = await r.json();
  return JSON.parse(data.choices[0].message.content);
}

http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", c => (body += c));
    req.on("end", async () => {
      try {
        const out = await chat(JSON.parse(body).prompt);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(out));
      } catch (e) {
        console.error(e.message);
        res.writeHead(500); res.end("error");
      }
    });
    return;
  }
  const file = path.join(__dirname, "public", "index.html");
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Tingo running at http://localhost:${PORT}`));
