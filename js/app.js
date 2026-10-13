/**
 * Word Dungeon & Babel Tower - Main Application Controller
 * Full PWA logic, SRS algorithm, combat formula, persistence, dialogue, and UI routing.
 */

const App = (() => {
  const STORAGE_KEY = 'word_dungeon_save_v1';

  // Default State Factory (Ensures clean state isolation between accounts)
  const getDefaultState = (heroName = '單字勇者', heroClass = 'knight') => ({
    heroName: heroName,
    heroClass: heroClass || 'knight',
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

  // Toggle HUD and debug visibility (hidden during unauthenticated gate)
  const setHUDVisible = (visible) => {
    const hud = document.querySelector('.top-hud');
    const dbg = document.querySelector('.debug-toolbar');
    if (hud) hud.style.display = visible ? 'block' : 'none';
    if (dbg) dbg.style.display = visible ? 'flex' : 'none';
  };

  // Save & Load (Independent per user)
  const saveState = () => {
    try {
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(state));
      if (window.SupabaseClient && SupabaseClient.isLoggedIn()) {
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

    // Hero Class / Form Specialty Perks
    const heroClassId = state.heroClass || 'knight';
    const currentClass = GAME_CONFIG.HERO_CLASSES ? GAME_CONFIG.HERO_CLASSES.find(c => c.id === heroClassId) : null;
    let classGoldBonus = 0;
    if (currentClass && currentClass.bonus) {
      base.maxHp += currentClass.bonus.hp || 0;
      base.atk += currentClass.bonus.atk || 0;
      base.def += currentClass.bonus.def || 0;
      base.timeBonus += currentClass.bonus.timeBonus || 0;
      if (currentClass.bonus.goldMultiplier) {
        classGoldBonus = currentClass.bonus.goldMultiplier;
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

  // SRS Weighted Question Selection
  const pickVocab = (tier) => {
    globalTurnCounter++;
    const pool = VOCAB_DATABASE.filter(v => v.tier === tier);
    if (pool.length === 0) return VOCAB_DATABASE[0];

    const weightedList = pool.map(item => {
      const s = state.vocabStats[item.id] || { seen: 0, correct: 0, wrong: 0, streak: 0, lastTurn: 0 };
      let weight = 100;

      if (s.seen === 0) {
        weight = 100; // Highest priority for brand new words
      } else if (s.wrong > 0 && s.streak < 3) {
        weight = Math.min(85, Math.max(40, 55 + s.wrong * 10 - s.streak * 8)); // Mistakes
      } else {
        weight = Math.max(8, Math.round(28 / (1 + 0.5 * s.correct))); // Mastered retention floor
      }

      // 3-turn cooldown to avoid immediate repeats
      if (s.lastTurn > 0 && (globalTurnCounter - s.lastTurn) <= 3) {
        weight *= 0.05;
      }

      return { item, weight };
    });

    const totalWeight = weightedList.reduce((acc, cur) => acc + cur.weight, 0);
    let rand = Math.random() * totalWeight;

    for (const entry of weightedList) {
      rand -= entry.weight;
      if (rand <= 0) {
        // Record last turn
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

  // Build 4 Question Types
  const generateQuestion = (tier) => {
    const vocab = pickVocab(tier);
    // Randomly pick question type 1 to 4
    const type = Math.floor(Math.random() * 4) + 1;

    let qData = {
      type: type,
      vocab: vocab,
      resolved: false
    };

    if (type === 1) {
      // Type 1: Dual Choice POS + Meaning
      const posOptions = ['n.', 'v.', 'adj.', 'adv.'];
      const meaningChoices = [vocab.meaning, ...vocab.distractorsMeaning].sort(() => Math.random() - 0.5);
      qData.posOptions = posOptions;
      qData.meaningChoices = meaningChoices;
      qData.correctPos = vocab.pos;
      qData.correctMeaning = vocab.meaning;
      qData.userSelectedPos = null;
      qData.userSelectedMeaning = null;
    } else if (type === 2) {
      // Type 2: Sentence Cloze
      qData.choices = [...vocab.sentenceChoices].sort(() => Math.random() - 0.5);
      qData.correctAnswer = vocab.sentenceTarget;
    } else if (type === 3) {
      // Type 3: Spelling Fill-in
      qData.lettersPool = [...vocab.spellingPool].sort(() => Math.random() - 0.5);
      qData.neededLetters = vocab.spellingMissing;
      qData.userTypedLetters = [];
    } else if (type === 4) {
      // Type 4: Context Q&A
      qData.qaQuestion = vocab.qaQuestion;
      qData.choices = vocab.qaChoices;
      qData.correctIndex = vocab.qaCorrect;
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
      <!-- Hero Camp Stage Card -->
      <div class="pixel-box hero-stage-card">
        <div class="avatar-wrapper" onclick="App.showClassSelectModal()" style="cursor:pointer;" title="點擊切換英雄型態">
          ${PixelSprites.renderHero(heroExpression, weaponTier, armorTier, relicTier, state.heroClass || 'knight')}
        </div>

        <div class="hero-class-bar">
          <button class="hero-class-switch-btn" onclick="App.showClassSelectModal()">
            ${PixelSprites.icon('crown', 14)}
            <span>型態：${(GAME_CONFIG.HERO_CLASSES ? GAME_CONFIG.HERO_CLASSES.find(c => c.id === (state.heroClass || 'knight')) : null)?.name || '聖堂聖騎士'}</span>
            <span style="color:var(--gold); font-size:10px;">[切換]</span>
          </button>
        </div>

        <div class="hero-speech-bubble">
          <div class="speech-pointer"></div>
          <div>${heroSpeechText}</div>
        </div>

        <div class="hero-stats-grid">
          <div class="hero-stat-cell">
            <span style="color:#ff6666;">${PixelSprites.icon('heart', 14)} 最大生命</span>
            <span class="hero-stat-val">${stats.maxHp} HP</span>
          </div>
          <div class="hero-stat-cell">
            <span style="color:#ffcc44;">${PixelSprites.icon('sword', 14)} 總攻擊力</span>
            <span class="hero-stat-val">${stats.atk} ATK</span>
          </div>
          <div class="hero-stat-cell">
            <span style="color:#44ddff;">${PixelSprites.icon('shield', 14)} 總防禦力</span>
            <span class="hero-stat-val">${stats.def} DEF</span>
          </div>
        </div>
      </div>

      <!-- Main Dual Game Modes -->
      <div class="modes-grid">
        <button class="pixel-btn-mode mode-btn-tower" id="btn-mode-tower">
          ${PixelSprites.icon('tower', 28)}
          <div>挑戰登塔模式</div>
          <div class="mode-desc">1000層通天塔・5分升層</div>
          <span style="font-size:11px; color:#4fe3ff;">目前進度: ${state.towerFloor}F (${state.towerPoints}/5點)</span>
        </button>

        <button class="pixel-btn-mode mode-btn-dungeon" id="btn-mode-dungeon">
          ${PixelSprites.icon('skull', 28)}
          <div>地下城討伐戰</div>
          <div class="mode-desc">15大固定Boss・耐戰高題量</div>
          <span style="font-size:11px; color:#ff9999;">目前開放至: B${state.dungeonProgress}F</span>
        </button>
      </div>

      <!-- Secondary Hub Navigation -->
      <div class="hub-sub-grid">
        <button class="pixel-btn-sub" id="btn-open-tavern">
          ${PixelSprites.icon('meat', 20)}
          <span>矮人食堂</span>
        </button>
        <button class="pixel-btn-sub" id="btn-open-shop">
          ${PixelSprites.icon('backpack', 20)}
          <span>公會商城</span>
        </button>
        <button class="pixel-btn-sub" id="btn-open-codex">
          ${PixelSprites.icon('scroll', 20)}
          <span>圖鑑錯題</span>
        </button>
        <button class="pixel-btn-sub" id="btn-open-checkin">
          ${PixelSprites.icon('calendar', 20)}
          <span>七日簽到</span>
        </button>
        <button class="pixel-btn-sub btn-lottery-highlight" id="btn-open-lottery">
          ${PixelSprites.icon('dice', 20)}
          <span style="color:#ffd700; font-weight:bold;">命運轉盤</span>
        </button>
      </div>

      <!-- Daily Habit & Frequent Practice Card -->
      <div class="pixel-box daily-goals-card">
        <div class="card-title-row">
          <span>${PixelSprites.icon('star', 14)} 每日勤學目標</span>
          <span>今日答對: ${state.dailyGoals.correct} 題</span>
        </div>

        <div class="goal-item">
          <span>【今日熱身】累計答對 10 題 (25 G)</span>
          <button class="claim-btn" id="claim-goal-0" ${state.dailyGoals.correct >= 10 && !state.dailyGoals.claimed[0] ? '' : 'disabled'}>
            ${state.dailyGoals.claimed[0] ? '已領取' : '領取'}
          </button>
        </div>

        <div class="goal-item">
          <span>【穩定精進】累計答對 25 題 (45 G + 聖水)</span>
          <button class="claim-btn" id="claim-goal-1" ${state.dailyGoals.correct >= 25 && !state.dailyGoals.claimed[1] ? '' : 'disabled'}>
            ${state.dailyGoals.claimed[1] ? '已領取' : '領取'}
          </button>
        </div>

        <div class="goal-item">
          <span>【今日達標】累計答對 45 題 (80 G + 護樓卷)</span>
          <button class="claim-btn" id="claim-goal-2" ${state.dailyGoals.correct >= 45 && !state.dailyGoals.claimed[2] ? '' : 'disabled'}>
            ${state.dailyGoals.claimed[2] ? '已領取' : '領取'}
          </button>
        </div>

        <div style="font-size:11px; color:#a090b8; text-align:center; margin-top:2px;">
          ${PixelSprites.icon('coin', 12)} 勤學無限賞：每答對 10 題贈 +15 G (目前進度: ${state.endlessPracticeCounter}/10)
        </div>
      </div>
    `;

    setMainView(html);
    bindLobbyEvents();
  };

  const bindLobbyEvents = () => {
    document.getElementById('btn-mode-tower').onclick = () => startTowerMode();
    document.getElementById('btn-mode-dungeon').onclick = () => renderDungeonSelectView();
    document.getElementById('btn-open-tavern').onclick = () => renderShopView('food');
    document.getElementById('btn-open-shop').onclick = () => renderShopView('equip');
    document.getElementById('btn-open-codex').onclick = () => renderCodexView('bestiary');
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
          <div>${q.vocab.sentence.replace('______', '<span class="sentence-blank">______</span>')}</div>
          <div class="sentence-zh-hint">${q.vocab.sentenceZh}</div>
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

    const html = `
      <div class="battle-arena-wrapper">
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
        <div class="duel-stage ${battle.mode === 'dungeon' ? 'stage-medieval-dungeon' : 'stage-medieval-tower'}" id="duel-stage">
          <div class="medieval-arena-backdrop">
            ${PixelSprites.renderMedievalBackdrop(battle.mode, battle.stageId, state.towerFloor)}
          </div>

          <!-- Hero Unit -->
          <div class="fighter-unit" id="hero-unit">
            <div id="hero-floating-box"></div>
            <div class="fighter-name-bar">${state.heroName}</div>
            <div class="fighter-mini-hp">
              <div class="mini-hp-fill" style="width: ${(state.currentHp / heroStats.maxHp) * 100}%;"></div>
            </div>
            ${PixelSprites.renderHero(heroExpression, heroWeapon ? heroWeapon.tier : 1, heroArmor ? heroArmor.tier : 1, heroRelic ? heroRelic.tier : 0, state.heroClass || 'knight')}
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
            <span class="question-type-badge">題型 ${q.type}</span>
            <button class="audio-btn" onclick="App.speakCurrentWord()">
              ${PixelSprites.icon('speaker', 14)} <span>聽發音</span>
            </button>
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

    if (battle.mode === 'dungeon') {
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

    if (battle.mode === 'dungeon') {
      if (state.currentHp <= 0) {
        setTimeout(() => onCombatDefeat(), 500);
      } else {
        setTimeout(() => loadNextQuestion(), 1000);
      }
    } else {
      // Tower Mode
      state.towerPoints = Math.max(-1, state.towerPoints - 1);

      if (state.towerPoints < 0 || state.currentHp <= 0) {
        // Drop floor crisis!
        handleTowerDropFloor();
      } else {
        setTimeout(() => loadNextQuestion(), 1000);
      }
    }
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

    setupTowerFloorMonster();
    setTimeout(() => loadNextQuestion(), 1000);
  };

  // Dungeon Victory
  const onDungeonVictory = () => {
    battle.active = false;
    clearInterval(battle.timerId);
    AudioManager.play('victory');

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
      const curClassObj = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === (state.heroClass || 'knight'));

      itemsHtml += `
        <div class="pixel-box shop-fitting-preview">
          <div class="fitting-sprite-box">
            ${PixelSprites.renderHero('happy', wTier, aTier, rTier, state.heroClass || 'knight')}
          </div>
          <div class="fitting-info-col">
            <div class="fitting-title-row">
              <span class="fitting-hero-title">${state.heroName}・【${curClassObj?.name || '聖堂聖騎士'}】</span>
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
  const renderCodexView = (activeTab = 'bestiary') => {
    let contentHtml = '';

    if (activeTab === 'bestiary') {
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
    } else {
      // Mistake Codex
      const mistakeList = Object.keys(state.vocabStats).filter(id => state.vocabStats[id].wrong > 0);

      if (mistakeList.length === 0) {
        contentHtml = `
          <div style="text-align:center; padding:30px; color:var(--text-muted);">
            ${PixelSprites.icon('check', 24)}
            <div style="margin-top:10px;">目前沒有任何錯題！真厲害！</div>
          </div>
        `;
      } else {
        const cards = mistakeList.map(id => {
          const vocab = VOCAB_DATABASE.find(v => v.id === id);
          if (!vocab) return '';
          const s = state.vocabStats[id];
          return `
            <div class="shop-item-card">
              <div class="shop-item-left">
                <button class="audio-btn" onclick="AudioManager.speak('${vocab.word}')">
                  ${PixelSprites.icon('speaker', 14)}
                </button>
                <div class="shop-item-info">
                  <div class="shop-item-title">${vocab.word} <span style="font-size:11px; color:#ffdd88;">(${vocab.pos})</span></div>
                  <div class="shop-item-desc">${vocab.meaning}</div>
                  <div style="font-size:10px; color:#ff8888;">累計答錯: ${s.wrong} 次 | 答對: ${s.correct} 次</div>
                </div>
              </div>
            </div>
          `;
        }).join('');
        contentHtml = `<div class="items-list-container">${cards}</div>`;
      }
    }

    const html = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="hud-btn" onclick="App.renderLobby()">&lt; 返回營地</button>
        <div style="font-weight:bold; color:var(--gold);">📖 圖鑑與單字錯題本</div>
      </div>

      <div class="tabs-header">
        <button class="tab-btn ${activeTab === 'bestiary' ? 'active' : ''}" onclick="App.renderCodexView('bestiary')">魔物圖鑑</button>
        <button class="tab-btn ${activeTab === 'mistakes' ? 'active' : ''}" onclick="App.renderCodexView('mistakes')">錯題複習本</button>
      </div>

      ${contentHtml}
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
          const isMe = userObj && userObj.id === c.id;
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

    if (!isFromSupabase) {
      // Local fallback rivals
      rivals = [...GAME_CONFIG.INITIAL_LEADERBOARD];
      const playerEntry = {
        name: `${state.heroName} (你)`,
        floor: state.towerRecordFloor,
        streak: state.streak,
        isSelf: true,
        quote: '一步一步登上 1000 樓！'
      };
      rivals.push(playerEntry);
      rivals.sort((a, b) => b.floor - a.floor);
    }

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

    const isLoggedIn = window.SupabaseClient && SupabaseClient.isLoggedIn();
    const currentUser = isLoggedIn ? SupabaseClient.getUser() : null;

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('trophy', 16)} 通天塔勇者全球排行榜</div>

          <!-- Supabase Auth Status Banner -->
          <div style="background:#191428; border:1px solid #4a386c; padding:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              ${isLoggedIn ? `
                <div style="font-size:11px; color:#77ffaa; font-weight:bold;">👑 雲端連線：${currentUser.email}</div>
                <div style="font-size:10px; color:#a090b8;">進度自動即時同步至 Supabase</div>
              ` : `
                <div style="font-size:11px; color:#caa0ff; font-weight:bold;">⚡ 訪客模式 (本地存檔)</div>
                <div style="font-size:10px; color:#a090b8;">登入帳號即可參與即時全球玩家競賽！</div>
              `}
            </div>
            <div>
              ${isLoggedIn ? `
                <button class="hud-btn" style="padding:3px 6px;" onclick="App.handleLogout()">登出</button>
              ` : `
                <button class="claim-btn" onclick="App.showAuthModal('login')">登入 / 註冊</button>
              `}
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
                  <label class="auth-label">冒險者電子信箱 (Email)</label>
                  <input type="email" id="gate-email" class="auth-input" placeholder="hero@dungeon.com" required autocomplete="email">
                </div>

                <div class="auth-form-group">
                  <label class="auth-label">通行密碼 (Password)</label>
                  <input type="password" id="gate-password" class="auth-input" placeholder="請輸入通行密碼" required autocomplete="current-password">
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
                  <label class="auth-label">選擇初始職業型態 (中世紀英雄姿態)</label>
                  <div class="gate-class-selector-grid" id="gate-class-grid">
                    ${(GAME_CONFIG.HERO_CLASSES || []).map(cls => `
                      <div class="gate-class-card ${cls.id === gateSelectedHeroClass ? 'selected' : ''}" id="gate-card-${cls.id}" onclick="App.selectGateClass('${cls.id}')">
                        <div class="gate-class-mini-sprite">
                          ${PixelSprites.renderHero('happy', 1, 1, 0, cls.id)}
                        </div>
                        <div class="gate-class-title">${cls.name}</div>
                        <div class="gate-class-badge">${cls.badge}</div>
                      </div>
                    `).join('')}
                  </div>
                  <div id="gate-class-detail" class="gate-class-detail-box">
                    ${(() => {
                      const cur = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === gateSelectedHeroClass) || (GAME_CONFIG.HERO_CLASSES || [])[0];
                      return cur ? `
                        <div class="gate-detail-name">【${cur.name}】${cur.title}</div>
                        <div class="gate-detail-bonus">⚡ 初始加成：${cur.bonusDesc}</div>
                        <div class="gate-detail-desc">${cur.desc}</div>
                      ` : '';
                    })()}
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
    const email = document.getElementById('gate-email')?.value?.trim();
    const password = document.getElementById('gate-password')?.value;
    const btn = document.getElementById('btn-gate-submit');

    if (!email || !password) {
      alert('請填寫完整 Email 與通行密碼！');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerText = '驗證冒險者勳章中...';
    }

    try {
      showToast('正在驗證冒險者資料...');
      await SupabaseClient.signIn(email, password);

      setHUDVisible(true);
      loadState();
      await SupabaseClient.syncFromCloud();
      checkAbsence();
      updateHUD();
      renderLobbyView();
      bindDebugToolbar();
      showToast(`登入成功！歡迎回到地下城，勇者 ${state.heroName}！`);
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
    const chosenClass = gateSelectedHeroClass || 'knight';
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
      const res = await SupabaseClient.signUp(email, password, username, heroName);

      if (SupabaseClient.isLoggedIn()) {
        state = getDefaultState(heroName, chosenClass);
        state.heroClass = chosenClass;
        saveState();
        await SupabaseClient.syncToCloud(state);
        setHUDVisible(true);
        checkAbsence();
        updateHUD();
        renderLobbyView();
        bindDebugToolbar();
        showToast(`註冊成功！歡迎踏入單字地下城，${state.heroName}！`);
      } else {
        alert('註冊成功！若有啟用信箱確認機制，請前往信箱點擊確認信後，切換至「冒險者登入」即可啟程！');
        renderAuthGateView('login');
      }
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
              <div style="font-size:12px; color:var(--text-muted);">輸入您的帳號密碼登入，雲端進度與排行榜將自動同步：</div>
              <input type="email" id="auth-email" placeholder="電子郵件 (Email)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="password" id="auth-password" placeholder="密碼 (Password)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <button class="claim-btn" style="padding:8px;" onclick="App.handleLogin()">登入遊戲</button>
            ` : activeTab === 'signup' ? `
              <div style="font-size:12px; color:var(--text-muted);">註冊新帳號，將自動在 Supabase 建立專屬個人檔案與即時競賽排名：</div>
              <input type="email" id="auth-email" placeholder="電子郵件 (Email)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="password" id="auth-password" placeholder="密碼 (至少 6 位數)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="text" id="auth-username" placeholder="使用者帳號 (例如: hero99)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="text" id="auth-heroname" value="${state.heroName}" placeholder="勇者稱號 (例如: 單字大師)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">

              <div style="font-size:11px; color:#ffd700; margin-top:4px;">選擇初始職業型態：</div>
              <div class="gate-class-selector-grid" id="modal-class-grid">
                ${(GAME_CONFIG.HERO_CLASSES || []).map(cls => `
                  <div class="gate-class-card ${cls.id === gateSelectedHeroClass ? 'selected' : ''}" id="modal-card-${cls.id}" onclick="App.selectGateClass('${cls.id}')">
                    <div class="gate-class-mini-sprite">
                      ${PixelSprites.renderHero('happy', 1, 1, 0, cls.id)}
                    </div>
                    <div class="gate-class-title">${cls.name}</div>
                    <div class="gate-class-badge">${cls.badge}</div>
                  </div>
                `).join('')}
              </div>
              <div id="modal-class-detail" class="gate-class-detail-box">
                ${(() => {
                  const cur = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === gateSelectedHeroClass) || (GAME_CONFIG.HERO_CLASSES || [])[0];
                  return cur ? `
                    <div class="gate-detail-name">【${cur.name}】${cur.title}</div>
                    <div class="gate-detail-bonus">⚡ 初始加成：${cur.bonusDesc}</div>
                    <div class="gate-detail-desc">${cur.desc}</div>
                  ` : '';
                })()}
              </div>

              <button class="claim-btn" style="padding:8px;" onclick="App.handleSignup()">建立帳號並登入</button>
            ` : `
              <div style="font-size:12px; color:var(--text-muted);">
                填入您的 Supabase 專案網址與 Public Anon Key（可於 Supabase Dashboard -> Project Settings -> API 複製）：
              </div>
              <input type="text" id="cfg-url" value="${savedUrl}" placeholder="Project URL (https://xxxx.supabase.co)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <input type="password" id="cfg-key" value="${savedKey}" placeholder="Anon public Key (eyJhbGciOi...)" style="background:#141020; border:1px solid #48396e; color:#fff; padding:8px;">
              <button class="claim-btn" style="padding:8px;" onclick="App.handleSaveSupabaseConfig()">儲存連線設定</button>
              <div style="font-size:11px; color:#88ddff; background:#122030; padding:6px; border:1px solid #204060;">
                提示：專案資料夾內已備妥 <code>supabase/schema.sql</code>，在 Supabase SQL Editor 貼上執行即可完成 profiles 表與 RLS 權限建置！
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
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    if (!email || !password) {
      alert('請輸入 Email 與密碼！');
      return;
    }

    try {
      showToast('正在登入 Supabase...');
      await SupabaseClient.signIn(email, password);
      loadState();
      await SupabaseClient.syncFromCloud();
      showToast('登入成功！雲端進度已同步！');
      closeModal();
      setHUDVisible(true);
      checkAbsence();
      updateHUD();
      renderLobbyView();
    } catch (err) {
      alert('登入失敗: ' + (err.message || '請確認帳號密碼或 Supabase 設定'));
    }
  };

  const handleSignup = async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const username = document.getElementById('auth-username').value;
    const heroname = document.getElementById('auth-heroname').value;

    if (!email || !password || !username) {
      alert('請填寫完整資訊！');
      return;
    }

    try {
      showToast('正在註冊帳號...');
      await SupabaseClient.signUp(email, password, username, heroname);
      if (SupabaseClient.isLoggedIn()) {
        const chosenClass = gateSelectedHeroClass || 'knight';
        state = getDefaultState(heroname || '單字勇者', chosenClass);
        state.heroClass = chosenClass;
        saveState();
        await SupabaseClient.syncToCloud(state);
        showToast('註冊成功！已自動登入！');
        closeModal();
        setHUDVisible(true);
        checkAbsence();
        updateHUD();
        renderLobbyView();
      } else {
        alert('註冊成功！若有啟用信箱確認，請前往信箱驗證後登入。');
        closeModal();
        renderAuthGateView('login');
      }
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
    if (data.inventory) state.inventory = data.inventory;
    if (data.dungeon_progress) state.dungeonProgress = data.dungeon_progress;
    if (data.dungeon_first_cleared) state.dungeonFirstCleared = data.dungeon_first_cleared;
    if (data.vocab_stats) state.vocabStats = data.vocab_stats;
    if (data.bestiary_unlocked) state.bestiaryUnlocked = data.bestiary_unlocked;
    if (data.leave_pass_expires) state.leavePassExpires = data.leave_pass_expires;
    if (data.hero_class) state.heroClass = data.hero_class;
    if (data.inventory && data.inventory._heroClass) state.heroClass = data.inventory._heroClass;
    if (data.inventory && data.inventory._lotteryPity !== undefined) state.lotteryPity = data.inventory._lotteryPity;

    saveState();
    updateHUD();
    renderLobbyView();
    showToast(`雲端存檔已同步！歡迎勇者 ${state.heroName}！`);
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

  // Modal: Select Medieval Hero Class / Character Form
  const showClassSelectModal = () => {
    const currentClassId = state.heroClass || 'knight';
    const heroWeapon = GAME_CONFIG.EQUIPMENT.weapons.find(w => w.id === state.equippedWeapon);
    const heroArmor = GAME_CONFIG.EQUIPMENT.armors.find(a => a.id === state.equippedArmor);
    const heroRelic = GAME_CONFIG.EQUIPMENT.relics.find(r => r.id === state.equippedRelic);
    const wTier = heroWeapon ? heroWeapon.tier : 1;
    const aTier = heroArmor ? heroArmor.tier : 1;
    const rTier = heroRelic ? heroRelic.tier : 0;

    const cardsHtml = (GAME_CONFIG.HERO_CLASSES || []).map(cls => {
      const isSelected = cls.id === currentClassId;
      return `
        <div class="hero-class-card ${isSelected ? 'selected' : ''}" onclick="App.selectHeroClass('${cls.id}')">
          <div class="class-preview-box">
            ${PixelSprites.renderHero('happy', wTier, aTier, rTier, cls.id)}
          </div>
          <div class="class-info-box">
            <div class="class-title-row">
              <span class="class-name-text">${cls.name} <span style="font-size:10px; color:var(--text-muted);">(${cls.title})</span></span>
              <span class="class-badge-pill">${cls.badge}</span>
            </div>
            <div class="class-desc-text">${cls.desc}</div>
            <div class="class-perk-text">⚡ 特性加成：${cls.bonusDesc}</div>
          </div>
          <div>
            <button class="claim-btn" style="padding:6px 10px; font-size:11px;" onclick="event.stopPropagation(); App.selectHeroClass('${cls.id}')">
              ${isSelected ? '當前型態' : '選擇出戰'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    const modalHtml = `
      <div class="modal-overlay" id="modal-overlay" onclick="App.closeModal(event)">
        <div class="modal-dialog modal-dialog-gold" style="max-width:500px;" onclick="event.stopPropagation()">
          <div class="modal-title">${PixelSprites.icon('crown', 16)} 選擇勇者職業型態 (中世紀英雄姿態)</div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
            自由切換中世紀戰鬥姿態！每種型態擁有獨特的點陣外觀、武器裝束與專屬能力加成：
          </div>
          <div class="items-list-container" style="max-height:360px; display:flex; flex-direction:column; gap:8px;">
            ${cardsHtml}
          </div>
          <button class="modal-close-btn" onclick="App.closeModal()">關閉</button>
        </div>
      </div>
    `;

    document.getElementById('modal-root').innerHTML = modalHtml;
  };

  const selectHeroClass = (classId) => {
    const classObj = (GAME_CONFIG.HERO_CLASSES || []).find(c => c.id === classId);
    if (!classObj) return;

    state.heroClass = classId;
    saveState();
    updateHUD();
    renderLobbyView();
    closeModal();
    showToast(`已切換職業姿態為【${classObj.name}】！特性：${classObj.bonusDesc}`);
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

  // Simulation & Debug Handlers
  const bindDebugToolbar = () => {
    document.getElementById('dbg-absent-1').onclick = () => simulateAbsence(1);
    document.getElementById('dbg-absent-3').onclick = () => simulateAbsence(3);
    document.getElementById('dbg-absent-7').onclick = () => simulateAbsence(7);
    document.getElementById('dbg-add-gold').onclick = () => {
      state.gold += 100;
      updateHUD();
      saveState();
      showToast('已增加 100 金幣！');
    };
    document.getElementById('dbg-damage-50').onclick = () => {
      state.currentHp = Math.max(1, state.currentHp - 50);
      updateHUD();
      saveState();
      renderLobbyView();
    };
    document.getElementById('dbg-full-heal').onclick = () => {
      state.currentHp = getHeroStats().maxHp;
      updateHUD();
      saveState();
      renderLobbyView();
    };
    document.getElementById('dbg-reset-save').onclick = () => {
      if (confirm('確定要重設當前帳號的本機遊戲進度嗎？')) {
        localStorage.removeItem(getStorageKey());
        state = getDefaultState();
        saveState();
        location.reload();
      }
    };
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
    selectGateClass,
    handleLogin,
    handleSignup,
    handleLogout,
    handleSaveSupabaseConfig,
    applyCloudProfile
  };
})();

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
