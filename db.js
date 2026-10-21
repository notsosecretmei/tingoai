// Tinguin Database using Node native node:sqlite and built-in crypto
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'tingo.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT DEFAULT 'Learner',
    target_lang TEXT DEFAULT 'Japanese',
    level TEXT DEFAULT 'Beginner',
    streak_days INTEGER DEFAULT 1,
    minutes_practiced INTEGER DEFAULT 0,
    calls_completed INTEGER DEFAULT 0,
    last_active_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_tokens (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT DEFAULT 'Learner',
    level TEXT DEFAULT 'Beginner',
    target_lang TEXT DEFAULT 'Japanese',
    streak_days INTEGER DEFAULT 1,
    minutes_practiced INTEGER DEFAULT 0,
    calls_completed INTEGER DEFAULT 0,
    last_active_date TEXT
  );

  INSERT OR IGNORE INTO profile (id, name, level, target_lang, streak_days, minutes_practiced, calls_completed, last_active_date)
  VALUES (1, 'Learner', 'Beginner', 'Japanese', 1, 0, 0, date('now'));

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER DEFAULT 1,
    topic TEXT,
    level TEXT,
    language TEXT DEFAULT 'Japanese',
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
    user_id INTEGER DEFAULT 1,
    session_id TEXT,
    user_input TEXT,
    correction TEXT,
    explanation TEXT,
    pinyin TEXT,
    language TEXT DEFAULT 'Japanese',
    reviewed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    zh TEXT UNIQUE,
    pinyin TEXT,
    en TEXT,
    topic TEXT,
    language TEXT DEFAULT 'Japanese',
    mastered INTEGER DEFAULT 0,
    times_practiced INTEGER DEFAULT 1,
    last_practiced TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe column migrations for existing databases
try { db.exec(`ALTER TABLE vocabulary ADD COLUMN language TEXT DEFAULT 'Japanese'`); } catch (e) {}
try { db.exec(`ALTER TABLE mistakes ADD COLUMN language TEXT DEFAULT 'Japanese'`); } catch (e) {}
try { db.exec(`ALTER TABLE sessions ADD COLUMN language TEXT DEFAULT 'Japanese'`); } catch (e) {}
try { db.exec(`ALTER TABLE vocabulary ADD COLUMN user_id INTEGER DEFAULT 1`); } catch (e) {}
try { db.exec(`ALTER TABLE mistakes ADD COLUMN user_id INTEGER DEFAULT 1`); } catch (e) {}
try { db.exec(`ALTER TABLE sessions ADD COLUMN user_id INTEGER DEFAULT 1`); } catch (e) {}

// Clean out fake / dummy test records so user starts with a completely clean slate
try {
  db.exec(`
    DELETE FROM mistakes WHERE session_id LIKE 'test_%' OR user_input = '' OR user_input IS NULL;
    DELETE FROM sessions WHERE id LIKE 'test_%';
    DELETE FROM messages WHERE session_id LIKE 'test_%';
    UPDATE profile SET minutes_practiced = 0, calls_completed = 0, last_active_date = date('now') WHERE id = 1;
  `);
} catch (e) {
  console.warn("Notice cleaning test data:", e.message);
}

// Password hashing helper using crypto
function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(salt + password).digest('hex');
}

// Ensure default guest user exists
const defaultUser = db.prepare('SELECT id FROM users WHERE id = 1').get();
if (!defaultUser) {
  const salt = crypto.randomBytes(16).toString('hex');
  const pass = hashPassword('tinguin123', salt);
  db.prepare(`
    INSERT INTO users (id, username, password_hash, salt, name, target_lang, level, streak_days, minutes_practiced, calls_completed, last_active_date)
    VALUES (1, 'learner', ?, ?, 'Learner', 'Japanese', 'Beginner', 1, 0, 0, date('now'))
  `).run(pass, salt);
}

// Populate starter vocabulary for all languages
const starters = [
  // Japanese
  ['こんにちは、初めまして', 'Konnichiwa, hajimemashite', 'Hello, nice to meet you', 'Introductions & Etiquette', 'Japanese', 2],
  ['豚骨ラーメン味玉付きでお願いします', 'Tonkotsu rāmen ajitama-tsuki de onegaishimasu', 'Tonkotsu ramen with soft-boiled egg please', 'Ramen & Izakaya', 'Japanese', 2],
  ['麺硬めでお願いします', 'Men katame de onegaishimasu', 'Firm noodles, please', 'Ramen & Izakaya', 'Japanese', 2],
  ['とりあえず生ビールで！', 'Toriaezu nama bīru de!', 'Draft beer to start with, please!', 'Ramen & Izakaya', 'Japanese', 2],
  ['お会計をお願いします', 'O-kaikei o onegaishimasu', 'The bill, please', 'Ramen & Izakaya', 'Japanese', 1],
  ['駅はどちらですか？', 'Eki wa dochira desu ka?', 'Which way is the station?', 'Trains & Tokyo Navigation', 'Japanese', 1],
  ['これ、いくらですか？', 'Kore, ikura desu ka?', 'How much is this?', 'Shopping & Akihabara', 'Japanese', 2],
  ['おすすめは何ですか？', 'Osusume wa nan desu ka?', 'What do you recommend?', 'Ramen & Izakaya', 'Japanese', 2],
  ['日本語を勉強中なんです', 'Nihongo o benkyō-chū nan desu', 'I am currently studying Japanese', 'Introductions & Etiquette', 'Japanese', 2],
  ['もう一回言ってください', 'Mō ikkai itte kudasai', 'Please say that one more time', 'Introductions & Etiquette', 'Japanese', 1],

  // Chinese
  ['你好', 'nǐ hǎo', 'Hello / Hi', 'Introductions', 'Chinese (Mandarin)', 3],
  ['很高兴认识你', 'hěn gāoxìng rènshí nǐ', 'Nice to meet you', 'Introductions', 'Chinese (Mandarin)', 2],
  ['老板，来一碗牛肉面', 'lǎobǎn, lái yī wǎn niúròumiàn', 'Boss, one bowl of beef noodles', 'Ordering food', 'Chinese (Mandarin)', 2],
  ['不要辣', 'bù yào là', 'Not spicy / no chili', 'Ordering food', 'Chinese (Mandarin)', 1],
  ['太贵了，便宜点吧', 'tài guì le, piányi diǎn ba', 'Too expensive, cheaper please', 'Shopping & Bargaining', 'Chinese (Mandarin)', 2],
  ['慢慢来', 'mànmàn lái', 'Take it slow', 'Introductions', 'Chinese (Mandarin)', 1],

  // Spanish
  ['¡Hola! ¿Cómo estás?', 'OH-lah KOH-moh ehs-TAHS', 'Hello! How are you?', 'Introductions', 'Spanish', 2],
  ['Me gusta mucho la música', 'meh GOOS-tah MOO-choh lah MOO-see-kah', 'I really like music', 'Daily Life & Plans', 'Spanish', 2],
  ['Una ración de patatas bravas, por favor', 'OO-nah rah-SYOHN deh pah-TAH-tahs BRAH-vahs', 'A portion of patatas bravas, please', 'Tapas & Drinks', 'Spanish', 1],
  ['¿La cuenta, por favor?', 'lah KWEHN-tah por fah-VOR', 'The check, please?', 'Tapas & Drinks', 'Spanish', 2],
  ['¿Cuánto cuesta esto?', 'KWAHN-toh KWEHS-tah EHS-toh', 'How much does this cost?', 'Market & Shopping', 'Spanish', 1],

  // French
  ['Bonjour, enchanté !', 'bohn-zhoor ahn-shahn-tay', 'Hello, nice to meet you!', 'Introductions', 'French', 2],
  ['Un café crème et un croissant, s\'il vous plaît', 'uhn kah-fay krehm ay uhn krwah-sahn', 'A café au lait and croissant, please', 'Café & Boulangerie', 'French', 2],
  ['L\'addition, s\'il vous plaît', 'lah-dee-syohn seel voo play', 'The check, please', 'Café & Boulangerie', 'French', 1],
  ['Je suis un peu fatigué aujourd\'hui', 'zhuh swee z-uhn puh fah-tee-gay', 'I\'m a little tired today', 'Daily routine', 'French', 2],

  // German
  ['Guten Tag! Freut mich', 'GOO-ten tahk froyt miçh', 'Good day! Pleased to meet you', 'Introductions', 'German', 2],
  ['Eine Brezel und einen Kaffee, bitte', 'EYE-nuh BRAY-tsel oont EYE-nen KAH-fay', 'A pretzel and a coffee, please', 'Bakery & Biergarten', 'German', 2],
  ['Die Rechnung, bitte', 'dee REÇH-noong BIH-tuh', 'The bill, please', 'Bakery & Biergarten', 'German', 1],
  ['Wie komme ich zum Hauptbahnhof?', 'vee KOM-muh içh tsoom HOWPT-bahn-hof', 'How do I get to central station?', 'Trains & Directions', 'German', 1],

  // Korean
  ['안녕하세요! 반갑습니다', 'Annyeonghaseyo! Bangapseumnida', 'Hello! Nice to meet you', 'Introductions', 'Korean', 2],
  ['이모, 떡볶이 1인분 주세요', 'Imo, tteokbokki il-inbun juseyo', 'Auntie, one serving of tteokbokki please', 'K-Food & Bunsik', 'Korean', 2],
  ['계산해 주세요', 'Gyesan-hae juseyo', 'Check please', 'K-Food & Bunsik', 'Korean', 1],
  ['강남역으로 가주세요', 'Gangnam-yeok-euro gajuseyo', 'Please take me to Gangnam Station', 'Subway & Taxis', 'Korean', 1],

  // English
  ['Nice to meet you!', 'Natural intro', 'Pleased to meet you', 'Introductions & Networking', 'English', 2],
  ['Can I get a coffee to go, please?', 'Casual order', 'Ordering takeout coffee', 'Coffee & Diners', 'English', 2],
  ['Could you repeat that slower?', 'Clarification', 'Asking to repeat', 'Introductions & Networking', 'English', 1]
];

const insertInit = db.prepare(`
  INSERT OR IGNORE INTO vocabulary (zh, pinyin, en, topic, language, times_practiced, user_id)
  VALUES (?, ?, ?, ?, ?, ?, 1)
`);
for (const s of starters) {
  insertInit.run(s[0], s[1], s[2], s[3], s[4], s[5]);
}

// Database helper functions
const dbService = {
  // --- AUTHENTICATION ---
  register(username, password, name = 'Learner') {
    const cleanUser = (username || '').trim().toLowerCase();
    if (!cleanUser || cleanUser.length < 3) throw new Error('Username must be at least 3 characters.');
    if (!password || password.length < 4) throw new Error('Password must be at least 4 characters.');

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUser);
    if (existing) throw new Error('Username is already taken. Please choose another.');

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const today = new Date().toISOString().slice(0, 10);

    const result = db.prepare(`
      INSERT INTO users (username, password_hash, salt, name, target_lang, level, streak_days, minutes_practiced, calls_completed, last_active_date)
      VALUES (?, ?, ?, ?, 'Japanese', 'Beginner', 1, 0, 0, ?)
    `).run(cleanUser, passwordHash, salt, (name || cleanUser).trim(), today);

    const userId = Number(result.lastInsertRowid);
    const token = crypto.randomUUID();
    db.prepare('INSERT INTO user_tokens (token, user_id) VALUES (?, ?)').run(token, userId);

    return { token, user: this.getUserById(userId) };
  },

  login(username, password) {
    const cleanUser = (username || '').trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(cleanUser);
    if (!user) throw new Error('Invalid username or password.');

    const computed = hashPassword(password, user.salt);
    if (computed !== user.password_hash) throw new Error('Invalid username or password.');

    const token = crypto.randomUUID();
    db.prepare('INSERT INTO user_tokens (token, user_id) VALUES (?, ?)').run(token, user.id);

    return { token, user: this.getUserById(user.id) };
  },

  getUserByToken(token) {
    if (!token) return null;
    const row = db.prepare(`
      SELECT u.id, u.username, u.name, u.target_lang, u.level, u.streak_days, u.minutes_practiced, u.calls_completed, u.last_active_date, u.created_at
      FROM user_tokens t
      JOIN users u ON u.id = t.user_id
      WHERE t.token = ?
    `).get(token);
    return row || null;
  },

  getUserById(id) {
    const row = db.prepare(`
      SELECT id, username, name, target_lang, level, streak_days, minutes_practiced, calls_completed, last_active_date, created_at
      FROM users WHERE id = ?
    `).get(id);
    return row || null;
  },

  logout(token) {
    if (token) {
      db.prepare('DELETE FROM user_tokens WHERE token = ?').run(token);
    }
    return true;
  },

  // --- PROFILE & STATS ---
  getProfile(userId = 1) {
    let user = this.getUserById(userId);
    if (!user) user = this.getUserById(1);

    const stats = {
      totalVocab: db.prepare('SELECT COUNT(*) as c FROM vocabulary WHERE user_id = ? OR user_id = 1').get(userId).c,
      masteredVocab: db.prepare('SELECT COUNT(*) as c FROM vocabulary WHERE (user_id = ? OR user_id = 1) AND mastered = 1').get(userId).c,
      totalMistakes: db.prepare('SELECT COUNT(*) as c FROM mistakes WHERE user_id = ?').get(userId).c,
      unreviewedMistakes: db.prepare('SELECT COUNT(*) as c FROM mistakes WHERE user_id = ? AND reviewed = 0').get(userId).c,
      totalSessions: db.prepare('SELECT COUNT(*) as c FROM sessions WHERE user_id = ?').get(userId).c
    };

    // Check streak
    const today = new Date().toISOString().slice(0, 10);
    if (user && user.last_active_date) {
      const last = new Date(user.last_active_date);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        db.prepare('UPDATE users SET streak_days = streak_days + 1, last_active_date = ? WHERE id = ?').run(today, userId);
        user.streak_days += 1;
        user.last_active_date = today;
      } else if (diffDays > 1) {
        db.prepare('UPDATE users SET streak_days = 1, last_active_date = ? WHERE id = ?').run(today, userId);
        user.streak_days = 1;
        user.last_active_date = today;
      }
    }

    return { ...user, ...stats };
  },

  updateProfile(userId = 1, { name, level, target_lang }) {
    if (name !== undefined) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, userId);
    if (level !== undefined) db.prepare('UPDATE users SET level = ? WHERE id = ?').run(level, userId);
    if (target_lang !== undefined) db.prepare('UPDATE users SET target_lang = ? WHERE id = ?').run(target_lang, userId);
    return this.getProfile(userId);
  },

  // --- SESSIONS ---
  startSession(userId = 1, id, topic, level, language = 'Japanese') {
    db.prepare(`
      INSERT INTO sessions (id, user_id, topic, level, language, started_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(id, userId, topic, level, language);
    return { id, user_id: userId, topic, level, language };
  },

  saveMessage(sessionId, { role, zh, pinyin, en, fix, language: msgLang }, userId = 1) {
    db.prepare(`
      INSERT INTO messages (session_id, role, zh, pinyin, en, fix)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, role, zh || '', pinyin || '', en || '', fix || '');

    db.prepare('UPDATE sessions SET turns_count = turns_count + 1 WHERE id = ?').run(sessionId);

    const session = db.prepare('SELECT topic, language, user_id FROM sessions WHERE id = ?').get(sessionId) || {};
    const topic = session.topic || 'General';
    const language = msgLang || session.language || 'Japanese';
    const effectiveUserId = session.user_id || userId || 1;

    // Only record mistake into Mistake Bank if user actually spoke and tutor roasted an error
    if (role === 'assistant' && fix && fix.trim().length > 0) {
      const lastUser = db.prepare(`
        SELECT zh FROM messages 
        WHERE session_id = ? AND role = 'user' 
        ORDER BY id DESC LIMIT 1
      `).get(sessionId);

      const userInput = lastUser ? lastUser.zh : '';
      if (userInput && userInput.trim().length > 0) {
        db.prepare(`
          INSERT INTO mistakes (user_id, session_id, user_input, correction, explanation, pinyin, language)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(effectiveUserId, sessionId, userInput, zh || '', fix, pinyin || '', language);
      }
    }

    // Save target phrase to vocabulary
    if (role === 'assistant' && zh && zh.trim().length > 0 && zh.length <= 60) {
      db.prepare(`
        INSERT INTO vocabulary (user_id, zh, pinyin, en, topic, language)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(zh) DO UPDATE SET
          times_practiced = times_practiced + 1,
          last_practiced = CURRENT_TIMESTAMP
      `).run(effectiveUserId, zh, pinyin || '', en || '', topic, language);
    }
  },

  endSession(sessionId, { score, feedback, durationSeconds }, userId = 1) {
    const dur = Math.max(0, parseInt(durationSeconds, 10) || 0);
    const mins = Math.ceil(dur / 60);

    db.prepare(`
      UPDATE sessions 
      SET ended_at = datetime('now'),
          duration_seconds = ?,
          score = ?,
          feedback = ?
      WHERE id = ?
    `).run(dur, score != null ? score : 0, feedback || '', sessionId);

    const session = db.prepare('SELECT user_id FROM sessions WHERE id = ?').get(sessionId) || {};
    const effectiveUserId = session.user_id || userId || 1;

    // Update user minutes and calls count
    db.prepare(`
      UPDATE users 
      SET minutes_practiced = minutes_practiced + ?,
          calls_completed = calls_completed + 1,
          last_active_date = date('now')
      WHERE id = ?
    `).run(mins, effectiveUserId);

    return db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
  },

  getRecentSessions(userId = 1, limit = 10) {
    const sessions = db.prepare('SELECT * FROM sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT ?').all(userId, limit);
    return sessions.map(s => {
      const messages = db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY id ASC').all(s.id);
      return { ...s, messages };
    });
  },

  // --- PHRASEBOOK / VOCABULARY ---
  getVocabulary(userId = 1, topicFilter, langFilter) {
    let query = 'SELECT * FROM vocabulary WHERE (user_id = ? OR user_id = 1)';
    const params = [userId];
    if (topicFilter && topicFilter !== 'All') {
      query += ' AND topic = ?';
      params.push(topicFilter);
    }
    if (langFilter && langFilter !== 'All') {
      query += ' AND (language = ? OR language IS NULL)';
      params.push(langFilter);
    }
    query += ' ORDER BY last_practiced DESC';
    return db.prepare(query).all(...params);
  },

  toggleVocabMastered(id) {
    db.prepare('UPDATE vocabulary SET mastered = CASE WHEN mastered = 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
    return db.prepare('SELECT * FROM vocabulary WHERE id = ?').get(id);
  },

  addVocabulary(userId = 1, { zh, pinyin, en, topic, language }) {
    const lang = language || 'Japanese';
    db.prepare(`
      INSERT INTO vocabulary (user_id, zh, pinyin, en, topic, language)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(zh) DO UPDATE SET
        pinyin = excluded.pinyin,
        en = excluded.en,
        times_practiced = times_practiced + 1,
        last_practiced = CURRENT_TIMESTAMP
    `).run(userId, zh, pinyin, en, topic || 'Custom', lang);
    return db.prepare('SELECT * FROM vocabulary WHERE zh = ?').get(zh);
  },

  // --- MISTAKE BANK ---
  getMistakes(userId = 1, filter, langFilter) {
    let query = 'SELECT * FROM mistakes WHERE user_id = ?';
    const params = [userId];
    if (filter === 'unreviewed') {
      query += ' AND reviewed = 0';
    } else if (filter === 'reviewed') {
      query += ' AND reviewed = 1';
    }
    if (langFilter && langFilter !== 'All') {
      query += ' AND (language = ? OR language IS NULL)';
      params.push(langFilter);
    }
    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params);
  },

  toggleMistakeReviewed(id) {
    db.prepare('UPDATE mistakes SET reviewed = CASE WHEN reviewed = 1 THEN 0 ELSE 1 END WHERE id = ?').run(id);
    return db.prepare('SELECT * FROM mistakes WHERE id = ?').get(id);
  }
};

module.exports = dbService;
