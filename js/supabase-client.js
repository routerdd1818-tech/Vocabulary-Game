/**
 * Word Dungeon & Babel Tower - Supabase Client & Auth Service
 * 負責 Supabase 帳號註冊、登入、遊戲存檔雲端同步與即時全球排行榜競賽
 */

const SupabaseClient = (() => {
  let client = null;
  let currentUser = null;

  const init = async () => {
    if (!window.supabase) {
      console.warn('Supabase JS SDK not loaded yet.');
      return false;
    }

    if (!SUPABASE_CONFIG.isConfigured()) {
      return false;
    }

    try {
      const url = SUPABASE_CONFIG.getUrl();
      const key = SUPABASE_CONFIG.getAnonKey();
      client = window.supabase.createClient(url, key);

      // Check existing session
      const { data } = await client.auth.getSession();
      if (data && data.session && data.session.user) {
        currentUser = data.session.user;
      } else {
        currentUser = null;
      }

      client.auth.onAuthStateChange((event, session) => {
        currentUser = session ? session.user : null;
      });

      return true;
    } catch (e) {
      console.error('Supabase init failed', e);
      return false;
    }
  };

  const getClient = () => {
    if (!client && window.supabase && SUPABASE_CONFIG.isConfigured()) {
      client = window.supabase.createClient(SUPABASE_CONFIG.getUrl(), SUPABASE_CONFIG.getAnonKey());
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

  // Sign Up with Email, Password, Username & Hero Name
  const signUp = async (email, password, username, heroName) => {
    const c = getClient();
    if (!c) throw new Error('Supabase 尚未設定 Project URL 與 Anon Key！');

    const cleanUsername = username ? username.trim() : email.split('@')[0];
    const cleanHeroName = heroName ? heroName.trim() : '單字勇者';

    const { data, error } = await c.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          username: cleanUsername,
          hero_name: cleanHeroName
        }
      }
    });

    if (error) throw error;
    currentUser = data.user;

    // Immediately insert/update profile with initial values
    if (currentUser) {
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
    }

    return data;
  };

  // Sign In with Email & Password
  const signIn = async (email, password) => {
    const c = getClient();
    if (!c) throw new Error('Supabase 尚未設定 Project URL 與 Anon Key！');

    const { data, error } = await c.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error) throw error;
    currentUser = data.user;
    await syncFromCloud();
    return data;
  };

  // Sign Out
  const signOut = async () => {
    const c = getClient();
    if (c) {
      await c.auth.signOut();
    }
    currentUser = null;
  };

  // Download Profile from Supabase and update local game state
  const syncFromCloud = async () => {
    if (!currentUser || !client) return;

    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Fetch cloud profile error:', error);
        return;
      }

      if (data) {
        // Apply cloud fields to game state
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
        inventory: Object.assign({}, state.inventory, { _heroClass: state.heroClass || 'knight' }),
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

  // Fetch Real-time Global Leaderboard from Supabase
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

      if (error) {
        console.warn('Fetch leaderboard error:', error);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Fetch leaderboard exception:', e);
      return null;
    }
  };

  return {
    init,
    isConfigured,
    isLoggedIn,
    getUser,
    signUp,
    signIn,
    signOut,
    syncFromCloud,
    syncToCloud,
    fetchLeaderboard
  };
})();
