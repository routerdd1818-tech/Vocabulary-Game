/**
 * Word Dungeon & Babel Tower - Game Database & Configurations
 * Bosses, Tower Scaling, Equipment, Foods, Leave Passes, Consumables, Dialogues.
 */

const GAME_CONFIG = {
  // Base Hero Stats
  HERO_BASE: {
    maxHp: 120,
    atk: 22,
    def: 10,
    timeBonus: 0
  },

  // Medieval Hero Classes / Forms
  HERO_CLASSES: [
    {
      id: 'knight',
      name: '聖堂聖騎士',
      title: '堅毅鋼鐵之壁',
      icon: 'shield',
      badge: '重裝防禦',
      bonusDesc: '基礎防禦 +8，生命上限 +30',
      bonus: { def: 8, hp: 30, atk: 0, timeBonus: 0, goldMultiplier: 0 },
      desc: '身披重裝板甲與十字戰袍，右手堅毅利刃、左手十字紋章大盾，代表忠誠與守護。'
    },
    {
      id: 'mage',
      name: '秘術大法師',
      title: '真理星辰引導者',
      icon: 'star',
      badge: '時限增長',
      bonusDesc: '作答時限 +1.5 秒，基礎攻擊 +8',
      bonus: { def: 0, hp: 0, atk: 8, timeBonus: 1.5, goldMultiplier: 0 },
      desc: '頭戴高頂星紋法師帽，身披奧術星塵法袍，懸浮魔導書與水晶魔杖，掌控時空與詞源。'
    },
    {
      id: 'ranger',
      name: '翠林巡林客',
      title: '疾風之影獵手',
      icon: 'sword',
      badge: '敏捷賞金',
      bonusDesc: '基礎攻擊 +14，戰鬥金幣 +15%',
      bonus: { def: 0, hp: 0, atk: 14, timeBonus: 0, goldMultiplier: 0.15 },
      desc: '佩戴巡林羽飾兜帽與精靈斗篷，背負羽箭長筒，手持獵風長弓，敏捷靈巧百發百中。'
    },
    {
      id: 'berserker',
      name: '維京狂戰士',
      title: '怒火破山之斧',
      icon: 'skull',
      badge: '極致攻擊',
      bonusDesc: '基礎攻擊 +22，生命上限 -10',
      bonus: { def: -2, hp: -10, atk: 22, timeBonus: 0, goldMultiplier: 0 },
      desc: '頭頂雄偉維京角盔，披覆巨熊毛皮肩甲，手持巨大雙刃開山巨斧，以狂暴攻勢摧毀一切。'
    },
    {
      id: 'valkyrie',
      name: '天馬女武神',
      title: '英靈神殿之翼',
      icon: 'crown',
      badge: '神聖高血',
      bonusDesc: '生命上限 +60，基礎防禦 +6',
      bonus: { def: 6, hp: 60, atk: 0, timeBonus: 0, goldMultiplier: 0 },
      desc: '頭戴天馬銀翼羽冠，金色披風迎風飄揚，手握神聖破魔長矛，兼具優雅與神威。'
    },
    {
      id: 'reaper',
      name: '暗影獵魔者',
      title: '死線潛行夜刃',
      icon: 'key',
      badge: '刺殺暴擊',
      bonusDesc: '基礎攻擊 +16，時限 +0.8 秒',
      bonus: { def: 0, hp: 10, atk: 16, timeBonus: 0.8, goldMultiplier: 0 },
      desc: '身著暗影夜行蒙面風衣，雙持劇毒黑曜石短刃，神出鬼沒直擊怪物要害。'
    }
  ],

  // Novice Passerby / Villager Base Profile (Before Passing Dojo)
  NOVICE_CLASS: {
    id: 'novice',
    name: '見習村民 (路人)',
    title: '尚未覺醒之平凡見習生',
    icon: 'sword',
    badge: '見習路人',
    bonusDesc: '基礎無職業加成，須前往修煉道場通過多益考核轉職',
    bonus: { def: 0, hp: 0, atk: 0, timeBonus: 0, goldMultiplier: 0 },
    desc: '身穿樸素粗麻布衣與麻質斗篷，手握見習木棒，看似毫無特殊技能的路人，卻懷抱著登上通天塔頂端的冒險意志。'
  },

  // 5 Tiers of Class Awakening System (GRE High-level Academic Vocabulary)
  CLASS_AWAKENING_CONFIG: {
    tiers: [
      { rank: 1, name: '一階覺醒・真理啟蒙', stars: '★☆☆☆☆', requiredCorrect: 5, maxMistakes: 2, timeLimit: 18.0, desc: '通過 5 題 GRE 高階詞彙考核（容錯 2 題）' },
      { rank: 2, name: '二階覺醒・奧術共鳴', stars: '★★☆☆☆', requiredCorrect: 7, maxMistakes: 2, timeLimit: 16.0, desc: '通過 7 題 GRE 高階詞彙考核（容錯 2 題）' },
      { rank: 3, name: '三階覺醒・極意破境', stars: '★★★☆☆', requiredCorrect: 10, maxMistakes: 1, timeLimit: 14.0, desc: '通過 10 題 GRE 高階詞彙考核（容錯 1 題）' },
      { rank: 4, name: '四階覺醒・英雄傳承', stars: '★★★★☆', requiredCorrect: 12, maxMistakes: 1, timeLimit: 12.0, desc: '通過 12 題 GRE 高階詞彙考核（容錯 1 題）' },
      { rank: 5, name: '五階覺醒・神域真姿', stars: '★★★★★', requiredCorrect: 15, maxMistakes: 0, timeLimit: 10.0, desc: '零失誤連續答對 15 題 GRE 極限詞彙（零容錯）' }
    ],
    bonuses: {
      knight: [
        null,
        { def: 14, hp: 60, atk: 5, timeBonus: 0, goldMultiplier: 0, desc: '防禦 +14，HP +60，攻擊 +5' },
        { def: 22, hp: 100, atk: 10, timeBonus: 0.5, goldMultiplier: 0, desc: '防禦 +22，HP +100，攻擊 +10，時限 +0.5s' },
        { def: 32, hp: 160, atk: 18, timeBonus: 1.0, goldMultiplier: 0, desc: '防禦 +32，HP +160，攻擊 +18，時限 +1.0s' },
        { def: 45, hp: 240, atk: 28, timeBonus: 1.5, goldMultiplier: 0.10, desc: '防禦 +45，HP +240，攻擊 +28，時限 +1.5s，金幣 +10%' },
        { def: 65, hp: 360, atk: 42, timeBonus: 2.0, goldMultiplier: 0.20, desc: '防禦 +65，HP +360，攻擊 +42，時限 +2.0s，金幣 +20%' }
      ],
      mage: [
        null,
        { def: 0, hp: 15, atk: 16, timeBonus: 2.2, goldMultiplier: 0, desc: '攻擊 +16，時限 +2.2s，HP +15' },
        { def: 6, hp: 30, atk: 26, timeBonus: 3.0, goldMultiplier: 0, desc: '攻擊 +26，時限 +3.0s，HP +30，防禦 +6' },
        { def: 12, hp: 50, atk: 38, timeBonus: 4.0, goldMultiplier: 0, desc: '攻擊 +38，時限 +4.0s，HP +50，防禦 +12' },
        { def: 20, hp: 75, atk: 54, timeBonus: 5.2, goldMultiplier: 0.15, desc: '攻擊 +54，時限 +5.2s，HP +75，防禦 +20，金幣 +15%' },
        { def: 30, hp: 110, atk: 75, timeBonus: 6.5, goldMultiplier: 0.30, desc: '攻擊 +75，時限 +6.5s，HP +110，防禦 +30，金幣 +30%' }
      ],
      ranger: [
        null,
        { def: 0, hp: 0, atk: 22, timeBonus: 0.5, goldMultiplier: 0.25, desc: '攻擊 +22，金幣 +25%，時限 +0.5s' },
        { def: 0, hp: 25, atk: 34, timeBonus: 1.0, goldMultiplier: 0.38, desc: '攻擊 +34，金幣 +38%，時限 +1.0s，HP +25' },
        { def: 8, hp: 45, atk: 48, timeBonus: 1.5, goldMultiplier: 0.52, desc: '攻擊 +48，金幣 +52%，時限 +1.5s，HP +45，防禦 +8' },
        { def: 16, hp: 70, atk: 66, timeBonus: 2.2, goldMultiplier: 0.68, desc: '攻擊 +66，金幣 +68%，時限 +2.2s，HP +70，防禦 +16' },
        { def: 26, hp: 105, atk: 90, timeBonus: 3.0, goldMultiplier: 0.90, desc: '攻擊 +90，金幣 +90%，時限 +3.0s，HP +105，防禦 +26' }
      ],
      berserker: [
        null,
        { def: 2, hp: -5, atk: 35, timeBonus: 0, goldMultiplier: 0, desc: '攻擊 +35，生命 -5，防禦 +2' },
        { def: 8, hp: 10, atk: 52, timeBonus: 0, goldMultiplier: 0, desc: '攻擊 +52，生命 +10，防禦 +8' },
        { def: 15, hp: 30, atk: 74, timeBonus: 0.5, goldMultiplier: 0, desc: '攻擊 +74，生命 +30，防禦 +15，時限 +0.5s' },
        { def: 24, hp: 55, atk: 102, timeBonus: 1.0, goldMultiplier: 0.12, desc: '攻擊 +102，生命 +55，防禦 +24，時限 +1.0s，金幣 +12%' },
        { def: 35, hp: 90, atk: 140, timeBonus: 1.5, goldMultiplier: 0.25, desc: '攻擊 +140，生命 +90，防禦 +35，時限 +1.5s，金幣 +25%' }
      ],
      valkyrie: [
        null,
        { def: 12, hp: 110, atk: 8, timeBonus: 0, goldMultiplier: 0, desc: 'HP +110，防禦 +12，攻擊 +8' },
        { def: 20, hp: 175, atk: 18, timeBonus: 0, goldMultiplier: 0, desc: 'HP +175，防禦 +20，攻擊 +18' },
        { def: 30, hp: 260, atk: 30, timeBonus: 0.8, goldMultiplier: 0, desc: 'HP +260，防禦 +30，攻擊 +30，時限 +0.8s' },
        { def: 42, hp: 365, atk: 45, timeBonus: 1.5, goldMultiplier: 0.10, desc: 'HP +365，防禦 +42，攻擊 +45，時限 +1.5s，金幣 +10%' },
        { def: 60, hp: 500, atk: 65, timeBonus: 2.2, goldMultiplier: 0.20, desc: 'HP +500，防禦 +60，攻擊 +65，時限 +2.2s，金幣 +20%' }
      ],
      reaper: [
        null,
        { def: 0, hp: 25, atk: 26, timeBonus: 1.4, goldMultiplier: 0, desc: '攻擊 +26，時限 +1.4s，HP +25' },
        { def: 8, hp: 45, atk: 40, timeBonus: 2.0, goldMultiplier: 0, desc: '攻擊 +40，時限 +2.0s，HP +45，防禦 +8' },
        { def: 16, hp: 70, atk: 58, timeBonus: 2.8, goldMultiplier: 0.15, desc: '攻擊 +58，時限 +2.8s，HP +70，防禦 +16，金幣 +15%' },
        { def: 25, hp: 100, atk: 78, timeBonus: 3.6, goldMultiplier: 0.25, desc: '攻擊 +78，時限 +3.6s，HP +100，防禦 +25，金幣 +25%' },
        { def: 36, hp: 140, atk: 106, timeBonus: 4.6, goldMultiplier: 0.40, desc: '攻擊 +106，時限 +4.6s，HP +140，防禦 +36，金幣 +40%' }
      ]
    }
  },

  // 15 Dungeon Bosses
  DUNGEON_BOSSES: [
    {
      id: 1,
      floorLabel: 'B1F',
      name: '翡翠史萊姆王',
      title: '新手森林深處',
      tier: 1,
      vocabScope: '學測 7000 單【Level 1 基礎生活】',
      maxHp: 180,
      atk: 14,
      def: 4,
      timeLimit: 18.0,
      goldReward: 20,
      firstClearBonus: 30,
      traitName: '微酸濺射',
      traitDesc: '每第 3 次攻擊附帶 4 點固定腐蝕傷害。'
    },
    {
      id: 2,
      floorLabel: 'B2F',
      name: '洞窟毒刺蜂后',
      title: '微風花谷地下',
      tier: 2,
      vocabScope: '學測 7000 單【Level 1 進階日常】',
      maxHp: 260,
      atk: 19,
      def: 8,
      timeLimit: 17.0,
      goldReward: 30,
      firstClearBonus: 40,
      traitName: '毒針連刺',
      traitDesc: '玩家答錯時額外附加 5 點固定毒素傷害。'
    },
    {
      id: 3,
      floorLabel: 'B3F',
      name: '地牢哥布林斥候',
      title: '廢棄哥布林營地',
      tier: 3,
      vocabScope: '學測 7000 單【Level 2 初級核心】',
      maxHp: 360,
      atk: 25,
      def: 12,
      timeLimit: 16.0,
      goldReward: 45,
      firstClearBonus: 50,
      traitName: '偷襲二連擊',
      traitDesc: '玩家答錯時 30% 機率觸發雙刀連斬 (造成 1.35x 總傷害)。'
    },
    {
      id: 4,
      floorLabel: 'B4F',
      name: '墓穴魔狼王',
      title: '月影殘月荒原',
      tier: 4,
      vocabScope: '學測 7000 單【Level 2 活用字彙】',
      maxHp: 480,
      atk: 33,
      def: 18,
      timeLimit: 15.0,
      goldReward: 60,
      firstClearBonus: 65,
      traitName: '狂風咆哮',
      traitDesc: '攻擊命中後使玩家下一題作答時限縮短 0.8 秒。'
    },
    {
      id: 5,
      floorLabel: 'B5F',
      name: '劇毒母蛛',
      title: '迷霧黑沼蛛巢',
      tier: 5,
      vocabScope: '學測 7000 單【Level 3 中級必考】',
      maxHp: 640,
      atk: 42,
      def: 25,
      timeLimit: 14.0,
      goldReward: 80,
      firstClearBonus: 80,
      traitName: '纏繞蛛網',
      traitDesc: '受擊後噴射黏網，使玩家下一題時限縮短 1.2 秒。'
    },
    {
      id: 6,
      floorLabel: 'B6F',
      name: '古鐘樓石像鬼',
      title: '暮光倒懸鐘樓',
      tier: 6,
      vocabScope: '學測 7000 單【Level 3 進階核心】',
      maxHp: 820,
      atk: 52,
      def: 38,
      timeLimit: 13.5,
      goldReward: 100,
      firstClearBonus: 100,
      traitName: '石化硬甲',
      traitDesc: '自帶厚重石膚，每 3 回合受傷減免 20%。'
    },
    {
      id: 7,
      floorLabel: 'B7F',
      name: '冥火骸骨騎士',
      title: '亡者墓園深淵',
      tier: 7,
      vocabScope: '學測 7000 單【Level 4 中高核心】',
      maxHp: 1050,
      atk: 65,
      def: 46,
      timeLimit: 12.5,
      goldReward: 125,
      firstClearBonus: 120,
      traitName: '破甲重斬',
      traitDesc: '攻擊時無視玩家 25% 防禦力。'
    },
    {
      id: 8,
      floorLabel: 'B8F',
      name: '迷宮狂暴牛頭人',
      title: '競技場地下迷宮',
      tier: 8,
      vocabScope: '學測 7000 單【Level 5 頂標字彙】',
      maxHp: 1350,
      atk: 80,
      def: 55,
      timeLimit: 12.0,
      goldReward: 150,
      firstClearBonus: 150,
      traitName: '嗜血怒吼',
      traitDesc: '半血以下進入狂暴狀態，攻擊力提升 20%。'
    },
    {
      id: 9,
      floorLabel: 'B9F',
      name: '暗河九頭蛇妖',
      title: '地下暗河水窟',
      tier: 9,
      vocabScope: '學測 7000 單【Level 6 滿級字彙】',
      maxHp: 1700,
      atk: 96,
      def: 65,
      timeLimit: 11.0,
      goldReward: 180,
      firstClearBonus: 180,
      traitName: '再生毒血',
      traitDesc: '玩家答錯時，蛇妖回復自身 4% 最大生命值。'
    },
    {
      id: 10,
      floorLabel: 'B10F',
      name: '極光女武神',
      title: '永凍極冰聖殿',
      tier: 10,
      vocabScope: '多益 TOEIC【550 職場基礎】',
      maxHp: 2100,
      atk: 115,
      def: 78,
      timeLimit: 10.5,
      goldReward: 210,
      firstClearBonus: 200,
      traitName: '寒霜凝結',
      traitDesc: '冰霜凍結思維，使下一題作答時限縮短 1.5 秒。'
    },
    {
      id: 11,
      floorLabel: 'B11F',
      name: '熔岩巨像兵',
      title: '地心熔爐祭壇',
      tier: 11,
      vocabScope: '多益 TOEIC【700 商務核心】',
      maxHp: 2600,
      atk: 138,
      def: 92,
      timeLimit: 9.5,
      goldReward: 250,
      firstClearBonus: 220,
      traitName: '熔岩灼燒',
      traitDesc: '受擊後附加灼燒，接下來 2 回合每題流失 4% 最大血量。'
    },
    {
      id: 12,
      floorLabel: 'B12F',
      name: '海溝利維坦',
      title: '暴風海溝暗潮',
      tier: 12,
      vocabScope: '多益 TOEIC【860 高階商務】',
      maxHp: 3200,
      atk: 165,
      def: 108,
      timeLimit: 9.0,
      goldReward: 300,
      firstClearBonus: 250,
      traitName: '海嘯吞噬',
      traitDesc: '穿透玩家 30% 防禦，並吸取造成傷害 25% 的血量回復自身。'
    },
    {
      id: 13,
      floorLabel: 'B13F',
      name: '神殿獅鷲獸皇',
      title: '天空神殿殿堂',
      tier: 13,
      vocabScope: '多益 TOEIC【990 滿分金色】',
      maxHp: 3900,
      atk: 195,
      def: 125,
      timeLimit: 8.0,
      goldReward: 360,
      firstClearBonus: 300,
      traitName: '雷霆俯衝',
      traitDesc: '40% 機率觸發致命暴擊 (1.4x 傷害) 並附帶破甲。'
    },
    {
      id: 14,
      floorLabel: 'B14F',
      name: '星界蝕日法師',
      title: '星界暗影魔塔',
      tier: 14,
      vocabScope: '托福 TOEFL【高階學術字彙】',
      maxHp: 4800,
      atk: 235,
      def: 145,
      timeLimit: 7.0,
      goldReward: 430,
      firstClearBonus: 350,
      traitName: '生命汲取',
      traitDesc: '吸收所造成傷害 35% 回血，並使下一題作答時限縮短 1.8 秒。'
    },
    {
      id: 15,
      floorLabel: 'B15F',
      name: '終焉時空古龍',
      title: '終焉王座時空縫隙',
      tier: 15,
      vocabScope: 'GRE 殿堂【神話魔王字彙】',
      maxHp: 6500,
      atk: 290,
      def: 175,
      timeLimit: 6.0,
      goldReward: 500,
      firstClearBonus: 500,
      traitName: '時空崩壞',
      traitDesc: '半血以下攻擊力提升 25%，每次攻擊附帶 8% 最大生命真實傷害。'
    }
  ],

  // 12 Tower Minion Keys
  TOWER_MINIONS: [
    { key: 'mini_slime', name: '洞窟小史萊姆' },
    { key: 'cave_bat', name: '幽暗吸血魔蝠' },
    { key: 'plague_rat', name: '地牢巨型噬骨鼠' },
    { key: 'shroom', name: '孢子走路毒蕈怪' },
    { key: 'goblin_grunt', name: '哥布林投石小鬼' },
    { key: 'skeleton_grunt', name: '殘破骸骨步兵' },
    { key: 'evil_eye', name: '漂浮深淵魔眼' },
    { key: 'mimic_chest', name: '偽裝噬人寶箱怪' }, // Bonus coin!
    { key: 'wisp', name: '墓穴幽藍鬼火' },
    { key: 'living_armor', name: '符文活體鐵甲兵' },
    { key: 'grimoire', name: '詛咒飛天魔典' },
    { key: 'void_worm', name: '虛空星界幼蟲' }
  ],

  // 16 Equipment items
  EQUIPMENT: {
    weapons: [
      { id: 'w1', tier: 1, name: '初心者木劍', price: 40, atk: 12, def: 0, hp: 0, desc: '質樸的橡木練習短劍。' },
      { id: 'w2', tier: 2, name: '王國精鋼長劍', price: 90, atk: 28, def: 4, hp: 0, desc: '閃耀銀白金屬光澤的騎士劍。' },
      { id: 'w3', tier: 3, name: '赤紅符文烈焰劍', price: 180, atk: 55, def: 0, hp: 40, desc: '劍身刻有火紋的發光魔劍。' },
      { id: 'w4', tier: 4, name: '極凍寒冰魔劍', price: 320, atk: 95, def: 15, hp: 0, desc: '散發冰晶寒氣的利刃。' },
      { id: 'w5', tier: 5, name: '蒼雷斬龍巨劍', price: 520, atk: 150, def: 25, hp: 120, desc: '纏繞藍白閃電弧光的重劍。' },
      { id: 'w6', tier: 6, name: '真理聖劍・詞源', price: 850, atk: 240, def: 45, hp: 250, desc: '流淌星河符文的傳說神兵。' }
    ],
    armors: [
      { id: 'a1', tier: 1, name: '翠林旅人皮甲', price: 40, hp: 60, def: 10, atk: 0, desc: '輕便皮革胸甲與遊俠披風。' },
      { id: 'a2', tier: 2, name: '銀翼衛隊鎖子甲', price: 90, hp: 150, def: 24, atk: 0, desc: '銀灰鋼鐵護肩與戰袍。' },
      { id: 'a3', tier: 3, name: '秘銀聖殿重鎧', price: 180, hp: 320, def: 45, atk: 0, desc: '亮銀色秘銀全身厚甲。' },
      { id: 'a4', tier: 4, name: '暗夜精靈幻影甲', price: 320, hp: 580, def: 75, atk: 0, desc: '深紫輕巧的高階附魔護甲。' },
      { id: 'a5', tier: 5, name: '紅蓮龍鱗戰甲', price: 520, hp: 950, def: 115, atk: 0, desc: '赤紅古龍鱗片鍛造的霸氣重甲。' },
      { id: 'a6', tier: 6, name: '不朽神聖蒼穹鎧', price: 850, hp: 1600, def: 170, atk: 0, desc: '耀金神聖戰甲，光之披風。' }
    ],
    relics: [
      { id: 'r1', tier: 1, name: '學者青銅懷錶', price: 70, hp: 40, atk: 8, def: 6, timeBonus: 1.0, desc: '漂浮身旁的微光青銅懷錶 (時限+1s)。' },
      { id: 'r2', tier: 2, name: '精靈風語耳環', price: 180, hp: 110, atk: 22, def: 15, timeBonus: 1.5, desc: '翠綠清風光環 (時限+1.5s)。' },
      { id: 'r3', tier: 3, name: '全知賢者魔戒', price: 380, hp: 260, atk: 50, def: 35, timeBonus: 2.2, desc: '腳下浮現智慧法陣 (時限+2.2s)。' },
      { id: 'r4', tier: 4, name: '永恆記憶王冠', price: 720, hp: 550, atk: 100, def: 65, timeBonus: 3.0, desc: '璀璨星芒王冠與神聖光圈 (時限+3s)。' }
    ]
  },

  // 10 Food items (5 regular + 5 timed buff)
  FOODS: [
    // Regular
    { id: 'bread', name: '地牢黑麥硬麵包', price: 8, healHp: 45, isFull: false, buff: null, desc: '純補血：立即回復 +45 HP。' },
    { id: 'soup', name: '螢光蘑菇濃湯', price: 16, healHp: 110, isFull: false, buff: null, desc: '純補血：立即回復 +110 HP。' },
    { id: 'drumstick', name: '矮人炭烤大肉腿', price: 32, healHp: 260, isFull: false, buff: null, desc: '純補血：立即回復 +260 HP。' },
    { id: 'steak', name: '魔獸厚切牛排', price: 65, healHp: 650, isFull: false, buff: null, desc: '純補血：立即回復 +650 HP。' },
    { id: 'chalice', name: '黃金生命聖杯', price: 105, healHp: 99999, isFull: true, buff: null, desc: '純補血：瞬間回復 100% 滿血！' },
    // Timed Buff
    {
      id: 'curry',
      name: '獄火龍息辛香咖哩',
      price: 40,
      healHp: 150,
      isFull: false,
      buff: { type: 'atk', val: 0.25, duration: 900, label: '攻擊力 +25%' },
      desc: '回血+150 HP 且 15 分鐘內【攻擊力 +25%】！'
    },
    {
      id: 'stew',
      name: '黑鐵矮人麥酒燉肉',
      price: 45,
      healHp: 220,
      isFull: false,
      buff: { type: 'def', val: 0.35, duration: 900, label: '防禦力 +35%' },
      desc: '回血+220 HP 且 15 分鐘內【防禦力 +35%】！'
    },
    {
      id: 'tea',
      name: '地底精靈薄荷魔藥茶',
      price: 50,
      healHp: 130,
      isFull: false,
      buff: { type: 'time', val: 2.0, duration: 900, label: '每題時限 +2.0 秒' },
      desc: '回血+130 HP 且 15 分鐘內【答題時限 +2.0 秒】！'
    },
    {
      id: 'truffle_soup',
      name: '黃金松露哥布林濃湯',
      price: 60,
      healHp: 280,
      isFull: false,
      buff: { type: 'gold', val: 0.50, duration: 1200, label: '獲得金幣 +50%' },
      desc: '回血+280 HP 且 20 分鐘內【金幣收益 +50%】！'
    },
    {
      id: 'feast',
      name: '深淵領主海陸盛宴',
      price: 120,
      healHp: 99999,
      isFull: true,
      buff: { type: 'all', val: 0.30, timeVal: 2.5, duration: 1800, label: '全能力提升 +30%' },
      desc: '瞬間 100% 滿血，且 30 分鐘內【攻防+30%、時限+2.5秒】！'
    }
  ],

  // 5 Leave Passes
  LEAVE_PASSES: [
    { id: 'pass_1d', days: 1, durationSec: 86400, name: '1 日地牢臨時假單', price: 25, desc: '保護 24 小時不扣血、保連續天數、防情勒。' },
    { id: 'pass_3d', days: 3, durationSec: 259200, name: '3 日營地連假通行證', price: 65, desc: '保護 3 天不扣血，平均每日約 21.6 G。' },
    { id: 'pass_7d', days: 7, durationSec: 604800, name: '7 日王國渡假契約', price: 135, desc: '保護 7 天不扣血，平均每日約 19.3 G。' },
    { id: 'pass_14d', days: 14, durationSec: 1209600, name: '14 日遠征長假法典', price: 240, desc: '保護 14 天不扣血，平均每日約 17.1 G。' },
    { id: 'pass_30d', days: 30, durationSec: 2592000, name: '30 日皇家閉關聖旨', price: 450, desc: '保護 30 天超長效免扣血，每日僅 15 G！' }
  ],

  // Consumables
  CONSUMABLES: {
    guard_scroll: {
      id: 'guard_scroll',
      name: '神聖回血護樓卷',
      price: 50,
      desc: '【登塔保命】0 點答錯或 HP 歸零即將降層時，自動消耗 1 張免除降層並恢復 60% HP！'
    },
    potion: {
      id: 'potion',
      name: '精煉生命聖水',
      price: 20,
      desc: '戰鬥中可手動飲用，立即回復角色 45% 最大血量。'
    }
  },

  // Character Dialogue Quotes
  DIALOGUES: {
    praise: [
      '太神啦！你今天也準時踏入地下城了！有這麼自律的冒險者，什麼單字都難不倒我們！✨',
      '看到你上線我就充滿力量！每次你秒答單字的時候，我手上的像素劍都在發光喔！',
      '連續登入達成！這座地牢裡的魔物聽說你來了，已經開始在瑟瑟發抖啦！',
      '堅持每天練習的你最棒了！今天我們也一起橫掃地下城與通天塔吧！'
    ],
    complaint_1_2: [
      '喔～大忙人終於想起地牢裡還關著一個勇者啦？你在外面滑手機時，有想過我正餓著肚子等單字吃嗎？沒有，你只想到你自己🥺。',
      '因為你昨天放生我，我被地牢老鼠咬掉了 15% 血……快去矮人食堂買塊黑麥麵包餵我！',
      '肚子好餓……劍都快握不住了。下次出門前記得幫我買張請假卷好不好？'
    ],
    sarcasm_3_6: [
      '哇賽！我還以為你已經把英文全部還給高中老師了呢！你看我的像素血條，快跟你的單字量一樣見底了啦！😒',
      '當初是誰信誓旦旦說要每天背單字登頂 1000 樓的？連一張請假卷都捨不得買，就放我在地牢發霉……心好冷、胃好痛！',
      '隔壁排行榜的勇者都已經殺進幾百層了，只有我還在地牢門口啃青苔……唉，真是遇人不淑！'
    ],
    ghost_7_plus: [
      '奇蹟啊！失蹤人口回歸！我都已經在墓園幫自己挑好棺材了！今天不多買兩客炙燒厚切牛排補償我，我連劍都舉不起來！👻',
      '沒關係啦，反正我只是一串沒人疼的像素代碼而已……你走吧，讓我繼續被飢餓侵蝕就好了（幽靈漂浮抹淚）。',
      '整整一個禮拜不見！我都快忘記英文單字長什麼樣子了！快餵我吃東西，然後立刻開始答題贖罪！'
    ],
    vacation: [
      '休假中真舒服～有公會核准請假卷罩著，完全不用擔心扣血！祝主人渡假愉快！🏖️'
    ]
  },

  // 7-day Check-in Rewards
  CHECKIN_CYCLE: [
    { day: 1, gold: 30, item: null, label: '30 金幣' },
    { day: 2, gold: 40, item: 'potion', count: 1, label: '40 金幣 + 生命聖水' },
    { day: 3, gold: 50, item: 'guard_scroll', count: 1, label: '50 金幣 + 護樓卷' },
    { day: 4, gold: 60, item: null, label: '60 金幣' },
    { day: 5, gold: 80, item: 'potion', count: 2, label: '80 金幣 + 生命聖水x2' },
    { day: 6, gold: 100, item: null, label: '100 金幣' },
    { day: 7, gold: 150, item: 'guard_scroll', count: 2, label: '150 金幣 + 護樓卷x2' }
  ],

  // Initial Competitors in Tower Leaderboard (No dummy NPCs, real Supabase players only)
  INITIAL_LEADERBOARD: [],

  // Goblin Dungeon Lottery / Fate Roulette (30 Gold, 9999 Gold Jackpot)
  LOTTERY: {
    cost: 30,
    baseWinRate: 0.05,
    pityIncrement: 0.035,
    maxPityRate: 0.88,
    jackpotInitialWeight: 0.015,
    slots: [
      { id: 0, type: 'prize', tier: 'jackpot', name: '遠古巨龍金庫', rewardText: '9999 金幣', icon: 'trophy', gold: 9999, desc: '【特獎】傳說巨龍寶庫 9999 金幣！！' },
      { id: 1, type: 'dud', name: '破舊草鞋', rewardText: '謝謝惠顧', icon: 'cross', desc: '除了泥巴什麼也沒有。' },
      { id: 2, type: 'prize', tier: 'major', name: '王國騎士賞金', rewardText: '500 金幣', icon: 'coin', gold: 500, desc: '【二獎】沉甸甸的王國金幣袋！' },
      { id: 3, type: 'dud', name: '發霉黑麵包', rewardText: '謝謝惠顧', icon: 'skull', desc: '硬得跟石頭一樣，根本不能吃。' },
      { id: 4, type: 'prize', tier: 'rare', name: '神聖護樓卷軸', rewardText: '護樓卷 x1 + 100 G', icon: 'scroll', gold: 100, item: 'guard_scroll', itemCount: 1, desc: '【三獎】保命神器與百枚金幣！' },
      { id: 5, type: 'dud', name: '哥布林欠條', rewardText: '謝謝惠顧', icon: 'cross', desc: '白紙一張，上面寫著下次再來。' },
      { id: 6, type: 'prize', tier: 'medium', name: '精煉生命聖水', rewardText: '聖水 x2 + 50 G', icon: 'potion', gold: 50, item: 'potion', itemCount: 2, desc: '【四獎】兩瓶甘泉聖水與旅費！' },
      { id: 7, type: 'prize', tier: 'minor', name: '安慰小錢包', rewardText: '30 金幣 (保本)', icon: 'coin', gold: 30, desc: '【五獎】剛好拿回本次抽獎本金！' }
    ],
    taunts: [
      '「噗嗤！空空如也！但是——哪有賭徒天天輸？下把肯定爆 9999 金幣！」',
      '「又沒中！哥布林莊家把你的金幣塞進口袋狂笑：哪有賭徒天天輸？再來一把翻盤啊！」',
      '「手氣這麼背還敢來賭？哪有賭徒天天輸，下一把就是巨龍寶藏了啦！」',
      '「幸運女神今天請假！但哪有賭徒天天輸？連輸幾把後大獎機率已經飆升，現在放棄前面都白送了！」',
      '「莊家數著金幣大笑：感謝勇者贊助！不過哪有賭徒天天輸？再來一次保證轉運！」',
      '「哎呀！就差一格！哪有賭徒天天輸？下一把不抽走 9999 G 怎麼對得起自己！」',
      '「哥布林拍拍你的肩膀：嘿嘿，哪有賭徒天天輸？連輸是為了迎接觸底大爆發！」'
    ],
    expulsions: [
      '【哥布林莊家】怒斥：「身無分文的窮鬼也配坐在這？！滾去地下城打怪背單字賺夠 30 金幣再來！」',
      '【哥布林賭徒】哄堂大笑：「輸得連一條褲衩都不剩了！警衛，把這個窮光蛋扔回營地去！」',
      '【哥布林守衛】拔刀驅趕：「沒錢還想賴在賭桌前？快滾！口袋有 30 金幣再回來做夢！」'
    ]
  },

  // 🐾 Pets & Companions
  PETS: {
    shiba: {
      id: 'shiba',
      name: '幸運柴犬',
      title: '寶藏嗅覺使者',
      icon: 'sparkle',
      desc: '可愛搖尾巴的赤色柴犬，擁有敏銳的金幣嗅覺。',
      skillName: '【幸運探寶】',
      skillDesc: '答對或達成連擊時，有 35% 機率額外發掘 +5~15 金幣。',
      feedCost: 25,
      maxLevel: 10
    },
    owl: {
      id: 'owl',
      name: '智慧貓頭鷹',
      title: '真理之眼導師',
      icon: 'quill',
      desc: '頭戴迷你學者帽的深邃貓頭鷹，熟知字根字首與排除法。',
      skillName: '【心靈洞察】',
      skillDesc: '每場戰鬥可發動 1 次：主動排除 1 個錯誤選項（二選一刪去法）。',
      feedCost: 35,
      maxLevel: 10
    },
    dragon: {
      id: 'dragon',
      name: '緋紅幼火龍',
      title: '怒焰破壁夥伴',
      icon: 'fire',
      desc: '噴著溫暖小火苗的緋紅小龍，戰鬥時全力噴吐龍息。',
      skillName: '【龍息焚燒】',
      skillDesc: '英雄每次攻擊附加 +18% 額外灼燒真實傷害，大幅縮短討伐時間。',
      feedCost: 45,
      maxLevel: 10
    },
    cat: {
      id: 'cat',
      name: '魔法黑貓',
      title: '九命奧術靈伴',
      icon: 'gem',
      desc: '佩戴紫水晶項圈的優雅黑貓，能夠操縱幽冥九命守護。',
      skillName: '【九命庇護】',
      skillDesc: '每場戰鬥免死一次（以 1 HP 抵擋致死打擊），且戰鬥勝利後恢復 15 HP。',
      feedCost: 40,
      maxLevel: 10
    }
  },

  // ⚒️ Blacksmith Forge & Runes
  BLACKSMITH: {
    maxLevel: 10,
    levels: [
      { level: 1, cost: 30, rate: 1.0, bonusAtk: 3, bonusDef: 2, bonusHp: 15 },
      { level: 2, cost: 50, rate: 0.95, bonusAtk: 6, bonusDef: 4, bonusHp: 30 },
      { level: 3, cost: 80, rate: 0.90, bonusAtk: 10, bonusDef: 7, bonusHp: 50 },
      { level: 4, cost: 120, rate: 0.85, bonusAtk: 15, bonusDef: 10, bonusHp: 75 },
      { level: 5, cost: 180, rate: 0.75, bonusAtk: 21, bonusDef: 14, bonusHp: 105 },
      { level: 6, cost: 260, rate: 0.65, bonusAtk: 28, bonusDef: 19, bonusHp: 140 },
      { level: 7, cost: 360, rate: 0.55, bonusAtk: 36, bonusDef: 25, bonusHp: 180 },
      { level: 8, cost: 500, rate: 0.45, bonusAtk: 46, bonusDef: 32, bonusHp: 230 },
      { level: 9, cost: 700, rate: 0.35, bonusAtk: 58, bonusDef: 40, bonusHp: 290 },
      { level: 10, cost: 1000, rate: 0.25, bonusAtk: 75, bonusDef: 50, bonusHp: 360 }
    ],
    runes: [
      { id: 'rune_swift', name: '疾風神速符文', icon: 'zap', cost: 120, desc: '作答基礎時間上限永久延長 +1.5 秒。' },
      { id: 'rune_vampire', name: '嗜血生命符文', icon: 'heart', cost: 150, desc: '連續答對 5 題（Combo x5）時，自動恢復 12 點生命值。' },
      { id: 'rune_greed', name: '貪婪黃金符文', icon: 'coin', cost: 130, desc: '戰鬥勝利與答題所獲金幣全面提升 +30%。' },
      { id: 'rune_shield', name: '花崗岩庇護符文', icon: 'shield', cost: 140, desc: '承受魔物攻擊之傷害永久降低 15%。' }
    ]
  },

  // 🏆 Achievements & Titles
  ACHIEVEMENTS: [
    { id: 'tower_10', title: '初登巴別塔', desc: '通天塔突破第 10 層', rewardGold: 50, titleReward: '登塔見習生' },
    { id: 'tower_50', title: '雲海穿梭者', desc: '通天塔突破第 50 層', rewardGold: 100, titleReward: '平流層漫步者' },
    { id: 'tower_100', title: '百層攀爬者', desc: '通天塔突破第 100 層', rewardGold: 200, titleReward: '星穹觀星者' },
    { id: 'dungeon_5', title: '討伐者之證', desc: '擊敗地下城 B5F 領主', rewardGold: 80, titleReward: '地牢斬首官' },
    { id: 'dungeon_15', title: '深淵終結神', desc: '討伐地下城最終領主 (B15F)', rewardGold: 500, titleReward: '深淵終焉支配者' },
    { id: 'words_50', title: '初窺門徑', desc: '累計答對 50 個英文詞彙', rewardGold: 40, titleReward: '勤勉學士' },
    { id: 'words_200', title: '詞海泛舟', desc: '累計答對 200 個英文詞彙', rewardGold: 150, titleReward: '博學探求者' },
    { id: 'combo_10', title: '行雲流水', desc: '達成連續 10 題 Combo 無失誤', rewardGold: 60, titleReward: '十步一殺' },
    { id: 'combo_20', title: '神經反射極限', desc: '達成連續 20 題 Combo 無失誤', rewardGold: 180, titleReward: '絕頂思維大師' },
    { id: 'class_unlocked', title: '榮譽晉升', desc: '通過道場多益試煉獲得專屬職業', rewardGold: 100, titleReward: '認證冒險家' },
    { id: 'class_awakened', title: '神域覺醒', desc: '通過 GRE 試煉達成職業覺醒', rewardGold: 250, titleReward: '真理領悟者' },
    { id: 'forge_5', title: '神匠學徒', desc: '任一裝備強化至 +5 以上', rewardGold: 120, titleReward: '鍛造大師' },
    { id: 'pet_3', title: '最佳拍檔', desc: '將任意寵物餵食培育至 Lv.3 以上', rewardGold: 80, titleReward: '溫馨馴獸師' },
    { id: 'pvp_win', title: '初試身手', desc: '在影子競速 PVP 中取得首勝', rewardGold: 50, titleReward: '影子角鬥士' }
  ],

  // 🎲 Random Roguelike Encounters
  RANDOM_ENCOUNTERS: [
    {
      id: 'merchant',
      name: '神秘旅行商人',
      icon: 'shop',
      title: '在迴廊轉角遇見了揹著大包袱的神秘商人！',
      desc: '「嗨！勇敢的冒險者！我這裡有些冒險工會特惠物資，只賣給識貨的人！」',
      options: [
        { id: 'buy_potion', text: '【半價採購】特惠生命聖水 (15 G)', cost: 15, effect: 'potion' },
        { id: 'buy_scroll', text: '【特價保命】護樓神卷 (25 G)', cost: 25, effect: 'scroll' },
        { id: 'leave', text: '【婉拒離開】揮手告別繼續爬塔', cost: 0, effect: 'leave' }
      ]
    },
    {
      id: 'fountain',
      name: '妖精祝福泉水',
      icon: 'water',
      title: '石壁間湧出一汪泛著微光的妖精泉水！',
      desc: '空氣中瀰漫著甘甜的花香，水面飄蕩著溫暖的魔法靈光。',
      options: [
        { id: 'drink_heal', text: '【沐浴泉水】掬飲甘泉，生命值立即回復至 100%', cost: 0, effect: 'heal_full' },
        { id: 'throw_gold', text: '【投擲金幣】向泉中投擲 20 G，獲得「答題時限 +3 秒」祝福', cost: 20, effect: 'time_bless' },
        { id: 'leave', text: '【靜靜凝視】不打擾妖精，繼續前進', cost: 0, effect: 'leave' }
      ]
    },
    {
      id: 'sphinx',
      name: '斯芬克斯謎語石碑',
      icon: 'scroll',
      title: '古老智慧的斯芬克斯雕像攔住了道路！',
      desc: '「凡人！答對吾之高階真理難題，便贈你古代賢者之寶；若答不出，吾亦不傷你。」',
      options: [
        { id: 'accept_riddle', text: '【接受試煉】挑戰 1 題高階真理單字 (答對獲古代金幣寶箱！)', cost: 0, effect: 'riddle' },
        { id: 'bypass', text: '【謹慎繞行】不浪費精力，繞過石像', cost: 0, effect: 'leave' }
      ]
    },
    {
      id: 'gambler',
      name: '地精小賭徒',
      icon: 'coin',
      title: '一隻地精站在木桶上，手裡拋著金幣對你壞笑！',
      desc: '「嘿嘿！敢不敢跟我賭一把？押注 20 金幣，若你接下來 3 題全對，我賠你 3 倍 (60 G)！」',
      options: [
        { id: 'accept_bet', text: '【接受賭局】押注 20 G，若接下來 3 題全對獎勵 60 G！', cost: 20, effect: 'gamble_bet' },
        { id: 'decline_bet', text: '【拒絕賭博】正義冒險家不與地精賭博', cost: 0, effect: 'leave' }
      ]
    }
  ],

  // 📥 Custom Vocab Presets
  CUSTOM_VOCAB_PRESETS: [
    {
      name: '🎯 雅思 IELTS 核心高頻 10 單',
      words: [
        { word: 'feasible', pos: 'adj.', meaning: '可行的；行得通的' },
        { word: 'fluctuate', pos: 'v.', meaning: '波動；起伏不定' },
        { word: 'lucrative', pos: 'adj.', meaning: '獲利豐厚的；賺錢的' },
        { word: 'mitigate', pos: 'v.', meaning: '緩和；減輕' },
        { word: 'negligible', pos: 'adj.', meaning: '微不足道的；可忽略的' },
        { word: 'paradox', pos: 'n.', meaning: '自相矛盾的情況；悖論' },
        { word: 'scrutinize', pos: 'v.', meaning: '詳細審查；細察' },
        { word: 'tentative', pos: 'adj.', meaning: '暫時的；試驗性的' },
        { word: 'ubiquitous', pos: 'adj.', meaning: '無所不在的；普遍存在的' },
        { word: 'viable', pos: 'adj.', meaning: '可望成功的；切實可行的' }
      ]
    },
    {
      name: '💼 商務職場 Email 常用 10 詞',
      words: [
        { word: 'agenda', pos: 'n.', meaning: '議程；日常工作事項' },
        { word: 'collaborate', pos: 'v.', meaning: '合作；協同工作' },
        { word: 'deadline', pos: 'n.', meaning: '截止期限；最後期限' },
        { word: 'feedback', pos: 'n.', meaning: '回饋意見；反應' },
        { word: 'implement', pos: 'v.', meaning: '實施；貫徹執行' },
        { word: 'inquiry', pos: 'n.', meaning: '詢問；查詢' },
        { word: 'negotiate', pos: 'v.', meaning: '談判；商談' },
        { word: 'priority', pos: 'n.', meaning: '優先事項；當務之急' },
        { word: 'schedule', pos: 'n.', meaning: '時程表；行程安排' },
        { word: 'update', pos: 'v.', meaning: '更新；提供最新消息' }
      ]
    },
    {
      name: '✈️ 旅遊差旅必備 10 詞',
      words: [
        { word: 'boarding', pos: 'n.', meaning: '登機；登船' },
        { word: 'customs', pos: 'n.', meaning: '海關；報關手續' },
        { word: 'departure', pos: 'n.', meaning: '出發；啟程' },
        { word: 'destination', pos: 'n.', meaning: '目的地；終點' },
        { word: 'luggage', pos: 'n.', meaning: '行李；隨身包件' },
        { word: 'itinerary', pos: 'n.', meaning: '行程表；旅行計劃' },
        { word: 'passenger', pos: 'n.', meaning: '乘客；旅客' },
        { word: 'reservation', pos: 'n.', meaning: '預訂；預約' },
        { word: 'terminal', pos: 'n.', meaning: '航廈；轉運終點站' },
        { word: 'transit', pos: 'n.', meaning: '過境；轉機' }
      ]
    }
  ]
};
