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
    `, `pixel-icon`)
  };

  // Dynamic Pixel Hero Paper Doll (64x64)
  const renderHero = (expression = 'happy', weaponTier = 1, armorTier = 1, relicTier = 0) => {
    // Colors by armor tier
    const armorColors = [
      { main: '#504030', trim: '#706050', helm: '#302820' }, // T0 Cloth
      { main: '#6a4e32', trim: '#4a823c', helm: '#503c26' }, // T1 Leather
      { main: '#788898', trim: '#4466aa', helm: '#8c9cb0' }, // T2 Chainmail
      { main: '#9bb8d4', trim: '#ffd700', helm: '#b2d0ee' }, // T3 Mithril
      { main: '#3a2e54', trim: '#aa55ff', helm: '#4c3a70' }, // T4 Phantom
      { main: '#a82c2c', trim: '#ff7733', helm: '#c43434' }, // T5 Dragon
      { main: '#e8e8f8', trim: '#fcd736', helm: '#ffffff' }  // T6 Celestial
    ][Math.min(armorTier, 6)];

    // Weapon colors & blade pixels
    const weaponDef = [
      { blade: '#605040', hilt: '#302010' }, // T0
      { blade: '#8b6914', hilt: '#503810' }, // T1 Wood
      { blade: '#d0d8e8', hilt: '#c89b3c' }, // T2 Steel
      { blade: '#ff4422', hilt: '#ffd700' }, // T3 Flame
      { blade: '#44ddff', hilt: '#ffffff' }, // T4 Frost
      { blade: '#ffff33', hilt: '#3388ff' }, // T5 Thunder
      { blade: '#ffffff', hilt: '#ffd700' }  // T6 Excalibur
    ][Math.min(weaponTier, 6)];

    // Relic Aura
    let relicSvg = '';
    if (relicTier >= 1) {
      const auraColor = relicTier === 1 ? '#c89b3c' : relicTier === 2 ? '#44dd88' : relicTier === 3 ? '#9966ff' : '#ffd700';
      relicSvg = `
        <circle cx="32" cy="30" r="26" fill="none" stroke="${auraColor}" stroke-width="2" stroke-dasharray="4,4" opacity="0.6"/>
        <rect x="30" y="2" width="4" height="4" fill="${auraColor}"/>
        <rect x="10" y="24" width="3" height="3" fill="${auraColor}"/>
        <rect x="52" y="24" width="3" height="3" fill="${auraColor}"/>
      `;
      if (relicTier === 4) { // Eternal Crown Halo
        relicSvg += `
          <rect x="26" y="8" width="12" height="3" fill="#ffd700"/>
          <rect x="24" y="6" width="3" height="3" fill="#ffd700"/>
          <rect x="30" y="5" width="4" height="4" fill="#ffffff"/>
          <rect x="37" y="6" width="3" height="3" fill="#ffd700"/>
        `;
      }
    }

    // Face / Expression pixels
    let faceSvg = '';
    if (expression === 'happy') {
      faceSvg = `
        <!-- Skin -->
        <rect x="26" y="20" width="12" height="12" fill="#ffd2aa"/>
        <!-- Eyes (Happy Stars/Sparkles) -->
        <rect x="28" y="23" width="2" height="3" fill="#14121d"/>
        <rect x="27" y="24" width="4" height="1" fill="#14121d"/>
        <rect x="34" y="23" width="2" height="3" fill="#14121d"/>
        <rect x="33" y="24" width="4" height="1" fill="#14121d"/>
        <!-- Rosy Cheeks -->
        <rect x="27" y="27" width="2" height="2" fill="#ff7777"/>
        <rect x="35" y="27" width="2" height="2" fill="#ff7777"/>
        <!-- Big Smile -->
        <rect x="30" y="28" width="4" height="2" fill="#992222"/>
      `;
    } else if (expression === 'hungry') { // 1~2 days away
      faceSvg = `
        <rect x="26" y="20" width="12" height="12" fill="#ecd0b0"/>
        <!-- Blue Sweat Drop on forehead -->
        <rect x="27" y="18" width="2" height="3" fill="#44aaff"/>
        <!-- Sad Slanted Eyes -->
        <rect x="28" y="24" width="3" height="2" fill="#222233"/>
        <rect x="33" y="24" width="3" height="2" fill="#222233"/>
        <!-- Quivering Mouth -->
        <rect x="30" y="28" width="4" height="1" fill="#663333"/>
        <rect x="29" y="29" width="2" height="1" fill="#663333"/>
        <rect x="33" y="29" width="2" height="1" fill="#663333"/>
      `;
    } else if (expression === 'sarcastic') { // 3~6 days away (Dark circles & deadpan)
      faceSvg = `
        <rect x="26" y="20" width="12" height="12" fill="#e0c8b0"/>
        <!-- Purple Dark Circles -->
        <rect x="27" y="25" width="4" height="2" fill="#775588"/>
        <rect x="33" y="25" width="4" height="2" fill="#775588"/>
        <!-- Half-closed Deadpan Eyes -->
        <rect x="28" y="24" width="3" height="1" fill="#14121d"/>
        <rect x="34" y="24" width="3" height="1" fill="#14121d"/>
        <!-- Flat Contemptuous Mouth -->
        <rect x="30" y="29" width="5" height="1" fill="#442222"/>
      `;
    } else if (expression === 'ghost') { // 7+ days away (Pale spirit)
      faceSvg = `
        <rect x="26" y="20" width="12" height="12" fill="#d0e0e8"/>
        <!-- Floating Soul Spirit Top -->
        <rect x="38" y="10" width="6" height="6" fill="#aaddff" opacity="0.8"/>
        <rect x="42" y="8" width="4" height="4" fill="#aaddff" opacity="0.6"/>
        <!-- Empty Hollow Black Eyes -->
        <rect x="28" y="23" width="3" height="3" fill="#112233"/>
        <rect x="33" y="23" width="3" height="3" fill="#112233"/>
        <!-- Wavy Ghost Mouth -->
        <rect x="30" y="28" width="4" height="3" fill="#112233"/>
      `;
    } else { // Vacation / Sunglasses
      faceSvg = `
        <rect x="26" y="20" width="12" height="12" fill="#ffd2aa"/>
        <!-- Cool Pixel Sunglasses -->
        <rect x="27" y="23" width="10" height="4" fill="#111111"/>
        <rect x="28" y="24" width="3" height="2" fill="#335577"/>
        <rect x="33" y="24" width="3" height="2" fill="#335577"/>
        <!-- Chill Smile -->
        <rect x="30" y="29" width="4" height="1" fill="#662222"/>
      `;
    }

    return wrapSvg(64, 64, `
      ${relicSvg}
      <!-- Helmet / Hair -->
      <rect x="25" y="15" width="14" height="6" fill="${armorColors.helm}"/>
      <rect x="24" y="17" width="2" height="10" fill="${armorColors.helm}"/>
      <rect x="38" y="17" width="2" height="10" fill="${armorColors.helm}"/>
      ${faceSvg}
      <!-- Body & Armor -->
      <rect x="24" y="32" width="16" height="16" fill="${armorColors.main}"/>
      <rect x="28" y="34" width="8" height="12" fill="${armorColors.trim}"/>
      <rect x="22" y="34" width="4" height="8" fill="${armorColors.main}"/>
      <rect x="38" y="34" width="4" height="8" fill="${armorColors.main}"/>
      <!-- Hands -->
      <rect x="22" y="42" width="3" height="4" fill="#ffd2aa"/>
      <rect x="39" y="42" width="3" height="4" fill="#ffd2aa"/>
      <!-- Legs & Boots -->
      <rect x="26" y="48" width="5" height="10" fill="#2a2038"/>
      <rect x="33" y="48" width="5" height="10" fill="#2a2038"/>
      <rect x="25" y="58" width="6" height="4" fill="#14121d"/>
      <rect x="33" y="58" width="6" height="4" fill="#14121d"/>
      <!-- Weapon in Right Hand -->
      <rect x="42" y="38" width="3" height="3" fill="${weaponDef.hilt}"/>
      <rect x="43" y="24" width="3" height="14" fill="${weaponDef.blade}"/>
      <rect x="42" y="22" width="5" height="3" fill="${weaponDef.blade}"/>
      <rect x="44" y="18" width="2" height="5" fill="${weaponDef.blade}"/>
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

  return {
    icon: (name, size) => (icons[name] ? icons[name](size) : icons.coin(size)),
    renderHero,
    renderBoss,
    renderMinion,
    renderFood,
    renderScroll
  };
})();
