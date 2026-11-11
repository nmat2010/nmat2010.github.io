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

/** A real recording of a young dog's bark (see public/audio/CREDITS.md), decoded once and replayed as a "woof, woof" */
const WOOF_URL = `${import.meta.env.BASE_URL}audio/woof.mp3`.replace("//", "/");
let woof: Promise<AudioBuffer | null> | null = null;

const loadWoof = (c: AudioContext) =>
  (woof ??= fetch(WOOF_URL)
    .then((r) => r.arrayBuffer())
    .then((b) => c.decodeAudioData(b))
    .catch(() => {
      woof = null;
      return null;
    }));

/** Woof, woof: the same puppy bark twice, the second a touch higher and softer so it does not sound copy-pasted */
export const bark = () => {
  if (muted) return;
  const c = ac();
  void loadWoof(c).then((buf) => {
    if (!buf) return;
    [[0, 1, 0.9], [0.32, 1.09, 0.7]].forEach(([delay, rate, gain]) => {
      const src = c.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = rate * (0.98 + Math.random() * 0.05);
      const g = c.createGain();
      g.gain.value = gain;
      src.connect(g).connect(c.destination);
      src.start(c.currentTime + delay);
    });
  });
};

/** A short rising chime when a place is opened for the first time */
export const chime = () => {
  if (muted) return;
  [523.25, 659.25, 783.99].forEach((f, i) => pluck(f, i * 0.08, 0.14, 1));
};

/** A page turning: a breath of filtered noise that rises and falls */
export const paperTurn = () => {
  if (muted) return;
  const c = ac();
  const len = Math.floor(c.sampleRate * 0.6);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 0.9;
  f.frequency.setValueAtTime(900, c.currentTime);
  f.frequency.exponentialRampToValueAtTime(3600, c.currentTime + 0.4);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.16, c.currentTime + 0.18);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.55);
  src.connect(f).connect(g).connect(c.destination);
  src.start();
};

let stepNoise: AudioBuffer | null = null;

/** One footfall: a short filtered burst. Duller and softer on the house floor, crisper on the street. */
export const footstep = (indoor: boolean, vol = 1) => {
  if (muted) return;
  const c = ac();
  if (!stepNoise) {
    stepNoise = c.createBuffer(1, Math.floor(c.sampleRate * 0.12), c.sampleRate);
    const d = stepNoise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = stepNoise;
  src.playbackRate.value = 0.85 + Math.random() * 0.3;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = (indoor ? 520 : 1100) * (0.85 + Math.random() * 0.3);
  const g = c.createGain();
  const peak = (indoor ? 0.13 : 0.1) * vol;
  g.gain.setValueAtTime(peak, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + (indoor ? 0.09 : 0.07));
  src.connect(f).connect(g).connect(c.destination);
  src.start();
};

/** A scooter shooting past: a buzzing engine that rises as it nears and drops as it leaves. */
export const motoPass = () => {
  if (muted) return;
  const c = ac();
  const t = c.currentTime;
  const engine = c.createOscillator();
  engine.type = "sawtooth";
  engine.frequency.setValueAtTime(140, t);
  engine.frequency.linearRampToValueAtTime(260, t + 0.35);
  engine.frequency.linearRampToValueAtTime(110, t + 0.85);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  engine.connect(lp).connect(g).connect(c.destination);
  engine.start(t);
  engine.stop(t + 0.95);
};

/** Two short beeps from a scooter horn. */
export const honk = () => {
  if (muted) return;
  const c = ac();
  const t = c.currentTime;
  [0, 0.17].forEach((at) => {
    const horn = c.createOscillator();
    horn.type = "square";
    horn.frequency.value = 420;
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1800;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t + at);
    g.gain.exponentialRampToValueAtTime(0.09, t + at + 0.02);
    g.gain.setValueAtTime(0.09, t + at + 0.09);
    g.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.12);
    horn.connect(lp).connect(g).connect(c.destination);
    horn.start(t + at);
    horn.stop(t + at + 0.14);
  });
};

/** Landing on your behind: a short low thump. */
export const thud = () => {
  if (muted) return;
  const c = ac();
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(130, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
  const g = c.createGain();
  g.gain.setValueAtTime(0.28, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.25);
};
