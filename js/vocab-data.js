/**
 * Word Dungeon & Babel Tower - Vocabulary Database (Real-World Applied English)
 * 專為日常敘英文與商業英文設計，囊括：
 * 🏃 運動競技 (Sports) | 📰 時事新聞 (Current Events) | 💼 商務職場 (Business)
 * 📈 財金經濟 (Finance) | ✈️ 旅遊差旅 (Travel) | 🏛️ 國家外交 (Countries) | ☕ 日常生活 (Daily)
 * 完全屏除遊戲幻想詞彙，100% 聚焦真實世界的實用高頻英文！
 * 各單字皆完整支援 4 大動態題型 (詞性定義、填詞克漏字、拼字填空、語境邏輯問答)。
 */

const VOCAB_DATABASE = [
  {
    "id": "t1_routine",
    "tier": 1,
    "category": "daily",
    "categoryLabel": "日常生活",
    "word": "routine",
    "pos": "n.",
    "meaning": "日常慣例；常規",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "突發事件",
      "假期",
      "冒險"
    ],
    "sentence": "Drinking a glass of warm water has become part of her morning ______.",
    "sentenceZh": "喝一杯溫水已經成為她早晨日常生活慣例的一部分。",
    "sentenceTarget": "routine",
    "sentenceChoices": [
      "routine",
      "crisis",
      "vacation",
      "accident"
    ],
    "spellingWord": "r o _ t _ n e",
    "spellingMissing": [
      "u",
      "i"
    ],
    "spellingPool": [
      "u",
      "i",
      "a",
      "e",
      "o",
      "m"
    ],
    "qaQuestion": "Q: If someone follows a strict daily routine, what does that mean?",
    "qaChoices": [
      "They perform regular activities at consistent times each day.",
      "They never plan anything and change plans randomly.",
      "They travel to different foreign countries every weekend.",
      "They refuse to wake up before noon on weekdays."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t1_athlete",
    "tier": 1,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "athlete",
    "pos": "n.",
    "meaning": "運動員；田徑選手",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "教練",
      "裁判",
      "觀眾"
    ],
    "sentence": "The young ______ trained five hours every day to prepare for the marathon.",
    "sentenceZh": "這位年輕的運動員每天訓練五個小時以備戰馬拉松。",
    "sentenceTarget": "athlete",
    "sentenceChoices": [
      "athlete",
      "spectator",
      "tourist",
      "referee"
    ],
    "spellingWord": "a t h l _ t _",
    "spellingMissing": [
      "e",
      "e"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "t",
      "r"
    ],
    "qaQuestion": "Q: What is the main focus of a professional athlete before a tournament?",
    "qaChoices": [
      "Maintaining physical condition and sharpening competitive performance.",
      "Purchasing souvenirs and visiting amusement parks.",
      "Writing novels about historical events.",
      "Avoiding all forms of physical exercise."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t1_ticket",
    "tier": 1,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "ticket",
    "pos": "n.",
    "meaning": "票券；車票；機票",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "護照",
      "行李",
      "收據"
    ],
    "sentence": "Please show your train ______ to the conductor before boarding the express.",
    "sentenceZh": "在登上特快列車之前，請向列車長出示您的火車票。",
    "sentenceTarget": "ticket",
    "sentenceChoices": [
      "ticket",
      "luggage",
      "passport",
      "souvenir"
    ],
    "spellingWord": "t _ c k _ t",
    "spellingMissing": [
      "i",
      "e"
    ],
    "spellingPool": [
      "i",
      "e",
      "a",
      "o",
      "u",
      "s"
    ],
    "qaQuestion": "Q: What should a traveler do after purchasing an e-ticket online?",
    "qaChoices": [
      "Save the confirmation QR code or print the boarding document.",
      "Delete the email immediately without reading the details.",
      "Assume the flight departs without needing any verification.",
      "Ask the hotel receptionist to refund the train system."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t1_market",
    "tier": 1,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "market",
    "pos": "n.",
    "meaning": "市場；行情",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "工廠",
      "辦公室",
      "合約"
    ],
    "sentence": "The tech firm expanded its product line to enter the global ______.",
    "sentenceZh": "該科技公司擴充產品線以進軍全球市場。",
    "sentenceTarget": "market",
    "sentenceChoices": [
      "market",
      "factory",
      "warehouse",
      "basement"
    ],
    "spellingWord": "m _ r k _ t",
    "spellingMissing": [
      "a",
      "e"
    ],
    "spellingPool": [
      "a",
      "e",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: When analysts say a new brand has entered the domestic market, what occurred?",
    "qaChoices": [
      "The brand began selling goods to consumers in that country.",
      "The company decided to close down all its branch stores.",
      "Employees went on an international summer holiday.",
      "The product was permanently banned from public purchase."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t1_capital",
    "tier": 1,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "capital",
    "pos": "n.",
    "meaning": "首都；首府；資金",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "邊界",
      "港口",
      "島嶼"
    ],
    "sentence": "Tokyo is the bustling ______ city of Japan, known for its rapid transit.",
    "sentenceZh": "東京是日本繁忙的首都城市，以其便捷的大眾運輸聞名。",
    "sentenceTarget": "capital",
    "sentenceChoices": [
      "capital",
      "border",
      "harbor",
      "island"
    ],
    "spellingWord": "c _ p _ t a l",
    "spellingMissing": [
      "a",
      "i"
    ],
    "spellingPool": [
      "a",
      "i",
      "e",
      "o",
      "u",
      "l"
    ],
    "qaQuestion": "Q: Why is the capital city usually important to a nation?",
    "qaChoices": [
      "It serves as the seat of government and political administration.",
      "It is always the only city where residents speak English.",
      "It has no public transportation or government offices.",
      "It forbids foreign diplomats from visiting."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t2_flight",
    "tier": 2,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "flight",
    "pos": "n.",
    "meaning": "航班；飛行",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "飯店",
      "租車",
      "景點"
    ],
    "sentence": "Our direct ______ to London takes approximately thirteen hours from Taipei.",
    "sentenceZh": "我們從台北直飛倫敦的直達航班大約需要十三個小時。",
    "sentenceTarget": "flight",
    "sentenceChoices": [
      "flight",
      "hotel",
      "rental",
      "cruise"
    ],
    "spellingWord": "f l _ g h _",
    "spellingMissing": [
      "i",
      "t"
    ],
    "spellingPool": [
      "i",
      "t",
      "a",
      "e",
      "o",
      "k"
    ],
    "qaQuestion": "Q: If an airline passenger's flight is delayed by bad weather, what happens?",
    "qaChoices": [
      "The airplane departure time is postponed until conditions are safe.",
      "The passenger must immediately purchase a new passport.",
      "The destination city is automatically changed to another country.",
      "The airport cancels all future flights permanently."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t2_tournament",
    "tier": 2,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "tournament",
    "pos": "n.",
    "meaning": "錦標賽；聯賽",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "體育館",
      "獎牌",
      "跑道"
    ],
    "sentence": "Sixteen international basketball teams will compete in the summer ______.",
    "sentenceZh": "十六支國際籃球隊將在夏季錦標賽中一較高下。",
    "sentenceTarget": "tournament",
    "sentenceChoices": [
      "tournament",
      "stadium",
      "medal",
      "ticket"
    ],
    "spellingWord": "t o u r n _ m _ n t",
    "spellingMissing": [
      "a",
      "e"
    ],
    "spellingPool": [
      "a",
      "e",
      "i",
      "o",
      "u",
      "s"
    ],
    "qaQuestion": "Q: How does a team advance to the finals in a knockout tournament?",
    "qaChoices": [
      "By winning each round against competing opponent teams.",
      "By paying extra registration fees after losing a match.",
      "By skipping all scheduled games and waiting at home.",
      "By drawing lots without playing on the court."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t2_budget",
    "tier": 2,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "budget",
    "pos": "n.",
    "meaning": "預算；經費",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "債務",
      "利息",
      "收據"
    ],
    "sentence": "The marketing department must stay within its annual advertising ______.",
    "sentenceZh": "行銷部門必須將開支控制在其年度廣告預算之內。",
    "sentenceTarget": "budget",
    "sentenceChoices": [
      "budget",
      "debt",
      "interest",
      "penalty"
    ],
    "spellingWord": "b _ d g _ t",
    "spellingMissing": [
      "u",
      "e"
    ],
    "spellingPool": [
      "u",
      "e",
      "a",
      "o",
      "i",
      "d"
    ],
    "qaQuestion": "Q: What does creating a monthly household budget help families achieve?",
    "qaChoices": [
      "Managing spending and saving money for future expenses.",
      "Spending as much money as possible without tracking costs.",
      "Borrowing loans without intending to pay them back.",
      "Avoiding working at any job permanently."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t2_citizen",
    "tier": 2,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "citizen",
    "pos": "n.",
    "meaning": "公民；國民",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "遊客",
      "外賓",
      "移民官"
    ],
    "sentence": "Every adult ______ has the democratic right to cast a vote in the election.",
    "sentenceZh": "每位成年公民在選舉中都有投票的民主權利。",
    "sentenceTarget": "citizen",
    "sentenceChoices": [
      "citizen",
      "tourist",
      "refugee",
      "alien"
    ],
    "spellingWord": "c _ t _ z e n",
    "spellingMissing": [
      "i",
      "i"
    ],
    "spellingPool": [
      "i",
      "a",
      "e",
      "o",
      "u",
      "z"
    ],
    "qaQuestion": "Q: What legal responsibility is commonly associated with being a citizen?",
    "qaChoices": [
      "Obeying national laws and participating in civic duties.",
      "Refusing to hold an identification card or passport.",
      "Traveling overseas without valid immigration documents.",
      "Ignoring public community rules and safety regulations."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t2_weather",
    "tier": 2,
    "category": "daily",
    "categoryLabel": "日常生活",
    "word": "weather",
    "pos": "n.",
    "meaning": "天氣；氣候狀況",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "季節",
      "溫度計",
      "預報員"
    ],
    "sentence": "The outdoor tennis match was postponed because of rainy ______.",
    "sentenceZh": "戶外網球比賽因雨天而延期舉行。",
    "sentenceTarget": "weather",
    "sentenceChoices": [
      "weather",
      "season",
      "climate",
      "forecast"
    ],
    "spellingWord": "w _ a t h _ r",
    "spellingMissing": [
      "e",
      "e"
    ],
    "spellingPool": [
      "e",
      "a",
      "o",
      "u",
      "i",
      "t"
    ],
    "qaQuestion": "Q: Why do event organizers check the weather forecast before holding an open-air marathon?",
    "qaChoices": [
      "To prepare for severe conditions like storms or extreme heat.",
      "To decide what color medals to manufacture for winners.",
      "To increase the entry fees for all registered participants.",
      "To cancel the awards ceremony permanently."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t3_coach",
    "tier": 3,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "coach",
    "pos": "n.",
    "meaning": "教練；指導老師",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "球童",
      "贊助商",
      "記者"
    ],
    "sentence": "The head ______ designed a tactical defense plan for the championship game.",
    "sentenceZh": "總教練為冠軍賽設計了一套戰術防守計畫。",
    "sentenceTarget": "coach",
    "sentenceChoices": [
      "coach",
      "sponsor",
      "spectator",
      "reporter"
    ],
    "spellingWord": "c _ _ c h",
    "spellingMissing": [
      "o",
      "a"
    ],
    "spellingPool": [
      "o",
      "a",
      "e",
      "i",
      "u",
      "r"
    ],
    "qaQuestion": "Q: What is the main responsibility of a sports coach during training?",
    "qaChoices": [
      "Instructing players in skills, fitness, and game strategy.",
      "Selling drinks and snacks to fans in the stadium seats.",
      "Writing articles criticizing opposing teams online.",
      "Replacing the referee whenever a foul is called."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t3_client",
    "tier": 3,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "client",
    "pos": "n.",
    "meaning": "客戶；委託人",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "雇員",
      "競爭對手",
      "面試者"
    ],
    "sentence": "The account manager scheduled a video conference with their key corporate ______.",
    "sentenceZh": "業務專案經理安排了與他們重要企業客戶的視訊會議。",
    "sentenceTarget": "client",
    "sentenceChoices": [
      "client",
      "intern",
      "rival",
      "applicant"
    ],
    "spellingWord": "c l _ _ n t",
    "spellingMissing": [
      "i",
      "e"
    ],
    "spellingPool": [
      "i",
      "e",
      "a",
      "o",
      "u",
      "t"
    ],
    "qaQuestion": "Q: Why is maintaining good communication with a client critical in business?",
    "qaChoices": [
      "It fosters long-term trust and ensures project requirements are satisfied.",
      "It allows companies to overcharge without providing services.",
      "It forces the client to sign contracts without reading the terms.",
      "It guarantees that no rival company exists in the market."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t3_passport",
    "tier": 3,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "passport",
    "pos": "n.",
    "meaning": "護照；通行證",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "駕照",
      "登機證",
      "保險單"
    ],
    "sentence": "You must ensure your ______ is valid for at least six months before international travel.",
    "sentenceZh": "出國旅行前，您必須確保護照有效期至少還有六個月。",
    "sentenceTarget": "passport",
    "sentenceChoices": [
      "passport",
      "license",
      "voucher",
      "receipt"
    ],
    "spellingWord": "p _ s s p _ r t",
    "spellingMissing": [
      "a",
      "o"
    ],
    "spellingPool": [
      "a",
      "o",
      "e",
      "i",
      "u",
      "s"
    ],
    "qaQuestion": "Q: When arriving at international airport customs, what document must you present?",
    "qaChoices": [
      "A valid national passport and boarding pass.",
      "A library borrowing card and restaurant menu.",
      "A fitness club membership confirmation.",
      "A high school graduation diploma."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t3_schedule",
    "tier": 3,
    "category": "daily",
    "categoryLabel": "日常生活",
    "word": "schedule",
    "pos": "n.",
    "meaning": "日程表；時間表",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "成績單",
      "收據",
      "日記"
    ],
    "sentence": "The project coordinator updated the weekly work ______ to reflect new milestones.",
    "sentenceZh": "專案協調員更新了每週工作時程表以反映新的里程碑。",
    "sentenceTarget": "schedule",
    "sentenceChoices": [
      "schedule",
      "transcript",
      "receipt",
      "invoice"
    ],
    "spellingWord": "s c h _ d _ l e",
    "spellingMissing": [
      "e",
      "u"
    ],
    "spellingPool": [
      "e",
      "u",
      "a",
      "o",
      "i",
      "r"
    ],
    "qaQuestion": "Q: If a train is running strictly on schedule, what does that indicate?",
    "qaChoices": [
      "It arrives and departs at the exact designated timetable hours.",
      "It has broken down and stopped between two distant stations.",
      "It skipped all intermediate stops without passenger notice.",
      "It was cancelled due to unexpected mechanical trouble."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t3_culture",
    "tier": 3,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "culture",
    "pos": "n.",
    "meaning": "文化；文明",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "經濟",
      "工業",
      "法規"
    ],
    "sentence": "Experiencing local food and festivals helps tourists understand the country's rich ______.",
    "sentenceZh": "體驗當地美食與節慶有助於遊客了解該國豐富的文化。",
    "sentenceTarget": "culture",
    "sentenceChoices": [
      "culture",
      "industry",
      "statute",
      "monopoly"
    ],
    "spellingWord": "c _ l t _ r e",
    "spellingMissing": [
      "u",
      "u"
    ],
    "spellingPool": [
      "u",
      "a",
      "e",
      "o",
      "i",
      "l"
    ],
    "qaQuestion": "Q: Why is cultural exchange beneficial between two partner nations?",
    "qaChoices": [
      "It promotes mutual understanding and strengthens diplomatic ties.",
      "It requires both nations to merge their sovereign governments.",
      "It forces both countries to eliminate their national languages.",
      "It restricts citizens from traveling to foreign historical sites."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t4_destination",
    "tier": 4,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "destination",
    "pos": "n.",
    "meaning": "目的地；終點",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "出發地",
      "中途站",
      "導覽圖"
    ],
    "sentence": "Paris remains one of the most popular tourist ______ in Europe.",
    "sentenceZh": "巴黎仍然是歐洲最受歡迎的旅遊目的地之一。",
    "sentenceTarget": "destination",
    "sentenceChoices": [
      "destination",
      "departure",
      "layover",
      "origin"
    ],
    "spellingWord": "d e s t _ n _ t i o n",
    "spellingMissing": [
      "i",
      "a"
    ],
    "spellingPool": [
      "i",
      "a",
      "e",
      "o",
      "u",
      "s"
    ],
    "qaQuestion": "Q: When booking a long-haul journey, what does final destination refer to?",
    "qaChoices": [
      "The ultimate place a traveler intends to reach at the end of the trip.",
      "The first airport where the plane stops for refueling.",
      "The travel agency office where tickets were purchased.",
      "The hotel where the passenger stayed before departing."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t4_election",
    "tier": 4,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "election",
    "pos": "n.",
    "meaning": "選舉；推選",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "抗議",
      "審判",
      "法案"
    ],
    "sentence": "Voters across the nation participated in the presidential ______ yesterday.",
    "sentenceZh": "全國選民昨天參與了總統大選投票。",
    "sentenceTarget": "election",
    "sentenceChoices": [
      "election",
      "protest",
      "trial",
      "strike"
    ],
    "spellingWord": "e l _ c t _ o n",
    "spellingMissing": [
      "e",
      "i"
    ],
    "spellingPool": [
      "e",
      "i",
      "a",
      "o",
      "u",
      "c"
    ],
    "qaQuestion": "Q: What is the main outcome of a democratic national election?",
    "qaChoices": [
      "Citizens choose their representatives and leaders by casting ballots.",
      "Government officials dissolve the constitution indefinitely.",
      "All public schools and hospitals are closed down permanently.",
      "Citizens are barred from expressing political viewpoints."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t4_stadium",
    "tier": 4,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "stadium",
    "pos": "n.",
    "meaning": "大型體育場；競技場",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "更衣室",
      "售票亭",
      "跑道"
    ],
    "sentence": "Over sixty thousand cheering fans packed the ______ for the World Cup qualifiers.",
    "sentenceZh": "逾六萬名熱情歡呼的球迷湧入體育場觀看世界盃資格賽。",
    "sentenceTarget": "stadium",
    "sentenceChoices": [
      "stadium",
      "locker",
      "booth",
      "tunnel"
    ],
    "spellingWord": "s t _ d _ u m",
    "spellingMissing": [
      "a",
      "i"
    ],
    "spellingPool": [
      "a",
      "i",
      "e",
      "o",
      "u",
      "m"
    ],
    "qaQuestion": "Q: What facility is essential when designing a modern sports stadium?",
    "qaChoices": [
      "Spacious spectator seating and emergency exit corridors.",
      "Underground mining tunnels for excavation workers.",
      "Farmland dedicated to cultivating seasonal vegetables.",
      "A factory for manufacturing heavy industrial turbines."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t4_border",
    "tier": 4,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "border",
    "pos": "n.",
    "meaning": "國界；邊境；邊緣",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "首都",
      "內陸",
      "海域"
    ],
    "sentence": "Customs officers inspect passports and freight cargo along the international ______.",
    "sentenceZh": "海關官員在國際邊境沿線檢查護照與貨運貨物。",
    "sentenceTarget": "border",
    "sentenceChoices": [
      "border",
      "capital",
      "inland",
      "plateau"
    ],
    "spellingWord": "b _ r d _ r",
    "spellingMissing": [
      "o",
      "e"
    ],
    "spellingPool": [
      "o",
      "e",
      "a",
      "i",
      "u",
      "d"
    ],
    "qaQuestion": "Q: Why do countries maintain checkpoints at their territorial borders?",
    "qaChoices": [
      "To regulate immigration, cross-border trade, and national security.",
      "To prevent all domestic citizens from ever traveling abroad.",
      "To eliminate the necessity for foreign diplomatic embassies.",
      "To prohibit foreign airlines from flying in international airspaces."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t4_bargain",
    "tier": 4,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "bargain",
    "pos": "v.",
    "meaning": "討價還價；達成協議",
    "distractorsPos": [
      "n.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "全額付款",
      "拒絕交易",
      "退款投訴"
    ],
    "sentence": "Shoppers often ______ with market vendors to obtain discounts on bulk purchases.",
    "sentenceZh": "買家常在市集與攤販討價還價以爭取批量購買的折扣。",
    "sentenceTarget": "bargain",
    "sentenceChoices": [
      "bargain",
      "monopolize",
      "forfeit",
      "default"
    ],
    "spellingWord": "b _ r g _ _ n",
    "spellingMissing": [
      "a",
      "a",
      "i"
    ],
    "spellingPool": [
      "a",
      "i",
      "e",
      "o",
      "u",
      "g"
    ],
    "qaQuestion": "Q: When two business parties bargain over contract terms, what are they doing?",
    "qaChoices": [
      "Negotiating conditions until they reach a mutually acceptable agreement.",
      "Filing lawsuits against each other in court immediately.",
      "Ignoring communications and walking away permanently.",
      "Agreeing blindly to every demand without review."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t5_conference",
    "tier": 5,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "conference",
    "pos": "n.",
    "meaning": "研討會；大型商務會議",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "招待會",
      "面試",
      "尾牙"
    ],
    "sentence": "Industry experts gathered at the international tech ______ to discuss artificial intelligence.",
    "sentenceZh": "各界產業專家齊聚國際科技研討會，共同探討人工智慧的發展。",
    "sentenceTarget": "conference",
    "sentenceChoices": [
      "conference",
      "banquet",
      "interview",
      "vacation"
    ],
    "spellingWord": "c o n f _ r _ n c e",
    "spellingMissing": [
      "e",
      "e"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: What is a major purpose for business professionals attending an industry conference?",
    "qaChoices": [
      "Networking with peers and learning about emerging market trends.",
      "Avoiding company emails and taking an unexcused absence.",
      "Replacing all current suppliers without signing contracts.",
      "Refusing to share insights or listen to presentations."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t5_marathon",
    "tier": 5,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "marathon",
    "pos": "n.",
    "meaning": "馬拉松長跑；耐力考驗",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "短跑衝刺",
      "跳高",
      "游泳接力"
    ],
    "sentence": "Completing a 42-kilometer ______ requires months of disciplined endurance training.",
    "sentenceZh": "完成一場42公里的馬拉松長跑需要數月嚴格的耐力訓練。",
    "sentenceTarget": "marathon",
    "sentenceChoices": [
      "marathon",
      "sprint",
      "hurdle",
      "relay"
    ],
    "spellingWord": "m _ r _ t h o n",
    "spellingMissing": [
      "a",
      "a"
    ],
    "spellingPool": [
      "a",
      "e",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: What physical quality is most critical for athletes running in a marathon?",
    "qaChoices": [
      "Cardiovascular endurance and efficient energy pacing.",
      "Heavy muscular bulk for short explosive weightlifting.",
      "Ability to hold one's breath underwater for ten minutes.",
      "Speed in changing footwear every half kilometer."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t5_currency",
    "tier": 5,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "currency",
    "pos": "n.",
    "meaning": "貨幣；流通金錢",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "支票本",
      "信用額度",
      "稅單"
    ],
    "sentence": "Travelers exchange their domestic money for foreign ______ before landing abroad.",
    "sentenceZh": "旅客在抵達國外之前將本國貨幣兌換為外幣。",
    "sentenceTarget": "currency",
    "sentenceChoices": [
      "currency",
      "debt",
      "tariff",
      "dividend"
    ],
    "spellingWord": "c _ r r _ n c y",
    "spellingMissing": [
      "u",
      "e"
    ],
    "spellingPool": [
      "u",
      "e",
      "a",
      "o",
      "i",
      "y"
    ],
    "qaQuestion": "Q: How do fluctuations in foreign exchange rates affect overseas travelers?",
    "qaChoices": [
      "They change the purchasing power of the traveler's home currency abroad.",
      "They alter the flight distance between the departure and destination cities.",
      "They invalidate the traveler's passport stamps immediately.",
      "They force airlines to replace airplane pilots upon arrival."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t5_treaty",
    "tier": 5,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "treaty",
    "pos": "n.",
    "meaning": "國際條約；協定",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "制裁",
      "衝突",
      "政變"
    ],
    "sentence": "Both governments signed a peace ______ to officially end decades of border tension.",
    "sentenceZh": "兩國政府簽署了一項和平條約，正式結束數十年來的邊界緊張局勢。",
    "sentenceTarget": "treaty",
    "sentenceChoices": [
      "treaty",
      "sanction",
      "dispute",
      "embargo"
    ],
    "spellingWord": "t r _ _ t y",
    "spellingMissing": [
      "e",
      "a"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: When two sovereign nations ratify an international trade treaty, what is the effect?",
    "qaChoices": [
      "Both parties agree to legally binding rules governing commerce and tariffs.",
      "One nation automatically takes ownership of the other nation's land.",
      "Citizens of both countries lose their existing legal rights.",
      "International trade between the two nations is completely prohibited."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t5_luggage",
    "tier": 5,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "luggage",
    "pos": "n.",
    "meaning": "行李；行裝",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "貨櫃",
      "免稅商品",
      "登機門"
    ],
    "sentence": "Passengers must pick up their checked ______ at the baggage claim carousel.",
    "sentenceZh": "乘客必須在行李提取轉盤處領取託運行李。",
    "sentenceTarget": "luggage",
    "sentenceChoices": [
      "luggage",
      "container",
      "duty-free",
      "gate"
    ],
    "spellingWord": "l _ g g _ g e",
    "spellingMissing": [
      "u",
      "a"
    ],
    "spellingPool": [
      "u",
      "a",
      "e",
      "o",
      "i",
      "g"
    ],
    "qaQuestion": "Q: What should you do if your checked luggage fails to arrive at the airport terminal?",
    "qaChoices": [
      "Report the missing baggage to the airline claim desk with your baggage tag.",
      "Leave the airport immediately and buy another plane ticket.",
      "Accuse fellow passengers waiting by the carousel of taking it.",
      "Assume the suitcase was discarded permanently and take no action."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t6_contract",
    "tier": 6,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "contract",
    "pos": "n.",
    "meaning": "合約；契約",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "收據",
      "發票",
      "備忘錄"
    ],
    "sentence": "The corporate lawyer carefully reviewed all clauses in the supplier ______.",
    "sentenceZh": "公司法務律師仔細審閱了供應商合約中的所有條款。",
    "sentenceTarget": "contract",
    "sentenceChoices": [
      "contract",
      "receipt",
      "invoice",
      "brochure"
    ],
    "spellingWord": "c _ n t r _ c t",
    "spellingMissing": [
      "o",
      "a"
    ],
    "spellingPool": [
      "o",
      "a",
      "e",
      "i",
      "u",
      "t"
    ],
    "qaQuestion": "Q: Why is signing a formal written contract important before delivering goods?",
    "qaChoices": [
      "It legally defines payment obligations, deadlines, and liability terms.",
      "It allows either party to cancel without paying for delivered items.",
      "It guarantees that neither company needs to follow labor laws.",
      "It serves only as decorative paperwork with no legal binding power."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t6_transit",
    "tier": 6,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "transit",
    "pos": "n.",
    "meaning": "過境；轉運；大眾運輸",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "終點站",
      "售票口",
      "跑道"
    ],
    "sentence": "The city invested in rapid ______ lines to ease traffic congestion in downtown areas.",
    "sentenceZh": "這座城市投資建設大眾捷運路線，以緩解市中心的交通擁堵。",
    "sentenceTarget": "transit",
    "sentenceChoices": [
      "transit",
      "terminal",
      "runway",
      "hangar"
    ],
    "spellingWord": "t r _ n s _ t",
    "spellingMissing": [
      "a",
      "i"
    ],
    "spellingPool": [
      "a",
      "i",
      "e",
      "o",
      "u",
      "s"
    ],
    "qaQuestion": "Q: What does a passenger do during a flight transit at an intermediate hub?",
    "qaChoices": [
      "Stays in the airport transfer area before boarding a connecting flight.",
      "Cancels the remaining trip and buys a house in the intermediate country.",
      "Leaves the aircraft permanently without retrieving checked luggage.",
      "Demands the airport authorities to build a direct railway back home."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t6_referee",
    "tier": 6,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "referee",
    "pos": "n.",
    "meaning": "裁判員；仲裁人",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "守門員",
      "教練",
      "隊長"
    ],
    "sentence": "The football ______ blew his whistle and awarded a penalty kick for the foul.",
    "sentenceZh": "足球裁判鳴哨並針對犯規判罰了十二碼罰球。",
    "sentenceTarget": "referee",
    "sentenceChoices": [
      "referee",
      "goalkeeper",
      "skipper",
      "commentator"
    ],
    "spellingWord": "r _ f _ r e e",
    "spellingMissing": [
      "e",
      "e"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: What is the primary role of an official referee during a competitive match?",
    "qaChoices": [
      "Enforcing tournament rules impartially and ensuring fair play.",
      "Cheering loudly for the home team to encourage their victory.",
      "Replacing injured athletes and scoring goals on the field.",
      "Deciding ticket prices for fans attending the match."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t6_pollution",
    "tier": 6,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "pollution",
    "pos": "n.",
    "meaning": "環境污染；公害",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "保育",
      "綠化",
      "回收"
    ],
    "sentence": "Environmental agencies introduced stricter vehicle emission limits to combat air ______.",
    "sentenceZh": "環保機構推出更嚴格的車輛廢氣排放限制以防治空氣污染。",
    "sentenceTarget": "pollution",
    "sentenceChoices": [
      "pollution",
      "conservation",
      "forestry",
      "recycling"
    ],
    "spellingWord": "p _ l l _ t i o n",
    "spellingMissing": [
      "o",
      "u"
    ],
    "spellingPool": [
      "o",
      "u",
      "a",
      "e",
      "i",
      "l"
    ],
    "qaQuestion": "Q: Why do city mayors urge residents to adopt public transit instead of driving?",
    "qaChoices": [
      "To cut greenhouse emissions and decrease urban air pollution.",
      "To force private automotive companies to shut down completely.",
      "To eliminate all sidewalks and pedestrian crossings in the city.",
      "To ban international tourists from visiting historical monuments."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t6_sovereign",
    "tier": 6,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "sovereign",
    "pos": "adj.",
    "meaning": "主權獨立的；最高統治的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "附屬的",
      "殖民的",
      "中立的"
    ],
    "sentence": "Every ______ nation has the legal authority to enforce laws within its own territory.",
    "sentenceZh": "每個主權獨立的國家均有權在其自身領土內執行法律。",
    "sentenceTarget": "sovereign",
    "sentenceChoices": [
      "sovereign",
      "dependent",
      "colonial",
      "subordinate"
    ],
    "spellingWord": "s _ v _ r e i g n",
    "spellingMissing": [
      "o",
      "e"
    ],
    "spellingPool": [
      "o",
      "e",
      "a",
      "i",
      "u",
      "v"
    ],
    "qaQuestion": "Q: What does respect for sovereign borders imply under international law?",
    "qaChoices": [
      "No foreign power should infringe upon another nation's territory without consent.",
      "All countries must combine their national currencies into one unit.",
      "Nations are forbidden from establishing embassies in foreign capitals.",
      "Countries must dissolve their domestic defense military branches."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t7_negotiate",
    "tier": 7,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "negotiate",
    "pos": "v.",
    "meaning": "談判；協商；交涉",
    "distractorsPos": [
      "n.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "強加",
      "放棄",
      "終止"
    ],
    "sentence": "The trade representatives met in Geneva to ______ a bilateral reduction in tariffs.",
    "sentenceZh": "貿易代表們在日內瓦會面，以協商雙邊關稅的調降。",
    "sentenceTarget": "negotiate",
    "sentenceChoices": [
      "negotiate",
      "terminate",
      "forfeit",
      "dictate"
    ],
    "spellingWord": "n _ g _ t i a t e",
    "spellingMissing": [
      "e",
      "o"
    ],
    "spellingPool": [
      "e",
      "o",
      "a",
      "i",
      "u",
      "g"
    ],
    "qaQuestion": "Q: What is the primary objective when two corporate executives negotiate a partnership?",
    "qaChoices": [
      "Finding common ground and drafting terms beneficial to both companies.",
      "Demanding that the other firm surrender all assets without compensation.",
      "Avoiding signing any documentation while spreading rumors publicly.",
      "Canceling all existing customer orders and shutting down warehouses."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t7_dividend",
    "tier": 7,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "dividend",
    "pos": "n.",
    "meaning": "股利；股息；分紅",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "虧損",
      "破產",
      "罰金"
    ],
    "sentence": "Following a profitable quarter, the board declared a cash ______ of two dollars per share.",
    "sentenceZh": "在一個獲利的季度之後，董事會宣布每股發放兩美元的現金股利。",
    "sentenceTarget": "dividend",
    "sentenceChoices": [
      "dividend",
      "deficit",
      "penalty",
      "collateral"
    ],
    "spellingWord": "d _ v _ d e n d",
    "spellingMissing": [
      "i",
      "i"
    ],
    "spellingPool": [
      "i",
      "a",
      "e",
      "o",
      "u",
      "d"
    ],
    "qaQuestion": "Q: Why do long-term investors favor purchasing stocks that pay steady dividends?",
    "qaChoices": [
      "They provide reliable passive cash flow in addition to potential share appreciation.",
      "They guarantee that company revenues can never decline during a recession.",
      "They exempt the investor from having to pay any taxes on employment income.",
      "They force the corporation to eliminate all research and development expenses."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t7_embassy",
    "tier": 7,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "embassy",
    "pos": "n.",
    "meaning": "大使館；使館館員",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "監獄",
      "邊檢站",
      "海關碼頭"
    ],
    "sentence": "Citizens who lost their passports overseas sought emergency assistance from their national ______.",
    "sentenceZh": "在海外遺失護照的公民向其本國大使館尋求緊急協助。",
    "sentenceTarget": "embassy",
    "sentenceChoices": [
      "embassy",
      "border",
      "harbor",
      "barracks"
    ],
    "spellingWord": "e m b _ s s _",
    "spellingMissing": [
      "a",
      "y"
    ],
    "spellingPool": [
      "a",
      "y",
      "e",
      "i",
      "o",
      "s"
    ],
    "qaQuestion": "Q: What diplomatic service does a national embassy provide to its traveling citizens?",
    "qaChoices": [
      "Issuing emergency travel documents and providing consular protection.",
      "Paying for all personal hotel bills and souvenir purchases.",
      "Guaranteeing immediate approval of university degrees.",
      "Supplying free international airline tickets for vacations."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t7_endurance",
    "tier": 7,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "endurance",
    "pos": "n.",
    "meaning": "耐力；持久力；忍耐",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "衝刺",
      "疲憊",
      "退賽"
    ],
    "sentence": "Cross-country cyclists rely on exceptional cardiovascular ______ to conquer steep mountain stages.",
    "sentenceZh": "越野自由車選手依賴卓越的心肺耐力來征服陡峭的山路賽段。",
    "sentenceTarget": "endurance",
    "sentenceChoices": [
      "endurance",
      "exhaustion",
      "hesitation",
      "forfeit"
    ],
    "spellingWord": "e n d _ r _ n c e",
    "spellingMissing": [
      "u",
      "a"
    ],
    "spellingPool": [
      "u",
      "a",
      "e",
      "i",
      "o",
      "d"
    ],
    "qaQuestion": "Q: How do long-distance runners build muscular endurance over time?",
    "qaChoices": [
      "Through consistent aerobic training, tempo runs, and proper recovery.",
      "By avoiding all cardiovascular exercise for six consecutive weeks.",
      "By consuming only fast food and skipping hydration during training.",
      "By lifting maximum weights without ever doing aerobic exercise."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t7_summit",
    "tier": 7,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "summit",
    "pos": "n.",
    "meaning": "峰會；首腦會議；頂點",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "公聽會",
      "記者招待會",
      "底層"
    ],
    "sentence": "Global leaders convened at the climate ______ to set binding emissions targets.",
    "sentenceZh": "全球各國領導人齊聚氣候峰會，以設定具約束力的減排目標。",
    "sentenceTarget": "summit",
    "sentenceChoices": [
      "summit",
      "bottom",
      "hearing",
      "recess"
    ],
    "spellingWord": "s _ m m _ t",
    "spellingMissing": [
      "u",
      "i"
    ],
    "spellingPool": [
      "u",
      "i",
      "a",
      "e",
      "o",
      "m"
    ],
    "qaQuestion": "Q: What is the defining characteristic of a diplomatic summit meeting?",
    "qaChoices": [
      "Heads of state and high-ranking leaders gather to tackle major global issues.",
      "Junior interns meet to organize the office filing cabinet.",
      "Tourists gather at a national park to exchange photography tips.",
      "Athletes compete in a local regional swimming competition."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t8_inflation",
    "tier": 8,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "inflation",
    "pos": "n.",
    "meaning": "通貨膨脹；物價上漲",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "通貨緊縮",
      "繁榮",
      "破產"
    ],
    "sentence": "The central bank raised benchmark interest rates to rein in persistent ______. ",
    "sentenceZh": "中央銀行調高基準利率以抑制持續存在的通貨膨脹。",
    "sentenceTarget": "inflation",
    "sentenceChoices": [
      "inflation",
      "stagnation",
      "deflation",
      "prosperity"
    ],
    "spellingWord": "i n f l _ t _ o n",
    "spellingMissing": [
      "a",
      "i"
    ],
    "spellingPool": [
      "a",
      "i",
      "e",
      "o",
      "u",
      "l"
    ],
    "qaQuestion": "Q: When annual inflation rises significantly, what is the impact on consumers?",
    "qaChoices": [
      "Everyday goods cost more, eroding the general purchasing power of money.",
      "Supermarkets give away groceries for free to all residents.",
      "All bank loans are automatically forgiven without repayment.",
      "The price of housing and fuel drops to near zero."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t8_domestic",
    "tier": 8,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "domestic",
    "pos": "adj.",
    "meaning": "國內的；家庭的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "國際的",
      "跨國的",
      "外貿的"
    ],
    "sentence": "The ministry introduced tax incentives to boost ______ manufacturing and employment.",
    "sentenceZh": "該部會推出了稅收優惠政策以刺激國內製造業與就業增長。",
    "sentenceTarget": "domestic",
    "sentenceChoices": [
      "domestic",
      "foreign",
      "multinational",
      "external"
    ],
    "spellingWord": "d _ m _ s t i c",
    "spellingMissing": [
      "o",
      "e"
    ],
    "spellingPool": [
      "o",
      "e",
      "a",
      "i",
      "u",
      "m"
    ],
    "qaQuestion": "Q: What differentiates domestic airline flights from international flights?",
    "qaChoices": [
      "Domestic flights depart and land within the borders of the same sovereign nation.",
      "Domestic flights always require travelers to undergo foreign passport visa checks.",
      "Domestic flights never carry passengers who hold national identity cards.",
      "Domestic flights must land in at least three foreign countries before landing."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t8_championship",
    "tier": 8,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "championship",
    "pos": "n.",
    "meaning": "錦標賽冠軍；最高榮譽",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "資格賽",
      "初賽",
      "落敗"
    ],
    "sentence": "The national team hoisted the trophy after winning the world ______ in overtime.",
    "sentenceZh": "國家隊在延長賽贏得世界冠軍錦標後高舉獎盃。",
    "sentenceTarget": "championship",
    "sentenceChoices": [
      "championship",
      "qualifier",
      "relegation",
      "exhibition"
    ],
    "spellingWord": "c h _ m p _ o n s h i p",
    "spellingMissing": [
      "a",
      "i"
    ],
    "spellingPool": [
      "a",
      "i",
      "e",
      "o",
      "u",
      "m"
    ],
    "qaQuestion": "Q: What does claiming the league championship trophy symbolize for a sports franchise?",
    "qaChoices": [
      "Finishing as the highest-ranked and most victorious team of that season.",
      "Being eliminated from the tournament during the very first round.",
      "Being disqualified due to administrative registration delays.",
      "Refusing to participate in the upcoming seasonal games."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t8_itinerary",
    "tier": 8,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "itinerary",
    "pos": "n.",
    "meaning": "旅遊行程表；旅行路線",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "紀念品",
      "簽證",
      "登機牌"
    ],
    "sentence": "Our detailed travel ______ includes visits to Kyoto's historic temples and Osaka Castle.",
    "sentenceZh": "我們詳細的旅遊行程表包括參觀京都的歷史寺廟與大阪城。",
    "sentenceTarget": "itinerary",
    "sentenceChoices": [
      "itinerary",
      "souvenir",
      "customs",
      "manifest"
    ],
    "spellingWord": "i t _ n _ r a r y",
    "spellingMissing": [
      "i",
      "e"
    ],
    "spellingPool": [
      "i",
      "e",
      "a",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: Why is reviewing an itinerary helpful before embarking on a business trip abroad?",
    "qaChoices": [
      "It lays out meeting schedules, hotel reservations, and transportation timings.",
      "It guarantees that no passport is required when passing international customs.",
      "It eliminates the need to pay for any flights or accommodation.",
      "It allows employees to cancel all company meetings without telling supervisors."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t8_partnership",
    "tier": 8,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "partnership",
    "pos": "n.",
    "meaning": "合夥關係；戰略合作",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "對抗",
      "壟斷",
      "訴訟"
    ],
    "sentence": "The automaker formed a strategic ______ with a battery maker to produce electric vehicles.",
    "sentenceZh": "該汽車製造商與電池製造商建立了戰略合作夥伴關係以生產電動車。",
    "sentenceTarget": "partnership",
    "sentenceChoices": [
      "partnership",
      "monopoly",
      "lawsuit",
      "rivalry"
    ],
    "spellingWord": "p _ r t n _ r s h i p",
    "spellingMissing": [
      "a",
      "e"
    ],
    "spellingPool": [
      "a",
      "e",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: How does entering a strategic partnership assist tech companies entering new markets?",
    "qaChoices": [
      "By sharing expertise, distribution channels, and research resources.",
      "By legally forcing competitors to cease selling their own products.",
      "By closing down all existing retail stores and laying off the workforce.",
      "By refusing to license technology to any domestic customer."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t9_diplomacy",
    "tier": 9,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "diplomacy",
    "pos": "n.",
    "meaning": "外交手腕；國際交涉",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "武力威脅",
      "侵略",
      "封鎖"
    ],
    "sentence": "The ambassador resolved the territorial dispute through skillful and patient ______.",
    "sentenceZh": "大使透過高超且有耐心的外交手腕化解了領土爭端。",
    "sentenceTarget": "diplomacy",
    "sentenceChoices": [
      "diplomacy",
      "aggression",
      "blockade",
      "invasion"
    ],
    "spellingWord": "d _ p l _ m a c y",
    "spellingMissing": [
      "i",
      "o"
    ],
    "spellingPool": [
      "i",
      "o",
      "a",
      "e",
      "u",
      "p"
    ],
    "qaQuestion": "Q: What is the cornerstone goal of international diplomacy among sovereign nations?",
    "qaChoices": [
      "Resolving conflicts peacefully and cultivating constructive bilateral relationships.",
      "Initiating military confrontations over minor disagreements.",
      "Cutting off all trade communications and severing maritime shipping.",
      "Compelling foreign nations to abandon their cultural traditions."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t9_sustainable",
    "tier": 9,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "sustainable",
    "pos": "adj.",
    "meaning": "永續的；可持續發展的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "短暫的",
      "破壞性的",
      "耗竭的"
    ],
    "sentence": "Investing in solar and wind power is vital to building a ______ energy infrastructure.",
    "sentenceZh": "投資太陽能與風力發電對於建構永續的能源基礎設施至關重要。",
    "sentenceTarget": "sustainable",
    "sentenceChoices": [
      "sustainable",
      "depleted",
      "destructive",
      "transient"
    ],
    "spellingWord": "s _ s t _ i n a b l e",
    "spellingMissing": [
      "u",
      "a"
    ],
    "spellingPool": [
      "u",
      "a",
      "e",
      "i",
      "o",
      "s"
    ],
    "qaQuestion": "Q: What does sustainable economic development seek to achieve for future generations?",
    "qaChoices": [
      "Meeting current human needs without compromising the ecological well-being of the future.",
      "Consuming all natural mineral reserves as rapidly as possible.",
      "Banning all public investments in renewable infrastructure.",
      "Shutting down agriculture and relying entirely on synthetic chemical foods."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t9_deficit",
    "tier": 9,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "deficit",
    "pos": "n.",
    "meaning": "赤字；虧損額",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "盈餘",
      "暴利",
      "儲蓄"
    ],
    "sentence": "The government drafted fiscal reforms to narrow the expanding national budget ______.",
    "sentenceZh": "政府起草財政改革方案以縮減日益擴大的國家預算赤字。",
    "sentenceTarget": "deficit",
    "sentenceChoices": [
      "deficit",
      "surplus",
      "windfall",
      "dividend"
    ],
    "spellingWord": "d _ f _ c i t",
    "spellingMissing": [
      "e",
      "i"
    ],
    "spellingPool": [
      "e",
      "i",
      "a",
      "o",
      "u",
      "f"
    ],
    "qaQuestion": "Q: What does it mean when a nation runs a persistent trade deficit?",
    "qaChoices": [
      "The value of goods and services imported exceeds the total value of its exports.",
      "The country produces ten times more food than its population can consume.",
      "Foreign tourists are completely forbidden from spending money domestically.",
      "The national government has accumulated infinite gold reserves."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t9_hospitality",
    "tier": 9,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "hospitality",
    "pos": "n.",
    "meaning": "好客；餐旅業；殷勤款待",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "冷漠",
      "敵意",
      "拒載"
    ],
    "sentence": "The five-star resort is renowned for offering warm and attentive Japanese ______.",
    "sentenceZh": "這家五星級渡假村以提供溫馨細膩的日式款待服務而聞名。",
    "sentenceTarget": "hospitality",
    "sentenceChoices": [
      "hospitality",
      "hostility",
      "neglect",
      "arrogance"
    ],
    "spellingWord": "h _ s p _ t a l i t y",
    "spellingMissing": [
      "o",
      "i"
    ],
    "spellingPool": [
      "o",
      "i",
      "a",
      "e",
      "u",
      "s"
    ],
    "qaQuestion": "Q: Why is guest satisfaction crucial in the global hospitality industry?",
    "qaChoices": [
      "Positive traveler reviews and repeat visits drive hotel revenue and reputation.",
      "Hotels prefer discouraging tourists from booking return reservations.",
      "Guest complaints allow hotels to cancel housekeeping services permanently.",
      "Staff members can avoid speaking courteously to international visitors."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t9_agility",
    "tier": 9,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "agility",
    "pos": "n.",
    "meaning": "敏捷度；靈活性",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "遲緩",
      "僵硬",
      "笨拙"
    ],
    "sentence": "Gymnasts must demonstrate exceptional speed, balance, and physical ______ on the beam.",
    "sentenceZh": "體操選手必須在平衡木上展現出非凡的速度、平衡感與身體敏捷度。",
    "sentenceTarget": "agility",
    "sentenceChoices": [
      "agility",
      "sluggishness",
      "clumsiness",
      "rigidity"
    ],
    "spellingWord": "a g _ l _ t y",
    "spellingMissing": [
      "i",
      "i"
    ],
    "spellingPool": [
      "i",
      "a",
      "e",
      "o",
      "u",
      "l"
    ],
    "qaQuestion": "Q: In high-speed sports like badminton or soccer, what does agility enable players to do?",
    "qaChoices": [
      "Change direction quickly and fluidly while maintaining full physical control.",
      "Remain completely stationary in one spot for the entire duration of the match.",
      "Ignore the flight of the ball or shuttlecock completely.",
      "Run only in a straight line without the ability to turn."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t10_vendor",
    "tier": 10,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "vendor",
    "pos": "n.",
    "meaning": "供應商；銷售商",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "採購員",
      "房東",
      "監管者"
    ],
    "sentence": "The procurement director solicited bids from three different IT hardware ______.",
    "sentenceZh": "採購處長向三家不同的資訊硬體供應商發出了比價招標邀請。",
    "sentenceTarget": "vendor",
    "sentenceChoices": [
      "vendor",
      "tenant",
      "auditor",
      "intern"
    ],
    "spellingWord": "v _ n d _ r",
    "spellingMissing": [
      "e",
      "o"
    ],
    "spellingPool": [
      "e",
      "o",
      "a",
      "i",
      "u",
      "d"
    ],
    "qaQuestion": "Q: What criteria should a company evaluate when selecting an external software vendor?",
    "qaChoices": [
      "Technical reliability, post-sale customer support, and competitive pricing.",
      "Whether the vendor refuses to sign non-disclosure confidentiality agreements.",
      "How many times the vendor has filed for corporate bankruptcy.",
      "The vendor's total lack of experience in the target industry."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t10_reservation",
    "tier": 10,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "reservation",
    "pos": "n.",
    "meaning": "預訂；預約",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "取消",
      "延遲",
      "退租"
    ],
    "sentence": "I called the front desk to confirm our hotel ______ for the upcoming trade expo.",
    "sentenceZh": "我致電前台以確認我們在即將舉行之貿易博覽會期間的飯店預訂。",
    "sentenceTarget": "reservation",
    "sentenceChoices": [
      "reservation",
      "cancellation",
      "eviction",
      "forfeiture"
    ],
    "spellingWord": "r e s _ r v _ t i o n",
    "spellingMissing": [
      "e",
      "a"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "u",
      "s"
    ],
    "qaQuestion": "Q: What confirmation document should a business traveler carry after making a flight reservation?",
    "qaChoices": [
      "The booking reference number and electronic ticket receipt.",
      "A signed handwritten note from an elementary school teacher.",
      "An expired driver's license from another country.",
      "A grocery store checkout receipt for fruit purchases."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t10_quarterly",
    "tier": 10,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "quarterly",
    "pos": "adj.",
    "meaning": "每季度的；按季發生的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "百年的",
      "每日的",
      "隨機的"
    ],
    "sentence": "The chief financial officer presented the ______ earnings report to board members.",
    "sentenceZh": "財務長向董事會成員提交了季度財報收益報告。",
    "sentenceTarget": "quarterly",
    "sentenceChoices": [
      "quarterly",
      "centennial",
      "sporadic",
      "accidental"
    ],
    "spellingWord": "q u _ r t _ r l y",
    "spellingMissing": [
      "a",
      "e"
    ],
    "spellingPool": [
      "a",
      "e",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: How often do publicly traded corporations release quarterly financial disclosures?",
    "qaChoices": [
      "Four times per year, covering each three-month fiscal period.",
      "Once every ten years after changing corporate directors.",
      "Every single business day before trading exchanges open.",
      "Only when the corporation experiences negative profits."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t10_campaign",
    "tier": 10,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "campaign",
    "pos": "n.",
    "meaning": "宣傳活動；競選活動；運動",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "休假",
      "停滯",
      "關閉"
    ],
    "sentence": "The public health ministry launched a nationwide ______ to encourage daily exercise.",
    "sentenceZh": "衛生部發起了一項全國性的宣導活動，鼓勵民眾每日進行體育運動。",
    "sentenceTarget": "campaign",
    "sentenceChoices": [
      "campaign",
      "recession",
      "stagnation",
      "closure"
    ],
    "spellingWord": "c _ m p _ _ g n",
    "spellingMissing": [
      "a",
      "a",
      "i"
    ],
    "spellingPool": [
      "a",
      "i",
      "e",
      "o",
      "u",
      "m"
    ],
    "qaQuestion": "Q: What is the primary purpose of a commercial product marketing campaign?",
    "qaChoices": [
      "To build brand awareness and attract prospective customers to purchase goods.",
      "To discourage all consumers from visiting retail storefronts.",
      "To replace existing employees with automated manufacturing equipment.",
      "To hide product features from the general buying public."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t10_teammate",
    "tier": 10,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "teammate",
    "pos": "n.",
    "meaning": "隊友；同隊隊員",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "對手",
      "裁判",
      "觀眾"
    ],
    "sentence": "The point guard delivered a precise no-look pass to his open ______ under the rim.",
    "sentenceZh": "控球後衛送出了一記精準的妙傳，球直接傳給了籃下無人防守的隊友。",
    "sentenceTarget": "teammate",
    "sentenceChoices": [
      "teammate",
      "opponent",
      "referee",
      "rival"
    ],
    "spellingWord": "t _ _ m m _ t e",
    "spellingMissing": [
      "e",
      "a",
      "a"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "u",
      "t"
    ],
    "qaQuestion": "Q: Why is mutual trust among teammates essential in professional relay sports?",
    "qaChoices": [
      "Seamless communication and baton handoffs require reliable cooperation.",
      "Teammates should try to run in opposite directions to confuse competitors.",
      "It allows individual runners to leave the track before the race concludes.",
      "Trust eliminates the necessity of adhering to tournament rules."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t11_supplier",
    "tier": 11,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "supplier",
    "pos": "n.",
    "meaning": "供應商；原料商",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "顧客",
      "零售客",
      "廣告商"
    ],
    "sentence": "Disruptions at the overseas ______ caused severe delays in vehicle assembly lines.",
    "sentenceZh": "海外供應商的營運中斷導致汽車組裝生產線出現嚴重延誤。",
    "sentenceTarget": "supplier",
    "sentenceChoices": [
      "supplier",
      "consumer",
      "shopper",
      "bystander"
    ],
    "spellingWord": "s _ p p l _ _ r",
    "spellingMissing": [
      "u",
      "i",
      "e"
    ],
    "spellingPool": [
      "u",
      "i",
      "e",
      "a",
      "o",
      "p"
    ],
    "qaQuestion": "Q: Why do multinational manufacturers maintain diversified supplier networks?",
    "qaChoices": [
      "To mitigate supply chain risks if a single regional supplier faces bottlenecks.",
      "To intentionally complicate logistics and delay shipments to retail customers.",
      "To avoid paying taxes in any country where products are fabricated.",
      "To ensure that no factory ever operates at full production capacity."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t11_merchandise",
    "tier": 11,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "merchandise",
    "pos": "n.",
    "meaning": "商品；貨物",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "保固期",
      "欠款",
      "折扣券"
    ],
    "sentence": "The department store arranged the new autumn ______ prominently near the entrance.",
    "sentenceZh": "百貨公司將新的秋季商品顯著陳列在入口附近。",
    "sentenceTarget": "merchandise",
    "sentenceChoices": [
      "merchandise",
      "warranty",
      "liability",
      "coupon"
    ],
    "spellingWord": "m _ r c h _ n d i s e",
    "spellingMissing": [
      "e",
      "a"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "u",
      "r"
    ],
    "qaQuestion": "Q: What does a retail store manager do when damaged merchandise arrives?",
    "qaChoices": [
      "Documents the defects and files a formal replacement claim with the distributor.",
      "Displays the broken items at full price without informing shoppers.",
      "Immediately closes the entire retail shop for the remainder of the year.",
      "Blames the retail shoppers who have not yet entered the department store."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t11_broadcast",
    "tier": 11,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "broadcast",
    "pos": "v.",
    "meaning": "轉播；播送；宣播",
    "distractorsPos": [
      "n.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "封鎖",
      "隱藏",
      "私藏"
    ],
    "sentence": "Major television networks will ______ the Olympic opening ceremony live worldwide.",
    "sentenceZh": "各大電視網絡將向全球現場直播奧運開幕式。",
    "sentenceTarget": "broadcast",
    "sentenceChoices": [
      "broadcast",
      "suppress",
      "censor",
      "conceal"
    ],
    "spellingWord": "b r _ _ d c _ s t",
    "spellingMissing": [
      "o",
      "a",
      "a"
    ],
    "spellingPool": [
      "o",
      "a",
      "e",
      "i",
      "u",
      "d"
    ],
    "qaQuestion": "Q: Why are sports broadcasting rights so valuable to television networks?",
    "qaChoices": [
      "Live athletic matches attract millions of concurrent viewers, generating massive ad revenue.",
      "Broadcasting matches requires zero technical equipment or camera operators.",
      "Television networks can charge athletes for permission to play on camera.",
      "Sports broadcasts are the only television programs allowed by law on weekends."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t11_excursion",
    "tier": 11,
    "category": "travel",
    "categoryLabel": "旅遊差旅",
    "word": "excursion",
    "pos": "n.",
    "meaning": "短途旅行；遠足景點遊覽",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "常住",
      "搬家",
      "隔離"
    ],
    "sentence": "Hotel guests booked a guided day ______ to explore the nearby coral reefs.",
    "sentenceZh": "飯店住客預訂了由導遊帶領的單日短途旅行，探索附近的珊瑚礁。",
    "sentenceTarget": "excursion",
    "sentenceChoices": [
      "excursion",
      "relocation",
      "quarantine",
      "residence"
    ],
    "spellingWord": "e x c _ r s _ _ n",
    "spellingMissing": [
      "u",
      "i",
      "o"
    ],
    "spellingPool": [
      "u",
      "i",
      "o",
      "a",
      "e",
      "s"
    ],
    "qaQuestion": "Q: What typically characterizes a cruise ship shore excursion?",
    "qaChoices": [
      "A scheduled local tour allowing passengers to sightsee before returning to the vessel.",
      "A permanent relocation where passengers abandon their cruise cabin.",
      "A mandatory physical fitness test conducted by maritime authorities.",
      "An unexpected emergency evacuation due to bad weather at sea."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t11_bilateral",
    "tier": 11,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "bilateral",
    "pos": "adj.",
    "meaning": "雙邊的；兩國間的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "單邊的",
      "三方的",
      "無關的"
    ],
    "sentence": "Both ministers signed a ______ aviation accord to increase daily commercial flights.",
    "sentenceZh": "雙方部長簽署了一項雙邊民航協議，以增加每日商業客運航班。",
    "sentenceTarget": "bilateral",
    "sentenceChoices": [
      "bilateral",
      "unilateral",
      "fragmented",
      "irrelevant"
    ],
    "spellingWord": "b _ l _ t _ r a l",
    "spellingMissing": [
      "i",
      "a",
      "e"
    ],
    "spellingPool": [
      "i",
      "a",
      "e",
      "o",
      "u",
      "l"
    ],
    "qaQuestion": "Q: What does a bilateral economic agreement entail between two governments?",
    "qaChoices": [
      "A binding pact negotiated directly between two specific nations.",
      "A worldwide decree issued unilaterally by a single monarch.",
      "An informal spoken conversation between two private citizens with no legal weight.",
      "A treaty that applies exclusively to polar wildlife sanctuaries."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t12_portfolio",
    "tier": 12,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "portfolio",
    "pos": "n.",
    "meaning": "投資組合；資產配置",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "借據",
      "破產宣告",
      "透支"
    ],
    "sentence": "Financial advisers recommend diversifying your investment ______ across bonds and equities.",
    "sentenceZh": "理財顧問建議將您的投資組合分散配置於債券與股票之間。",
    "sentenceTarget": "portfolio",
    "sentenceChoices": [
      "portfolio",
      "overdraft",
      "bankruptcy",
      "mortgage"
    ],
    "spellingWord": "p _ r t f _ l i o",
    "spellingMissing": [
      "o",
      "o"
    ],
    "spellingPool": [
      "o",
      "a",
      "e",
      "i",
      "u",
      "r"
    ],
    "qaQuestion": "Q: Why is asset diversification within an investment portfolio beneficial?",
    "qaChoices": [
      "It spreads capital across distinct asset classes to cushion against market volatility.",
      "It guarantees that an investor will never pay any financial advisory fees.",
      "It ensures that all invested funds are locked permanently without liquidity.",
      "It allows investors to predict exact stock price movements every minute."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t12_acquisition",
    "tier": 12,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "acquisition",
    "pos": "n.",
    "meaning": "企業收購；購得物",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "破產重整",
      "業務分拆",
      "自願解散"
    ],
    "sentence": "The pharmaceutical giant finalized the multibillion-dollar ______ of the biotech startup.",
    "sentenceZh": "該製藥巨頭完成了對這家生物科技新創公司價值數十億美元的收購案。",
    "sentenceTarget": "acquisition",
    "sentenceChoices": [
      "acquisition",
      "liquidation",
      "divestiture",
      "dissolution"
    ],
    "spellingWord": "a c q _ _ s i t i o n",
    "spellingMissing": [
      "u",
      "i"
    ],
    "spellingPool": [
      "u",
      "i",
      "a",
      "e",
      "o",
      "q"
    ],
    "qaQuestion": "Q: When a corporation announces a corporate acquisition, what has taken place?",
    "qaChoices": [
      "The purchasing company has bought controlling ownership of another target company.",
      "Both companies have permanently ceased all operations and dismissed their staff.",
      "The acquired company was forced to donate all assets to a charity organization.",
      "Employees of the buying company went on an unpaid corporate retreat."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t12_jurisdiction",
    "tier": 12,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "jurisdiction",
    "pos": "n.",
    "meaning": "司法管轄權；審判權限",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "豁免",
      "條約",
      "國籍"
    ],
    "sentence": "The cross-border financial fraud case fell under the legal ______ of the federal court.",
    "sentenceZh": "這起跨國金融詐欺案屬於聯邦法院的法律管轄權範圍之內。",
    "sentenceTarget": "jurisdiction",
    "sentenceChoices": [
      "jurisdiction",
      "immunity",
      "citizenship",
      "amendment"
    ],
    "spellingWord": "j _ r _ s d i c t i o n",
    "spellingMissing": [
      "u",
      "i"
    ],
    "spellingPool": [
      "u",
      "i",
      "a",
      "e",
      "o",
      "s"
    ],
    "qaQuestion": "Q: Why must multinational corporations determine legal jurisdiction in commercial contracts?",
    "qaChoices": [
      "To establish which country's laws and court system will resolve contractual disputes.",
      "To avoid paying employee salaries when opening foreign branches.",
      "To prohibit domestic consumers from purchasing imported merchandise.",
      "To prevent airlines from operating flights in international corridors."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t12_reform",
    "tier": 12,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "reform",
    "pos": "n.",
    "meaning": "體制改革；革新",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "倒退",
      "僵化",
      "解散"
    ],
    "sentence": "Parliament debated comprehensive tax ______ aimed at lowering burdens on small businesses.",
    "sentenceZh": "國會辯論了旨在減輕小型企業負擔的全面稅制改革方案。",
    "sentenceTarget": "reform",
    "sentenceChoices": [
      "reform",
      "stagnation",
      "regression",
      "abolition"
    ],
    "spellingWord": "r _ f _ r m",
    "spellingMissing": [
      "e",
      "o"
    ],
    "spellingPool": [
      "e",
      "o",
      "a",
      "i",
      "u",
      "r"
    ],
    "qaQuestion": "Q: What is the overarching objective of structural regulatory reform in governance?",
    "qaChoices": [
      "Improving institutional transparency, economic efficiency, and fairness for citizens.",
      "Preserving outdated bureaucratic loopholes that cause public frustration.",
      "Eliminating all public hospitals, roads, and educational institutions.",
      "Preventing democratic citizens from participating in public elections."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t12_athletic",
    "tier": 12,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "athletic",
    "pos": "adj.",
    "meaning": "運動的；體育強健的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "久坐的",
      "體弱的",
      "懶散的"
    ],
    "sentence": "Universities offer generous scholarships to attract students with outstanding ______ talent.",
    "sentenceZh": "各大學提供優渥的獎學金，以吸引具備傑出體育運動才能的學生。",
    "sentenceTarget": "athletic",
    "sentenceChoices": [
      "athletic",
      "sedentary",
      "feeble",
      "lethargic"
    ],
    "spellingWord": "a t h l _ t _ c",
    "spellingMissing": [
      "e",
      "i"
    ],
    "spellingPool": [
      "e",
      "i",
      "a",
      "o",
      "u",
      "t"
    ],
    "qaQuestion": "Q: What distinguishes an athletic training regimen from casual recreational walking?",
    "qaChoices": [
      "Structured intensity, periodized conditioning, and targeted physical performance goals.",
      "Avoiding all physical exertion whenever heart rate rises slightly.",
      "Engaging in training only once every six months without warm-ups.",
      "Refusing to drink water or eat nutritious meals during season training."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t13_conglomerate",
    "tier": 13,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "conglomerate",
    "pos": "n.",
    "meaning": "跨國企業集團；多角化企業",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "個體戶",
      "小作坊",
      "獨資商號"
    ],
    "sentence": "The international ______ operates subsidiaries across telecommunications, shipping, and retail.",
    "sentenceZh": "這家跨國企業集團旗下擁有跨足電信、航運與零售的多家子公司。",
    "sentenceTarget": "conglomerate",
    "sentenceChoices": [
      "conglomerate",
      "sole-proprietorship",
      "workshop",
      "cooperative"
    ],
    "spellingWord": "c _ n g l _ m _ r a t e",
    "spellingMissing": [
      "o",
      "o",
      "e"
    ],
    "spellingPool": [
      "o",
      "e",
      "a",
      "i",
      "u",
      "l"
    ],
    "qaQuestion": "Q: What strategic advantage does a massive corporate conglomerate hold over single-industry firms?",
    "qaChoices": [
      "Revenue diversification across multiple sectors buffers it when one market suffers a downturn.",
      "It is completely exempt from following all national labor, tax, and safety regulations.",
      "It requires zero capital investment to operate retail and manufacturing divisions.",
      "It can prevent all competitors worldwide from incorporating business entities."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t13_fiscal",
    "tier": 13,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "fiscal",
    "pos": "adj.",
    "meaning": "財政的；會計年度的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "精神的",
      "天氣的",
      "偶然的"
    ],
    "sentence": "The finance minister unveiled conservative ______ policies to curb excessive public borrowing.",
    "sentenceZh": "財政部長公布了穩健保守的財政政策，以抑制過度的公共舉債。",
    "sentenceTarget": "fiscal",
    "sentenceChoices": [
      "fiscal",
      "meteorological",
      "spiritual",
      "sporadic"
    ],
    "spellingWord": "f _ s c _ l",
    "spellingMissing": [
      "i",
      "a"
    ],
    "spellingPool": [
      "i",
      "a",
      "e",
      "o",
      "u",
      "s"
    ],
    "qaQuestion": "Q: What is the primary focus of national fiscal policy as opposed to monetary policy?",
    "qaChoices": [
      "Government taxation and public expenditure decisions rather than interest rate controls.",
      "Deciding which foreign diplomats can travel through international airports.",
      "Regulating the colors used in national sports team uniforms.",
      "Determining the weather broadcast schedules on national television."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t13_sovereignty",
    "tier": 13,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "sovereignty",
    "pos": "n.",
    "meaning": "國家主權；獨立統治權",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "依附",
      "殖民地",
      "臣服"
    ],
    "sentence": "The United Nations charter strictly affirms the territorial integrity and political ______ of member states.",
    "sentenceZh": "聯合國憲章嚴正重申會員國的領土完整與政治主權。",
    "sentenceTarget": "sovereignty",
    "sentenceChoices": [
      "sovereignty",
      "subjugation",
      "vassalage",
      "servitude"
    ],
    "spellingWord": "s _ v _ r e i g n t y",
    "spellingMissing": [
      "o",
      "e"
    ],
    "spellingPool": [
      "o",
      "e",
      "a",
      "i",
      "u",
      "v"
    ],
    "qaQuestion": "Q: What does upholding national sovereignty signify in international diplomatic relations?",
    "qaChoices": [
      "A nation's supreme, autonomous right to govern its territory and affairs without external coercion.",
      "The right of one superpower to annex neighboring states whenever it pleases.",
      "The obligation of all states to share a single unified legislative parliament.",
      "The abolition of borders, passports, and diplomatic credentials worldwide."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t13_sponsorship",
    "tier": 13,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "sponsorship",
    "pos": "n.",
    "meaning": "商業贊助；冠名贊助",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "抵制",
      "制裁",
      "罰款"
    ],
    "sentence": "The tennis star signed a lucrative multiannual ______ agreement with a luxury apparel brand.",
    "sentenceZh": "這位網球明星與一家精品服飾品牌簽署了豐厚的數年贊助合約。",
    "sentenceTarget": "sponsorship",
    "sentenceChoices": [
      "sponsorship",
      "boycott",
      "sanction",
      "forfeiture"
    ],
    "spellingWord": "s p _ n s _ r s h i p",
    "spellingMissing": [
      "o",
      "o"
    ],
    "spellingPool": [
      "o",
      "a",
      "e",
      "i",
      "u",
      "s"
    ],
    "qaQuestion": "Q: How do commercial brand sponsorships benefit professional athletic organizations?",
    "qaChoices": [
      "They provide essential financial backing in exchange for logo exposure and brand association.",
      "They require athletic teams to cease playing all televised tournament matches.",
      "They force athletes to work full-time in retail department stores without salary.",
      "They eliminate the need for teams to practice or adhere to league regulations."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t13_summitry",
    "tier": 13,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "summitry",
    "pos": "n.",
    "meaning": "峰會外交；首腦會晤機制",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "斷交",
      "武裝衝突",
      "單邊制裁"
    ],
    "sentence": "Modern bilateral ______ allows leaders to cut through bureaucratic red tape and secure accords.",
    "sentenceZh": "現代峰會外交使各國領導人能夠克服官僚繁文縟節並迅速敲定各項協定。",
    "sentenceTarget": "summitry",
    "sentenceChoices": [
      "summitry",
      "isolationism",
      "hostility",
      "secession"
    ],
    "spellingWord": "s _ m m _ t r y",
    "spellingMissing": [
      "u",
      "i"
    ],
    "spellingPool": [
      "u",
      "i",
      "a",
      "e",
      "o",
      "m"
    ],
    "qaQuestion": "Q: What is a strategic virtue of high-level diplomatic summitry during foreign crises?",
    "qaChoices": [
      "Direct face-to-face dialogue between top leaders can defuse tensions faster than lower-level diplomacy.",
      "It guarantees that all participating countries must dissolve their own domestic armed forces.",
      "It requires heads of state to conduct all conversations in complete public view without privacy.",
      "It eliminates the necessity for nations to appoint career diplomatic ambassadors."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t14_ecosystem",
    "tier": 14,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "ecosystem",
    "pos": "n.",
    "meaning": "生態系統；生態體系",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "人造建築",
      "荒漠化",
      "城市化"
    ],
    "sentence": "Rising ocean temperatures pose a catastrophic threat to the fragile coral reef ______.",
    "sentenceZh": "不斷上升的海洋溫度對脆弱的珊瑚礁生態系統構成了災難性的威脅。",
    "sentenceTarget": "ecosystem",
    "sentenceChoices": [
      "ecosystem",
      "urbanization",
      "desertification",
      "skyscraper"
    ],
    "spellingWord": "e c _ s _ s t e m",
    "spellingMissing": [
      "o",
      "y"
    ],
    "spellingPool": [
      "o",
      "y",
      "a",
      "e",
      "i",
      "s"
    ],
    "qaQuestion": "Q: Why are biologists deeply concerned by disruptions to a marine ecosystem?",
    "qaChoices": [
      "Extinction of keystone species can trigger widespread trophic cascades and biodiversity loss.",
      "Disruptions cause all ocean water to evaporate into outer space within hours.",
      "Marine animals will start migrating to inhabit high-altitude mountain forests.",
      "Corals will begin producing commercial synthetic plastics instead of calcium."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t14_protocol",
    "tier": 14,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "protocol",
    "pos": "n.",
    "meaning": "議定書；協議標準；標準作業程序",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "混亂",
      "隨性",
      "破例"
    ],
    "sentence": "The international research consortium instituted a stringent cybersecurity ______ to protect data.",
    "sentenceZh": "該國際研究聯盟制定了嚴格的網路資安標準作業程序以保護機密數據。",
    "sentenceTarget": "protocol",
    "sentenceChoices": [
      "protocol",
      "disorder",
      "hazard",
      "spontaneity"
    ],
    "spellingWord": "p r _ t _ c o l",
    "spellingMissing": [
      "o",
      "o"
    ],
    "spellingPool": [
      "o",
      "a",
      "e",
      "i",
      "u",
      "r"
    ],
    "qaQuestion": "Q: In corporate governance, why do research institutions follow standardized laboratory protocols?",
    "qaChoices": [
      "To ensure experiment reproducibility, ethical compliance, and worker safety.",
      "To encourage researchers to guess safety measures haphazardly without equipment.",
      "To prevent scientific findings from ever being reviewed by independent peers.",
      "To force scientists to work in total darkness without electrical power."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t14_demographic",
    "tier": 14,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "demographic",
    "pos": "adj.",
    "meaning": "人口統計的；人口學的",
    "distractorsPos": [
      "n.",
      "v.",
      "adv."
    ],
    "distractorsMeaning": [
      "地質的",
      "氣候的",
      "天文的"
    ],
    "sentence": "Aging societies face profound ______ shifts that impact labor markets and pension systems.",
    "sentenceZh": "高齡化社會面臨著深遠的人口結構變遷，這對勞動市場與退休金體系帶來衝擊。",
    "sentenceTarget": "demographic",
    "sentenceChoices": [
      "demographic",
      "geological",
      "astronomical",
      "meteorological"
    ],
    "spellingWord": "d _ m _ g r a p h i c",
    "spellingMissing": [
      "e",
      "o"
    ],
    "spellingPool": [
      "e",
      "o",
      "a",
      "i",
      "u",
      "m"
    ],
    "qaQuestion": "Q: What does analysis of a nation's demographic trends reveal to economic planners?",
    "qaChoices": [
      "Population age distributions, fertility rates, and projected workforce capacity.",
      "The chemical composition of underground tectonic plates in distant continents.",
      "The exact date when solar eclipses will occur over the next two centuries.",
      "The number of stars visible in the night sky during winter solstices."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t14_biomechanics",
    "tier": 14,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "biomechanics",
    "pos": "n.",
    "meaning": "生物力學；運動力學",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "心理學",
      "社會學",
      "天文學"
    ],
    "sentence": "High-performance coaches study athletes' ______ to refine running posture and prevent joint injuries.",
    "sentenceZh": "高水準體育教練深入研究選手的生物力學，以改善跑步姿態並預防關節受傷。",
    "sentenceTarget": "biomechanics",
    "sentenceChoices": [
      "biomechanics",
      "astronomy",
      "sociology",
      "paleontology"
    ],
    "spellingWord": "b _ _ m e c h a n i c s",
    "spellingMissing": [
      "i",
      "o"
    ],
    "spellingPool": [
      "i",
      "o",
      "a",
      "e",
      "u",
      "b"
    ],
    "qaQuestion": "Q: How do sports scientists apply the principles of biomechanics in elite sports?",
    "qaChoices": [
      "By analyzing kinetic force and joint angles to optimize athletic power and reduce injury risks.",
      "By convincing athletes to avoid wearing supportive athletic shoes during competition.",
      "By instructing runners to disregard aerodynamic resistance when sprinting.",
      "By prohibiting athletes from reviewing motion-capture video recordings."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t14_biodiversity",
    "tier": 14,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "biodiversity",
    "pos": "n.",
    "meaning": "生物多樣性；物種多樣性",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "單一作物",
      "物種滅絕",
      "荒地"
    ],
    "sentence": "Tropical rainforests harbor unparalleled ______ that is essential for global medical discoveries.",
    "sentenceZh": "熱帶雨林孕育著無可比擬的生物多樣性，這對全球醫藥研發至關重要。",
    "sentenceTarget": "biodiversity",
    "sentenceChoices": [
      "biodiversity",
      "monoculture",
      "extinction",
      "barrenness"
    ],
    "spellingWord": "b _ _ d i v e r s i t y",
    "spellingMissing": [
      "i",
      "o"
    ],
    "spellingPool": [
      "i",
      "o",
      "a",
      "e",
      "u",
      "b"
    ],
    "qaQuestion": "Q: Why is safeguarding global biodiversity deemed vital by international conservation treaties?",
    "qaChoices": [
      "Diverse ecological networks sustain pollination, water filtration, and ecosystem resilience.",
      "It allows multinational chemical companies to replace natural forests with parking structures.",
      "It ensures that only three species of domestic animals can survive worldwide.",
      "It eliminates the necessity for human beings to breathe atmospheric oxygen."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t15_austerity",
    "tier": 15,
    "category": "finance",
    "categoryLabel": "財金經濟",
    "word": "austerity",
    "pos": "n.",
    "meaning": "財政緊縮；撙節措施",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "揮霍浪費",
      "暴富",
      "過度消費"
    ],
    "sentence": "Facing mounting sovereign debt, the administration enacted stringent ______ measures.",
    "sentenceZh": "面對持續攀升的國債壓力，政府推行了嚴格的財政撙節措施。",
    "sentenceTarget": "austerity",
    "sentenceChoices": [
      "austerity",
      "extravagance",
      "profligacy",
      "largesse"
    ],
    "spellingWord": "a _ s t _ r i t y",
    "spellingMissing": [
      "u",
      "e"
    ],
    "spellingPool": [
      "u",
      "e",
      "a",
      "i",
      "o",
      "s"
    ],
    "qaQuestion": "Q: What economic tradeoff often occurs when a nation introduces fiscal austerity during a recession?",
    "qaChoices": [
      "Government deficits decrease, but reduced public spending can temporarily dampen economic growth.",
      "The country's national debt immediately doubles within twenty-four hours.",
      "All private commercial banks are legally mandated to distribute free gold to depositors.",
      "Citizens are no longer permitted to use currency to purchase essential household goods."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t15_hegemony",
    "tier": 15,
    "category": "country",
    "categoryLabel": "國家外交",
    "word": "hegemony",
    "pos": "n.",
    "meaning": "霸權；國際支配地位",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "平等人道",
      "附屬國",
      "無政府狀態"
    ],
    "sentence": "Political theorists debate whether the rise of emerging powers will challenge Western ______.",
    "sentenceZh": "政治理論家正在辯論新興大國的崛起是否將挑戰西方的霸權地位。",
    "sentenceTarget": "hegemony",
    "sentenceChoices": [
      "hegemony",
      "subjugation",
      "egalitarianism",
      "anarchy"
    ],
    "spellingWord": "h _ g _ m o n y",
    "spellingMissing": [
      "e",
      "e"
    ],
    "spellingPool": [
      "e",
      "a",
      "i",
      "o",
      "u",
      "g"
    ],
    "qaQuestion": "Q: In geopolitical science, what does regional hegemony describe?",
    "qaChoices": [
      "The political, economic, or military dominance of one state over others in its geopolitical sphere.",
      "A condition where every nation in the world has precisely equal military and economic strength.",
      "An agreement to dismantle all international maritime borders and custom barriers.",
      "A situation where diplomatic relations are outlawed between neighboring nations."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t15_consensus",
    "tier": 15,
    "category": "news",
    "categoryLabel": "時事新聞",
    "word": "consensus",
    "pos": "n.",
    "meaning": "共識；一致看法",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "爭端分裂",
      "內鬨",
      "僵局"
    ],
    "sentence": "After days of deliberations, delegates reached a broad ______ on carbon emission reduction.",
    "sentenceZh": "經過數天的密集協商，各國代表在碳排放削減上達成了廣泛共識。",
    "sentenceTarget": "consensus",
    "sentenceChoices": [
      "consensus",
      "discord",
      "deadlock",
      "factionalism"
    ],
    "spellingWord": "c _ n s _ n s u s",
    "spellingMissing": [
      "o",
      "e"
    ],
    "spellingPool": [
      "o",
      "e",
      "a",
      "i",
      "u",
      "s"
    ],
    "qaQuestion": "Q: What is achieved when multinational negotiators arrive at a diplomatic consensus?",
    "qaChoices": [
      "A collective agreement supported generally by all participating parties without formal objection.",
      "A permanent state of hostility leading to immediate border closures and naval battles.",
      "An outcome where none of the participating states agree on any written clause.",
      "A decree forcing all ambassadors to resign their posts permanently."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t15_consortium",
    "tier": 15,
    "category": "business",
    "categoryLabel": "商務職場",
    "word": "consortium",
    "pos": "n.",
    "meaning": "企業聯合體；財團；公會聯盟",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "獨資企業",
      "散戶",
      "破產財團"
    ],
    "sentence": "A multinational banking ______ provided the syndicate financing for the transnational pipeline.",
    "sentenceZh": "一個跨國銀行聯貸財團為該跨國管線工程提供了辛迪加融資。",
    "sentenceTarget": "consortium",
    "sentenceChoices": [
      "consortium",
      "individual",
      "dissolution",
      "sole-trader"
    ],
    "spellingWord": "c _ n s _ r t i u m",
    "spellingMissing": [
      "o",
      "o"
    ],
    "spellingPool": [
      "o",
      "a",
      "e",
      "i",
      "u",
      "s"
    ],
    "qaQuestion": "Q: Why do global engineering and financial firms form a consortium for mega-infrastructure projects?",
    "qaChoices": [
      "To pool massive capital, spread financial risks, and combine distinct technical capabilities.",
      "To intentionally delay project completion and forfeit their corporate operating licenses.",
      "To prevent any workers from ever being employed on the construction site.",
      "To ensure that none of the involved firms ever receive compensation or revenue."
    ],
    "qaCorrect": 0
  },
  {
    "id": "t15_resilience",
    "tier": 15,
    "category": "sports",
    "categoryLabel": "運動競技",
    "word": "resilience",
    "pos": "n.",
    "meaning": "復原力；韌性；抗逆力",
    "distractorsPos": [
      "v.",
      "adj.",
      "adv."
    ],
    "distractorsMeaning": [
      "脆弱易碎",
      "崩潰放棄",
      "怯懦逃避"
    ],
    "sentence": "Down two sets in the championship match, the champion demonstrated remarkable mental ______ to rally and win.",
    "sentenceZh": "在決賽連落後兩盤的逆境下，這位冠軍展現了驚人的心理韌性，奮起直追奪冠。",
    "sentenceTarget": "resilience",
    "sentenceChoices": [
      "resilience",
      "fragility",
      "defeatism",
      "complacency"
    ],
    "spellingWord": "r _ s _ l i e n c e",
    "spellingMissing": [
      "e",
      "i"
    ],
    "spellingPool": [
      "e",
      "i",
      "a",
      "o",
      "u",
      "s"
    ],
    "qaQuestion": "Q: What does psychological and physical resilience allow elite athletes to do when confronting setbacks?",
    "qaChoices": [
      "Recover from mistakes, adapt under pressure, and persist toward victory despite adversity.",
      "Concede the game immediately the moment an opponent scores a single point.",
      "Blame spectators in the arena and refuse to shake hands after the tournament.",
      "Retire from competitive sports permanently after losing an exhibition set."
    ],
    "qaCorrect": 0
  }
];
