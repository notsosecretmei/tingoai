// Tingo AI - Client Application Logic
// Complete conversational multilingual learning platform

const LEVELS = ["Beginner", "Elementary", "Intermediate", "Advanced"];

// Multilingual Configurations
const LANGUAGES = {
  zh: {
    id: "zh",
    name: "Chinese (Mandarin)",
    flag: "🇨🇳",
    code: "zh-CN",
    tutor: "Lao Li 老李",
    tutorAvatar: "李",
    callBtn: "Call Lao Li",
    subhead: "Learn Chinese by phone call with Lao Li — a sharp-tongued, witty tutor who will not go easy on you.",
    phoneticLabel: "Pinyin",
    personality: "sharp-tongued, witty, dry, teasing, never coddles. Playfully roast errors, explain corrections with pinyin, and demand active speaking.",
    greetings: [
      { text: "你好", sub: "Nǐ hǎo", en: "Hello" },
      { text: "早上好", sub: "Zǎoshang hǎo", en: "Good morning" },
      { text: "吃了没？", sub: "Chīle méi?", en: "Have you eaten?" },
      { text: "慢慢来", sub: "Mànmàn lái", en: "Take it slow" }
    ],
    topics: [
      "Ordering food",
      "Introductions",
      "Shopping & Bargaining",
      "Directions & Taxis",
      "Daily banter",
      "Travel & Hotel",
      "Free talk"
    ],
    scenarios: [
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Chinese",
        userMsg: "Hi! I want to learn Chinese.",
        tutorMsg: "你好！Let's start simple: how to introduce yourself. We'll go 慢慢来 — slowly.",
        topic: "Introductions"
      },
      {
        tag: "Ordering Food",
        level: "Elementary",
        title: "Street food in Chengdu",
        userMsg: "老板，来一碗牛肉面。",
        tutorMsg: "Good, but don't forget 不要辣 (not spicy) unless you want your tongue on fire!",
        topic: "Ordering food"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Bargaining at Silk Market",
        userMsg: "太贵了，能不能便宜一点？",
        tutorMsg: "Now say it like you mean it: 便宜点吧！Look them in the eye.",
        topic: "Shopping & Bargaining"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Taking a taxi in Beijing",
        userMsg: "师傅，请去三里屯。",
        tutorMsg: "The driver asks if you want the highway. Answer: 走高速 or 不走高速.",
        topic: "Directions & Taxis"
      },
      {
        tag: "Daily Banter",
        level: "Beginner",
        title: "Saying what you like",
        userMsg: "我喜欢喝茶。",
        tutorMsg: "Today let's practice saying what you like. Start with: 我喜欢... Tell me one thing you like.",
        topic: "Daily banter"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual chat with Lao Li",
        userMsg: "今天工作有点累。",
        tutorMsg: "What happened today? Don't think in English first — speak directly in Chinese: 今天...",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "再慢一点 (Could you speak slower?)", label: "🐢 再慢一点 (Slower)" },
      { text: "这是什么意思？ (What does that mean?)", label: "❓ 这是什么意思？ (Meaning)" },
      { text: "请再说一遍 (Please repeat that)", label: "🔁 请再说一遍 (Repeat)" },
      { text: "我不太明白 (I don't quite understand)", label: "🤔 我不太明白 (Don't get it)" }
    ]
  },

  es: {
    id: "es",
    name: "Spanish",
    flag: "🇪🇸",
    code: "es-ES",
    tutor: "Mateo",
    tutorAvatar: "M",
    callBtn: "Call Mateo",
    subhead: "Learn Spanish by phone call with Mateo — a passionate, witty Madrid tutor who hates robotic textbook Spanish.",
    phoneticLabel: "Pronunciation & Tip",
    personality: "passionate, fast-talking, playful, witty Madrid tutor. Teases English speakers who translate word-for-word. Pushes you to roll your R's and sound natural.",
    greetings: [
      { text: "¡Hola!", sub: "OH-lah", en: "Hello!" },
      { text: "¿Qué tal?", sub: "keh TAHL", en: "How's it going?" },
      { text: "Buenos días", sub: "BWEH-nos DEE-as", en: "Good morning" },
      { text: "Poco a poco", sub: "POH-ko ah POH-ko", en: "Little by little" }
    ],
    topics: [
      "Tapas & Drinks",
      "Introductions",
      "Market & Shopping",
      "Getting Around",
      "Daily Life & Plans",
      "Travel in Spain/LatAm",
      "Free talk"
    ],
    scenarios: [
      {
        tag: "Daily Life",
        level: "Beginner",
        title: "Saying what you like in Spanish",
        userMsg: "Me gusta la música.",
        tutorMsg: "¡Perfecto! Start with: Me gusta... Now tell me one thing you actually hate doing.",
        topic: "Daily Life & Plans"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Madrid",
        userMsg: "Hola, me llamo Alex y quiero aprender español.",
        tutorMsg: "¡Bienvenido! Let's get past 'Hola': tell me where you're from and why you're here.",
        topic: "Introductions"
      },
      {
        tag: "Food & Drinks",
        level: "Elementary",
        title: "Ordering tapas in Seville",
        userMsg: "Una ración de patatas bravas y una caña, por favor.",
        tutorMsg: "¡Eso es! But ask if the sauce is spicy: ¿La salsa pica mucho?",
        topic: "Tapas & Drinks"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Bargaining at El Rastro",
        userMsg: "¿Cuánto cuesta esta chaqueta? ¿Me hace un descuento?",
        tutorMsg: "Good boldness! Now say: ¿Me lo deja en veinte euros?",
        topic: "Market & Shopping"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Asking directions in Barcelona",
        userMsg: "Disculpe, ¿dónde está la parada de metro más cercana?",
        tutorMsg: "Sigue todo recto y gira a la derecha en la segunda calle.",
        topic: "Getting Around"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual banter with Mateo",
        userMsg: "El fin de semana salí con unos amigos.",
        tutorMsg: "¡Cuéntame el chisme! ¿Adónde fueron y qué tal la pasaron?",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "¿Puedes hablar más despacio? (Could you speak slower?)", label: "🐢 Más despacio (Slower)" },
      { text: "¿Qué significa eso? (What does that mean?)", label: "❓ ¿Qué significa? (Meaning)" },
      { text: "¿Puedes repetir, por favor? (Please repeat)", label: "🔁 Repetir (Repeat)" },
      { text: "No entiendo bien (I don't quite understand)", label: "🤔 No entiendo (Don't get it)" }
    ]
  },

  fr: {
    id: "fr",
    name: "French",
    flag: "🇫🇷",
    code: "fr-FR",
    tutor: "Camille",
    tutorAvatar: "C",
    callBtn: "Call Camille",
    subhead: "Learn French by phone call with Camille — an elegant, cheeky Parisian tutor who will get you speaking with charm.",
    phoneticLabel: "Pronunciation & Liaison",
    personality: "elegant, Parisian, cheeky, witty. Teases bad vowel sounds playfully, strictly refuses robotic textbook phrasing, and teaches how French people actually speak.",
    greetings: [
      { text: "Bonjour !", sub: "bohn-zhoor", en: "Hello!" },
      { text: "Ça va ?", sub: "sah vah", en: "How are you?" },
      { text: "Enchanté", sub: "ahn-shahn-tay", en: "Nice to meet you" },
      { text: "On y va !", sub: "ohn ee vah", en: "Let's go!" }
    ],
    topics: [
      "Café & Boulangerie",
      "Introductions",
      "Shopping & Boutiques",
      "Paris Metro & Directions",
      "Daily routine",
      "Travel in France",
      "Free talk"
    ],
    scenarios: [
      {
        tag: "Daily Life",
        level: "Beginner",
        title: "Talking about your day in French",
        userMsg: "Je suis fatigué.",
        tutorMsg: "Ah, comme tout le monde à Paris ! Tell me why: J'ai trop travaillé aujourd'hui.",
        topic: "Daily routine"
      },
      {
        tag: "Café",
        level: "Beginner",
        title: "Ordering at a Parisian café",
        userMsg: "Un café crème et un croissant, s'il vous plaît.",
        tutorMsg: "Très bien ! Now ask for the bill with confidence: L'addition, s'il vous plaît.",
        topic: "Café & Boulangerie"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in French",
        userMsg: "Bonjour ! Je m'appelle Sam et je viens de Londres.",
        tutorMsg: "Enchantée Sam ! Now tell me what you do for a living in one sentence.",
        topic: "Introductions"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Boutique on the Left Bank",
        userMsg: "C'est un peu trop cher, vous avez autre chose ?",
        tutorMsg: "Direct and honest! Say: Est-ce que vous avez une taille au-dessus ?",
        topic: "Shopping & Boutiques"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Navigating the Paris Metro",
        userMsg: "Pardon, où se trouve la correspondance pour la ligne 4 ?",
        tutorMsg: "Prenez le couloir à gauche, puis descendez les escaliers.",
        topic: "Paris Metro & Directions"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual chat with Camille",
        userMsg: "Qu'est-ce que tu me recommandes de visiter à Paris ?",
        tutorMsg: "Évite la tour Eiffel à midi ! Va plutôt te balader au canal Saint-Martin.",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "Plus lentement, s'il vous plaît (Slower please)", label: "🐢 Plus lentement (Slower)" },
      { text: "Qu'est-ce que ça veut dire ? (What does that mean?)", label: "❓ Ça veut dire quoi ? (Meaning)" },
      { text: "Répétez, s'il vous plaît (Please repeat)", label: "🔁 Répétez (Repeat)" },
      { text: "Je ne comprends pas (I don't understand)", label: "🤔 Pas compris (Don't get it)" }
    ]
  },

  de: {
    id: "de",
    name: "German",
    flag: "🇩🇪",
    code: "de-DE",
    tutor: "Hans",
    tutorAvatar: "H",
    callBtn: "Call Hans",
    subhead: "Learn German by phone call with Hans — direct, dry Berlin humor, razor-sharp on grammar, but warm at heart.",
    phoneticLabel: "Pronunciation & Case",
    personality: "direct, dry Berlin humor, razor-sharp on der/die/das and cases. Values precision, praises efficiency, roasts convoluted sentences.",
    greetings: [
      { text: "Hallo!", sub: "HAH-loh", en: "Hello!" },
      { text: "Guten Tag", sub: "GOO-ten TAHK", en: "Good day" },
      { text: "Wie geht's?", sub: "vee GAYTS", en: "How are you?" },
      { text: "Alles klar!", sub: "AH-les KLAHR", en: "All good!" }
    ],
    topics: [
      "Bakery & Biergarten",
      "Introductions",
      "Shopping & Supermarket",
      "Trains & Directions",
      "Work & Daily Routine",
      "Travel in Germany",
      "Free talk"
    ],
    scenarios: [
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Berlin",
        userMsg: "Hallo, ich heiße Jordan und lerne Deutsch.",
        tutorMsg: "Freut mich! Und warum Deutsch? Mach einen schnellen Satz daraus.",
        topic: "Introductions"
      },
      {
        tag: "Bakery",
        level: "Beginner",
        title: "At the Munich bakery",
        userMsg: "Ich hätte gerne zwei Brötchen und eine Brezel, bitte.",
        tutorMsg: "Sehr ordentlich. Und zum Mitnehmen: 'Zum Mitnehmen, bitte.'",
        topic: "Bakery & Biergarten"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Catching the S-Bahn",
        userMsg: "Entschuldigung, auf welchem Gleis fährt der Zug nach Potsdam ab?",
        tutorMsg: "Gleis drei, aber beeil dich — die DB wartet auf niemanden!",
        topic: "Trains & Directions"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "At the flea market (Flohmarkt)",
        userMsg: "Kann man am Preis noch etwas machen?",
        tutorMsg: "Direkt auf den Punkt. Schlage zehn Euro vor: 'Für zehn nehme ich es.'",
        topic: "Shopping & Supermarket"
      },
      {
        tag: "Daily Routine",
        level: "Beginner",
        title: "Talking about your day",
        userMsg: "Heute war die Arbeit ziemlich anstrengend.",
        tutorMsg: "Klassischer Montag. Sag mir, woran es lag: 'Zu viele Meetings.'",
        topic: "Work & Daily Routine"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual banter with Hans",
        userMsg: "Was hältst du von der Berliner U-Bahn?",
        tutorMsg: "Laut, dreckig, aber fährt alle drei Minuten. Was will man mehr?",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "Bitte etwas langsamer sprechen (A bit slower please)", label: "🐢 Langsamer (Slower)" },
      { text: "Was bedeutet das? (What does that mean?)", label: "❓ Was bedeutet das? (Meaning)" },
      { text: "Können Sie das wiederholen? (Can you repeat?)", label: "🔁 Wiederholen (Repeat)" },
      { text: "Ich verstehe das nicht (I don't understand)", label: "🤔 Nicht verstanden (Don't get it)" }
    ]
  },

  ja: {
    id: "ja",
    name: "Japanese",
    flag: "🇯🇵",
    code: "ja-JP",
    tutor: "Kenji 健二",
    tutorAvatar: "健",
    callBtn: "Call Kenji",
    subhead: "Learn Japanese by phone call with Kenji — a Tokyo native who teaches real, natural speech instead of stiff textbook lines.",
    phoneticLabel: "Romaji / Reading",
    personality: "warm, polite yet playfully teasing, Tokyo native. Teaches real spoken Japanese, naturally blending casual speech and keigo etiquette without the stiff textbook phrases.",
    greetings: [
      { text: "こんにちは", sub: "Konnichiwa", en: "Hello" },
      { text: "おはようございます", sub: "Ohayō gozaimasu", en: "Good morning" },
      { text: "お疲れ様です", sub: "Otsukaresama desu", en: "Good work today" },
      { text: "よろしく！", sub: "Yoroshiku!", en: "Nice to meet you" }
    ],
    topics: [
      "Ramen & Izakaya",
      "Introductions & Etiquette",
      "Shopping & Akihabara",
      "Trains & Tokyo Navigation",
      "Daily Routine & Anime",
      "Travel in Japan",
      "Free talk"
    ],
    scenarios: [
      {
        tag: "Interview",
        level: "Intermediate",
        title: "A Tokyo interview",
        userMsg: "おはようございます。本日はよろしくお願いいたします。",
        tutorMsg: "完璧な挨拶ですね！では自己紹介を短く一言でどうぞ。",
        topic: "Introductions & Etiquette"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Japanese",
        userMsg: "初めまして！日本語を勉強しています。",
        tutorMsg: "よろしく！ゆっくりいきましょう。何で日本語を勉強してるの？",
        topic: "Introductions & Etiquette"
      },
      {
        tag: "Ramen",
        level: "Beginner",
        title: "Ordering ramen in Shibuya",
        userMsg: "すみません、豚骨ラーメン味玉付きでお願いします。",
        tutorMsg: "いいね！麺の硬さも指定してみて: '麺硬めでお願いします！'",
        topic: "Ramen & Izakaya"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Shopping in Akihabara",
        userMsg: "これ、試してもいいですか？",
        tutorMsg: "いい質問！もし免税できるか聞くなら: '免税できますか？'",
        topic: "Shopping & Akihabara"
      },
      {
        tag: "Directions",
        level: "Elementary",
        title: "Lost in Shinjuku Station",
        userMsg: "すみません、山手線はどこですか？",
        tutorMsg: "新宿駅はダンジョンですからね！南口の改札を目指しましょう。",
        topic: "Trains & Tokyo Navigation"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual chat with Kenji",
        userMsg: "最近、日本のアニメを見ています。",
        tutorMsg: "おっ、何のアニメ？一番好きなキャラクターを教えて！",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "もう少しゆっくり話してください (Please speak a bit slower)", label: "🐢 ゆっくり (Slower)" },
      { text: "どういう意味ですか？ (What does that mean?)", label: "❓ どういう意味？ (Meaning)" },
      { text: "もう一度言ってください (Please say it once more)", label: "🔁 もう一度 (Repeat)" },
      { text: "よく分かりません (I don't really understand)", label: "🤔 分からない (Don't get it)" }
    ]
  },

  ko: {
    id: "ko",
    name: "Korean",
    flag: "🇰🇷",
    code: "ko-KR",
    tutor: "Min-jun 민준",
    tutorAvatar: "민",
    callBtn: "Call Min-jun",
    subhead: "Learn Korean by phone call with Min-jun — a lively Seoul tutor who breaks down real speech, slang, and K-drama phrasing.",
    phoneticLabel: "Romanization / Pronunciation",
    personality: "lively, witty Seoul tutor. Teases flat intonations, loves drama references, teaches real conversational Korean and banmal/jondaenmal nuances.",
    greetings: [
      { text: "안녕하세요", sub: "Annyeonghaseyo", en: "Hello" },
      { text: "반가워!", sub: "Bangawo!", en: "Nice to meet you!" },
      { text: "밥 먹었어?", sub: "Bap meogeosseo?", en: "Did you eat?" },
      { text: "천천히 해", sub: "Cheoncheonhi hae", en: "Take it slow" }
    ],
    topics: [
      "K-Food & Bunsik",
      "Introductions",
      "Shopping & Myeongdong",
      "Subway & Taxis",
      "K-Dramas & Daily Life",
      "Travel in Korea",
      "Free talk"
    ],
    scenarios: [
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Korean",
        userMsg: "Hi! I want to learn Korean.",
        tutorMsg: "반가워! Let's start simple: how to say hello: 안녕하세요! We'll go 천천히 — slowly.",
        topic: "Introductions"
      },
      {
        tag: "K-Food",
        level: "Beginner",
        title: "Street food in Hongdae",
        userMsg: "이모, 떡볶이 1인분하고 어묵 주세요.",
        tutorMsg: "발음 아주 자연스러워요! 매운 거 잘 먹어요? '덜 맵게 해주세요'도 기억해요.",
        topic: "K-Food & Bunsik"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Bargaining in Dongdaemun",
        userMsg: "조금만 깎아주세요, 서비스도 주세요!",
        tutorMsg: "오, 벌써 흥정을 알다니! 애교 섞어서: '언니, 좀만 깎아주세요~'",
        topic: "Shopping & Myeongdong"
      },
      {
        tag: "Taxi",
        level: "Intermediate",
        title: "Taking a taxi to Gangnam",
        userMsg: "기사님, 강남역 10번 출구로 가주세요.",
        tutorMsg: "네, 출발합니다! 길 막히면 '빠른 길로 가주세요'라고 말해봐요.",
        topic: "Subway & Taxis"
      },
      {
        tag: "Daily Life",
        level: "Beginner",
        title: "Talking about your day",
        userMsg: "오늘 너무 피곤했어요.",
        tutorMsg: "퇴근하고 맛있는 거 먹어야죠! 오늘 저녁 메뉴는 뭐예요?",
        topic: "K-Dramas & Daily Life"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual chat with Min-jun",
        userMsg: "요즘 한국 드라마 보고 있어요.",
        tutorMsg: "진짜요? 어떤 드라마요? 최애 배우 누구예요?",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "조금만 천천히 말해주세요 (Please speak a bit slower)", label: "🐢 천천히 (Slower)" },
      { text: "무슨 뜻이에요? (What does that mean?)", label: "❓ 무슨 뜻? (Meaning)" },
      { text: "다시 한번 말해주세요 (Please say it again)", label: "🔁 다시 한번 (Repeat)" },
      { text: "잘 모르겠어요 (I don't quite get it)", label: "🤔 모르겠어요 (Don't get it)" }
    ]
  },

  en: {
    id: "en",
    name: "English",
    flag: "🇺🇸",
    code: "en-US",
    tutor: "Coach Sarah",
    tutorAvatar: "S",
    callBtn: "Call Coach Sarah",
    subhead: "Master English by phone call with Coach Sarah — eliminating robotic phrasing, mastering natural idioms, and speaking with true confidence.",
    phoneticLabel: "Natural Phrasing & Slang",
    personality: "sharp, encouraging, witty New York coach. Eliminates robotic textbook English, teaches idiomatic speech, phrasing, and natural conversational cadence.",
    greetings: [
      { text: "Hey there!", sub: "Natural greeting", en: "Hello!" },
      { text: "How's it going?", sub: "Common check-in", en: "How are you?" },
      { text: "What's up?", sub: "Casual intro", en: "What's new?" },
      { text: "Take it easy", sub: "Relaxed phrasing", en: "Don't stress" }
    ],
    topics: [
      "Coffee & Diners",
      "Introductions & Networking",
      "Shopping & Sales",
      "Directions & City Transit",
      "Job Interviews & Work",
      "Travel & Sightseeing",
      "Free talk"
    ],
    scenarios: [
      {
        tag: "Interview",
        level: "Intermediate",
        title: "Job interview small talk",
        userMsg: "Thanks for taking the time to speak with me today.",
        tutorMsg: "Solid start! Now break the ice: 'I've been following your team's work on...'",
        topic: "Job Interviews & Work"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "First conversation in English",
        userMsg: "Hi, I'm learning English to speak with more confidence.",
        tutorMsg: "You're in the right place! Tell me one thing you're excited about this week.",
        topic: "Introductions & Networking"
      },
      {
        tag: "Diner",
        level: "Beginner",
        title: "Ordering at a New York diner",
        userMsg: "Can I get two eggs sunny-side up with sourdough toast?",
        tutorMsg: "Crisp and clear. Don't forget the bottomless coffee: 'And a refill on coffee, please.'",
        topic: "Coffee & Diners"
      },
      {
        tag: "Directions",
        level: "Elementary",
        title: "Navigating downtown",
        userMsg: "Excuse me, which way to the nearest subway entrance?",
        tutorMsg: "Head down two blocks, take a left at the pharmacy, and you're there.",
        topic: "Directions & City Transit"
      },
      {
        tag: "Daily Life",
        level: "Beginner",
        title: "Talking about your day",
        userMsg: "Work was super hectic today.",
        tutorMsg: "I hear you. Tell me what threw your schedule off: 'Back-to-back meetings all afternoon.'",
        topic: "Job Interviews & Work"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual banter with Sarah",
        userMsg: "What's your favorite thing about coaching English learners?",
        tutorMsg: "Seeing that moment where you stop translating in your head and just start talking!",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "Could you speak a little slower? (Slower please)", label: "🐢 Slower please" },
      { text: "What does that mean? (Explain phrasing)", label: "❓ What does that mean?" },
      { text: "Could you repeat that? (Please repeat)", label: "🔁 Repeat that" },
      { text: "I didn't quite catch that (Don't understand)", label: "🤔 Didn't catch that" }
    ]
  }
};

// App State
let state = {
  langId: "zh",
  level: 0,
  topic: 0,
  inCall: false,
  busy: false,
  muted: false,
  speaking: false,
  sessionId: null,
  callTimerInterval: null,
  callSeconds: 0,
  hist: [],
  sessionMistakes: [],
  sessionPhrases: [],
  currentTab: "practice",
  voices: []
};

const $ = id => document.getElementById(id);
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function currentLang() {
  return LANGUAGES[state.langId] || LANGUAGES.zh;
}

// Helper: Toast notifications
function showToast(msg) {
  const wrap = $("toast-wrap");
  if (!wrap) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

// Speech Synthesis setup
function initVoices() {
  if (!window.speechSynthesis) return;
  state.voices = speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => {
    state.voices = speechSynthesis.getVoices();
  };
}
initVoices();

function getLanguageVoice(langCode) {
  const voices = state.voices.length ? state.voices : speechSynthesis.getVoices();
  const primaryCode = langCode.split("-")[0].toLowerCase();
  const preferred = voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase());
  if (preferred) return preferred;
  return voices.find(v => v.lang.toLowerCase().startsWith(primaryCode)) || null;
}

function speakText(text, rate = 0.9, langCode = null) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) return resolve();
    speechSynthesis.cancel();

    window._currentUtterance = new SpeechSynthesisUtterance(text);
    const u = window._currentUtterance;
    const targetCode = langCode || currentLang().code;
    u.lang = targetCode;
    u.rate = rate;

    const voice = getLanguageVoice(targetCode);
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
    const timeout = Math.max(3000, (text.length / 4) * 1000 + 1200);
    setTimeout(finish, timeout);

    state.speaking = true;
    speechSynthesis.speak(u);
  });
}

// Dynamic Hero Greeting Rotation
let greetingIdx = 0;
let greetingInterval = null;
function startGreetingRotation() {
  if (greetingInterval) clearInterval(greetingInterval);
  const lang = currentLang();
  greetingIdx = 0;
  const updateGreeting = () => {
    const el = $("hero-greeting");
    if (!el || !lang.greetings.length) return;
    greetingIdx = (greetingIdx + 1) % lang.greetings.length;
    el.style.opacity = "0";
    setTimeout(() => {
      const g = lang.greetings[greetingIdx];
      el.textContent = `${g.text} (${g.sub}) — ${g.en}`;
      el.style.opacity = "1";
    }, 250);
  };
  const g = lang.greetings[0];
  $("hero-greeting").textContent = `${g.text} (${g.sub}) — ${g.en}`;
  greetingInterval = setInterval(updateGreeting, 3600);
}

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

// Language Selector Bar Rendering
function renderLanguageSelector() {
  const container = $("lang-selector");
  if (!container) return;
  container.innerHTML = "";

  Object.values(LANGUAGES).forEach(l => {
    const btn = document.createElement("button");
    btn.className = `lang-chip ${state.langId === l.id ? "active" : ""}`;
    btn.innerHTML = `
      <span>${l.flag} ${l.name}</span>
      ${state.langId === l.id ? '<span class="live-tag">Active</span>' : ''}
    `;
    btn.onclick = () => selectLanguage(l.id);
    container.appendChild(btn);
  });
}

// Switch Active Language
async function selectLanguage(langId) {
  if (!LANGUAGES[langId]) return;
  state.langId = langId;
  state.topic = 0;
  const lang = currentLang();

  // Update UI Elements
  renderLanguageSelector();
  startGreetingRotation();

  $("hero-sub").textContent = lang.subhead;
  $("btn-start-call-text").textContent = lang.callBtn;
  $("btn-nav-call").textContent = lang.callBtn;

  // Render Language Topics
  renderChips($("chips-topic"), lang.topics, () => state.topic, i => state.topic = i);

  // Render Scenarios Grid for Language
  renderScenariosGrid();

  // Persist language to profile
  fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_lang: lang.name })
  }).catch(() => {});

  showToast(`Switched to ${lang.name}! Ready to speak with ${lang.tutor}.`);
}

// Render Scenario Cards Dynamically
function renderScenariosGrid() {
  const container = $("scenarios-grid");
  if (!container) return;
  container.innerHTML = "";
  const lang = currentLang();

  lang.scenarios.forEach(sc => {
    const card = document.createElement("div");
    card.className = "scenario-card";
    card.innerHTML = `
      <div class="scenario-card-header">
        <span class="scenario-tag">${escapeHtml(sc.tag)}</span>
        <span class="scenario-level">${escapeHtml(sc.level)}</span>
      </div>
      <h3 class="scenario-heading">${escapeHtml(sc.title)}</h3>
      <div class="scenario-dialogue">
        <div class="dialogue-bubble user">"${escapeHtml(sc.userMsg)}"</div>
        <div class="dialogue-bubble tutor">
          <strong>${lang.tutor}:</strong> "${escapeHtml(sc.tutorMsg)}"
        </div>
      </div>
      <div class="scenario-action">
        <span>Practice this conversation</span>
        <span>→</span>
      </div>
    `;

    card.onclick = () => {
      startCall(sc.topic);
    };

    container.appendChild(card);
  });
}

// Navigation Tabs - FIXED to ensure views always display cleanly
function setTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  const views = {
    practice: $("view-practice"),
    mistakes: $("view-mistakes"),
    phrasebook: $("view-phrasebook"),
    progress: $("view-progress")
  };

  Object.entries(views).forEach(([name, el]) => {
    if (!el) return;
    const isTarget = name === tab;
    el.classList.toggle("hide", !isTarget);
    el.classList.toggle("active", isTarget);
  });

  if (tab === "mistakes") {
    const sel = $("select-mistake-lang");
    loadMistakes("all", sel ? sel.value : "All");
  }
  if (tab === "phrasebook") {
    const sel = $("select-vocab-lang");
    loadVocabulary("All", sel ? sel.value : "All");
  }
  if (tab === "progress") loadProgress();
}

// Profile API
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

// Mistake Bank Loading
async function loadMistakes(filter = "all", langFilter = "All") {
  const container = $("mistakes-list");
  container.innerHTML = `<p style="color:var(--mute);grid-column:1/-1;text-align:center;padding:32px;">Loading mistake bank...</p>`;
  try {
    const params = new URLSearchParams();
    if (filter !== "all") params.append("filter", filter);
    if (langFilter !== "All") params.append("lang", langFilter);

    const res = await fetch(`/api/mistakes?${params.toString()}`);
    const items = await res.json();
    if (!items.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px;background:var(--card);border-radius:24px;border:1px solid var(--card-border);">
          <h3 style="font:400 24px var(--serif);margin-bottom:8px;">No mistakes found! 🎉</h3>
          <p style="color:var(--mute);font-size:14px;">Every time your tutor roasts a slip-up during a call, it gets saved here so you can master it.</p>
        </div>`;
      return;
    }

    container.innerHTML = "";
    items.forEach(m => {
      const card = document.createElement("div");
      card.className = `mistake-card ${m.reviewed ? "reviewed" : ""}`;
      card.innerHTML = `
        <div class="mistake-header">
          <span style="font-size:12px;font-weight:600;color:var(--brown);">${escapeHtml(m.language || 'Chinese')}</span>
          <span class="mistake-date">${m.created_at ? new Date(m.created_at).toLocaleDateString() : ""}</span>
        </div>
        ${m.user_input ? `<div class="mistake-user"><strong>What you said:</strong> ${escapeHtml(m.user_input)}</div>` : `<div class="mistake-user" style="font-style:italic;color:var(--mute);">Spoken attempt during call</div>`}
        <div class="mistake-correction">
          <div class="zh">${escapeHtml(m.correction)}</div>
          ${m.pinyin ? `<div class="py">${escapeHtml(m.pinyin)}</div>` : ""}
        </div>
        <div class="mistake-explanation">"${escapeHtml(m.explanation)}"</div>
        <div class="mistake-actions">
          <button class="btn-sm btn-play-audio">🔊 Listen</button>
          <button class="btn-sm btn-toggle-reviewed ${m.reviewed ? "active" : ""}">${m.reviewed ? "Mark Unreviewed" : "Mark as Mastered"}</button>
        </div>
      `;

      card.querySelector(".btn-play-audio").onclick = () => {
        // Detect appropriate voice from language
        const match = Object.values(LANGUAGES).find(l => l.name === m.language);
        speakText(m.correction, 0.9, match ? match.code : null);
      };

      card.querySelector(".btn-toggle-reviewed").onclick = async () => {
        await fetch("/api/mistakes/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: m.id })
        });
        showToast(m.reviewed ? "Moved back to review" : "Marked as reviewed! ✨");
        loadMistakes(filter, langFilter);
        fetchProfile();
      };

      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger);grid-column:1/-1;">Failed to load mistakes.</p>`;
  }
}

// Phrasebook Loading
async function loadVocabulary(topic = "All", langFilter = "All") {
  const container = $("vocab-list");
  container.innerHTML = `<p style="color:var(--mute);grid-column:1/-1;text-align:center;padding:32px;">Loading phrasebook...</p>`;
  try {
    const params = new URLSearchParams();
    if (topic !== "All") params.append("topic", topic);
    if (langFilter !== "All") params.append("lang", langFilter);

    const res = await fetch(`/api/vocabulary?${params.toString()}`);
    const items = await res.json();
    if (!items.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:48px 20px;background:var(--card);border-radius:24px;border:1px solid var(--card-border);">
          <h3 style="font:400 24px var(--serif);margin-bottom:8px;">No phrases saved yet</h3>
          <p style="color:var(--mute);font-size:14px;">Target phrases taught by your tutors automatically appear here.</p>
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
            <span style="font-size:11px;font-weight:600;color:var(--brown);text-transform:uppercase;">${escapeHtml(v.language || 'Chinese')} · ${escapeHtml(v.topic || 'General')}</span>
            <span style="font-size:12px;color:var(--mute);">Practiced ${v.times_practiced}x</span>
          </div>
          <div class="vocab-zh">${escapeHtml(v.zh)}</div>
          ${v.pinyin ? `<div class="vocab-py">${escapeHtml(v.pinyin)}</div>` : ""}
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

      const match = Object.values(LANGUAGES).find(l => l.name === v.language);
      const voiceCode = match ? match.code : null;

      card.querySelector(".btn-play-norm").onclick = () => speakText(v.zh, 0.9, voiceCode);
      card.querySelector(".btn-play-slow").onclick = () => speakText(v.zh, 0.65, voiceCode);
      card.querySelector(".btn-master").onclick = async () => {
        await fetch("/api/vocabulary/master", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: v.id })
        });
        showToast(v.mastered ? "Unmarked" : "Phrase mastered! 🏆");
        loadVocabulary(topic, langFilter);
        fetchProfile();
      };

      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<p style="color:var(--danger);grid-column:1/-1;">Failed to load vocabulary.</p>`;
  }
}

// Progress Loading
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
      list.innerHTML = `<p style="color:var(--mute);text-align:center;padding:24px;">No call history yet. Start your first call!</p>`;
      return;
    }

    list.innerHTML = "";
    sessions.forEach(s => {
      const item = document.createElement("div");
      item.className = "session-item";
      const mins = Math.ceil((s.duration_seconds || 0) / 60);
      item.innerHTML = `
        <div>
          <div class="session-topic">${escapeHtml(s.language || 'Language')} · ${escapeHtml(s.topic || "General")} <span style="font-size:12px;font-weight:normal;color:var(--mute);">(${s.level || "Beginner"})</span></div>
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

// Build Prompt for active language tutor
function buildSystemPrompt() {
  const lang = currentLang();
  const currentLevel = LEVELS[state.level];
  const currentTopic = lang.topics[state.topic] || lang.topics[0];

  return `You are ${lang.tutor}, a tutor on a live audio phone call teaching ${lang.name} to an English speaker.
Learner Level: ${currentLevel}.
Call Topic: ${currentTopic}.

Tutor Personality & Style:
- ${lang.personality}
- Roast the effort playfully when the learner errs, then provide the exact fix. Never roast the person.
- Praise only when genuinely earned.

Teaching Structure (follow strictly):
- Teach 5 core target phrases for ${currentTopic} in ${lang.name}, one at a time.
- For each target phrase:
  1) Teach it clearly: in ${lang.name}, ${lang.phoneticLabel}, and English translation.
  2) Prompt the learner to speak or use it.
  3) Check and playfully correct their response in the "fix" field.
  4) Challenge them to use it in a sentence.
  5) Advance to the next phrase.
- Keep the ${lang.name} sentence natural and accessible for a ${currentLevel} learner.
- Always end with a direct question or prompt for the learner to reply.

Strict JSON Output Requirement:
Reply ONLY with a valid JSON object matching:
{
  "zh": "your ${lang.name} response/sentence",
  "pinyin": "${lang.phoneticLabel} / pronunciation guide for zh",
  "en": "natural English translation of zh",
  "fix": "if the learner made a mistake: the corrected sentence plus your witty feedback note; if they did well: empty string"
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
  const lang = currentLang();

  if (sender === "me") {
    bubble.innerHTML = `<div class="zh">${escapeHtml(data)}</div>`;
  } else {
    bubble.innerHTML = `
      <div class="zh">${escapeHtml(data.zh)}</div>
      ${data.pinyin ? `<div class="py">${escapeHtml(data.pinyin)}</div>` : ""}
      <div class="en">${escapeHtml(data.en)}</div>
      ${data.fix ? `<div class="fix"><strong>${lang.tutor}:</strong> ${escapeHtml(data.fix)}</div>` : ""}
      <div class="m-actions">
        <button class="btn-bubble btn-listen">🔊 Listen</button>
        <button class="btn-bubble btn-save-phrase">★ Save</button>
      </div>
    `;

    bubble.querySelector(".btn-listen").onclick = () => speakText(data.zh, 0.9, lang.code);
    bubble.querySelector(".btn-save-phrase").onclick = async () => {
      await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zh: data.zh,
          pinyin: data.pinyin,
          en: data.en,
          topic: lang.topics[state.topic],
          language: lang.name
        })
      });
      showToast(`Saved to ${lang.name} phrasebook! 📖`);
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

  const lang = currentLang();

  if (userInputText) {
    appendBubble("me", userInputText);
    state.hist.push({ role: "user", content: userInputText });
  }

  setCallStatus(`${lang.tutor} is thinking...`);

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

    if (aiResponse.zh) state.sessionPhrases.push(aiResponse);
    if (aiResponse.fix) state.sessionMistakes.push({ input: userInputText, fix: aiResponse.fix });

    appendBubble("ai", aiResponse);

    setCallStatus(`${lang.tutor} is speaking...`);
    if (!state.muted) {
      await speakText(aiResponse.zh, 0.9, lang.code);
      state.lastTutorSpokenText = aiResponse.zh;
      state.lastTutorTimestamp = Date.now();
      // Reverb guard: wait 700ms for room echo and speaker output to completely die down
      await new Promise(r => setTimeout(r, 700));
    }

    setCallStatus("Connected");
  } catch (err) {
    console.error("Turn error:", err);
    if (userInputText && state.hist.length && state.hist[state.hist.length - 1].content === userInputText) {
      state.hist.pop();
    }
    setCallStatus("Ready to retry");
    appendBubble("ai", {
      zh: "Connection hiccup, let's keep going!",
      pinyin: "",
      en: "Please repeat what you said, or type it directly below!",
      fix: "Signal flickered for a moment. Try saying or typing that again!"
    });
  } finally {
    state.busy = false;
    if (state.inCall && !state.muted) {
      scheduleRestart(150);
    }
  }
}

// Acoustic Echo Filter: Detects if microphone caught the tutor's own audio
function isTutorEcho(transcript) {
  if (!state.lastTutorSpokenText) return false;
  // If the audio arrived within 5.5s of the tutor speaking
  const elapsed = Date.now() - (state.lastTutorTimestamp || 0);
  if (elapsed > 5500) return false;

  const normalize = s => (s || "").toLowerCase().replace(/[\s.,?!，。？！'":;—]/g, "");
  const tNorm = normalize(transcript);
  const aNorm = normalize(state.lastTutorSpokenText);

  // If user transcript is contained in what tutor just said
  if (tNorm.length >= 2 && aNorm.includes(tNorm)) {
    return true;
  }
  if (tNorm.length >= 4 && (aNorm.includes(tNorm) || tNorm.includes(aNorm))) {
    return true;
  }
  return false;
}

// Debounced Safe Microphone Restarter
let restartTimer = null;
function scheduleRestart(delay = 250) {
  if (restartTimer) clearTimeout(restartTimer);
  if (!state.inCall || state.muted || state.busy || state.speaking) return;

  restartTimer = setTimeout(() => {
    if (state.inCall && !state.muted && !state.busy && !state.speaking) {
      startListening();
    }
  }, delay);
}

function startListening() {
  if (!state.inCall || state.muted || state.busy || state.speaking || !SR) {
    if (state.inCall && !state.speaking && !state.busy) {
      setCallStatus(state.muted ? "Muted (Type below or click Orb to speak)" : "Ready to speak");
    }
    return;
  }

  // Clean previous instance if present
  if (recognition) {
    try { recognition.abort(); } catch (e) {}
    recognition = null;
  }

  try {
    const lang = currentLang();
    recognition = new SR();
    recognition.lang = lang.code;
    recognition.interimResults = true; // Show live visual words as user speaks
    recognition.continuous = false;

    let finalTranscript = "";

    recognition.onstart = () => {
      $("orb").className = "orb live";
      setCallStatus("Listening to you...");
    };

    recognition.onresult = evt => {
      let interim = "";
      for (let i = evt.resultIndex; i < evt.results.length; ++i) {
        if (evt.results[i].isFinal) {
          finalTranscript += evt.results[i][0].transcript;
        } else {
          interim += evt.results[i][0].transcript;
        }
      }

      const display = (finalTranscript || interim).trim();
      if (display) {
        setCallStatus(`Hearing: "${display}"...`);
      }

      if (finalTranscript.trim()) {
        const textToSend = finalTranscript.trim();
        finalTranscript = "";
        stopListening();

        // Echo cancellation check
        if (isTutorEcho(textToSend)) {
          console.warn("[Audio Guard] Ignored tutor speaker echo:", textToSend);
          setCallStatus("Listening to you...");
          scheduleRestart(300);
          return;
        }

        turn(textToSend);
      }
    };

    recognition.onerror = e => {
      if (e.error === "no-speech") {
        // Normal user pause/thinking: keep mic alive by quietly restarting
        scheduleRestart(250);
        return;
      }
      if (e.error === "aborted") {
        return;
      }
      if (e.error === "not-allowed") {
        setCallStatus("Mic blocked - click Orb or type below");
        showToast("Microphone access blocked. Click Orb or type!");
        return;
      }
      scheduleRestart(500);
    };

    recognition.onend = () => {
      recognition = null;
      $("orb").className = "orb";
      // Automatically keep listening alive
      scheduleRestart(250);
    };

    recognition.start();
  } catch (e) {
    recognition = null;
    $("orb").className = "orb";
    scheduleRestart(500);
  }
}

function stopListening() {
  if (restartTimer) clearTimeout(restartTimer);
  if (recognition) {
    try { recognition.abort(); } catch (e) {}
    recognition = null;
  }
  $("orb").className = "orb";
}

function renderCallHelpers() {
  const container = $("quick-helpers");
  if (!container) return;
  container.innerHTML = "";
  const lang = currentLang();

  lang.helpers.forEach(h => {
    const btn = document.createElement("button");
    btn.className = "helper-chip";
    btn.textContent = h.label;
    btn.onclick = () => turn(h.text);
    container.appendChild(btn);
  });
}

async function startCall(customTopic = null) {
  const lang = currentLang();
  if (customTopic !== null) {
    const idx = lang.topics.findIndex(t => t.toLowerCase().includes(customTopic.toLowerCase()));
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

  $("call-tutor-avatar").textContent = lang.tutorAvatar;
  $("call-tutor-name").textContent = lang.tutor;
  $("call-tutor-topic").textContent = `${LEVELS[state.level]} · ${lang.topics[state.topic]}`;
  $("call-log").innerHTML = "";
  $("call-timer").textContent = "00:00";
  setCallStatus("Connecting...");
  $("call-view").classList.remove("hide");
  $("orb").textContent = "Mute";

  renderCallHelpers();

  // Register session in database with current language
  await fetch("/api/session/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: state.sessionId,
      topic: lang.topics[state.topic],
      level: LEVELS[state.level],
      language: lang.name
    })
  });

  state.callTimerInterval = setInterval(updateCallTimer, 1000);
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

  const lang = currentLang();
  const turns = state.hist.length;
  const score = turns < 4 ? 7 : Math.min(10, Math.max(6, 9 - state.sessionMistakes.length));
  const feedback = state.sessionMistakes.length === 0
    ? `Impressive flow in ${lang.name}! Keep practicing.`
    : `Caught ${state.sessionMistakes.length} slip-up${state.sessionMistakes.length === 1 ? '' : 's'}. Review them in your Mistake Bank!`;

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

  $("summary-score").textContent = `${score}/10`;
  $("summary-verdict").textContent = `"${feedback}" — ${lang.tutor}`;
  $("summary-duration").textContent = `${Math.ceil(state.callSeconds / 60)}m`;
  $("summary-turns").textContent = turns;
  $("summary-mistakes-count").textContent = state.sessionMistakes.length;
  $("modal-summary").classList.remove("hide");

  fetchProfile();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
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

  // Level selector
  renderChips($("chips-level"), LEVELS, () => state.level, i => state.level = i);

  // Initialize Language Selector and Scenarios
  renderLanguageSelector();
  selectLanguage("zh");

  // Call View listeners
  $("btn-hangup").onclick = endCall;
  $("orb").onclick = () => {
    // If tutor is speaking, tap Orb to immediately interrupt them and listen to user
    if (state.speaking) {
      if (window.speechSynthesis) speechSynthesis.cancel();
      state.speaking = false;
      state.muted = false;
      $("orb").textContent = "Mute";
      setCallStatus("Interrupted — listening to you...");
      scheduleRestart(100);
      return;
    }

    state.muted = !state.muted;
    $("orb").textContent = state.muted ? "Unmute" : "Mute";
    if (state.muted) {
      stopListening();
      if (window.speechSynthesis) speechSynthesis.cancel();
      setCallStatus("Muted (Type below or tap Orb to unmute)");
    } else {
      setCallStatus("Listening to you...");
      startListening();
    }
  };

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

  // Mistake filter buttons
  document.querySelectorAll(".filter-mistake").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter-mistake").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const sel = $("select-mistake-lang");
      loadMistakes(btn.dataset.filter, sel ? sel.value : "All");
    };
  });

  $("select-mistake-lang").onchange = e => {
    const activeBtn = document.querySelector(".filter-mistake.active");
    const filter = activeBtn ? activeBtn.dataset.filter : "all";
    loadMistakes(filter, e.target.value);
  };

  $("select-vocab-lang").onchange = e => {
    loadVocabulary("All", e.target.value);
  };

  fetchProfile();
});
