// Simple 8-bit sound effects via Web Audio API
const AudioFX = (function () {
  let ctx = null;
  let enabled = true;

  function init() {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { enabled = false; }
  }

  function play(type) {
    if (!enabled || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'kick':
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.start(t); osc.stop(t + 0.08);
        break;
      case 'super':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t); osc.stop(t + 0.2);
        break;
      case 'goal':
        [523, 659, 784, 1047].forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'square';
          o.frequency.value = f;
          g.gain.setValueAtTime(0.12, t + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.15);
          o.start(t + i * 0.1); o.stop(t + i * 0.1 + 0.15);
        });
        break;
      case 'dash':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
        osc.start(t); osc.stop(t + 0.06);
        break;
      case 'tackle':
        osc.type = 'square';
        osc.frequency.setValueAtTime(80, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t); osc.stop(t + 0.1);
        break;
      case 'whistle':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1100, t + 0.08);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.start(t); osc.stop(t + 0.25);
        break;
      case 'menu':
        osc.type = 'square';
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t); osc.stop(t + 0.05);
        break;
    }
  }

  function setEnabled(v) { enabled = v; }
  function isEnabled() { return enabled; }

  return { init, play, setEnabled, isEnabled };
})();
