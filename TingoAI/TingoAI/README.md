# Tingo AI 🎙️
> Inspired by Pingo AI — Learn Mandarin Chinese by speaking with Lao Li, your witty AI tutor.

## Features (Inspired by Pingo AI)
- **Real-Time Phone Call with Lao Li**: Audio call experience with live speech recognition, natural voice synthesis (TTS), text input fallback, and an animated orb.
- **Persistent SQLite Database (`tingo.db`)**: Powered by Node 24 native `node:sqlite` (zero npm dependencies):
  - **Profile & Daily Streak**: Tracks consecutive days practiced and total speaking minutes.
  - **Mistake Bank ("Pick up where you left off")**: Automatically logs every error Lao Li spots during conversations with his witty roast, the correction, pinyin, and a "Mark as Mastered" review workflow.
  - **Phrasebook & Vocabulary**: Auto-saves target expressions taught in calls, complete with pinyin, English meaning, and normal/slow audio playback.
  - **Session History**: Records every conversation score (out of 10), duration, turns count, and feedback.
- **Interactive Scenario Cards**: Quick-jump into realistic Chinese conversational situations:
  - Day one in Chinese (Introductions)
  - Street food in Chengdu (Ordering Food)
  - Bargaining at the Silk Market (Shopping)
  - Taking a taxi in Beijing (Directions)
  - Saying what you like (Daily banter)
  - Casual chat & free talk
- **Original Warm Editorial Theme**: Kept 100% faithful to Tingo's warm serif typography (`Instrument Serif`), clean sans body (`Hanken Grotesk`), paper tones (`#fbfaf8`), warm brown accents (`#6b4a33`), and dark mode support.
- **Robust Model Fallback**: Primary model `openai/gpt-oss-120b` with automatic fallback to `qwen/qwen3.8-27b` via Groq.

## Quick Start
1. Ensure Node.js 18+ (Node 24 recommended) is installed.
2. Verify `.env` contains your `GROQ_API_KEY`.
3. Double-click `start.bat` (or run `node server.js` / `npm start`).
4. Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge.
