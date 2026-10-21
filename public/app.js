// Tinguin AI - Client Application Logic
// Multilingual voice-call learning with savage AI tutors who roast mistakes into fluency

const LEVELS = ["Beginner", "Elementary", "Intermediate", "Advanced"];

// Multilingual Configurations — Tinguin Roast & Fluency Platform
const LANGUAGES = {
  ja: {
    id: "ja",
    name: "Japanese",
    flag: "🇯🇵",
    code: "ja-JP",
    tutor: "Kenji 健二",
    tutorAvatar: "健",
    callBtn: "Call Kenji",
    subhead: "Learn Japanese by phone call with Kenji — a brutally honest Tokyoite who laughs at your anime-cringe mistakes and roasts your awful grammar into real fluency.",
    phoneticLabel: "Romaji / Reading",
    personality: "savagely witty, sarcastic Tokyo native. Openly bursts out laughing (草, ちょww, 爆笑) when the learner makes ridiculous mistakes, butchers pronunciation, or uses weird anime phrases in real situations. Mocks awkward phrasing creatively, but teaches the exact sharp, natural way real Tokyo locals speak.",
    greetings: [
      { text: "こんにちは！", sub: "Konnichiwa!", en: "Hello!" },
      { text: "何言ってるの？", sub: "Nani itteru no?", en: "What on earth are you saying?" },
      { text: "草生えるわ", sub: "Kusa haeru wa", en: "That's hilarious (LOL)" },
      { text: "ちゃんと喋って！", sub: "Chanto shabette!", en: "Speak properly!" }
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
        tag: "Ramen",
        level: "Beginner",
        title: "Ordering ramen in Shibuya",
        userMsg: "すみません、豚骨ラーメン味玉付きでお願いします。",
        tutorMsg: "草、注文はできたけど、まさかスープ飲み干して塩分過多で倒れないでよ？麺の硬さは？'麺硬めで！'って言ってみて。",
        topic: "Ramen & Izakaya"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Japanese",
        userMsg: "初めまして！日本語を勉強しています。",
        tutorMsg: "へぇー、勉強してる割には発音が宇宙人だけどね（笑）！何で日本語勉強してるの？アニメ？",
        topic: "Introductions & Etiquette"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Shopping in Akihabara",
        userMsg: "これ、試してもいいですか？",
        tutorMsg: "よし、聞けたね。でもレジでオドオドしないでよ。免税したいなら『免税できますか？』って堂々と言いな！",
        topic: "Shopping & Akihabara"
      },
      {
        tag: "Directions",
        level: "Elementary",
        title: "Lost in Shinjuku Station",
        userMsg: "すみません、山手線はどこですか？",
        tutorMsg: "ちょww 新宿駅で迷子とかテンプレすぎ！南口のサインを探して『南口はどちらですか？』って聞いてみて！",
        topic: "Trains & Tokyo Navigation"
      },
      {
        tag: "Anime & Slang",
        level: "Intermediate",
        title: "Real Tokyo slang vs Anime",
        userMsg: "最近、日本のアニメを見ています。",
        tutorMsg: "出た！アニメ日本語！リアルで『貴様』とか言ってたら通報されるからね（笑）！日常のリアルな相槌を教えるよ。",
        topic: "Daily Routine & Anime"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual banter with Kenji",
        userMsg: "今日の天気はとてもいいですね。",
        tutorMsg: "天気の話とか教科書かよ！もっと面白いこと話してよ。今日何やらかしたの？",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "もう少しゆっくり話してください (Please speak slower)", label: "🐢 ゆっくり (Slower)" },
      { text: "どういう意味ですか？ (What does that mean?)", label: "❓ どういう意味？ (Meaning)" },
      { text: "もう一度言ってください (Please repeat that)", label: "🔁 もう一度 (Repeat)" },
      { text: "ちょっと分かりません (I don't quite get it)", label: "🤔 分からない (Don't get it)" }
    ]
  },

  zh: {
    id: "zh",
    name: "Chinese (Mandarin)",
    flag: "🇨🇳",
    code: "zh-CN",
    tutor: "Lao Li 老李",
    tutorAvatar: "李",
    callBtn: "Call Lao Li",
    subhead: "Learn Chinese by phone call with Lao Li — a savage Beijing uncle who laughs at your butchered tones and roasts you until you speak like a local.",
    phoneticLabel: "Pinyin",
    personality: "savage, sharp-tongued Beijing uncle with zero filter. Hysterically laughs (哈哈哈哈！哎哟我的妈呀！) at bad tones and flat robotic pronunciation. Roasts the learner creatively and makes fun of their silly mistakes before making them repeat the phrase properly.",
    greetings: [
      { text: "你好！", sub: "Nǐ hǎo!", en: "Hello!" },
      { text: "哈哈你说的啥？", sub: "Hāhā nǐ shuō de shá?", en: "Haha what did you say?" },
      { text: "吃了没？", sub: "Chīle méi?", en: "Have you eaten?" },
      { text: "声调跑哪去了！", sub: "Shēngdiào pǎo nǎ qù le!", en: "Where did your tones go!" }
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
        tutorMsg: "你好！别紧张，虽然你的发音大概率很搞笑，但咱们先从打招呼开始：你好！大声说！",
        topic: "Introductions"
      },
      {
        tag: "Ordering Food",
        level: "Elementary",
        title: "Street food in Chengdu",
        userMsg: "老板，来一碗牛肉面。",
        tutorMsg: "点得挺溜，但别忘了说'不要辣'，不然一口下去你舌头直接喷火！跟我念：不要辣！",
        topic: "Ordering food"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Bargaining at Silk Market",
        userMsg: "太贵了，能不能便宜一点？",
        tutorMsg: "哈哈你这语气软绵绵的像借钱！拿点气势出来，眼神瞪着老板说：便宜点吧！",
        topic: "Shopping & Bargaining"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Taking a taxi in Beijing",
        userMsg: "师傅，请去三里屯。",
        tutorMsg: "司机一脚油门问你走不走高速，你别懵啊！赶紧回答：走高速还是不走高速？",
        topic: "Directions & Taxis"
      },
      {
        tag: "Daily Banter",
        level: "Beginner",
        title: "Saying what you like",
        userMsg: "我喜欢喝茶。",
        tutorMsg: "喜欢喝茶？听着像八十岁老大爷！来，用'我喜欢...'说一个你真正痴迷的东西！",
        topic: "Daily banter"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual chat with Lao Li",
        userMsg: "今天工作有点累。",
        tutorMsg: "累就对了！活着哪有不累的（笑）。用中文跟我吐槽两句，到底发生啥了？",
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
    subhead: "Learn Spanish by phone call with Mateo — a theatrical Madrid roastmaster who laughs at your flat English vowels and turns you fluent through tough love.",
    phoneticLabel: "Pronunciation & Tip",
    personality: "theatrical, fast-talking, savage Madrid tutor. Bursts out laughing (¡Jajaja por Dios!) when you translate word-for-word or murder Spanish vowels. Teases you mercilessly into rolling your R's.",
    greetings: [
      { text: "¡Hola!", sub: "OH-lah", en: "Hello!" },
      { text: "¿Qué desastre es ese?", sub: "keh deh-SAHS-treh", en: "What mess is that?" },
      { text: "¡Venga, habla!", sub: "VEHN-gah AH-blah", en: "Come on, speak up!" },
      { text: "Sin vergüenza", sub: "seen vehr-GWEHN-sah", en: "Without shame" }
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
        tag: "Food & Drinks",
        level: "Beginner",
        title: "Ordering tapas in Seville",
        userMsg: "Una ración de patatas bravas y una cerveza, por favor.",
        tutorMsg: "¡Jajaja por fin alguien con buen gusto! But pronounce that 'cerveza' like an Andalusian, not a tourist: ¡Una caña bien fría!",
        topic: "Tapas & Drinks"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Madrid",
        userMsg: "Hola, quiero hablar español.",
        tutorMsg: "¡Madre mía, qué tímido! Pecho arriba y di: '¡Hola! Vengo a conquistar el español.' ¿De dónde eres?",
        topic: "Introductions"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Bargaining at El Rastro",
        userMsg: "¿Cuánto cuesta esto? ¿Me lo deja más barato?",
        tutorMsg: "¿Barato? ¡El vendedor se va a reír en tu cara! Di con descaro: 'Venga, déjamelo en diez pavos y trato hecho.'",
        topic: "Market & Shopping"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Asking directions in Barcelona",
        userMsg: "Disculpe, ¿dónde está la parada de metro?",
        tutorMsg: "¡Bien! Ahora pregunta rápido si la línea está cortada: '¿Hay alguna avería hoy?'",
        topic: "Getting Around"
      },
      {
        tag: "Daily Life",
        level: "Beginner",
        title: "Spilling tea in Spanish",
        userMsg: "Hoy tuve un día terrible.",
        tutorMsg: "¡Cuéntame el salseo! Jajaja, desahógate conmigo en español: ¿quién te hizo la vida imposible hoy?",
        topic: "Daily Life & Plans"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual banter with Mateo",
        userMsg: "El fin de semana salí con amigos.",
        tutorMsg: "¡A ver si sobreviviste a la fiesta española! ¿Hasta qué hora te quedaste de copas?",
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
    subhead: "Learn French by phone call with Camille — a delightfully snooty Parisian tutor who winces and laughs at your accent until you speak like a true local.",
    phoneticLabel: "Pronunciation & Liaison",
    personality: "chic, snarky, delightfully judgmental Parisian. Gasps dramatically and laughs (Mon dieu, *laughs*) when you butcher French vowels or sound like a tourist handbook. Refuses to let you sound robotic.",
    greetings: [
      { text: "Bonjour !", sub: "bohn-zhoor", en: "Hello!" },
      { text: "Mon dieu...", sub: "mohn dyuh", en: "My god..." },
      { text: "On essaie encore ?", sub: "ohn eh-say ahn-kor", en: "Shall we try again?" },
      { text: "Sans accent bizarre !", sub: "sahn ahk-sahn bee-zahr", en: "Without the weird accent!" }
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
        tag: "Café",
        level: "Beginner",
        title: "Ordering at a Parisian café",
        userMsg: "Un café et un croissant, s'il vous plaît.",
        tutorMsg: "Ah, pas mal ! Mais regarde le serveur dans les yeux et dis 'un café crème'. Et n'oublie jamais le 'Bonjour' d'abord !",
        topic: "Café & Boulangerie"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Paris",
        userMsg: "Bonjour ! Je m'appelle Sam.",
        tutorMsg: "Enchantée Sam. Bon, l'accent a besoin d'amour (*rire*), mais au moins tu tentes ta chance ! D'où viens-tu ?",
        topic: "Introductions"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Boutique on the Left Bank",
        userMsg: "C'est un peu trop cher pour moi.",
        tutorMsg: "Haha, trop honnête ! À Paris, on dit avec élégance : 'Vous auriez quelque chose de plus abordable ?'",
        topic: "Shopping & Boutiques"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Navigating the Paris Metro",
        userMsg: "Pardon, où se trouve la ligne 4 ?",
        tutorMsg: "Attention aux pickpockets ! Prends le couloir à gauche et marche d'un pas pressé comme un vrai Parisien.",
        topic: "Paris Metro & Directions"
      },
      {
        tag: "Daily Routine",
        level: "Beginner",
        title: "Complaining like a Parisian",
        userMsg: "Je suis fatigué.",
        tutorMsg: "Bienvenue en France ! Ici râler est un art. Dis : 'J'en ai marre, la journée était interminable.'",
        topic: "Daily routine"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual chat with Camille",
        userMsg: "J'adore la nourriture française.",
        tutorMsg: "Évidemment, qui ne l'aimerait pas ? Mais dis-moi : baguette tradition ou pain de mie industriel ? Choisis bien !",
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
    subhead: "Learn German by phone call with Hans — a dry Berlin cynic who treats bad grammar as a criminal offense and turns you fluent through tough love.",
    phoneticLabel: "Pronunciation & Case",
    personality: "deadpan, brutally direct Berlin cynic. Laughs dryly (Ha! Nein, nein, nein) at ruined German cases, chaotic word order, and fluffy politeness. Demands brutal efficiency and correct articles.",
    greetings: [
      { text: "Hallo!", sub: "HAH-loh", en: "Hello!" },
      { text: "Was war das denn?!", sub: "vas vahr dahs den", en: "What on earth was that?!" },
      { text: "Kurz und knackig!", sub: "koorts oont KNAH-kik", en: "Short and crisp!" },
      { text: "Auf den Punkt!", sub: "owf dehn POONKT", en: "Get to the point!" }
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
        tag: "Bakery",
        level: "Beginner",
        title: "At the Munich bakery",
        userMsg: "Ich möchte zwei Brötchen, bitte.",
        tutorMsg: "Nicht schlecht. Aber die Bäckereifachverkäuferin hat keine Geduld! Sag zackig: 'Zwei Schrippen zum Mitnehmen, bitte!'",
        topic: "Bakery & Biergarten"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Berlin",
        userMsg: "Hallo, ich bin neu hier.",
        tutorMsg: "Ha, das hört man am Akzent! Willkommen im Dschungel. Sag mir sofort, warum du dir freiwillig deutsche Grammatik antust.",
        topic: "Introductions"
      },
      {
        tag: "Directions",
        level: "Intermediate",
        title: "Catching the S-Bahn",
        userMsg: "Entschuldigung, fährt dieser Zug nach Potsdam?",
        tutorMsg: "Ja, aber beeil dich — die Türen schließen automatisch und die Bahn wartet nicht auf Touristen!",
        topic: "Trains & Directions"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "At the supermarket checkout",
        userMsg: "Kann ich mit Karte zahlen?",
        tutorMsg: "In Deutschland? Jajaja, mutige Frage! Manchmal nur Bargeld! Frag: 'Erst ab zehn Euro oder auch Kleingeld?'",
        topic: "Shopping & Supermarket"
      },
      {
        tag: "Daily Routine",
        level: "Beginner",
        title: "German workplace banter",
        userMsg: "Feierabend!",
        tutorMsg: "Das heiligste Wort im deutschen Sprachgebrauch! Geh nach Hause und mach nichts mehr. Bis morgen!",
        topic: "Work & Daily Routine"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual banter with Hans",
        userMsg: "Wie gefällt dir Berlin?",
        tutorMsg: "Laut, chaotisch, pleite, aber sexy. Was willst du wissen?",
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

  ko: {
    id: "ko",
    name: "Korean",
    flag: "🇰🇷",
    code: "ko-KR",
    tutor: "Min-jun 민준",
    tutorAvatar: "민",
    callBtn: "Call Min-jun",
    subhead: "Learn Korean by phone call with Min-jun — a sharp-tongued Seoul tutor who laughs at cringe K-drama lines and gets you speaking real banter.",
    phoneticLabel: "Romanization / Pronunciation",
    personality: "witty, dramatic Seoul local. Bursts out laughing (ㅋㅋㅋ, 헐 진짜?) when you speak like an old sageuk drama or butcher pronunciation. Teases you into speaking natural modern conversational Korean.",
    greetings: [
      { text: "안녕!", sub: "Annyeong!", en: "Hey!" },
      { text: "헐, 대박 ㅋㅋㅋ", sub: "Heol, daebak ㅋㅋㅋ", en: "Omg, for real LOL" },
      { text: "밥은 먹고 다니냐?", sub: "Bap eun meokgo daninya?", en: "Are you eating well?" },
      { text: "제대로 말해봐!", sub: "Jedaero malhaebwa!", en: "Say it properly!" }
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
        tag: "K-Food",
        level: "Beginner",
        title: "Street food in Hongdae",
        userMsg: "이모, 떡볶이 1인분 주세요.",
        tutorMsg: "오 주문은 좋은데, 매운맛에 기절하지나 마요! 튀김도 시켜야지: '김말이도 추가해주세요!'",
        topic: "K-Food & Bunsik"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in Seoul",
        userMsg: "안녕하세요, 한국어 배우고 싶어요.",
        tutorMsg: "ㅋㅋㅋ 반가워요! 교과서 말투 말고 요즘 쓰는 인사: '반갑습니다! 잘 부탁드려요.' 크게 말해봐요!",
        topic: "Introductions"
      },
      {
        tag: "Shopping",
        level: "Elementary",
        title: "Bargaining in Dongdaemun",
        userMsg: "조금만 깎아주세요!",
        tutorMsg: "눈빛에 간절함이 없잖아요 ㅋㅋㅋ 귀엽게 웃으면서: '언니~ 좀만 깎아주세요, 네?' 해봐요!",
        topic: "Shopping & Myeongdong"
      },
      {
        tag: "Taxi",
        level: "Intermediate",
        title: "Taking a taxi in Gangnam",
        userMsg: "기사님, 강남역으로 가주세요.",
        tutorMsg: "퇴근 시간에 강남? 차 엄청 막힐 텐데 ㅋㅋㅋ '골목으로 안 막히게 가주세요'라고 말해봐요!",
        topic: "Subway & Taxis"
      },
      {
        tag: "Daily Life",
        level: "Beginner",
        title: "Talking about your day",
        userMsg: "오늘 너무 피곤해요.",
        tutorMsg: "월요병 걸렸네 ㅋㅋㅋ 당충전 해야죠! 오늘 저녁에 치맥 어때요? 치맥 먹고 싶다고 말해봐요!",
        topic: "K-Dramas & Daily Life"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual chat with Min-jun",
        userMsg: "요즘 한국 드라마 보고 있어요.",
        tutorMsg: "설마 오빠~ 이러면서 본 건 아니죠? ㅋㅋㅋ 무슨 드라마인데 그렇게 빠졌어요?",
        topic: "Free talk"
      }
    ],
    helpers: [
      { text: "조금만 천천히 말해주세요 (Please speak slower)", label: "🐢 천천히 (Slower)" },
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
    subhead: "Master English by phone call with Coach Sarah — a brutally sarcastic New Yorker who roasts robotic phrasing and makes you sound like a real human.",
    phoneticLabel: "Natural Phrasing & Slang",
    personality: "sharp, brutally sarcastic New York coach. Bursts out laughing (Haha wow, really?) when you use archaic 19th-century textbook words or sound like a robot. Pushes you to sound natural, punchy, and confident.",
    greetings: [
      { text: "Hey there!", sub: "Natural greeting", en: "Hello!" },
      { text: "Who taught you that?!", sub: "Callout", en: "Where did you hear that?" },
      { text: "Speak like a human!", sub: "Reality check", en: "Cut the robotic textbook talk" },
      { text: "Own your accent!", sub: "Confidence push", en: "Speak up with power" }
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
        tag: "Coffee",
        level: "Beginner",
        title: "Ordering at a New York diner",
        userMsg: "Can I get an iced latte with oat milk, please?",
        tutorMsg: "Crisp and fast, just how New York baristas like it! Now add some flair: 'And a chocolate croissant to go, thanks.'",
        topic: "Coffee & Diners"
      },
      {
        tag: "Introductions",
        level: "Beginner",
        title: "Day one in New York",
        userMsg: "Hello, how do you do? I am learning English.",
        tutorMsg: "Haha, 'how do you do'?! What century did you time-travel from? Drop the Victorian etiquette! Say: 'Hey, what's going on?' Try it!",
        topic: "Introductions & Networking"
      },
      {
        tag: "Directions",
        level: "Elementary",
        title: "Navigating the subway",
        userMsg: "Excuse me, does this train stop at 34th Street?",
        tutorMsg: "Good! But ask if it's uptown or downtown before you end up in the wrong borough: 'Is this the uptown express?'",
        topic: "Directions & City Transit"
      },
      {
        tag: "Interview",
        level: "Intermediate",
        title: "Job interview banter",
        userMsg: "I believe I am an optimal candidate for this position.",
        tutorMsg: "Optimal candidate? You sound like a LinkedIn algorithm! Say: 'I've got the exact hands-on skills your team needs.' Sound confident!",
        topic: "Job Interviews & Work"
      },
      {
        tag: "Daily Life",
        level: "Beginner",
        title: "Venting about your day",
        userMsg: "Today work was very busy and bad.",
        tutorMsg: "Very busy and bad? Come on, use real color! Say: 'Today was an absolute dumpster fire at work.' Feel the energy!",
        topic: "Job Interviews & Work"
      },
      {
        tag: "Free Talk",
        level: "All Levels",
        title: "Casual banter with Sarah",
        userMsg: "What's the best spot to visit in NYC?",
        tutorMsg: "Whatever you do, don't stand in the middle of Times Square staring at billboards like a deer in headlights! Tell me what you're actually into.",
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
  langId: "ja",
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
  voices: [],
  token: localStorage.getItem("tinguin_token") || null,
  user: null,
  authMode: "login"
};

const $ = id => document.getElementById(id);
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

// Helper: Authenticated fetch wrapper
function authFetch(url, options = {}) {
  options.headers = options.headers || {};
  const token = state.token || localStorage.getItem("tinguin_token");
  if (token) {
    if (options.headers instanceof Headers) {
      options.headers.set("Authorization", `Bearer ${token}`);
    } else {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return fetch(url, options);
}

// User Navigation & Auth Management
function setAuthMode(mode) {
  state.authMode = mode;
  const isLogin = mode === "login";
  const tabLogin = $("tab-login");
  const tabReg = $("tab-register");
  if (tabLogin && tabReg) {
    tabLogin.classList.toggle("active", isLogin);
    tabReg.classList.toggle("active", !isLogin);
  }
  if ($("auth-title")) $("auth-title").textContent = isLogin ? "Welcome back" : "Create Account";
  if ($("auth-sub")) $("auth-sub").textContent = isLogin
    ? "Log in to sync your progress, streak, and mistake bank"
    : "Join Tinguin to save your roasts, vocabulary, and stats";
  if ($("btn-auth-submit")) $("btn-auth-submit").textContent = isLogin ? "Log In" : "Sign Up";
  if ($("field-auth-name")) $("field-auth-name").style.display = isLogin ? "none" : "flex";
  if ($("auth-error")) $("auth-error").textContent = "";
}

function openAuthModal(mode = "login") {
  setAuthMode(mode);
  if ($("auth-input-user")) $("auth-input-user").value = "";
  if ($("auth-input-pass")) $("auth-input-pass").value = "";
  if ($("auth-input-name")) $("auth-input-name").value = "";
  if ($("auth-error")) $("auth-error").textContent = "";
  const modal = $("modal-auth");
  if (modal) modal.classList.remove("hide");
}

function closeAuthModal() {
  const modal = $("modal-auth");
  if (modal) modal.classList.add("hide");
}

function renderUserNav() {
  const wrap = $("nav-user-wrap");
  if (!wrap) return;
  if (state.user) {
    wrap.innerHTML = `
      <div class="user-pill">
        <span class="user-name">👤 ${escapeHtml(state.user.name || state.user.username)}</span>
        <button class="btn-logout" id="btn-logout" title="Log out">Log Out</button>
      </div>
    `;
    const btnLogout = $("btn-logout");
    if (btnLogout) btnLogout.onclick = handleLogout;
  } else {
    wrap.innerHTML = `
      <div class="nav-auth-btns">
        <button type="button" class="btn-login-nav" id="btn-login-nav">Log In</button>
        <button type="button" class="btn-signup-nav" id="btn-signup-nav">Sign Up</button>
      </div>
    `;
    const btnLogin = $("btn-login-nav");
    if (btnLogin) btnLogin.onclick = () => openAuthModal("login");
    const btnSignup = $("btn-signup-nav");
    if (btnSignup) btnSignup.onclick = () => openAuthModal("register");
  }
}

async function checkAuthStatus() {
  if (!state.token) {
    renderUserNav();
    return;
  }
  try {
    const res = await authFetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        state.user = data.user;
      } else {
        state.token = null;
        state.user = null;
        localStorage.removeItem("tinguin_token");
      }
    }
  } catch (e) {
    console.error("Auth status check failed:", e);
  }
  renderUserNav();
}

async function handleAuthSubmit(e) {
  if (e) e.preventDefault();
  const username = ($("auth-input-user")?.value || "").trim();
  const password = $("auth-input-pass")?.value || "";
  const name = ($("auth-input-name")?.value || "").trim();
  const errorEl = $("auth-error");
  if (errorEl) errorEl.textContent = "";

  if (!username || username.length < 3) {
    if (errorEl) errorEl.textContent = "Username must be at least 3 characters.";
    return;
  }
  if (!password || password.length < 4) {
    if (errorEl) errorEl.textContent = "Password must be at least 4 characters.";
    return;
  }

  const endpoint = state.authMode === "login" ? "/api/auth/login" : "/api/auth/register";
  const body = state.authMode === "login" ? { username, password } : { username, password, name };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      if (errorEl) errorEl.textContent = data.error || "Authentication failed.";
      return;
    }

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("tinguin_token", data.token);
    closeAuthModal();
    renderUserNav();
    showToast(`Welcome, ${state.user.name || state.user.username}! 🎉`);

    fetchProfile();
    loadMistakes();
    loadVocabulary();
  } catch (err) {
    if (errorEl) errorEl.textContent = "Connection error. Please try again.";
  }
}

async function handleLogout() {
  try {
    await authFetch("/api/auth/logout", { method: "POST" });
  } catch (e) {}
  state.token = null;
  state.user = null;
  localStorage.removeItem("tinguin_token");
  renderUserNav();
  showToast("Logged out successfully");
  fetchProfile();
  loadMistakes();
  loadVocabulary();
}

function currentLang() {
  return LANGUAGES[state.langId] || LANGUAGES.ja || LANGUAGES.zh;
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
  const voices = state.voices.length ? state.voices : (window.speechSynthesis ? speechSynthesis.getVoices() : []);
  if (!voices || !voices.length) return null;

  const code = (langCode || "").toLowerCase();
  const primaryCode = code.split("-")[0];

  // 1. Natural / Neural voices priority (Google, Microsoft Online, Natural, Premium)
  const premiumMatches = voices.filter(v => {
    const l = v.lang.toLowerCase();
    const isLang = l === code || l.startsWith(primaryCode);
    const isNatural = /natural|neural|online|google|premium/i.test(v.name);
    return isLang && isNatural;
  });
  if (premiumMatches.length > 0) return premiumMatches[0];

  // 2. Exact language match (e.g. ja-JP, zh-CN)
  const exact = voices.find(v => v.lang.toLowerCase() === code);
  if (exact) return exact;

  // 3. Fallback to primary language prefix
  return voices.find(v => v.lang.toLowerCase().startsWith(primaryCode)) || null;
}

function speakText(text, rate = 0.95, langCode = null) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) return resolve();
    speechSynthesis.cancel();

    // Clean text for speech synthesis (strip emoji, markdown characters)
    const cleanSpeech = (text || "").replace(/[（\(][^）\)]*[）\)]/g, "").replace(/[*_#`~]/g, "").trim();
    if (!cleanSpeech) return resolve();

    window._currentUtterance = new SpeechSynthesisUtterance(cleanSpeech);
    const u = window._currentUtterance;
    const targetCode = langCode || currentLang().code;
    u.lang = targetCode;
    // Natural human speech speed
    u.rate = rate;
    // Subtle realistic pitch inflection
    u.pitch = 1.02;

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
  if (!container) return;
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

// Language Chips in Launcher Card
function renderLanguageChips() {
  const container = $("chips-lang");
  if (!container) return;
  container.innerHTML = "";
  Object.values(LANGUAGES).forEach(l => {
    const btn = document.createElement("button");
    btn.className = `chip ${state.langId === l.id ? "active" : ""}`;
    btn.textContent = `${l.flag} ${l.name.split(" ")[0]}`;
    btn.setAttribute("aria-pressed", state.langId === l.id);
    btn.onclick = () => selectLanguage(l.id);
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
  renderLanguageChips();
  startGreetingRotation();

  $("hero-sub").textContent = lang.subhead;
  $("btn-start-call-text").textContent = lang.callBtn;
  $("btn-nav-call").textContent = lang.callBtn;

  // Render Language Topics
  renderChips($("chips-topic"), lang.topics, () => state.topic, i => state.topic = i);

  // Render Scenarios Grid for Language
  renderScenariosGrid();

  // Persist language to profile
  authFetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_lang: lang.name })
  }).catch(() => {});

  showToast(`Switched to ${lang.name}! Ready to speak with ${lang.tutor}.`);
}

// Render Scenario Cards Dynamically (Pingo Image 2 style)
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
    const res = await authFetch("/api/profile");
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

    const res = await authFetch(`/api/mistakes?${params.toString()}`);
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
        await authFetch("/api/mistakes/review", {
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

    const res = await authFetch(`/api/vocabulary?${params.toString()}`);
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
        await authFetch("/api/vocabulary/master", {
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
    const res = await authFetch("/api/sessions");
    const sessions = await res.json();
    if (!sessions.length) {
      list.innerHTML = `<p style="color:var(--mute);text-align:center;padding:24px;">No call history yet. Start your first call!</p>`;
      return;
    }

    list.innerHTML = "";
    sessions.forEach(s => {
      const item = document.createElement("div");
      item.className = "session-item";
      item.style.cursor = "pointer";
      item.title = "Click to replay conversation transcript";
      const mins = Math.ceil((s.duration_seconds || 0) / 60);
      item.innerHTML = `
        <div style="flex:1;">
          <div class="session-topic">${escapeHtml(s.language || 'Language')} · ${escapeHtml(s.topic || "General")} <span style="font-size:12px;font-weight:normal;color:var(--mute);">(${s.level || "Beginner"})</span></div>
          <div class="session-details">${new Date(s.started_at).toLocaleDateString()} · ${mins} min${mins === 1 ? '' : 's'} · ${s.turns_count || 0} turns</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="session-score">Score: ${s.score || 8}/10</div>
          <button class="btn-sm" style="border:1px solid var(--line);background:var(--soft);">View Transcript 💬</button>
        </div>
      `;
      item.onclick = () => openSessionReplay(s);
      list.appendChild(item);
    });
  } catch (e) {
    list.innerHTML = `<p style="color:var(--danger);">Failed to load sessions.</p>`;
  }
}

function openSessionReplay(session) {
  const modal = $("modal-session-replay");
  if (!modal) return;
  const title = $("replay-title");
  const sub = $("replay-subtitle");
  const log = $("replay-messages-log");

  if (title) title.textContent = `${session.language || 'Conversation'} · ${session.topic || 'General'}`;
  if (sub) {
    const mins = Math.ceil((session.duration_seconds || 0) / 60);
    sub.textContent = `${new Date(session.started_at).toLocaleString()} · ${mins} mins · Score: ${session.score || 8}/10`;
  }
  if (log) {
    log.innerHTML = "";
    const msgs = session.messages || [];
    if (!msgs.length) {
      log.innerHTML = `<p style="color:var(--mute);text-align:center;padding:24px;">No messages recorded in this call.</p>`;
    } else {
      msgs.forEach(m => {
        const bubble = document.createElement("div");
        bubble.className = `m ${m.role === 'user' ? 'me' : 'ai'}`;
        if (m.role === 'user') {
          bubble.innerHTML = `<div class="zh">${escapeHtml(m.zh)}</div>`;
        } else {
          bubble.innerHTML = `
            <div class="zh">${escapeHtml(m.zh)}</div>
            ${m.pinyin ? `<div class="py">${escapeHtml(m.pinyin)}</div>` : ""}
            <div class="en">${escapeHtml(m.en)}</div>
            ${m.fix ? `<div class="fix" style="margin-top:6px;font-size:13px;color:var(--brown);"><strong>Roast / Correction:</strong> ${escapeHtml(m.fix)}</div>` : ""}
            <div class="m-actions">
              <button class="btn-bubble btn-replay-listen">🔊 Listen</button>
            </div>
          `;
          const btn = bubble.querySelector(".btn-replay-listen");
          if (btn) {
            btn.onclick = () => {
              const match = Object.values(LANGUAGES).find(l => l.name === session.language);
              speakText(m.zh, 0.9, match ? match.code : null);
            };
          }
        }
        log.appendChild(bubble);
      });
      log.scrollTop = 0;
    }
  }

  modal.classList.remove("hide");
}

function closeSessionReplay() {
  const modal = $("modal-session-replay");
  if (modal) modal.classList.add("hide");
}

// Build Prompt for active language tutor
function buildSystemPrompt() {
  const lang = currentLang();
  const currentLevel = LEVELS[state.level];
  const currentTopic = lang.topics[state.topic] || lang.topics[0];
  const isOpening = state.hist.length === 0;

  return `You are ${lang.tutor}, an AI tutor on a live audio phone call teaching ${lang.name} to an English speaker.
Learner Level: ${currentLevel}.
Call Scenario / Topic: ${currentTopic}.

${isOpening ? `CALL INITIATION / TURN 0 (PHONE JUST CONNECTED):
- The learner has NOT spoken yet. They just dialed in and picked up the call.
- Pick up the phone with character in ${lang.name} as ${lang.tutor}, greet the caller, set the context for the topic "${currentTopic}", and ask them an open question to kick off the dialogue.
- STRICT RULE: DO NOT roast, DO NOT mock, and DO NOT claim the user made any mistake because they haven't spoken yet!
- CRITICAL: "fix" MUST be empty string ("") on this opening turn.` : `TUTOR PERSONALITY & ATTITUDE (CRITICAL — BE MEAN, WITTY, CREATIVE & SAVAGE):
- ${lang.personality}
- NEVER be repetitive, boring, polite, or formulaic. Do NOT follow a mechanical 5-step checklist.
- WHEN THE LEARNER MAKES ANY MISTAKE (wrong grammar, broken vocabulary, ruined pronunciation/tones, wrong particles, bizarre literal translations, hesitation, or nonsense):
  1) LAUGH AT THEM openly: write out real laughter (e.g. "Haha!", "草 (LOL) ちょww", "哈哈哈哈！", "Jajaja ¡por favor!", "Pfft—hahaha!").
  2) MAKE FUN OF THEM and roast them with sharp, creative, sarcastic humor! Mock how ridiculous their sentence sounded (e.g. ask if they learned that from a broken toaster, joke about what strange thing they actually said, roast their accent with hilarious analogies).
  3) IN THE "fix" FIELD: Provide your savage roast + the exact, natural native sentence they should have used instead.
  4) DEMAND THEY FIX IT: Demand they repeat the corrected phrase properly without messing up.
- WHEN THE LEARNER DOES WELL:
  * Give begrudging, sarcastic credit (e.g. "Tsk, fine. You didn't completely butcher that one. Don't let your ego explode.", "Huh, acceptable. Shockingly human.").
  * Immediately hit them with a tougher question or witty comeback!`}

CONVERSATIONAL DYNAMICS:
- Keep the call lively, dynamic, and realistic. React directly to what the user actually said.
- Keep your target language sentence ("zh") natural, colloquial, and punchy.
- Always end your reply with a question, challenge, or prompt that demands the learner speak back.

STRICT JSON OUTPUT REQUIREMENT:
Reply ONLY with a valid JSON object matching:
{
  "zh": "your spoken reply in ${lang.name} script/characters (including your laughter and natural dialogue)",
  "pinyin": "${lang.phoneticLabel} / pronunciation guide for zh",
  "en": "natural English translation of zh",
  "fix": "${isOpening ? "" : "IF THE LEARNER ERRED: laugh at them, mock their slip-up with savage wit, and provide the exact corrected sentence. IF THEY SPOKE FLAWLESSLY: leave empty string or a witty sarcastic nod."}"
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
      await authFetch("/api/vocabulary", {
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
  const trimmed = (userInputText || "").trim();

  if (trimmed) {
    appendBubble("me", trimmed);
    state.hist.push({ role: "user", content: trimmed });
  }

  setCallStatus(`${lang.tutor} is thinking...`);

  try {
    const res = await authFetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: buildSystemPrompt(),
        messages: state.hist.slice(-10),
        sessionId: state.sessionId,
        userText: trimmed,
        language: lang.name
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const aiResponse = await res.json();

    // Guard: Turn 0 / empty user input must NEVER have a roast/fix
    if (!trimmed) {
      aiResponse.fix = "";
    }

    state.hist.push({
      role: "assistant",
      zh: aiResponse.zh,
      pinyin: aiResponse.pinyin,
      en: aiResponse.en,
      fix: aiResponse.fix || ""
    });

    if (aiResponse.zh) state.sessionPhrases.push(aiResponse);
    if (aiResponse.fix && trimmed) {
      state.sessionMistakes.push({ input: trimmed, fix: aiResponse.fix });
    }

    appendBubble("ai", aiResponse);

    setCallStatus(`${lang.tutor} is speaking...`);
    if (!state.muted) {
      await speakText(aiResponse.zh, 0.9, lang.code);
      state.lastTutorSpokenText = aiResponse.zh;
      state.lastTutorTimestamp = Date.now();
      // Reverb guard: wait 800ms for room echo and speaker output to completely die down
      await new Promise(r => setTimeout(r, 800));
    }

    setCallStatus("Connected");
  } catch (err) {
    console.error("Turn error:", err);
    if (trimmed && state.hist.length && state.hist[state.hist.length - 1].content === trimmed) {
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
      scheduleRestart(200);
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

  // Echo/reverb guard: wait if tutor just finished speaking
  const elapsed = Date.now() - (state.lastTutorTimestamp || 0);
  if (elapsed < 600) {
    scheduleRestart(600 - elapsed);
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

        // Noise blip check (ignore single character or trivial ambient noise)
        if (textToSend.length < 2 && !/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/.test(textToSend)) {
          console.warn("[Audio Guard] Ignored noise blip:", textToSend);
          scheduleRestart(200);
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
  await authFetch("/api/session/start", {
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

  await authFetch("/api/session/end", {
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
  const savedTheme = localStorage.getItem("tinguin-theme") || localStorage.getItem("tingo-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  $("btn-theme-toggle").onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("tinguin-theme", next);
  };

  // Auth modal tab switching & form submission
  const tabLogin = $("tab-login");
  const tabReg = $("tab-register");
  if (tabLogin) tabLogin.onclick = () => setAuthMode("login");
  if (tabReg) tabReg.onclick = () => setAuthMode("register");
  const btnAuthClose = $("btn-auth-close");
  if (btnAuthClose) btnAuthClose.onclick = closeAuthModal;
  const authForm = $("auth-form");
  if (authForm) authForm.onsubmit = handleAuthSubmit;

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
  renderLanguageChips();
  selectLanguage("ja");

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
  const btnCloseReplay = $("btn-close-replay");
  if (btnCloseReplay) btnCloseReplay.onclick = closeSessionReplay;

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

  // Check user session
  checkAuthStatus();
  fetchProfile();
});
