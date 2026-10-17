// Tingo Database using Node 24 native node:sqlite
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'tingo.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT DEFAULT 'Learner',
    level TEXT DEFAULT 'Beginner',
    target_lang TEXT DEFAULT 'Chinese (Mandarin)',
    streak_days INTEGER DEFAULT 1,
    minutes_practiced INTEGER DEFAULT 0,
    calls_completed INTEGER DEFAULT 0,
    last_active_date TEXT
  );

  INSERT OR IGNORE INTO profile (id, name, level, target_lang, streak_days, minutes_practiced, calls_completed, last_active_date)
  VALUES (1, 'Learner', 'Beginner', 'Chinese (Mandarin)', 1, 0, 0, date('now'));

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    topic TEXT,
    level TEXT,
    started_at TEXT DEFAULT CURRENT_TIMESTAMP,
    ended_at TEXT,
    duration_seconds INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    feedback TEXT,
    turns_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    role TEXT,
    zh TEXT,
    pinyin TEXT,
    en TEXT,
    fix TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mistakes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    user_input TEXT,
    correction TEXT,
    explanation TEXT,
    pinyin TEXT,
    reviewed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zh TEXT UNIQUE,
    pinyin TEXT,
    en TEXT,
    topic TEXT,
    mastered INTEGER DEFAULT 0,
    times_practiced INTEGER DEFAULT 1,
    last_practiced TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Pre-populate some starter vocabulary if empty so phrasebook looks rich immediately
const countVocab = db.prepare('SELECT COUNT(*) as c FROM vocabulary').get();
if (countVocab && countVocab.c === 0) {
  const insertVocabInit = db.prepare(`
    INSERT OR IGNORE INTO vocabulary (zh, pinyin, en, topic, times_practiced)
    VALUES (?, ?, ?, ?, ?)
  `);
  const starters = [
    ['你好', 'nǐ hǎo', 'Hello / Hi', 'Introductions', 3],
    ['很高兴认识你', 'hěn gāoxìng rènshí nǐ', 'Nice to meet you', 'Introductions', 2],
    ['老板，来一碗牛肉面', 'lǎobǎn, lái yī wǎn niúròumiàn', 'Boss, one bowl of beef noodles', 'Ordering food', 2],
    ['不要辣', 'bù yào là', 'Not spicy / no chili', 'Ordering food', 1],
    ['太贵了，便宜点吧', 'tài guì le, piányi diǎn ba', 'Too expensive, cheaper please', 'Shopping', 2],
    ['请问洗手间在哪里？', 'qǐngwèn xǐshǒujiān zài nǎlǐ?', 'Excuse me, where is the restroom?', 'Directions', 1],
    ['今天工作很忙', 'jīntiān gōngzuò hěn máng', 'Work is very busy today', 'Daily banter', 2],
    ['慢慢来', 'mànmàn lái', 'Take it slow / take your time', 'Introductions', 1]
  ];
  for (const s of starters) {
    insertVocabInit.run(s[0], s[1], s[2], s[3], s[4]);
  }
}

// Database helper functions
const dbService = {
  getProfile() {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    const stats = {
      totalVocab: db.prepare('SELECT COUNT(*) as c FROM vocabulary').get().c,
      masteredVocab: db.prepare('SELECT COUNT(*) as c FROM vocabulary WHERE mastered = 1').get().c,
      totalMistakes: db.prepare('SELECT COUNT(*) as c FROM mistakes').get().c,
      unreviewedMistakes: db.prepare('SELECT COUNT(*) as c FROM mistakes WHERE reviewed = 0').get().c,
      totalSessions: db.prepare('SELECT COUNT(*) as c FROM sessions').get().c
    };

    // Check streak
    const today = new Date().toISOString().slice(0, 10);
    if (profile.last_active_date) {
      const last = new Date(profile.last_active_date);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        // consecutive day
        db.prepare('UPDATE profile SET streak_days = streak_days + 1, last_active_date = ? WHERE id = 1').run(today);
        profile.streak_days += 1;
        profile.last_active_date = today;
      } else if (diffDays > 1) {
        // streak broken
        db.prepare('UPDATE profile SET streak_days = 1, last_active_date = ? WHERE id = 1').run(today);
        profile.streak_days = 1;
        profile.last_active_date = today;
      }
    }

    return { ...profile, ...stats };
  },

  updateProfile({ name, level, target_lang }) {
    if (name !== undefined) db.prepare('UPDATE profile SET name = ? WHERE id = 1').run(name);
    if (level !== undefined) db.prepare('UPDATE profile SET level = ? WHERE id = 1').run(level);
    if (target_lang !== undefined) db.prepare('UPDATE profile SET target_lang = ? WHERE id = 1').run(target_lang);
    return this.getProfile();
  },

  startSession(id, topic, level) {
    db.prepare(`
      INSERT INTO sessions (id, topic, level, started_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run(id, topic, level);
    return { id, topic, level };
  },

  saveMessage(sessionId, { role, zh, pinyin, en, fix }) {
    db.prepare(`
      INSERT INTO messages (session_id, role, zh, pinyin, en, fix)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, role, zh || '', pinyin || '', en || '', fix || '');

    // Increment turns count
    db.prepare('UPDATE sessions SET turns_count = turns_count + 1 WHERE id = ?').run(sessionId);

    // If AI gave a fix / correction, automatically record into mistakes bank
    if (role === 'assistant' && fix && fix.trim().length > 0) {
      // Find the previous user utterance
      const lastUser = db.prepare(`
        SELECT zh FROM messages 
        WHERE session_id = ? AND role = 'user' 
        ORDER BY id DESC LIMIT 1
      `).get();

      const userInput = lastUser ? lastUser.zh : '';
      db.prepare(`
        INSERT INTO mistakes (session_id, user_input, correction, explanation, pinyin)
        VALUES (?, ?, ?, ?, ?)
      `).run(sessionId, userInput, zh || '', fix, pinyin || '');
    }

    // If AI introduced a valid Chinese phrase, save to vocabulary
    if (role === 'assistant' && zh && zh.trim().length > 0 && zh.length <= 40) {
      const topicRow = db.prepare('SELECT topic FROM sessions WHERE id = ?').get(sessionId);
      const topic = topicRow ? topicRow.topic : 'General';
      db.prepare(`
        INSERT INTO vocabulary (zh, pinyin, en, topic)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(zh) DO UPDATE SET
          times_practiced = times_practiced + 1,
          last_practiced = CURRENT_TIMESTAMP
      `).run(zh, pinyin || '', en || '', topic);
    }
  },

  endSession(sessionId, { score, feedback, durationSeconds }) {
    const dur = Math.max(0, parseInt(durationSeconds, 10) || 0);
    const mins = Math.ceil(dur / 60);

    db.prepare(`
      UPDATE sessions 
      SET ended_at = datetime('now'),
          duration_seconds = ?,
          score = ?,
          feedback = ?
      WHERE id = ?
    `).run(dur, score || 8, feedback || '', sessionId);

    // Update profile minutes and calls count
    db.prepare(`
      UPDATE profile 
      SET minutes_practiced = minutes_practiced + ?,
          calls_completed = calls_completed + 1,
          last_active_date = date('now')
      WHERE id = 1
    `).run(mins);

    return db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
  },

  getVocabulary(topicFilter) {
    if (topicFilter && topicFilter !== 'All') {
      return db.prepare('SELECT * FROM vocabulary WHERE topic = ? ORDER BY last_practiced DESC').all(topicFilter);
    }
    return db.prepare('SELECT * FROM vocabulary ORDER BY last_practiced DESC').all();
  },

  toggleVocabMastered(id) {
    db.prepare('UPDATE vocabulary SET mastered = CASE WHEN mastered = 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
    return db.prepare('SELECT * FROM vocabulary WHERE id = ?').get();
  },

  addVocabulary({ zh, pinyin, en, topic }) {
    db.prepare(`
      INSERT INTO vocabulary (zh, pinyin, en, topic)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(zh) DO UPDATE SET
        pinyin = excluded.pinyin,
        en = excluded.en,
        times_practiced = times_practiced + 1,
        last_practiced = CURRENT_TIMESTAMP
    `).run(zh, pinyin, en, topic || 'Custom');
    return db.prepare('SELECT * FROM vocabulary WHERE zh = ?').get(zh);
  },

  getMistakes(filter) {
    if (filter === 'unreviewed') {
      return db.prepare('SELECT * FROM mistakes WHERE reviewed = 0 ORDER BY created_at DESC').all();
    } else if (filter === 'reviewed') {
      return db.prepare('SELECT * FROM mistakes WHERE reviewed = 1 ORDER BY created_at DESC').all();
    }
    return db.prepare('SELECT * FROM mistakes ORDER BY created_at DESC').all();
  },

  toggleMistakeReviewed(id) {
    db.prepare('UPDATE mistakes SET reviewed = CASE WHEN reviewed = 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
    return db.prepare('SELECT * FROM mistakes WHERE id = ?').get();
  },

  getRecentSessions(limit = 10) {
    const sessions = db.prepare('SELECT * FROM sessions ORDER BY started_at DESC LIMIT ?').all(limit);
    return sessions.map(s => {
      const messages = db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY id ASC').all(s.id);
      return { ...s, messages };
    });
  },

  getLastSessionSummary() {
    const lastSession = db.prepare(`
      SELECT * FROM sessions 
      WHERE turns_count > 0 
      ORDER BY started_at DESC LIMIT 1
    `).get();
    if (!lastSession) return null;
    const messages = db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY id ASC LIMIT 6').all(lastSession.id);
    return { ...lastSession, previewMessages: messages };
  }
};

module.exports = dbService;
