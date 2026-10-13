/**
 * Word Dungeon & Babel Tower - Supabase Client & Auth Service
 * 負責 Supabase 帳號註冊、強制自動登入、免驗證信、保持登入狀態、Admin 特權管理與雲端進度同步
 */

const SupabaseClient = (() => {
  let client = null;
  let currentUser = null;

  const STORAGE_SESSION_KEY = 'word_dungeon_auth_session';

  // Admin Master Credentials
  const ADMIN_CREDENTIALS = {
    username: 'tangghgh',
    password: 'tang921118',
    email: 'tangghgh@worddungeon.game',
    heroName: '總管大賢者 tangghgh'
  };

  const init = async () => {
    // 1. Check local persistent session first (保持登入機制)
    try {
      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.user) {
          currentUser = parsed.user;
          if (currentUser.username === ADMIN_CREDENTIALS.username || currentUser.email === ADMIN_CREDENTIALS.email) {
            currentUser.isAdmin = true;
          }
        }
      }
    } catch (e) {
      console.warn('Load saved auth session warning:', e);
    }

    if (!window.supabase || !SUPABASE_CONFIG.isConfigured()) {
      return Boolean(currentUser);
    }

    try {
      const url = SUPABASE_CONFIG.getUrl();
      const key = SUPABASE_CONFIG.getAnonKey();
      client = window.supabase.createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });

      // Check remote Supabase session
      const { data } = await client.auth.getSession();
      if (data && data.session && data.session.user) {
        currentUser = data.session.user;
        const metaUser = currentUser.user_metadata?.username || '';
        if (metaUser === ADMIN_CREDENTIALS.username || currentUser.email === ADMIN_CREDENTIALS.email) {
          currentUser.isAdmin = true;
        }
        // Sync local storage session
        saveLocalSession(currentUser);
      }

      client.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          currentUser = session.user;
          const metaUser = currentUser.user_metadata?.username || '';
          if (metaUser === ADMIN_CREDENTIALS.username || currentUser.email === ADMIN_CREDENTIALS.email) {
            currentUser.isAdmin = true;
          }
          saveLocalSession(currentUser);
        } else if (event === 'SIGNED_OUT') {
          currentUser = null;
          localStorage.removeItem(STORAGE_SESSION_KEY);
        }
      });

      return Boolean(currentUser);
    } catch (e) {
      console.error('Supabase init failed', e);
      return Boolean(currentUser);
    }
  };

  const saveLocalSession = (user) => {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.username || user.email?.split('@')[0],
          hero_name: user.user_metadata?.hero_name || user.hero_name || '單字勇者',
          isAdmin: Boolean(user.isAdmin)
        },
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Save local session failed', e);
    }
  };

  const getClient = () => {
    if (!client && window.supabase && SUPABASE_CONFIG.isConfigured()) {
      client = window.supabase.createClient(SUPABASE_CONFIG.getUrl(), SUPABASE_CONFIG.getAnonKey(), {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    }
    return client;
  };

  const isConfigured = () => {
    return SUPABASE_CONFIG.isConfigured();
  };

  const isLoggedIn = () => {
    return Boolean(currentUser);
  };

  const getUser = () => {
    return currentUser;
  };

  const isAdmin = () => {
    if (!currentUser) return false;
    if (currentUser.isAdmin) return true;
    const u = currentUser.user_metadata?.username || currentUser.username || '';
    const e = currentUser.email || '';
    return (u.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() || e.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase());
  };

  // Helper: Format username or email into a valid email
  const normalizeEmail = (accountInput) => {
    const trimmed = (accountInput || '').trim();
    if (trimmed.includes('@')) {
      return trimmed;
    }
    // If entered as username, format as pseudo-email for Supabase Auth
    return `${trimmed.toLowerCase()}@worddungeon.player`;
  };

  // Sign In with Account (Username or Email) & Password
  const signIn = async (accountOrEmail, password) => {
    const rawAccount = (accountOrEmail || '').trim();
    const cleanPassword = (password || '').trim();

    // Check Master Admin direct login
    if (
      (rawAccount.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() || 
       rawAccount.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()) &&
      cleanPassword === ADMIN_CREDENTIALS.password
    ) {
      currentUser = {
        id: 'admin_tangghgh',
        email: ADMIN_CREDENTIALS.email,
        username: ADMIN_CREDENTIALS.username,
        hero_name: ADMIN_CREDENTIALS.heroName,
        isAdmin: true
      };
      saveLocalSession(currentUser);
      await syncFromCloud();
      return { user: currentUser };
    }

    const formattedEmail = normalizeEmail(rawAccount);
    const c = getClient();
    if (!c) {
      // Local fallback session
      currentUser = {
        id: 'local_' + btoa(rawAccount).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12),
        email: formattedEmail,
        username: rawAccount.split('@')[0],
        hero_name: '冒險者 ' + rawAccount.split('@')[0],
        isAdmin: false
      };
      saveLocalSession(currentUser);
      return { user: currentUser };
    }

    try {
      const { data, error } = await c.auth.signInWithPassword({
        email: formattedEmail,
        password: cleanPassword
      });

      if (error) {
        // If error is "Email not confirmed", auto-bypass to satisfy user request!
        if (error.message && error.message.toLowerCase().includes('confirm')) {
          console.warn('Auto-bypassing email confirmation for player:', formattedEmail);
          currentUser = {
            id: 'confirmed_' + btoa(formattedEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 14),
            email: formattedEmail,
            username: rawAccount.split('@')[0],
            hero_name: '單字勇者',
            isAdmin: false
          };
          saveLocalSession(currentUser);
          await syncFromCloud();
          return { user: currentUser };
        }
        throw error;
      }

      currentUser = data.user;
      if (rawAccount.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase()) {
        currentUser.isAdmin = true;
      }
      saveLocalSession(currentUser);
      await syncFromCloud();
      return data;
    } catch (err) {
      // Handle email not confirmed by setting graceful active local session
      if (err.message && err.message.toLowerCase().includes('confirm')) {
        currentUser = {
          id: 'user_' + btoa(formattedEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 14),
          email: formattedEmail,
          username: rawAccount.split('@')[0],
          hero_name: '單字勇者',
          isAdmin: false
        };
        saveLocalSession(currentUser);
        await syncFromCloud();
        return { user: currentUser };
      }
      throw err;
    }
  };

  // Sign Up: Register and then IMMEDIATELY FORCE SIGN IN so user is kept logged in!
  const signUp = async (accountOrEmail, password, username, heroName) => {
    const rawAccount = (accountOrEmail || '').trim();
    const cleanUsername = username ? username.trim() : rawAccount.split('@')[0];
    const cleanHeroName = heroName ? heroName.trim() : '單字勇者';
    const formattedEmail = normalizeEmail(rawAccount);

    // If registering as admin credentials
    if (
      cleanUsername.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() && 
      password === ADMIN_CREDENTIALS.password
    ) {
      currentUser = {
        id: 'admin_tangghgh',
        email: ADMIN_CREDENTIALS.email,
        username: ADMIN_CREDENTIALS.username,
        hero_name: ADMIN_CREDENTIALS.heroName,
        isAdmin: true
      };
      saveLocalSession(currentUser);
      return { user: currentUser };
    }

    const c = getClient();
    if (!c) throw new Error('Supabase 尚未設定 Project URL 與 Anon Key！');

    // 1. Send sign up request
    let signupData = null;
    try {
      const res = await c.auth.signUp({
        email: formattedEmail,
        password: password,
        options: {
          data: {
            username: cleanUsername,
            hero_name: cleanHeroName
          }
        }
      });
      if (res.error) {
        // If user already registered, proceed to sign in directly!
        if (res.error.message && res.error.message.toLowerCase().includes('already')) {
          console.log('User already registered, immediately signing in...');
        } else {
          throw res.error;
        }
      }
      signupData = res.data;
    } catch (err) {
      if (!err.message || !err.message.toLowerCase().includes('already')) {
        throw err;
      }
    }

    // 2. 強制先登入一次 (Force Sign In immediately after signup)
    try {
      const signInRes = await signIn(formattedEmail, password);
      currentUser = signInRes.user || currentUser;
    } catch (signInErr) {
      // If sign in fails due to email confirm check, bypass immediately!
      console.warn('Auto-login bypass for confirm email requirement:', signInErr);
      currentUser = {
        id: signupData?.user?.id || 'usr_' + Date.now(),
        email: formattedEmail,
        username: cleanUsername,
        hero_name: cleanHeroName,
        user_metadata: {
          username: cleanUsername,
          hero_name: cleanHeroName
        },
        isAdmin: false
      };
      saveLocalSession(currentUser);
    }

    // 3. Immediately upsert profile
    if (currentUser && c) {
      try {
        await c.from('profiles').upsert({
          id: currentUser.id,
          username: cleanUsername,
          hero_name: cleanHeroName,
          tower_floor: 1,
          tower_record_floor: 1,
          gold: 60,
          current_hp: 120,
          streak: 1,
          last_active_timestamp: Date.now()
        });
      } catch (upsertErr) {
        console.warn('Initial profile upsert notice:', upsertErr);
      }
    }

    return { user: currentUser };
  };

  // Sign Out
  const signOut = async () => {
    const c = getClient();
    if (c) {
      try {
        await c.auth.signOut();
      } catch (e) {
        console.warn('Sign out warning:', e);
      }
    }
    currentUser = null;
    localStorage.removeItem(STORAGE_SESSION_KEY);
  };

  // Download Profile from Supabase
  const syncFromCloud = async () => {
    if (!currentUser || !client) return;

    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        return;
      }

      if (data) {
        if (window.App && typeof window.App.applyCloudProfile === 'function') {
          window.App.applyCloudProfile(data);
        }
      }
    } catch (e) {
      console.warn('Sync from cloud exception:', e);
    }
  };

  // Upload current game state to Supabase
  const syncToCloud = async (state) => {
    if (!currentUser || !client) return;

    try {
      const payload = {
        id: currentUser.id,
        hero_name: state.heroName,
        tower_floor: state.towerFloor,
        tower_record_floor: Math.max(state.towerFloor, state.towerRecordFloor),
        tower_points: state.towerPoints,
        gold: state.gold,
        current_hp: state.currentHp,
        streak: state.streak,
        equipped_weapon: state.equippedWeapon,
        equipped_armor: state.equippedArmor,
        equipped_relic: state.equippedRelic,
        owned_weapons: state.ownedWeapons,
        owned_armors: state.ownedArmors,
        bookmarked_words: state.bookmarkedWords || [],
        mistake_words: state.mistakeWords || [],
        inventory: Object.assign({}, state.inventory, {
          _heroClass: state.heroClass || 'knight',
          _lotteryPity: state.lotteryPity || 0,
          _bookmarkedWords: state.bookmarkedWords || [],
          _mistakeWords: state.mistakeWords || []
        }),
        dungeon_progress: state.dungeonProgress,
        dungeon_first_cleared: state.dungeonFirstCleared,
        vocab_stats: state.vocabStats,
        bestiary_unlocked: state.bestiaryUnlocked,
        leave_pass_expires: state.leavePassExpires || 0,
        last_active_timestamp: state.lastActiveTimestamp || Date.now(),
        updated_at: new Date().toISOString()
      };

      const { error } = await client
        .from('profiles')
        .upsert(payload);

      if (error) {
        console.warn('Sync to cloud error:', error);
      }
    } catch (e) {
      console.warn('Sync to cloud exception:', e);
    }
  };

  // Fetch Global Leaderboard
  const fetchLeaderboard = async (limit = 30) => {
    const c = getClient();
    if (!c) return null;

    try {
      const { data, error } = await c
        .from('profiles')
        .select('id, username, hero_name, tower_record_floor, streak, equipped_weapon, updated_at')
        .order('tower_record_floor', { ascending: false })
        .order('streak', { ascending: false })
        .limit(limit);

      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  };

  return {
    init,
    isConfigured,
    isLoggedIn,
    getUser,
    isAdmin,
    signIn,
    signUp,
    signOut,
    syncFromCloud,
    syncToCloud,
    fetchLeaderboard
  };
})();
