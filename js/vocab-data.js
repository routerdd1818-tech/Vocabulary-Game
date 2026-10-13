/**
 * Word Dungeon & Babel Tower - Vocabulary Database
 * Covers 學測 7000 單 (Levels 1-6), 多益 TOEIC (550, 700, 860, 990), 托福 TOEFL, and GRE.
 * Each entry is fully equipped to generate all 4 question types dynamically.
 */

const VOCAB_DATABASE = [
  // ==========================================
  // TIER 1: 學測 7000 單【Level 1 基礎生活】(B1F Slime King)
  // ==========================================
  {
    id: 't1_brave',
    tier: 1,
    word: 'brave',
    pos: 'adj.',
    meaning: '勇敢的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['害怕的', '安靜的', '懶惰的'],
    sentence: 'The ______ knight walked into the dark cave without fear.',
    sentenceZh: '那名勇敢的騎士毫無畏懼地走進了漆黑的洞穴。',
    sentenceTarget: 'brave',
    sentenceChoices: ['brave', 'coward', 'quiet', 'lazy'],
    spellingWord: 'b r _ v _',
    spellingMissing: ['a', 'e'],
    spellingPool: ['a', 'e', 'o', 'i', 'u', 'r'],
    qaQuestion: 'Q: The commander commended the warrior for being exceptionally brave. What does this mean?',
    qaChoices: [
      'He confronted danger with courage and resolve.',
      'He fled into the woods as soon as enemies arrived.',
      'He complained endlessly about the heavy armor.',
      'He refused to participate in the expedition.'
    ],
    qaCorrect: 0
  },
  {
    id: 't1_danger',
    tier: 1,
    word: 'danger',
    pos: 'n.',
    meaning: '危險',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['安全', '寶藏', '勝利'],
    sentence: 'The dungeon explorer sensed an imminent ______ lurking ahead.',
    sentenceZh: '地牢探險家察覺到前方潛伏著迫近的危險。',
    sentenceTarget: 'danger',
    sentenceChoices: ['danger', 'safety', 'victory', 'treasure'],
    spellingWord: 'd _ n g _ r',
    spellingMissing: ['a', 'e'],
    spellingPool: ['a', 'e', 'o', 'i', 'u', 's'],
    qaQuestion: 'Q: The scout warned that the corridor is full of danger. How should the team proceed?',
    qaChoices: [
      'They should advance with high alert and drawn shields.',
      'They should lower their weapons and take a nap.',
      'They should run blindly forward without looking.',
      'They should discard all their potions and torches.'
    ],
    qaCorrect: 0
  },
  {
    id: 't1_protect',
    tier: 1,
    word: 'protect',
    pos: 'v.',
    meaning: '保護；防禦',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['摧毀', '背叛', '逃避'],
    sentence: 'The paladin used his heavy shield to ______ his wounded ally.',
    sentenceZh: '聖騎士用他的厚重盾牌保護了受傷的盟友。',
    sentenceTarget: 'protect',
    sentenceChoices: ['protect', 'destroy', 'betray', 'abandon'],
    spellingWord: 'p r _ t _ c t',
    spellingMissing: ['o', 'e'],
    spellingPool: ['o', 'e', 'a', 'i', 'u', 'k'],
    qaQuestion: 'Q: What is the primary purpose of armor that is designed to protect?',
    qaChoices: [
      'To prevent bodily injury from hostile attacks.',
      'To ensure the wearer looks decorative in town.',
      'To make walking as noisy as possible.',
      'To inflict self-damage in every round.'
    ],
    qaCorrect: 0
  },
  {
    id: 't1_gather',
    tier: 1,
    word: 'gather',
    pos: 'v.',
    meaning: '收集；聚集',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['散落', '浪費', '分開'],
    sentence: 'Adventurers ______ herbs and glowing crystals in the forest.',
    sentenceZh: '冒險者們在森林中收集草藥與發光水晶。',
    sentenceTarget: 'gather',
    sentenceChoices: ['gather', 'scatter', 'drop', 'ignore'],
    spellingWord: 'g _ t h _ r',
    spellingMissing: ['a', 'e'],
    spellingPool: ['a', 'e', 'o', 'u', 'i', 't'],
    qaQuestion: 'Q: If the party needs to gather gold for equipment, what should they do?',
    qaChoices: [
      'Defeat dungeon creatures and collect battle bounties.',
      'Throw their coins into the bottomless pit.',
      'Wait in silence without clearing any chambers.',
      'Sell their last weapon for zero currency.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 2: 學測 7000 單【Level 1 進階日常】(B2F Hornet Queen)
  // ==========================================
  {
    id: 't2_escape',
    tier: 2,
    word: 'escape',
    pos: 'v.',
    meaning: '逃跑；脫逃',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['留下', '受困', '迎戰'],
    sentence: 'The thief managed to ______ through the secret stone passage.',
    sentenceZh: '那名盜賊設法穿過秘密石道逃脫了。',
    sentenceTarget: 'escape',
    sentenceChoices: ['escape', 'remain', 'freeze', 'surrender'],
    spellingWord: 'e s c _ p _',
    spellingMissing: ['a', 'e'],
    spellingPool: ['a', 'e', 'o', 'i', 'u', 'p'],
    qaQuestion: 'Q: When the trap triggered, the adventurer looked for a way to escape. Why?',
    qaChoices: [
      'To avoid taking fatal damage from the collapsing chamber.',
      'To enjoy sitting quietly under falling boulders.',
      'To recruit more monsters into the pit.',
      'To disable all friendly camp bonuses.'
    ],
    qaCorrect: 0
  },
  {
    id: 't2_poison',
    tier: 2,
    word: 'poison',
    pos: 'n.',
    meaning: '毒藥；毒素',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['解藥', '蜂蜜', '泉水'],
    sentence: 'The giant hornet injects deadly ______ through its barbed stinger.',
    sentenceZh: '巨型黃蜂透過牠的倒鉤毒針注入致命毒素。',
    sentenceTarget: 'poison',
    sentenceChoices: ['poison', 'antidote', 'nectar', 'water'],
    spellingWord: 'p _ _ s o n',
    spellingMissing: ['o', 'i'],
    spellingPool: ['o', 'i', 'a', 'e', 'u', 's'],
    qaQuestion: 'Q: An enemy weapon is coated in virulent poison. What effect will it have?',
    qaChoices: [
      'It causes continuous toxic harm over subsequent turns.',
      'It instantly restores maximum health to the hero.',
      'It increases movement speed and armor durability.',
      'It grants free gold after every round.'
    ],
    qaCorrect: 0
  },
  {
    id: 't2_valuable',
    tier: 2,
    word: 'valuable',
    pos: 'adj.',
    meaning: '有價值的；珍貴的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['廉價的', '無用的', '損壞的'],
    sentence: 'Inside the locked chest lies a ______ enchanted amulet.',
    sentenceZh: '在鎖住的寶箱內放著一枚珍貴的附魔護身符。',
    sentenceTarget: 'valuable',
    sentenceChoices: ['valuable', 'worthless', 'broken', 'common'],
    spellingWord: 'v _ l u _ b l e',
    spellingMissing: ['a', 'a'],
    spellingPool: ['a', 'e', 'o', 'i', 'u', 'l'],
    qaQuestion: 'Q: Why do merchant dwarfs trade high quantities of gold for valuable relics?',
    qaChoices: [
      'Because those artifacts possess rare magic and high market worth.',
      'Because they want to throw them into the trash bin.',
      'Because they are completely useless junk.',
      'Because they make the merchant lose coins.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 3: 學測 7000 單【Level 2 初級核心】(B3F Goblin Raider)
  // ==========================================
  {
    id: 't3_ancient',
    tier: 3,
    word: 'ancient',
    pos: 'adj.',
    meaning: '古老的；古代的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['現代的', '嶄新的', '短暫的'],
    sentence: 'The stone pillars were engraved with ______ magical runes.',
    sentenceZh: '石柱上刻著古老的魔法符文。',
    sentenceTarget: 'ancient',
    sentenceChoices: ['ancient', 'modern', 'fresh', 'recent'],
    spellingWord: 'a n c _ _ n t',
    spellingMissing: ['i', 'e'],
    spellingPool: ['i', 'e', 'o', 'a', 'u', 'c'],
    qaQuestion: 'Q: The scholar found an ancient scroll written centuries ago. What did it contain?',
    qaChoices: [
      'Forgotten knowledge and historical records of past kingdoms.',
      'Today\'s latest weather report on television.',
      'A receipt from yesterday morning\'s bakery.',
      'Instructions for tomorrow\'s smartphone update.'
    ],
    qaCorrect: 0
  },
  {
    id: 't3_capture',
    tier: 3,
    word: 'capture',
    pos: 'v.',
    meaning: '俘獲；捕獲',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['釋放', '忽略', '遺失'],
    sentence: 'The goblin raiders attempted to ______ the royal caravan.',
    sentenceZh: '哥布林強盜試圖俘獲皇家商隊。',
    sentenceTarget: 'capture',
    sentenceChoices: ['capture', 'release', 'ignore', 'drop'],
    spellingWord: 'c _ p t _ r e',
    spellingMissing: ['a', 'u'],
    spellingPool: ['a', 'u', 'e', 'o', 'i', 'p'],
    qaQuestion: 'Q: The soldiers managed to capture the goblin scout. What will happen next?',
    qaChoices: [
      'He will be detained and questioned about the enemy camp.',
      'He will be given a medal and crowned as the new king.',
      'He will immediately vanish into thin air forever.',
      'He will be invited to design the royal castle.'
    ],
    qaCorrect: 0
  },
  {
    id: 't3_fierce',
    tier: 3,
    word: 'fierce',
    pos: 'adj.',
    meaning: '兇猛的；強烈的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['溫馴的', '虛弱的', '平靜的'],
    sentence: 'The warrior parried a ______ blow from the dual-dagger assassin.',
    sentenceZh: '戰士格擋了來自雙刀刺客的兇猛一擊。',
    sentenceTarget: 'fierce',
    sentenceChoices: ['fierce', 'gentle', 'weak', 'calm'],
    spellingWord: 'f _ _ r c e',
    spellingMissing: ['i', 'e'],
    spellingPool: ['i', 'e', 'o', 'a', 'u', 'r'],
    qaQuestion: 'Q: A fierce tempest strikes the battlefield. How does it affect both sides?',
    qaChoices: [
      'Violent winds and savage strikes make combat intense and hazardous.',
      'It creates a cozy warm sunshine for an afternoon picnic.',
      'Both armies immediately drop weapons and fall soundly asleep.',
      'It doubles everyone\'s gold without any effort.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 4: 學測 7000 單【Level 2 活用字彙】(B4F Dire Wolf Alpha)
  // ==========================================
  {
    id: 't4_howl',
    tier: 4,
    word: 'howl',
    pos: 'v.',
    meaning: '長嚎；怒吼',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['耳語', '大笑', '沉默'],
    sentence: 'Wolves ______ beneath the crimson moon to summon their pack.',
    sentenceZh: '狼群在血月下長嚎，以召集牠們的同伴。',
    sentenceTarget: 'howl',
    sentenceChoices: ['howl', 'whisper', 'giggle', 'sleep'],
    spellingWord: 'h _ w _',
    spellingMissing: ['o', 'l'],
    spellingPool: ['o', 'l', 'a', 'e', 'i', 'w'],
    qaQuestion: 'Q: The alpha beast let out a terrifying howl across the cavern. What was the purpose?',
    qaChoices: [
      'To rally its fellow wolves and intimidate the intruders.',
      'To sing a bedtime lullaby for the adventurer.',
      'To announce that afternoon tea is being served.',
      'To politely apologize for trespassing.'
    ],
    qaCorrect: 0
  },
  {
    id: 't4_pursue',
    tier: 4,
    word: 'pursue',
    pos: 'v.',
    meaning: '追捕；追求',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['放棄', '退縮', '躲避'],
    sentence: 'The hound was trained to ______ retreating shadows in the woods.',
    sentenceZh: '這隻獵犬受過訓練，能在樹林中追捕撤退的陰影。',
    sentenceTarget: 'pursue',
    sentenceChoices: ['pursue', 'abandon', 'flee', 'ignore'],
    spellingWord: 'p _ r s _ e',
    spellingMissing: ['u', 'u'],
    spellingPool: ['u', 'o', 'a', 'e', 'i', 'r'],
    qaQuestion: 'Q: The ranger decided to pursue the wounded beast into the cave. What was the intention?',
    qaChoices: [
      'To track it down before it could recover and strike again.',
      'To allow it to freely organize a counter-ambush.',
      'To sit outside and take a prolonged nap.',
      'To surrender all weaponry unconditionally.'
    ],
    qaCorrect: 0
  },
  {
    id: 't4_instinct',
    tier: 4,
    word: 'instinct',
    pos: 'n.',
    meaning: '本能；直覺',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['知識', '計劃', '學習'],
    sentence: 'A predator relies on sharp ______ to strike at the perfect moment.',
    sentenceZh: '掠食者依靠敏銳的本能在完美的時刻出擊。',
    sentenceTarget: 'instinct',
    sentenceChoices: ['instinct', 'manual', 'schedule', 'doubt'],
    spellingWord: 'i n s t _ n c t',
    spellingMissing: ['i'],
    spellingPool: ['i', 'e', 'a', 'o', 'u', 'y'],
    qaQuestion: 'Q: When the ceiling crumbled, the hero dodged by instinct. What does this mean?',
    qaChoices: [
      'He moved automatically and reflexively without needing deliberate thought.',
      'He read an encyclopedia chapter before making a step.',
      'He calculated the math of gravitational pull on a notebook.',
      'He waited until someone sent him a formal letter.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 5: 學測 7000 單【Level 3 中級必考】(B5F Venom Arachnid)
  // ==========================================
  {
    id: 't5_reluctant',
    tier: 5,
    word: 'reluctant',
    pos: 'adj.',
    meaning: '不情願的；勉強的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['渴望的', '熱誠的', '衝動的'],
    sentence: 'The novice was ______ to enter the spider-infested chamber alone.',
    sentenceZh: '新手很不情願單獨進入滿是蜘蛛的墓室。',
    sentenceTarget: 'reluctant',
    sentenceChoices: ['reluctant', 'eager', 'willing', 'joyful'],
    spellingWord: 'r e l _ c t _ n t',
    spellingMissing: ['u', 'a'],
    spellingPool: ['u', 'a', 'e', 'o', 'i', 't'],
    qaQuestion: 'Q: The guide was reluctant to lead the party deeper into the catacombs. Why?',
    qaChoices: [
      'He felt hesitant and fearful due to the mortal hazards ahead.',
      'He was overly enthusiastic and wanted to run ahead immediately.',
      'He had already memorized every single room without flaw.',
      'He owned the dungeon and wanted to sell tickets.'
    ],
    qaCorrect: 0
  },
  {
    id: 't5_obstacle',
    tier: 5,
    word: 'obstacle',
    pos: 'n.',
    meaning: '障礙；阻礙',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['捷徑', '平路', '助力'],
    sentence: 'The web of giant threads formed a formidable ______ in the tunnel.',
    sentenceZh: '巨型蛛絲編織的網在通道中形成了一道棘手的障礙。',
    sentenceTarget: 'obstacle',
    sentenceChoices: ['obstacle', 'shortcut', 'advantage', 'gateway'],
    spellingWord: 'o b s t _ c l _',
    spellingMissing: ['a', 'e'],
    spellingPool: ['a', 'e', 'o', 'u', 'i', 'c'],
    qaQuestion: 'Q: The expedition encountered a massive boulder blocking the door. How was it classified?',
    qaChoices: [
      'As a physical obstacle that hindered their forward progress.',
      'As an easy bridge that made traveling effortless.',
      'As a delicious meal cooked for dinner.',
      'As a magical potion that restored mana.'
    ],
    qaCorrect: 0
  },
  {
    id: 't5_triumph',
    tier: 5,
    word: 'triumph',
    pos: 'n.',
    meaning: '勝利；巨大成就',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['失敗', '慘敗', '屈服'],
    sentence: 'The heroes celebrated their hard-won ______ over the brood mother.',
    sentenceZh: '英雄們慶祝戰勝蛛后這場得來不易的勝利。',
    sentenceTarget: 'triumph',
    sentenceChoices: ['triumph', 'defeat', 'collapse', 'ruin'],
    spellingWord: 't r _ _ m p h',
    spellingMissing: ['i', 'u'],
    spellingPool: ['i', 'u', 'a', 'e', 'o', 'm'],
    qaQuestion: 'Q: The bard sang a song of triumph after the battle. What was the theme of the ballad?',
    qaChoices: [
      'The glorious victory achieved against overwhelming odds.',
      'The humiliation of losing all gold to thieves.',
      'The sorrow of having equipment shattered by rocks.',
      'The misery of starvation in dark dungeons.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 6: 學測 7000 單【Level 3 進階核心】(B6F Gargoyle Warden)
  // ==========================================
  {
    id: 't6_solidify',
    tier: 6,
    word: 'solidify',
    pos: 'v.',
    meaning: '凝固；鞏固',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['溶解', '蒸發', '融化'],
    sentence: 'The molten curse will ______ into hard rock after several seconds.',
    sentenceZh: '融化的詛咒會在數秒後凝固成堅硬的岩石。',
    sentenceTarget: 'solidify',
    sentenceChoices: ['solidify', 'dissolve', 'liquefy', 'melt'],
    spellingWord: 's o l _ d _ f y',
    spellingMissing: ['i', 'i'],
    spellingPool: ['i', 'e', 'a', 'o', 'u', 'f'],
    qaQuestion: 'Q: The gargoyle skin begins to solidify during defensive mode. What is the tactical result?',
    qaChoices: [
      'Its stone outer shell hardens, drastically reducing physical damage taken.',
      'It turns into delicate glass that shatters from a light tap.',
      'It instantly flies away into the atmosphere.',
      'Its health drops to zero automatically.'
    ],
    qaCorrect: 0
  },
  {
    id: 't6_vigilant',
    tier: 6,
    word: 'vigilant',
    pos: 'adj.',
    meaning: '警惕的；警覺的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['粗心的', '怠惰的', '麻痺的'],
    sentence: 'Guardians must remain ______ against ambushes in the midnight fog.',
    sentenceZh: '守衛者在午夜迷霧中必須隨時保持警惕，以防埋伏。',
    sentenceTarget: 'vigilant',
    sentenceChoices: ['vigilant', 'careless', 'drowsy', 'negligent'],
    spellingWord: 'v _ g _ l a n t',
    spellingMissing: ['i', 'i'],
    spellingPool: ['i', 'e', 'a', 'o', 'u', 'l'],
    qaQuestion: 'Q: Why is an adventurer advised to stay vigilant in the clocktower?',
    qaChoices: [
      'Because stone sentinels may awaken and strike at any unguarded moment.',
      'Because sleeping peacefully in traps gives bonus experience.',
      'Because ignoring noise ensures safe passage.',
      'Because dropping shields makes defense higher.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 7: 學測 7000 單【Level 4 中高核心】(B7F Skeleton Deathknight)
  // ==========================================
  {
    id: 't7_inevitable',
    tier: 7,
    word: 'inevitable',
    pos: 'adj.',
    meaning: '不可避免的；必然的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['可避開的', '偶然的', '不確定的'],
    sentence: 'Facing the deathknight in narrow halls makes combat ______.',
    sentenceZh: '在狹窄的走廊面對死靈騎士，交戰是無可避免的。',
    sentenceTarget: 'inevitable',
    sentenceChoices: ['inevitable', 'avoidable', 'uncertain', 'optional'],
    spellingWord: 'i n _ v _ t a b l e',
    spellingMissing: ['e', 'i'],
    spellingPool: ['e', 'i', 'a', 'o', 'u', 'v'],
    qaQuestion: 'Q: A strategist declared that conflict with the undead army is inevitable. What should they do?',
    qaChoices: [
      'Prepare weapons, armor, and provisions thoroughly for the unavoidable clash.',
      'Pretend nothing exists and dismantle all defenses.',
      'Assume the enemies will become friendly merchants tomorrow.',
      'Discard all healing potions into the ditch.'
    ],
    qaCorrect: 0
  },
  {
    id: 't7_vulnerable',
    tier: 7,
    word: 'vulnerable',
    pos: 'adj.',
    meaning: '易受傷的；脆弱的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['無敵的', '堅固的', '強壯的'],
    sentence: 'Without a shield, the swordsman was ______ to piercing arrows.',
    sentenceZh: '沒有盾牌，劍士很容易受到穿甲箭的傷害。',
    sentenceTarget: 'vulnerable',
    sentenceChoices: ['vulnerable', 'invincible', 'immune', 'sturdy'],
    spellingWord: 'v _ l n _ r a b l e',
    spellingMissing: ['u', 'e'],
    spellingPool: ['u', 'e', 'a', 'o', 'i', 'n'],
    qaQuestion: 'Q: The armor-crushing strike left the hero vulnerable. What is the immediate consequence?',
    qaChoices: [
      'He takes heightened damage from incoming enemy blows due to weakened defense.',
      'His armor becomes completely impenetrable by all weapons.',
      'He regenerates full health every single second.',
      'He gains the power to teleport out of danger.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 8: 學測 7000 單【Level 5 頂標字彙】(B8F Minotaur Warlord)
  // ==========================================
  {
    id: 't8_ferocious',
    tier: 8,
    word: 'ferocious',
    pos: 'adj.',
    meaning: '兇猛殘暴的；狂暴的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['溫柔的', '和善的', '順從的'],
    sentence: 'The minotaur charged with ______ rage, shattering the marble arena pillars.',
    sentenceZh: '牛頭人狂暴憤怒地衝撞，撞碎了大理石競技場的石柱。',
    sentenceTarget: 'ferocious',
    sentenceChoices: ['ferocious', 'tame', 'docile', 'peaceful'],
    spellingWord: 'f _ r _ c i o u s',
    spellingMissing: ['e', 'o'],
    spellingPool: ['e', 'o', 'a', 'i', 'u', 'r'],
    qaQuestion: 'Q: When the warlord enters a ferocious frenzy below half health, how does its posture change?',
    qaChoices: [
      'Its strikes become savagely aggressive with elevated attack power.',
      'It politely sits down and drinks afternoon tea with opponents.',
      'It lays down its axe and begs for diplomatic peace.',
      'It forgets how to swing weapons altogether.'
    ],
    qaCorrect: 0
  },
  {
    id: 't8_intimidate',
    tier: 8,
    word: 'intimidate',
    pos: 'v.',
    meaning: '威脅；恐嚇；使膽怯',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['安慰', '鼓勵', '安撫'],
    sentence: 'The warlord roared fiercely to ______ any challenger who dared step forward.',
    sentenceZh: '戰神發出兇猛的咆哮，以威嚇任何敢上前挑戰的人。',
    sentenceTarget: 'intimidate',
    sentenceChoices: ['intimidate', 'comfort', 'encourage', 'reassure'],
    spellingWord: 'i n t _ m _ d a t e',
    spellingMissing: ['i', 'i'],
    spellingPool: ['i', 'e', 'a', 'o', 'u', 'd'],
    qaQuestion: 'Q: Why do colossal beast bosses utilize thunderous war cries to intimidate adventurers?',
    qaChoices: [
      'To shatter the challenger\'s resolve and cause hesitation in battle.',
      'To invite them to sing a cheerful song together.',
      'To boost the challenger\'s morale and grant them bonus stats.',
      'To thank everyone for coming to the tournament.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 9: 學測 7000 單【Level 6 滿級字彙】(B9F Hydra Serpent)
  // ==========================================
  {
    id: 't9_perpetual',
    tier: 9,
    word: 'perpetual',
    pos: 'adj.',
    meaning: '長期的；永恆不斷的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['短暫的', '間歇的', '偶爾的'],
    sentence: 'The hydra dwells in a subterranean cavern of ______ darkness.',
    sentenceZh: '九頭蛇棲息在永恆漆黑的地底洞窟之中。',
    sentenceTarget: 'perpetual',
    sentenceChoices: ['perpetual', 'brief', 'fleeting', 'temporary'],
    spellingWord: 'p _ r p _ t u a l',
    spellingMissing: ['e', 'e'],
    spellingPool: ['e', 'a', 'o', 'i', 'u', 'p'],
    qaQuestion: 'Q: The fountain grants perpetual vigor to mythical serpents. What does that imply?',
    qaChoices: [
      'The creature enjoys an unending supply of regeneration and vitality.',
      'The creature will wither and expire within five minutes.',
      'The creature is stripped of all magical power permanently.',
      'The fountain turns water into sand instantly.'
    ],
    qaCorrect: 0
  },
  {
    id: 't9_regenerate',
    tier: 9,
    word: 'regenerate',
    pos: 'v.',
    meaning: '使再生；復原',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['退化', '腐朽', '消亡'],
    sentence: 'Severed heads of the beast will swiftly ______ unless cauterized with flame.',
    sentenceZh: '野獸被斬斷的頭顱會迅速再生，除非用烈火灼燒。',
    sentenceTarget: 'regenerate',
    sentenceChoices: ['regenerate', 'decay', 'wither', 'vanish'],
    spellingWord: 'r _ g _ n e r a t e',
    spellingMissing: ['e', 'e'],
    spellingPool: ['e', 'a', 'o', 'i', 'u', 'g'],
    qaQuestion: 'Q: When the player answers incorrectly, the hydra begins to regenerate health. What occurs?',
    qaChoices: [
      'It restores a portion of its lost life points through toxic vitality.',
      'It deals damage to itself and collapses immediately.',
      'It transforms into a harmless wooden statue.',
      'It drops its gold bounty on the floor.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 10: 多益 TOEIC【550分 職場基礎】(B10F Frost Valkyrie)
  // ==========================================
  {
    id: 't10_negotiate',
    tier: 10,
    word: 'negotiate',
    pos: 'v.',
    meaning: '談判；協商',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['宣戰', '服從', '放棄'],
    sentence: 'The guild envoy attempted to ______ a truce with the northern defenders.',
    sentenceZh: '公會特使試圖與北方防衛者協商停戰協定。',
    sentenceTarget: 'negotiate',
    sentenceChoices: ['negotiate', 'surrender', 'quarrel', 'protest'],
    spellingWord: 'n _ g _ t i a t e',
    spellingMissing: ['e', 'o'],
    spellingPool: ['e', 'o', 'a', 'i', 'u', 'g'],
    qaQuestion: 'Q: The supplier and the firm sat down to negotiate contractual terms. What was their objective?',
    qaChoices: [
      'To discuss conditions and reach a mutually beneficial agreement.',
      'To engage in physical fistfights over raw materials.',
      'To ignore all financial proposals and cancel company operations.',
      'To play video games throughout the working day.'
    ],
    qaCorrect: 0
  },
  {
    id: 't10_procedure',
    tier: 10,
    word: 'procedure',
    pos: 'n.',
    meaning: '程序；步驟；手續',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['混亂', '衝動', '意外'],
    sentence: 'All adventurers must follow standard safety ______ before opening the vault.',
    sentenceZh: '所有冒險者在打開寶庫前都必須遵循標準安全程序。',
    sentenceTarget: 'procedure',
    sentenceChoices: ['procedure', 'chaos', 'hazard', 'coincidence'],
    spellingWord: 'p r _ c _ d u r e',
    spellingMissing: ['o', 'e'],
    spellingPool: ['o', 'e', 'a', 'i', 'u', 'c'],
    qaQuestion: 'Q: Why must factory personnel adhere strictly to operating procedures?',
    qaChoices: [
      'To maintain quality standards and avoid dangerous workplace accidents.',
      'To make daily tasks as confusing and erratic as possible.',
      'To ensure that machines break down before noon.',
      'To replace all workers with stone gargoyles.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 11: 多益 TOEIC【700分 商務核心】(B11F Magma Golem)
  // ==========================================
  {
    id: 't11_implement',
    tier: 11,
    word: 'implement',
    pos: 'v.',
    meaning: '實施；執行；貫徹',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['廢除', '延期', '拖延'],
    sentence: 'The council decided to ______ strict regulations on molten energy extraction.',
    sentenceZh: '議會決定對熔岩能源提煉實施嚴格的規範。',
    sentenceTarget: 'implement',
    sentenceChoices: ['implement', 'abolish', 'neglect', 'delay'],
    spellingWord: 'i m p l _ m _ n t',
    spellingMissing: ['e', 'e'],
    spellingPool: ['e', 'a', 'o', 'i', 'u', 'm'],
    qaQuestion: 'Q: The enterprise aims to implement a new cloud database next month. What action is taken?',
    qaChoices: [
      'They will put the planned digital system into practical operation.',
      'They will permanently destroy all computer servers.',
      'They will ignore technological advancements and return to papyrus.',
      'They will fire all software developers immediately.'
    ],
    qaCorrect: 0
  },
  {
    id: 't11_prosperity',
    tier: 11,
    word: 'prosperity',
    pos: 'n.',
    meaning: '繁榮；成功；富足',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['破產', '蕭條', '貧窮'],
    sentence: 'The discovery of the gold mine brought unprecedented ______ to the fortress.',
    sentenceZh: '金礦的發現為這座要塞帶來了空前的繁榮。',
    sentenceTarget: 'prosperity',
    sentenceChoices: ['prosperity', 'poverty', 'recession', 'collapse'],
    spellingWord: 'p r _ s p _ r i t y',
    spellingMissing: ['o', 'e'],
    spellingPool: ['o', 'e', 'a', 'i', 'u', 'p'],
    qaQuestion: 'Q: Economic analysts forecast a decade of sustained prosperity. What does this indicate?',
    qaChoices: [
      'Thriving commercial growth, wealth accumulation, and financial well-being.',
      'Severe famine and widespread corporate liquidations.',
      'The complete cessation of trade and global commerce.',
      'All banks closing permanently due to bankruptcy.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 12: 多益 TOEIC【860分 高階商務】(B12F Leviathan Serpent)
  // ==========================================
  {
    id: 't12_comprehensive',
    tier: 12,
    word: 'comprehensive',
    pos: 'adj.',
    meaning: '全面的；詳盡的；綜合的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['片面的', '膚淺的', '簡略的'],
    sentence: 'The navigator drew a ______ maritime chart detailing all abyssal currents.',
    sentenceZh: '領航員繪製了一份詳盡的海圖，詳細標註了所有深淵洋流。',
    sentenceTarget: 'comprehensive',
    sentenceChoices: ['comprehensive', 'superficial', 'partial', 'vague'],
    spellingWord: 'c _ m p r _ h e n s i v e',
    spellingMissing: ['o', 'e'],
    spellingPool: ['o', 'e', 'a', 'i', 'u', 'r'],
    qaQuestion: 'Q: The auditor provided a comprehensive financial review. What was included?',
    qaChoices: [
      'An exhaustive, in-depth evaluation covering every transaction and asset.',
      'A one-sentence handwritten note with zero financial figures.',
      'A blank sheet of paper submitted by mistake.',
      'A collection of random fictional storybook tales.'
    ],
    qaCorrect: 0
  },
  {
    id: 't12_fluctuate',
    tier: 12,
    word: 'fluctuate',
    pos: 'v.',
    meaning: '波動；起伏不定',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['固定', '持平', '凍結'],
    sentence: 'Oceanic tides ______ drastically whenever the deep sea serpent awakens.',
    sentenceZh: '每當深海巨蛇甦醒時，海洋潮汐便會劇烈波動。',
    sentenceTarget: 'fluctuate',
    sentenceChoices: ['fluctuate', 'stabilize', 'freeze', 'persist'],
    spellingWord: 'f l _ c t _ a t e',
    spellingMissing: ['u', 'u'],
    spellingPool: ['u', 'o', 'a', 'e', 'i', 'c'],
    qaQuestion: 'Q: Commodity prices fluctuate continually on the global market. What behavior is observed?',
    qaChoices: [
      'Costs swing unpredictably up and down rather than staying stationary.',
      'Prices remain locked at one single cent forever.',
      'Money loses all value and goods are strictly bartered.',
      'Governments prohibit all trading activities universally.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 13: 多益 TOEIC【990分 金色滿分】(B13F Griffin Emperor)
  // ==========================================
  {
    id: 't13_prestigious',
    tier: 13,
    word: 'prestigious',
    pos: 'adj.',
    meaning: '有聲望的；極具威望的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['聲名狼藉的', '卑微的', '普通的'],
    sentence: 'The royal griffin order is the most ______ knighthood in the empire.',
    sentenceZh: '皇家獅鷲騎士團是帝國中最具威望的騎士頭銜。',
    sentenceTarget: 'prestigious',
    sentenceChoices: ['prestigious', 'infamous', 'humble', 'mediocre'],
    spellingWord: 'p r _ s t _ g i o u s',
    spellingMissing: ['e', 'i'],
    spellingPool: ['e', 'i', 'a', 'o', 'u', 's'],
    qaQuestion: 'Q: Winning the prestigious royal academy scholarship carries what significance?',
    qaChoices: [
      'It confers extraordinary honor, respect, and high societal reputation.',
      'It labels the recipient as an outcast unfit for public office.',
      'It has no significance whatsoever and is instantly forgotten.',
      'It revokes all citizenship rights in the realm.'
    ],
    qaCorrect: 0
  },
  {
    id: 't13_prerequisite',
    tier: 13,
    word: 'prerequisite',
    pos: 'n.',
    meaning: '先決條件；必備前提',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['結果', '後果', '選項'],
    sentence: 'Mastery of ancient vocabulary is an absolute ______ for deciphering griffin scrolls.',
    sentenceZh: '精通古代字彙是解讀獅鷲卷軸的絕對先決條件。',
    sentenceTarget: 'prerequisite',
    sentenceChoices: ['prerequisite', 'consequence', 'afterthought', 'luxury'],
    spellingWord: 'p r _ r _ q u i s i t e',
    spellingMissing: ['e', 'e'],
    spellingPool: ['e', 'a', 'o', 'i', 'u', 'q'],
    qaQuestion: 'Q: In professional certification, what is the nature of a prerequisite course?',
    qaChoices: [
      'A mandatory requirement that must be successfully fulfilled beforehand.',
      'An optional entertainment seminar that can be skipped freely.',
      'A penalty applied to candidates who score too high on finals.',
      'A course taken strictly after retirement from service.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 14: 托福 TOEFL【高階學術字彙】(B14F Abyss Archmage)
  // ==========================================
  {
    id: 't14_ephemeral',
    tier: 14,
    word: 'ephemeral',
    pos: 'adj.',
    meaning: '短暫的；轉瞬即逝的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['永恆的', '持久的', '不滅的'],
    sentence: 'The arcane runes cast by the archmage are ______ and vanish within seconds.',
    sentenceZh: '大法師施展的奧術符文十分短暫，數秒內便消逝無蹤。',
    sentenceTarget: 'ephemeral',
    sentenceChoices: ['ephemeral', 'eternal', 'perpetual', 'permanent'],
    spellingWord: 'e p h _ m _ r a l',
    spellingMissing: ['e', 'e'],
    spellingPool: ['e', 'a', 'o', 'i', 'u', 'm'],
    qaQuestion: 'Q: A scholar observed that morning dew exhibits an ephemeral existence. What does this mean?',
    qaChoices: [
      'It endures only for a transient, brief window before evaporating.',
      'It remains frozen as solid ice for millenniums.',
      'It converts into gold coins upon touching sunlight.',
      'It creates an indestructible barrier against attacks.'
    ],
    qaCorrect: 0
  },
  {
    id: 't14_ubiquitous',
    tier: 14,
    word: 'ubiquitous',
    pos: 'adj.',
    meaning: '無所不在的；普遍存在的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['罕見的', '絕跡的', '局部的'],
    sentence: 'Arcane ether is a ______ energy permeating all dimensions of the tower.',
    sentenceZh: '奧術乙太是一種普遍存在於塔內所有維度的能量。',
    sentenceTarget: 'ubiquitous',
    sentenceChoices: ['ubiquitous', 'scarce', 'isolated', 'rare'],
    spellingWord: 'u b _ q u _ t o u s',
    spellingMissing: ['i', 'i'],
    spellingPool: ['i', 'e', 'a', 'o', 'u', 'b'],
    qaQuestion: 'Q: In modern urban society, smartphones have become ubiquitous. What is the state?',
    qaChoices: [
      'They can be found and observed practically everywhere at any given moment.',
      'They are extremely rare relics kept solely in national museums.',
      'Only three people in the entire world possess access to one.',
      'They are outlawed and considered dangerous mythical artifacts.'
    ],
    qaCorrect: 0
  },

  // ==========================================
  // TIER 15: GRE 殿堂【神話大魔王字彙】(B15F Chrono Dragon)
  // ==========================================
  {
    id: 't15_obfuscate',
    tier: 15,
    word: 'obfuscate',
    pos: 'v.',
    meaning: '使模糊；使混亂難懂',
    distractorsPos: ['n.', 'adj.', 'adv.'],
    distractorsMeaning: ['闡明', '澄清', '簡化'],
    sentence: 'The chrono dragon manipulated the temporal stream to ______ its true location.',
    sentenceZh: '時空古龍操縱時間流，使其真實位置變得撲朔迷離。',
    sentenceTarget: 'obfuscate',
    sentenceChoices: ['obfuscate', 'clarify', 'illuminate', 'simplify'],
    spellingWord: 'o b f _ s c _ t e',
    spellingMissing: ['u', 'a'],
    spellingPool: ['u', 'a', 'o', 'e', 'i', 'b'],
    qaQuestion: 'Q: An author intentionally used esoteric prose to obfuscate the philosophical treatise. Why?',
    qaChoices: [
      'To make the underlying meaning deliberately obscure and difficult to comprehend.',
      'To make it as lucid and effortless as a kindergarten picture book.',
      'To delete the manuscript from the academic library.',
      'To print the text in golden ink for decoration.'
    ],
    qaCorrect: 0
  },
  {
    id: 't15_serendipity',
    tier: 15,
    word: 'serendipity',
    pos: 'n.',
    meaning: '意外驚喜；機緣湊巧獲得的好運',
    distractorsPos: ['v.', 'adj.', 'adv.'],
    distractorsMeaning: ['厄運', '災禍', '不幸'],
    sentence: 'Discovering the chronometer shard in the ruins was a stroke of pure ______.',
    sentenceZh: '在廢墟中發現計時器碎片完全是純粹的機緣巧合。',
    sentenceTarget: 'serendipity',
    sentenceChoices: ['serendipity', 'catastrophe', 'curse', 'misfortune'],
    spellingWord: 's e r _ n d _ p i t y',
    spellingMissing: ['e', 'i'],
    spellingPool: ['e', 'i', 'a', 'o', 'u', 'd'],
    qaQuestion: 'Q: When an alchemist stumbles upon the elixir of immortality by pure serendipity, what happened?',
    qaChoices: [
      'He made a fortunate and wondrous discovery entirely by happy accident.',
      'He methodically followed an exact recipe published in the newspaper.',
      'He suffered an explosion that doomed the entire city to ruin.',
      'He planned every step with rigid mathematical certainty.'
    ],
    qaCorrect: 0
  },
  {
    id: 't15_magnanimous',
    tier: 15,
    word: 'magnanimous',
    pos: 'adj.',
    meaning: '寬宏大量的；胸襟開闊的',
    distractorsPos: ['n.', 'v.', 'adv.'],
    distractorsMeaning: ['心胸狹隘的', '殘忍的', '好報復的'],
    sentence: 'Even after conquest, the ancient sovereign proved ______ toward fallen foes.',
    sentenceZh: '即便征服之後，這位古老君王對戰敗的宿敵仍展現了寬宏大量。',
    sentenceTarget: 'magnanimous',
    sentenceChoices: ['magnanimous', 'petty', 'spiteful', 'vindictive'],
    spellingWord: 'm _ g n _ n i m o u s',
    spellingMissing: ['a', 'a'],
    spellingPool: ['a', 'e', 'o', 'i', 'u', 'm'],
    qaQuestion: 'Q: The emperor offered a magnanimous pardon to those who laid down their weapons. What does this reveal?',
    qaChoices: [
      'His noble generosity and willingness to forgive without seeking vindictive revenge.',
      'His intense cruelty and desire to execute every prisoner.',
      'His cowardice and total inability to lead an army.',
      'His desire to sell all castle furniture for quick cash.'
    ],
    qaCorrect: 0
  }
];
