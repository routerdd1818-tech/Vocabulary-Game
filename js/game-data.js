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
  }
};
