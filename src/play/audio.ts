/** Tiny WebAudio voices so the hẻm can answer back. Nothing loads from the network. */
let ctx: AudioContext | null = null;
let muted = false;

const ac = () => {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
};

export const setMuted = (m: boolean) => {
  muted = m;
};

/** Karplus-Strong plucked string */
const pluck = (freq: number, delay: number, gain = 0.22, bright = 0.5) => {
  const c = ac();
  const sr = c.sampleRate;
  const len = Math.floor(sr * 1.3);
  const buf = c.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const n = Math.floor(sr / freq);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  for (let i = n; i < len; i++) d[i] = (d[i - n] + d[i - n + 1]) * (0.498 + bright * 0.001);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g).connect(c.destination);
  src.start(c.currentTime + delay);
};

const chords = [
  [82.41, 123.47, 164.81, 196.0, 246.94, 329.63], // Em
  [98.0, 123.47, 146.83, 196.0, 246.94, 392.0], // G
  [73.42, 110.0, 146.83, 220.0, 293.66, 369.99], // D
  [110.0, 164.81, 220.0, 261.63, 329.63], // Am
];
let chordIndex = 0;

export const strum = () => {
  if (muted) return;
  const chord = chords[chordIndex++ % chords.length];
  chord.forEach((f, i) => pluck(f, i * 0.055));
};

export const meow = () => {
  if (muted) return;
  const c = ac();
  const t = c.currentTime;
  const o = c.createOscillator();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(520, t);
  o.frequency.linearRampToValueAtTime(880, t + 0.16);
  o.frequency.linearRampToValueAtTime(560, t + 0.5);
  f.type = "bandpass";
  f.frequency.setValueAtTime(1200, t);
  f.frequency.linearRampToValueAtTime(2200, t + 0.2);
  f.Q.value = 3;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  o.connect(f).connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.6);
};

/** One puppy "yip": a buzzy voice with a quick pitch rise-and-fall, shaped by two vocal formants and a little breath */
const yip = (c: AudioContext, t: number, f0: number, dur: number, gain: number) => {
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(f0 * 0.85, t);
  o.frequency.exponentialRampToValueAtTime(f0 * 1.35, t + dur * 0.25);
  o.frequency.exponentialRampToValueAtTime(f0 * 0.9, t + dur);
  const vib = c.createOscillator();
  const vibGain = c.createGain();
  vib.frequency.value = 38;
  vibGain.gain.value = f0 * 0.025;
  vib.connect(vibGain).connect(o.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  [[900, 1.0, 5], [2600, 0.55, 7]].forEach(([freq, level, q]) => {
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(freq * 0.9, t);
    f.frequency.linearRampToValueAtTime(freq * 1.15, t + dur * 0.3);
    f.Q.value = q;
    const lv = c.createGain();
    lv.gain.value = level;
    o.connect(f).connect(lv).connect(env);
  });

  // breath
  const len = Math.floor(c.sampleRate * dur);
  const nb = c.createBuffer(1, len, c.sampleRate);
  const d = nb.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const ns = c.createBufferSource();
  ns.buffer = nb;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 3500;
  const ng = c.createGain();
  ng.gain.value = 0.05;
  ns.connect(hp).connect(ng).connect(env);

  env.connect(c.destination);
  o.start(t);
  vib.start(t);
  ns.start(t);
  o.stop(t + dur + 0.02);
  vib.stop(t + dur + 0.02);
};

/** A soft rising whimper */
const whimper = (c: AudioContext, t: number) => {
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(620, t);
  o.frequency.exponentialRampToValueAtTime(1050, t + 0.22);
  o.frequency.exponentialRampToValueAtTime(840, t + 0.42);
  const trem = c.createOscillator();
  const tremGain = c.createGain();
  trem.frequency.value = 14;
  tremGain.gain.value = 0.04;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.11, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.46);
  trem.connect(tremGain).connect(g.gain);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1500;
  f.Q.value = 1.2;
  o.connect(f).connect(g).connect(c.destination);
  o.start(t);
  trem.start(t);
  o.stop(t + 0.5);
  trem.stop(t + 0.5);
};

/** A cute puppy: two quick yips and a little whimper */
export const bark = () => {
  if (muted) return;
  const c = ac();
  const t = c.currentTime + 0.02;
  yip(c, t, 760, 0.13, 0.32);
  yip(c, t + 0.19, 840, 0.12, 0.3);
  whimper(c, t + 0.42);
};

/** A short rising chime when a place is opened for the first time */
export const chime = () => {
  if (muted) return;
  [523.25, 659.25, 783.99].forEach((f, i) => pluck(f, i * 0.08, 0.14, 1));
};

/* ---------- songs ---------- */

const timers: number[] = [];
let stopFns: (() => void)[] = [];

export const stopMusic = () => {
  timers.splice(0).forEach((t) => window.clearTimeout(t));
  stopFns.forEach((f) => f());
  stopFns = [];
};

const at = (ms: number, fn: () => void) => {
  timers.push(window.setTimeout(fn, ms));
};

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

/**
 * An original ballad on the Andalusian cadence (Am G F E): fingerpicked chords with a pentatonic melody on top.
 * Calls onBeat for every plucked note so the guitar on screen can shake. Returns the song length in ms.
 */
export const playBallad = (onBeat: () => void) => {
  if (muted) return 0;
  stopMusic();
  const bar = 2400;
  const chords: { bass: number; tones: number[] }[] = [
    { bass: 45, tones: [57, 60, 64] }, // Am
    { bass: 43, tones: [55, 59, 62] }, // G
    { bass: 41, tones: [53, 57, 60] }, // F
    { bass: 40, tones: [52, 56, 59] }, // E
  ];
  const melody: number[][] = [
    [76, 74, 72, 69],
    [74, 72, 71, 67],
    [72, 69, 72, 74],
    [71, 68, 71, 76],
  ];
  let when = 0;
  for (let round = 0; round < 2; round++) {
    chords.forEach((c, bi) => {
      const step = bar / 8;
      const pattern = [c.bass, c.tones[0], c.tones[1], c.tones[2], c.tones[1], c.tones[2], c.tones[1], c.tones[0]];
      pattern.forEach((n, i) => {
        at(when + i * step, () => {
          pluck(hz(n), 0, i === 0 ? 0.28 : 0.15, 0.7);
          onBeat();
        });
      });
      if (round === 1) {
        melody[bi].forEach((m, i) => at(when + i * (bar / 4) + 40, () => pluck(hz(m + 0), 0, 0.2, 0.9)));
      }
      when += bar;
    });
  }
  at(when, () => onBeat());
  return when;
};

/** A palm-muted power-chord riff through a waveshaper, the electric guitar's answer */
export const playRiff = (onBeat: () => void) => {
  if (muted) return 0;
  stopMusic();
  const c = ac();
  const shaper = c.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i / 255) * 2 - 1;
    curve[i] = Math.tanh(x * 5);
  }
  shaper.curve = curve;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2400;
  const out = c.createGain();
  out.gain.value = 0.22;
  shaper.connect(lp).connect(out).connect(c.destination);
  stopFns.push(() => out.disconnect());

  const q = 300;
  // E5 palm-muted eighths, then G5 A5 Bb5 A5 G5
  const seq: [number, number, number][] = [];
  for (let b = 0; b < 2; b++) {
    for (let i = 0; i < 6; i++) seq.push([40, q * (b * 8 + i), 0.12]);
    seq.push([43, q * (b * 8 + 6), 0.35]);
    seq.push([45, q * (b * 8 + 7), 0.5]);
  }
  seq.push([40, q * 16, 1.2]);
  seq.forEach(([note, ms, len]) => {
    at(ms, () => {
      const t = c.currentTime;
      [0, 7].forEach((interval) => {
        [-6, 6].forEach((det) => {
          const o = c.createOscillator();
          const g = c.createGain();
          o.type = "sawtooth";
          o.frequency.value = hz(note + interval);
          o.detune.value = det;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + len);
          o.connect(g).connect(shaper);
          o.start(t);
          o.stop(t + len + 0.05);
        });
      });
      onBeat();
    });
  });
  return q * 17;
};
