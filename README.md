# Tinguin AI 🎙️
> Speak Fearlessly. Roast Your Way to Fluency.

Tinguin is a multilingual voice-call language learning platform with savage, witty native AI tutors who laugh at your mistakes, roast bad grammar, and push you into real conversational fluency through tough love.

## Features
- **Real-Time Voice Phone Calls**: Immersive phone-call interface with real-time speech recognition (STT), natural native speech synthesis (TTS), text input fallback, and live orb indicator.
- **Multilingual Support (7 Languages)**:
  - 🇯🇵 **Japanese (Kenji 健二)**: Sarcastic Tokyoite who laughs at anime-cringe Japanese and stiff keigo blunders.
  - 🇨🇳 **Chinese (Lao Li 老李)**: Savage Beijing uncle who roasts butchered tones and robotic phrasing.
  - 🇪🇸 **Spanish (Mateo)**: Theatrical Madrid roastmaster who roasts flat English vowels.
  - 🇫🇷 **French (Camille)**: Snarky Parisian tutor who winces at bad pronunciation until it's flawless.
  - 🇩🇪 **German (Hans)**: Deadpan Berlin cynic who treats bad grammar as a criminal offense.
  - 🇰🇷 **Korean (Min-jun)**: Sassy Seoul local who roasts textbook awkwardness.
  - 🇺🇸 **English (Coach Sarah)**: Brutally sarcastic New Yorker eliminating robotic textbook lines.
- **Persistent SQLite Database (`tingo.db`)**: Powered by Node native `node:sqlite`:
  - **Profile & Daily Streak**: Tracks consecutive days practiced and total speaking minutes.
  - **Mistake Bank**: Automatically logs every slip-up roasted during conversations with audio, corrections, readings, and a "Mark as Mastered" review workflow.
  - **Saved Phrasebook**: Core expressions taught during calls with normal and slow audio playback.
  - **Session History & Progress**: Records conversation scores, duration, turns count, and tutor verdicts.
- **Original T-Microphone Logo & Editorial Design**: Dark espresso squircle with serif T-microphone and acoustic waves, Instrument Serif typography, warm tones, and dark mode.

## Quick Start
1. Ensure Node.js 18+ (Node 24 recommended) is installed.
2. Verify `.env` contains your `GROQ_API_KEY`.
3. Double-click `start.bat` (or run `node server.js` / `npm start`).
4. Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge.
