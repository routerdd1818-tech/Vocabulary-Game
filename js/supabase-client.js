/**
 * Word Dungeon & Babel Tower - Supabase Client & Auth Service
 * 負責 Supabase 帳號註冊、強制自動登入、免驗證信、保持登入狀態、Admin 特權管理與雲端進度同步
 */

const SupabaseClient = (() => {
  let client = null;
  let currentUser = null;

  const STORAGE_SESSION_KEY = 'word_dungeon_auth_session';
  const STORAGE_SAVED_AUTH_KEY = 'word_dungeon_saved_auth';

  // Admin Master Credentials
  const ADMIN_CREDENTIALS = {
    username: 'tangghgh',
    password: 'tang921118',
    email: 'tangghgh@worddungeon.game',
    heroName: '總管大賢者 tangghgh'
  };

  const getSavedCredentials = () => {
    try {
      const data = localStorage.getItem(STORAGE_SAVED_AUTH_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Get saved credentials warning:', e);
    }
    return null;
  };

  const saveCredentials = (account, password) => {
    try {
      localStorage.setItem(STORAGE_SAVED_AUTH_KEY, JSON.stringify({
        account: (account || '').trim(),
        password: (password || '').trim(),
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Save credentials warning:', e);
    }
  };

  const clearSavedCredentials = () => {
    try {
      localStorage.removeItem(STORAGE_SAVED_AUTH_KEY);
    } catch (e) {}
  };

  const init = async () => {
    // 1. Initialize Supabase client if configured
    getClient();

    // 2. Check local persistent session first (保持登入機制)
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

    // 3. Check remote Supabase session & setup auth state listener
    if (client) {
      try {
        const { data } = await client.auth.getSession();
        if (data && data.session && data.session.user) {
          currentUser = data.session.user;
          const metaUser = currentUser.user_metadata?.username || '';
          if (metaUser === ADMIN_CREDENTIALS.username || currentUser.email === ADMIN_CREDENTIALS.email) {
            currentUser.isAdmin = true;
          }
          saveLocalSession(currentUser);
        }
      } catch (sessionErr) {
        console.warn('Get remote session warning:', sessionErr);
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
    }

    // 4. If no active session, auto-login using remembered credentials
    if (!currentUser) {
      const savedCreds = getSavedCredentials();
      if (savedCreds && savedCreds.account && savedCreds.password) {
        try {
          console.log('Auto-logging in with saved credentials for:', savedCreds.account);
          const res = await signIn(savedCreds.account, savedCreds.password, true);
          if (res && res.user) {
            currentUser = res.user;
          }
        } catch (autoErr) {
          console.warn('Auto-login from saved credentials notice:', autoErr);
        }
      }
    }

    return Boolean(currentUser);
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

  // Helper: Validate standard UUID v4 format
  const isValidUUID = (str) => {
    if (!str || typeof str !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
  };

  // Helper: Generate valid UUID v4
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Helper: Format username or email into a valid email
  const normalizeEmail = (accountInput) => {
    const trimmed = (accountInput || '').trim();
    if (trimmed.includes('@')) {
      return trimmed;
    }
    // If entered as username, format as pseudo-email for Supabase Auth with standard .com TLD
    return `${trimmed.toLowerCase()}@worddungeon.com`;
  };

  // Sign In with Account (Username or Email) & Password
  const signIn = async (accountOrEmail, password, remember = true) => {
    const rawAccount = (accountOrEmail || '').trim();
    const cleanPassword = (password || '').trim();

    // Check Master Admin direct login
    if (
      (rawAccount.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() || 
       rawAccount.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()) &&
      cleanPassword === ADMIN_CREDENTIALS.password
    ) {
      currentUser = {
        id: '00000000-0000-4000-a000-000000000001',
        email: ADMIN_CREDENTIALS.email,
        username: ADMIN_CREDENTIALS.username,
        hero_name: ADMIN_CREDENTIALS.heroName,
        isAdmin: true
      };
      if (remember) saveCredentials(rawAccount, cleanPassword);
      saveLocalSession(currentUser);
      await syncFromCloud();
      return { user: currentUser };
    }

    const c = getClient();
    if (!c) {
      // Local fallback session
      currentUser = {
        id: generateUUID(),
        email: normalizeEmail(rawAccount),
        username: rawAccount.split('@')[0],
        hero_name: '冒險者 ' + rawAccount.split('@')[0],
        isAdmin: false
      };
      if (remember) saveCredentials(rawAccount, cleanPassword);
      saveLocalSession(currentUser);
      return { user: currentUser };
    }

    // Determine login email: if username without @, check if profiles has _accountEmail in inventory
    let loginEmail = rawAccount;
    if (!rawAccount.includes('@')) {
      try {
        const { data: prof } = await c
          .from('profiles')
          .select('id, username, inventory')
          .ilike('username', rawAccount)
          .maybeSingle();

        if (prof && prof.inventory && prof.inventory._accountEmail) {
          loginEmail = prof.inventory._accountEmail;
        } else {
          loginEmail = normalizeEmail(rawAccount);
        }
      } catch (lookupErr) {
        loginEmail = normalizeEmail(rawAccount);
      }
    }

    try {
      const { data, error } = await c.auth.signInWithPassword({
        email: loginEmail,
        password: cleanPassword
      });

      if (error) {
        // If error is "Email not confirmed", auto-bypass to satisfy user request!
        if (error.message && error.message.toLowerCase().includes('confirm')) {
          console.warn('Auto-bypassing email confirmation for player:', loginEmail);
          let resolvedId = null;
          try {
            const { data: prof } = await c
              .from('profiles')
              .select('id')
              .ilike('username', rawAccount.split('@')[0])
              .maybeSingle();
            if (prof && isValidUUID(prof.id)) {
              resolvedId = prof.id;
            }
          } catch (e) {}

          currentUser = {
            id: resolvedId || generateUUID(),
            email: loginEmail,
            username: rawAccount.split('@')[0],
            hero_name: '單字勇者',
            isAdmin: false
          };
          if (remember) saveCredentials(rawAccount, cleanPassword);
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
      if (remember) saveCredentials(rawAccount, cleanPassword);
      saveLocalSession(currentUser);
      await syncFromCloud();
      return data;
    } catch (err) {
      // Handle email not confirmed by setting graceful active local session with valid UUID
      if (err.message && err.message.toLowerCase().includes('confirm')) {
        let resolvedId = null;
        try {
          const { data: prof } = await c
            .from('profiles')
            .select('id')
            .ilike('username', rawAccount.split('@')[0])
            .maybeSingle();
          if (prof && isValidUUID(prof.id)) {
            resolvedId = prof.id;
          }
        } catch (e) {}

        currentUser = {
          id: resolvedId || generateUUID(),
          email: loginEmail,
          username: rawAccount.split('@')[0],
          hero_name: '單字勇者',
          isAdmin: false
        };
        if (remember) saveCredentials(rawAccount, cleanPassword);
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
        id: '00000000-0000-4000-a000-000000000001',
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
      const assignedId = (signupData?.user?.id && isValidUUID(signupData.user.id)) 
        ? signupData.user.id 
        : generateUUID();
      currentUser = {
        id: assignedId,
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
    if (currentUser && c && isValidUUID(currentUser.id)) {
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
          inventory: {
            _heroClass: 'knight',
            _lotteryPity: 0,
            _accountEmail: formattedEmail,
            _bookmarkedWords: [],
            _mistakeWords: []
          },
          last_active_timestamp: Date.now(),
          updated_at: new Date().toISOString()
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
    clearSavedCredentials();
  };

  // Download Profile from Supabase
  const syncFromCloud = async () => {
    if (!currentUser) return null;
    const c = getClient();
    if (!c) return null;

    try {
      let profileData = null;

      // 1. Try querying by user ID if it is a valid UUID
      if (isValidUUID(currentUser.id)) {
        const { data, error } = await c
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (!error && data) {
          profileData = data;
        }
      }

      // 2. Fallback: Query by username if ID didn't match or was fallback
      if (!profileData) {
        const targetUsername = currentUser.user_metadata?.username || currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : '');
        if (targetUsername) {
          const { data, error } = await c
            .from('profiles')
            .select('*')
            .ilike('username', targetUsername)
            .maybeSingle();

          if (!error && data) {
            profileData = data;
            // Adopt the remote profile's valid UUID!
            if (isValidUUID(data.id)) {
              currentUser.id = data.id;
              saveLocalSession(currentUser);
            }
          }
        }
      }

      if (profileData) {
        if (window.App && typeof window.App.applyCloudProfile === 'function') {
          window.App.applyCloudProfile(profileData);
        }
        return profileData;
      }
    } catch (e) {
      console.warn('Sync from cloud exception:', e);
    }
    return null;
  };

  // Upload current game state to Supabase
  const syncToCloud = async (state) => {
    if (!currentUser) return;
    const c = getClient();
    if (!c) return;

    // Ensure valid UUID
    if (!isValidUUID(currentUser.id)) {
      const targetUsername = currentUser.user_metadata?.username || currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : '');
      if (targetUsername) {
        try {
          const { data } = await c.from('profiles').select('id').ilike('username', targetUsername).maybeSingle();
          if (data && isValidUUID(data.id)) {
            currentUser.id = data.id;
            saveLocalSession(currentUser);
          }
        } catch (e) {}
      }
    }

    if (!isValidUUID(currentUser.id)) {
      console.warn('Sync to cloud aborted: invalid user UUID', currentUser.id);
      return;
    }

    try {
      const inventoryData = Object.assign({}, state.inventory || {}, {
        _heroClass: state.heroClass || 'knight',
        _lotteryPity: state.lotteryPity || 0,
        _bookmarkedWords: state.bookmarkedWords || [],
        _mistakeWords: state.mistakeWords || [],
        _accountEmail: currentUser.email || ''
      });

      const payload = {
        id: currentUser.id,
        username: currentUser.user_metadata?.username || currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : 'hero'),
        hero_name: state.heroName || '單字勇者',
        tower_floor: state.towerFloor || 1,
        tower_record_floor: Math.max(state.towerFloor || 1, state.towerRecordFloor || 1),
        tower_points: state.towerPoints || 0,
        gold: state.gold !== undefined ? state.gold : 60,
        current_hp: state.currentHp !== undefined ? state.currentHp : 120,
        streak: state.streak || 1,
        equipped_weapon: state.equippedWeapon || 'w1',
        equipped_armor: state.equippedArmor || 'a1',
        equipped_relic: state.equippedRelic || null,
        owned_weapons: Array.isArray(state.ownedWeapons) ? state.ownedWeapons : ['w1'],
        owned_armors: Array.isArray(state.ownedArmors) ? state.ownedArmors : ['a1'],
        owned_relics: Array.isArray(state.ownedRelics) ? state.ownedRelics : [],
        inventory: inventoryData,
        dungeon_progress: state.dungeonProgress || 1,
        dungeon_first_cleared: Array.isArray(state.dungeonFirstCleared) ? state.dungeonFirstCleared : [],
        vocab_stats: state.vocabStats || {},
        bestiary_unlocked: Array.isArray(state.bestiaryUnlocked) ? state.bestiaryUnlocked : [],
        leave_pass_expires: state.leavePassExpires || 0,
        last_active_timestamp: state.lastActiveTimestamp || Date.now(),
        updated_at: new Date().toISOString()
      };

      const { error } = await c
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
    fetchLeaderboard,
    getSavedCredentials,
    saveCredentials,
    clearSavedCredentials
  };
})();
