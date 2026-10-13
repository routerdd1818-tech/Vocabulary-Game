/**
 * Word Dungeon & Babel Tower - Main Application Controller
 * Full PWA logic, SRS algorithm, combat formula, persistence, dialogue, and UI routing.
 */

const App = (() => {
  const STORAGE_KEY = 'word_dungeon_save_v1';

  // Default State Factory (Ensures clean state isolation between accounts)
  const getDefaultState = (heroName = '單字勇者', heroClass = 'novice') => ({
    heroName: heroName,
    heroClass: heroClass || 'novice',
    unlockedClasses: [],
    classAwakening: {},
    currentHp: 120,
    gold: 60,
    streak: 1,
    lastActiveDate: '',
    lastActiveTimestamp: Date.now(),
    leavePassExpires: 0,
    activeBuff: null,
    equippedWeapon: 'w1',
    equippedArmor: 'a1',
    equippedRelic: null,
    ownedWeapons: ['w1'],
    ownedArmors: ['a1'],
    ownedRelics: [],
    inventory: {
      potion: 2,
      guard_scroll: 1
    },
    dungeonProgress: 1,
    dungeonFirstCleared: [],
    towerFloor: 1,
    towerPoints: 0,
    towerRecordFloor: 1,
    vocabStats: {},
    bestiaryUnlocked: [],
    bookmarkedWords: [],
    mistakeWords: [],
    isAdmin: false,
    dailyGoals: {
      date: '',
      answered: 0,
      correct: 0,
      claimed: [false, false, false]
    },
    endlessPracticeCounter: 0,
    checkinClaimedDate: '',
    checkinDayIndex: 0,
    lotteryPity: 0,
    lotteryTotalSpins: 0
  });

  // Global App State
  let state = getDefaultState();
  let gateSelectedHeroClass = 'knight';

  // Runtime Battle State
  let battle = {
    active: false,
    mode: 'dungeon', // 'dungeon' | 'tower'
    stageId: 1,
    enemyName: '',
    enemyMaxHp: 100,
    enemyCurrentHp: 100,
    enemyAtk: 10,
    enemyDef: 5,
    timeLimit: 15,
    currentTime: 15,
    timerId: null,
    currentQuestion: null,
    currentTurn: 1,
    combo: 0,
    correctInSession: 0,
    totalInSession: 0,
    bossTrait: null,
    minionKey: null,
    timeReductionNext: 0,
    burnTurns: 0,
    stoneArmorCooldown: 0
  };

  let globalTurnCounter = 0;
  let heroExpression = 'happy';
  let heroSpeechText = '';

  // Data Isolation per User
  const getStorageKey = () => {
    const user = (window.SupabaseClient && typeof SupabaseClient.getUser === 'function') ? SupabaseClient.getUser() : null;
    return (user && user.id) ? `word_dungeon_save_${user.id}` : 'word_dungeon_save_guest';
  };

  // Toggle HUD and debug visibility (debug toolbar only visible to admin)
  const setHUDVisible = (visible) => {
    const hud = document.querySelector('.top-hud');
    const dbg = document.querySelector('.debug-toolbar');
    if (hud) hud.style.display = visible ? 'block' : 'none';
    const isAdm = (window.SupabaseClient && SupabaseClient.isAdmin()) || (state && state.isAdmin);
    if (dbg) dbg.style.display = (visible && isAdm) ? 'flex' : 'none';
  };

  // Save & Load (Independent per user)
  const saveState = (syncCloud = true) => {
    try {
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(state));
      if (syncCloud && window.SupabaseClient && SupabaseClient.isLoggedIn()) {
        SupabaseClient.syncToCloud(state);
      }
    } catch (e) {
      console.error('Save failed', e);
    }
  };

  const loadState = () => {
    try {
      const key = getStorageKey();
      const data = localStorage.getItem(key);
      if (data) {
        state = Object.assign(getDefaultState(), JSON.parse(data));
      } else {
        state = getDefaultState();
      }
      state.isAdmin = (window.SupabaseClient && SupabaseClient.isAdmin()) || state.isAdmin || false;
      if (!Array.isArray(state.bookmarkedWords)) state.bookmarkedWords = [];
      if (!Array.isArray(state.mistakeWords)) state.mistakeWords = [];
      if (!Array.isArray(state.unlockedClasses)) {
        state.unlockedClasses = (state.heroClass && state.heroClass !== 'novice') ? [state.heroClass] : [];
      }
      if (!state.heroClass) state.heroClass = 'novice';
      if (!state.classAwakening || typeof state.classAwakening !== 'object') state.classAwakening = {};
    } catch (e) {
      console.error('Load failed', e);
      state = getDefaultState();
    }
  };

  // Helper for Date String YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Calculate Hero Computed Stats
  const getHeroStats = () => {
    const base = Object.assign({}, GAME_CONFIG.HERO_BASE);

    // Hero Class / Form Specialty Perks & Awakening
    const heroClassId = state.heroClass || 'novice';
    let classGoldBonus = 0;

    if (heroClassId !== 'novice') {
      const currentClass = GAME_CONFIG.HERO_CLASSES ? GAME_CONFIG.HERO_CLASSES.find(c => c.id === heroClassId) : null;
      if (currentClass && currentClass.bonus) {
        base.maxHp += currentClass.bonus.hp || 0;
        base.atk += currentClass.bonus.atk || 0;
        base.def += currentClass.bonus.def || 0;
        base.timeBonus += currentClass.bonus.timeBonus || 0;
        if (currentClass.bonus.goldMultiplier) {
          classGoldBonus += currentClass.bonus.goldMultiplier;
        }
      }

      // Add Awakening Ranks bonus (Rank 1 to 5)
      const awakeningRank = (state.classAwakening && state.classAwakening[heroClassId]) || 0;
      if (awakeningRank > 0 && GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses && GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses[heroClassId]) {
        const bonusObj = GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses[heroClassId][awakeningRank];
        if (bonusObj) {
          base.maxHp += bonusObj.hp || 0;
          base.atk += bonusObj.atk || 0;
          base.def += bonusObj.def || 0;
          base.timeBonus += bonusObj.timeBonus || 0;
          if (bonusObj.goldMultiplier) {
            classGoldBonus += bonusObj.goldMultiplier;
          }
        }
      }
    }

    // Weapon
    const weapon = GAME_CONFIG.EQUIPMENT.weapons.find(w => w.id === state.equippedWeapon);
    if (weapon) {
      base.atk += weapon.atk || 0;
      base.def += weapon.def || 0;
      base.maxHp += weapon.hp || 0;
    }

    // Armor
    const armor = GAME_CONFIG.EQUIPMENT.armors.find(a => a.id === state.equippedArmor);
    if (armor) {
      base.maxHp += armor.hp || 0;
      base.def += armor.def || 0;
      base.atk += armor.atk || 0;
    }

    // Relic
    const relic = GAME_CONFIG.EQUIPMENT.relics.find(r => r.id === state.equippedRelic);
    if (relic) {
      base.maxHp += relic.hp || 0;
      base.atk += relic.atk || 0;
      base.def += relic.def || 0;
      base.timeBonus += relic.timeBonus || 0;
    }

    // Timed Buff
    let goldMultiplier = 1.0 + classGoldBonus;
    if (state.activeBuff && state.activeBuff.expiresAt > Date.now()) {
      if (state.activeBuff.type === 'atk') base.atk = Math.round(base.atk * (1 + state.activeBuff.val));
      if (state.activeBuff.type === 'def') base.def = Math.round(base.def * (1 + state.activeBuff.val));
      if (state.activeBuff.type === 'time') base.timeBonus += state.activeBuff.val;
      if (state.activeBuff.type === 'gold') goldMultiplier += state.activeBuff.val;
      if (state.activeBuff.type === 'all') {
        base.atk = Math.round(base.atk * 1.3);
        base.def = Math.round(base.def * 1.3);
        base.timeBonus += (state.activeBuff.timeVal || 2.5);
      }
    } else if (state.activeBuff && state.activeBuff.expiresAt <= Date.now()) {
      state.activeBuff = null;
    }

    return {
      maxHp: base.maxHp,
      atk: base.atk,
      def: base.def,
      timeBonus: base.timeBonus,
      goldMultiplier: goldMultiplier
    };
  };

  // Check Absence, Starvation, and Determine Hero Mood
  const checkAbsence = () => {
    const now = Date.now();
    const today = getTodayStr();

    if (!state.lastActiveTimestamp) {
      // First time play
      state.lastActiveTimestamp = now;
      state.lastActiveDate = today;
      state.currentHp = getHeroStats().maxHp;
      heroExpression = 'happy';
      heroSpeechText = GAME_CONFIG.DIALOGUES.praise[0];
      saveState();
      return;
    }

    const diffDays = Math.floor((now - state.lastActiveTimestamp) / 86400000);

    if (diffDays >= 1) {
      const isLeaveActive = state.leavePassExpires && state.leavePassExpires > now;

      if (isLeaveActive) {
        // Safe vacation
        heroExpression = 'vacation';
        heroSpeechText = GAME_CONFIG.DIALOGUES.vacation[0];
      } else {
        // Unexcused absence penalty
        const stats = getHeroStats();
        const penaltyPerDay = Math.round(stats.maxHp * 0.15);
        const totalPenalty = penaltyPerDay * diffDays;
        state.currentHp = Math.max(1, state.currentHp - totalPenalty);

        // Break streak
        state.streak = 1;

        if (diffDays <= 2) {
          heroExpression = 'hungry';
          heroSpeechText = GAME_CONFIG.DIALOGUES.complaint_1_2[Math.floor(Math.random() * GAME_CONFIG.DIALOGUES.complaint_1_2.length)];
        } else if (diffDays <= 6) {
          heroExpression = 'sarcastic';
          heroSpeechText = GAME_CONFIG.DIALOGUES.sarcasm_3_6[Math.floor(Math.random() * GAME_CONFIG.DIALOGUES.sarcasm_3_6.length)];
        } else {
          heroExpression = 'ghost';
          heroSpeechText = GAME_CONFIG.DIALOGUES.ghost_7_plus[Math.floor(Math.random() * GAME_CONFIG.DIALOGUES.ghost_7_plus.length)];
        }
      }
    } else {
      // Continuous / Same Day login
      heroExpression = 'happy';
      heroSpeechText = GAME_CONFIG.DIALOGUES.praise[Math.floor(Math.random() * GAME_CONFIG.DIALOGUES.praise.length)];
    }

    // Refresh daily goals on new day
    if (state.dailyGoals.date !== today) {
      state.dailyGoals = {
        date: today,
        answered: 0,
        correct: 0,
        claimed: [false, false, false]
      };
      // Increment streak if logged on consecutive day
      if (diffDays === 1) {
        state.streak += 1;
      }
    }

    state.lastActiveDate = today;
    state.lastActiveTimestamp = now;
    saveState();
  };

  // ==========================================
  // DYNAMIC VOCABULARY ENGINE (Scheme 1: Lightweight Graded 10,000+ Words)
  // ==========================================
  const tierPoolCache = {};

  // Retrieve full vocabulary pool for a given tier (combines VOCAB_DATABASE and VOCAB_REPOSITORY)
  const getTierVocabPool = (tier) => {
    tier = Math.min(15, Math.max(1, tier));
    if (tierPoolCache[tier]) return tierPoolCache[tier];

    const repoList = (window.VOCAB_REPOSITORY && window.VOCAB_REPOSITORY[tier]) || [];
    const craftedList = (window.VOCAB_DATABASE || []).filter(v => v.tier === tier);

    const mappedRepo = repoList.map((entry) => {
      const w = entry[0];
      const p = entry[1];
      const m = entry[2];
      const wordId = `t${tier}_${w.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      return {
        id: wordId,
        word: w,
        pos: p,
        meaning: m,
        tier: tier,
        isHandcrafted: false
      };
    });

    const combined = [...craftedList, ...mappedRepo];
    tierPoolCache[tier] = combined;
    return combined;
  };

  // Find a vocabulary item by ID across both databases
  const findVocabById = (id) => {
    if (!id) return null;
    const crafted = (window.VOCAB_DATABASE || []).find(v => v.id === id);
    if (crafted) return crafted;

    const m = id.match(/^t(\d+)_(.+)$/);
    if (m) {
      const tier = parseInt(m[1], 10);
      const wordKey = m[2];
      const pool = getTierVocabPool(tier);
      const found = pool.find(item => item.id === id || item.word.toLowerCase().replace(/[^a-z0-9]/g, '_') === wordKey);
      if (found) {
        return {
          id: found.id,
          word: found.word,
          pos: found.pos,
          meaning: found.meaning,
          tier: tier,
          categoryLabel: `Tier ${tier}`,
          sentence: `The party discussed the significance of ______ during their rest.`,
          sentenceTarget: found.word,
          sentenceZh: `請依據語境選出適合單字【${found.meaning}】。`
        };
      }
    }
    return null;
  };

  const getAllTrackedVocabList = (targetIds) => {
    if (!Array.isArray(targetIds) || targetIds.length === 0) return [];
    const result = [];
    const seen = new Set();
    for (const id of targetIds) {
      if (seen.has(id)) continue;
      const item = findVocabById(id);
      if (item) {
        result.push(item);
        seen.add(id);
      }
    }
    return result;
  };

  // Helper to pick N distinct random items from an array
  const pickDistinct = (arr, count) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    const unique = Array.from(new Set(shuffled));
    return unique.slice(0, count);
  };

  // Dojo Vocabulary Pool Selector
  const getDojoVocabPool = (category) => {
    let tiers = [1, 2];
    if (category === 'elementary') tiers = [1, 2, 3];
    else if (category === 'highschool') tiers = [4, 5, 6, 7, 8];
    else if (category === 'toeic') tiers = [10, 11, 12, 13];
    else if (category === 'gre') tiers = [9, 14, 15];
    else if (category === 'mistakes') {
      const targetIds = Array.from(new Set([...(state.mistakeWords || []), ...(state.bookmarkedWords || [])]));
      const list = getAllTrackedVocabList(targetIds);
      if (list.length > 0) return list;
      tiers = [1, 2, 3, 4, 5];
    } else {
      tiers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    }

    const fullPool = [];
    tiers.forEach(t => {
      const p = getTierVocabPool(t);
      if (p && p.length > 0) fullPool.push(...p);
    });
    return fullPool.length > 0 ? fullPool : getTierVocabPool(1);
  };

  // SRS Weighted Question Selection
  const pickVocab = (tier) => {
    globalTurnCounter++;
    let pool = [];

    if (battle.mode === 'review') {
      const targetIds = Array.from(new Set([...(state.bookmarkedWords || []), ...(state.mistakeWords || [])]));
      pool = getAllTrackedVocabList(targetIds);
      if (pool.length === 0) pool = getTierVocabPool(1).slice(0, 8);
    } else if (battle.mode === 'dojo_class_trial') {
      pool = getDojoVocabPool('toeic');
      if (pool.length === 0) pool = getTierVocabPool(10);
    } else if (battle.mode === 'dojo_awakening_trial') {
      pool = getDojoVocabPool('gre');
      if (pool.length === 0) pool = getTierVocabPool(14);
    } else if (battle.mode === 'dojo') {
      pool = getDojoVocabPool(battle.dojoCategory || 'all');
    } else {
      pool = getTierVocabPool(tier);
      if (pool.length === 0) pool = getTierVocabPool(1).slice(0, 5);
    }

    const weightedList = pool.map(item => {
      const s = state.vocabStats[item.id] || { seen: 0, correct: 0, wrong: 0, streak: 0, lastTurn: 0 };
      const isBookmarked = (state.bookmarkedWords || []).includes(item.id);
      const isMistake = (state.mistakeWords || []).includes(item.id);
      let weight = 100;

      if (s.seen === 0) {
        weight = 110; // Highest priority for brand new words
      } else if (isMistake || (s.wrong > 0 && s.streak < 3)) {
        weight = 130 + s.wrong * 15 - s.streak * 12;
      } else if (isBookmarked) {
        weight = 90;
      } else {
        weight = Math.max(12, Math.round(30 / (1 + 0.3 * s.correct)));
      }

      // 3-turn cooldown to avoid immediate consecutive repeats
      if (s.lastTurn > 0 && (globalTurnCounter - s.lastTurn) <= 3 && pool.length > 3) {
        weight *= 0.1;
      }

      return { item, weight };
    });

    const totalWeight = weightedList.reduce((acc, cur) => acc + cur.weight, 0);
    let rand = Math.random() * totalWeight;

    for (const entry of weightedList) {
      rand -= entry.weight;
      if (rand <= 0) {
        if (!state.vocabStats[entry.item.id]) {
          state.vocabStats[entry.item.id] = { seen: 0, correct: 0, wrong: 0, streak: 0, lastTurn: globalTurnCounter };
        } else {
          state.vocabStats[entry.item.id].lastTurn = globalTurnCounter;
        }
        return entry.item;
      }
    }
    return pool[0];
  };

  // Build 4 Question Types (Dynamic Synthesis Engine)
  const generateQuestion = (tier) => {
    const vocab = pickVocab(tier);
    const type = Math.floor(Math.random() * 4) + 1;
    let tierPool;
    if (battle.mode === 'dojo_class_trial') {
      tierPool = getDojoVocabPool('toeic');
    } else if (battle.mode === 'dojo_awakening_trial') {
      tierPool = getDojoVocabPool('gre');
    } else if (battle.mode === 'dojo') {
      tierPool = getDojoVocabPool(battle.dojoCategory || 'all');
    } else {
      tierPool = getTierVocabPool(tier);
    }

    let qData = {
      type: type,
      vocab: vocab,
      resolved: false
    };

    if (type === 1) {
      // Type 1: Dual Choice POS + Meaning
      let posOptions = ['n.', 'v.', 'adj.', 'adv.'];
      if (!posOptions.includes(vocab.pos)) {
        posOptions = [vocab.pos, 'n.', 'v.', 'adj.'].slice(0, 4);
      }
      posOptions.sort(() => Math.random() - 0.5);

      let distractorMeanings = [];
      if (vocab.distractorsMeaning && vocab.distractorsMeaning.length >= 3) {
        distractorMeanings = vocab.distractorsMeaning.slice(0, 3);
      } else {
        const otherMeanings = tierPool
          .filter(v => v.meaning !== vocab.meaning)
          .map(v => v.meaning);
        distractorMeanings = pickDistinct(otherMeanings, 3);
      }

      const meaningChoices = [vocab.meaning, ...distractorMeanings].sort(() => Math.random() - 0.5);
      qData.posOptions = posOptions;
      qData.meaningChoices = meaningChoices;
      qData.correctPos = vocab.pos;
      qData.correctMeaning = vocab.meaning;
      qData.userSelectedPos = null;
      qData.userSelectedMeaning = null;

    } else if (type === 2) {
      // Type 2: Sentence Cloze in Context
      let sentence = vocab.sentence;
      let sentenceZh = vocab.sentenceZh;

      if (!sentence) {
        const posTemplates = {
          'n.': [
            'The brave adventurer discovered an ancient ______ inside the secret vault.',
            'Every knight in the realm must respect this sacred ______.',
            'A glowing ______ rested upon the stone altar of the forgotten temple.',
            'Without adequate ______, venturing into the deeper labyrinth is perilous.'
          ],
          'v.': [
            'The party members must ______ together before the chamber walls collapse.',
            'Legends state that only a pure heart can ______ the seal of the holy relic.',
            'The paladin stepped forward to ______ the sanctuary against encroaching gloom.',
            'The scouts gathered near the campfire to ______ for the treacherous trial ahead.'
          ],
          'adj.': [
            'The winding stone corridor felt remarkably ______ to the wary party scouts.',
            'A ______ aura emanated from the glowing runes embedded in the chamber floor.',
            'Only a truly ______ champion could endure the trials of the Babel Tower.',
            'The ancient stone tablets bore a ______ message that puzzled the scholar.'
          ],
          'adv.': [
            'The phantom assassin moved ______ through the corridor without alerting the sentry.',
            'The battle mage ______ cast the barrier before the dragon fire struck the squad.',
            'The massive dungeon gates swung open ______ as the champion placed the talisman.'
          ]
        };
        const templates = posTemplates[vocab.pos] || [
          'Mastering this ______ is essential for survival in this perilous floor.'
        ];
        sentence = templates[Math.floor(Math.random() * templates.length)];
        sentenceZh = `依據語境與【${vocab.meaning}】之意選出正確單字填入空格。`;
      }

      let choices = [];
      if (vocab.sentenceChoices && vocab.sentenceChoices.length >= 4) {
        choices = [...vocab.sentenceChoices].sort(() => Math.random() - 0.5);
      } else {
        const samePosWords = tierPool
          .filter(v => v.word.toLowerCase() !== vocab.word.toLowerCase() && v.pos === vocab.pos)
          .map(v => v.word);
        const otherWords = tierPool
          .filter(v => v.word.toLowerCase() !== vocab.word.toLowerCase())
          .map(v => v.word);
        const poolToPick = samePosWords.length >= 3 ? samePosWords : otherWords;
        const distractors = pickDistinct(poolToPick, 3);
        choices = [vocab.word, ...distractors].sort(() => Math.random() - 0.5);
      }

      vocab.sentence = sentence;
      vocab.sentenceZh = sentenceZh;
      vocab.sentenceTarget = vocab.word;
      qData.choices = choices;
      qData.correctAnswer = vocab.word;

    } else if (type === 3) {
      // Type 3: Spelling Fill-in
      let spellingWord = vocab.spellingWord;
      let neededLetters = vocab.spellingMissing;
      let lettersPool = vocab.spellingPool;

      if (!spellingWord || !neededLetters || !lettersPool) {
        const cleanLetters = vocab.word.toLowerCase().replace(/[^a-z]/g, '');
        const len = cleanLetters.length;
        let blankIndices = [];

        if (len <= 4) {
          blankIndices = [1];
        } else if (len <= 7) {
          blankIndices = [1, Math.min(len - 2, 3)];
        } else {
          blankIndices = [2, Math.min(len - 3, 4), Math.min(len - 2, 6)];
        }

        const chars = cleanLetters.split('');
        neededLetters = blankIndices.map(idx => chars[idx]);

        const spaced = chars.map((ch, idx) => blankIndices.includes(idx) ? '_' : ch);
        spellingWord = spaced.join(' ');

        const fillerLetters = ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'l', 'n', 'c', 'd', 'p', 'm', 'y', 'k'];
        const randomFillers = pickDistinct(fillerLetters.filter(l => !neededLetters.includes(l)), 5);
        lettersPool = [...neededLetters, ...randomFillers].sort(() => Math.random() - 0.5);
      }

      vocab.spellingWord = spellingWord;
      vocab.spellingMissing = neededLetters;
      vocab.spellingPool = lettersPool;
      qData.lettersPool = [...lettersPool].sort(() => Math.random() - 0.5);
      qData.neededLetters = neededLetters;
      qData.userTypedLetters = [];

    } else if (type === 4) {
      // Type 4: Context Q&A
      let qaQuestion = vocab.qaQuestion;
      let choices = vocab.qaChoices;
      let correctIndex = vocab.qaCorrect;

      if (!qaQuestion || !choices) {
        qaQuestion = `Q: 古老地下城石碑刻有單字【${vocab.word}】(${vocab.pos})。在當前地牢情境中，此詞彙的深層含義為何？`;
        const otherEntries = tierPool.filter(v => v.word.toLowerCase() !== vocab.word.toLowerCase());
        const distractors = pickDistinct(otherEntries, 3);
        const correctChoice = `此詞代表【${vocab.meaning}】，指示破解當前地牢機關之關鍵條件。`;
        const wrongChoice1 = `誤指【${distractors[0]?.meaning || '未知危險'}】，若盲目應對將觸發防禦護盾陷阱。`;
        const wrongChoice2 = `誤解為【${distractors[1]?.meaning || '幻象迷宮'}】，會導致小隊行進方向產生偏誤。`;
        const wrongChoice3 = `代表【${distractors[2]?.meaning || '雜湊魔力'}】，屬於完全不相關的無效干擾訊息。`;

        const allChoices = [
          { text: correctChoice, isCorrect: true },
          { text: wrongChoice1, isCorrect: false },
          { text: wrongChoice2, isCorrect: false },
          { text: wrongChoice3, isCorrect: false }
        ].sort(() => Math.random() - 0.5);

        choices = allChoices.map(c => c.text);
        correctIndex = allChoices.findIndex(c => c.isCorrect);
      }

      qData.qaQuestion = qaQuestion;
      qData.choices = choices;
      qData.correctIndex = correctIndex;
    }

    return qData;
  };

  // UI Updates: Top HUD
  const updateHUD = () => {
    document.getElementById('hud-coin-icon').innerHTML = PixelSprites.icon('coin', 16);
    document.getElementById('hud-gold').textContent = state.gold;

    document.getElementById('hud-streak-icon').innerHTML = PixelSprites.icon('torch', 16);
    document.getElementById('hud-streak').textContent = `${state.streak} 天`;

    document.getElementById('hud-sound-icon').innerHTML = AudioManager.isMuted() ? PixelSprites.icon('soundOff', 16) : PixelSprites.icon('soundOn', 16);
    document.getElementById('hud-user-icon').innerHTML = PixelSprites.icon('crown', 16);
    document.getElementById('hud-hero-name').textContent = state.heroName;

    // HP Bar
    const stats = getHeroStats();
    state.currentHp = Math.min(stats.maxHp, Math.max(1, state.currentHp));
    document.getElementById('hud-hp-text').textContent = `${state.currentHp} / ${stats.maxHp}`;
    const hpPct = Math.max(0, Math.min(100, (state.currentHp / stats.maxHp) * 100));
    document.getElementById('hud-hp-fill').style.width = `${hpPct}%`;

    // Active Buff Badge
    const buffBadge = document.getElementById('hud-active-buff-badge');
    if (state.activeBuff && state.activeBuff.expiresAt > Date.now()) {
      const leftSec = Math.max(0, Math.floor((state.activeBuff.expiresAt - Date.now()) / 1000));
      const m = Math.floor(leftSec / 60);
      const s = leftSec % 60;
      buffBadge.style.display = 'flex';
      buffBadge.className = 'hud-badges badge-item badge-buff';
      buffBadge.innerHTML = `${PixelSprites.icon('buff', 14)} <span>${state.activeBuff.label} (${m}:${String(s).padStart(2, '0')})</span>`;
    } else {
      buffBadge.style.display = 'none';
    }

    // Leave Pass Badge
    const leaveBadge = document.getElementById('hud-leave-pass-badge');
    if (state.leavePassExpires && state.leavePassExpires > Date.now()) {
      const leftDays = Math.ceil((state.leavePassExpires - Date.now()) / 86400000);
      leaveBadge.style.display = 'flex';
      leaveBadge.className = 'hud-badges badge-item badge-leave';
      leaveBadge.innerHTML = `${PixelSprites.icon('scroll', 14)} <span>休假中 (${leftDays}天)</span>`;
    } else {
      leaveBadge.style.display = 'none';
    }

    // Admin Badge & Debug Toolbar visibility
    const isAdm = (window.SupabaseClient && SupabaseClient.isAdmin()) || state.isAdmin;
    state.isAdmin = isAdm;
    const adminBadge = document.getElementById('hud-admin-badge');
    if (adminBadge) {
      if (isAdm) {
        adminBadge.style.display = 'flex';
        adminBadge.innerHTML = `${PixelSprites.icon('crown', 14)} <span>GM 總管</span>`;
      } else {
        adminBadge.style.display = 'none';
      }
    }
    const dbgToolbar = document.querySelector('.debug-toolbar');
    if (dbgToolbar) {
      dbgToolbar.style.display = isAdm ? 'flex' : 'none';
    }
  };

  // Render View Helper
  const setMainView = (html) => {
    document.getElementById('main-content').innerHTML = html;
  };

  // ==========================================
  // VIEW: Camp Lobby
  // ==========================================
  const renderLobbyView = () => {
    const stats = getHeroStats();

    // Map weapon tier
    const weaponItem = GAME_CONFIG.EQUIPMENT.weapons.find(w => w.id === state.equippedWeapon);
    const weaponTier = weaponItem ? weaponItem.tier : 1;
    const armorItem = GAME_CONFIG.EQUIPMENT.armors.find(a => a.id === state.equippedArmor);
    const armorTier = armorItem ? armorItem.tier : 1;
    const relicItem = GAME_CONFIG.EQUIPMENT.relics.find(r => r.id === state.equippedRelic);
    const relicTier = relicItem ? relicItem.tier : 0;

    const html = `
      <div class="cabin-lodge-container">
        <!-- 1. Hero Hearth & Rest Area (冒險者壁爐與休息地毯) -->
        <div class="cabin-hearth-card">
          <!-- Pixel Stone Hearth & Fireplace Scene -->
          <div class="cabin-hearth-scene">
            ${PixelSprites.renderCabinHearth()}
            <div class="cabin-hero-perch" onclick="App.showClassSelectModal()" style="cursor:pointer;" title="點擊切換英雄姿態與神域覺醒">
              ${PixelSprites.renderHero(heroExpression, weaponTier, armorTier, relicTier, state.heroClass || 'novice', (state.classAwakening && state.classAwakening[state.heroClass]) || 0)}
            </div>
          </div>

          <!-- Hero Class Insignia Plaque -->
          <div class="cabin-class-plaque-row">
            ${state.heroClass === 'novice' ? `
              <button class="cabin-plaque-btn novice-plaque" onclick="App.showClassSelectModal()">
                ${PixelSprites.icon('quill', 12)}
                <span>🔰 見習村民 (點此前往道場多益轉職)</span>
              </button>
            ` : `
              <button class="cabin-plaque-btn" onclick="App.showClassSelectModal()">
                ${PixelSprites.icon('crown', 12)}
                <span>【${(GAME_CONFIG.HERO_CLASSES ? GAME_CONFIG.HERO_CLASSES.find(c => c.id === state.heroClass) : null)?.name || '未知職業'}】</span>
                ${((state.classAwakening && state.classAwakening[state.heroClass]) || 0) > 0 ? `
                  <span class="awakening-stars-tag">★x${state.classAwakening[state.heroClass]}</span>
                ` : `
                  <span style="color:#d4a0ff; font-size:10px;">[未覺醒]</span>
                `}
                <span style="color:var(--gold); font-size:10px; margin-left:3px;">[姿態/覺醒]</span>
              </button>
            `}
          </div>

          <!-- Hearthside Cozy Speech Bubble -->
          <div class="cabin-speech-bubble">
            <div class="cabin-speech-pointer"></div>
            <div>${heroSpeechText}</div>
          </div>

          <!-- 3 Carved Wooden Status Plaques -->
          <div class="cabin-stats-row">
            <div class="cabin-stat-plaque stat-hp">
              <span class="cabin-stat-label">${PixelSprites.icon('heart', 12)} 最大生命</span>
              <span class="cabin-stat-val">${stats.maxHp} HP</span>
            </div>
            <div class="cabin-stat-plaque stat-atk">
              <span class="cabin-stat-label">${PixelSprites.icon('sword', 12)} 總攻擊力</span>
              <span class="cabin-stat-val">${stats.atk} ATK</span>
            </div>
            <div class="cabin-stat-plaque stat-def">
              <span class="cabin-stat-label">${PixelSprites.icon('shield', 12)} 總防禦力</span>
              <span class="cabin-stat-val">${stats.def} DEF</span>
            </div>
          </div>
        </div>

        <!-- 2. Cabin Interactive Facilities (三大冒險模式：觀星窗台、討伐告示板、劍技木人樁) -->
        <div class="cabin-section-box">
          <div class="cabin-section-header">
            <span>🪵 小屋冒險設施 (點擊出發探索)</span>
          </div>

          <div class="cabin-props-grid">
            <!-- 觀星窗台・挑戰登塔 -->
            <button class="cabin-prop-btn prop-btn-tower" id="btn-mode-tower">
              <div class="prop-icon-frame">
                ${PixelSprites.renderTowerWindow(40)}
              </div>
              <div class="prop-info-col">
                <div class="prop-title">觀星窗台・挑戰登塔</div>
                <div class="prop-desc">1000層通天塔・5分升層</div>
                <div class="prop-badge badge-tower">${PixelSprites.icon('tower', 10)} 目前進度: ${state.towerFloor}F (${state.towerPoints}/5點)</div>
              </div>
            </button>

            <!-- 討伐告示板・地下城 -->
            <button class="cabin-prop-btn prop-btn-dungeon" id="btn-mode-dungeon">
              <div class="prop-icon-frame">
                ${PixelSprites.renderBountyBoard(40)}
              </div>
              <div class="prop-info-col">
                <div class="prop-title">討伐告示板・地下城</div>
                <div class="prop-desc">15大固定Boss・耐戰高題量</div>
                <div class="prop-badge badge-dungeon">${PixelSprites.icon('skull', 10)} 目前開放至: B${state.dungeonProgress}F</div>
              </div>
            </button>
          </div>

          <!-- 劍技木人樁・修煉道場 (到場) -->
          <button class="cabin-prop-btn prop-btn-dojo" id="btn-mode-dojo">
            <div class="prop-icon-frame">
              ${PixelSprites.renderTrainingDummy(42)}
            </div>
            <div class="prop-info-col">
              <div class="prop-title gold-title">⚔️ 劍術木人樁・修煉道場 (到場)</div>
              <div class="prop-desc">自選題庫・無傷切磋・熟練詞彙・無限連擊</div>
              <div class="prop-tags-row">
                <span class="cabin-tag tag-practice">自由練習・單字專修</span>
                <span class="cabin-tag tag-toeic">多益轉職考驗</span>
                <span class="cabin-tag tag-gre">GRE神域覺醒</span>
              </div>
            </div>
          </button>
        </div>

        <!-- 3. Cabin Furniture & Supplies (五大機能家具按鈕：可觸摸的實物風格) -->
        <div class="cabin-section-box">
          <div class="cabin-section-header">
            <span>🪑 小屋家具與補給物資 (點擊互動)</span>
          </div>

          <div class="cabin-furniture-grid">
            <!-- 矮人食堂 (餐桌) -->
            <button class="cabin-furniture-card" id="btn-open-tavern" title="矮人食堂：享用美味料理恢復生命">
              <div class="furniture-sprite-wrap">
                ${PixelSprites.renderTavernTable(28)}
              </div>
              <span class="furniture-title">矮人食堂</span>
              <span class="furniture-desc">餐桌烤肉</span>
            </button>

            <!-- 公會商城 (行囊寶箱) -->
            <button class="cabin-furniture-card" id="btn-open-shop" title="公會商城：購置武器、防具與保命道具">
              <div class="furniture-sprite-wrap">
                ${PixelSprites.renderSupplyChest(28)}
              </div>
              <span class="furniture-title">公會商城</span>
              <span class="furniture-desc">行囊寶箱</span>
            </button>

            <!-- 記憶禁書閣 (藏書架) -->
            <button class="cabin-furniture-card" id="btn-open-codex" title="記憶禁書閣：研讀收藏單字與魔物圖鑑">
              <div class="furniture-sprite-wrap">
                ${PixelSprites.renderBookshelfTome(28)}
              </div>
              <span class="furniture-title">記憶禁書閣</span>
              <span class="furniture-desc">魔法書架</span>
            </button>

            <!-- 每日簽到 (行事曆) -->
            <button class="cabin-furniture-card" id="btn-open-checkin" title="每日簽到：在公會羊皮曆書簽到領取獎賞">
              <div class="furniture-sprite-wrap">
                ${PixelSprites.renderParchmentCalendar(28)}
              </div>
              <span class="furniture-title">每日簽到</span>
              <span class="furniture-desc">公會曆書</span>
            </button>

            <!-- 命運轉盤 (占卜桌) -->
            <button class="cabin-furniture-card card-fortune-gold" id="btn-open-lottery" title="命運轉盤：轉動黃金輪盤贏取9999大獎">
              <div class="furniture-sprite-wrap">
                ${PixelSprites.renderFortuneWheel(28)}
              </div>
              <span class="furniture-title gold-text">命運轉盤</span>
              <span class="furniture-desc gold-sub">占卜桌台</span>
            </button>
          </div>
        </div>

        <!-- 4. Daily Habit & Frequent Practice Card (公會委託羊皮紙手卷) -->
        <div class="cabin-quest-scroll">
          <div class="quest-scroll-header">
            <span class="quest-scroll-title">📜 冒險者公會每日委託手卷</span>
            <span class="quest-scroll-count">今日答對: ${state.dailyGoals.correct} 題</span>
          </div>

          <div class="quest-scroll-item">
            <div class="quest-item-text">
              <span class="quest-name">【熱身委託】答對 10 題</span>
              <span class="quest-bounty">+25 G</span>
            </div>
            <button class="cabin-seal-btn" id="claim-goal-0" ${state.dailyGoals.correct >= 10 && !state.dailyGoals.claimed[0] ? '' : 'disabled'}>
              ${state.dailyGoals.claimed[0] ? '已達成 ✓' : '火漆領賞'}
            </button>
          </div>

          <div class="quest-scroll-item">
            <div class="quest-item-text">
              <span class="quest-name">【精進委託】答對 25 題</span>
              <span class="quest-bounty">+45 G + 聖水</span>
            </div>
            <button class="cabin-seal-btn" id="claim-goal-1" ${state.dailyGoals.correct >= 25 && !state.dailyGoals.claimed[1] ? '' : 'disabled'}>
              ${state.dailyGoals.claimed[1] ? '已達成 ✓' : '火漆領賞'}
            </button>
          </div>

          <div class="quest-scroll-item">
            <div class="quest-item-text">
              <span class="quest-name">【凱旋達標】答對 45 題</span>
              <span class="quest-bounty">+80 G + 護樓卷</span>
            </div>
            <button class="cabin-seal-btn" id="claim-goal-2" ${state.dailyGoals.correct >= 45 && !state.dailyGoals.claimed[2] ? '' : 'disabled'}>
              ${state.dailyGoals.claimed[2] ? '已達成 ✓' : '火漆領賞'}
            </button>
          </div>

          <div class="quest-scroll-footer">
            ${PixelSprites.icon('coin', 12)} 勤學無限賞：每答對 10 題贈 +15 G (目前進度: ${state.endlessPracticeCounter}/10)
          </div>
        </div>
      </div>
    `;

    setMainView(html);
    bindLobbyEvents();
  };

  const bindLobbyEvents = () => {
    document.getElementById('btn-mode-tower').onclick = () => startTowerMode();
    document.getElementById('btn-mode-dungeon').onclick = () => renderDungeonSelectView();
    document.getElementById('btn-mode-dojo').onclick = () => showDojoSelectModal();
    document.getElementById('btn-open-tavern').onclick = () => renderShopView('food');
    document.getElementById('btn-open-shop').onclick = () => renderShopView('equip');
    document.getElementById('btn-open-codex').onclick = () => renderCodexView('bookmarks');
    document.getElementById('btn-open-checkin').onclick = () => showCheckinModal();
    document.getElementById('btn-open-lottery').onclick = () => showLotteryModal();

    // Claim daily goals
    document.getElementById('claim-goal-0').onclick = () => claimDailyGoal(0);
    document.getElementById('claim-goal-1').onclick = () => claimDailyGoal(1);
    document.getElementById('claim-goal-2').onclick = () => claimDailyGoal(2);
  };

  const claimDailyGoal = (index) => {
    if (state.dailyGoals.claimed[index]) return;
    state.dailyGoals.claimed[index] = true;
    AudioManager.play('coin');

    if (index === 0) {
      state.gold += 25;
      showToast('領取成功！獲得 25 金幣！');
    } else if (index === 1) {
      state.gold += 45;
      state.inventory.potion = (state.inventory.potion || 0) + 1;
      showToast('領取成功！獲得 45 金幣 + 精煉生命聖水！');
    } else if (index === 2) {
      state.gold += 80;
      state.inventory.guard_scroll = (state.inventory.guard_scroll || 0) + 1;
      showToast('領取成功！獲得 80 金幣 + 神聖回血護樓卷！');
    }
    saveState();
    updateHUD();
    renderLobbyView();
  };

  // ==========================================
  // VIEW: Dungeon Mode Stage Select
  // ==========================================
  const renderDungeonSelectView = () => {
    let stagesHtml = '';

    GAME_CONFIG.DUNGEON_BOSSES.forEach(boss => {
      const isUnlocked = boss.id <= state.dungeonProgress;
      const isCleared = state.dungeonFirstCleared.includes(boss.id);

      stagesHtml += `
        <div class="shop-item-card" style="opacity: ${isUnlocked ? '1' : '0.5'};">
          <div class="shop-item-left">
            <div style="width: 44px; height: 44px; display:flex; align-items:center; justify-content:center;">
              ${PixelSprites.renderBoss(boss.id, 'normal')}
            </div>
            <div class="shop-item-info">
              <div class="shop-item-title">${boss.floorLabel}：${boss.name} ${isCleared ? '<span style="color:#44dd66; font-size:11px;">[已通關]</span>' : ''}</div>
              <div class="shop-item-desc">${boss.vocabScope}</div>
              <div style="font-size:10px; color:#a090b8;">
                血量: ${boss.maxHp} | 攻: ${boss.atk} | 防: ${boss.def} | 時限: ${boss.timeLimit}s
              </div>
              <div style="font-size:10px; color:#ffaa44;">
                特性：【${boss.traitName}】${boss.traitDesc}
              </div>
            </div>
          </div>

          <div class="shop-item-action">
            <button class="buy-btn" onclick="App.startDungeonBoss(${boss.id})" ${isUnlocked ? '' : 'disabled'}>
              ${isUnlocked ? '討伐' : '未解鎖'}
            </button>
            <span style="font-size:10px; color:var(--gold);">${PixelSprites.icon('coin', 10)} 獎勵: ${boss.goldReward}G</span>
          </div>
        </div>
      `;
    });

    const html = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="hud-btn" onclick="App.renderLobby()">&lt; 返回營地</button>
        <div style="font-weight:bold; color:var(--gold);">⚔️ 地下城 15 大深度 Boss</div>
      </div>
      <div class="items-list-container">
        ${stagesHtml}
      </div>
    `;

    setMainView(html);
  };

  // ==========================================
  // BATTLE ENGINE: Unified Combat (Dungeon & Tower)
  // ==========================================
  const startDungeonBoss = (stageId) => {
    const boss = GAME_CONFIG.DUNGEON_BOSSES.find(b => b.id === stageId);
    if (!boss) return;

    battle.active = true;
    battle.mode = 'dungeon';
    battle.stageId = stageId;
    battle.enemyName = `${boss.floorLabel} ${boss.name}`;
    battle.enemyMaxHp = boss.maxHp;
    battle.enemyCurrentHp = boss.maxHp;
    battle.enemyAtk = boss.atk;
    battle.enemyDef = boss.def;
    battle.timeLimit = boss.timeLimit;
    battle.bossTrait = boss;
    battle.combo = 0;
    battle.correctInSession = 0;
    battle.totalInSession = 0;
    battle.currentTurn = 1;
    battle.timeReductionNext = 0;
    battle.burnTurns = 0;
    battle.stoneArmorCooldown = 0;

    AudioManager.play('click');
    loadNextQuestion();
  };

  const startTowerMode = () => {
    battle.active = true;
    battle.mode = 'tower';
    battle.combo = 0;
    battle.correctInSession = 0;
    battle.totalInSession = 0;
    battle.currentTurn = 1;
    battle.timeReductionNext = 0;
    battle.burnTurns = 0;
    battle.stoneArmorCooldown = 0;

    setupTowerFloorMonster();
    AudioManager.play('click');
    loadNextQuestion();
  };

  // Dojo Selection Modal & Mode Starter (修煉道場 / 到場)
  const showDojoSelectModal = () => {
    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('sword', 16)} 勇者修煉道場 (到場自選試煉)</div>
          <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
            在道場中可無壓力自由修煉單字，每題答對皆賺取金幣與連擊，答錯不致命並自動收錄至錯題簿：
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
            <div style="background:#201435; border:1px solid #7744aa; border-radius:4px; padding:8px; text-align:center; cursor:pointer;" onclick="App.showClassSelectModal()">
              <div style="font-weight:bold; color:#ffd700; font-size:12px;">⚔️ 多益轉職考核</div>
              <div style="font-size:10px; color:#c0a0e0; margin-top:2px;">通關獲得中世紀高級職業</div>
            </div>
            <div style="background:#1b2238; border:1px solid #4477aa; border-radius:4px; padding:8px; text-align:center; cursor:pointer;" onclick="App.showAwakeningModal()">
              <div style="font-weight:bold; color:#4fe3ff; font-size:12px;">✨ GRE 神域覺醒</div>
              <div style="font-size:10px; color:#a0c0e0; margin-top:2px;">5階突破・能力躍升與神環</div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="dojo-tier-card" onclick="App.startDojoMode('elementary')">
              <div style="font-weight:bold; color:#77ffaa; font-size:13px;">📗 基礎與生活日常 (國中小 Level 1-3)</div>
              <div style="font-size:11px; color:#a0b8a0;">涵蓋約 2,200 基礎生活單字，奠定扎實英文基礎</div>
            </button>

            <button class="dojo-tier-card" onclick="App.startDojoMode('highschool')">
              <div style="font-weight:bold; color:#4fe3ff; font-size:13px;">📘 高中大考 7000 單 (Level 4-8)</div>
              <div style="font-size:11px; color:#a0c0e0;">大考必備、閱讀進階字彙與高頻克漏字題目</div>
            </button>

            <button class="dojo-tier-card" onclick="App.startDojoMode('toeic')">
              <div style="font-weight:bold; color:#ffaa44; font-size:13px;">📙 TOEIC 多益職場商務 (商務金證必考)</div>
              <div style="font-size:11px; color:#e0b090;">辦公室、會議談判、商務電郵與差旅核心單字</div>
            </button>

            <button class="dojo-tier-card" onclick="App.startDojoMode('gre')">
              <div style="font-weight:bold; color:#e080ff; font-size:13px;">📕 GRE / 托福 高階殿堂 (留學學術字彙)</div>
              <div style="font-size:11px; color:#cca0e0;">學術殿堂、邏輯思辨、高端詞彙全面挑戰</div>
            </button>

            <button class="dojo-tier-card" onclick="App.startDojoMode('mistakes')">
              <div style="font-weight:bold; color:#ff6666; font-size:13px;">🛡️ 勇者錯題專修庫 (個人專屬弱點強化)</div>
              <div style="font-size:11px; color:#e09090;">針對您的近期錯題 (${(state.mistakeWords || []).length} 題) 與收藏庫集中出題精準打擊</div>
            </button>

            <button class="dojo-tier-card" onclick="App.startDojoMode('all')">
              <div style="font-weight:bold; color:var(--gold); font-size:13px;">🌟 全單字庫綜合無盡試煉 (10,000+ 詞彙)</div>
              <div style="font-size:11px; color:var(--gold-light);">完全隨機挑戰，測試勇者的真實詞彙綜合實力</div>
            </button>
          </div>

          <button class="modal-close-btn" style="margin-top:10px;" onclick="App.closeModal()">返回大廳</button>
        </div>
      </div>
    `;
    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const startDojoMode = (categoryKey = 'all') => {
    closeModal();
    battle.active = true;
    battle.mode = 'dojo';
    battle.dojoCategory = categoryKey;
    battle.enemyName = '道場木人樁・修煉傀儡';
    battle.enemyMaxHp = 99999;
    battle.enemyCurrentHp = 99999;
    battle.enemyAtk = 0;
    battle.enemyDef = 4;
    battle.timeLimit = 20.0;
    battle.bossTrait = null;
    battle.minionKey = 'dojo_dummy';
    battle.combo = 0;
    battle.correctInSession = 0;
    battle.totalInSession = 0;
    battle.currentTurn = 1;
    battle.timeReductionNext = 0;
    battle.burnTurns = 0;
    battle.stoneArmorCooldown = 0;

    AudioManager.play('click');
    loadNextQuestion();
  };

  // Setup monster specs for Tower floors
  const setupTowerFloorMonster = () => {
    const floor = state.towerFloor;
    const tier = Math.min(15, Math.max(1, Math.ceil(floor / 66))); // 1 to 15 tier mapping

    // Scaling HP/ATK/DEF
    const baseHp = 100 + floor * 5;
    const baseAtk = 12 + Math.floor(floor * 0.28);
    const baseDef = 4 + Math.floor(floor * 0.18);
    const timeLimit = Math.max(6.0, 15.0 - (floor * 0.009));

    if (floor % 10 === 0) {
      // Gatekeeper Boss Floor!
      const bossIndex = ((floor / 10 - 1) % 15) + 1;
      const boss = GAME_CONFIG.DUNGEON_BOSSES.find(b => b.id === bossIndex);
      let variant = 'normal';
      if (floor > 750) variant = 'void';
      else if (floor > 500) variant = 'gold';
      else if (floor > 300) variant = 'shadow';
      else if (floor > 150) variant = 'blood';

      battle.enemyName = `${floor}F 守門大魔王：${boss.name}`;
      battle.enemyMaxHp = Math.round(baseHp * 1.8);
      battle.enemyCurrentHp = battle.enemyMaxHp;
      battle.enemyAtk = Math.round(baseAtk * 1.4);
      battle.enemyDef = Math.round(baseDef * 1.3);
      battle.timeLimit = timeLimit;
      battle.bossTrait = boss;
      battle.minionKey = null;
      battle.bossVariant = variant;
      battle.stageId = bossIndex;
    } else {
      // Normal / Elite Floor Minion
      const minionObj = GAME_CONFIG.TOWER_MINIONS[Math.floor(Math.random() * GAME_CONFIG.TOWER_MINIONS.length)];
      battle.enemyName = `${floor}F 守衛：${minionObj.name}`;
      battle.enemyMaxHp = baseHp;
      battle.enemyCurrentHp = baseHp;
      battle.enemyAtk = baseAtk;
      battle.enemyDef = baseDef;
      battle.timeLimit = timeLimit;
      battle.bossTrait = null;
      battle.minionKey = minionObj.key;
    }
  };

  const loadNextQuestion = () => {
    if (!battle.active) return;

    clearInterval(battle.timerId);

    // Determine vocabulary tier
    let tier = 1;
    if (battle.mode === 'dungeon') {
      const boss = GAME_CONFIG.DUNGEON_BOSSES.find(b => b.id === battle.stageId);
      tier = boss ? boss.tier : 1;
    } else if (battle.mode === 'dojo_class_trial') {
      tier = 10;
    } else if (battle.mode === 'dojo_awakening_trial') {
      tier = 14;
    } else if (battle.mode === 'dojo') {
      tier = 1;
    } else if (battle.mode === 'review') {
      tier = 1;
    } else {
      tier = Math.min(15, Math.max(1, Math.ceil(state.towerFloor / 66)));
    }

    battle.currentQuestion = generateQuestion(tier);
    typedSpellingBuffer = [];

    // Calculate current question time limit
    const heroStats = getHeroStats();
    let effectiveTime = battle.timeLimit + (heroStats.timeBonus || 0) - battle.timeReductionNext;
    battle.timeReductionNext = 0; // reset single-turn time debuffs
    effectiveTime = Math.max(3.5, effectiveTime); // safety floor
    battle.currentTime = effectiveTime;

    renderBattleView();
    startQuestionTimer(effectiveTime);
  };

  const startQuestionTimer = (totalSeconds) => {
    const timerFill = document.getElementById('battle-timer-fill');
    const timerText = document.getElementById('battle-timer-text');
    let timeLeft = totalSeconds;

    battle.timerId = setInterval(() => {
      timeLeft -= 0.1;
      battle.currentTime = Math.max(0, timeLeft);

      if (timerFill && timerText) {
        const pct = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));
        timerFill.style.width = `${pct}%`;
        timerText.textContent = `${timeLeft.toFixed(1)}s`;

        if (pct < 30) {
          timerFill.classList.add('timer-warning');
        } else {
          timerFill.classList.remove('timer-warning');
        }
      }

      if (timeLeft <= 0) {
        clearInterval(battle.timerId);
        onQuestionAnswered(false, '超時未答');
      }
    }, 100);
  };

  // Render Combat Arena UI
  const renderBattleView = () => {
    const q = battle.currentQuestion;
    const heroStats = getHeroStats();
    const heroWeapon = GAME_CONFIG.EQUIPMENT.weapons.find(w => w.id === state.equippedWeapon);
    const heroArmor = GAME_CONFIG.EQUIPMENT.armors.find(a => a.id === state.equippedArmor);
    const heroRelic = GAME_CONFIG.EQUIPMENT.relics.find(r => r.id === state.equippedRelic);

    // Enemy Sprite
    let enemySpriteHtml = '';
    if (battle.minionKey) {
      enemySpriteHtml = PixelSprites.renderMinion(battle.minionKey);
    } else {
      enemySpriteHtml = PixelSprites.renderBoss(battle.stageId, battle.bossVariant || 'normal');
    }

    // Question content by type
    let questionBodyHtml = '';

    if (q.type === 1) {
      // Type 1: POS + Meaning
      questionBodyHtml = `
        <div class="word-prompt-lg">${q.vocab.word}</div>
        <div style="font-size:11px; color:#ffdd88; text-align:center;">請同時點選正確【詞性】與【中文解釋】：</div>
        <div class="pos-selector-row">
          ${q.posOptions.map(pos => `
            <button class="pos-btn ${q.userSelectedPos === pos ? 'selected' : ''}" onclick="App.selectPos('${pos}')">${pos}</button>
          `).join('')}
        </div>
        <div class="choices-grid-2x2">
          ${q.meaningChoices.map(m => `
            <button class="pixel-choice-btn ${q.userSelectedMeaning === m ? 'selected' : ''}" onclick="App.selectMeaning('${m}')">${m}</button>
          `).join('')}
        </div>
      `;
    } else if (q.type === 2) {
      // Type 2: Sentence Cloze
      questionBodyHtml = `
        <div class="sentence-prompt">
          <div class="sentence-cloze-text">${q.vocab.sentence.replace('______', '<span class="sentence-blank">______</span>')}</div>
        </div>
        <div class="choices-grid-2x2">
          ${q.choices.map(choice => `
            <button class="pixel-choice-btn" onclick="App.answerType2('${choice}')">${choice}</button>
          `).join('')}
        </div>
      `;
    } else if (q.type === 3) {
      // Type 3: Spelling Fill-in
      let userCharIdx = 0;
      const slots = q.vocab.spellingWord.split(' ').map((char) => {
        if (char === '_') {
          const userChar = (q.userTypedLetters && q.userTypedLetters[userCharIdx]) || '';
          userCharIdx++;
          return `<div class="letter-slot slot-blank">${userChar}</div>`;
        } else {
          return `<div class="letter-slot">${char}</div>`;
        }
      }).join('');

      questionBodyHtml = `
        <div style="text-align:center; font-size:14px; color:#ffdd88;">${q.vocab.meaning} (${q.vocab.pos})</div>
        <div class="spelling-slots-row">${slots}</div>
        <div class="spelling-keys-pool">
          ${q.lettersPool.map(l => `
            <button class="letter-key-btn" onclick="App.typeSpellingLetter('${l}')">${l}</button>
          `).join('')}
          <button class="letter-key-btn backspace-btn" onclick="App.backspaceSpelling()">刪除</button>
        </div>
      `;
    } else if (q.type === 4) {
      // Type 4: Context Q&A
      questionBodyHtml = `
        <div class="sentence-prompt">
          <div style="font-weight:bold; color:#ffdd88;">${q.qaQuestion}</div>
        </div>
        <div class="choices-stack">
          ${q.choices.map((choice, idx) => `
            <button class="pixel-choice-btn" style="text-align:left; font-size:12px;" onclick="App.answerType4(${idx})">
              ${choice}
            </button>
          `).join('')}
        </div>
      `;
    }

    // Tower 5-Point block
    let towerBlockHtml = '';
    if (battle.mode === 'tower') {
      const slots = [0, 1, 2, 3, 4].map(idx => `
        <div class="point-slot ${idx < state.towerPoints ? 'filled' : ''}"></div>
      `).join('');

      towerBlockHtml = `
        <div class="tower-point-box">
          <span style="font-size:11px; color:#4fe3ff; font-weight:bold;">樓層積分:</span>
          <div class="point-blocks">${slots}</div>
          <span style="font-size:11px; color:#4fe3ff; font-weight:bold;">${state.towerPoints} / 5</span>
        </div>
      `;
    }

    // Stage Banner Bar
    let stageBannerHtml = '';
    if (battle.mode === 'dungeon') {
      const boss = GAME_CONFIG.DUNGEON_BOSSES.find(b => b.id === battle.stageId);
      const stageName = boss ? boss.name : `B${battle.stageId}F 領主`;
      stageBannerHtml = `
        <div class="stage-banner-bar">
          <span class="stage-banner-tag dungeon-tag">${PixelSprites.icon('skull', 12)} B${battle.stageId}F 地下城領地</span>
          <span class="stage-banner-title">${stageName}</span>
          <span style="font-size:10px; color:#ff9999;">魔王關卡: ${battle.stageId} / 15</span>
        </div>
      `;
    } else if (battle.mode === 'tower') {
      let altitudeName = '夜幕要塞階梯 (1-20F)';
      const f = state.towerFloor;
      if (f > 500) altitudeName = '星河創世神殿 (501-1000F)';
      else if (f > 250) altitudeName = '極光極限秘境 (251-500F)';
      else if (f > 100) altitudeName = '暮光星穹觀景台 (101-250F)';
      else if (f > 50) altitudeName = '蔚藍平流層神廟 (51-100F)';
      else if (f > 20) altitudeName = '晨曦雲海迴廊 (21-50F)';

      stageBannerHtml = `
        <div class="stage-banner-bar">
          <span class="stage-banner-tag tower-tag">${PixelSprites.icon('tower', 12)} 通天塔第 ${state.towerFloor} 層</span>
          <span class="stage-banner-title">${altitudeName}</span>
          <span style="color:#4fe3ff; font-weight:bold;">${state.towerPoints} / 5 積分</span>
        </div>
      `;
    } else if (battle.mode === 'dojo_class_trial') {
      const targetClass = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === battle.targetClassId);
      const className = targetClass ? targetClass.name : '職業';
      stageBannerHtml = `
        <div class="stage-banner-bar">
          <span class="stage-banner-tag dojo-tag">${PixelSprites.icon('shield', 12)} 道場轉職考驗 (多益難度)</span>
          <span class="stage-banner-title">晉升【${className}】資格試煉</span>
          <span style="color:#ffd700; font-weight:bold;">合格: ${battle.trialCorrectCount || 0} / 5 (失誤: ${(battle.trialMistakes || 0)} / 2)</span>
        </div>
      `;
    } else if (battle.mode === 'dojo_awakening_trial') {
      const targetClass = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === battle.targetClassId);
      const className = targetClass ? targetClass.name : '職業';
      const rank = battle.targetRank || 1;
      const req = (GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements[rank]) || { requiredCorrect: 5, maxMistakes: 2 };
      stageBannerHtml = `
        <div class="stage-banner-bar">
          <span class="stage-banner-tag" style="background:#4a154b; color:#f0a3ff; border:1px solid #c058f8;">${PixelSprites.icon('gem', 12)} 神域覺醒試煉 (GRE難度)</span>
          <span class="stage-banner-title">【${className}】第 ${rank} 階覺醒</span>
          <span style="color:#f0a3ff; font-weight:bold;">合格: ${battle.trialCorrectCount || 0} / ${req.requiredCorrect} (失誤: ${(battle.trialMistakes || 0)} / ${req.maxMistakes})</span>
        </div>
      `;
    } else if (battle.mode === 'dojo') {
      const catLabels = {
        elementary: '基礎生活 (國中小 1-3)',
        highschool: '高中大考 7000 單 (4-8)',
        toeic: 'TOEIC 多益職場商務',
        gre: 'GRE / 托福 高階殿堂',
        mistakes: '錯題強化專修庫',
        all: '全單字庫綜合試煉'
      };
      const catName = catLabels[battle.dojoCategory] || '自由修煉';
      stageBannerHtml = `
        <div class="stage-banner-bar">
          <span class="stage-banner-tag dojo-tag">${PixelSprites.icon('sword', 12)} 勇者修煉道場 (到場)</span>
          <span class="stage-banner-title">${catName}</span>
          <span style="color:#ffd700; font-weight:bold;">連擊 x${battle.combo}</span>
        </div>
      `;
    }

    const html = `
      <div class="battle-arena-wrapper">
        <!-- Stage & Floor Indicator -->
        ${stageBannerHtml}

        <!-- Battle Top Info Bar -->
        <div class="battle-header-info">
          <div>
            <span style="color:var(--gold); font-weight:bold;">${battle.enemyName}</span>
          </div>
          <div>
            <span style="color:#ffaa44;">Combo x${battle.combo}</span>
          </div>
        </div>

        ${towerBlockHtml}

        <!-- Medieval Combat Duel Stage -->
        <div class="duel-stage ${battle.mode === 'dungeon' ? 'stage-medieval-dungeon' : (battle.mode === 'tower' ? 'stage-medieval-tower' : 'stage-medieval-dojo')}" id="duel-stage">
          <div class="medieval-arena-backdrop">
            ${PixelSprites.renderMedievalBackdrop(battle.mode === 'dojo_class_trial' || battle.mode === 'dojo_awakening_trial' ? 'dojo' : battle.mode, battle.stageId, state.towerFloor)}
          </div>

          <!-- Hero Unit -->
          <div class="fighter-unit" id="hero-unit">
            <div id="hero-floating-box"></div>
            <div class="fighter-name-bar">${state.heroName}</div>
            <div class="fighter-mini-hp">
              <div class="mini-hp-fill" style="width: ${(state.currentHp / heroStats.maxHp) * 100}%;"></div>
            </div>
            ${PixelSprites.renderHero(heroExpression, heroWeapon ? heroWeapon.tier : 1, heroArmor ? heroArmor.tier : 1, heroRelic ? heroRelic.tier : 0, state.heroClass || 'novice', (state.classAwakening && state.classAwakening[state.heroClass]) || 0)}
          </div>

          <!-- Enemy Unit -->
          <div class="fighter-unit" id="enemy-unit">
            <div id="enemy-floating-box"></div>
            <div class="fighter-name-bar" style="color:#ff8888;">${battle.enemyName.split(' ')[0]}</div>
            <div class="fighter-mini-hp">
              <div class="mini-hp-fill" id="enemy-hp-fill" style="width: ${(battle.enemyCurrentHp / battle.enemyMaxHp) * 100}%;"></div>
            </div>
            <div id="enemy-sprite-container">
              ${enemySpriteHtml}
            </div>
          </div>
        </div>

        <!-- Timer Bar -->
        <div class="countdown-container">
          <div style="display:flex; justify-content:space-between; font-size:11px;">
            <span>作答倒數</span>
            <span id="battle-timer-text">${battle.currentTime.toFixed(1)}s</span>
          </div>
          <div class="countdown-bar-bg">
            <div id="battle-timer-fill" class="countdown-bar-fill" style="width: 100%;"></div>
          </div>
        </div>

        <!-- Question Panel -->
        <div class="question-panel">
          <div class="question-header">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="question-type-badge">題型 ${q.type}</span>
              <span class="question-category-badge">${q.vocab.categoryLabel || '核心英文'}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <button class="audio-btn" onclick="App.speakCurrentWord()" title="播放英式/美式發音">
                ${PixelSprites.icon('speaker', 14)} <span>聽發音</span>
              </button>
              <button class="bookmark-btn ${(state.bookmarkedWords || []).includes(q.vocab.id) ? 'bookmarked' : ''}" id="btn-toggle-bookmark" onclick="App.toggleBookmark('${q.vocab.id}')" title="收藏此題至專屬複習法典">
                ${PixelSprites.icon((state.bookmarkedWords || []).includes(q.vocab.id) ? 'bookmark' : 'star', 14)}
                <span>${(state.bookmarkedWords || []).includes(q.vocab.id) ? '已收藏' : '收藏此題'}</span>
              </button>
            </div>
          </div>
          ${questionBodyHtml}
        </div>

        <!-- Quick Items Bar -->
        <div class="battle-quick-items">
          <button class="item-badge-btn" onclick="App.useQuickPotion()" ${(state.inventory.potion || 0) > 0 ? '' : 'disabled'}>
            ${PixelSprites.icon('potion', 14)} 聖水x${state.inventory.potion || 0}
          </button>
          <span class="item-badge-btn" style="cursor:default;" title="爬塔免掉層神器">
            ${PixelSprites.icon('scroll', 14)} 護樓卷x${state.inventory.guard_scroll || 0}
          </span>
          <button class="hud-btn" onclick="App.retreatBattle()">撤退</button>
        </div>
      </div>
    `;

    setMainView(html);
  };

  // Pronunciation Trigger
  const speakCurrentWord = () => {
    if (battle.currentQuestion && battle.currentQuestion.vocab) {
      AudioManager.speak(battle.currentQuestion.vocab.word);
    }
  };

  const speakWord = (word) => {
    if (word) {
      AudioManager.speak(word);
    }
  };

  // Type 1 Handlers
  const selectPos = (pos) => {
    AudioManager.play('click');
    battle.currentQuestion.userSelectedPos = pos;
    checkType1Completion();
  };

  const selectMeaning = (meaning) => {
    AudioManager.play('click');
    battle.currentQuestion.userSelectedMeaning = meaning;
    checkType1Completion();
  };

  const checkType1Completion = () => {
    const q = battle.currentQuestion;
    renderBattleView(); // update selection highlight

    if (q.userSelectedPos && q.userSelectedMeaning) {
      const isCorrect = (q.userSelectedPos === q.correctPos && q.userSelectedMeaning === q.correctMeaning);
      onQuestionAnswered(isCorrect, isCorrect ? '雙選正確！' : `答錯！正解: ${q.correctPos} ${q.correctMeaning}`);
    }
  };

  // Type 2 Handler
  const answerType2 = (choice) => {
    const q = battle.currentQuestion;
    const isCorrect = (choice === q.correctAnswer);
    onQuestionAnswered(isCorrect, isCorrect ? '填詞正確！' : `答錯！正解: ${q.correctAnswer}`);
  };

  // Type 3 Handlers
  let typedSpellingBuffer = [];
  const typeSpellingLetter = (letter) => {
    AudioManager.play('click');
    const q = battle.currentQuestion;
    typedSpellingBuffer.push(letter);
    q.userTypedLetters = [...typedSpellingBuffer];
    renderBattleView();

    if (typedSpellingBuffer.length === q.neededLetters.length) {
      const isCorrect = typedSpellingBuffer.every((char, idx) => char === q.neededLetters[idx]);
      typedSpellingBuffer = [];
      onQuestionAnswered(isCorrect, isCorrect ? '拼字正確！' : `答錯！正解缺漏字母: ${q.neededLetters.join(', ')}`);
    }
  };

  const backspaceSpelling = () => {
    AudioManager.play('click');
    if (typedSpellingBuffer.length > 0) {
      typedSpellingBuffer.pop();
      battle.currentQuestion.userTypedLetters = [...typedSpellingBuffer];
      renderBattleView();
    }
  };

  // Type 4 Handler
  const answerType4 = (idx) => {
    const q = battle.currentQuestion;
    const isCorrect = (idx === q.correctIndex);
    onQuestionAnswered(isCorrect, isCorrect ? '情境回答正確！' : '回答不合語境邏輯！');
  };

  // Question Result Processing (Combat Formula)
  const onQuestionAnswered = (isCorrect, feedbackMsg) => {
    clearInterval(battle.timerId);

    const q = battle.currentQuestion;
    const vocabId = q.vocab.id;
    battle.totalInSession++;

    // Track in SRS vocabStats
    if (!state.vocabStats[vocabId]) {
      state.vocabStats[vocabId] = { seen: 0, correct: 0, wrong: 0, streak: 0, lastTurn: globalTurnCounter };
    }
    const stat = state.vocabStats[vocabId];
    stat.seen += 1;

    // Track daily goal
    state.dailyGoals.answered += 1;

    if (isCorrect) {
      stat.correct += 1;
      stat.streak += 1;
      state.dailyGoals.correct += 1;
      state.endlessPracticeCounter += 1;
      battle.correctInSession++;
      battle.combo++;

      // Trigger Endless Practice Bonus every 10 correct words
      if (state.endlessPracticeCounter >= 10) {
        state.endlessPracticeCounter = 0;
        state.gold += 15;
        AudioManager.play('coin');
        showToast('勤學無限賞達成！獲得 +15 金幣！');
      }

      // Hero attacks Boss!
      executeHeroAttack();
    } else {
      stat.wrong += 1;
      stat.streak = 0;
      battle.combo = 0;
      AudioManager.play('buzzer');

      if (!state.mistakeWords) state.mistakeWords = [];
      if (!state.mistakeWords.includes(vocabId)) {
        state.mistakeWords.push(vocabId);
      }

      // Boss attacks Hero!
      executeEnemyAttack(feedbackMsg);
    }

    saveState();
    updateHUD();
  };

  // Hero Attack Calculation
  const executeHeroAttack = () => {
    const heroStats = getHeroStats();
    const isCrit = (battle.currentTime / (battle.timeLimit + (heroStats.timeBonus || 0)) >= 0.5);

    // Damage Formula
    const defMitigation = battle.enemyDef / (battle.enemyDef + 100);
    const comboMult = 1 + Math.min(battle.combo * 0.05, 0.30);
    const critMult = isCrit ? 1.3 : 1.0;
    const rawDmg = heroStats.atk * (1 - defMitigation) * critMult * comboMult;
    const damage = Math.max(5, Math.round(rawDmg));

    // Sound & Floating Number
    if (isCrit) {
      AudioManager.play('crit');
      showFloatingText('enemy-floating-box', `CRIT! -${damage}`, 'dmg-crit');
    } else {
      AudioManager.play('slash');
      showFloatingText('enemy-floating-box', `-${damage}`, 'dmg-enemy');
    }

    // Flash & Shake Enemy
    const enemyContainer = document.getElementById('enemy-sprite-container');
    if (enemyContainer) {
      enemyContainer.classList.add('flash-hit', 'shake');
      setTimeout(() => enemyContainer.classList.remove('flash-hit', 'shake'), 300);
    }

    // Reduce Enemy HP
    battle.enemyCurrentHp = Math.max(0, battle.enemyCurrentHp - damage);

    if (battle.mode === 'dojo_class_trial') {
      battle.trialCorrectCount = (battle.trialCorrectCount || 0) + 1;
      AudioManager.play('coin');
      showFloatingText('hero-floating-box', `試煉合格 ${battle.trialCorrectCount}/5`, 'dmg-heal');
      if (battle.trialCorrectCount >= 5) {
        setTimeout(() => onClassTrialSuccess(battle.targetClassId), 500);
      } else {
        setTimeout(() => loadNextQuestion(), 700);
      }
      return;
    }

    if (battle.mode === 'dojo_awakening_trial') {
      const rank = battle.targetRank || 1;
      const req = (GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements[rank]) || { requiredCorrect: 5, maxMistakes: 2 };
      battle.trialCorrectCount = (battle.trialCorrectCount || 0) + 1;
      AudioManager.play('coin');
      showFloatingText('hero-floating-box', `覺醒合格 ${battle.trialCorrectCount}/${req.requiredCorrect}`, 'dmg-heal');
      if (battle.trialCorrectCount >= req.requiredCorrect) {
        setTimeout(() => onAwakeningTrialSuccess(battle.targetClassId, rank), 500);
      } else {
        setTimeout(() => loadNextQuestion(), 700);
      }
      return;
    }

    if (battle.mode === 'dojo') {
      state.gold += 2;
      AudioManager.play('coin');
      showFloatingText('hero-floating-box', '+2G', 'dmg-heal');
      setTimeout(() => loadNextQuestion(), 600);
      return;
    }

    if (battle.mode === 'dungeon' || battle.mode === 'review') {
      if (battle.enemyCurrentHp <= 0) {
        setTimeout(() => onDungeonVictory(), 500);
      } else {
        setTimeout(() => loadNextQuestion(), 700);
      }
    } else {
      // Tower Mode
      // Check mimic chest extra gold
      if (battle.minionKey === 'mimic_chest') {
        state.gold += 15;
        AudioManager.play('coin');
        showToast('斬殺寶箱怪！爆出 +15 金幣！');
      }

      // Check Overkill霸氣連跳 (+2 points)
      let pointsGain = 1;
      if (isCrit && heroStats.atk > battle.enemyDef * 2 && Math.random() < 0.25) {
        pointsGain = 2;
        showToast('霸氣輾壓！積分連跳 +2 點！');
      }

      state.towerPoints += pointsGain;

      if (state.towerPoints >= 5) {
        setTimeout(() => onTowerFloorAdvance(), 500);
      } else {
        setTimeout(() => {
          setupTowerFloorMonster(); // new minion for next question!
          loadNextQuestion();
        }, 700);
      }
    }
  };

  // Enemy Attack Calculation
  const executeEnemyAttack = (feedbackMsg) => {
    if (battle.mode === 'dojo_class_trial') {
      battle.trialMistakes = (battle.trialMistakes || 0) + 1;
      showFloatingText('hero-floating-box', `失誤 ${battle.trialMistakes}/2`, 'dmg-hero');
      AudioManager.play('playerHurt');
      if (battle.trialMistakes > 2) {
        battle.trialFailed = true;
        setTimeout(() => {
          showCorrectionModal(battle.currentQuestion, feedbackMsg || '道場考官講評 (已超過最大容錯)');
        }, 400);
      } else {
        setTimeout(() => {
          showCorrectionModal(battle.currentQuestion, feedbackMsg || '道場考官講評');
        }, 400);
      }
      return;
    }

    if (battle.mode === 'dojo_awakening_trial') {
      const rank = battle.targetRank || 1;
      const req = (GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements[rank]) || { requiredCorrect: 5, maxMistakes: 2 };
      battle.trialMistakes = (battle.trialMistakes || 0) + 1;
      showFloatingText('hero-floating-box', `失誤 ${battle.trialMistakes}/${req.maxMistakes}`, 'dmg-hero');
      AudioManager.play('playerHurt');
      if (battle.trialMistakes > req.maxMistakes) {
        battle.trialFailed = true;
        setTimeout(() => {
          showCorrectionModal(battle.currentQuestion, feedbackMsg || '神域法則試煉反噬 (已超過最大容錯)');
        }, 400);
      } else {
        setTimeout(() => {
          showCorrectionModal(battle.currentQuestion, feedbackMsg || '神域法則試煉反噬');
        }, 400);
      }
      return;
    }

    if (battle.mode === 'dojo') {
      battle.combo = 0;
      showFloatingText('hero-floating-box', '木人格擋！', 'dmg-hero');
      AudioManager.play('playerHurt');
      setTimeout(() => {
        showCorrectionModal(battle.currentQuestion, feedbackMsg || '道場木人招式拆解');
      }, 400);
      return;
    }

    const heroStats = getHeroStats();
    let enemyAtk = battle.enemyAtk;
    let pierce = 0;
    let extraFixed = 0;

    // Apply Boss Traits
    if (battle.bossTrait) {
      const trait = battle.bossTrait.id;
      if (trait === 1 && battle.currentTurn % 3 === 0) extraFixed = 4; // Acid
      if (trait === 2) extraFixed = 5; // Poison sting
      if (trait === 3 && Math.random() < 0.35) enemyAtk = Math.round(enemyAtk * 1.35); // Double slash
      if (trait === 4) battle.timeReductionNext = 0.8; // Howl
      if (trait === 5) battle.timeReductionNext = 1.2; // Web
      if (trait === 7) pierce = 0.25; // Deathknight pierce
      if (trait === 8 && battle.enemyCurrentHp < battle.enemyMaxHp * 0.5) enemyAtk = Math.round(enemyAtk * 1.2);
      if (trait === 9) { // Hydra regeneration
        const healAmt = Math.round(battle.enemyMaxHp * 0.04);
        battle.enemyCurrentHp = Math.min(battle.enemyMaxHp, battle.enemyCurrentHp + healAmt);
        showFloatingText('enemy-floating-box', `+${healAmt}`, 'dmg-heal');
      }
      if (trait === 10) battle.timeReductionNext = 1.5;
      if (trait === 11) battle.burnTurns = 2;
      if (trait === 12) { pierce = 0.3; }
      if (trait === 13 && Math.random() < 0.4) enemyAtk = Math.round(enemyAtk * 1.4);
      if (trait === 14) battle.timeReductionNext = 1.8;
      if (trait === 15) {
        if (battle.enemyCurrentHp < battle.enemyMaxHp * 0.5) enemyAtk = Math.round(enemyAtk * 1.25);
        extraFixed = Math.round(heroStats.maxHp * 0.08); // True damage
      }
    }

    // Defense mitigation
    const effectiveDef = heroStats.def * (1 - pierce);
    const defMitigation = effectiveDef / (effectiveDef + 100);
    const rawDmg = enemyAtk * (1 - defMitigation);
    const damage = Math.max(1, Math.round(rawDmg) + extraFixed);

    // Apply Burn Damage if active
    let burnDmg = 0;
    if (battle.burnTurns > 0) {
      burnDmg = Math.round(heroStats.maxHp * 0.04);
      battle.burnTurns--;
    }

    const totalDamage = damage + burnDmg;

    // Sounds & Floating text
    AudioManager.play('playerHurt');
    showFloatingText('hero-floating-box', `-${totalDamage}`, 'dmg-hero');

    const heroUnit = document.getElementById('hero-unit');
    if (heroUnit) {
      heroUnit.classList.add('shake');
      setTimeout(() => heroUnit.classList.remove('shake'), 300);
    }

    // Apply HP loss (persistent!)
    state.currentHp = Math.max(0, state.currentHp - totalDamage);
    showToast(feedbackMsg);

    if (state.currentHp <= 0) {
      if (battle.mode === 'tower') {
        handleTowerDropFloor();
      } else {
        setTimeout(() => onCombatDefeat(), 500);
      }
    } else {
      if (battle.mode === 'tower') {
        state.towerPoints = Math.max(0, state.towerPoints - 1);
      }
      setTimeout(() => {
        showCorrectionModal(battle.currentQuestion, feedbackMsg);
      }, 400);
    }
  };

  // Toggle Question Bookmark
  const toggleBookmark = (vocabId, showToastMsg = true) => {
    if (!state.bookmarkedWords) state.bookmarkedWords = [];
    const idx = state.bookmarkedWords.indexOf(vocabId);
    if (idx >= 0) {
      state.bookmarkedWords.splice(idx, 1);
      AudioManager.play('click');
      if (showToastMsg) showToast('已自複習法典中取消收藏');
    } else {
      state.bookmarkedWords.push(vocabId);
      AudioManager.play('coin');
      if (showToastMsg) showToast('已成功銘刻至【黑曜石復習禁書閣】！');
    }
    saveState();

    // If currently on battle screen, update the battle bookmark button live
    const bBtn = document.getElementById('btn-toggle-bookmark');
    if (bBtn) {
      const isBookmarked = state.bookmarkedWords.includes(vocabId);
      bBtn.className = `bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`;
      bBtn.innerHTML = `${PixelSprites.icon(isBookmarked ? 'bookmark' : 'star', 14)} <span>${isBookmarked ? '已收藏' : '收藏此題'}</span>`;
    }
  };

  // Medieval Obsidian Truth Revelation / Correction Modal
  const showCorrectionModal = (q, feedbackMsg) => {
    if (!q || !q.vocab) {
      loadNextQuestion();
      return;
    }
    const isBookmarked = (state.bookmarkedWords || []).includes(q.vocab.id);
    const highlightedSentence = q.vocab.sentence.replace('______', `<strong>${q.vocab.sentenceTarget}</strong>`);

    let correctAnswerText = '';
    if (q.type === 1) {
      correctAnswerText = `【${q.correctPos}】 ${q.correctMeaning}`;
    } else if (q.type === 2) {
      correctAnswerText = `【${q.correctAnswer}】 (詞意: ${q.vocab.meaning})`;
    } else if (q.type === 3) {
      correctAnswerText = `【${q.vocab.word}】 (缺漏字母: ${q.neededLetters.join(', ')})`;
    } else if (q.type === 4) {
      correctAnswerText = q.choices[q.correctIndex];
    }

    const modalHtml = `
      <div class="modal-overlay" id="modal-correction-overlay" onclick="event.stopPropagation()">
        <div class="modal-dialog modal-dialog-dark correction-dialog" onclick="event.stopPropagation()">
          <div class="correction-header">
            <div style="filter: drop-shadow(0 2px 4px rgba(255,50,50,0.6));">
              ${PixelSprites.icon('skull', 20)}
            </div>
            <div>
              <div class="correction-title">魔物反擊・古籍真理顯現</div>
              <div style="font-size:11px; color:#ffaaaa;">${feedbackMsg || '作答失誤！古籍顯露了正確答案'}</div>
            </div>
          </div>

          <div class="correction-card">
            <div class="correction-word-row">
              <div style="display:flex; align-items:baseline; gap:6px;">
                <span class="correction-word">${q.vocab.word}</span>
                <span class="correction-pos">${q.vocab.pos}</span>
                <span class="question-category-badge">${q.vocab.categoryLabel || '核心英文'}</span>
              </div>
              <button class="audio-btn" onclick="AudioManager.speak('${q.vocab.word}')" title="播放發音">
                ${PixelSprites.icon('speaker', 14)} <span>聽發音</span>
              </button>
            </div>

            <div class="correction-meaning">${q.vocab.meaning}</div>

            <div class="correction-answer-box">
              <div class="correction-label">📜 正解核心：</div>
              <div class="correction-correct-ans">${correctAnswerText}</div>
            </div>

            <div class="correction-sentence-box">
              <div class="correction-label">📖 語境真理例句：</div>
              <div class="correction-sentence-en">${highlightedSentence}</div>
              <div class="correction-sentence-zh">${q.vocab.sentenceZh}</div>
            </div>

            <div class="correction-bookmark-row">
              <button class="btn-correction-bookmark ${isBookmarked ? 'bookmarked' : ''}" id="btn-correction-bookmark" onclick="App.toggleBookmarkInModal('${q.vocab.id}')">
                ${PixelSprites.icon(isBookmarked ? 'bookmark' : 'star', 16)}
                <span id="correction-bookmark-label">${isBookmarked ? '★ 已珍藏於複習法典' : '⭐ 收藏此題至專屬複習法典'}</span>
              </button>
            </div>
          </div>

          <button class="pixel-btn-action" onclick="App.continueAfterCorrection()">
            ⚔️ 我已領悟，重整旗鼓繼續戰鬥！
          </button>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const toggleBookmarkInModal = (vocabId) => {
    toggleBookmark(vocabId, false);
    const isBookmarked = (state.bookmarkedWords || []).includes(vocabId);
    const btn = document.getElementById('btn-correction-bookmark');
    if (btn) {
      if (isBookmarked) {
        btn.classList.add('bookmarked');
        btn.innerHTML = `${PixelSprites.icon('bookmark', 16)} <span id="correction-bookmark-label">★ 已珍藏於複習法典</span>`;
      } else {
        btn.classList.remove('bookmarked');
        btn.innerHTML = `${PixelSprites.icon('star', 16)} <span id="correction-bookmark-label">⭐ 收藏此題至專屬複習法典</span>`;
      }
    }
  };

  const continueAfterCorrection = () => {
    document.getElementById('modal-root').innerHTML = '';
    loadNextQuestion();
  };

  // Launch Dedicated Review Mode Battle
  const startReviewMode = () => {
    const targetIds = Array.from(new Set([...(state.bookmarkedWords || []), ...(state.mistakeWords || [])]));
    if (targetIds.length === 0) {
      alert('您的【黑曜石復習禁書閣】中目前沒有收藏或待淨化錯題！可以在挑戰中點選「⭐ 收藏此題」或進行作答！');
      return;
    }
    battle = {
      active: true,
      mode: 'review',
      stageId: 99,
      enemyName: '奧術試煉石像鬼 (銘文禁書閣守護像)',
      enemyMaxHp: 220,
      enemyCurrentHp: 220,
      enemyAtk: 12,
      enemyDef: 6,
      timeLimit: 18.0,
      currentTime: 18.0,
      timerId: null,
      currentQuestion: null,
      currentTurn: 1,
      combo: 0,
      correctInSession: 0,
      totalInSession: 0,
      bossTrait: null,
      minionKey: 'gargoyle_warden',
      timeReductionNext: 0,
      burnTurns: 0,
      stoneArmorCooldown: 0
    };
    AudioManager.play('battleStart');
    loadNextQuestion();
  };

  // Tower Drop Floor with Guard Scroll Interception
  const handleTowerDropFloor = () => {
    if ((state.inventory.guard_scroll || 0) > 0) {
      // INTERCEPT WITH SCROLL!
      state.inventory.guard_scroll--;
      const stats = getHeroStats();
      state.currentHp = Math.max(state.currentHp, Math.round(stats.maxHp * 0.6));
      state.towerPoints = 0; // reset to 0 without dropping!
      AudioManager.play('scroll');
      showToast('📜 神聖回血護樓卷生效！免除降層並恢復 60% HP！');
      saveState();
      updateHUD();
      setTimeout(() => loadNextQuestion(), 1200);
    } else {
      // DROP FLOOR!
      AudioManager.play('floorDown');
      state.towerFloor = Math.max(1, state.towerFloor - 1);
      state.towerPoints = 0;

      if (state.currentHp <= 0) {
        state.currentHp = 1; // Preserve 1 HP for persistent starvation
        battle.active = false;
        clearInterval(battle.timerId);
        showDefeatModal(`你在通天塔力竭倒下，退回至 ${state.towerFloor}F！`);
      } else {
        showToast(`掉回下一層！目前退至 ${state.towerFloor}F！`);
        saveState();
        updateHUD();
        setTimeout(() => {
          setupTowerFloorMonster();
          loadNextQuestion();
        }, 1200);
      }
    }
  };

  // Full-screen Floor Up Splash Celebration Overlay
  const showFloorUpCelebration = (newFloor, floorGold) => {
    let altitudeTitle = '踏入夜幕要塞！';
    if (newFloor > 500) altitudeTitle = '登臨星河創世神殿！即將觸及終極神格！';
    else if (newFloor > 250) altitudeTitle = '穿越極光天幕！進入極限冰晶秘境！';
    else if (newFloor > 100) altitudeTitle = '穿過雲層！抵達暮光星穹觀景台！';
    else if (newFloor > 50) altitudeTitle = '突破平流層！蔚藍神殿在眼前展開！';
    else if (newFloor > 20) altitudeTitle = '踏破石階！升上海拔千米晨曦雲海！';

    const overlay = document.createElement('div');
    overlay.className = 'floor-up-splash-overlay';
    overlay.id = 'floor-up-splash';
    overlay.innerHTML = `
      <div class="floor-up-splash-box">
        <div class="splash-badge">FLOOR UP! 晉升新樓層</div>
        <div class="splash-title">${PixelSprites.icon('tower', 24)} 恭喜突破至 ${newFloor}F！</div>
        <div class="splash-desc">${altitudeTitle}</div>
        <div class="splash-sub">💰 獲取晉級突破賞金 +${floorGold} 金幣！守衛實力已同步提升！</div>
      </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 400);
    }, 1300);
  };

  // Tower Floor Advance
  const onTowerFloorAdvance = () => {
    state.towerFloor++;
    state.towerPoints = 0;
    if (state.towerFloor > state.towerRecordFloor) {
      state.towerRecordFloor = state.towerFloor;
    }

    AudioManager.play('floorUp');

    // Calculate Floor Gold Reward
    const stats = getHeroStats();
    let floorGold = Math.round((15 + state.towerFloor * 0.4) * (stats.goldMultiplier || 1.0));

    if (state.towerFloor % 10 === 0) {
      floorGold *= 3; // 3x Boss floor reward!
      showToast(`🎉 突破 ${state.towerFloor}F 守門大魔王！狂領 ${floorGold} 金幣！`);
      unlockBestiaryEntry('boss', ((state.towerFloor / 10 - 1) % 15) + 1, battle.bossVariant);
    } else {
      showToast(`升上 ${state.towerFloor}F！獲得 ${floorGold} 金幣！`);
    }

    state.gold += floorGold;
    saveState();
    updateHUD();

    // Trigger visual floor-up splash celebration!
    showFloorUpCelebration(state.towerFloor, floorGold);

    setupTowerFloorMonster();
    setTimeout(() => loadNextQuestion(), 1600);
  };

  // Dungeon Victory
  const onDungeonVictory = () => {
    battle.active = false;
    clearInterval(battle.timerId);
    AudioManager.play('victory');

    if (battle.mode === 'review') {
      state.gold += 35;
      saveState();
      updateHUD();
      alert('🎉 銘文淨化試煉大捷！\n\n您已成功通過黑曜石禁書閣複習試煉，詞彙印記已深化，並自公會領取 +35 金幣獎勵！');
      renderCodexView('bookmarks');
      return;
    }

    const boss = GAME_CONFIG.DUNGEON_BOSSES.find(b => b.id === battle.stageId);
    const stats = getHeroStats();
    let rewardGold = Math.round(boss.goldReward * (stats.goldMultiplier || 1.0));

    let firstClearNotice = '';
    if (!state.dungeonFirstCleared.includes(boss.id)) {
      state.dungeonFirstCleared.push(boss.id);
      rewardGold += boss.firstClearBonus;
      firstClearNotice = `首通大紅包 +${boss.firstClearBonus} G！`;
    }

    // Unlock next stage
    if (state.dungeonProgress <= boss.id && boss.id < 15) {
      state.dungeonProgress = boss.id + 1;
    }

    state.gold += rewardGold;
    unlockBestiaryEntry('boss', boss.id, 'normal');
    saveState();
    updateHUD();

    showVictoryModal(`擊敗 ${boss.name}！獲得 ${rewardGold} 金幣！${firstClearNotice}`);
  };

  // Combat Defeat
  const onCombatDefeat = () => {
    battle.active = false;
    clearInterval(battle.timerId);
    AudioManager.play('defeat');

    // Consolation coins for practice
    const consolationGold = battle.correctInSession * 3;
    state.gold += consolationGold;
    state.currentHp = 1; // 1 HP alive

    saveState();
    updateHUD();

    showDefeatModal(`挑戰失敗！戰鬥中答對 ${battle.correctInSession} 題，獲得勤學津貼 ${consolationGold} 金幣！`);
  };

  // Bestiary unlock helper
  const unlockBestiaryEntry = (type, id, variant) => {
    const key = `${type}_${id}_${variant}`;
    if (!state.bestiaryUnlocked.includes(key)) {
      state.bestiaryUnlocked.push(key);
      state.gold += 20; // Bestiary discovery bonus
      saveState();
    }
  };

  const retreatBattle = () => {
    clearInterval(battle.timerId);
    battle.active = false;
    AudioManager.play('click');
    if (battle.mode === 'dojo') {
      showToast(`道場修煉告一段落！本次答對 ${battle.correctInSession} 題，累計獲得 ${battle.correctInSession * 2} 金幣！`);
    }
    renderLobbyView();
  };

  const useQuickPotion = () => {
    if ((state.inventory.potion || 0) <= 0) return;
    state.inventory.potion--;
    const stats = getHeroStats();
    const healAmt = Math.round(stats.maxHp * 0.45);
    state.currentHp = Math.min(stats.maxHp, state.currentHp + healAmt);
    AudioManager.play('eat');
    showFloatingText('hero-floating-box', `+${healAmt}`, 'dmg-heal');
    saveState();
    updateHUD();
    renderBattleView();
  };

  const showFloatingText = (containerId, text, className) => {
    const box = document.getElementById(containerId);
    if (!box) return;
    const el = document.createElement('div');
    el.className = `floating-dmg ${className}`;
    el.textContent = text;
    box.appendChild(el);
    setTimeout(() => el.remove(), 800);
  };

  // ==========================================
  // VIEW: Shop & Dwarf Tavern
  // ==========================================
  const renderShopView = (defaultTab = 'food') => {
    const html = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="hud-btn" onclick="App.renderLobby()">&lt; 返回營地</button>
        <div style="font-weight:bold; color:var(--gold);">🍖 矮人食堂與公會商城</div>
      </div>

      <div class="tabs-header">
        <button class="tab-btn ${defaultTab === 'food' ? 'active' : ''}" onclick="App.renderShopView('food')">回血食物</button>
        <button class="tab-btn ${defaultTab === 'buff' ? 'active' : ''}" onclick="App.renderShopView('buff')">時效料理</button>
        <button class="tab-btn ${defaultTab === 'leave' ? 'active' : ''}" onclick="App.renderShopView('leave')">公會請假卷</button>
        <button class="tab-btn ${defaultTab === 'equip' ? 'active' : ''}" onclick="App.renderShopView('equip')">紙娃娃裝備</button>
        <button class="tab-btn ${defaultTab === 'scroll' ? 'active' : ''}" onclick="App.renderShopView('scroll')">保命道具</button>
      </div>

      <div class="items-list-container" id="shop-items-container">
        <!-- Injected below -->
      </div>
    `;

    setMainView(html);
    populateShopTab(defaultTab);
  };

  const populateShopTab = (tab) => {
    const container = document.getElementById('shop-items-container');
    if (!container) return;

    let itemsHtml = '';

    if (tab === 'food') {
      const foods = GAME_CONFIG.FOODS.filter(f => !f.buff);
      foods.forEach(f => {
        itemsHtml += `
          <div class="shop-item-card">
            <div class="shop-item-left">
              ${PixelSprites.renderFood(f.id)}
              <div class="shop-item-info">
                <div class="shop-item-title">${f.name}</div>
                <div class="shop-item-desc">${f.desc}</div>
              </div>
            </div>
            <div class="shop-item-action">
              <button class="buy-btn" onclick="App.buyFood('${f.id}')" ${state.gold >= f.price ? '' : 'disabled'}>
                購買品嚐
              </button>
              <span style="font-size:11px; color:var(--gold);">${PixelSprites.icon('coin', 12)} ${f.price} G</span>
            </div>
          </div>
        `;
      });
    } else if (tab === 'buff') {
      const buffFoods = GAME_CONFIG.FOODS.filter(f => f.buff);
      buffFoods.forEach(f => {
        itemsHtml += `
          <div class="shop-item-card">
            <div class="shop-item-left">
              ${PixelSprites.renderFood(f.id)}
              <div class="shop-item-info">
                <div class="shop-item-title" style="color:#ee99ff;">${f.name}</div>
                <div class="shop-item-desc">${f.desc}</div>
              </div>
            </div>
            <div class="shop-item-action">
              <button class="buy-btn" onclick="App.buyFood('${f.id}')" ${state.gold >= f.price ? '' : 'disabled'}>
                購買進食
              </button>
              <span style="font-size:11px; color:var(--gold);">${PixelSprites.icon('coin', 12)} ${f.price} G</span>
            </div>
          </div>
        `;
      });
    } else if (tab === 'leave') {
      GAME_CONFIG.LEAVE_PASSES.forEach(p => {
        itemsHtml += `
          <div class="shop-item-card">
            <div class="shop-item-left">
              ${PixelSprites.renderScroll(p.id)}
              <div class="shop-item-info">
                <div class="shop-item-title" style="color:#88ffaa;">${p.name}</div>
                <div class="shop-item-desc">${p.desc}</div>
              </div>
            </div>
            <div class="shop-item-action">
              <button class="buy-btn" onclick="App.buyLeavePass('${p.id}')" ${state.gold >= p.price ? '' : 'disabled'}>
                購買啟用
              </button>
              <span style="font-size:11px; color:var(--gold);">${PixelSprites.icon('coin', 12)} ${p.price} G</span>
            </div>
          </div>
        `;
      });
    } else if (tab === 'equip') {
      const heroWeapon = GAME_CONFIG.EQUIPMENT.weapons.find(w => w.id === state.equippedWeapon);
      const heroArmor = GAME_CONFIG.EQUIPMENT.armors.find(a => a.id === state.equippedArmor);
      const heroRelic = GAME_CONFIG.EQUIPMENT.relics.find(r => r.id === state.equippedRelic);
      const wTier = heroWeapon ? heroWeapon.tier : 1;
      const aTier = heroArmor ? heroArmor.tier : 1;
      const rTier = heroRelic ? heroRelic.tier : 0;
      const curClassObj = state.heroClass === 'novice' ? GAME_CONFIG.NOVICE_CLASS : ((GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === state.heroClass) || GAME_CONFIG.NOVICE_CLASS);
      const curAwakeningRank = (state.classAwakening && state.classAwakening[state.heroClass]) || 0;

      itemsHtml += `
        <div class="pixel-box shop-fitting-preview">
          <div class="fitting-sprite-box">
            ${PixelSprites.renderHero('happy', wTier, aTier, rTier, state.heroClass || 'novice', curAwakeningRank)}
          </div>
          <div class="fitting-info-col">
            <div class="fitting-title-row">
              <span class="fitting-hero-title">${state.heroName}・【${curClassObj?.name || '見習村民'}】${curAwakeningRank > 0 ? ` ★x${curAwakeningRank}` : ''}</span>
              <button class="fitting-switch-class-btn" onclick="App.showClassSelectModal()">更換姿態</button>
            </div>
            <div class="fitting-gear-row">
              <span class="fitting-tag">${PixelSprites.icon('sword', 10)} 武器: ${heroWeapon ? heroWeapon.name : '赤手空拳'} (T${wTier})</span>
              <span class="fitting-tag">${PixelSprites.icon('shield', 10)} 防具: ${heroArmor ? heroArmor.name : '粗布衣'} (T${aTier})</span>
              ${heroRelic ? `<span class="fitting-tag">${PixelSprites.icon('star', 10)} 聖物: ${heroRelic.name} (T${rTier})</span>` : ''}
            </div>
            <div style="font-size:10px; color:#a090b8; margin-top:3px;">
              💡 穿戴不同武器與防具時，英雄像素身形、武器光芒與裝甲色彩將即時動態進化！
            </div>
          </div>
        </div>
      `;

      // All weapons, armors, relics
      const allEquips = [
        ...GAME_CONFIG.EQUIPMENT.weapons.map(w => ({ ...w, type: 'weapon' })),
        ...GAME_CONFIG.EQUIPMENT.armors.map(a => ({ ...a, type: 'armor' })),
        ...GAME_CONFIG.EQUIPMENT.relics.map(r => ({ ...r, type: 'relic' }))
      ];

      allEquips.forEach(eq => {
        const isOwned = (eq.type === 'weapon' && state.ownedWeapons.includes(eq.id)) ||
                        (eq.type === 'armor' && state.ownedArmors.includes(eq.id)) ||
                        (eq.type === 'relic' && state.ownedRelics.includes(eq.id));

        const isEquipped = (eq.type === 'weapon' && state.equippedWeapon === eq.id) ||
                           (eq.type === 'armor' && state.equippedArmor === eq.id) ||
                           (eq.type === 'relic' && state.equippedRelic === eq.id);

        let statStr = '';
        if (eq.atk) statStr += `ATK +${eq.atk} `;
        if (eq.def) statStr += `DEF +${eq.def} `;
        if (eq.hp) statStr += `HP +${eq.hp} `;
        if (eq.timeBonus) statStr += `時限 +${eq.timeBonus}s `;

        itemsHtml += `
          <div class="shop-item-card">
            <div class="shop-item-left">
              <div style="font-size:12px; font-weight:bold; color:var(--gold);">[${eq.type === 'weapon' ? '武器' : eq.type === 'armor' ? '防具' : '聖物'}]</div>
              <div class="shop-item-info">
                <div class="shop-item-title">${eq.name}</div>
                <div class="shop-item-desc">${statStr} | ${eq.desc}</div>
              </div>
            </div>
            <div class="shop-item-action">
              ${isEquipped ? `
                <button class="buy-btn" style="background:#555;" disabled>已穿戴</button>
              ` : isOwned ? `
                <button class="buy-btn" onclick="App.equipItem('${eq.type}', '${eq.id}')">穿戴</button>
              ` : `
                <button class="buy-btn" onclick="App.buyItem('${eq.type}', '${eq.id}')" ${state.gold >= eq.price ? '' : 'disabled'}>
                  購買
                </button>
                <span style="font-size:11px; color:var(--gold);">${PixelSprites.icon('coin', 12)} ${eq.price} G</span>
              `}
            </div>
          </div>
        `;
      });
    } else if (tab === 'scroll') {
      const scroll = GAME_CONFIG.CONSUMABLES.guard_scroll;
      const potion = GAME_CONFIG.CONSUMABLES.potion;

      itemsHtml += `
        <div class="shop-item-card">
          <div class="shop-item-left">
            ${PixelSprites.renderScroll('guard_scroll')}
            <div class="shop-item-info">
              <div class="shop-item-title" style="color:#00e5ff;">${scroll.name} (持有: ${state.inventory.guard_scroll || 0})</div>
              <div class="shop-item-desc">${scroll.desc}</div>
            </div>
          </div>
          <div class="shop-item-action">
            <button class="buy-btn" onclick="App.buyConsumable('guard_scroll')" ${state.gold >= scroll.price ? '' : 'disabled'}>
              購買卷軸
            </button>
            <span style="font-size:11px; color:var(--gold);">${PixelSprites.icon('coin', 12)} ${scroll.price} G</span>
          </div>
        </div>

        <div class="shop-item-card">
          <div class="shop-item-left">
            <div style="width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
              ${PixelSprites.icon('potion', 20)}
            </div>
            <div class="shop-item-info">
              <div class="shop-item-title" style="color:#ff6666;">${potion.name} (持有: ${state.inventory.potion || 0})</div>
              <div class="shop-item-desc">${potion.desc}</div>
            </div>
          </div>
          <div class="shop-item-action">
            <button class="buy-btn" onclick="App.buyConsumable('potion')" ${state.gold >= potion.price ? '' : 'disabled'}>
              購買聖水
            </button>
            <span style="font-size:11px; color:var(--gold);">${PixelSprites.icon('coin', 12)} ${potion.price} G</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = itemsHtml;
  };

  const buyFood = (foodId) => {
    const food = GAME_CONFIG.FOODS.find(f => f.id === foodId);
    if (!food || state.gold < food.price) return;

    state.gold -= food.price;
    const stats = getHeroStats();

    if (food.isFull) {
      state.currentHp = stats.maxHp;
    } else {
      state.currentHp = Math.min(stats.maxHp, state.currentHp + food.healHp);
    }

    if (food.buff) {
      state.activeBuff = {
        type: food.buff.type,
        val: food.buff.val,
        timeVal: food.buff.timeVal || 0,
        expiresAt: Date.now() + (food.buff.duration * 1000),
        label: food.buff.label
      };
    }

    AudioManager.play('eat');
    showToast(`品嚐了 ${food.name}！生命值回復！`);
    saveState();
    updateHUD();
    renderShopView(food.buff ? 'buff' : 'food');
  };

  const buyLeavePass = (passId) => {
    const pass = GAME_CONFIG.LEAVE_PASSES.find(p => p.id === passId);
    if (!pass || state.gold < pass.price) return;

    state.gold -= pass.price;
    const currentExpiry = Math.max(Date.now(), state.leavePassExpires || 0);
    state.leavePassExpires = currentExpiry + (pass.durationSec * 1000);

    AudioManager.play('scroll');
    showToast(`成功啟用 ${pass.name}！安心休假不扣血！`);
    saveState();
    updateHUD();
    renderShopView('leave');
  };

  const buyItem = (type, itemId) => {
    let item = null;
    if (type === 'weapon') item = GAME_CONFIG.EQUIPMENT.weapons.find(w => w.id === itemId);
    if (type === 'armor') item = GAME_CONFIG.EQUIPMENT.armors.find(a => a.id === itemId);
    if (type === 'relic') item = GAME_CONFIG.EQUIPMENT.relics.find(r => r.id === itemId);

    if (!item || state.gold < item.price) return;

    state.gold -= item.price;
    if (type === 'weapon') { state.ownedWeapons.push(itemId); state.equippedWeapon = itemId; }
    if (type === 'armor') { state.ownedArmors.push(itemId); state.equippedArmor = itemId; }
    if (type === 'relic') { state.ownedRelics.push(itemId); state.equippedRelic = itemId; }

    AudioManager.play('coin');
    showToast(`購買並穿戴了 ${item.name}！紙娃娃外觀已更新！`);
    saveState();
    updateHUD();
    renderShopView('equip');
  };

  const equipItem = (type, itemId) => {
    if (type === 'weapon') state.equippedWeapon = itemId;
    if (type === 'armor') state.equippedArmor = itemId;
    if (type === 'relic') state.equippedRelic = itemId;

    AudioManager.play('click');
    showToast('裝備已穿戴！');
    saveState();
    updateHUD();
    renderShopView('equip');
  };

  const buyConsumable = (key) => {
    const item = GAME_CONFIG.CONSUMABLES[key];
    if (!item || state.gold < item.price) return;

    state.gold -= item.price;
    state.inventory[key] = (state.inventory[key] || 0) + 1;

    AudioManager.play('coin');
    showToast(`購買了 ${item.name}！`);
    saveState();
    updateHUD();
    renderShopView('scroll');
  };

  // ==========================================
  // VIEW: Codex & Mistake Notebook
  // ==========================================
  // ==========================================
  // VIEW: Obsidian Review Grimoire (黑曜石復習秘殿・銘刻禁書閣)
  // ==========================================
  let grimoireActiveCategory = 'all';

  const renderCodexView = (activeTab = 'bookmarks', categoryFilter = 'all') => {
    grimoireActiveCategory = categoryFilter || grimoireActiveCategory;
    if (!Array.isArray(state.bookmarkedWords)) state.bookmarkedWords = [];
    if (!Array.isArray(state.mistakeWords)) state.mistakeWords = [];

    const categories = [
      { id: 'all', label: '全部領域' },
      { id: 'business', label: '商務職場' },
      { id: 'finance', label: '財金經濟' },
      { id: 'sports', label: '運動競技' },
      { id: 'news', label: '時事新聞' },
      { id: 'travel', label: '旅遊差旅' },
      { id: 'country', label: '國家外交' },
      { id: 'daily', label: '日常生活' }
    ];

    let contentHtml = '';

    if (activeTab === 'bookmarks') {
      let filtered = getAllTrackedVocabList(state.bookmarkedWords);
      if (grimoireActiveCategory !== 'all') {
        filtered = filtered.filter(v => v.category === grimoireActiveCategory);
      }

      if (filtered.length === 0) {
        contentHtml = `
          <div style="text-align:center; padding:35px 20px; color:var(--text-muted); background:#161224; border:2px dashed #3a2e50;">
            <div style="margin-bottom:8px;">${PixelSprites.icon('bookmark', 28)}</div>
            <div style="font-weight:bold; color:#ffdd88; margin-bottom:4px;">目前尚無珍藏法印</div>
            <div style="font-size:12px; line-height:1.5;">
              在地下城討伐或登塔挑戰時，點選題目右上方的【收藏】<br>
              即可將您不太熟、或是四選一矇到的實用題目收錄於此！
            </div>
          </div>
        `;
      } else {
        const cards = filtered.map(vocab => {
          const s = state.vocabStats[vocab.id] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
          let badgeHtml = '';
          if (s.streak >= 3) {
            badgeHtml = `<span class="grimoire-badge-mastered">已完全掌握</span>`;
          } else if (s.wrong > s.correct) {
            badgeHtml = `<span class="grimoire-badge-unmastered">待學會</span>`;
          } else {
            badgeHtml = `<span class="grimoire-badge-learning">修煉試煉中</span>`;
          }

          const displaySentence = (vocab.sentence || 'The adventurer studied the importance of ______.')
            .replace('______', `<strong style="color:#ffd700;">${vocab.sentenceTarget || vocab.word}</strong>`);
          const displaySentenceZh = vocab.sentenceZh || `提示：【${vocab.meaning}】`;

          return `
            <div class="grimoire-card">
              <div class="grimoire-card-top">
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <span class="grimoire-card-word">${vocab.word}</span>
                  <span style="font-size:12px; color:#ffdd88;">(${vocab.pos})</span>
                  <span class="question-category-badge">${vocab.categoryLabel || `Tier ${vocab.tier || 1}`}</span>
                  ${badgeHtml}
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <button class="audio-btn" onclick="AudioManager.speak('${vocab.word}')" title="播放發音">
                    ${PixelSprites.icon('speaker', 14)}
                  </button>
                  <button class="bookmark-btn bookmarked" onclick="App.toggleBookmark('${vocab.id}'); App.renderCodexView('bookmarks');" title="取消收藏">
                    ${PixelSprites.icon('bookmark', 14)} <span>已珍藏</span>
                  </button>
                </div>
              </div>

              <div style="font-size:14px; font-weight:bold; color:#ffffff;">${vocab.meaning}</div>

              <div style="background:#130e1e; border:1px solid #33264a; padding:6px 8px; font-size:12px; line-height:1.4;">
                <div style="color:#eeddcc;">${displaySentence}</div>
                <div style="color:#a095b5; margin-top:2px;">${displaySentenceZh}</div>
              </div>

              <div style="font-size:10px; color:#a090b8; display:flex; justify-content:space-between;">
                <span>累計遇見: ${s.seen} 次 | 連對推進: ${s.streak} 次</span>
                <span>答錯: ${s.wrong} 次 / 答對: ${s.correct} 次</span>
              </div>
            </div>
          `;
        }).join('');
        contentHtml = `<div style="display:flex; flex-direction:column; gap:10px;">${cards}</div>`;
      }
    } else if (activeTab === 'mistakes') {
      const mistakeIds = Array.from(new Set([
        ...(state.mistakeWords || []),
        ...Object.keys(state.vocabStats).filter(id => state.vocabStats[id]?.wrong > 0)
      ]));
      let filtered = getAllTrackedVocabList(mistakeIds);
      if (grimoireActiveCategory !== 'all') {
        filtered = filtered.filter(v => v.category === grimoireActiveCategory);
      }

      if (filtered.length === 0) {
        contentHtml = `
          <div style="text-align:center; padding:35px 20px; color:var(--text-muted); background:#161224; border:2px dashed #3a2e50;">
            <div style="margin-bottom:8px;">${PixelSprites.icon('check', 28)}</div>
            <div style="font-weight:bold; color:#44dd66; margin-bottom:4px;">目前沒有任何待淨化錯題！太出色了！</div>
            <div style="font-size:12px;">所有遭遇過的詞彙均已被勇者完全征服！</div>
          </div>
        `;
      } else {
        const cards = filtered.map(vocab => {
          const s = state.vocabStats[vocab.id] || { seen: 0, correct: 0, wrong: 0, streak: 0 };
          const isBookmarked = state.bookmarkedWords.includes(vocab.id);
          let badgeHtml = '';
          if (s.streak >= 3) {
            badgeHtml = `<span class="grimoire-badge-mastered">已完全掌握</span>`;
          } else if (s.wrong > s.correct) {
            badgeHtml = `<span class="grimoire-badge-unmastered">待學會</span>`;
          } else {
            badgeHtml = `<span class="grimoire-badge-learning">修煉試煉中</span>`;
          }

          const displaySentence = (vocab.sentence || 'The adventurer studied the importance of ______.')
            .replace('______', `<strong style="color:#ffd700;">${vocab.sentenceTarget || vocab.word}</strong>`);
          const displaySentenceZh = vocab.sentenceZh || `提示：【${vocab.meaning}】`;

          return `
            <div class="grimoire-card" style="border-left: 4px solid #ff4444;">
              <div class="grimoire-card-top">
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <span class="grimoire-card-word">${vocab.word}</span>
                  <span style="font-size:12px; color:#ffdd88;">(${vocab.pos})</span>
                  <span class="question-category-badge">${vocab.categoryLabel || `Tier ${vocab.tier || 1}`}</span>
                  ${badgeHtml}
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <button class="audio-btn" onclick="AudioManager.speak('${vocab.word}')" title="播放發音">
                    ${PixelSprites.icon('speaker', 14)}
                  </button>
                  <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="App.toggleBookmark('${vocab.id}'); App.renderCodexView('mistakes');" title="${isBookmarked ? '取消收藏' : '收藏'}">
                    ${PixelSprites.icon(isBookmarked ? 'bookmark' : 'star', 14)} <span>${isBookmarked ? '已珍藏' : '收藏'}</span>
                  </button>
                </div>
              </div>

              <div style="font-size:14px; font-weight:bold; color:#ffffff;">${vocab.meaning}</div>

              <div style="background:#130e1e; border:1px solid #33264a; padding:6px 8px; font-size:12px; line-height:1.4;">
                <div style="color:#eeddcc;">${displaySentence}</div>
                <div style="color:#a095b5; margin-top:2px;">${displaySentenceZh}</div>
              </div>

              <div style="font-size:10px; color:#ff8888; display:flex; justify-content:space-between;">
                <span>累計答錯: ${s.wrong} 次 | 連對進度: ${s.streak}/3 次</span>
                <span style="color:#ffdd88;">正解: ${vocab.sentenceTarget || vocab.word}</span>
              </div>
            </div>
          `;
        }).join('');
        contentHtml = `<div style="display:flex; flex-direction:column; gap:10px;">${cards}</div>`;
      }
    } else {
      // Bestiary: 15 Bosses + 12 Minions
      let bossCards = GAME_CONFIG.DUNGEON_BOSSES.map(b => {
        const isDiscovered = state.bestiaryUnlocked.some(key => key.includes(`boss_${b.id}`));
        return `
          <div class="shop-item-card" style="opacity: ${isDiscovered ? '1' : '0.4'};">
            <div class="shop-item-left">
              <div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                ${PixelSprites.renderBoss(b.id, 'normal')}
              </div>
              <div class="shop-item-info">
                <div class="shop-item-title">${isDiscovered ? b.name : '??? 尚未遭遇'}</div>
                <div class="shop-item-desc">${isDiscovered ? b.vocabScope : '探索地下城解鎖'}</div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      let minionCards = GAME_CONFIG.TOWER_MINIONS.map(m => `
        <div class="shop-item-card">
          <div class="shop-item-left">
            <div style="width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
              ${PixelSprites.renderMinion(m.key)}
            </div>
            <div class="shop-item-info">
              <div class="shop-item-title">${m.name}</div>
              <div class="shop-item-desc">通天塔常駐守衛魔物</div>
            </div>
          </div>
        </div>
      `).join('');

      contentHtml = `<div class="items-list-container">${bossCards}${minionCards}</div>`;
    }

    const reviewTotalCount = Array.from(new Set([...(state.bookmarkedWords || []), ...(state.mistakeWords || [])])).length;

    const html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <button class="hud-btn" onclick="App.renderLobby()">&lt; 返回營地</button>
        <div style="font-weight:bold; color:var(--gold); display:flex; align-items:center; gap:6px;">
          ${PixelSprites.icon('book', 18)} <span>黑曜石復習秘殿・銘刻禁書閣</span>
        </div>
      </div>

      <!-- Review Trial Launch Banner -->
      <div class="grimoire-trial-banner" style="margin-bottom:10px;">
        <div>
          <div style="font-size:12px; font-weight:bold; color:#ffd700;">⚔️ 銘文淨化試煉・專屬複習模式</div>
          <div style="font-size:10px; color:#d2cbe0;">針對您的收藏庫與錯題集進行沉浸戰鬥，直到完全掌握！(待修煉: ${reviewTotalCount} 詞)</div>
        </div>
        <button class="btn-start-review-trial" onclick="App.startReviewMode()">
          啟動試煉
        </button>
      </div>

      <div class="grimoire-tabs">
        <button class="tab-btn ${activeTab === 'bookmarks' ? 'active' : ''}" onclick="App.renderCodexView('bookmarks')">
          ${PixelSprites.icon('bookmark', 14)} 珍藏法印 (${state.bookmarkedWords.length})
        </button>
        <button class="tab-btn ${activeTab === 'mistakes' ? 'active' : ''}" onclick="App.renderCodexView('mistakes')">
          ${PixelSprites.icon('skull', 14)} 待淨化錯題 (${state.mistakeWords.length})
        </button>
        <button class="tab-btn ${activeTab === 'bestiary' ? 'active' : ''}" onclick="App.renderCodexView('bestiary')">
          ${PixelSprites.icon('crown', 14)} 魔物聖典
        </button>
      </div>

      ${activeTab !== 'bestiary' ? `
        <div class="grimoire-filter-bar">
          ${categories.map(cat => `
            <button class="grimoire-filter-pill ${grimoireActiveCategory === cat.id ? 'active' : ''}" onclick="App.renderCodexView('${activeTab}', '${cat.id}')">
              ${cat.label}
            </button>
          `).join('')}
        </div>
      ` : ''}

      <div style="margin-top:8px;">
        ${contentHtml}
      </div>
    `;

    setMainView(html);
  };

  // ==========================================
  // VIEW: Leaderboard & Account
  // ==========================================
  // ==========================================
  // VIEW: Leaderboard & Supabase Cloud Account
  // ==========================================
  const renderLeaderboardModal = async () => {
    let rivals = [];
    let isFromSupabase = false;

    // Fetch from Supabase if configured
    if (window.SupabaseClient && SupabaseClient.isConfigured()) {
      const cloudData = await SupabaseClient.fetchLeaderboard(50);
      if (cloudData && cloudData.length > 0) {
        rivals = cloudData.map(c => {
          const userObj = SupabaseClient.getUser();
          const isMe = userObj && (userObj.id === c.id || (userObj.user_metadata?.username && userObj.user_metadata.username === c.username));
          return {
            name: `${c.hero_name || '單字勇者'}${isMe ? ' (你)' : ''}`,
            floor: c.tower_record_floor || 1,
            streak: c.streak || 1,
            isSelf: isMe,
            quote: `@${c.username || 'adventurer'}`
          };
        });
        isFromSupabase = true;
      }
    }

    const isLoggedIn = window.SupabaseClient && SupabaseClient.isLoggedIn();
    const currentUser = isLoggedIn ? SupabaseClient.getUser() : null;

    // Ensure current player is always represented in the leaderboard
    const hasSelf = rivals.some(r => r.isSelf);
    if (!hasSelf) {
      rivals.push({
        name: `${state.heroName} (你)`,
        floor: state.towerRecordFloor,
        streak: state.streak,
        isSelf: true,
        quote: (currentUser && (currentUser.user_metadata?.username || currentUser.username)) 
          ? `@${currentUser.user_metadata?.username || currentUser.username}` 
          : '一步一步登上 1000 樓！'
      });
    }

    rivals.sort((a, b) => b.floor - a.floor);

    const rowsHtml = rivals.map((r, idx) => `
      <div class="goal-item" style="${r.isSelf ? 'border-color:var(--gold); background:#27203b;' : ''}">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-weight:bold; color:${idx === 0 ? 'var(--gold)' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#ffffff'};">#${idx + 1}</span>
          <div>
            <div style="font-weight:bold; color:${r.isSelf ? 'var(--gold-light)' : '#ffffff'};">${r.name}</div>
            <div style="font-size:10px; color:var(--text-muted);">${r.quote}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:bold; color:#4fe3ff;">${r.floor}F</div>
          <div style="font-size:10px; color:#ffaa44;">連續 ${r.streak} 天</div>
        </div>
      </div>
    `).join('');

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('trophy', 16)} 通天塔勇者全球排行榜</div>

          <!-- Supabase Unified Auth Status Banner -->
          <div style="background:#191428; border:1px solid #4a386c; padding:8px 10px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; color:#77ffaa; font-weight:bold;">
                👑 冒險者公會通行：${currentUser ? (currentUser.user_metadata?.username || currentUser.username || currentUser.email) : state.heroName}
              </div>
              <div style="font-size:10px; color:#a090b8;">
                ${isFromSupabase ? '🟢 即時連線至 Supabase 全球天梯' : '🟡 雲端連線中・進度即時自動同步'}
              </div>
            </div>
            <div>
              <button class="hud-btn" style="padding:4px 8px; font-size:10px; color:#ff9999;" onclick="App.handleLogout()">登出 / 切換帳號</button>
            </div>
          </div>

          <!-- Edit Hero Name (Local/Cloud) -->
          <div style="display:flex; gap:6px;">
            <input type="text" id="input-hero-name" value="${state.heroName}" maxlength="8" placeholder="輸入勇者暱稱" style="background:#141020; border:1px solid #48396e; color:#fff; padding:6px; flex:1;">
            <button class="claim-btn" onclick="App.changeHeroName()">修改暱稱</button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted);">
            <span>${isFromSupabase ? '🟢 即時連線：Supabase 全球天梯' : '🟡 本地離線天梯'}</span>
            <button class="hud-btn" style="padding:2px 6px;" onclick="App.showAuthModal('config')">⚙️ Supabase 設定</button>
          </div>

          <div class="items-list-container" style="max-height:230px;">
            ${rowsHtml}
          </div>

          <div style="display:flex; gap:6px; margin-top:4px;">
            <button class="hud-btn" style="flex:1;" onclick="App.exportSyncCode()">匯出戰績碼</button>
            <button class="hud-btn" style="flex:1;" onclick="App.importSyncCode()">匯入好友碼</button>
          </div>

          <button class="modal-close-btn" onclick="App.closeModal()">關閉</button>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  // Enforced Auth Gate View (Main screen when unauthenticated)
  const renderAuthGateView = (tab = 'login') => {
    setHUDVisible(false);
    const main = document.getElementById('main-content');
    if (!main) return;

    const savedCreds = window.SupabaseClient ? SupabaseClient.getSavedCredentials() : null;
    const defaultAccount = (savedCreds && savedCreds.account) ? savedCreds.account : '';
    const defaultPassword = (savedCreds && savedCreds.password) ? savedCreds.password : '';

    main.innerHTML = `
      <div class="auth-gate-wrapper">
        <div class="auth-gate-banner">
          <div style="margin-bottom:6px; display:inline-block; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.8));">
            ${PixelSprites.icon('castle', 48)}
          </div>
          <div class="auth-gate-title">單字地下城與通天塔</div>
          <div class="auth-gate-subtitle">公會通行驗證處・每位冒險者皆擁有獨立雲端進度庫</div>
        </div>

        <div class="auth-gate-card">
          <div class="auth-gate-tabs">
            <button class="auth-tab-btn ${tab === 'login' ? 'active' : ''}" onclick="App.renderAuthGateView('login')">
              ${PixelSprites.icon('key', 14)} 冒險者登入
            </button>
            <button class="auth-tab-btn ${tab === 'signup' ? 'active' : ''}" onclick="App.renderAuthGateView('signup')">
              ${PixelSprites.icon('scroll', 14)} 註冊新勇者
            </button>
          </div>

          <div id="auth-gate-body" style="display:flex; flex-direction:column; gap:10px; margin-top:6px;">
            ${tab === 'login' ? `
              <form id="gate-login-form" onsubmit="event.preventDefault(); App.handleGateLogin();" style="display:flex; flex-direction:column; gap:10px;">
                <div class="auth-form-group">
                  <label class="auth-label">冒險者公會帳號或 Email</label>
                  <input type="text" id="gate-account" class="auth-input" placeholder="冒險者帳號 (例如: tangghgh) 或 Email" value="${defaultAccount}" required autocomplete="username">
                </div>

                <div class="auth-form-group">
                  <label class="auth-label">通行密碼 (Password)</label>
                  <input type="password" id="gate-password" class="auth-input" placeholder="請輸入通行密碼" value="${defaultPassword}" required autocomplete="current-password">
                </div>

                <div class="auth-remember-row">
                  <input type="checkbox" id="gate-remember" checked>
                  <label for="gate-remember">記住我的登入資訊 (下次開啟 PWA 自動登入)</label>
                </div>

                <button type="submit" id="btn-gate-submit" class="auth-submit-btn">
                  進入地下城世界
                </button>
              </form>
            ` : `
              <form id="gate-signup-form" onsubmit="event.preventDefault(); App.handleGateSignup();" style="display:flex; flex-direction:column; gap:10px;">
                <div class="auth-form-group">
                  <label class="auth-label">冒險者電子信箱 (Email)</label>
                  <input type="email" id="gate-email" class="auth-input" placeholder="hero@dungeon.com" required autocomplete="email">
                </div>

                <div class="auth-form-group">
                  <label class="auth-label">通行密碼 (至少 6 位數)</label>
                  <input type="password" id="gate-password" class="auth-input" placeholder="設定密碼 (至少 6 位數)" minlength="6" required autocomplete="new-password">
                </div>

                <div class="auth-form-group">
                  <label class="auth-label">公會唯一帳號 (Username)</label>
                  <input type="text" id="gate-username" class="auth-input" placeholder="例如: brave_sam99" required autocomplete="username">
                </div>

                <div class="auth-form-group">
                  <label class="auth-label">勇者稱號 (顯示於排行榜與對話)</label>
                  <input type="text" id="gate-heroname" class="auth-input" placeholder="例如: 破曉守護者" value="單字勇者">
                </div>

                <div class="auth-form-group">
                  <label class="auth-label">初始身份：【見習村民】(初心者路人)</label>
                  <div style="background:#140e22; border:1px solid #5a4430; padding:10px; border-radius:4px; display:flex; gap:10px; align-items:center;">
                    <div style="width:48px; height:48px; background:#0c0914; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                      ${PixelSprites.renderHero('happy', 1, 1, 0, 'novice', 0)}
                    </div>
                    <div style="font-size:11px; color:#eeddbb; line-height:1.5;">
                      <strong>⚠️ 公會考核守則：</strong> 所有新晉勇者皆從「見習村民」啟程，身著粗布衣並持練習木棒。進入遊戲後前往【道場】通過【多益職場商務】考核，方能解鎖聖騎士、大魔導士等高級職業！
                    </div>
                  </div>
                </div>

                <button type="submit" id="btn-gate-submit" class="auth-submit-btn">
                  簽署公會契約・啟程
                </button>
              </form>
            `}
          </div>

          <div class="auth-secure-notice">
            <span>🛡️</span>
            <div>
              <strong>資料獨立與全球即時排行：</strong><br>
              每位玩家擁有獨立的資料庫檔案，生命值、裝備、通天塔層數皆完全隔離；登入後即時參與跨界天梯競賽！
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const selectGateClass = (classId) => {
    gateSelectedHeroClass = classId;
    const cards = document.querySelectorAll('.gate-class-card');
    cards.forEach(card => card.classList.remove('selected'));

    const gateTarget = document.getElementById(`gate-card-${classId}`);
    if (gateTarget) gateTarget.classList.add('selected');
    const modalTarget = document.getElementById(`modal-card-${classId}`);
    if (modalTarget) modalTarget.classList.add('selected');

    const cur = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === classId);
    const detailBox = document.getElementById('gate-class-detail');
    if (detailBox && cur) {
      detailBox.innerHTML = `
        <div class="gate-detail-name">【${cur.name}】${cur.title}</div>
        <div class="gate-detail-bonus">⚡ 初始加成：${cur.bonusDesc}</div>
        <div class="gate-detail-desc">${cur.desc}</div>
      `;
    }
    const modalDetailBox = document.getElementById('modal-class-detail');
    if (modalDetailBox && cur) {
      modalDetailBox.innerHTML = `
        <div class="gate-detail-name">【${cur.name}】${cur.title}</div>
        <div class="gate-detail-bonus">⚡ 初始加成：${cur.bonusDesc}</div>
        <div class="gate-detail-desc">${cur.desc}</div>
      `;
    }
  };

  const handleGateLogin = async () => {
    const account = (document.getElementById('gate-account') || document.getElementById('gate-email'))?.value?.trim();
    const password = document.getElementById('gate-password')?.value;
    const remember = document.getElementById('gate-remember')?.checked !== false;
    const btn = document.getElementById('btn-gate-submit');

    if (!account || !password) {
      alert('請填寫完整帳號 (或 Email) 與通行密碼！');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerText = '驗證冒險者勳章中...';
    }

    try {
      showToast('正在驗證冒險者資料...');
      await SupabaseClient.signIn(account, password, remember);

      state.isAdmin = SupabaseClient.isAdmin();
      setHUDVisible(true);
      loadState();
      if (SupabaseClient.isAdmin()) {
        state.isAdmin = true;
      }
      await SupabaseClient.syncFromCloud();
      checkAbsence();
      updateHUD();
      renderLobbyView();
      bindDebugToolbar();
      if (state.isAdmin) {
        showToast('🛡️ 最高領主 GM 登入成功！開發調試面板已激活！');
      } else {
        showToast(`登入成功！歡迎回到地下城，勇者 ${state.heroName}！`);
      }
    } catch (err) {
      console.error('Gate login error:', err);
      alert('登入失敗: ' + (err.message || '請確認帳號密碼或網路連線'));
      if (btn) {
        btn.disabled = false;
        btn.innerText = '進入地下城世界';
      }
    }
  };

  const handleGateSignup = async () => {
    const email = document.getElementById('gate-email')?.value?.trim();
    const password = document.getElementById('gate-password')?.value;
    const username = document.getElementById('gate-username')?.value?.trim();
    const heroName = document.getElementById('gate-heroname')?.value?.trim() || '單字勇者';
    const chosenClass = 'novice';
    const btn = document.getElementById('btn-gate-submit');

    if (!email || !password || !username) {
      alert('請填寫完整註冊資料！');
      return;
    }

    if (password.length < 6) {
      alert('密碼長度至少需要 6 個字元！');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerText = '正在建立冒險者檔案...';
    }

    try {
      showToast('正在向公會註冊新勇者...');
      await SupabaseClient.signUp(email, password, username, heroName);

      // Force instant login if not logged in yet (bypasses any confirm-email requirements)
      if (!SupabaseClient.isLoggedIn()) {
        try {
          await SupabaseClient.signIn(email, password);
        } catch (loginErr) {
          console.warn('Auto login after signup fallback:', loginErr);
        }
      }

      state = getDefaultState(heroName, 'novice');
      state.heroClass = 'novice';
      state.unlockedClasses = [];
      state.classAwakening = {};
      state.isAdmin = SupabaseClient.isAdmin();
      saveState();
      try {
        await SupabaseClient.syncToCloud(state);
      } catch (cloudErr) {
        console.warn('Initial cloud sync warning:', cloudErr);
      }

      setHUDVisible(true);
      checkAbsence();
      updateHUD();
      renderLobbyView();
      bindDebugToolbar();
      showToast(`註冊成功並已自動登入！永久契約已生效，歡迎勇者 ${state.heroName}！`);
    } catch (err) {
      console.error('Gate signup error:', err);
      alert('註冊失敗: ' + (err.message || '請檢查資訊格式或稍後再試'));
      if (btn) {
        btn.disabled = false;
        btn.innerText = '簽署公會契約・啟程';
      }
    }
  };

  // Auth & Supabase Configuration Modal (Accessible inside lobby)
  const showAuthModal = (activeTab = 'login') => {
    const isConfigured = window.SupabaseClient && SupabaseClient.isConfigured();
    const savedUrl = SUPABASE_CONFIG.getUrl() || '';
    const savedKey = SUPABASE_CONFIG.getAnonKey() || '';

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('crown', 16)} 勇者帳號與 Supabase 雲端競賽</div>

          <div class="tabs-header">
            <button class="tab-btn ${activeTab === 'login' ? 'active' : ''}" onclick="App.showAuthModal('login')">帳號登入</button>
            <button class="tab-btn ${activeTab === 'signup' ? 'active' : ''}" onclick="App.showAuthModal('signup')">註冊帳號</button>
            <button class="tab-btn ${activeTab === 'config' ? 'active' : ''}" onclick="App.showAuthModal('config')">Supabase 連線設定</button>
          </div>

          <div id="auth-tab-body" style="padding:8px 0; display:flex; flex-direction:column; gap:8px;">
            ${activeTab === 'login' ? `
              <div style="font-size:12px; color:var(--text-muted);">輸入您的冒險者帳號或 Email 與密碼登入：</div>
              <input type="text" id="auth-email" placeholder="冒險者帳號 (例如: tangghgh) 或 Email" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="password" id="auth-password" placeholder="密碼 (Password)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <button class="claim-btn" style="padding:8px;" onclick="App.handleLogin()">登入遊戲</button>
            ` : activeTab === 'signup' ? `
              <div style="font-size:12px; color:var(--text-muted);">註冊新帳號，將自動在 Supabase 建立專屬個人檔案與即時競賽排名：</div>
              <input type="email" id="auth-email" placeholder="電子郵件 (Email)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="password" id="auth-password" placeholder="密碼 (至少 6 位數)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="text" id="auth-username" placeholder="使用者帳號 (例如: hero99)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="text" id="auth-heroname" value="${state.heroName}" placeholder="勇者稱號 (例如: 單字大師)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">

              <div style="font-size:11px; color:#eeddbb; margin-top:6px; background:#181024; border:1px solid #5a4430; padding:8px; border-radius:4px; display:flex; gap:8px; align-items:center;">
                <div style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:#0c0914; flex-shrink:0;">
                  ${PixelSprites.renderHero('happy', 1, 1, 0, 'novice', 0)}
                </div>
                <div>
                  <strong>初始身份：【見習村民】</strong><br>
                  所有初心冒險者皆以見習村民出發，需前往【道場】通過【多益職場商務】考核方能轉職為高階職業！
                </div>
              </div>

              <button class="claim-btn" style="padding:8px; margin-top:8px;" onclick="App.handleSignup()">建立帳號並登入</button>
            ` : `
              <div style="font-size:12px; color:var(--text-muted);">
                填入您的 Supabase 專案網址與 Public Anon Key（可於 Supabase Dashboard -> Project Settings -> API 複製）：
              </div>
              <input type="text" id="cfg-url" value="${savedUrl}" placeholder="Project URL (https://xxxx.supabase.co)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="password" id="cfg-key" value="${savedKey}" placeholder="Anon public Key (eyJhbGciOi...)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <button class="claim-btn" style="padding:8px;" onclick="App.handleSaveSupabaseConfig()">儲存連線設定</button>
              <div style="font-size:11px; color:#88ddff; background:#122030; padding:6px; border:1px solid #204060;">
                提示：專案資料夾內已備妥 <code>supabase/schema.sql</code>，在 Supabase SQL Editor 貼上執行即可完成 profiles 表與 RLS 權建置！
              </div>
            `}
          </div>

          <button class="modal-close-btn" onclick="App.renderLeaderboardModal()">返回排行榜</button>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const handleLogin = async () => {
    const account = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;
    if (!account || !password) {
      alert('請輸入帳號/Email 與密碼！');
      return;
    }

    try {
      showToast('正在驗證冒險者勳章...');
      await SupabaseClient.signIn(account, password);
      state.isAdmin = SupabaseClient.isAdmin();
      loadState();
      if (SupabaseClient.isAdmin()) {
        state.isAdmin = true;
      }
      await SupabaseClient.syncFromCloud();
      showToast(state.isAdmin ? '🛡️ GM 管理者已登入！' : '登入成功！雲端進度已同步！');
      closeModal();
      setHUDVisible(true);
      checkAbsence();
      updateHUD();
      renderLobbyView();
      bindDebugToolbar();
    } catch (err) {
      alert('登入失敗: ' + (err.message || '請確認帳號密碼或 Supabase 設定'));
    }
  };

  const handleSignup = async () => {
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;
    const username = document.getElementById('auth-username')?.value?.trim();
    const heroname = document.getElementById('auth-heroname')?.value?.trim() || '單字勇者';

    if (!email || !password || !username) {
      alert('請填寫完整資訊！');
      return;
    }

    try {
      showToast('正在註冊帳號...');
      await SupabaseClient.signUp(email, password, username, heroname);
      if (!SupabaseClient.isLoggedIn()) {
        try {
          await SupabaseClient.signIn(email, password);
        } catch (loginErr) {
          console.warn('Auto login after signup error:', loginErr);
        }
      }

      state = getDefaultState(heroname || '單字勇者', 'novice');
      state.heroClass = 'novice';
      state.unlockedClasses = [];
      state.classAwakening = {};
      state.isAdmin = SupabaseClient.isAdmin();
      saveState();
      try {
        await SupabaseClient.syncToCloud(state);
      } catch (cloudErr) {
        console.warn('Initial cloud sync error:', cloudErr);
      }

      showToast('註冊成功並已自動登入！');
      closeModal();
      setHUDVisible(true);
      checkAbsence();
      updateHUD();
      renderLobbyView();
      bindDebugToolbar();
    } catch (err) {
      alert('註冊失敗: ' + (err.message || '請檢查資訊格式或確認信件'));
    }
  };

  const handleLogout = async () => {
    if (confirm('確定要登出冒險者公會嗎？（您的雲端進度已完整保存）')) {
      try {
        await SupabaseClient.signOut();
      } catch (e) {
        console.warn('Sign out warning:', e);
      }
      closeModal();
      state = getDefaultState();
      setHUDVisible(false);
      showToast('已登出冒險者公會。');
      renderAuthGateView('login');
    }
  };

  const handleSaveSupabaseConfig = () => {
    const url = document.getElementById('cfg-url').value;
    const key = document.getElementById('cfg-key').value;
    if (!url || !key) {
      alert('請輸入 URL 與 Anon Key！');
      return;
    }
    SUPABASE_CONFIG.saveConfig(url, key);
    SupabaseClient.init();
    showToast('Supabase 連線設定已儲存！');
    showAuthModal('login');
  };

  // Sync Cloud Profile into local Game State
  const applyCloudProfile = (data) => {
    if (!data) return;
    if (data.hero_name) state.heroName = data.hero_name;
    if (data.tower_floor) state.towerFloor = data.tower_floor;
    if (data.tower_record_floor) state.towerRecordFloor = data.tower_record_floor;
    if (data.tower_points !== undefined) state.towerPoints = data.tower_points;
    if (data.gold !== undefined) state.gold = data.gold;
    if (data.current_hp !== undefined) state.currentHp = data.current_hp;
    if (data.streak) state.streak = data.streak;
    if (data.equipped_weapon) state.equippedWeapon = data.equipped_weapon;
    if (data.equipped_armor) state.equippedArmor = data.equipped_armor;
    if (data.equipped_relic) state.equippedRelic = data.equipped_relic;
    if (data.owned_weapons) state.ownedWeapons = data.owned_weapons;
    if (data.owned_armors) state.ownedArmors = data.owned_armors;
    if (data.owned_relics) state.ownedRelics = data.owned_relics;
    if (data.inventory) state.inventory = Object.assign({}, data.inventory);
    if (data.dungeon_progress) state.dungeonProgress = data.dungeon_progress;
    if (data.dungeon_first_cleared) state.dungeonFirstCleared = data.dungeon_first_cleared;
    if (data.vocab_stats) state.vocabStats = data.vocab_stats;
    if (data.bestiary_unlocked) state.bestiaryUnlocked = data.bestiary_unlocked;
    if (data.leave_pass_expires) state.leavePassExpires = data.leave_pass_expires;
    if (data.last_active_timestamp) state.lastActiveTimestamp = data.last_active_timestamp;

    if (data.inventory && data.inventory._heroClass) state.heroClass = data.inventory._heroClass;
    else if (data.hero_class) state.heroClass = data.hero_class;

    if (data.inventory && data.inventory._lotteryPity !== undefined) state.lotteryPity = data.inventory._lotteryPity;

    if (data.inventory && Array.isArray(data.inventory._bookmarkedWords)) {
      state.bookmarkedWords = data.inventory._bookmarkedWords;
    } else if (data.bookmarked_words && Array.isArray(data.bookmarked_words)) {
      state.bookmarkedWords = data.bookmarked_words;
    }

    if (data.inventory && Array.isArray(data.inventory._mistakeWords)) {
      state.mistakeWords = data.inventory._mistakeWords;
    } else if (data.mistake_words && Array.isArray(data.mistake_words)) {
      state.mistakeWords = data.mistake_words;
    }

    if (data.inventory && Array.isArray(data.inventory._unlockedClasses)) {
      state.unlockedClasses = data.inventory._unlockedClasses;
    }
    if (data.inventory && data.inventory._classAwakening && typeof data.inventory._classAwakening === 'object') {
      state.classAwakening = data.inventory._classAwakening;
    }

    saveState(false);
    updateHUD();
    renderLobbyView();
    showToast(`雲端進度已同步！歡迎勇者 ${state.heroName}！`);
  };

  const calculateOverallAccuracy = () => {
    let totalC = 0, totalW = 0;
    Object.values(state.vocabStats).forEach(s => {
      totalC += s.correct || 0;
      totalW += s.wrong || 0;
    });
    if (totalC + totalW === 0) return 100.0;
    return ((totalC / (totalC + totalW)) * 100).toFixed(1);
  };

  const changeHeroName = () => {
    const input = document.getElementById('input-hero-name');
    if (input && input.value.trim()) {
      state.heroName = input.value.trim();
      saveState();
      updateHUD();
      showToast('暱稱已更新！');
      renderLeaderboardModal();
    }
  };

  // ==========================================
  // Class Trial (TOEIC) & Class Awakening (GRE)
  // ==========================================

  // Modal: Select Medieval Hero Class / Character Form (Enforcing Dojo Trial)
  const showClassSelectModal = () => {
    const currentClassId = state.heroClass || 'novice';
    const unlockedList = Array.isArray(state.unlockedClasses) ? state.unlockedClasses : [];
    const heroWeapon = GAME_CONFIG.EQUIPMENT.weapons.find(w => w.id === state.equippedWeapon);
    const heroArmor = GAME_CONFIG.EQUIPMENT.armors.find(a => a.id === state.equippedArmor);
    const heroRelic = GAME_CONFIG.EQUIPMENT.relics.find(r => r.id === state.equippedRelic);
    const wTier = heroWeapon ? heroWeapon.tier : 1;
    const aTier = heroArmor ? heroArmor.tier : 1;
    const rTier = heroRelic ? heroRelic.tier : 0;

    // Novice card at the top
    const isNovice = currentClassId === 'novice';
    const noviceCardHtml = `
      <div class="class-trial-card ${isNovice ? 'active-class' : ''}">
        <div class="class-mini-preview">
          ${PixelSprites.renderHero('happy', 1, 1, 0, 'novice', 0)}
        </div>
        <div class="class-trial-info">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span style="font-weight:bold; color:#eeddbb; font-size:13px;">見習村民 (初始路人姿態)</span>
            <span class="trial-badge ${isNovice ? 'badge-active' : 'badge-unlocked'}">${isNovice ? '當前身分' : '基礎姿態'}</span>
          </div>
          <div style="font-size:10px; color:#a09080;">初始樸實無華的路人姿態，身著粗麻布衣，手持見習木棒。需至道場通過多益考核方可獲得高階英雄職業！</div>
        </div>
        <div>
          ${isNovice ? `
            <button class="claim-btn" style="padding:6px 10px; font-size:11px;" onclick="App.showDojoSelectModal()">前往道場轉職</button>
          ` : `
            <button class="secondary-btn" style="padding:5px 8px; font-size:10px;" onclick="App.selectHeroClass('novice')">切換回村民</button>
          `}
        </div>
      </div>
    `;

    const cardsHtml = (GAME_CONFIG.HERO_CLASSES || []).map(cls => {
      const isUnlocked = unlockedList.includes(cls.id);
      const isSelected = cls.id === currentClassId;
      const rank = (state.classAwakening && state.classAwakening[cls.id]) || 0;

      return `
        <div class="class-trial-card ${isSelected ? 'active-class' : !isUnlocked ? 'locked' : ''}">
          <div class="class-mini-preview">
            ${PixelSprites.renderHero('happy', wTier, aTier, rTier, cls.id, rank)}
          </div>
          <div class="class-trial-info">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span style="font-weight:bold; color:${isSelected ? 'var(--gold)' : '#fff'}; font-size:13px;">
                ${cls.name} <span style="font-size:10px; color:var(--text-muted);">(${cls.title})</span>
                ${rank > 0 ? `<span class="awakening-stars-tag">★x${rank}</span>` : ''}
              </span>
              <span class="trial-badge ${isSelected ? 'badge-active' : isUnlocked ? 'badge-unlocked' : 'badge-locked'}">
                ${isSelected ? '當前出戰' : isUnlocked ? '已轉職解鎖' : '未解鎖'}
              </span>
            </div>
            <div style="font-size:10px; color:var(--text-muted);">${cls.desc}</div>
            <div style="font-size:10px; color:#ffdd66;">⚡ 特性加成：${cls.bonusDesc}</div>
            ${isUnlocked ? `
              <div style="font-size:10px; color:#ba68c8;">
                ✨ 神域覺醒：${rank > 0 ? `已達成第 ${rank} 階 (${'★'.repeat(rank)})` : '尚未覺醒 (可進行 GRE 試煉)'}
              </div>
            ` : `
              <div style="font-size:10px; color:#ff8888;">
                🔒 轉職條件：需至道場通過【TOEIC 多益商務】5 題考核 (容錯 <= 2)
              </div>
            `}
          </div>
          <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
            ${isUnlocked ? `
              <button class="claim-btn" style="padding:5px 8px; font-size:10px; width:100%;" onclick="App.selectHeroClass('${cls.id}')">
                ${isSelected ? '當前型態' : '選擇出戰'}
              </button>
              <button class="secondary-btn" style="padding:4px 8px; font-size:10px; width:100%;" onclick="App.showAwakeningModal('${cls.id}')">
                神域覺醒
              </button>
            ` : `
              <button class="claim-btn" style="padding:6px 10px; font-size:11px; background:#4a2266; border-color:#9944dd;" onclick="App.startClassTrial('${cls.id}')">
                多益考核轉職
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" style="max-width:520px;" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('crown', 16)} 英雄姿態與轉職聖所 (道場考核制度)</div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            ⚠️ 英雄公會守則：初心冒險者皆為見習村民，必須通過道場【TOEIC 多益職場商務】考核方能獲得職業！各職業更可進行 5 階【GRE】神域覺醒！
          </div>
          <div class="items-list-container" style="max-height:360px; display:flex; flex-direction:column; gap:8px;">
            ${noviceCardHtml}
            ${cardsHtml}
          </div>
          <button class="modal-close-btn" style="margin-top:8px;" onclick="App.closeModal()">關閉</button>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const selectHeroClass = (classId) => {
    if (classId === 'novice') {
      state.heroClass = 'novice';
      saveState();
      updateHUD();
      renderLobbyView();
      closeModal();
      showToast('已切換為【見習村民】姿態！');
      return;
    }

    const unlockedList = Array.isArray(state.unlockedClasses) ? state.unlockedClasses : [];
    if (!unlockedList.includes(classId)) {
      alert('尚未解鎖此職業！請先通過道場多益轉職考核！');
      startClassTrial(classId);
      return;
    }

    const classObj = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === classId);
    if (!classObj) return;

    state.heroClass = classId;
    saveState();
    updateHUD();
    renderLobbyView();
    closeModal();
    showToast(`已切換職業姿態為【${classObj.name}】！特性：${classObj.bonusDesc}`);
  };

  // Launch TOEIC Dojo Class Trial
  const startClassTrial = (classId) => {
    closeModal();
    const classObj = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === classId);
    if (!classObj) return;

    battle.active = true;
    battle.mode = 'dojo_class_trial';
    battle.targetClassId = classId;
    battle.trialCorrectCount = 0;
    battle.trialMistakes = 0;
    battle.trialFailed = false;
    battle.enemyName = `多益考官・${classObj.name}導師`;
    battle.enemyMaxHp = 99999;
    battle.enemyCurrentHp = 99999;
    battle.enemyAtk = 0;
    battle.enemyDef = 4;
    battle.timeLimit = 15.0;
    battle.bossTrait = null;
    battle.minionKey = 'orc_grunt';
    battle.combo = 0;
    battle.correctInSession = 0;
    battle.totalInSession = 0;
    battle.currentTurn = 1;
    battle.timeReductionNext = 0;
    battle.burnTurns = 0;

    AudioManager.play('click');
    loadNextQuestion();
    showToast(`⚔️ 正在進行【${classObj.name}】道場轉職多益考核！需答對 5 題！`);
  };

  const onClassTrialSuccess = (classId) => {
    battle.active = false;
    clearInterval(battle.timerId);
    AudioManager.play('victory');

    if (!Array.isArray(state.unlockedClasses)) state.unlockedClasses = [];
    if (!state.unlockedClasses.includes(classId)) {
      state.unlockedClasses.push(classId);
    }
    state.heroClass = classId;
    state.gold += 80;
    saveState();
    updateHUD();
    renderLobbyView();

    showClassTrialResultModal(true, classId);
  };

  const showClassTrialResultModal = (success, classId) => {
    battle.active = false;
    clearInterval(battle.timerId);
    const cls = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === classId);
    const clsName = cls ? cls.name : '職業';

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" style="max-width:440px; text-align:center;" onclick="event.stopPropagation()">
          <div style="font-size:32px; margin-bottom:8px;">
            ${success ? PixelSprites.icon('crown', 36) : PixelSprites.icon('skull', 36)}
          </div>
          <div class="modal-title" style="color:${success ? 'var(--gold)' : '#ff6666'};">
            ${success ? `🏆 轉職合格！正式晉升【${clsName}】！` : `❌ 道場考核未通過！`}
          </div>

          <div style="margin:12px auto; width:64px; height:64px; display:flex; align-items:center; justify-content:center; background:#120e1c; border:2px solid ${success ? '#ffd700' : '#664444'};">
            ${PixelSprites.renderHero(success ? 'happy' : 'hurt', 1, 1, 0, success ? classId : 'novice', 0)}
          </div>

          <div style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:12px;">
            ${success ? `
              恭喜勇者！您已通過嚴苛的多益職場商務考核，正式晉升為<strong>【${clsName}】</strong>！<br>
              獲得轉職賞金 <strong>+80 金幣</strong>！<br>
              <div style="color:#ffd700; margin-top:4px;">⚡ 特性加成已激活：${cls ? cls.bonusDesc : ''}</div>
              <div style="color:#ba68c8; font-size:11px; margin-top:4px;">💡 現在您可在修煉道場或型態介面進行「五階神域 GRE 覺醒」！</div>
            ` : `
              多益商務試煉要求答對 5 題且失誤不超過 2 次。<br>
              本次考核累計失誤超過限制。別灰心，修煉道場隨時為您敞開，重整旗鼓再來！
            `}
          </div>

          <div style="display:flex; gap:8px; justify-content:center;">
            ${success ? `
              <button class="claim-btn" onclick="App.closeModal(); App.renderLobbyView();">回大廳整裝出發</button>
              <button class="secondary-btn" onclick="App.showAwakeningModal('${classId}')">查看神域覺醒</button>
            ` : `
              <button class="claim-btn" onclick="App.startClassTrial('${classId}')">再次挑戰考核</button>
              <button class="secondary-btn" onclick="App.closeModal(); App.renderLobbyView();">返回大廳</button>
            `}
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  // Launch GRE Class Awakening Trial (Tier 1-5)
  const startAwakeningTrial = (classId, targetRank) => {
    closeModal();
    const classObj = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === classId);
    if (!classObj) return;

    const currentRank = (state.classAwakening && state.classAwakening[classId]) || 0;
    const rank = targetRank || (currentRank + 1);
    if (rank > 5) {
      showToast('此職業已達到最高第五階神域真姿！');
      return;
    }

    const req = (GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements && GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements[rank]) || { requiredCorrect: 5, maxMistakes: 2, timeLimit: 18.0 };

    battle.active = true;
    battle.mode = 'dojo_awakening_trial';
    battle.targetClassId = classId;
    battle.targetRank = rank;
    battle.trialCorrectCount = 0;
    battle.trialMistakes = 0;
    battle.trialFailed = false;
    battle.enemyName = `神域法則幻影・第 ${rank} 階守護者`;
    battle.enemyMaxHp = 99999;
    battle.enemyCurrentHp = 99999;
    battle.enemyAtk = 0;
    battle.enemyDef = 6;
    battle.timeLimit = req.timeLimit;
    battle.bossTrait = null;
    battle.minionKey = 'wraith';
    battle.combo = 0;
    battle.correctInSession = 0;
    battle.totalInSession = 0;
    battle.currentTurn = 1;
    battle.timeReductionNext = 0;
    battle.burnTurns = 0;

    AudioManager.play('click');
    loadNextQuestion();
    showToast(`✨ 正在挑戰【${classObj.name}】第 ${rank} 階神域 GRE 覺醒試煉！`);
  };

  const onAwakeningTrialSuccess = (classId, rank) => {
    battle.active = false;
    clearInterval(battle.timerId);
    AudioManager.play('victory');

    if (!state.classAwakening || typeof state.classAwakening !== 'object') state.classAwakening = {};
    state.classAwakening[classId] = rank;
    state.gold += 120 + rank * 20;
    saveState();
    updateHUD();
    renderLobbyView();

    showAwakeningTrialResultModal(true, classId, rank);
  };

  const showAwakeningTrialResultModal = (success, classId, rank) => {
    battle.active = false;
    clearInterval(battle.timerId);
    const cls = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === classId);
    const clsName = cls ? cls.name : '職業';
    const tierMeta = (GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.tiers && GAME_CONFIG.CLASS_AWAKENING_CONFIG.tiers[rank]) || { name: `第 ${rank} 階覺醒`, auraName: '神域威能' };
    const bonus = (GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses && GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses[classId]) ? GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses[classId][rank] : null;

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" style="max-width:440px; text-align:center;" onclick="event.stopPropagation()">
          <div style="font-size:32px; margin-bottom:8px;">
            ${success ? PixelSprites.icon('gem', 36) : PixelSprites.icon('skull', 36)}
          </div>
          <div class="modal-title" style="color:${success ? '#f0a3ff' : '#ff6666'};">
            ${success ? `✨ 突破界限！【${clsName}】${tierMeta.name}達成！` : `❌ 神域試煉未通過！`}
          </div>

          <div style="margin:12px auto; width:64px; height:64px; display:flex; align-items:center; justify-content:center; background:#120e1c; border:2px solid ${success ? '#c058f8' : '#664444'};">
            ${PixelSprites.renderHero(success ? 'happy' : 'hurt', 1, 1, 0, classId, success ? rank : Math.max(0, rank - 1))}
          </div>

          <div style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:12px;">
            ${success ? `
              神域法則共鳴！您的【${clsName}】已正式覺醒至 <strong>${tierMeta.name}</strong>（${'★'.repeat(rank)}）！<br>
              獲得靈光獎勵 <strong>+${120 + rank * 20} 金幣</strong>！<br>
              <div style="color:#ffd700; margin-top:4px;">⚡ 覺醒光環：${tierMeta.auraName}</div>
              ${bonus ? `<div style="color:#77ffaa; font-size:11px;">能力值躍升：+${bonus.hp} HP, +${bonus.atk} ATK, +${bonus.def} DEF${bonus.timeBonus ? `, +${bonus.timeBonus}s 作答寬裕` : ''}</div>` : ''}
            ` : `
              GRE 高階殿堂試煉極其嚴苛，本次試煉失誤超出了法則耐受限度。<br>
              持續磨練單字造詣，隨時可再次挑戰神域覺醒！
            `}
          </div>

          <div style="display:flex; gap:8px; justify-content:center;">
            ${success ? `
              <button class="claim-btn" onclick="App.closeModal(); App.renderLobbyView();">回大廳顯耀姿態</button>
              ${rank < 5 ? `<button class="secondary-btn" onclick="App.showAwakeningModal('${classId}')">邁向下一階覺醒</button>` : ''}
            ` : `
              <button class="claim-btn" onclick="App.startAwakeningTrial('${classId}', ${rank})">再次挑戰本階</button>
              <button class="secondary-btn" onclick="App.closeModal(); App.renderLobbyView();">返回大廳</button>
            `}
          </div>
        </div>
      </div>
    `;
    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  // Modal: 5-Tier GRE Class Awakening Shrine
  const showAwakeningModal = (classId) => {
    let targetClassId = classId || state.heroClass;
    if (targetClassId === 'novice') {
      const firstUnlocked = (state.unlockedClasses || [])[0];
      if (firstUnlocked) {
        targetClassId = firstUnlocked;
      } else {
        alert('您目前仍是見習村民！請先前往道場通過多益考核解鎖任意進階職業，方可進行神域覺醒！');
        showClassSelectModal();
        return;
      }
    }

    const cls = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === targetClassId) || (GAME_CONFIG.HERO_CLASSES || [])[0];
    const currentRank = (state.classAwakening && state.classAwakening[cls.id]) || 0;
    const bonusesArr = (GAME_CONFIG.CLASS_AWAKENING_CONFIG && GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses && GAME_CONFIG.CLASS_AWAKENING_CONFIG.bonuses[cls.id]) || [];

    const tierCardsHtml = [1, 2, 3, 4, 5].map(rank => {
      const meta = GAME_CONFIG.CLASS_AWAKENING_CONFIG.tiers[rank];
      const req = GAME_CONFIG.CLASS_AWAKENING_CONFIG.requirements[rank];
      const bonus = bonusesArr[rank] || { hp: 0, atk: 0, def: 0 };
      const isCompleted = currentRank >= rank;
      const isCurrentTarget = currentRank === (rank - 1);
      const isLocked = currentRank < (rank - 1);

      let cardClass = 'awakening-tier-card';
      if (isCompleted) cardClass += ' completed';
      else if (isCurrentTarget) cardClass += ' current-target';
      else cardClass += ' locked-tier';

      return `
        <div class="${cardClass}">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-weight:bold; color:${isCompleted ? '#77ffaa' : isCurrentTarget ? '#ffd700' : '#887799'}; font-size:12px;">
                ${meta.name} (${'★'.repeat(rank)})
              </span>
              <span style="font-size:10px; color:#c090e0;">${meta.auraName}</span>
            </div>
            <div style="font-size:10px; color:#b0c0d0; margin-top:2px;">
              ⚡ 能力提升：+${bonus.hp} HP, +${bonus.atk} ATK, +${bonus.def} DEF${bonus.timeBonus ? `, +${bonus.timeBonus}s 答題時限` : ''}${bonus.goldMultiplier ? `, +${Math.round(bonus.goldMultiplier * 100)}% 金幣` : ''}
            </div>
            <div style="font-size:10px; color:#ff9999; margin-top:1px;">
              📜 GRE考核：需連續答對 ${req.requiredCorrect} 題 (容許失誤最多 ${req.maxMistakes} 次，時限 ${req.timeLimit}s)
            </div>
          </div>
          <div>
            ${isCompleted ? `
              <span style="color:#77ffaa; font-size:11px; font-weight:bold;">已覺醒 ✓</span>
            ` : isCurrentTarget ? `
              <button class="claim-btn" style="padding:6px 10px; font-size:11px;" onclick="App.startAwakeningTrial('${cls.id}', ${rank})">
                挑戰覺醒
              </button>
            ` : `
              <span style="color:#776688; font-size:10px;">需先達上一階</span>
            `}
          </div>
        </div>
      `;
    }).join('');

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" style="max-width:520px;" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('gem', 16)} 【${cls.name}】五階神域 GRE 覺醒聖殿</div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            藉由 GRE 高階殿堂單字試煉打破潛能桎梏！每次覺醒均大幅提升專屬能力值並顯化全新神祇光環：
          </div>

          <!-- Class Switcher Tabs if multiple unlocked -->
          <div style="display:flex; gap:6px; margin-bottom:8px; overflow-x:auto;">
            ${(state.unlockedClasses || []).map(uId => {
              const uCls = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === uId);
              if (!uCls) return '';
              const r = (state.classAwakening && state.classAwakening[uId]) || 0;
              return `
                <button class="tab-btn ${uId === cls.id ? 'active' : ''}" style="font-size:10px; padding:4px 8px;" onclick="App.showAwakeningModal('${uId}')">
                  ${uCls.name} (${r}階)
                </button>
              `;
            }).join('')}
          </div>

          <div style="display:flex; align-items:center; gap:12px; background:#140e22; border:1px solid #4a346e; padding:8px; border-radius:4px; margin-bottom:10px;">
            <div style="width:56px; height:56px; display:flex; align-items:center; justify-content:center; background:#0c0914;">
              ${PixelSprites.renderHero('happy', 1, 1, 0, cls.id, currentRank)}
            </div>
            <div>
              <div style="font-weight:bold; color:var(--gold); font-size:13px;">
                【${cls.name}】當前位階：${currentRank === 0 ? '尚未覺醒' : `${GAME_CONFIG.CLASS_AWAKENING_CONFIG.tiers[currentRank].name} (${'★'.repeat(currentRank)})`}
              </div>
              <div style="font-size:11px; color:#c0a0e0;">${cls.desc}</div>
            </div>
          </div>

          <div class="items-list-container" style="max-height:300px; display:flex; flex-direction:column; gap:4px;">
            ${tierCardsHtml}
          </div>

          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:8px;">
            <button class="secondary-btn" onclick="App.showClassSelectModal()">返回職業選單</button>
            <button class="modal-close-btn" onclick="App.closeModal()">關閉</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const exportSyncCode = () => {
    const code = btoa(JSON.stringify({
      name: state.heroName,
      floor: state.towerRecordFloor,
      streak: state.streak,
      weapon: state.equippedWeapon
    }));
    navigator.clipboard.writeText(code).then(() => {
      showToast('戰績引繼碼已複製到剪貼簿！可傳給好友比較！');
    }).catch(() => {
      prompt('請複製您的戰績碼：', code);
    });
  };

  const importSyncCode = () => {
    const input = prompt('請貼上好友的戰績引繼碼：');
    if (!input) return;
    try {
      const parsed = JSON.parse(atob(input));
      if (parsed.name && parsed.floor) {
        GAME_CONFIG.INITIAL_LEADERBOARD.push({
          name: `${parsed.name} [好友]`,
          floor: parsed.floor,
          accuracy: 90.0,
          streak: parsed.streak || 1,
          weapon: parsed.weapon || 'w1',
          quote: '來自好友分享的英姿！'
        });
        showToast('好友戰績匯入成功！已加入排行榜！');
        renderLeaderboardModal();
      }
    } catch (e) {
      alert('無效的戰績碼！');
    }
  };

  // 7-day Check-in Modal
  const showCheckinModal = () => {
    const today = getTodayStr();
    const isClaimedToday = (state.checkinClaimedDate === today);

    let cardsHtml = GAME_CONFIG.CHECKIN_CYCLE.map((c, idx) => {
      const isPast = idx < state.checkinDayIndex;
      const isCurrent = idx === state.checkinDayIndex;
      return `
        <div class="goal-item" style="${isCurrent ? 'border-color:var(--gold); background:#27203b;' : ''}">
          <span>第 ${c.day} 天：${c.label}</span>
          <button class="claim-btn" onclick="App.claimCheckin(${idx})" ${isCurrent && !isClaimedToday ? '' : 'disabled'}>
            ${isPast || (isCurrent && isClaimedToday) ? '已簽到' : '簽到'}
          </button>
        </div>
      `;
    }).join('');

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('calendar', 16)} 每日七日簽到簿</div>
          <div class="items-list-container">${cardsHtml}</div>
          <button class="modal-close-btn" onclick="App.closeModal()">關閉</button>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const claimCheckin = (dayIdx) => {
    const today = getTodayStr();
    if (state.checkinClaimedDate === today) return;

    const reward = GAME_CONFIG.CHECKIN_CYCLE[dayIdx];
    state.gold += reward.gold;
    if (reward.item) {
      state.inventory[reward.item] = (state.inventory[reward.item] || 0) + reward.count;
    }

    state.checkinClaimedDate = today;
    state.checkinDayIndex = (state.checkinDayIndex + 1) % 7;

    AudioManager.play('coin');
    showToast(`簽到成功！獲得 ${reward.label}！`);
    saveState();
    updateHUD();
    showCheckinModal();
  };

  // ==========================================
  // VIEW: Goblin Dungeon Fate Lottery / 3x3 Roulette
  // ==========================================
  let isLotterySpinning = false;
  let currentLotterySlot = 0;

  const showLotteryModal = () => {
    const cfg = GAME_CONFIG.LOTTERY;
    const currentPity = state.lotteryPity || 0;
    const currentWinRatePct = Math.min(95, Math.round((cfg.baseWinRate + Math.min(cfg.maxPityRate, currentPity * cfg.pityIncrement)) * 100));

    // Positions mapping for 3x3 perimeter grid (clockwise: 0->1->2->3->4->5->6->7)
    const slotGridPos = {
      0: 'grid-column: 1; grid-row: 1;',
      1: 'grid-column: 2; grid-row: 1;',
      2: 'grid-column: 3; grid-row: 1;',
      3: 'grid-column: 3; grid-row: 2;',
      4: 'grid-column: 3; grid-row: 3;',
      5: 'grid-column: 2; grid-row: 3;',
      6: 'grid-column: 1; grid-row: 3;',
      7: 'grid-column: 1; grid-row: 2;'
    };

    const tilesHtml = cfg.slots.map(slot => {
      const isJackpot = slot.tier === 'jackpot';
      const isPrize = slot.type === 'prize';
      const posStyle = slotGridPos[slot.id];
      const isActive = slot.id === (currentLotterySlot % 8);

      return `
        <div class="roulette-tile ${isJackpot ? 'roulette-tile-jackpot' : isPrize ? 'roulette-tile-prize' : 'roulette-tile-dud'} ${isActive ? 'active' : ''}" 
             id="slot-tile-${slot.id}" 
             style="${posStyle}">
          <div class="tile-icon-box">
            ${PixelSprites.icon(slot.icon, isJackpot ? 22 : 18)}
          </div>
          <div class="tile-name-text ${isJackpot ? 'tile-text-gold' : ''}">
            ${slot.rewardText}
          </div>
          <span class="tile-badge ${isJackpot ? 'tile-text-gold' : ''}">
            ${isJackpot ? '★ 傳說特獎' : slot.name}
          </span>
        </div>
      `;
    }).join('');

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog lottery-modal-dialog" onclick="event.stopPropagation()">
          <div class="modal-title" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${PixelSprites.icon('dice', 18)} 哥布林地下賭場・命運轉盤</span>
            <span style="font-size:12px; color:var(--gold);">${PixelSprites.icon('coin', 12)} 持有: <span id="lottery-current-gold">${state.gold}</span> G</span>
          </div>

          <!-- Pity Tracker Banner -->
          <div class="lottery-pity-banner">
            <div class="lottery-pity-title-row">
              <span>幸運轉運值 (累積未中): <span class="lottery-pity-highlight" id="lottery-pity-count-text">${currentPity} 次</span></span>
              <span>當前預估中獎率: <span class="lottery-pity-rate" id="lottery-pity-rate-text">${currentWinRatePct}%</span></span>
            </div>
            <div style="font-size:10px; color:#a090b8;">
              ⚡ 初始中獎率極低 (5%)！每次未中獎，下把中獎機率永久提升 <span style="color:#55e6ff;">+3.5%</span>！抽中任一獎勵後重置。
            </div>
          </div>

          <!-- 3x3 Classic Arcade Roulette Grid -->
          <div class="lottery-grid-3x3">
            ${tilesHtml}

            <!-- Center Cell: Spin Controls -->
            <div class="roulette-center-cell" id="roulette-center-cell">
              <button class="roulette-spin-btn" id="roulette-spin-btn" onclick="App.spinLottery()" ${state.gold < cfg.cost ? 'style="background:#552222; border-color:#884444;"' : ''}>
                ${state.gold < cfg.cost ? `金幣不足！(需 ${cfg.cost} G)` : `啟動輪盤 (${cfg.cost} G)`}
              </button>
              <div style="font-size:10px; color:#ffd700; margin-top:2px;">
                ${PixelSprites.icon('trophy', 10)} 最高 9999 金幣
              </div>
            </div>
          </div>

          <!-- Feedback & Taunt Area -->
          <div class="roulette-feedback-box" id="lottery-feedback-box">
            <div style="font-size:11px; color:#d2c8e6; text-align:center;">
              「哥布林莊家獰笑：『30 金幣試一把！萬一中了 9999 金幣，老子當場破產！』」
            </div>
          </div>

          <!-- Permanent Exit Button (Always Present) -->
          <button class="lottery-exit-btn" id="lottery-permanent-exit-btn" onclick="App.closeModal()">
            🚪 離開賭場・返回營地
          </button>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const spinLottery = () => {
    if (isLotterySpinning) return;

    const cfg = GAME_CONFIG.LOTTERY;
    const cost = cfg.cost || 30;

    // Check if player has enough gold
    if (state.gold < cost) {
      handleLotteryEviction();
      return;
    }

    // Deduct cost
    state.gold -= cost;
    state.lotteryTotalSpins = (state.lotteryTotalSpins || 0) + 1;
    saveState();
    updateHUD();

    const currentGoldEl = document.getElementById('lottery-current-gold');
    if (currentGoldEl) currentGoldEl.textContent = state.gold;

    isLotterySpinning = true;

    // Disable spin button during animation
    const spinBtn = document.getElementById('roulette-spin-btn');
    if (spinBtn) {
      spinBtn.disabled = true;
      spinBtn.innerText = '⚡ 命運轉動中...';
    }
    const spinAgainBtn = document.getElementById('lottery-spin-again-btn');
    if (spinAgainBtn) spinAgainBtn.disabled = true;

    const feedbackBox = document.getElementById('lottery-feedback-box');
    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div style="font-size:11px; color:#ffd700; text-align:center; padding:4px 0;">
          ⚡ 輪盤急速飛轉中……巨龍寶庫 9999 金幣正在招手！
        </div>
      `;
    }

    // Determine target slot using Pity algorithm
    const currentPity = state.lotteryPity || 0;
    const baseWinRate = cfg.baseWinRate || 0.05;
    const bonusRate = Math.min(cfg.maxPityRate, currentPity * cfg.pityIncrement);
    const totalWinRate = Math.min(0.95, baseWinRate + bonusRate);

    const isWinner = Math.random() < totalWinRate;
    let targetSlotId = 1;
    let wonPrize = null;

    if (isWinner) {
      // Chance for 9999G scales with pity
      const jackpotWeight = Math.min(0.25, (cfg.jackpotInitialWeight || 0.015) + currentPity * 0.008);
      if (Math.random() < jackpotWeight) {
        targetSlotId = 0; // Jackpot 9999 G!
      } else {
        // Pick among other prize slots: 2 (500G), 4 (Scroll+100G), 6 (Potion+50G), 7 (30G)
        const prizeSlots = [2, 4, 6, 7];
        targetSlotId = prizeSlots[Math.floor(Math.random() * prizeSlots.length)];
      }
      wonPrize = cfg.slots.find(s => s.id === targetSlotId);
      state.lotteryPity = 0; // Reset pity on win!
    } else {
      // Pick among dud slots: 1, 3, 5
      const dudSlots = [1, 3, 5];
      targetSlotId = dudSlots[Math.floor(Math.random() * dudSlots.length)];
      state.lotteryPity = currentPity + 1; // Increment pity on miss!
    }

    // Spinning Animation
    const currentPos = currentLotterySlot % 8;
    const minRotations = 3; // 24 steps
    const stepsToTarget = (targetSlotId - currentPos + 8) % 8;
    const totalSteps = minRotations * 8 + stepsToTarget;

    let stepCount = 0;
    let currentStepDelay = 50;

    const stepSpin = () => {
      // Un-highlight previous slot
      const prevTile = document.getElementById(`slot-tile-${currentLotterySlot}`);
      if (prevTile) prevTile.classList.remove('active');

      // Move to next slot clockwise
      currentLotterySlot = (currentLotterySlot + 1) % 8;
      const nextTile = document.getElementById(`slot-tile-${currentLotterySlot}`);
      if (nextTile) nextTile.classList.add('active');

      // Tick sound
      AudioManager.play('rouletteTick');

      stepCount++;

      if (stepCount >= totalSteps) {
        // Finalize spin on landed tile
        finalizeLotterySpin(isWinner, wonPrize);
      } else {
        // Smooth deceleration curve towards the target
        const remaining = totalSteps - stepCount;
        if (remaining <= 6) {
          currentStepDelay += 45;
        } else if (remaining <= 12) {
          currentStepDelay += 20;
        }
        setTimeout(stepSpin, currentStepDelay);
      }
    };

    setTimeout(stepSpin, currentStepDelay);
  };

  const finalizeLotterySpin = (isWinner, wonPrize) => {
    isLotterySpinning = false;
    saveState();
    updateHUD();

    const currentGoldEl = document.getElementById('lottery-current-gold');
    if (currentGoldEl) currentGoldEl.textContent = state.gold;

    const cfg = GAME_CONFIG.LOTTERY;
    const currentPity = state.lotteryPity || 0;
    const nextWinRatePct = Math.min(95, Math.round((cfg.baseWinRate + Math.min(cfg.maxPityRate, currentPity * cfg.pityIncrement)) * 100));

    // Update pity banner in modal
    const pityCountEl = document.getElementById('lottery-pity-count-text');
    if (pityCountEl) pityCountEl.textContent = `${currentPity} 次`;
    const pityRateEl = document.getElementById('lottery-pity-rate-text');
    if (pityRateEl) pityRateEl.textContent = `${nextWinRatePct}%`;

    const feedbackBox = document.getElementById('lottery-feedback-box');
    const centerCell = document.getElementById('roulette-center-cell');

    if (isWinner && wonPrize) {
      // Distribute rewards
      if (wonPrize.gold) state.gold += wonPrize.gold;
      if (wonPrize.item) {
        state.inventory[wonPrize.item] = (state.inventory[wonPrize.item] || 0) + (wonPrize.itemCount || 1);
      }
      saveState();
      updateHUD();

      if (currentGoldEl) currentGoldEl.textContent = state.gold;

      if (wonPrize.tier === 'jackpot') {
        AudioManager.play('jackpot');
        showToast('【天降橫財】狂賀！！勇者抽中遠古巨龍金庫 9999 金幣！！');
      } else {
        AudioManager.play('victory');
        showToast(`恭喜中獎！獲得 ${wonPrize.name} (${wonPrize.rewardText})！`);
      }

      if (feedbackBox) {
        feedbackBox.innerHTML = `
          <div class="roulette-win-banner">
            ${wonPrize.tier === 'jackpot' ? '🏆【奇蹟降臨！！】' : '🎉【恭喜中獎！！】'}
            抽中【${wonPrize.name}】（${wonPrize.rewardText}）！<br>
            <span style="font-size:10px; color:#b0e0ff;">幸運轉運值已重置為 0，獎勵已存入背包！</span>
          </div>
          <div class="lottery-action-row">
            <button class="lottery-spin-again-btn" id="lottery-spin-again-btn" onclick="App.spinLottery()">
              🌟 乘勝追擊・再抽一次 (${cfg.cost} G)
            </button>
            <button class="lottery-exit-btn" onclick="App.closeModal()">
              🚪 離開賭場・返回營地
            </button>
          </div>
        `;
      }
    } else {
      // Missed / Dud: Taunt!
      AudioManager.play('defeat');
      const randomTaunt = cfg.taunts[Math.floor(Math.random() * cfg.taunts.length)];

      if (feedbackBox) {
        feedbackBox.innerHTML = `
          <div class="roulette-taunt-quote">
            ${randomTaunt}
          </div>
          <div style="font-size:10px; color:#a090b8; text-align:center; margin-top:2px;">
            🔥 當前連輸未中: ${currentPity} 次 | 下次中獎率已飆升至 <span style="color:#55e6ff; font-weight:bold;">${nextWinRatePct}%</span>！
          </div>
          <div class="lottery-action-row">
            <button class="lottery-spin-again-btn" id="lottery-spin-again-btn" onclick="App.spinLottery()">
              🎯 哪有賭徒天天輸・再抽一次 (${cfg.cost} G)
            </button>
            <button class="lottery-exit-btn" onclick="App.closeModal()">
              🚪 離開賭場・返回營地
            </button>
          </div>
        `;
      }
    }

    // Re-enable center button if visible
    if (centerCell) {
      centerCell.innerHTML = `
        <button class="roulette-spin-btn" id="roulette-spin-btn" onclick="App.spinLottery()" ${state.gold < cfg.cost ? 'style="background:#552222; border-color:#884444;"' : ''}>
          ${state.gold < cfg.cost ? `金幣不足！(需 ${cfg.cost} G)` : `啟動輪盤 (${cfg.cost} G)`}
        </button>
        <span style="font-size:10px; color:var(--gold);">${PixelSprites.icon('coin', 10)} 持有: ${state.gold} G</span>
      `;
    }
  };

  const handleLotteryEviction = () => {
    AudioManager.play('floorDown');
    const cfg = GAME_CONFIG.LOTTERY;
    const expulsionLine = cfg.expulsions[Math.floor(Math.random() * cfg.expulsions.length)];

    const feedbackBox = document.getElementById('lottery-feedback-box');
    if (feedbackBox) {
      feedbackBox.innerHTML = `
        <div class="roulette-expulsion-box">
          ${expulsionLine}<br>
          <span style="font-size:10px; color:#ffaaaa;">【警衛正在將你丟出門外……即將回到營地】</span>
        </div>
        <div class="lottery-action-row">
          <button class="lottery-exit-btn" onclick="App.closeModal()" style="border-color:#ff4444; color:#ff8888;">
            🚪 自行離開賭場
          </button>
        </div>
      `;
    }

    const centerCell = document.getElementById('roulette-center-cell');
    if (centerCell) {
      centerCell.innerHTML = `
        <div style="font-size:11px; color:#ff5555; font-weight:bold;">
          ⚠️ 逐客令已發佈
        </div>
        <span style="font-size:10px; color:#ff9999;">金幣不足 ${cfg.cost} G</span>
      `;
    }

    // Evict player back to lobby after 1.5 seconds
    setTimeout(() => {
      const modal = document.getElementById('modal-overlay');
      if (modal) {
        closeModal();
        showToast('你因囊中羞澀被哥布林賭場轟出門外！快去打怪賺取金幣吧！');
      }
    }, 1500);
  };

  // Victory & Defeat Modals
  const showVictoryModal = (msg) => {
    const modalHtml = `
      <div class="modal-overlay">
        <div class="modal-dialog modal-dialog-gold">
          <div class="modal-title" style="color:#44dd66;">${PixelSprites.icon('trophy', 16)} 戰鬥大獲全勝！</div>
          <div style="text-align:center; padding:10px 0; font-size:14px;">${msg}</div>
          <button class="modal-close-btn" onclick="App.closeModalAndLobby()">領取並返回營地</button>
        </div>
      </div>
    `;
    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const showDefeatModal = (msg) => {
    const modalHtml = `
      <div class="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-title" style="color:#ff4444;">${PixelSprites.icon('skull', 16)} 戰鬥失敗...</div>
          <div style="text-align:center; padding:10px 0; font-size:13px; color:#ffdddd;">${msg}</div>
          <div style="font-size:11px; color:#a090b8; text-align:center;">
            提示：受傷不會自動回血，記得去【矮人食堂】吃黑麥麵包補血，或至【商城】強化防具再戰！
          </div>
          <button class="modal-close-btn" onclick="App.closeModalAndLobby()">返回營地休養</button>
        </div>
      </div>
    `;
    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const closeModal = (e) => {
    if (e && e.target && e.target.id !== 'modal-overlay') return;
    document.getElementById('modal-root').innerHTML = '';
  };

  const closeModalAndLobby = () => {
    document.getElementById('modal-root').innerHTML = '';
    renderLobbyView();
  };

  // Toast Notification
  const showToast = (msg) => {
    const existing = document.getElementById('toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.style.cssText = `
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: #251b3d;
      border: 2px solid var(--gold);
      color: #fff;
      padding: 8px 16px;
      font-size: 12px;
      z-index: 2000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.7);
      animation: floatUp 0.3s ease-out;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  // Simulation & Debug Handlers (Strictly accessible by Admin / GM)
  const bindDebugToolbar = () => {
    const toolbar = document.getElementById('debug-toolbar');
    if (!state.isAdmin) {
      if (toolbar) toolbar.style.display = 'none';
      return;
    }
    if (toolbar) toolbar.style.display = 'flex';

    const safeBind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.onclick = fn;
    };

    safeBind('dbg-absent-1', () => simulateAbsence(1));
    safeBind('dbg-absent-3', () => simulateAbsence(3));
    safeBind('dbg-absent-7', () => simulateAbsence(7));
    safeBind('dbg-add-gold', () => {
      state.gold += 1000;
      updateHUD();
      saveState();
      showToast('🛡️ GM: 已注入 1,000 金幣！');
    });
    safeBind('dbg-damage-50', () => {
      state.currentHp = Math.max(1, state.currentHp - 50);
      updateHUD();
      saveState();
      renderLobbyView();
    });
    safeBind('dbg-full-heal', () => {
      state.currentHp = getHeroStats().maxHp;
      updateHUD();
      saveState();
      renderLobbyView();
      showToast('🛡️ GM: 生命值已完全恢復！');
    });
    safeBind('dbg-unlock-items', () => {
      // GM God-Mode Cheat: Unlock all weapons, armors, relics, max consumables, B15F
      (GAME_CONFIG.WEAPONS || []).forEach(w => {
        if (!state.ownedWeapons.includes(w.id)) state.ownedWeapons.push(w.id);
      });
      (GAME_CONFIG.ARMORS || []).forEach(a => {
        if (!state.ownedArmors.includes(a.id)) state.ownedArmors.push(a.id);
      });
      (GAME_CONFIG.RELICS || []).forEach(r => {
        if (!state.ownedRelics.includes(r.id)) state.ownedRelics.push(r.id);
      });
      state.inventory.potion = Math.max(state.inventory.potion || 0, 99);
      state.inventory.guard_scroll = Math.max(state.inventory.guard_scroll || 0, 99);
      state.gold = Math.max(state.gold, 9999);
      state.dungeonProgress = Math.max(state.dungeonProgress, 15);
      state.towerFloor = Math.max(state.towerFloor, 30);
      state.currentHp = getHeroStats().maxHp;
      updateHUD();
      saveState();
      renderLobbyView();
      showToast('🛡️ GM 神級特權：已解鎖全套史詩神兵裝備、99瓶聖水與深淵進度！');
    });
    safeBind('dbg-reset-save', () => {
      if (confirm('確定要重設當前帳號的本機遊戲進度嗎？')) {
        localStorage.removeItem(getStorageKey());
        state = getDefaultState();
        saveState();
        location.reload();
      }
    });
  };

  const simulateAbsence = (days) => {
    state.lastActiveTimestamp = Date.now() - (days * 86400000 + 1000);
    checkAbsence();
    updateHUD();
    renderLobbyView();
    showToast(`已模擬缺席 ${days} 天！觸發情勒語錄與扣血！`);
  };

  // Init
  const init = async () => {
    // Top HUD buttons
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.onclick = () => {
        AudioManager.toggleMute();
        updateHUD();
      };
    }
    const accBtn = document.getElementById('btn-account-open');
    if (accBtn) {
      accBtn.onclick = () => {
        renderLeaderboardModal();
      };
    }

    if (window.SupabaseClient) {
      await SupabaseClient.init();
    }

    // Enforce authentication gate: guest cannot play without login/signup
    if (!window.SupabaseClient || !SupabaseClient.isLoggedIn()) {
      setHUDVisible(false);
      renderAuthGateView('login');
      return;
    }

    // User is authenticated: restore profile and launch dungeon camp
    setHUDVisible(true);
    loadState();
    if (SupabaseClient.isAdmin()) {
      state.isAdmin = true;
    }
    await SupabaseClient.syncFromCloud();
    checkAbsence();
    updateHUD();
    renderLobbyView();
    bindDebugToolbar();

    // Ticker for timed buffs & leave pass every second
    setInterval(() => {
      if (window.SupabaseClient && SupabaseClient.isLoggedIn()) {
        updateHUD();
      }
    }, 1000);
  };

  return {
    init,
    renderAuthGateView,
    handleGateLogin,
    handleGateSignup,
    renderLobby: renderLobbyView,
    renderDungeonSelect: renderDungeonSelectView,
    renderShopView,
    renderCodexView,
    startDungeonBoss,
    startTowerMode,
    startDojoMode,
    showDojoSelectModal,
    startReviewMode,
    toggleBookmark,
    toggleBookmarkInModal,
    continueAfterCorrection,
    speakWord,
    selectPos,
    selectMeaning,
    answerType2,
    typeSpellingLetter,
    backspaceSpelling,
    answerType4,
    speakCurrentWord,
    useQuickPotion,
    retreatBattle,
    buyFood,
    buyLeavePass,
    buyItem,
    equipItem,
    buyConsumable,
    claimCheckin,
    showLotteryModal,
    spinLottery,
    changeHeroName,
    exportSyncCode,
    importSyncCode,
    closeModal,
    closeModalAndLobby,
    renderLeaderboardModal,
    showAuthModal,
    showClassSelectModal,
    selectHeroClass,
    startClassTrial,
    startAwakeningTrial,
    showAwakeningModal,
    selectGateClass,
    handleLogin,
    handleSignup,
    handleLogout,
    handleSaveSupabaseConfig,
    applyCloudProfile,
    saveState: (syncCloud) => saveState(syncCloud)
  };
})();

// Mobile & Desktop Lifecycle Cloud Sync
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && window.SupabaseClient && SupabaseClient.isLoggedIn() && window.App) {
    App.saveState(true);
  }
});

window.addEventListener('beforeunload', () => {
  if (window.SupabaseClient && SupabaseClient.isLoggedIn() && window.App) {
    App.saveState(true);
  }
});

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
