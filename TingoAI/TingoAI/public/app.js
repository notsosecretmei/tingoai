// Tingo AI - Client Application Logic
// Inspired by Pingo AI: teaching Mandarin Chinese with tutor Lao Li

const LEVELS = ["Beginner", "Elementary", "Intermediate", "Advanced"];
const TOPICS = [
  "Ordering food",
  "Introductions",
  "Shopping & Bargaining",
  "Directions & Taxis",
  "Daily banter",
  "Travel & Hotel",
  "Free talk"
];

// App State
let state = {
  level: 0,
  topic: 0,
  inCall: false,
  busy: false,
  muted: false,
  speaking: false,
  sessionId: null,
  callTimerInterval: null,
  callSeconds: 0,
  hist: [], // chat history for context
  sessionMistakes: [],
  sessionPhrases: [],
  currentTab: "practice", // practice | mistakes | phrasebook | progress
  voices: []
};

const $ = id => document.getElementById(id);
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

// Helper: Toast notifications
function showToast(msg) {
  const wrap = $("toast-wrap");
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

// Speech Synthesis setup & fix for Chrome bug
function initVoices() {
  if (!window.speechSynthesis) return;
  state.voices = speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => {
    state.voices = speechSynthesis.getVoices();
  };
}
initVoices();

function getChineseVoice() {
  const voices = state.voices.length ? state.voices : speechSynthesis.getVoices();
  // Prefer natural zh-CN voices
  const preferred = voices.find(v => v.lang === "zh-CN" || v.lang === "cmn-Hans-CN");
  if (preferred) return preferred;
  return voices.find(v => v.lang.startsWith("zh")) || null;
}

function speakText(text, rate = 0.9) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) return resolve();
    speechSynthesis.cancel();

    // Prevent Chrome garbage collection bug
    window._currentUtterance = new SpeechSynthesisUtterance(text);
    const u = window._currentUtterance;
    u.lang = "zh-CN";
    u.rate = rate;

    const voice = getChineseVoice();
    if (voice) u.voice = voice;

    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        state.speaking = false;
        resolve();
      }
    };

    u.onend = finish;
    u.onerror = finish;
    // Watchdog fallback in case browser speech engine hangs
    const timeout = Math.max(3000, (text.length / 4) * 1000 + 1000);
    setTimeout(finish, timeout);

    state.speaking = true;
    speechSynthesis.speak(u);
  });
}

// Dynamic Hero Greeting Rotation (Pingo Image 4)
const GREETINGS = [
  { zh: "你好", py: "Nǐ hǎo", en: "Hello" },
  { zh: "早上好", py: "Zǎoshang hǎo", en: "Good morning" },
  { zh: "吃了没？", py: "Chīle méi?", en: "Have you eaten?" },
  { zh: "最近怎么样？", py: "Zuìjìn zěnmeyàng?", en: "How have you been?" },
  { zh: "慢慢来", py: "Mànmàn lái", en: "Take it slow" }
];
let greetingIdx = 0;
function rotateGreeting() {
  const el = $("hero-greeting");
  if (!el) return;
  greetingIdx = (greetingIdx + 1) % GREETINGS.length;
  el.style.opacity = "0";
  setTimeout(() => {
    const g = GREETINGS[greetingIdx];
    el.textContent = `${g.zh} (${g.py}) — ${g.en}`;
    el.style.opacity = "1";
  }, 300);
}
setInterval(rotateGreeting, 3600);

// Chips Rendering
function renderChips(container, items, getVal, setVal) {
  container.innerHTML = "";
  items.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.textContent = item;
    btn.setAttribute("aria-pressed", getVal() === idx);
    btn.onclick = () => {
      setVal(idx);
      renderChips(container, items, getVal, setVal);
    };
    container.appendChild(btn);
  });
}

// Navigation Tabs
function setTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  $("view-practice").classList.toggle("hide", tab !== "practice");
  $("view-mistakes").classList.toggle("hide", tab !== "mistakes");
  $("view-phrasebook").classList.toggle("hide", tab !== "phrasebook");
  $("view-progress").classList.toggle("hide", tab !== "progress");

  if (tab === "mistakes") loadMistakes();
  if (tab === "phrasebook") loadVocabulary();
  if (tab === "progress") loadProgress();
}

// API Calls
async function fetchProfile() {
  try {
    const res = await fetch("/api/profile");
    if (!res.ok) return;
    const data = await res.json();
    $("streak-days").textContent = `${data.streak_days || 1} day streak 🔥`;
    if ($("badge-mistakes")) {
      $("badge-mistakes").textContent = data.unreviewedMistakes || 0;
      $("badge-mistakes").classList.toggle("hide", !data.unreviewedMistakes);
    }
    return data;
  } catch (e) {
    console.error("Error fetching profile:", e);
  }
}

async function loadMistakes(filter = "all") {
  const container = $("mistakes-list");
  container.innerHTML = `<p style="color:var(--mute);grid-column:1/-1;text-align:center;padding:32px;">Loading mistake bank...</p>`;
  try {
    const res = await fetch(`/api/mistakes${filter !== "all" ? "?filter=" + filter : ""}`);
    const items = await res.json();
    if (!items.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px;background:var(--card);border-radius:24px;border:1px solid var(--card-border);">
          <h3 style="font:400 24px var(--serif);margin-bottom:8px;">No mistakes found! 🎉</h3>
          <p style="color:var(--mute);font-size:14px;">Every time Lao Li roasts an error on a call, it gets saved here so you can master it.</p>
        </div>`;
      return;
    }

    container.innerHTML = "";
    items.forEach(m => {
      const card = document.createElement("div");
      card.className = `mistake-card ${m.reviewed ? "reviewed" : ""}`;
      card.innerHTML = `
        <div class="mistake-header">
          <span style="font-size:12px;font-weight:600;color:var(--mute);">${m.reviewed ? "✓ Reviewed" : "Needs Review"}</span>
          <span class="mistake-date">${m.created_at ? new Date(m.created_at).toLocaleDateString() : ""}</span>
        </div>
        ${m.user_input ? `<div class="mistake-user"><strong>What you said:</strong> ${escapeHtml(m.user_input)}</div>` : ""}
        <div class="mistake-correction">
          <div class="zh">${escapeHtml(m.correction)}</div>
          <div class="py">${escapeHtml(m.pinyin)}</div>
        </div>
        <div class="mistake-explanation">"${escapeHtml(m.explanation)}"</div>
        <div class="mistake-actions">
          <button class="btn-sm btn-play-audio">🔊 Listen</button>
          <button class="btn-sm btn-toggle-reviewed ${m.reviewed ? "active" : ""}">${m.reviewed ? "Mark Unreviewed" : "Mark as Mastered"}</button>
        </div>
      `;

      card.querySelector(".btn-play-audio").onclick = () => speakText(m.correction);
      card.querySelector(".btn-toggle-reviewed").onclick = async () => {
        await fetch("/api/mistakes/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: m.id })
        });
        showToast(m.reviewed ? "Moved back to review" : "Marked as reviewed! ✨");
        loadMistakes(filter);
        fetchProfile();
      };

      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger);grid-column:1/-1;">Failed to load mistakes.</p>`;
  }
}

async function loadVocabulary(topic = "All") {
  const container = $("vocab-list");
  container.innerHTML = `<p style="color:var(--mute);grid-column:1/-1;text-align:center;padding:32px;">Loading phrasebook...</p>`;
  try {
    const res = await fetch(`/api/vocabulary${topic !== "All" ? "?topic=" + encodeURIComponent(topic) : ""}`);
    const items = await res.json();
    if (!items.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px;background:var(--card);border-radius:24px;border:1px solid var(--card-border);">
          <h3 style="font:400 24px var(--serif);margin-bottom:8px;">No phrases saved yet</h3>
          <p style="color:var(--mute);font-size:14px;">Target phrases from your sessions with Lao Li automatically appear here.</p>
        </div>`;
      return;
    }

    container.innerHTML = "";
    items.forEach(v => {
      const card = document.createElement("div");
      card.className = `vocab-card ${v.mastered ? "mastered" : ""}`;
      card.innerHTML = `
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:11px;font-weight:600;color:var(--brown);text-transform:uppercase;">${escapeHtml(v.topic || 'General')}</span>
            <span style="font-size:12px;color:var(--mute);">Practiced ${v.times_practiced}x</span>
          </div>
          <div class="vocab-zh">${escapeHtml(v.zh)}</div>
          <div class="vocab-py">${escapeHtml(v.pinyin)}</div>
          <div class="vocab-en">${escapeHtml(v.en)}</div>
        </div>
        <div class="vocab-meta">
          <div style="display:flex;gap:6px;">
            <button class="btn-sm btn-play-norm">🔊</button>
            <button class="btn-sm btn-play-slow" title="Slow rate">🐢 Slow</button>
          </div>
          <button class="btn-sm btn-master ${v.mastered ? "active" : ""}">${v.mastered ? "✓ Mastered" : "Mark Mastered"}</button>
        </div>
      `;

      card.querySelector(".btn-play-norm").onclick = () => speakText(v.zh, 0.9);
      card.querySelector(".btn-play-slow").onclick = () => speakText(v.zh, 0.65);
      card.querySelector(".btn-master").onclick = async () => {
        await fetch("/api/vocabulary/master", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: v.id })
        });
        showToast(v.mastered ? "Unmarked" : "Phrase mastered! 🏆");
        loadVocabulary(topic);
        fetchProfile();
      };

      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger);grid-column:1/-1;">Failed to load vocabulary.</p>`;
  }
}

async function loadProgress() {
  const profile = await fetchProfile();
  if (profile) {
    $("stat-streak").textContent = profile.streak_days || 1;
    $("stat-minutes").textContent = profile.minutes_practiced || 0;
    $("stat-calls").textContent = profile.calls_completed || 0;
    $("stat-vocab").textContent = profile.totalVocab || 0;
  }

  const list = $("sessions-history-list");
  list.innerHTML = `<p style="color:var(--mute);text-align:center;padding:24px;">Loading conversation history...</p>`;
  try {
    const res = await fetch("/api/sessions");
    const sessions = await res.json();
    if (!sessions.length) {
      list.innerHTML = `<p style="color:var(--mute);text-align:center;padding:24px;">No call history yet. Start your first call with Lao Li!</p>`;
      return;
    }

    list.innerHTML = "";
    sessions.forEach(s => {
      const item = document.createElement("div");
      item.className = "session-item";
      const mins = Math.ceil((s.duration_seconds || 0) / 60);
      item.innerHTML = `
        <div>
          <div class="session-topic">${escapeHtml(s.topic || "General")} <span style="font-size:12px;font-weight:normal;color:var(--mute);">(${s.level || "Beginner"})</span></div>
          <div class="session-details">${new Date(s.started_at).toLocaleDateString()} · ${mins} min${mins === 1 ? '' : 's'} · ${s.turns_count || 0} turns</div>
        </div>
        <div class="session-score">Score: ${s.score || 8}/10</div>
      `;
      list.appendChild(item);
    });
  } catch (e) {
    list.innerHTML = `<p style="color:var(--danger);">Failed to load sessions.</p>`;
  }
}

// Conversation Prompt Builder
function buildSystemPrompt() {
  const currentLevel = LEVELS[state.level];
  const currentTopic = TOPICS[state.topic];

  return `You are Lao Li, a sharp-tongued, witty, and deeply knowledgeable native Mandarin Chinese tutor on a live audio phone call with an English speaker.
Learner Level: ${currentLevel}.
Call Topic: ${currentTopic}.

Personality:
- Dry, teasing, sarcastic in a loving way. Never patronize or coddle.
- If the learner makes any grammar, tone, or word choice mistake: playfully roast the attempt (e.g. "Did you learn that from a cartoon?"), then give the exact correct sentence with pinyin and English explanation.
- Roast the effort, never the person.
- Praise only when genuinely earned, and grudgingly (e.g. "Not completely terrible. Keep going.")

Teaching Structure (follow strictly):
- Teach 5 core target phrases for the topic, one at a time.
- For each target phrase:
  1) Present it clearly: Chinese, pinyin, and what it means.
  2) Tell the learner to say it aloud or respond to your prompt.
  3) Check their response: correct errors playfully in the "fix" field.
  4) Challenge them to use it in a real sentence.
  5) Advance to the next phrase.
- Keep the Chinese sentence accessible for a ${currentLevel} learner (1-2 clear sentences).
- Always end your message with a direct instruction, prompt, or question for the learner to speak.

JSON Output Requirement:
You MUST respond ONLY with a valid JSON object matching:
{
  "zh": "your Chinese reply/instruction",
  "pinyin": "pinyin transcription of zh with tone marks",
  "en": "natural English translation of zh",
  "fix": "if the learner made a mistake: the correct sentence plus your witty correction note; if learner did well or it is the start: empty string"
}`;
}

// In-Call Logic
let recognition = null;

function setCallStatus(msg) {
  $("call-status-text").textContent = msg;
}

function updateCallTimer() {
  state.callSeconds++;
  const m = String(Math.floor(state.callSeconds / 60)).padStart(2, "0");
  const s = String(state.callSeconds % 60).padStart(2, "0");
  $("call-timer").textContent = `${m}:${s}`;
}

function appendBubble(sender, data) {
  const log = $("call-log");
  const bubble = document.createElement("div");
  bubble.className = `m ${sender}`;

  if (sender === "me") {
    bubble.innerHTML = `<div class="zh">${escapeHtml(data)}</div>`;
  } else {
    bubble.innerHTML = `
      <div class="zh">${escapeHtml(data.zh)}</div>
      <div class="py">${escapeHtml(data.pinyin)}</div>
      <div class="en">${escapeHtml(data.en)}</div>
      ${data.fix ? `<div class="fix"><strong>Lao Li:</strong> ${escapeHtml(data.fix)}</div>` : ""}
      <div class="m-actions">
        <button class="btn-bubble btn-listen">🔊 Listen</button>
        <button class="btn-bubble btn-save-phrase">★ Save</button>
      </div>
    `;

    bubble.querySelector(".btn-listen").onclick = () => speakText(data.zh);
    bubble.querySelector(".btn-save-phrase").onclick = async () => {
      await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zh: data.zh,
          pinyin: data.pinyin,
          en: data.en,
          topic: TOPICS[state.topic]
        })
      });
      showToast("Saved to phrasebook! 📖");
      fetchProfile();
    };
  }

  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

async function turn(userInputText = "") {
  if (state.busy || !state.inCall) return;
  state.busy = true;
  stopListening();

  if (userInputText) {
    appendBubble("me", userInputText);
    state.hist.push({ role: "user", content: userInputText });
  }

  setCallStatus("Lao Li is thinking...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: buildSystemPrompt(),
        messages: state.hist.slice(-10),
        sessionId: state.sessionId,
        userText: userInputText
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const aiResponse = await res.json();
    state.hist.push({
      role: "assistant",
      zh: aiResponse.zh,
      pinyin: aiResponse.pinyin,
      en: aiResponse.en,
      fix: aiResponse.fix
    });

    // Track for end-of-call summary
    if (aiResponse.zh) state.sessionPhrases.push(aiResponse);
    if (aiResponse.fix) state.sessionMistakes.push({ input: userInputText, fix: aiResponse.fix });

    appendBubble("ai", aiResponse);

    setCallStatus("Lao Li is speaking...");
    if (!state.muted) {
      await speakText(aiResponse.zh);
    }

    setCallStatus("Connected");
  } catch (err) {
    console.error("Turn error:", err);
    setCallStatus("Connection issue");
    appendBubble("ai", {
      zh: "网络有点卡，我们重新试一下。",
      pinyin: "Wǎngluò yǒudiǎn kǎ, wǒmen chóngxīn shì yīxià.",
      en: "Connection hiccup, let's try again.",
      fix: err.message
    });
  } finally {
    state.busy = false;
    if (state.inCall && !state.muted) {
      startListening();
    }
  }
}

function startListening() {
  if (!state.inCall || state.muted || state.busy || !SR) {
    if (state.inCall) setCallStatus(state.muted ? "Muted" : "Type your reply");
    return;
  }

  try {
    recognition = new SR();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      $("orb").className = "orb live";
      setCallStatus("Listening to you...");
    };

    recognition.onresult = evt => {
      const transcript = evt.results[0][0].transcript.trim();
      recognition = null;
      if (transcript) {
        turn(transcript);
      }
    };

    recognition.onerror = e => {
      if (e.error === "not-allowed") {
        showToast("Microphone access denied. You can type!");
      }
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
      if (state.inCall && !state.muted && !state.busy) {
        // Automatically resume listening if still active
        startListening();
      }
    };

    recognition.start();
  } catch (e) {
    stopListening();
  }
}

function stopListening() {
  if (recognition) {
    try { recognition.abort(); } catch (e) {}
    recognition = null;
  }
  $("orb").className = "orb";
}

async function startCall(customTopic = null) {
  if (customTopic !== null) {
    const idx = TOPICS.findIndex(t => t.toLowerCase().includes(customTopic.toLowerCase()));
    if (idx !== -1) state.topic = idx;
  }

  state.inCall = true;
  state.busy = false;
  state.muted = false;
  state.callSeconds = 0;
  state.hist = [];
  state.sessionPhrases = [];
  state.sessionMistakes = [];
  state.sessionId = "ses_" + Date.now();

  $("call-tutor-topic").textContent = `${LEVELS[state.level]} · ${TOPICS[state.topic]}`;
  $("call-log").innerHTML = "";
  $("call-timer").textContent = "00:00";
  setCallStatus("Connecting...");
  $("call-view").classList.remove("hide");
  $("orb").textContent = "Mute";

  // Register session in database
  await fetch("/api/session/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: state.sessionId,
      topic: TOPICS[state.topic],
      level: LEVELS[state.level]
    })
  });

  // Start timer
  state.callTimerInterval = setInterval(updateCallTimer, 1000);

  // Trigger Lao Li's opening greeting without polluting learner history
  turn("");
}

async function endCall() {
  if (!state.inCall) return;
  state.inCall = false;
  state.busy = false;
  clearInterval(state.callTimerInterval);
  stopListening();
  if (window.speechSynthesis) speechSynthesis.cancel();

  $("call-view").classList.add("hide");

  // Calculate score
  const turns = state.hist.length;
  const score = turns < 4 ? 7 : Math.min(10, Math.max(6, 9 - state.sessionMistakes.length));
  const feedback = state.sessionMistakes.length === 0
    ? "Unexpectedly decent pronunciation. Keep practicing."
    : `Caught ${state.sessionMistakes.length} slip-ups. Head over to the Mistake Bank and drill them!`;

  // Save session to database
  await fetch("/api/session/end", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: state.sessionId,
      score: score,
      feedback: feedback,
      durationSeconds: state.callSeconds
    })
  });

  // Show summary modal
  $("summary-score").textContent = `${score}/10`;
  $("summary-verdict").textContent = `"${feedback}" — Lao Li`;
  $("summary-duration").textContent = `${Math.ceil(state.callSeconds / 60)}m`;
  $("summary-turns").textContent = turns;
  $("summary-mistakes-count").textContent = state.sessionMistakes.length;
  $("modal-summary").classList.remove("hide");

  fetchProfile();
}

// Utility: HTML escape
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Event Listeners & Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Theme initialization
  const savedTheme = localStorage.getItem("tingo-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  $("btn-theme-toggle").onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("tingo-theme", next);
  };

  // Nav links
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.onclick = () => setTab(btn.dataset.tab);
  });
  $("btn-nav-call").onclick = () => startCall();
  $("btn-start-hero-call").onclick = () => startCall();

  // Chips setup
  renderChips($("chips-level"), LEVELS, () => state.level, i => state.level = i);
  renderChips($("chips-topic"), TOPICS, () => state.topic, i => state.topic = i);

  // Scenario Cards click listeners (Pingo Image 2)
  document.querySelectorAll(".scenario-card").forEach(card => {
    card.onclick = () => {
      const topicName = card.dataset.topic;
      startCall(topicName);
    };
  });

  // Call View listeners
  $("btn-hangup").onclick = endCall;
  $("orb").onclick = () => {
    state.muted = !state.muted;
    $("orb").textContent = state.muted ? "Unmute" : "Mute";
    if (state.muted) {
      stopListening();
      if (window.speechSynthesis) speechSynthesis.cancel();
      setCallStatus("Muted (Type your reply below)");
    } else {
      setCallStatus("Listening...");
      startListening();
    }
  };

  // Quick helper chips in call
  document.querySelectorAll(".helper-chip").forEach(chip => {
    chip.onclick = () => {
      const text = chip.dataset.text;
      if (text) turn(text);
    };
  });

  // Text input submit
  const sendInput = () => {
    const input = $("call-input");
    const val = input.value.trim();
    if (!val) return;
    input.value = "";
    if (window.speechSynthesis) speechSynthesis.cancel();
    turn(val);
  };
  $("btn-send-text").onclick = sendInput;
  $("call-input").onkeydown = e => {
    if (e.key === "Enter") sendInput();
  };

  // Modal actions
  $("btn-close-summary").onclick = () => {
    $("modal-summary").classList.add("hide");
  };
  $("btn-summary-mistakes").onclick = () => {
    $("modal-summary").classList.add("hide");
    setTab("mistakes");
  };

  // Filter chips in Mistake Bank
  document.querySelectorAll(".filter-mistake").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter-mistake").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadMistakes(btn.dataset.filter);
    };
  });

  // Initial data load
  fetchProfile();
});
