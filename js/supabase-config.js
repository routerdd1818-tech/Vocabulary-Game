/**
 * Word Dungeon & Babel Tower - Supabase Configuration
 * 可以直接在此填入您的 Supabase 專案網址與 Anon Key，
 * 也可以在遊戲大廳內的「帳號與排行榜」設定視窗中直接輸入保存。
 */

const SUPABASE_CONFIG = {
  // 您的 Supabase 專案 URL (例如: "https://your-project.supabase.co")
  DEFAULT_URL: "",
  
  // 您的 Supabase Public Anon Key (可以在 Supabase Project Settings -> API 找到)
  DEFAULT_ANON_KEY: "",

  // 儲存於 localStorage 的 Key
  STORAGE_KEY_URL: "word_dungeon_supabase_url",
  STORAGE_KEY_ANON: "word_dungeon_supabase_anon",

  getUrl: function() {
    return localStorage.getItem(this.STORAGE_KEY_URL) || this.DEFAULT_URL;
  },

  getAnonKey: function() {
    return localStorage.getItem(this.STORAGE_KEY_ANON) || this.DEFAULT_ANON_KEY;
  },

  saveConfig: function(url, anonKey) {
    if (url) localStorage.setItem(this.STORAGE_KEY_URL, url.trim());
    if (anonKey) localStorage.setItem(this.STORAGE_KEY_ANON, anonKey.trim());
  },

  isConfigured: function() {
    const url = this.getUrl();
    const key = this.getAnonKey();
    return Boolean(url && key && url.startsWith('http') && key.length > 20);
  }
};
