// Tingo Database using Node native node:sqlite
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
    language TEXT DEFAULT 'Chinese (Mandarin)',
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
    language TEXT DEFAULT 'Chinese (Mandarin)',
    reviewed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vocabulary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    zh TEXT UNIQUE,
    pinyin TEXT,
    en TEXT,
    topic TEXT,
    language TEXT DEFAULT 'Chinese (Mandarin)',
    mastered INTEGER DEFAULT 0,
    times_practiced INTEGER DEFAULT 1,
    last_practiced TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe column migrations for existing databases
try { db.exec(`ALTER TABLE vocabulary ADD COLUMN language TEXT DEFAULT 'Chinese (Mandarin)'`); } catch (e) {}
try { db.exec(`ALTER TABLE mistakes ADD COLUMN language TEXT DEFAULT 'Chinese (Mandarin)'`); } catch (e) {}
try { db.exec(`ALTER TABLE sessions ADD COLUMN language TEXT DEFAULT 'Chinese (Mandarin)'`); } catch (e) {}

// Populate starter vocabulary for all languages
const starters = [
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

  // Japanese
  ['こんにちは、初めまして', 'Konnichiwa, hajimemashite', 'Hello, nice to meet you', 'Introductions & Etiquette', 'Japanese', 2],
  ['豚骨ラーメン味玉付きでお願いします', 'Tonkotsu rāmen ajitama-tsuki de onegaishimasu', 'Tonkotsu ramen with soft-boiled egg please', 'Ramen & Izakaya', 'Japanese', 2],
  ['お会計をお願いします', 'O-kaikei o onegaishimasu', 'The bill, please', 'Ramen & Izakaya', 'Japanese', 1],
  ['駅はどちらですか？', 'Eki wa dochira desu ka?', 'Which way is the station?', 'Trains & Tokyo Navigation', 'Japanese', 1],

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
  INSERT OR IGNORE INTO vocabulary (zh, pinyin, en, topic, language, times_practiced)
  VALUES (?, ?, ?, ?, ?, ?)
`);
for (const s of starters) {
  insertInit.run(s[0], s[1], s[2], s[3], s[4], s[5]);
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
        db.prepare('UPDATE profile SET streak_days = streak_days + 1, last_active_date = ? WHERE id = 1').run(today);
        profile.streak_days += 1;
        profile.last_active_date = today;
      } else if (diffDays > 1) {
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

  startSession(id, topic, level, language = 'Chinese (Mandarin)') {
    db.prepare(`
      INSERT INTO sessions (id, topic, level, language, started_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run(id, topic, level, language);
    return { id, topic, level, language };
  },

  saveMessage(sessionId, { role, zh, pinyin, en, fix }) {
    db.prepare(`
      INSERT INTO messages (session_id, role, zh, pinyin, en, fix)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(sessionId, role, zh || '', pinyin || '', en || '', fix || '');

    db.prepare('UPDATE sessions SET turns_count = turns_count + 1 WHERE id = ?').run(sessionId);

    const session = db.prepare('SELECT topic, language FROM sessions WHERE id = ?').get(sessionId) || {};
    const topic = session.topic || 'General';
    const language = session.language || 'Chinese (Mandarin)';

    // If AI gave a fix / correction, record into mistakes bank
    if (role === 'assistant' && fix && fix.trim().length > 0) {
      const lastUser = db.prepare(`
        SELECT zh FROM messages 
        WHERE session_id = ? AND role = 'user' 
        ORDER BY id DESC LIMIT 1
      `).get(sessionId);

      const userInput = lastUser ? lastUser.zh : '';
      db.prepare(`
        INSERT INTO mistakes (session_id, user_input, correction, explanation, pinyin, language)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(sessionId, userInput, zh || '', fix, pinyin || '', language);
    }

    // Save target phrase to vocabulary
    if (role === 'assistant' && zh && zh.trim().length > 0 && zh.length <= 60) {
      db.prepare(`
        INSERT INTO vocabulary (zh, pinyin, en, topic, language)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(zh) DO UPDATE SET
          times_practiced = times_practiced + 1,
          last_practiced = CURRENT_TIMESTAMP
      `).run(zh, pinyin || '', en || '', topic, language);
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

  getVocabulary(topicFilter, langFilter) {
    let query = 'SELECT * FROM vocabulary WHERE 1=1';
    const params = [];
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

  addVocabulary({ zh, pinyin, en, topic, language }) {
    const lang = language || 'Chinese (Mandarin)';
    db.prepare(`
      INSERT INTO vocabulary (zh, pinyin, en, topic, language)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(zh) DO UPDATE SET
        pinyin = excluded.pinyin,
        en = excluded.en,
        times_practiced = times_practiced + 1,
        last_practiced = CURRENT_TIMESTAMP
    `).run(zh, pinyin, en, topic || 'Custom', lang);
    return db.prepare('SELECT * FROM vocabulary WHERE zh = ?').get(zh);
  },

  getMistakes(filter, langFilter) {
    let query = 'SELECT * FROM mistakes WHERE 1=1';
    const params = [];
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
  },

  getRecentSessions(limit = 10) {
    const sessions = db.prepare('SELECT * FROM sessions ORDER BY started_at DESC LIMIT ?').all(limit);
    return sessions.map(s => {
      const messages = db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY id ASC').all(s.id);
      return { ...s, messages };
    });
  }
};

module.exports = dbService;
