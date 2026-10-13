/**
 * Word Dungeon & Babel Tower - Audio Engine
 * Pure procedural Web Audio API retro 8-bit sound synthesizers + Web Speech API.
 * Zero external audio files. 100% offline & fast.
 */

const AudioManager = (() => {
  let audioCtx = null;
  let muted = false;

  // Initialize or resume AudioContext
  const getContext = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  // Generic 8-bit tone generator
  const playTone = (freq, type, duration, startVol = 0.15, endVol = 0.001) => {
    if (muted) return;
    const ctx = getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(startVol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  // Sound effects
  const sounds = {
    click: () => {
      playTone(600, 'square', 0.05, 0.08);
    },

    slash: () => {
      if (muted) return;
      const ctx = getContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (e) {}
    },

    crit: () => {
      if (muted) return;
      const ctx = getContext();
      if (!ctx) return;
      try {
        // High strike + sparkle
        playTone(980, 'triangle', 0.25, 0.25);
        setTimeout(() => playTone(1320, 'square', 0.2, 0.2), 60);
      } catch (e) {}
    },

    hit: () => {
      if (muted) return;
      const ctx = getContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch (e) {}
    },

    playerHurt: () => {
      if (muted) return;
      playTone(110, 'sawtooth', 0.25, 0.28);
    },

    buzzer: () => {
      if (muted) return;
      playTone(150, 'sawtooth', 0.22, 0.2);
    },

    coin: () => {
      if (muted) return;
      playTone(987.77, 'square', 0.1, 0.12); // B5
      setTimeout(() => playTone(1318.51, 'square', 0.2, 0.15), 80); // E6
    },

    floorUp: () => {
      if (muted) return;
      playTone(523.25, 'triangle', 0.12, 0.2); // C5
      setTimeout(() => playTone(659.25, 'triangle', 0.12, 0.2), 90); // E5
      setTimeout(() => playTone(783.99, 'triangle', 0.12, 0.2), 180); // G5
      setTimeout(() => playTone(1046.50, 'square', 0.35, 0.25), 270); // C6
    },

    floorDown: () => {
      if (muted) return;
      const ctx = getContext();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {}
    },

    eat: () => {
      if (muted) return;
      playTone(440, 'triangle', 0.08, 0.15);
      setTimeout(() => playTone(660, 'triangle', 0.08, 0.15), 70);
      setTimeout(() => playTone(880, 'triangle', 0.18, 0.18), 140);
    },

    scroll: () => {
      if (muted) return;
      playTone(587.33, 'sine', 0.15, 0.2);
      setTimeout(() => playTone(880.00, 'sine', 0.2, 0.2), 80);
      setTimeout(() => playTone(1174.66, 'sine', 0.35, 0.2), 160);
    },

    victory: () => {
      if (muted) return;
      playTone(523.25, 'square', 0.15, 0.2);
      setTimeout(() => playTone(659.25, 'square', 0.15, 0.2), 120);
      setTimeout(() => playTone(783.99, 'square', 0.15, 0.2), 240);
      setTimeout(() => playTone(1046.50, 'square', 0.45, 0.25), 360);
    },

    defeat: () => {
      if (muted) return;
      playTone(392.00, 'sawtooth', 0.2, 0.2);
      setTimeout(() => playTone(369.99, 'sawtooth', 0.2, 0.2), 180);
      setTimeout(() => playTone(329.63, 'sawtooth', 0.2, 0.2), 360);
      setTimeout(() => playTone(261.63, 'sawtooth', 0.5, 0.25), 540);
    },

    rouletteTick: () => {
      if (muted) return;
      playTone(880, 'square', 0.03, 0.08);
    },

    jackpot: () => {
      if (muted) return;
      [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 'square', 0.18, 0.22), idx * 80);
      });
    }
  };

  // Web Speech API for English pronunciation
  const speakWord = (text) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.95;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('Speech error', e);
    }
  };

  return {
    play: (name) => {
      if (sounds[name]) sounds[name]();
    },
    speak: speakWord,
    toggleMute: () => {
      muted = !muted;
      return muted;
    },
    isMuted: () => muted
  };
})();
