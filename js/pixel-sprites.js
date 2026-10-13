/**
 * Word Dungeon & Babel Tower - Pixel Art Sprites Engine
 * 100% Custom SVG Pixel Art. Zero system emojis.
 */

const PixelSprites = (() => {
  // Helper to create pixel SVG wrapper
  const wrapSvg = (w, h, content, className = 'pixel-icon') => {
    return `<svg class="${className}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  };

  // UI Icons
  const icons = {
    coin: (size = 16) => wrapSvg(16, 16, `
      <rect x="4" y="2" width="8" height="12" fill="#d99818"/>
      <rect x="2" y="4" width="12" height="8" fill="#d99818"/>
      <rect x="4" y="3" width="8" height="10" fill="#fcd736"/>
      <rect x="3" y="4" width="10" height="8" fill="#fcd736"/>
      <rect x="5" y="4" width="6" height="2" fill="#fff699"/>
      <rect x="7" y="6" width="2" height="4" fill="#a06e0a"/>
      <rect x="6" y="7" width="4" height="2" fill="#a06e0a"/>
    `, `pixel-icon pixel-coin-icon`),

    heart: (size = 16) => wrapSvg(16, 16, `
      <rect x="3" y="3" width="4" height="3" fill="#e62e2e"/>
      <rect x="9" y="3" width="4" height="3" fill="#e62e2e"/>
      <rect x="2" y="4" width="12" height="5" fill="#e62e2e"/>
      <rect x="3" y="9" width="10" height="2" fill="#e62e2e"/>
      <rect x="5" y="11" width="6" height="2" fill="#e62e2e"/>
      <rect x="7" y="13" width="2" height="2" fill="#e62e2e"/>
      <rect x="4" y="4" width="2" height="2" fill="#ff9999"/>
      <rect x="3" y="5" width="2" height="1" fill="#ff9999"/>
      <rect x="2" y="4" width="1" height="4" fill="#800000"/>
      <rect x="13" y="4" width="1" height="4" fill="#800000"/>
      <rect x="7" y="14" width="2" height="1" fill="#800000"/>
    `, `pixel-icon pixel-heart-icon`),

    sword: (size = 16) => wrapSvg(16, 16, `
      <rect x="11" y="2" width="3" height="3" fill="#ffffff"/>
      <rect x="10" y="3" width="3" height="3" fill="#d0d0e0"/>
      <rect x="8" y="5" width="3" height="3" fill="#b0b0c8"/>
      <rect x="6" y="7" width="3" height="3" fill="#9090b0"/>
      <rect x="4" y="9" width="3" height="3" fill="#707098"/>
      <rect x="3" y="9" width="2" height="4" fill="#c89b3c"/>
      <rect x="5" y="11" width="4" height="2" fill="#c89b3c"/>
      <rect x="2" y="12" width="3" height="3" fill="#664411"/>
      <rect x="1" y="13" width="2" height="2" fill="#ffd700"/>
    `, `pixel-icon pixel-sword-icon`),

    shield: (size = 16) => wrapSvg(16, 16, `
      <rect x="3" y="2" width="10" height="2" fill="#585868"/>
      <rect x="2" y="4" width="12" height="6" fill="#787890"/>
      <rect x="3" y="10" width="10" height="2" fill="#787890"/>
      <rect x="5" y="12" width="6" height="2" fill="#787890"/>
      <rect x="7" y="14" width="2" height="1" fill="#585868"/>
      <rect x="4" y="5" width="8" height="4" fill="#3a3a4a"/>
      <rect x="6" y="6" width="4" height="4" fill="#c89b3c"/>
      <rect x="7" y="5" width="2" height="6" fill="#ffd700"/>
    `, `pixel-icon pixel-shield-icon`),

    hourglass: (size = 16) => wrapSvg(16, 16, `
      <rect x="3" y="2" width="10" height="2" fill="#c89b3c"/>
      <rect x="3" y="12" width="10" height="2" fill="#c89b3c"/>
      <rect x="4" y="4" width="8" height="1" fill="#55bbff"/>
      <rect x="5" y="5" width="6" height="2" fill="#ffdd44"/>
      <rect x="7" y="7" width="2" height="2" fill="#55bbff"/>
      <rect x="7" y="9" width="2" height="1" fill="#ffdd44"/>
      <rect x="5" y="10" width="6" height="2" fill="#ffdd44"/>
      <rect x="3" y="4" width="1" height="8" fill="#7a5518"/>
      <rect x="12" y="4" width="1" height="8" fill="#7a5518"/>
    `, `pixel-icon pixel-hourglass-icon`),

    torch: (size = 16) => wrapSvg(16, 16, `
      <rect x="7" y="2" width="2" height="2" fill="#ffff88"/>
      <rect x="6" y="3" width="4" height="3" fill="#ff9900"/>
      <rect x="5" y="5" width="6" height="3" fill="#ff3300"/>
      <rect x="6" y="7" width="4" height="1" fill="#771100"/>
      <rect x="7" y="8" width="2" height="7" fill="#885522"/>
      <rect x="6" y="8" width="4" height="2" fill="#553311"/>
    `, `pixel-icon pixel-torch-icon`),

    speaker: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="6" width="3" height="4" fill="#c89b3c"/>
      <rect x="5" y="4" width="3" height="8" fill="#e6b84d"/>
      <rect x="8" y="3" width="1" height="10" fill="#ffd700"/>
      <rect x="11" y="5" width="1" height="6" fill="#88ddff"/>
      <rect x="13" y="3" width="1" height="10" fill="#88ddff"/>
    `, `pixel-icon pixel-speaker-icon`),

    scroll: (size = 16) => wrapSvg(16, 16, `
      <rect x="3" y="3" width="10" height="10" fill="#eeddbb"/>
      <rect x="2" y="3" width="2" height="10" fill="#bba077"/>
      <rect x="12" y="3" width="2" height="10" fill="#bba077"/>
      <rect x="5" y="5" width="6" height="1" fill="#886633"/>
      <rect x="5" y="7" width="5" height="1" fill="#886633"/>
      <rect x="5" y="9" width="6" height="1" fill="#886633"/>
      <rect x="7" y="6" width="2" height="4" fill="#cc2222"/>
    `, `pixel-icon pixel-scroll-icon`),

    potion: (size = 16) => wrapSvg(16, 16, `
      <rect x="6" y="2" width="4" height="2" fill="#bba077"/>
      <rect x="7" y="4" width="2" height="2" fill="#ddffff"/>
      <rect x="5" y="6" width="6" height="7" fill="#e62e2e"/>
      <rect x="4" y="7" width="8" height="5" fill="#e62e2e"/>
      <rect x="5" y="7" width="2" height="2" fill="#ff9999"/>
      <rect x="6" y="12" width="4" height="2" fill="#800000"/>
    `, `pixel-icon pixel-potion-icon`),

    chest: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="4" width="12" height="4" fill="#a06020"/>
      <rect x="1" y="8" width="14" height="6" fill="#784010"/>
      <rect x="2" y="4" width="1" height="10" fill="#c89b3c"/>
      <rect x="13" y="4" width="1" height="10" fill="#c89b3c"/>
      <rect x="7" y="7" width="2" height="3" fill="#ffd700"/>
      <rect x="7" y="9" width="2" height="1" fill="#14121d"/>
    `, `pixel-icon pixel-chest-icon`),

    skull: (size = 16) => wrapSvg(16, 16, `
      <rect x="4" y="2" width="8" height="7" fill="#e8e8e8"/>
      <rect x="3" y="4" width="10" height="5" fill="#e8e8e8"/>
      <rect x="5" y="5" width="2" height="2" fill="#14121d"/>
      <rect x="9" y="5" width="2" height="2" fill="#14121d"/>
      <rect x="5" y="9" width="6" height="4" fill="#d0d0d0"/>
      <rect x="6" y="11" width="1" height="2" fill="#14121d"/>
      <rect x="8" y="11" width="1" height="2" fill="#14121d"/>
    `, `pixel-icon pixel-skull-icon`),

    trophy: (size = 16) => wrapSvg(16, 16, `
      <rect x="4" y="2" width="8" height="6" fill="#ffd700"/>
      <rect x="3" y="3" width="10" height="3" fill="#ffd700"/>
      <rect x="2" y="3" width="1" height="3" fill="#c89b3c"/>
      <rect x="13" y="3" width="1" height="3" fill="#c89b3c"/>
      <rect x="5" y="7" width="6" height="2" fill="#c89b3c"/>
      <rect x="7" y="9" width="2" height="3" fill="#ffd700"/>
      <rect x="5" y="12" width="6" height="2" fill="#8b5a1a"/>
    `, `pixel-icon pixel-trophy-icon`),

    calendar: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="3" width="12" height="11" fill="#3a344a"/>
      <rect x="2" y="3" width="12" height="3" fill="#c83c3c"/>
      <rect x="4" y="2" width="2" height="2" fill="#e0e0e0"/>
      <rect x="10" y="2" width="2" height="2" fill="#e0e0e0"/>
      <rect x="4" y="8" width="2" height="2" fill="#ffd700"/>
      <rect x="7" y="8" width="2" height="2" fill="#e0e0e0"/>
      <rect x="10" y="8" width="2" height="2" fill="#e0e0e0"/>
      <rect x="4" y="11" width="2" height="2" fill="#e0e0e0"/>
      <rect x="7" y="11" width="2" height="2" fill="#ffd700"/>
    `, `pixel-icon pixel-calendar-icon`),

    backpack: (size = 16) => wrapSvg(16, 16, `
      <rect x="4" y="3" width="8" height="11" fill="#784010"/>
      <rect x="3" y="6" width="10" height="8" fill="#8b5a1a"/>
      <rect x="5" y="8" width="6" height="4" fill="#a06820"/>
      <rect x="7" y="9" width="2" height="2" fill="#ffd700"/>
      <rect x="6" y="2" width="4" height="2" fill="#503010"/>
    `, `pixel-icon pixel-backpack-icon`),

    meat: (size = 16) => wrapSvg(16, 16, `
      <rect x="3" y="4" width="8" height="6" fill="#a04020"/>
      <rect x="5" y="3" width="6" height="8" fill="#b05030"/>
      <rect x="4" y="4" width="6" height="2" fill="#d07050"/>
      <rect x="10" y="8" width="4" height="3" fill="#eeddcc"/>
      <rect x="13" y="7" width="2" height="5" fill="#eeddcc"/>
    `, `pixel-icon pixel-meat-icon`),

    tower: (size = 16) => wrapSvg(16, 16, `
      <rect x="5" y="2" width="6" height="2" fill="#787890"/>
      <rect x="4" y="4" width="8" height="10" fill="#585868"/>
      <rect x="3" y="12" width="10" height="3" fill="#3a3a4a"/>
      <rect x="6" y="2" width="1" height="2" fill="#14121d"/>
      <rect x="9" y="2" width="1" height="2" fill="#14121d"/>
      <rect x="7" y="6" width="2" height="3" fill="#ffd700"/>
      <rect x="7" y="11" width="2" height="3" fill="#14121d"/>
    `, `pixel-icon pixel-tower-icon`),

    star: (size = 16) => wrapSvg(16, 16, `
      <rect x="7" y="2" width="2" height="12" fill="#ffd700"/>
      <rect x="2" y="7" width="12" height="2" fill="#ffd700"/>
      <rect x="5" y="5" width="6" height="6" fill="#ffea66"/>
      <rect x="6" y="6" width="4" height="4" fill="#ffffff"/>
    `, `pixel-icon pixel-star-icon`),

    check: (size = 16) => wrapSvg(16, 16, `
      <rect x="3" y="8" width="2" height="3" fill="#44dd44"/>
      <rect x="5" y="10" width="3" height="3" fill="#44dd44"/>
      <rect x="8" y="7" width="3" height="3" fill="#44dd44"/>
      <rect x="11" y="4" width="3" height="3" fill="#44dd44"/>
      <rect x="6" y="9" width="5" height="2" fill="#aaffaa"/>
    `, `pixel-icon pixel-check-icon`),

    cross: (size = 16) => wrapSvg(16, 16, `
      <rect x="3" y="3" width="3" height="3" fill="#dd4444"/>
      <rect x="10" y="3" width="3" height="3" fill="#dd4444"/>
      <rect x="5" y="5" width="6" height="6" fill="#dd4444"/>
      <rect x="3" y="10" width="3" height="3" fill="#dd4444"/>
      <rect x="10" y="10" width="3" height="3" fill="#dd4444"/>
      <rect x="6" y="6" width="4" height="4" fill="#ff8888"/>
    `, `pixel-icon pixel-cross-icon`),

    buff: (size = 16) => wrapSvg(16, 16, `
      <rect x="6" y="2" width="4" height="12" fill="#cc66ff"/>
      <rect x="2" y="6" width="12" height="4" fill="#cc66ff"/>
      <rect x="4" y="4" width="8" height="8" fill="#ee99ff"/>
      <rect x="6" y="6" width="4" height="4" fill="#ffffff"/>
    `, `pixel-icon pixel-buff-icon`),

    soundOn: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="6" width="3" height="4" fill="#c89b3c"/>
      <rect x="5" y="4" width="3" height="8" fill="#ffd700"/>
      <rect x="10" y="5" width="1" height="6" fill="#88ddff"/>
      <rect x="12" y="3" width="1" height="10" fill="#88ddff"/>
      <rect x="14" y="1" width="1" height="14" fill="#88ddff"/>
    `, `pixel-icon`),

    soundOff: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="6" width="3" height="4" fill="#787890"/>
      <rect x="5" y="4" width="3" height="8" fill="#9090a8"/>
      <rect x="10" y="4" width="2" height="2" fill="#dd4444"/>
      <rect x="12" y="6" width="2" height="2" fill="#dd4444"/>
      <rect x="10" y="8" width="2" height="2" fill="#dd4444"/>
    `, `pixel-icon`),

    dice: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="2" width="12" height="12" fill="#a02828"/>
      <rect x="3" y="3" width="10" height="10" fill="#d83a3a"/>
      <rect x="4" y="4" width="2" height="2" fill="#ffffff"/>
      <rect x="10" y="4" width="2" height="2" fill="#ffffff"/>
      <rect x="7" y="7" width="2" height="2" fill="#ffffff"/>
      <rect x="4" y="10" width="2" height="2" fill="#ffffff"/>
      <rect x="10" y="10" width="2" height="2" fill="#ffffff"/>
    `, `pixel-icon pixel-dice-icon`),

    wheel: (size = 16) => wrapSvg(16, 16, `
      <circle cx="8" cy="8" r="6.5" fill="#2d2242" stroke="#c89b3c" stroke-width="1.5"/>
      <rect x="7" y="2" width="2" height="12" fill="#ffd700"/>
      <rect x="2" y="7" width="12" height="2" fill="#ffd700"/>
      <circle cx="8" cy="8" r="2.5" fill="#ff4444"/>
      <circle cx="8" cy="8" r="1" fill="#ffffff"/>
      <polygon points="8,0 6,3 10,3" fill="#ffffff"/>
    `, `pixel-icon pixel-wheel-icon`),

    crown: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="11" width="12" height="3" fill="#c89b3c"/>
      <rect x="3" y="12" width="10" height="1" fill="#ffd700"/>
      <polygon points="2,11 4,5 7,9 8,9 11,5 13,11" fill="#ffd700"/>
      <rect x="3" y="4" width="2" height="2" fill="#ffffff"/>
      <rect x="7" y="3" width="2" height="2" fill="#ff4444"/>
      <rect x="11" y="4" width="2" height="2" fill="#ffffff"/>
      <rect x="4" y="12" width="2" height="1" fill="#e62e2e"/>
      <rect x="7" y="12" width="2" height="1" fill="#44ddff"/>
      <rect x="10" y="12" width="2" height="1" fill="#44dd66"/>
    `, `pixel-icon pixel-crown-icon`),

    castle: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="5" width="3" height="9" fill="#585868"/>
      <rect x="11" y="5" width="3" height="9" fill="#585868"/>
      <rect x="2" y="3" width="1" height="2" fill="#787890"/>
      <rect x="4" y="3" width="1" height="2" fill="#787890"/>
      <rect x="11" y="3" width="1" height="2" fill="#787890"/>
      <rect x="13" y="3" width="1" height="2" fill="#787890"/>
      <rect x="5" y="7" width="6" height="7" fill="#787890"/>
      <rect x="6" y="5" width="4" height="2" fill="#9090a8"/>
      <rect x="7" y="10" width="2" height="4" fill="#14121d"/>
      <rect x="7" y="3" width="2" height="2" fill="#ffd700"/>
    `, `pixel-icon pixel-castle-icon`),

    key: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="4" width="6" height="6" fill="#c89b3c"/>
      <rect x="4" y="6" width="2" height="2" fill="#14121d"/>
      <rect x="7" y="6" width="7" height="2" fill="#ffd700"/>
      <rect x="11" y="8" width="2" height="2" fill="#ffd700"/>
      <rect x="13" y="8" width="1" height="2" fill="#ffd700"/>
    `, `pixel-icon pixel-key-icon`),

    book: (size = 16) => wrapSvg(16, 16, `
      <rect x="2" y="3" width="12" height="10" fill="#6a3082"/>
      <rect x="2" y="3" width="2" height="10" fill="#4a1860"/>
      <rect x="5" y="4" width="8" height="8" fill="#f4ecd8"/>
      <rect x="7" y="6" width="4" height="4" fill="#ffd700"/>
      <rect x="8" y="2" width="2" height="5" fill="#e62e2e"/>
    `, `pixel-icon pixel-book-icon`),

    bookmark: (size = 16) => wrapSvg(16, 16, `
      <rect x="4" y="2" width="8" height="12" fill="#e62e2e"/>
      <polygon points="4,14 8,11 12,14" fill="#14121d"/>
      <rect x="6" y="4" width="4" height="4" fill="#ffd700"/>
    `, `pixel-icon pixel-bookmark-icon`),

    magic: (size = 16) => wrapSvg(16, 16, `
      <rect x="7" y="1" width="2" height="14" fill="#b066ff"/>
      <rect x="1" y="7" width="14" height="2" fill="#b066ff"/>
      <rect x="4" y="4" width="8" height="8" fill="#00ffff"/>
      <rect x="6" y="6" width="4" height="4" fill="#ffffff"/>
    `, `pixel-icon pixel-magic-icon`),

    quill: (size = 16) => wrapSvg(16, 16, `
      <polygon points="12,2 14,4 5,13 3,13 3,11" fill="#eeddbb"/>
      <polygon points="12,2 14,4 10,8 8,6" fill="#4fe3ff"/>
      <rect x="2" y="13" width="2" height="2" fill="#14121d"/>
    `, `pixel-icon pixel-quill-icon`)
  };

  // Dynamic Multi-Class & Multi-Tier Equipment Pixel Hero Paper Doll (64x64)
  const renderHero = (expression = 'happy', weaponTier = 1, armorTier = 1, relicTier = 0, heroClass = 'novice', awakeningRank = 0) => {
    const aTier = Math.max(1, Math.min(6, parseInt(armorTier) || 1));
    const wTier = Math.max(1, Math.min(6, parseInt(weaponTier) || 1));
    const rTier = Math.max(0, Math.min(4, parseInt(relicTier) || 0));
    const aRank = Math.max(0, Math.min(5, parseInt(awakeningRank) || 0));

    // Class Awakening Aura (Rank 1 to 5)
    let awakeningSvg = '';
    if (aRank >= 1 && heroClass !== 'novice') {
      if (aRank === 1) {
        awakeningSvg = `
          <rect x="22" y="56" width="3" height="3" fill="#ffd700" opacity="0.8"/>
          <rect x="39" y="56" width="3" height="3" fill="#ffd700" opacity="0.8"/>
          <rect x="18" y="44" width="2" height="2" fill="#ffe066" opacity="0.7"/>
          <rect x="44" y="44" width="2" height="2" fill="#ffe066" opacity="0.7"/>
          <circle cx="32" cy="58" r="16" fill="none" stroke="#ffd700" stroke-width="1" stroke-dasharray="2,2" opacity="0.4"/>
        `;
      } else if (aRank === 2) {
        awakeningSvg = `
          <ellipse cx="32" cy="40" rx="24" ry="12" fill="none" stroke="#4fe3ff" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
          <rect x="8" y="38" width="4" height="4" fill="#4fe3ff"/>
          <rect x="52" y="38" width="4" height="4" fill="#4fe3ff"/>
          <rect x="24" y="54" width="3" height="3" fill="#77ffbb"/>
          <rect x="37" y="54" width="3" height="3" fill="#77ffbb"/>
        `;
      } else if (aRank === 3) {
        awakeningSvg = `
          <circle cx="32" cy="34" r="26" fill="none" stroke="#ffaa44" stroke-width="2" stroke-dasharray="6,2" opacity="0.7"/>
          <circle cx="32" cy="34" r="22" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
          <polygon points="32,6 30,10 34,10" fill="#ffd700"/>
          <polygon points="32,62 30,58 34,58" fill="#ffd700"/>
          <polygon points="4,34 8,32 8,36" fill="#ffaa44"/>
          <polygon points="60,34 56,32 56,36" fill="#ffaa44"/>
        `;
      } else if (aRank === 4) {
        awakeningSvg = `
          <polygon points="20,32 6,14 16,38" fill="#e066ff" opacity="0.6"/>
          <polygon points="44,32 58,14 48,38" fill="#e066ff" opacity="0.6"/>
          <polygon points="22,34 10,24 18,42" fill="#ffd700" opacity="0.5"/>
          <polygon points="42,34 54,24 46,42" fill="#ffd700" opacity="0.5"/>
          <circle cx="32" cy="34" r="28" fill="none" stroke="#e066ff" stroke-width="2" stroke-dasharray="5,2" opacity="0.8"/>
        `;
      } else if (aRank === 5) {
        awakeningSvg = `
          <circle cx="32" cy="32" r="30" fill="none" stroke="#ffd700" stroke-width="2.5" opacity="0.85"/>
          <circle cx="32" cy="32" r="26" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.7"/>
          <polygon points="18,30 2,8 14,40" fill="#ffd700" opacity="0.75"/>
          <polygon points="46,30 62,8 50,40" fill="#ffd700" opacity="0.75"/>
          <polygon points="20,28 6,16 16,36" fill="#ffffff" opacity="0.85"/>
          <polygon points="44,28 58,16 48,36" fill="#ffffff" opacity="0.85"/>
          <ellipse cx="32" cy="8" rx="14" ry="4" fill="none" stroke="#ffd700" stroke-width="2"/>
          <rect x="30" y="5" width="4" height="4" fill="#ffffff"/>
          <circle cx="12" cy="18" r="2" fill="#ffffff"/>
          <circle cx="52" cy="18" r="2" fill="#ffffff"/>
          <circle cx="20" cy="54" r="2" fill="#ffd700"/>
          <circle cx="44" cy="54" r="2" fill="#ffd700"/>
        `;
      }
    }

    // Armor Themes (T1~T6)
    const armorTheme = [
      null,
      // T1: 翠林旅人皮甲 (Traveler Leather)
      {
        main: '#6a4e32', trim: '#4a823c', dark: '#483522', metal: '#887058',
        accent: '#55aa44', cape: '#3a6834', helm: '#5a422a', eyeGlow: null
      },
      // T2: 銀翼衛隊鎖子甲 (Silver Guard Chainmail)
      {
        main: '#788898', trim: '#2e5894', dark: '#506070', metal: '#b0c0d0',
        accent: '#5588dd', cape: '#264275', helm: '#8c9cb0', eyeGlow: null
      },
      // T3: 秘銀聖殿重鎧 (Mithril Heavy Armor)
      {
        main: '#9bb8d4', trim: '#ffd700', dark: '#6888a4', metal: '#d0e4f4',
        accent: '#3388ff', cape: '#285888', helm: '#b2d0ee', eyeGlow: '#4fe3ff'
      },
      // T4: 暗夜精靈幻影甲 (Phantom Night Armor)
      {
        main: '#2d2242', trim: '#b85bf8', dark: '#1c152a', metal: '#5a4580',
        accent: '#cc44ff', cape: '#181024', helm: '#443264', eyeGlow: '#ee66ff'
      },
      // T5: 紅蓮龍鱗戰甲 (Crimson Dragonscale Armor)
      {
        main: '#a82424', trim: '#ff9922', dark: '#661414', metal: '#d44040',
        accent: '#ffd700', cape: '#801818', helm: '#c43030', eyeGlow: '#ffaa00'
      },
      // T6: 不朽神聖蒼穹鎧 (Celestial Immortal Armor)
      {
        main: '#f0f4fc', trim: '#ffd700', dark: '#b8c8dc', metal: '#ffffff',
        accent: '#55d0ff', cape: '#fcd736', helm: '#ffffff', eyeGlow: '#55ddff'
      }
    ][aTier];

    // Weapon Themes (T1~T6)
    const weaponTheme = [
      null,
      // T1: 木質 (Oak Practice)
      { blade: '#8a5a2b', hilt: '#503818', glow: '#c49b4a', spark: '#eeddaa', core: '#a6723e' },
      // T2: 精鋼 (Kingdom Steel)
      { blade: '#d0d8e8', hilt: '#c89b3c', glow: '#ffffff', spark: '#99bbdd', core: '#eef4ff' },
      // T3: 烈焰 (Crimson Flame)
      { blade: '#ff3a20', hilt: '#ffd700', glow: '#ffaa22', spark: '#ffee66', core: '#ff8833' },
      // T4: 寒冰 (Glacial Frost)
      { blade: '#44ddff', hilt: '#ffffff', glow: '#99f0ff', spark: '#ccffff', core: '#88eeff' },
      // T5: 蒼雷 (Thunder Dragon)
      { blade: '#ffff44', hilt: '#3388ff', glow: '#4fe3ff', spark: '#ffffff', core: '#ffffaa' },
      // T6: 真理 (Genesis Holy Light)
      { blade: '#ffffff', hilt: '#ffd700', glow: '#ffd700', spark: '#ffea66', core: '#ffffff' }
    ][wTier];

    // Relic Aura (T1~T4)
    let relicSvg = '';
    if (rTier >= 1) {
      const auraColor = rTier === 1 ? '#c89b3c' : rTier === 2 ? '#44dd88' : rTier === 3 ? '#b85bf8' : '#ffd700';
      relicSvg = `
        <circle cx="32" cy="31" r="27" fill="none" stroke="${auraColor}" stroke-width="${rTier >= 3 ? '2.5' : '1.5'}" stroke-dasharray="${rTier >= 3 ? '5,3' : '3,3'}" opacity="${0.4 + rTier * 0.15}"/>
        <rect x="30" y="2" width="4" height="4" fill="${auraColor}"/>
        <rect x="6" y="27" width="3" height="3" fill="${auraColor}"/>
        <rect x="55" y="27" width="3" height="3" fill="${auraColor}"/>
      `;
      if (rTier >= 2) {
        // Floating sparkles
        relicSvg += `
          <rect x="14" y="10" width="2" height="2" fill="${auraColor}"/>
          <rect x="48" y="10" width="2" height="2" fill="${auraColor}"/>
        `;
      }
      if (rTier >= 3) {
        // Wisdom Magic Circle at base
        relicSvg += `
          <ellipse cx="32" cy="59" rx="20" ry="4" fill="none" stroke="${auraColor}" stroke-width="1.5" opacity="0.6"/>
          <line x1="20" y1="59" x2="44" y2="59" stroke="${auraColor}" stroke-width="1" stroke-dasharray="2,2"/>
        `;
      }
      if (rTier === 4) {
        // Eternal Crown Radiant Halo
        relicSvg += `
          <rect x="25" y="5" width="14" height="3" fill="#ffd700"/>
          <rect x="23" y="3" width="3" height="3" fill="#ffd700"/>
          <rect x="30" y="2" width="4" height="4" fill="#ffffff"/>
          <rect x="38" y="3" width="3" height="3" fill="#ffd700"/>
          <circle cx="32" cy="6" r="8" fill="none" stroke="#ffe766" stroke-width="1" opacity="0.5"/>
        `;
      }
    }

    // Common Expression Elements (Used across classes when face visible)
    let faceSvg = '';
    if (expression === 'happy') {
      faceSvg = `
        <rect x="26" y="20" width="12" height="11" fill="#ffd2aa"/>
        <rect x="28" y="23" width="2" height="3" fill="#14121d"/>
        <rect x="34" y="23" width="2" height="3" fill="#14121d"/>
        <rect x="27" y="26" width="2" height="2" fill="#ff7777"/>
        <rect x="35" y="26" width="2" height="2" fill="#ff7777"/>
        <rect x="30" y="27" width="4" height="2" fill="#992222"/>
      `;
    } else if (expression === 'hungry') {
      faceSvg = `
        <rect x="26" y="20" width="12" height="11" fill="#ecd0b0"/>
        <rect x="27" y="18" width="2" height="3" fill="#44aaff"/>
        <rect x="28" y="24" width="3" height="2" fill="#222233"/>
        <rect x="33" y="24" width="3" height="2" fill="#222233"/>
        <rect x="30" y="27" width="4" height="1" fill="#663333"/>
      `;
    } else if (expression === 'sarcastic') {
      faceSvg = `
        <rect x="26" y="20" width="12" height="11" fill="#e0c8b0"/>
        <rect x="27" y="25" width="4" height="2" fill="#775588"/>
        <rect x="33" y="25" width="4" height="2" fill="#775588"/>
        <rect x="28" y="24" width="3" height="1" fill="#14121d"/>
        <rect x="34" y="24" width="3" height="1" fill="#14121d"/>
        <rect x="30" y="28" width="5" height="1" fill="#442222"/>
      `;
    } else if (expression === 'ghost') {
      faceSvg = `
        <rect x="26" y="20" width="12" height="11" fill="#d0e0e8"/>
        <rect x="38" y="10" width="6" height="6" fill="#aaddff" opacity="0.8"/>
        <rect x="28" y="23" width="3" height="3" fill="#112233"/>
        <rect x="33" y="23" width="3" height="3" fill="#112233"/>
        <rect x="30" y="27" width="4" height="2" fill="#112233"/>
      `;
    } else { // Vacation
      faceSvg = `
        <rect x="26" y="20" width="12" height="11" fill="#ffd2aa"/>
        <rect x="27" y="22" width="10" height="4" fill="#111111"/>
        <rect x="28" y="23" width="3" height="2" fill="#335577"/>
        <rect x="33" y="23" width="3" height="2" fill="#335577"/>
        <rect x="30" y="28" width="4" height="1" fill="#662222"/>
      `;
    }

    let classBodySvg = '';

    if (heroClass === 'mage') {
      // ==========================================
      // 🧙‍♂️ 秘術大法師 (Mage)
      // ==========================================
      const hatColor = aTier >= 5 ? armorTheme.dark : armorTheme.cape;
      const robeColor = armorTheme.main;
      const robeTrim = armorTheme.trim;

      classBodySvg = `
        <!-- Wizard Hat Plume & Brim -->
        <polygon points="32,2 26,16 38,16" fill="${hatColor}"/>
        <rect x="24" y="15" width="16" height="4" fill="${armorTheme.dark}"/>
        <rect x="29" y="14" width="6" height="3" fill="${robeTrim}"/>
        ${aTier >= 5 ? `<polygon points="32,0 30,5 34,5" fill="${armorTheme.accent}"/>` : ''}

        <!-- Long Wizard Hair / Beard -->
        <rect x="24" y="19" width="3" height="14" fill="#e8edf5"/>
        <rect x="37" y="19" width="3" height="14" fill="#e8edf5"/>
        <rect x="29" y="28" width="6" height="6" fill="#e8edf5"/>
        ${faceSvg}

        <!-- Flowing Arcane Robe (Tier Adaptive) -->
        <rect x="24" y="31" width="16" height="24" fill="${robeColor}"/>
        <rect x="28" y="32" width="8" height="23" fill="${armorTheme.dark}"/>
        <rect x="31" y="34" width="2" height="21" fill="${robeTrim}"/>
        <rect x="27" y="42" width="10" height="3" fill="${robeTrim}"/>

        <!-- Sleeves & Hands -->
        <rect x="20" y="33" width="5" height="10" fill="${robeColor}"/>
        <rect x="39" y="33" width="5" height="10" fill="${robeColor}"/>
        <rect x="20" y="41" width="4" height="2" fill="${robeTrim}"/>
        <rect x="40" y="41" width="4" height="2" fill="${robeTrim}"/>
        <rect x="21" y="43" width="3" height="3" fill="#ffd2aa"/>
        <rect x="40" y="43" width="3" height="3" fill="#ffd2aa"/>

        <!-- Robe Hem & Boots -->
        <rect x="22" y="54" width="20" height="3" fill="${robeTrim}"/>
        <rect x="26" y="56" width="4" height="4" fill="${armorTheme.dark}"/>
        <rect x="34" y="56" width="4" height="4" fill="${armorTheme.dark}"/>

        <!-- Left: Floating Arcane Grimoire (Tier Evolving) -->
        <g>
          <rect x="11" y="33" width="9" height="11" fill="${armorTheme.dark}"/>
          <rect x="12" y="34" width="7" height="9" fill="${weaponTheme.core}"/>
          <line x1="15" y1="34" x2="15" y2="43" stroke="${robeTrim}" stroke-width="1.5"/>
          <rect x="13" y="30" width="2" height="2" fill="${weaponTheme.glow}"/>
          <rect x="18" y="32" width="2" height="2" fill="${weaponTheme.spark}"/>
        </g>

        <!-- Right: Arcane Magic Staff (Weapon Tier Evolving) -->
        <g>
          <!-- Staff Shaft -->
          <rect x="44" y="14" width="3" height="44" fill="${wTier === 1 ? '#6a4e32' : wTier === 2 ? '#b0b8c4' : '#382b40'}"/>
          <rect x="43" y="38" width="5" height="4" fill="${weaponTheme.hilt}"/>
          <!-- Staff Top Crystal & Wings -->
          <circle cx="45" cy="12" r="${wTier >= 5 ? 6 : wTier >= 3 ? 5 : 4}" fill="${weaponTheme.glow}"/>
          <circle cx="45" cy="12" r="2.5" fill="${weaponTheme.spark}"/>
          ${wTier >= 3 ? `<polygon points="41,12 43,8 43,16" fill="${weaponTheme.blade}"/>` : ''}
          ${wTier >= 3 ? `<polygon points="49,12 47,8 47,16" fill="${weaponTheme.blade}"/>` : ''}
          ${wTier >= 5 ? `<circle cx="45" cy="12" r="8" fill="none" stroke="${weaponTheme.spark}" stroke-width="1" stroke-dasharray="2,2"/>` : ''}
        </g>
      `;
    } else if (heroClass === 'ranger') {
      // ==========================================
      // 🏹 翠林巡林客 (Ranger)
      // ==========================================
      classBodySvg = `
        <!-- Forest Archer Hood (Tier Adaptive) -->
        <rect x="25" y="14" width="14" height="7" fill="${armorTheme.cape}"/>
        <rect x="23" y="17" width="3" height="13" fill="${armorTheme.cape}"/>
        <rect x="38" y="17" width="3" height="13" fill="${armorTheme.cape}"/>
        <!-- Hood Feather (Tier Adaptive) -->
        <polygon points="23,11 25,18 21,18" fill="${armorTheme.trim}"/>
        ${aTier >= 4 ? `<polygon points="21,9 23,16 20,16" fill="${armorTheme.accent}"/>` : ''}
        ${faceSvg}

        <!-- Leather / Mithril Jerkin & Cloak -->
        <rect x="24" y="31" width="16" height="16" fill="${armorTheme.main}"/>
        <rect x="28" y="32" width="8" height="15" fill="${armorTheme.dark}"/>
        <rect x="26" y="38" width="12" height="2" fill="${armorTheme.trim}"/>

        <!-- Cloak Back Flaps -->
        <rect x="21" y="34" width="4" height="14" fill="${armorTheme.cape}"/>
        <rect x="39" y="34" width="4" height="14" fill="${armorTheme.cape}"/>

        <!-- Hands with Archer Bracers -->
        <rect x="21" y="42" width="3" height="4" fill="${armorTheme.dark}"/>
        <rect x="40" y="40" width="3" height="4" fill="#ffd2aa"/>

        <!-- Legs & Tall Boots -->
        <rect x="26" y="47" width="5" height="11" fill="${armorTheme.dark}"/>
        <rect x="33" y="47" width="5" height="11" fill="${armorTheme.dark}"/>
        <rect x="25" y="57" width="6" height="4" fill="${armorTheme.main}"/>
        <rect x="33" y="57" width="6" height="4" fill="${armorTheme.main}"/>

        <!-- Left Shoulder: Quiver with Arrows (Tier Adaptive) -->
        <g>
          <rect x="17" y="24" width="5" height="13" fill="${armorTheme.dark}"/>
          <rect x="18" y="25" width="3" height="2" fill="${armorTheme.trim}"/>
          <!-- Arrow Shafts & Fletchings -->
          <line x1="17" y1="20" x2="19" y2="24" stroke="${weaponTheme.spark}" stroke-width="1.5"/>
          <line x1="21" y1="19" x2="21" y2="24" stroke="${weaponTheme.spark}" stroke-width="1.5"/>
        </g>

        <!-- Right Hand: Recurve Longbow (Weapon Tier Evolving) -->
        <g>
          <!-- Bow Limbs -->
          <path d="M 46,10 Q ${wTier >= 5 ? '55' : '52'},32 46,54" fill="none" stroke="${weaponTheme.blade}" stroke-width="${wTier >= 4 ? '3.5' : '2.5'}"/>
          <!-- Bow Tips -->
          <rect x="45" y="9" width="3" height="3" fill="${weaponTheme.hilt}"/>
          <rect x="45" y="53" width="3" height="3" fill="${weaponTheme.hilt}"/>
          <!-- Bowstring -->
          <line x1="46" y1="11" x2="46" y2="53" stroke="${weaponTheme.spark}" stroke-width="1" stroke-dasharray="3,1"/>
          <!-- Nocked Arrow -->
          <line x1="39" y1="32" x2="52" y2="32" stroke="${weaponTheme.core}" stroke-width="1.5"/>
          <polygon points="52,30 56,32 52,34" fill="${weaponTheme.glow}"/>
        </g>
      `;
    } else if (heroClass === 'berserker') {
      // ==========================================
      // ⚔️ 維京狂戰士 (Berserker)
      // ==========================================
      const hornColor = aTier === 1 ? '#eeddbb' : aTier === 2 ? '#f0ece1' : aTier === 3 ? '#d6e8f4' : aTier === 4 ? '#221133' : aTier === 5 ? '#ff4422' : '#ffd700';

      classBodySvg = `
        <!-- Viking Horned Helm (Armor Tier Adaptive) -->
        <rect x="25" y="15" width="14" height="6" fill="${armorTheme.helm}"/>
        <!-- Giant Curved Horns -->
        <polygon points="22,18 15,7 24,14" fill="${hornColor}"/>
        <polygon points="42,18 49,7 40,14" fill="${hornColor}"/>
        <!-- Forehead Band with Studs -->
        <rect x="25" y="19" width="14" height="3" fill="${armorTheme.dark}"/>
        <rect x="28" y="19" width="2" height="3" fill="${armorTheme.trim}"/>
        <rect x="34" y="19" width="2" height="3" fill="${armorTheme.trim}"/>
        ${faceSvg}

        <!-- Red / Tier War Paint Streaks -->
        <line x1="28" y1="24" x2="28" y2="28" stroke="${aTier >= 4 ? armorTheme.accent : '#cc2222'}" stroke-width="1.5"/>
        <line x1="35" y1="24" x2="35" y2="28" stroke="${aTier >= 4 ? armorTheme.accent : '#cc2222'}" stroke-width="1.5"/>

        <!-- Heavy Beast Fur Mantle over Shoulders -->
        <rect x="19" y="30" width="26" height="6" fill="${armorTheme.dark}"/>
        <rect x="17" y="33" width="8" height="9" fill="${armorTheme.main}"/>
        <rect x="39" y="33" width="8" height="9" fill="${armorTheme.main}"/>

        <!-- Muscular Torso & Spiked Belt -->
        <rect x="25" y="36" width="14" height="11" fill="#e8be92"/>
        <rect x="24" y="45" width="16" height="4" fill="${armorTheme.dark}"/>
        <rect x="29" y="45" width="6" height="4" fill="${armorTheme.trim}"/>

        <!-- Legs & Fur Boots -->
        <rect x="26" y="49" width="5" height="8" fill="${armorTheme.dark}"/>
        <rect x="33" y="49" width="5" height="8" fill="${armorTheme.dark}"/>
        <rect x="25" y="56" width="6" height="6" fill="${armorTheme.main}"/>
        <rect x="33" y="56" width="6" height="6" fill="${armorTheme.main}"/>

        <!-- Giant Double-bitted Battleaxe (Weapon Tier Evolving) -->
        <g>
          <!-- Axe Haft -->
          <rect x="42" y="12" width="3" height="46" fill="${wTier === 1 ? '#5a3d24' : '#282030'}"/>
          <rect x="41" y="36" width="5" height="4" fill="${weaponTheme.hilt}"/>
          <!-- Left Blade -->
          <polygon points="42,16 31,11 31,26 42,26" fill="${weaponTheme.blade}"/>
          <polygon points="42,26 33,31 42,27" fill="${weaponTheme.blade}"/>
          <!-- Right Blade -->
          <polygon points="43,16 55,10 57,27 43,26" fill="${weaponTheme.blade}"/>
          <polygon points="43,26 54,32 43,28" fill="${weaponTheme.blade}"/>
          <!-- Blade Core & Edge Highlights -->
          <circle cx="43" cy="21" r="3" fill="${weaponTheme.glow}"/>
          <line x1="55" y1="10" x2="57" y2="27" stroke="${weaponTheme.spark}" stroke-width="1.5"/>
          <line x1="31" y1="11" x2="31" y2="26" stroke="${weaponTheme.spark}" stroke-width="1.5"/>
        </g>
      `;
    } else if (heroClass === 'valkyrie') {
      // ==========================================
      // 👑 天馬女武神 (Valkyrie)
      // ==========================================
      classBodySvg = `
        <!-- Flowing Majestic Cape in Background (Tier Adaptive) -->
        <polygon points="22,33 13,58 24,58" fill="${armorTheme.cape}"/>
        <polygon points="42,33 51,58 40,58" fill="${armorTheme.cape}"/>

        <!-- Winged Tiara / Crown (Tier Adaptive) -->
        <rect x="25" y="16" width="14" height="4" fill="${armorTheme.trim}"/>
        <!-- Left & Right Winged Feathers -->
        <polygon points="24,14 16,5 23,20" fill="${armorTheme.metal}"/>
        <polygon points="40,14 48,5 41,20" fill="${armorTheme.metal}"/>
        ${aTier >= 5 ? `<polygon points="22,12 12,3 20,18" fill="${armorTheme.trim}"/>` : ''}
        ${aTier >= 5 ? `<polygon points="42,12 52,3 44,18" fill="${armorTheme.trim}"/>` : ''}

        <!-- Golden Warrior Hair -->
        <rect x="23" y="18" width="3" height="15" fill="#f0c430"/>
        <rect x="38" y="18" width="3" height="15" fill="#f0c430"/>
        ${faceSvg}

        <!-- Cuirass Breastplate (Tier Adaptive) -->
        <rect x="24" y="31" width="16" height="16" fill="${armorTheme.main}"/>
        <rect x="27" y="33" width="10" height="12" fill="${armorTheme.metal}"/>
        <rect x="31" y="35" width="2" height="8" fill="${armorTheme.trim}"/>

        <!-- Hands with Gauntlets -->
        <rect x="20" y="40" width="4" height="4" fill="${armorTheme.trim}"/>
        <rect x="40" y="40" width="4" height="4" fill="${armorTheme.trim}"/>

        <!-- Greaves & Boots -->
        <rect x="26" y="47" width="5" height="10" fill="${armorTheme.dark}"/>
        <rect x="33" y="47" width="5" height="10" fill="${armorTheme.dark}"/>
        <rect x="25" y="57" width="6" height="5" fill="${armorTheme.main}"/>
        <rect x="33" y="57" width="6" height="5" fill="${armorTheme.main}"/>

        <!-- Left Arm: Holy Buckler Round Shield (Tier Evolving) -->
        <g>
          <circle cx="17" cy="42" r="7" fill="${armorTheme.main}"/>
          <circle cx="17" cy="42" r="5" fill="${armorTheme.metal}"/>
          <circle cx="17" cy="42" r="2.5" fill="${armorTheme.trim}"/>
          ${aTier >= 4 ? `<rect x="16" y="41" width="2" height="2" fill="${armorTheme.accent}"/>` : ''}
        </g>

        <!-- Right Hand: Holy Lance / Spear (Weapon Tier Evolving) -->
        <g>
          <!-- Spear Shaft -->
          <rect x="44" y="6" width="2.5" height="52" fill="${wTier === 1 ? '#8a5a2b' : '#302838'}"/>
          <rect x="43" y="38" width="4.5" height="3" fill="${weaponTheme.hilt}"/>
          <!-- Spearhead -->
          <polygon points="45,0 41,11 49,11" fill="${weaponTheme.blade}"/>
          <polygon points="45,2 43,9 47,9" fill="${weaponTheme.glow}"/>
          <!-- Holy Pennant -->
          <polygon points="45,11 39,15 45,19" fill="${weaponTheme.spark}"/>
        </g>
      `;
    } else if (heroClass === 'reaper') {
      // ==========================================
      // 🗡️ 暗影獵魔者 (Reaper)
      // ==========================================
      const eyeColor = aTier >= 5 ? '#ffd700' : aTier === 4 ? '#ee44ff' : '#cc44ff';

      classBodySvg = `
        <!-- Shadow Cowl & Cape (Tier Adaptive) -->
        <polygon points="24,14 15,56 24,56" fill="${armorTheme.cape}"/>
        <polygon points="40,14 49,56 40,56" fill="${armorTheme.cape}"/>

        <!-- Dark Cowl Head -->
        <rect x="24" y="14" width="16" height="8" fill="${armorTheme.helm}"/>
        <rect x="23" y="17" width="3" height="15" fill="${armorTheme.helm}"/>
        <rect x="38" y="17" width="3" height="15" fill="${armorTheme.helm}"/>

        <!-- Assassin Mask (Covering mouth) -->
        <rect x="26" y="20" width="12" height="11" fill="${armorTheme.dark}"/>

        <!-- Glowing Piercing Assassin Eyes -->
        <rect x="28" y="23" width="3" height="2" fill="${eyeColor}"/>
        <rect x="33" y="23" width="3" height="2" fill="${eyeColor}"/>
        <rect x="29" y="23" width="1" height="1" fill="#ffffff"/>
        <rect x="34" y="23" width="1" height="1" fill="#ffffff"/>

        <!-- Shadow Longcoat -->
        <rect x="24" y="31" width="16" height="18" fill="${armorTheme.main}"/>
        <rect x="28" y="33" width="8" height="14" fill="${armorTheme.dark}"/>
        <rect x="26" y="44" width="12" height="2" fill="${armorTheme.trim}"/>

        <!-- Hands & Bracers -->
        <rect x="20" y="40" width="4" height="4" fill="${armorTheme.helm}"/>
        <rect x="40" y="40" width="4" height="4" fill="${armorTheme.helm}"/>

        <!-- Dark Boots -->
        <rect x="26" y="49" width="5" height="9" fill="${armorTheme.dark}"/>
        <rect x="33" y="49" width="5" height="9" fill="${armorTheme.dark}"/>
        <rect x="25" y="58" width="6" height="4" fill="${armorTheme.helm}"/>
        <rect x="33" y="58" width="6" height="4" fill="${armorTheme.helm}"/>

        <!-- Dual Reverse-Grip Poisoned Daggers (Weapon Tier Evolving) -->
        <!-- Left Dagger -->
        <g>
          <rect x="18" y="37" width="2" height="4" fill="${weaponTheme.hilt}"/>
          <polygon points="19,41 15,53 20,49" fill="${weaponTheme.blade}"/>
          <line x1="15" y1="46" x2="15" y2="53" stroke="${weaponTheme.glow}" stroke-width="1.5"/>
        </g>
        <!-- Right Dagger -->
        <g>
          <rect x="44" y="37" width="2" height="4" fill="${weaponTheme.hilt}"/>
          <polygon points="45,41 41,53 46,49" fill="${weaponTheme.blade}"/>
          <line x1="41" y1="46" x2="41" y2="53" stroke="${weaponTheme.glow}" stroke-width="1.5"/>
        </g>
      `;
    } else if (heroClass === 'knight') {
      // ==========================================
      // 🛡️ 聖堂聖騎士 (Knight)
      // ==========================================
      const plumeColor = aTier === 1 ? '#775533' : aTier === 2 ? '#2255aa' : aTier === 3 ? '#ffd700' : aTier === 4 ? '#9933ee' : aTier === 5 ? '#ee2222' : '#ffffff';

      classBodySvg = `
        <!-- Crusader Great Helm (Tier Adaptive) -->
        <rect x="24" y="14" width="16" height="17" fill="${armorTheme.helm}"/>
        <!-- Helmet Shading & Visor Slits -->
        <rect x="25" y="15" width="14" height="3" fill="${armorTheme.dark}"/>

        <!-- Plume Feather on Helm -->
        <polygon points="32,7 30,14 34,14" fill="${plumeColor}"/>
        <polygon points="34,6 32,13 36,13" fill="${armorTheme.trim}"/>
        ${aTier === 6 ? `<polygon points="23,12 18,5 24,16" fill="#ffd700"/>` : ''}
        ${aTier === 6 ? `<polygon points="41,12 46,5 40,16" fill="#ffd700"/>` : ''}

        <!-- Gold / Visor Slit -->
        <rect x="31" y="21" width="2" height="8" fill="${armorTheme.trim}"/>
        <rect x="27" y="23" width="10" height="2" fill="${armorTheme.trim}"/>
        <rect x="28" y="24" width="2" height="1" fill="#111111"/>
        <rect x="34" y="24" width="2" height="1" fill="#111111"/>

        <!-- Body & Crusader Tabard -->
        <rect x="24" y="31" width="16" height="17" fill="${armorTheme.metal}"/>
        <rect x="22" y="33" width="3" height="8" fill="${armorTheme.main}"/>
        <rect x="39" y="33" width="3" height="8" fill="${armorTheme.main}"/>

        <!-- Cross on Chest Tabard -->
        <rect x="31" y="33" width="2" height="13" fill="${armorTheme.trim}"/>
        <rect x="27" y="36" width="10" height="2" fill="${armorTheme.trim}"/>

        <!-- Hands & Gauntlets -->
        <rect x="21" y="41" width="3" height="4" fill="${armorTheme.dark}"/>
        <rect x="40" y="41" width="3" height="4" fill="${armorTheme.dark}"/>

        <!-- Legs & Greaves -->
        <rect x="26" y="48" width="5" height="10" fill="${armorTheme.dark}"/>
        <rect x="33" y="48" width="5" height="10" fill="${armorTheme.dark}"/>
        <rect x="25" y="58" width="6" height="4" fill="${armorTheme.main}"/>
        <rect x="33" y="58" width="6" height="4" fill="${armorTheme.main}"/>

        <!-- Left Hand: Crusader Kite Shield (Armor Tier Evolving) -->
        <g>
          <path d="M 12,32 L 22,32 L 20,48 L 12,40 Z" fill="${armorTheme.main}" stroke="${armorTheme.dark}" stroke-width="1"/>
          <!-- Shield Cross -->
          <line x1="16" y1="32" x2="16" y2="44" stroke="${armorTheme.trim}" stroke-width="2"/>
          <line x1="12" y1="36" x2="21" y2="36" stroke="${armorTheme.trim}" stroke-width="2"/>
          <!-- Shield Rim -->
          <line x1="12" y1="32" x2="22" y2="32" stroke="${armorTheme.metal}" stroke-width="1.5"/>
        </g>

        <!-- Right Hand: Arming Sword (Weapon Tier Evolving) -->
        <g>
          <!-- Hilt & Crossguard -->
          <rect x="43" y="39" width="3" height="4" fill="${weaponTheme.hilt}"/>
          <rect x="40" y="37" width="9" height="2" fill="${weaponTheme.hilt}"/>
          <!-- Blade -->
          <rect x="44" y="20" width="3" height="17" fill="${weaponTheme.blade}"/>
          <polygon points="44,20 47,20 45.5,15" fill="${weaponTheme.blade}"/>
          <!-- Blade Core Line & Sparkle -->
          <line x1="45.5" y1="21" x2="45.5" y2="36" stroke="${weaponTheme.spark}" stroke-width="1"/>
          ${wTier >= 3 ? `<rect x="44.5" y="16" width="2" height="2" fill="${weaponTheme.glow}"/>` : ''}
        </g>
      `;
    } else {
      // ==========================================
      // 🔰 見習村民 / 路人見習生 (Novice / Villager - 路人)
      // ==========================================
      classBodySvg = `
        <!-- Messy Rookie Traveler Hair (Brown / Straw) -->
        <polygon points="25,18 23,12 30,13" fill="#6d4827"/>
        <polygon points="30,13 32,8 37,13" fill="#6d4827"/>
        <polygon points="36,13 41,11 39,18" fill="#6d4827"/>
        <rect x="25" y="14" width="14" height="6" fill="#7a5430"/>

        <!-- Simple Traveler Cloth Headband -->
        <rect x="25" y="18" width="14" height="3" fill="#a48057"/>
        <rect x="30" y="18" width="3" height="3" fill="#c4a57b"/>

        <!-- Ordinary Friendly Rookie Face -->
        ${faceSvg}

        <!-- Humble Rustic Linen Tunic (Earth Tone) -->
        <rect x="24" y="31" width="16" height="16" fill="#876644"/>
        <rect x="26" y="32" width="12" height="14" fill="#a5815b"/>
        <!-- Rough V-Neck Collar -->
        <polygon points="30,32 32,37 34,32" fill="#ffd2aa"/>

        <!-- Simple Rope / Leather Waist Belt with Iron Buckle -->
        <rect x="24" y="44" width="16" height="3" fill="#4d3622"/>
        <rect x="30" y="44" width="4" height="3" fill="#888888"/>

        <!-- Hands (Bare Traveler Hands) -->
        <rect x="21" y="39" width="3" height="4" fill="#ffd2aa"/>
        <rect x="40" y="39" width="3" height="4" fill="#ffd2aa"/>

        <!-- Loose Rustic Canvas Trousers -->
        <rect x="26" y="47" width="5" height="10" fill="#524336"/>
        <rect x="33" y="47" width="5" height="10" fill="#524336"/>

        <!-- Humble Wrapped Traveler Boots -->
        <rect x="25" y="57" width="6" height="4" fill="#6b4c2e"/>
        <rect x="33" y="57" width="6" height="4" fill="#6b4c2e"/>
        <line x1="25" y1="58" x2="31" y2="58" stroke="#a48057" stroke-width="1"/>
        <line x1="33" y1="58" x2="39" y2="58" stroke="#a48057" stroke-width="1"/>

        <!-- Right Hand: Practice Wooden Twig / Beginner Stick (見習木棒) -->
        <g>
          <rect x="42" y="35" width="3" height="18" fill="#80542b" rx="1"/>
          <line x1="43.5" y1="36" x2="43.5" y2="51" stroke="#aa7945" stroke-width="1"/>
          <!-- Small rope grip wrap -->
          <rect x="42" y="38" width="3" height="3" fill="#c4a57b"/>
        </g>
      `;
    }

    return wrapSvg(64, 64, `
      ${relicSvg}
      ${awakeningSvg}
      ${classBodySvg}
    `, 'pixel-hero-sprite');
  };

  // 15 Dungeon Bosses (80x80)
  const renderBoss = (bossId, variant = 'normal') => {
    // Color tint adjustments for Tower variants
    let filterStyle = '';
    if (variant === 'blood') filterStyle = 'filter: hue-rotate(330deg) saturate(1.8);';
    else if (variant === 'shadow') filterStyle = 'filter: hue-rotate(250deg) contrast(1.4);';
    else if (variant === 'gold') filterStyle = 'filter: sepia(1) saturate(3) hue-rotate(10deg);';
    else if (variant === 'void') filterStyle = 'filter: invert(0.2) hue-rotate(180deg) saturate(2);';

    let content = '';
    switch (bossId) {
      case 1: // Emerald Slime King
        content = `
          <!-- Crown -->
          <rect x="34" y="18" width="14" height="6" fill="#ffd700"/>
          <rect x="32" y="14" width="4" height="6" fill="#ffd700"/>
          <rect x="39" y="12" width="4" height="8" fill="#ffd700"/>
          <rect x="46" y="14" width="4" height="6" fill="#ffd700"/>
          <rect x="40" y="15" width="2" height="2" fill="#ff2222"/>
          <!-- Jelly Body -->
          <rect x="20" y="28" width="42" height="36" fill="#33cc66"/>
          <rect x="16" y="36" width="50" height="26" fill="#33cc66"/>
          <rect x="24" y="24" width="34" height="42" fill="#44ee77"/>
          <rect x="20" y="60" width="42" height="6" fill="#22aa55"/>
          <!-- Slime Eyes -->
          <rect x="28" y="36" width="6" height="8" fill="#14121d"/>
          <rect x="30" y="38" width="3" height="3" fill="#ffffff"/>
          <rect x="48" y="36" width="6" height="8" fill="#14121d"/>
          <rect x="50" y="38" width="3" height="3" fill="#ffffff"/>
          <!-- Cheerful Smile -->
          <rect x="36" y="48" width="10" height="4" fill="#146633"/>
        `;
        break;
      case 2: // Hornet Queen
        content = `
          <!-- Wings -->
          <rect x="12" y="20" width="22" height="18" fill="#88ddff" opacity="0.6"/>
          <rect x="48" y="20" width="22" height="18" fill="#88ddff" opacity="0.6"/>
          <!-- Head -->
          <rect x="34" y="26" width="14" height="12" fill="#ffd700"/>
          <rect x="32" y="28" width="4" height="6" fill="#ff2222"/>
          <rect x="46" y="28" width="4" height="6" fill="#ff2222"/>
          <!-- Antennae -->
          <rect x="32" y="18" width="2" height="8" fill="#222222"/>
          <rect x="48" y="18" width="2" height="8" fill="#222222"/>
          <!-- Striped Body -->
          <rect x="30" y="38" width="22" height="8" fill="#222222"/>
          <rect x="28" y="46" width="26" height="8" fill="#ffd700"/>
          <rect x="30" y="54" width="22" height="8" fill="#222222"/>
          <!-- Poison Stinger -->
          <polygon points="38,62 44,62 41,72" fill="#9900ff"/>
        `;
        break;
      case 3: // Goblin Scout Raider
        content = `
          <!-- Wolf Cowl -->
          <rect x="26" y="18" width="28" height="16" fill="#554433"/>
          <rect x="22" y="14" width="8" height="8" fill="#443322"/>
          <rect x="50" y="14" width="8" height="8" fill="#443322"/>
          <!-- Green Face -->
          <rect x="30" y="26" width="20" height="16" fill="#55aa33"/>
          <rect x="32" y="30" width="5" height="4" fill="#ffee22"/>
          <rect x="43" y="30" width="5" height="4" fill="#ffee22"/>
          <rect x="34" y="38" width="12" height="3" fill="#225511"/>
          <!-- Leather Tunic -->
          <rect x="28" y="42" width="24" height="18" fill="#774422"/>
          <!-- Dual Daggers -->
          <rect x="16" y="40" width="6" height="18" fill="#d0d0e0"/>
          <rect x="18" y="36" width="2" height="26" fill="#ffffff"/>
          <rect x="58" y="40" width="6" height="18" fill="#d0d0e0"/>
          <rect x="60" y="36" width="2" height="26" fill="#ffffff"/>
        `;
        break;
      case 4: // Dire Wolf Alpha
        content = `
          <!-- Ears -->
          <polygon points="24,16 32,16 28,6" fill="#888899"/>
          <polygon points="48,16 56,16 52,6" fill="#888899"/>
          <!-- Head -->
          <rect x="24" y="16" width="32" height="26" fill="#9999aa"/>
          <rect x="28" y="24" width="6" height="5" fill="#ff2222"/>
          <rect x="46" y="24" width="6" height="5" fill="#ff2222"/>
          <!-- Fangs & Snout -->
          <rect x="32" y="32" width="16" height="14" fill="#bbbbcc"/>
          <rect x="36" y="40" width="8" height="4" fill="#222222"/>
          <rect x="34" y="44" width="3" height="6" fill="#ffffff"/>
          <rect x="43" y="44" width="3" height="6" fill="#ffffff"/>
          <!-- Wolf Mane & Body -->
          <rect x="20" y="42" width="40" height="24" fill="#777788"/>
        `;
        break;
      case 5: // Venom Arachnid Spider
        content = `
          <!-- 8 Legs -->
          <rect x="6" y="30" width="16" height="4" fill="#442255"/>
          <rect x="6" y="40" width="18" height="4" fill="#442255"/>
          <rect x="58" y="30" width="16" height="4" fill="#442255"/>
          <rect x="56" y="40" width="18" height="4" fill="#442255"/>
          <!-- Spider Abdomen -->
          <circle cx="40" cy="46" r="20" fill="#281438"/>
          <circle cx="40" cy="46" r="14" fill="#441a66"/>
          <!-- 8 Glowing Red Eyes -->
          <rect x="32" y="40" width="3" height="3" fill="#ff0044"/>
          <rect x="36" y="38" width="3" height="3" fill="#ff0044"/>
          <rect x="41" y="38" width="3" height="3" fill="#ff0044"/>
          <rect x="45" y="40" width="3" height="3" fill="#ff0044"/>
          <rect x="34" y="45" width="2" height="2" fill="#ff0044"/>
          <rect x="44" y="45" width="2" height="2" fill="#ff0044"/>
          <!-- Chelicerae Fangs -->
          <polygon points="36,54 40,54 38,62" fill="#aa00ff"/>
          <polygon points="40,54 44,54 42,62" fill="#aa00ff"/>
        `;
        break;
      case 6: // Gargoyle Warden
        content = `
          <!-- Stone Wings -->
          <polygon points="8,14 30,30 18,50" fill="#606070"/>
          <polygon points="72,14 50,30 62,50" fill="#606070"/>
          <!-- Horns -->
          <rect x="28" y="10" width="5" height="10" fill="#484858"/>
          <rect x="47" y="10" width="5" height="10" fill="#484858"/>
          <!-- Demon Stone Face -->
          <rect x="28" y="20" width="24" height="22" fill="#787888"/>
          <rect x="32" y="26" width="6" height="5" fill="#ffaa00"/>
          <rect x="42" y="26" width="6" height="5" fill="#ffaa00"/>
          <!-- Heavy Stone Torso -->
          <rect x="24" y="42" width="32" height="26" fill="#686878"/>
          <rect x="28" y="46" width="24" height="18" fill="#585868"/>
        `;
        break;
      case 7: // Skeleton Deathknight
        content = `
          <!-- Horned Dark Helm -->
          <rect x="26" y="12" width="28" height="16" fill="#202028"/>
          <polygon points="22,12 28,12 24,4" fill="#14141c"/>
          <polygon points="52,12 58,12 56,4" fill="#14141c"/>
          <!-- Glowing Cyan Nether Eye Sockets -->
          <rect x="30" y="24" width="20" height="16" fill="#e8e8e8"/>
          <rect x="33" y="28" width="5" height="5" fill="#00ffff"/>
          <rect x="42" y="28" width="5" height="5" fill="#00ffff"/>
          <!-- Black Plate Armor & Cloak -->
          <rect x="22" y="40" width="36" height="30" fill="#2a2a36"/>
          <rect x="28" y="44" width="24" height="22" fill="#404052"/>
          <!-- Executioner Greatsword -->
          <rect x="62" y="14" width="8" height="52" fill="#c0c0d8"/>
          <rect x="65" y="10" width="2" height="60" fill="#ffffff"/>
        `;
        break;
      case 8: // Minotaur Warlord
        content = `
          <!-- Bull Horns -->
          <rect x="16" y="10" width="14" height="6" fill="#ddbb77"/>
          <rect x="14" y="6" width="6" height="8" fill="#eedd99"/>
          <rect x="50" y="10" width="14" height="6" fill="#ddbb77"/>
          <rect x="60" y="6" width="6" height="8" fill="#eedd99"/>
          <!-- Fierce Beast Head -->
          <rect x="26" y="16" width="28" height="24" fill="#884422"/>
          <rect x="30" y="22" width="6" height="4" fill="#ff2200"/>
          <rect x="44" y="22" width="6" height="4" fill="#ff2200"/>
          <!-- Nose Ring -->
          <circle cx="40" cy="36" r="4" fill="none" stroke="#ffd700" stroke-width="2"/>
          <!-- Hulking Muscular Torso -->
          <rect x="20" y="40" width="40" height="30" fill="#6e3418"/>
          <!-- Dual-Bladed Battle Axe -->
          <rect x="62" y="20" width="6" height="48" fill="#443322"/>
          <polygon points="54,24 76,24 65,38" fill="#a0a0b0"/>
          <polygon points="54,48 76,48 65,34" fill="#a0a0b0"/>
        `;
        break;
      case 9: // Hydra Serpent
        content = `
          <!-- Multi-Head Serpent Necks -->
          <rect x="18" y="20" width="8" height="30" fill="#228855"/>
          <rect x="36" y="14" width="8" height="36" fill="#2e9960"/>
          <rect x="54" y="20" width="8" height="30" fill="#228855"/>
          <!-- Left Head -->
          <circle cx="22" cy="18" r="8" fill="#33aa66"/>
          <rect x="20" y="16" width="3" height="3" fill="#ff0000"/>
          <!-- Center Main Head -->
          <circle cx="40" cy="12" r="10" fill="#44cc77"/>
          <rect x="36" y="10" width="4" height="4" fill="#ffff00"/>
          <rect x="42" y="10" width="4" height="4" fill="#ffff00"/>
          <!-- Right Head -->
          <circle cx="58" cy="18" r="8" fill="#33aa66"/>
          <rect x="57" y="16" width="3" height="3" fill="#ff0000"/>
          <!-- Giant Serpent Body Coil -->
          <ellipse cx="40" cy="58" rx="28" ry="16" fill="#18663c"/>
        `;
        break;
      case 10: // Frost Valkyrie
        content = `
          <!-- Ice Wings -->
          <polygon points="6,18 28,34 16,58" fill="#88e0ff" opacity="0.8"/>
          <polygon points="74,18 52,34 64,58" fill="#88e0ff" opacity="0.8"/>
          <!-- Winged Silver Helm -->
          <rect x="28" y="14" width="24" height="14" fill="#cce0f0"/>
          <polygon points="22,12 28,18 22,24" fill="#ffffff"/>
          <polygon points="58,12 52,18 58,24" fill="#ffffff"/>
          <!-- Pale Face & Glowing Blue Eyes -->
          <rect x="30" y="24" width="20" height="14" fill="#f0e8e8"/>
          <rect x="34" y="28" width="4" height="4" fill="#00bbff"/>
          <rect x="42" y="28" width="4" height="4" fill="#00bbff"/>
          <!-- Silver Plate & Fur Cloak -->
          <rect x="26" y="38" width="28" height="30" fill="#99b8d4"/>
          <!-- Frost Spear Lance -->
          <rect x="62" y="4" width="4" height="66" fill="#ffffff"/>
          <polygon points="60,4 68,4 64,-2" fill="#55ccff"/>
        `;
        break;
      case 11: // Magma Golem
        content = `
          <!-- Obsidian Rocks with Lava Core -->
          <rect x="22" y="12" width="36" height="30" fill="#2a2024"/>
          <rect x="28" y="22" width="8" height="6" fill="#ff5500"/>
          <rect x="44" y="22" width="8" height="6" fill="#ff5500"/>
          <rect x="34" y="24" width="12" height="3" fill="#ffff44"/>
          <!-- Molten Core Chest -->
          <rect x="18" y="40" width="44" height="32" fill="#201a1c"/>
          <circle cx="40" cy="52" r="12" fill="#ff3300"/>
          <circle cx="40" cy="52" r="8" fill="#ff9900"/>
          <circle cx="40" cy="52" r="4" fill="#ffff66"/>
          <!-- Lava Sparks -->
          <rect x="14" y="46" width="4" height="4" fill="#ff7700"/>
          <rect x="64" y="42" width="4" height="4" fill="#ffaa00"/>
        `;
        break;
      case 12: // Leviathan Sea Serpent
        content = `
          <!-- Storm Sea Dragon -->
          <path d="M 12 50 Q 24 16 40 32 T 68 50" fill="none" stroke="#2277bb" stroke-width="14"/>
          <path d="M 12 50 Q 24 16 40 32 T 68 50" fill="none" stroke="#44aaff" stroke-width="8"/>
          <!-- Spiny Fins -->
          <polygon points="26,14 32,8 36,18" fill="#88ddff"/>
          <polygon points="46,14 52,8 56,18" fill="#88ddff"/>
          <!-- Glowing Sea Dragon Head -->
          <circle cx="68" cy="46" r="12" fill="#115599"/>
          <circle cx="70" cy="44" r="4" fill="#ffff00"/>
        `;
        break;
      case 13: // Golden Griffin Emperor
        content = `
          <!-- Royal Gold Wings -->
          <polygon points="4,12 28,30 16,56" fill="#ffd700"/>
          <polygon points="76,12 52,30 64,56" fill="#ffd700"/>
          <!-- Eagle Head & Crown -->
          <circle cx="40" cy="22" r="14" fill="#eedd88"/>
          <polygon points="48,22 58,26 48,30" fill="#ff8800"/>
          <rect x="36" y="8" width="8" height="6" fill="#ffd700"/>
          <rect x="36" y="20" width="4" height="4" fill="#222222"/>
          <!-- Lion Body -->
          <rect x="24" y="36" width="32" height="34" fill="#c89b3c"/>
          <rect x="22" y="66" width="10" height="6" fill="#a07820"/>
          <rect x="48" y="66" width="10" height="6" fill="#a07820"/>
        `;
        break;
      case 14: // Abyss Archmage
        content = `
          <!-- Levitating Hexagram Magic Circle Behind -->
          <circle cx="40" cy="40" r="32" fill="none" stroke="#aa44ff" stroke-width="2" stroke-dasharray="6,4"/>
          <!-- Mystic Hood & Mask -->
          <polygon points="24,30 56,30 40,8" fill="#3a1c66"/>
          <rect x="32" y="24" width="16" height="14" fill="#ffd700"/>
          <rect x="34" y="28" width="4" height="4" fill="#aa00ff"/>
          <rect x="42" y="28" width="4" height="4" fill="#aa00ff"/>
          <!-- Robe & Floating Grimoire -->
          <polygon points="22,40 58,40 64,74 16,74" fill="#2a144e"/>
          <!-- Book -->
          <rect x="58" y="44" width="14" height="18" fill="#6622aa"/>
          <rect x="62" y="48" width="6" height="10" fill="#ffd700"/>
        `;
        break;
      case 15: // Chrono Dragon Omega
        content = `
          <!-- Mechanical Gear Wings -->
          <polygon points="2,16 26,28 12,54" fill="#9966cc"/>
          <polygon points="78,16 54,28 68,54" fill="#9966cc"/>
          <!-- Clockwork Head -->
          <polygon points="28,24 52,24 40,6" fill="#442266"/>
          <rect x="32" y="18" width="5" height="5" fill="#ffd700"/>
          <rect x="43" y="18" width="5" height="5" fill="#ffd700"/>
          <!-- Giant Chrono Clock in Chest -->
          <circle cx="40" cy="46" r="20" fill="#221133"/>
          <circle cx="40" cy="46" r="16" fill="#331c4e" stroke="#ffd700" stroke-width="2"/>
          <line x1="40" y1="46" x2="40" y2="36" stroke="#ffffff" stroke-width="2"/>
          <line x1="40" y1="46" x2="48" y2="46" stroke="#ffd700" stroke-width="2"/>
          <!-- Tail & Claws -->
          <rect x="20" y="66" width="40" height="8" fill="#331c4e"/>
        `;
        break;
      default:
        content = `<circle cx="40" cy="40" r="24" fill="#888888"/>`;
    }

    return wrapSvg(80, 80, `<g style="${filterStyle}">${content}</g>`, 'pixel-boss-sprite');
  };

  // 12 Tower Minions (40x40)
  const renderMinion = (minionKey) => {
    let content = '';
    switch (minionKey) {
      case 'mini_slime':
        content = `
          <rect x="10" y="14" width="20" height="18" fill="#44dd66"/>
          <rect x="8" y="20" width="24" height="12" fill="#44dd66"/>
          <rect x="13" y="18" width="4" height="4" fill="#14121d"/>
          <rect x="23" y="18" width="4" height="4" fill="#14121d"/>
        `;
        break;
      case 'cave_bat':
        content = `
          <polygon points="2,12 14,20 8,30" fill="#665577"/>
          <polygon points="38,12 26,20 32,30" fill="#665577"/>
          <circle cx="20" cy="20" r="8" fill="#443355"/>
          <rect x="17" y="18" width="2" height="2" fill="#ff2222"/>
          <rect x="21" y="18" width="2" height="2" fill="#ff2222"/>
        `;
        break;
      case 'plague_rat':
        content = `
          <rect x="12" y="18" width="18" height="12" fill="#666666"/>
          <polygon points="30,22 36,24 30,26" fill="#888888"/>
          <rect x="27" y="20" width="2" height="2" fill="#ff0000"/>
          <line x1="8" y1="24" x2="2" y2="28" stroke="#ff8888" stroke-width="2"/>
        `;
        break;
      case 'shroom':
        content = `
          <ellipse cx="20" cy="16" rx="14" ry="10" fill="#ee3333"/>
          <circle cx="14" cy="14" r="2" fill="#ffffff"/>
          <circle cx="24" cy="14" r="2" fill="#ffffff"/>
          <rect x="15" y="22" width="10" height="12" fill="#eeddbb"/>
          <rect x="17" y="25" width="2" height="2" fill="#222222"/>
          <rect x="21" y="25" width="2" height="2" fill="#222222"/>
        `;
        break;
      case 'goblin_grunt':
        content = `
          <circle cx="20" cy="16" r="8" fill="#55aa33"/>
          <rect x="17" y="14" width="2" height="2" fill="#ffff00"/>
          <rect x="21" y="14" width="2" height="2" fill="#ffff00"/>
          <rect x="14" y="24" width="12" height="12" fill="#774422"/>
          <rect x="6" y="20" width="6" height="4" fill="#a0a0a0"/>
        `;
        break;
      case 'skeleton_grunt':
        content = `
          <circle cx="20" cy="14" r="7" fill="#e0e0e0"/>
          <rect x="17" y="13" width="2" height="2" fill="#14121d"/>
          <rect x="21" y="13" width="2" height="2" fill="#14121d"/>
          <rect x="16" y="22" width="8" height="12" fill="#cccccc"/>
          <line x1="28" y1="16" x2="36" y2="32" stroke="#d0d0d0" stroke-width="2"/>
        `;
        break;
      case 'evil_eye':
        content = `
          <circle cx="20" cy="20" r="12" fill="#552277"/>
          <circle cx="20" cy="20" r="7" fill="#ffffff"/>
          <circle cx="20" cy="20" r="4" fill="#ff0000"/>
          <line x1="10" y1="10" x2="4" y2="4" stroke="#552277" stroke-width="2"/>
          <line x1="30" y1="10" x2="36" y2="4" stroke="#552277" stroke-width="2"/>
        `;
        break;
      case 'mimic_chest': // Bonus coin monster!
        content = `
          <rect x="8" y="14" width="24" height="10" fill="#995522"/>
          <rect x="8" y="22" width="24" height="12" fill="#773311"/>
          <!-- Monster Teeth & Tongue -->
          <polygon points="12,22 15,22 13.5,18" fill="#ffffff"/>
          <polygon points="18,22 21,22 19.5,18" fill="#ffffff"/>
          <polygon points="24,22 27,22 25.5,18" fill="#ffffff"/>
          <path d="M 16 26 Q 24 34 22 38" fill="none" stroke="#ff3366" stroke-width="3"/>
          <circle cx="10" cy="12" r="3" fill="#ffd700"/>
          <circle cx="28" cy="12" r="3" fill="#ffd700"/>
        `;
        break;
      case 'wisp':
        content = `
          <circle cx="20" cy="20" r="10" fill="#00ffff" opacity="0.8"/>
          <circle cx="20" cy="20" r="6" fill="#ffffff"/>
          <circle cx="18" cy="18" r="2" fill="#0088cc"/>
          <circle cx="22" cy="18" r="2" fill="#0088cc"/>
        `;
        break;
      case 'living_armor':
        content = `
          <rect x="12" y="10" width="16" height="12" fill="#505060"/>
          <rect x="10" y="22" width="20" height="14" fill="#686880"/>
          <rect x="16" y="14" width="8" height="2" fill="#00ffff"/>
        `;
        break;
      case 'grimoire':
        content = `
          <rect x="10" y="12" width="20" height="20" fill="#661188"/>
          <rect x="12" y="14" width="16" height="16" fill="#eeddbb"/>
          <line x1="20" y1="14" x2="20" y2="30" stroke="#886633" stroke-width="2"/>
          <polygon points="20,8 14,12 26,12" fill="#aa44ff"/>
        `;
        break;
      case 'void_worm':
        content = `
          <circle cx="12" cy="28" r="6" fill="#331155"/>
          <circle cx="20" cy="22" r="7" fill="#441a66"/>
          <circle cx="28" cy="16" r="8" fill="#552277"/>
          <circle cx="30" cy="14" r="2" fill="#ff00ff"/>
        `;
        break;
      case 'dojo_dummy':
        content = `
          <!-- Cross wooden stand -->
          <rect x="18" y="28" width="4" height="10" fill="#5c3818"/>
          <rect x="10" y="36" width="20" height="3" fill="#3e230c"/>
          <!-- Straw body -->
          <rect x="14" y="14" width="12" height="15" fill="#c29b38" rx="2"/>
          <line x1="14" y1="18" x2="26" y2="18" stroke="#8a671c" stroke-width="1.5"/>
          <line x1="14" y1="22" x2="26" y2="22" stroke="#8a671c" stroke-width="1.5"/>
          <line x1="14" y1="26" x2="26" y2="26" stroke="#8a671c" stroke-width="1.5"/>
          <!-- Wooden dummy arms -->
          <rect x="6" y="16" width="28" height="4" fill="#8d5b2d" rx="1"/>
          <!-- Head / Straw top -->
          <circle cx="20" cy="10" r="5" fill="#d4ad4b"/>
          <rect x="16" y="8" width="8" height="2" fill="#cc2222"/>
          <circle cx="20" cy="20" r="3" fill="#ff4444" opacity="0.8"/>
        `;
        break;
      default:
        content = `<circle cx="20" cy="20" r="10" fill="#777777"/>`;
    }
    return wrapSvg(40, 40, content, 'pixel-minion-sprite');
  };

  // 10 Food Dishes (32x32)
  const renderFood = (foodKey) => {
    let content = '';
    switch (foodKey) {
      case 'bread':
        content = `
          <rect x="6" y="10" width="20" height="12" fill="#885522"/>
          <rect x="8" y="8" width="16" height="14" fill="#aa7733"/>
          <line x1="12" y1="10" x2="14" y2="16" stroke="#eedd88" stroke-width="2"/>
          <line x1="18" y1="10" x2="20" y2="16" stroke="#eedd88" stroke-width="2"/>
        `;
        break;
      case 'soup':
        content = `
          <rect x="6" y="16" width="20" height="10" fill="#774422"/>
          <ellipse cx="16" cy="16" rx="10" ry="4" fill="#3388ff"/>
          <circle cx="13" cy="15" r="2" fill="#88ddff"/>
          <circle cx="18" cy="16" r="2" fill="#00ffff"/>
        `;
        break;
      case 'drumstick':
        content = `
          <circle cx="14" cy="14" r="8" fill="#a04018"/>
          <circle cx="14" cy="14" r="6" fill="#c05520"/>
          <rect x="18" y="18" width="8" height="4" fill="#eeddcc"/>
          <circle cx="26" cy="20" r="3" fill="#eeddcc"/>
        `;
        break;
      case 'steak':
        content = `
          <rect x="4" y="14" width="24" height="12" fill="#3a3030"/>
          <rect x="8" y="12" width="16" height="10" fill="#aa2222"/>
          <rect x="10" y="14" width="12" height="6" fill="#cc3333"/>
          <line x1="12" y1="12" x2="14" y2="20" stroke="#eeddcc" stroke-width="1"/>
        `;
        break;
      case 'chalice':
        content = `
          <rect x="10" y="6" width="12" height="12" fill="#ffd700"/>
          <rect x="14" y="18" width="4" height="6" fill="#c89b3c"/>
          <rect x="10" y="24" width="12" height="4" fill="#ffd700"/>
          <circle cx="16" cy="10" r="3" fill="#44ff88"/>
        `;
        break;
      case 'curry': // Timed buff: ATK +25%
        content = `
          <rect x="4" y="14" width="24" height="10" fill="#884422"/>
          <ellipse cx="16" cy="14" rx="11" ry="5" fill="#ee5500"/>
          <polygon points="12,10 16,4 18,10" fill="#ff2200"/>
          <polygon points="18,12 22,6 24,12" fill="#ffcc00"/>
        `;
        break;
      case 'stew': // Timed buff: DEF +35%
        content = `
          <rect x="6" y="12" width="20" height="14" fill="#404050"/>
          <rect x="4" y="10" width="24" height="4" fill="#585868"/>
          <ellipse cx="16" cy="12" rx="9" ry="3" fill="#a05520"/>
          <circle cx="13" cy="12" r="2" fill="#eedd88"/>
        `;
        break;
      case 'tea': // Timed buff: Time +2s
        content = `
          <rect x="10" y="12" width="12" height="14" fill="#33aa66"/>
          <rect x="22" y="16" width="4" height="6" fill="none" stroke="#33aa66" stroke-width="2"/>
          <path d="M 14 8 Q 16 4 14 2" stroke="#aaffcc" stroke-width="2" fill="none"/>
        `;
        break;
      case 'truffle_soup': // Timed buff: Gold +50%
        content = `
          <rect x="6" y="14" width="20" height="10" fill="#ffd700"/>
          <ellipse cx="16" cy="14" rx="10" ry="4" fill="#fcd736"/>
          <circle cx="12" cy="13" r="2" fill="#442211"/>
          <circle cx="18" cy="14" r="2" fill="#442211"/>
          <rect x="15" y="4" width="2" height="4" fill="#ffff88"/>
        `;
        break;
      case 'feast': // Timed buff: All +30%
        content = `
          <rect x="2" y="18" width="28" height="8" fill="#ffd700"/>
          <circle cx="10" cy="14" r="5" fill="#a03010"/>
          <rect x="16" y="10" width="10" height="8" fill="#ff4444"/>
          <polygon points="12,6 16,2 20,6" fill="#ffd700"/>
        `;
        break;
      default:
        content = `<circle cx="16" cy="16" r="10" fill="#aa8844"/>`;
    }
    return wrapSvg(32, 32, content, 'pixel-food-sprite');
  };

  // Leave Passes & Scrolls (32x32)
  const renderScroll = (scrollKey) => {
    let ribbonColor = '#c89b3c';
    let sealColor = '#ff2222';
    if (scrollKey === 'pass_1d') { ribbonColor = '#887766'; sealColor = '#b87333'; }
    else if (scrollKey === 'pass_3d') { ribbonColor = '#44aa44'; sealColor = '#c0c0c0'; }
    else if (scrollKey === 'pass_7d') { ribbonColor = '#3388ff'; sealColor = '#ffd700'; }
    else if (scrollKey === 'pass_14d') { ribbonColor = '#9933ee'; sealColor = '#e0a0ff'; }
    else if (scrollKey === 'pass_30d') { ribbonColor = '#ffd700'; sealColor = '#ff2200'; }
    else if (scrollKey === 'guard_scroll') { ribbonColor = '#00ddff'; sealColor = '#ffffff'; }

    return wrapSvg(32, 32, `
      <rect x="6" y="6" width="20" height="20" fill="#eeddbb"/>
      <rect x="4" y="6" width="4" height="20" fill="#c4aa80"/>
      <rect x="24" y="6" width="4" height="20" fill="#c4aa80"/>
      <rect x="10" y="14" width="12" height="4" fill="${ribbonColor}"/>
      <circle cx="16" cy="16" r="4" fill="${sealColor}"/>
      <line x1="10" y1="10" x2="22" y2="10" stroke="#997755" stroke-width="1"/>
      <line x1="10" y1="22" x2="22" y2="22" stroke="#997755" stroke-width="1"/>
    `, 'pixel-scroll-sprite');
  };

  // Medieval Battle Duel Arena Backdrop (320x140) with dynamic biomes
  const renderMedievalBackdrop = (mode = 'dungeon', stageId = 1, towerFloor = 1) => {
    // 1. DOJO TRAINING ARENA (修煉道場 / 到場)
    if (mode === 'dojo') {
      return `
        <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
          <!-- Cedar Wood Dojo Wall -->
          <rect width="320" height="140" fill="#24160e"/>
          <rect x="0" y="0" width="320" height="18" fill="#180e09"/>
          <!-- Wooden Pillar Frames -->
          <rect x="18" y="0" width="12" height="105" fill="#3b2316"/>
          <rect x="148" y="0" width="24" height="105" fill="#321d13"/>
          <rect x="290" y="0" width="12" height="105" fill="#3b2316"/>
          <!-- Shoji Screen Grids -->
          <rect x="36" y="22" width="106" height="75" fill="#e8d8be" opacity="0.85"/>
          <rect x="178" y="22" width="106" height="75" fill="#e8d8be" opacity="0.85"/>
          <line x1="36" y1="46" x2="142" y2="46" stroke="#4a2e1d" stroke-width="2"/>
          <line x1="36" y1="70" x2="142" y2="70" stroke="#4a2e1d" stroke-width="2"/>
          <line x1="71" y1="22" x2="71" y2="97" stroke="#4a2e1d" stroke-width="2"/>
          <line x1="107" y1="22" x2="107" y2="97" stroke="#4a2e1d" stroke-width="2"/>
          <line x1="178" y1="46" x2="284" y2="46" stroke="#4a2e1d" stroke-width="2"/>
          <line x1="178" y1="70" x2="284" y2="70" stroke="#4a2e1d" stroke-width="2"/>
          <line x1="213" y1="22" x2="213" y2="97" stroke="#4a2e1d" stroke-width="2"/>
          <line x1="249" y1="22" x2="249" y2="97" stroke="#4a2e1d" stroke-width="2"/>

          <!-- Center Dojo Martial Banner -->
          <rect x="150" y="16" width="20" height="48" fill="#881818"/>
          <polygon points="150,64 160,72 170,64" fill="#881818"/>
          <rect x="148" y="14" width="24" height="3" fill="#d4af37"/>
          <rect x="157" y="26" width="6" height="2" fill="#ffd700"/>
          <rect x="159" y="26" width="2" height="14" fill="#ffd700"/>
          <rect x="155" y="32" width="10" height="2" fill="#ffd700"/>
          <rect x="156" y="44" width="8" height="8" fill="#ffd700"/>

          <!-- Left Weapon Rack (Swords & Spears) -->
          <rect x="42" y="60" width="30" height="42" fill="#422919"/>
          <rect x="44" y="50" width="3" height="46" fill="#c0c0c0"/>
          <rect x="43" y="44" width="5" height="6" fill="#ffd700"/>
          <rect x="54" y="48" width="3" height="48" fill="#a0a0a0"/>
          <rect x="64" y="52" width="3" height="44" fill="#c0c0c0"/>

          <!-- Right Training Straw Dummy -->
          <rect x="250" y="55" width="8" height="45" fill="#52341d"/>
          <circle cx="254" cy="50" r="7" fill="#c49a56"/>
          <rect x="248" y="58" width="12" height="22" fill="#ba9048"/>
          <line x1="238" y1="64" x2="270" y2="64" stroke="#ba9048" stroke-width="4"/>

          <!-- Paper Lanterns -->
          <g class="torch-anim-left">
            <rect x="16" y="30" width="16" height="20" fill="#ffeedd"/>
            <rect x="16" y="28" width="16" height="2" fill="#881818"/>
            <rect x="16" y="50" width="16" height="2" fill="#881818"/>
            <circle cx="24" cy="40" r="6" fill="#ffaa22" opacity="0.8"/>
            <circle cx="24" cy="40" r="16" fill="rgba(255,160,30,0.2)"/>
          </g>
          <g class="torch-anim-right">
            <rect x="288" y="30" width="16" height="20" fill="#ffeedd"/>
            <rect x="288" y="28" width="16" height="2" fill="#881818"/>
            <rect x="288" y="50" width="16" height="2" fill="#881818"/>
            <circle cx="296" cy="40" r="6" fill="#ffaa22" opacity="0.8"/>
            <circle cx="296" cy="40" r="16" fill="rgba(255,160,30,0.2)"/>
          </g>

          <!-- Polished Hardwood Floor -->
          <rect x="0" y="105" width="320" height="35" fill="#3d2415"/>
          <line x1="0" y1="105" x2="320" y2="105" stroke="#54331e" stroke-width="2"/>
          <line x1="0" y1="118" x2="320" y2="118" stroke="#311c10" stroke-width="1.5"/>
          <line x1="0" y1="130" x2="320" y2="130" stroke="#26150b" stroke-width="1"/>
          <line x1="55" y1="105" x2="45" y2="140" stroke="#311c10" stroke-width="1.5"/>
          <line x1="125" y1="105" x2="115" y2="140" stroke="#311c10" stroke-width="1.5"/>
          <line x1="195" y1="105" x2="190" y2="140" stroke="#311c10" stroke-width="1.5"/>
          <line x1="265" y1="105" x2="270" y2="140" stroke="#311c10" stroke-width="1.5"/>
        </svg>
      `;
    }

    // 2. DUNGEON 15-STAGE UNIQUE BIOMES
    if (mode === 'dungeon') {
      const sId = parseInt(stageId, 10) || 1;

      // Theme 1: Stages 1-2 (B1F-B2F) 翡翠幽森與花谷地窟 (Emerald Mossy Forest Crypt)
      if (sId <= 2) {
        return `
          <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect width="320" height="140" fill="#0d1810"/>
            <!-- Mossy Stone Blocks -->
            <rect x="0" y="0" width="76" height="24" fill="#142618"/><rect x="80" y="0" width="76" height="24" fill="#182e1d"/><rect x="160" y="0" width="76" height="24" fill="#142618"/><rect x="240" y="0" width="80" height="24" fill="#182e1d"/>
            <rect x="0" y="26" width="36" height="24" fill="#182e1d"/><rect x="40" y="26" width="76" height="24" fill="#1b3622"/><rect x="120" y="26" width="76" height="24" fill="#182e1d"/><rect x="200" y="26" width="76" height="24" fill="#1b3622"/><rect x="280" y="26" width="40" height="24" fill="#182e1d"/>
            <rect x="0" y="52" width="76" height="24" fill="#142618"/><rect x="80" y="52" width="76" height="24" fill="#1b3622"/><rect x="160" y="52" width="76" height="24" fill="#142618"/><rect x="240" y="52" width="80" height="24" fill="#1b3622"/>
            <!-- Hanging Emerald Vines & Spores -->
            <path d="M 30,0 Q 36,35 24,55" stroke="#36a34d" stroke-width="3" fill="none"/>
            <path d="M 90,0 Q 85,25 96,48" stroke="#2d8740" stroke-width="2.5" fill="none"/>
            <path d="M 230,0 Q 235,30 220,52" stroke="#36a34d" stroke-width="3" fill="none"/>
            <path d="M 285,0 Q 295,28 280,45" stroke="#2d8740" stroke-width="2.5" fill="none"/>
            <!-- Glowing Forest Mushrooms -->
            <circle cx="68" cy="98" r="4" fill="#44ff88"/><rect x="67" y="98" width="2" height="7" fill="#a0ffa0"/>
            <circle cx="250" cy="99" r="3.5" fill="#55ffaa"/><rect x="249" y="99" width="2" height="6" fill="#a0ffa0"/>
            <!-- Emerald Torch Sconces -->
            <g class="torch-anim-left">
              <rect x="30" y="44" width="4" height="15" fill="#2d3a2f"/>
              <rect x="33" y="32" width="6" height="8" fill="#00e676" class="torch-fire-outer"/>
              <rect x="34" y="29" width="4" height="6" fill="#b9f6ca" class="torch-fire-inner"/>
              <circle cx="36" cy="34" r="16" fill="rgba(34,238,119,0.2)"/>
            </g>
            <g class="torch-anim-right">
              <rect x="286" y="44" width="4" height="15" fill="#2d3a2f"/>
              <rect x="281" y="32" width="6" height="8" fill="#00e676" class="torch-fire-outer"/>
              <rect x="282" y="29" width="4" height="6" fill="#b9f6ca" class="torch-fire-inner"/>
              <circle cx="284" cy="34" r="16" fill="rgba(34,238,119,0.2)"/>
            </g>
            <!-- Forest Moss Flagstone Floor -->
            <rect x="0" y="105" width="320" height="35" fill="#16291a"/>
            <line x1="0" y1="105" x2="320" y2="105" stroke="#2d5235" stroke-width="2"/>
            <line x1="0" y1="120" x2="320" y2="120" stroke="#1d3823" stroke-width="1.5"/>
            <line x1="60" y1="105" x2="50" y2="140" stroke="#1d3823" stroke-width="1.5"/>
            <line x1="160" y1="105" x2="155" y2="140" stroke="#1d3823" stroke-width="1.5"/>
            <line x1="260" y1="105" x2="265" y2="140" stroke="#1d3823" stroke-width="1.5"/>
          </svg>
        `;
      }

      // Theme 2: Stages 3-4 (B3F-B4F) 哥布林夜寨與殘原 (Goblin Stockade & Moon Crags)
      if (sId <= 4) {
        return `
          <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect width="320" height="140" fill="#18120d"/>
            <!-- Night Crags & Moon -->
            <path d="M 40,16 A 8,8 0 0 0 46,26 A 7,7 0 0 1 40,16 Z" fill="#ffeaa7"/>
            <polygon points="90,45 130,25 170,45" fill="#241b14"/>
            <!-- Spiked Wooden Stockade Wall -->
            <rect x="0" y="35" width="320" height="70" fill="#2b1c11"/>
            <rect x="15" y="15" width="10" height="90" fill="#3d2718"/><polygon points="15,15 20,6 25,15" fill="#3d2718"/>
            <rect x="45" y="20" width="10" height="85" fill="#352215"/><polygon points="45,20 50,11 55,20" fill="#352215"/>
            <rect x="75" y="16" width="10" height="89" fill="#3d2718"/><polygon points="75,16 80,7 85,16" fill="#3d2718"/>
            <rect x="105" y="22" width="10" height="83" fill="#352215"/><polygon points="105,22 110,13 115,22" fill="#352215"/>
            <rect x="205" y="18" width="10" height="87" fill="#352215"/><polygon points="205,18 210,9 215,18" fill="#352215"/>
            <rect x="235" y="15" width="10" height="90" fill="#3d2718"/><polygon points="235,15 240,6 245,15" fill="#3d2718"/>
            <rect x="265" y="21" width="10" height="84" fill="#352215"/><polygon points="265,21 270,12 275,21" fill="#352215"/>
            <rect x="295" y="16" width="10" height="89" fill="#3d2718"/><polygon points="295,16 300,7 305,16" fill="#3d2718"/>
            <!-- Tattered Goblin Crimson Banner -->
            <polygon points="150,30 170,30 166,65 160,58 154,65" fill="#881a1a"/>
            <!-- Crude Campfire Flares -->
            <g class="torch-anim-left">
              <rect x="32" y="32" width="6" height="8" fill="#ff5500" class="torch-fire-outer"/>
              <rect x="33" y="28" width="4" height="6" fill="#ffdd00" class="torch-fire-inner"/>
              <circle cx="35" cy="32" r="16" fill="rgba(255,130,20,0.2)"/>
            </g>
            <g class="torch-anim-right">
              <rect x="282" y="32" width="6" height="8" fill="#ff5500" class="torch-fire-outer"/>
              <rect x="283" y="28" width="4" height="6" fill="#ffdd00" class="torch-fire-inner"/>
              <circle cx="285" cy="32" r="16" fill="rgba(255,130,20,0.2)"/>
            </g>
            <!-- Earthy Gravel Floor -->
            <rect x="0" y="105" width="320" height="35" fill="#241810"/>
            <line x1="0" y1="105" x2="320" y2="105" stroke="#3d281a" stroke-width="2"/>
            <line x1="0" y1="120" x2="320" y2="120" stroke="#1f140d" stroke-width="1.5"/>
          </svg>
        `;
      }

      // Theme 3: Stages 5-6 (B5F-B6F) 幽暗蛛巢與暮光鐘樓 (Twilight Bell Tower & Spider Sanctum)
      if (sId <= 6) {
        return `
          <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect width="320" height="140" fill="#120c1f"/>
            <!-- Purple Gothic Masonry -->
            <rect x="0" y="0" width="76" height="24" fill="#1b1230"/><rect x="80" y="0" width="76" height="24" fill="#201538"/><rect x="160" y="0" width="76" height="24" fill="#1b1230"/><rect x="240" y="0" width="80" height="24" fill="#201538"/>
            <rect x="0" y="26" width="36" height="24" fill="#201538"/><rect x="40" y="26" width="76" height="24" fill="#261944"/><rect x="120" y="26" width="76" height="24" fill="#201538"/><rect x="200" y="26" width="76" height="24" fill="#261944"/><rect x="280" y="26" width="40" height="24" fill="#201538"/>
            <!-- Gothic Pointed Rose Arch -->
            <path d="M 115,105 L 115,38 Q 160,6 205,38 L 205,105 Z" fill="#0c0717" stroke="#392461" stroke-width="3"/>
            <!-- Hanging Violet Spiderwebs -->
            <line x1="0" y1="0" x2="45" y2="45" stroke="#7a55ba" stroke-width="1" opacity="0.6"/>
            <line x1="45" y1="0" x2="0" y2="45" stroke="#7a55ba" stroke-width="1" opacity="0.6"/>
            <line x1="320" y1="0" x2="275" y2="45" stroke="#7a55ba" stroke-width="1" opacity="0.6"/>
            <line x1="275" y1="0" x2="320" y2="45" stroke="#7a55ba" stroke-width="1" opacity="0.6"/>
            <!-- Occult Violet Fire Sconces -->
            <g class="torch-anim-left">
              <rect x="28" y="44" width="4" height="16" fill="#301f4a"/>
              <rect x="27" y="30" width="6" height="8" fill="#a855f7" class="torch-fire-outer"/>
              <rect x="28" y="27" width="4" height="6" fill="#e9d5ff" class="torch-fire-inner"/>
              <circle cx="30" cy="32" r="16" fill="rgba(168,85,247,0.25)"/>
            </g>
            <g class="torch-anim-right">
              <rect x="288" y="44" width="4" height="16" fill="#301f4a"/>
              <rect x="287" y="30" width="6" height="8" fill="#a855f7" class="torch-fire-outer"/>
              <rect x="288" y="27" width="4" height="6" fill="#e9d5ff" class="torch-fire-inner"/>
              <circle cx="290" cy="32" r="16" fill="rgba(168,85,247,0.25)"/>
            </g>
            <!-- Violet Stone Floor -->
            <rect x="0" y="105" width="320" height="35" fill="#181029"/>
            <line x1="0" y1="105" x2="320" y2="105" stroke="#3b2563" stroke-width="2"/>
            <line x1="0" y1="120" x2="320" y2="120" stroke="#251642" stroke-width="1.5"/>
          </svg>
        `;
      }

      // Theme 4: Stages 7-8 (B7F-B8F) 冥骨深穴與角鬥迷宮 (Catacombs & Minotaur Labyrinth)
      if (sId <= 8) {
        return `
          <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect width="320" height="140" fill="#1c0a0d"/>
            <!-- Blood Red Brick Masonry -->
            <rect x="0" y="0" width="76" height="24" fill="#291014"/><rect x="80" y="0" width="76" height="24" fill="#33141a"/><rect x="160" y="0" width="76" height="24" fill="#291014"/><rect x="240" y="0" width="80" height="24" fill="#33141a"/>
            <rect x="0" y="26" width="36" height="24" fill="#33141a"/><rect x="40" y="26" width="76" height="24" fill="#3d181f"/><rect x="120" y="26" width="76" height="24" fill="#33141a"/><rect x="200" y="26" width="76" height="24" fill="#3d181f"/><rect x="280" y="26" width="40" height="24" fill="#33141a"/>
            <!-- Heavy Spiked Iron Portcullis -->
            <rect x="115" y="30" width="90" height="75" fill="#120507" stroke="#4f1d26" stroke-width="3"/>
            <line x1="135" y1="30" x2="135" y2="105" stroke="#301217" stroke-width="3"/>
            <line x1="160" y1="30" x2="160" y2="105" stroke="#301217" stroke-width="3"/>
            <line x1="185" y1="30" x2="185" y2="105" stroke="#301217" stroke-width="3"/>
            <line x1="115" y1="55" x2="205" y2="55" stroke="#301217" stroke-width="3"/>
            <line x1="115" y1="80" x2="205" y2="80" stroke="#301217" stroke-width="3"/>
            <!-- Skull Carvings in Wall -->
            <circle cx="70" cy="50" r="4" fill="#c2b09b"/><rect x="68" y="52" width="4" height="4" fill="#c2b09b"/>
            <circle cx="250" cy="50" r="4" fill="#c2b09b"/><rect x="248" y="52" width="4" height="4" fill="#c2b09b"/>
            <!-- Cyan Soul Fire Braziers -->
            <g class="torch-anim-left">
              <rect x="30" y="44" width="4" height="16" fill="#3b161c"/>
              <rect x="29" y="30" width="6" height="8" fill="#00e5ff" class="torch-fire-outer"/>
              <rect x="30" y="27" width="4" height="6" fill="#e0f7fa" class="torch-fire-inner"/>
              <circle cx="32" cy="32" r="16" fill="rgba(0,229,255,0.25)"/>
            </g>
            <g class="torch-anim-right">
              <rect x="286" y="44" width="4" height="16" fill="#3b161c"/>
              <rect x="285" y="30" width="6" height="8" fill="#00e5ff" class="torch-fire-outer"/>
              <rect x="286" y="27" width="4" height="6" fill="#e0f7fa" class="torch-fire-inner"/>
              <circle cx="288" cy="32" r="16" fill="rgba(0,229,255,0.25)"/>
            </g>
            <!-- Bloodstone Flagstones -->
            <rect x="0" y="105" width="320" height="35" fill="#240c0f"/>
            <line x1="0" y1="105" x2="320" y2="105" stroke="#4f1b23" stroke-width="2"/>
            <line x1="0" y1="120" x2="320" y2="120" stroke="#331016" stroke-width="1.5"/>
          </svg>
        `;
      }

      // Theme 5: Stages 9-10 (B9F-B10F) 寒冰暗河與永凍聖殿 (Glacial Ice Temple & Dark River)
      if (sId <= 10) {
        return `
          <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect width="320" height="140" fill="#081424"/>
            <!-- Frozen Cyan Ice Blocks -->
            <rect x="0" y="0" width="76" height="24" fill="#0f233d"/><rect x="80" y="0" width="76" height="24" fill="#132c4a"/><rect x="160" y="0" width="76" height="24" fill="#0f233d"/><rect x="240" y="0" width="80" height="24" fill="#132c4a"/>
            <rect x="0" y="26" width="36" height="24" fill="#132c4a"/><rect x="40" y="26" width="76" height="24" fill="#17365c"/><rect x="120" y="26" width="76" height="24" fill="#132c4a"/><rect x="200" y="26" width="76" height="24" fill="#17365c"/><rect x="280" y="26" width="40" height="24" fill="#132c4a"/>
            <!-- Dripping Translucent Icicles -->
            <polygon points="20,0 24,24 28,0" fill="#80deea"/><polygon points="40,0 43,18 46,0" fill="#e0f7fa"/>
            <polygon points="110,0 114,30 118,0" fill="#80deea"/><polygon points="140,0 143,20 146,0" fill="#e0f7fa"/>
            <polygon points="210,0 214,28 218,0" fill="#80deea"/><polygon points="270,0 274,32 278,0" fill="#80deea"/>
            <!-- Crystalline Glacial Pillars -->
            <rect x="90" y="30" width="16" height="75" fill="#26c6da" opacity="0.3"/>
            <rect x="214" y="30" width="16" height="75" fill="#26c6da" opacity="0.3"/>
            <!-- Cobalt Frost Torches -->
            <g class="torch-anim-left">
              <rect x="28" y="44" width="4" height="16" fill="#1c3d66"/>
              <rect x="27" y="30" width="6" height="8" fill="#00b0ff" class="torch-fire-outer"/>
              <rect x="28" y="27" width="4" height="6" fill="#e1f5fe" class="torch-fire-inner"/>
              <circle cx="30" cy="32" r="16" fill="rgba(0,176,255,0.25)"/>
            </g>
            <g class="torch-anim-right">
              <rect x="288" y="44" width="4" height="16" fill="#1c3d66"/>
              <rect x="287" y="30" width="6" height="8" fill="#00b0ff" class="torch-fire-outer"/>
              <rect x="288" y="27" width="4" height="6" fill="#e1f5fe" class="torch-fire-inner"/>
              <circle cx="290" cy="32" r="16" fill="rgba(0,176,255,0.25)"/>
            </g>
            <!-- Reflective Blue Ice Floor -->
            <rect x="0" y="105" width="320" height="35" fill="#0d1e33"/>
            <line x1="0" y1="105" x2="320" y2="105" stroke="#26c6da" stroke-width="2"/>
            <line x1="0" y1="120" x2="320" y2="120" stroke="#163961" stroke-width="1.5"/>
          </svg>
        `;
      }

      // Theme 6: Stages 11-12 (B11F-B12F) 地心熔爐祭壇 (Magma Foundry & Abyssal Rift)
      if (sId <= 12) {
        return `
          <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect width="320" height="140" fill="#1f0904"/>
            <!-- Volcanic Basalt Masonry -->
            <rect x="0" y="0" width="76" height="24" fill="#2e0f07"/><rect x="80" y="0" width="76" height="24" fill="#3b150b"/><rect x="160" y="0" width="76" height="24" fill="#2e0f07"/><rect x="240" y="0" width="80" height="24" fill="#3b150b"/>
            <rect x="0" y="26" width="36" height="24" fill="#3b150b"/><rect x="40" y="26" width="76" height="24" fill="#47190d"/><rect x="120" y="26" width="76" height="24" fill="#3b150b"/><rect x="200" y="26" width="76" height="24" fill="#47190d"/><rect x="280" y="26" width="40" height="24" fill="#3b150b"/>
            <!-- Molten Magma Falls in Center Arch -->
            <rect x="120" y="20" width="80" height="85" fill="#ff3d00"/>
            <rect x="135" y="20" width="50" height="85" fill="#ff9100"/>
            <rect x="150" y="20" width="20" height="85" fill="#ffff00"/>
            <!-- Magma Cracks on Walls -->
            <path d="M 40,40 L 55,60 L 50,85" stroke="#ff5722" stroke-width="2" fill="none"/>
            <path d="M 270,35 L 255,65 L 265,90" stroke="#ff5722" stroke-width="2" fill="none"/>
            <!-- Raging Fire Braziers -->
            <g class="torch-anim-left">
              <rect x="28" y="44" width="4" height="16" fill="#4a180d"/>
              <rect x="26" y="28" width="8" height="10" fill="#ff1744" class="torch-fire-outer"/>
              <rect x="28" y="25" width="4" height="8" fill="#ffff00" class="torch-fire-inner"/>
              <circle cx="30" cy="30" r="18" fill="rgba(255,87,34,0.3)"/>
            </g>
            <g class="torch-anim-right">
              <rect x="288" y="44" width="4" height="16" fill="#4a180d"/>
              <rect x="286" y="28" width="8" height="10" fill="#ff1744" class="torch-fire-outer"/>
              <rect x="288" y="25" width="4" height="8" fill="#ffff00" class="torch-fire-inner"/>
              <circle cx="290" cy="30" r="18" fill="rgba(255,87,34,0.3)"/>
            </g>
            <!-- Obsidian Floor with Glowing Lava Veins -->
            <rect x="0" y="105" width="320" height="35" fill="#240c06"/>
            <line x1="0" y1="105" x2="320" y2="105" stroke="#ff3d00" stroke-width="2.5"/>
            <line x1="0" y1="120" x2="320" y2="120" stroke="#ff6d00" stroke-width="1.5"/>
          </svg>
        `;
      }

      // Theme 7: Stages 13-14 (B13F-B14F) 天空神殿與星界魔塔 (Celestial Sunken Temple)
      if (sId <= 14) {
        return `
          <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
            <rect width="320" height="140" fill="#0c1126"/>
            <!-- Starlight Stars & Constellations -->
            <circle cx="45" cy="18" r="1.5" fill="#ffffff"/><circle cx="100" cy="12" r="1.5" fill="#ffd700"/>
            <circle cx="180" cy="16" r="1.5" fill="#ffffff"/><circle cx="260" cy="22" r="1.5" fill="#80d8ff"/>
            <line x1="45" y1="18" x2="100" y2="12" stroke="#4fc3f7" stroke-width="0.5" opacity="0.6"/>
            <line x1="100" y1="12" x2="180" y2="16" stroke="#4fc3f7" stroke-width="0.5" opacity="0.6"/>
            <!-- Divine Marble & Gold Pillars -->
            <rect x="30" y="15" width="14" height="90" fill="#c5cae9"/><rect x="28" y="12" width="18" height="4" fill="#ffd700"/>
            <rect x="150" y="10" width="20" height="95" fill="#e8eaf6"/><rect x="147" y="6" width="26" height="5" fill="#ffd700"/>
            <rect x="276" y="15" width="14" height="90" fill="#c5cae9"/><rect x="274" y="12" width="18" height="4" fill="#ffd700"/>
            <!-- Imperial Golden Sun Eagle Tapestry -->
            <polygon points="150,22 170,22 170,60 160,70 150,60" fill="#283593"/>
            <circle cx="160" cy="38" r="6" fill="#ffd700"/>
            <!-- Divine Golden Braziers -->
            <g class="torch-anim-left">
              <rect x="28" y="24" width="6" height="8" fill="#ffd700" class="torch-fire-outer"/>
              <rect x="29" y="22" width="4" height="6" fill="#ffffff" class="torch-fire-inner"/>
              <circle cx="31" cy="26" r="16" fill="rgba(255,215,0,0.3)"/>
            </g>
            <g class="torch-anim-right">
              <rect x="284" y="24" width="6" height="8" fill="#ffd700" class="torch-fire-outer"/>
              <rect x="285" y="22" width="4" height="6" fill="#ffffff" class="torch-fire-inner"/>
              <circle cx="287" cy="26" r="16" fill="rgba(255,215,0,0.3)"/>
            </g>
            <!-- Celestial Navy Floor with Gold Trim -->
            <rect x="0" y="105" width="320" height="35" fill="#141a38"/>
            <line x1="0" y1="105" x2="320" y2="105" stroke="#ffd700" stroke-width="2.5"/>
            <line x1="0" y1="120" x2="320" y2="120" stroke="#3949ab" stroke-width="1.5"/>
          </svg>
        `;
      }

      // Theme 8: Stage 15 (B15F) 終焉王座時空裂隙 (The Throne of Oblivion - Final Boss)
      return `
        <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
          <rect width="320" height="140" fill="#130424"/>
          <!-- Dimensional Void Swirl -->
          <circle cx="160" cy="45" r="35" fill="#4a0e4e" opacity="0.7"/>
          <circle cx="160" cy="45" r="22" fill="#7b1fa2" opacity="0.8"/>
          <circle cx="160" cy="45" r="10" fill="#000000"/>
          <!-- Cosmic Purple Lightning Rifts -->
          <path d="M 30,10 L 60,35 L 45,60 L 80,95" stroke="#e040fb" stroke-width="2" fill="none"/>
          <path d="M 290,12 L 260,38 L 275,65 L 240,92" stroke="#ea80fc" stroke-width="2" fill="none"/>
          <!-- Dark Ancient Dragon Sigils -->
          <polygon points="160,18 168,34 186,34 172,44 178,60 160,50 142,60 148,44 134,34 152,34" fill="#e040fb" opacity="0.4"/>
          <!-- Apocalyptic Void Flames -->
          <g class="torch-anim-left">
            <rect x="26" y="26" width="8" height="10" fill="#d500f9" class="torch-fire-outer"/>
            <rect x="28" y="22" width="4" height="7" fill="#ffffff" class="torch-fire-inner"/>
            <circle cx="30" cy="28" r="18" fill="rgba(213,0,249,0.35)"/>
          </g>
          <g class="torch-anim-right">
            <rect x="286" y="26" width="8" height="10" fill="#d500f9" class="torch-fire-outer"/>
            <rect x="288" y="22" width="4" height="7" fill="#ffffff" class="torch-fire-inner"/>
            <circle cx="290" cy="28" r="18" fill="rgba(213,0,249,0.35)"/>
          </g>
          <!-- Void Obsidian Floor with Neon Purple Veins -->
          <rect x="0" y="105" width="320" height="35" fill="#1b082e"/>
          <line x1="0" y1="105" x2="320" y2="105" stroke="#e040fb" stroke-width="2.5"/>
          <line x1="0" y1="120" x2="320" y2="120" stroke="#8e24aa" stroke-width="1.5"/>
        </svg>
      `;
    }

    // 3. TOWER OF BABEL CLIMBING ALTITUDES
    const floor = parseInt(towerFloor, 10) || 1;

    // Tower Tier 1: 1-20F 塔基石壘 (Midnight Battlement)
    if (floor <= 20) {
      return `
        <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
          <rect width="320" height="140" fill="#0b0f1a"/>
          <!-- Crescent Moon & Stars -->
          <path d="M 40,20 A 10,10 0 0 0 48,32 A 8,8 0 0 1 40,20 Z" fill="#ffeebb"/>
          <rect x="120" y="16" width="2" height="2" fill="#ffffff" opacity="0.7"/>
          <rect x="220" y="20" width="2" height="2" fill="#ffd0aa" opacity="0.8"/>
          <!-- Castle Battlements -->
          <rect x="0" y="65" width="320" height="40" fill="#151b2a"/>
          <rect x="30" y="45" width="24" height="20" fill="#232b3e"/><rect x="80" y="45" width="24" height="20" fill="#232b3e"/><rect x="130" y="45" width="24" height="20" fill="#232b3e"/><rect x="180" y="45" width="24" height="20" fill="#232b3e"/><rect x="230" y="45" width="24" height="20" fill="#232b3e"/><rect x="280" y="45" width="24" height="20" fill="#232b3e"/>
          <!-- Braziers -->
          <g class="torch-anim-left"><rect x="38" y="38" width="8" height="8" fill="#ff4400" class="torch-fire-outer"/><rect x="40" y="34" width="4" height="6" fill="#ffff00" class="torch-fire-inner"/><circle cx="42" cy="40" r="16" fill="rgba(255,160,40,0.2)"/></g>
          <g class="torch-anim-right"><rect x="274" y="38" width="8" height="8" fill="#ff4400" class="torch-fire-outer"/><rect x="276" y="34" width="4" height="6" fill="#ffff00" class="torch-fire-inner"/><circle cx="278" cy="40" r="16" fill="rgba(255,160,40,0.2)"/></g>
          <!-- Stone Parapet Floor -->
          <rect x="0" y="105" width="320" height="35" fill="#181e2b"/>
          <line x1="0" y1="105" x2="320" y2="105" stroke="#36425c" stroke-width="2"/>
          <line x1="0" y1="120" x2="320" y2="120" stroke="#252e42" stroke-width="1.5"/>
        </svg>
      `;
    }

    // Tower Tier 2: 21-50F 雲霧中層 (Cloud Layer Bastion & Amber Dawn)
    if (floor <= 50) {
      return `
        <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
          <!-- Morning Dawn Sky Gradient -->
          <rect width="320" height="65" fill="#241b38"/>
          <rect y="65" width="320" height="40" fill="#4a2a3f"/>
          <!-- Rising Amber Sun Glow -->
          <circle cx="160" cy="70" r="28" fill="#ffaa44" opacity="0.6"/>
          <!-- Rolling Morning Cloud Pillows -->
          <circle cx="40" cy="75" r="26" fill="#dfd0e6" opacity="0.85"/>
          <circle cx="85" cy="70" r="22" fill="#f0e6f5" opacity="0.9"/>
          <circle cx="130" cy="78" r="24" fill="#dfd0e6" opacity="0.85"/>
          <circle cx="190" cy="72" r="25" fill="#f0e6f5" opacity="0.9"/>
          <circle cx="245" cy="76" r="24" fill="#dfd0e6" opacity="0.85"/>
          <circle cx="290" cy="70" r="26" fill="#f0e6f5" opacity="0.9"/>
          <!-- High Archways -->
          <path d="M 0,95 L 0,40 Q 60,15 120,40 L 120,95 Z" fill="#2a1f33" opacity="0.8"/>
          <path d="M 200,95 L 200,40 Q 260,15 320,40 L 320,95 Z" fill="#2a1f33" opacity="0.8"/>
          <!-- Parapet Floor -->
          <rect x="0" y="105" width="320" height="35" fill="#2c223b"/>
          <line x1="0" y1="105" x2="320" y2="105" stroke="#ffaa44" stroke-width="2"/>
          <line x1="0" y1="120" x2="320" y2="120" stroke="#3d2f52" stroke-width="1.5"/>
        </svg>
      `;
    }

    // Tower Tier 3: 51-100F 蒼穹高台 (Azure Stratosphere Overlook)
    if (floor <= 100) {
      return `
        <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
          <!-- Brilliant Azure Daytime Sky -->
          <rect width="320" height="70" fill="#1976d2"/>
          <rect y="70" width="320" height="35" fill="#42a5f5"/>
          <!-- Sunlit White Clouds -->
          <circle cx="60" cy="50" r="16" fill="#ffffff" opacity="0.9"/>
          <circle cx="85" cy="46" r="22" fill="#ffffff" opacity="0.95"/>
          <circle cx="110" cy="52" r="16" fill="#ffffff" opacity="0.9"/>
          <circle cx="230" cy="40" r="18" fill="#ffffff" opacity="0.9"/>
          <circle cx="255" cy="36" r="24" fill="#ffffff" opacity="0.95"/>
          <circle cx="280" cy="42" r="18" fill="#ffffff" opacity="0.9"/>
          <!-- Soaring Birds Silhouettes -->
          <path d="M 140,25 Q 146,20 152,25 Q 158,20 164,25" stroke="#0d47a1" stroke-width="1.5" fill="none"/>
          <path d="M 170,35 Q 174,31 178,35 Q 182,31 186,35" stroke="#0d47a1" stroke-width="1.2" fill="none"/>
          <!-- Sunlit Golden Trim Castle Parapet -->
          <rect x="0" y="80" width="320" height="25" fill="#2b476e"/>
          <rect x="20" y="65" width="25" height="18" fill="#3a5f94"/><rect x="80" y="65" width="25" height="18" fill="#3a5f94"/><rect x="140" y="65" width="25" height="18" fill="#3a5f94"/><rect x="200" y="65" width="25" height="18" fill="#3a5f94"/><rect x="260" y="65" width="25" height="18" fill="#3a5f94"/>
          <!-- Sunlit Stone Floor -->
          <rect x="0" y="105" width="320" height="35" fill="#203452"/>
          <line x1="0" y1="105" x2="320" y2="105" stroke="#90caf9" stroke-width="2.5"/>
          <line x1="0" y1="120" x2="320" y2="120" stroke="#2e4b75" stroke-width="1.5"/>
        </svg>
      `;
    }

    // Tower Tier 4: 101-250F 暮光星辰 (Twilight Starlight Overlook)
    if (floor <= 250) {
      return `
        <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
          <!-- Deep Violet Twilight Sky -->
          <rect width="320" height="70" fill="#1e0c38"/>
          <rect y="70" width="320" height="35" fill="#3f1c5c"/>
          <!-- Twinkling Starlight -->
          <circle cx="35" cy="18" r="1.5" fill="#ffffff"/><circle cx="95" cy="28" r="2" fill="#ffd54f"/>
          <circle cx="165" cy="15" r="1.5" fill="#ffffff"/><circle cx="240" cy="22" r="2" fill="#80d8ff"/><circle cx="295" cy="32" r="1.5" fill="#ffffff"/>
          <!-- Glowing Arcane Runic Obelisks -->
          <rect x="40" y="25" width="16" height="80" fill="#2a1447" stroke="#00e5ff" stroke-width="1.5"/>
          <rect x="46" y="38" width="4" height="8" fill="#00e5ff"/>
          <rect x="46" y="55" width="4" height="8" fill="#00e5ff"/>
          <rect x="264" y="25" width="16" height="80" fill="#2a1447" stroke="#00e5ff" stroke-width="1.5"/>
          <rect x="270" y="38" width="4" height="8" fill="#00e5ff"/>
          <rect x="270" y="55" width="4" height="8" fill="#00e5ff"/>
          <!-- Twilight Parapet Floor -->
          <rect x="0" y="105" width="320" height="35" fill="#230f3d"/>
          <line x1="0" y1="105" x2="320" y2="105" stroke="#00e5ff" stroke-width="2"/>
          <line x1="0" y1="120" x2="320" y2="120" stroke="#3b1b61" stroke-width="1.5"/>
        </svg>
      `;
    }

    // Tower Tier 5: 251-500F 極光聖境 (Aurora Sanctuary)
    if (floor <= 500) {
      return `
        <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
          <rect width="320" height="140" fill="#07101f"/>
          <!-- Shimmering Northern Lights (Aurora Borealis) -->
          <path d="M 0,25 Q 80,5 160,35 Q 240,65 320,15" stroke="#00e676" stroke-width="14" fill="none" opacity="0.45"/>
          <path d="M 0,32 Q 90,12 170,42 Q 250,72 320,22" stroke="#00b0ff" stroke-width="10" fill="none" opacity="0.4"/>
          <path d="M 0,18 Q 70,38 150,18 Q 230,0 320,38" stroke="#f50057" stroke-width="8" fill="none" opacity="0.35"/>
          <!-- Golden Celestial Spire Battlements -->
          <rect x="0" y="75" width="320" height="30" fill="#132742"/>
          <rect x="30" y="55" width="20" height="22" fill="#ffd700"/><rect x="90" y="55" width="20" height="22" fill="#ffd700"/><rect x="150" y="55" width="20" height="22" fill="#ffd700"/><rect x="210" y="55" width="20" height="22" fill="#ffd700"/><rect x="270" y="55" width="20" height="22" fill="#ffd700"/>
          <!-- Celestial Parapet Floor -->
          <rect x="0" y="105" width="320" height="35" fill="#102038"/>
          <line x1="0" y1="105" x2="320" y2="105" stroke="#00e676" stroke-width="2.5"/>
          <line x1="0" y1="120" x2="320" y2="120" stroke="#1d3b66" stroke-width="1.5"/>
        </svg>
      `;
    }

    // Tower Tier 6: 501-1000F 宇宙星雲之巔 (Pinnacle of Cosmos & Galaxy)
    return `
      <svg class="medieval-bg-svg" viewBox="0 0 320 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="320" height="140" fill="#040212"/>
        <!-- Cosmic Galaxy Nebula Swirls -->
        <circle cx="90" cy="40" r="42" fill="#7c4dff" opacity="0.25"/>
        <circle cx="230" cy="35" r="48" fill="#e040fb" opacity="0.25"/>
        <circle cx="160" cy="50" r="32" fill="#00e5ff" opacity="0.25"/>
        <!-- Brilliant Star Field -->
        <circle cx="30" cy="18" r="1.5" fill="#ffffff"/><circle cx="70" cy="12" r="2" fill="#ffd54f"/>
        <circle cx="120" cy="22" r="1.5" fill="#ffffff"/><circle cx="160" cy="10" r="2.5" fill="#ffffff"/>
        <circle cx="205" cy="20" r="1.5" fill="#80d8ff"/><circle cx="250" cy="14" r="2" fill="#ffd54f"/>
        <circle cx="295" cy="24" r="1.5" fill="#ffffff"/>
        <!-- Divine Ether Crystal Pillars -->
        <rect x="25" y="15" width="14" height="90" fill="#311b92" stroke="#b388ff" stroke-width="1.5"/>
        <rect x="281" y="15" width="14" height="90" fill="#311b92" stroke="#b388ff" stroke-width="1.5"/>
        <!-- Star Constellation Platform Floor -->
        <rect x="0" y="105" width="320" height="35" fill="#0d0824"/>
        <line x1="0" y1="105" x2="320" y2="105" stroke="#b388ff" stroke-width="2.5"/>
        <line x1="0" y1="120" x2="320" y2="120" stroke="#251661" stroke-width="1.5"/>
      </svg>
    `;
  };

  return {
    icon: (name, size) => (icons[name] ? icons[name](size) : icons.coin(size)),
    renderHero,
    renderBoss,
    renderMinion,
    renderFood,
    renderScroll,
    renderMedievalBackdrop
  };
})();
