import * as THREE from "three";

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const make = (w: number, h: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext("2d")! };
};

const finish = (canvas: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

export type ShopKind = "shutter" | "open" | "none";

/** One hẻm house front, French-colonial by way of Saigon: arched shuttered windows, iron balconies, a cornice,
 *  water stains and peeling plaster, laundry on bamboo poles. */
export const facadeTexture = (wall: string, trim: string, seed: number, shop: ShopKind) => {
  const W = 512;
  const H = 1280;
  const { canvas, ctx } = make(W, H);
  const r = rng(seed);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  // mottled, sun-faded plaster
  for (let i = 0; i < 320; i++) {
    ctx.fillStyle = r() > 0.5 ? `rgba(60,40,20,${0.02 + r() * 0.05})` : `rgba(255,245,220,${0.03 + r() * 0.05})`;
    ctx.fillRect(r() * W, r() * H, 4 + r() * 40, 2 + r() * 70);
  }
  const floors = 4;
  const fh = 256;
  const green = "#4a7a66";
  const slats = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    for (let yy = y + 5; yy < y + h; yy += 7) ctx.fillRect(x, yy, w, 2);
  };
  for (let f = 0; f < floors; f++) {
    const y0 = f * fh + 20;
    // moulded floor band
    ctx.fillStyle = trim;
    ctx.fillRect(0, y0 + fh - 28, W, 8);
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, y0 + fh - 20, W, 4);
    for (let w = 0; w < 2; w++) {
      const x = 56 + w * 230;
      const mode = r();
      const lit = mode > 0.7;
      // frame and arched head with keystone
      ctx.fillStyle = trim;
      ctx.beginPath();
      ctx.moveTo(x - 8, y0 + 182);
      ctx.lineTo(x - 8, y0 + 62);
      ctx.quadraticCurveTo(x + 74, y0 + 6, x + 156, y0 + 62);
      ctx.lineTo(x + 156, y0 + 182);
      ctx.fill();
      ctx.fillRect(x - 14, y0 + 178, 176, 8);
      ctx.fillStyle = lit ? "#f3e2a8" : "#6f8896";
      ctx.beginPath();
      ctx.moveTo(x, y0 + 176);
      ctx.lineTo(x, y0 + 64);
      ctx.quadraticCurveTo(x + 74, y0 + 20, x + 148, y0 + 64);
      ctx.lineTo(x + 148, y0 + 176);
      ctx.fill();
      ctx.fillStyle = trim;
      ctx.fillRect(x + 66, y0 + 22, 16, 20);
      if (mode < 0.38) {
        // shutters pulled shut
        slats(x + 2, y0 + 66, 144, 110, green);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(x + 73, y0 + 66, 2, 110);
      } else {
        // glass with a mullion, and the louvred leaves folded open to each side
        ctx.strokeStyle = "rgba(20,16,30,0.55)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x + 74, y0 + 36);
        ctx.lineTo(x + 74, y0 + 176);
        ctx.moveTo(x, y0 + 110);
        ctx.lineTo(x + 148, y0 + 110);
        ctx.stroke();
        slats(x - 38, y0 + 56, 36, 124, green);
        slats(x + 150, y0 + 56, 36, 124, green);
      }
      // a pot of plants on the sill
      if (r() > 0.55) {
        ctx.fillStyle = "#a45a38";
        ctx.fillRect(x + 20, y0 + 166, 40, 14);
        ctx.fillStyle = "#3a8a5a";
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(x + 26 + i * 9, y0 + 160 - r() * 8, 9 + r() * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // rain stains running down from the sill
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = `rgba(50,35,20,${0.07 + r() * 0.08})`;
        ctx.fillRect(x + 6 + r() * 130, y0 + 188, 6 + r() * 10, 30 + r() * 38);
      }
    }
    // wrought-iron balcony: scrolls between the verticals
    ctx.strokeStyle = "#1c1814";
    ctx.lineWidth = 3;
    for (let x = 30; x < W - 30; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, y0 + fh - 78);
      ctx.lineTo(x, y0 + fh - 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 11, y0 + fh - 52, 7, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(30, y0 + fh - 78);
    ctx.lineTo(W - 30, y0 + fh - 78);
    ctx.moveTo(30, y0 + fh - 30);
    ctx.lineTo(W - 30, y0 + fh - 30);
    ctx.stroke();
    // bamboo pole of laundry
    if (r() > 0.6) {
      const ly = y0 + 52;
      ctx.strokeStyle = "#8a6a3a";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(24, ly);
      ctx.lineTo(W - 24, ly);
      ctx.stroke();
      const cols = ["#e8dcc0", "#c8453a", "#3f6f8f", "#e0b04a", "#7a9a86"];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = cols[Math.floor(r() * cols.length)];
        const lx = 40 + i * 88 + r() * 20;
        ctx.fillRect(lx, ly + 3, 26 + r() * 20, 34 + r() * 30);
      }
    }
    if (r() > 0.6) {
      ctx.fillStyle = "#d9d6cc";
      ctx.fillRect(W - 140 + r() * 20, y0 + 60, 90, 54);
      ctx.fillStyle = "#9c988e";
      ctx.fillRect(W - 130 + r() * 20, y0 + 70, 70, 6);
    }
  }
  // flaking plaster that shows the brick beneath
  for (let i = 0; i < 5; i++) {
    const px = r() * (W - 90);
    const py = 40 + r() * (floors * fh - 120);
    const pw = 36 + r() * 60;
    const ph = 26 + r() * 54;
    ctx.fillStyle = "#a35d45";
    ctx.beginPath();
    ctx.moveTo(px, py + ph * 0.4);
    ctx.lineTo(px + pw * 0.3, py);
    ctx.lineTo(px + pw * 0.9, py + ph * 0.2);
    ctx.lineTo(px + pw, py + ph * 0.8);
    ctx.lineTo(px + pw * 0.4, py + ph);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(60,25,15,0.45)";
    ctx.lineWidth = 1.5;
    for (let yy = py + 8; yy < py + ph; yy += 9) {
      ctx.beginPath();
      ctx.moveTo(px + pw * 0.1, yy);
      ctx.lineTo(px + pw * 0.9, yy);
      ctx.stroke();
    }
  }
  // the cornice and parapet at the roofline, with a row of dentils
  ctx.fillStyle = trim;
  ctx.fillRect(0, 0, W, 22);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  for (let x = 6; x < W; x += 18) ctx.fillRect(x, 14, 8, 8);
  // mould creeping up from the street
  const mg = ctx.createLinearGradient(0, floors * fh - 90, 0, floors * fh + 10);
  mg.addColorStop(0, "rgba(40,60,30,0)");
  mg.addColorStop(1, "rgba(40,60,30,0.35)");
  ctx.fillStyle = mg;
  ctx.fillRect(0, floors * fh - 90, W, 100);
  const gy = floors * fh + 10;
  ctx.fillStyle = "#8a6c4c";
  ctx.fillRect(0, gy, W, H - gy);
  if (shop === "shutter") {
    ctx.fillStyle = "#6f7d78";
    ctx.fillRect(30, gy + 14, W - 60, H - gy - 14);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 3;
    for (let y = gy + 24; y < H; y += 14) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(W - 30, y);
      ctx.stroke();
    }
  } else if (shop === "open") {
    ctx.fillStyle = "#4a3020";
    ctx.fillRect(24, gy + 14, W - 48, H - gy - 14);
    const g = ctx.createLinearGradient(0, gy, 0, H);
    g.addColorStop(0, "rgba(255,190,90,0.15)");
    g.addColorStop(1, "rgba(255,190,90,0.7)");
    ctx.fillStyle = g;
    ctx.fillRect(24, gy + 14, W - 48, H - gy - 14);
  }
  return finish(canvas);
};

/** Painted shop board. `style` picks the Saigon sign convention. */
export const signTexture = (text: string, sub: string | null, style: "red" | "enamel" | "teal" | "yellow") => {
  const W = 1024;
  const H = 300;
  const { canvas, ctx } = make(W, H);
  const pal = {
    red: ["#d8342b", "#f4b73f", "#fff3d6"],
    enamel: ["#1b4b9b", "#ffffff", "#f4b73f"],
    teal: ["#1f7a6d", "#fff3d6", "#f4b73f"],
    yellow: ["#f4b73f", "#14111a", "#d8342b"],
  }[style];
  ctx.fillStyle = pal[0];
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = pal[1];
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, W - 32, H - 32);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = pal[1];
  let size = 150;
  ctx.font = `700 ${size}px 'Oswald', sans-serif`;
  while (ctx.measureText(text).width > W - 120 && size > 50) {
    size -= 6;
    ctx.font = `700 ${size}px 'Oswald', sans-serif`;
  }
  ctx.fillText(text, W / 2, sub ? H * 0.42 : H / 2 + 6);
  if (sub) {
    ctx.fillStyle = pal[2];
    ctx.font = "600 52px 'Be Vietnam Pro', sans-serif";
    ctx.fillText(sub, W / 2, H * 0.78);
  }
  return finish(canvas);
};


/** Cement encaustic floor tile (gạch bông), the pattern of old Saigon houses */
export const tileTexture = () => {
  const S = 256;
  const { canvas, ctx } = make(S, S);
  ctx.fillStyle = "#efe4cc";
  ctx.fillRect(0, 0, S, S);
  const cell = (ox: number, oy: number, flip: boolean) => {
    ctx.save();
    ctx.translate(ox + S / 4, oy + S / 4);
    const a = flip ? "#1f7a6d" : "#b3261e";
    const b = flip ? "#b3261e" : "#1f7a6d";
    ctx.fillStyle = a;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(S / 8, S / 16, S / 4 - 6, 0);
      ctx.quadraticCurveTo(S / 8, -S / 16, 0, 0);
      ctx.fill();
    }
    ctx.fillStyle = b;
    ctx.beginPath();
    ctx.arc(0, 0, S / 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#14111a";
    ctx.fillRect(-S / 4 + 3, -S / 4 + 3, S / 2 - 6, 3);
    ctx.fillRect(-S / 4 + 3, S / 4 - 6, S / 2 - 6, 3);
    ctx.restore();
  };
  cell(0, 0, true);
  cell(S / 2, 0, false);
  cell(0, S / 2, false);
  cell(S / 2, S / 2, true);
  ctx.strokeStyle = "rgba(20,17,26,0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, S, S);
  const t = finish(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

export const planksTexture = (base: string) => {
  const { canvas, ctx } = make(512, 512);
  const r = rng(5);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.1})`;
    ctx.fillRect(0, i * 64, 512, 64);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, i * 64, 512, 2);
    for (let k = 0; k < 30; k++) {
      ctx.fillStyle = "rgba(60,30,10,0.12)";
      ctx.fillRect(r() * 512, i * 64 + r() * 60, 20 + r() * 80, 1);
    }
  }
  return finish(canvas);
};

/** Book spine with vertical lettering */
export const spineTexture = (text: string, bg: string, fg: string) => {
  const W = 160;
  const H = 640;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = fg;
  ctx.fillRect(0, 36, W, 6);
  ctx.fillRect(0, H - 42, W, 6);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 52;
  ctx.font = `700 ${size}px 'Be Vietnam Pro', sans-serif`;
  while (ctx.measureText(text).width > H - 150 && size > 18) {
    size -= 2;
    ctx.font = `700 ${size}px 'Be Vietnam Pro', sans-serif`;
  }
  ctx.fillStyle = fg;
  ctx.fillText(text, 0, 0);
  ctx.restore();
  return finish(canvas);
};

/** Airmail envelope: red and blue chevron border, "THƯ" lettering */
export const envelopeTexture = () => {
  const W = 800;
  const H = 520;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = "#f3ead7";
  ctx.fillRect(0, 0, W, H);
  const stripe = 26;
  for (let i = -H; i < W + H; i += stripe * 2) {
    ctx.fillStyle = "#d8342b";
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + stripe, 0);
    ctx.lineTo(i + stripe - 24, 24);
    ctx.lineTo(i - 24, 24);
    ctx.fill();
  }
  ctx.fillStyle = "#f3ead7";
  ctx.fillRect(24, 24, W - 48, H - 48);
  ctx.strokeStyle = "#1b4b9b";
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, W - 20, H - 20);
  ctx.setLineDash([36, 36]);
  ctx.strokeStyle = "#d8342b";
  ctx.strokeRect(10, 10, W - 20, H - 20);
  ctx.setLineDash([]);
  ctx.fillStyle = "#14111a";
  ctx.textAlign = "center";
  ctx.font = "400 84px 'Lobster', cursive";
  ctx.fillText("To you", W / 2, 230);
  ctx.font = "500 34px 'Be Vietnam Pro', sans-serif";
  ctx.fillStyle = "#14111a";
  ctx.fillText("a letter · open me (gửi bạn)", W / 2, 300);
  ctx.fillStyle = "#1b4b9b";
  ctx.fillRect(W - 170, 50, 100, 120);
  ctx.fillStyle = "#f4b73f";
  ctx.beginPath();
  ctx.arc(W - 120, 110, 28, 0, Math.PI * 2);
  ctx.fill();
  return finish(canvas);
};

/** Floating place label above a doorway */
export const labelTexture = (text: string, sub: string) => {
  const W = 512;
  const H = 160;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = "#f4b73f";
  ctx.beginPath();
  ctx.roundRect(8, 8, W - 16, H - 16, 28);
  ctx.fill();
  ctx.fillStyle = "#14111a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 64px 'Oswald', sans-serif";
  ctx.fillText(text, W / 2, 62);
  ctx.font = "600 30px 'Be Vietnam Pro', sans-serif";
  ctx.fillText(sub, W / 2, 114);
  return finish(canvas);
};

/** Striped tarp canopy, the red/blue/white awning of every sidewalk stall */
export const tarpTexture = (a = "#d8342b", b = "#1b4b9b", c = "#f1e6cf") => {
  const { canvas, ctx } = make(256, 256);
  const cols = [a, c, b, c];
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = cols[i % 4];
    ctx.fillRect(i * 32, 0, 32, 256);
  }
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 14);
  }
  const t = finish(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

/** Glazed wall tile (gạch men) in faded teal with a dark grout line */
export const wainscotTexture = () => {
  const { canvas, ctx } = make(256, 256);
  const r = rng(21);
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const v = 0.92 + r() * 0.14;
      ctx.fillStyle = `rgb(${Math.round(62 * v)},${Math.round(130 * v)},${Math.round(118 * v)})`;
      ctx.fillRect(x * 64 + 2, y * 64 + 2, 60, 60);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(x * 64 + 4, y * 64 + 4, 56, 8);
    }
  }
  ctx.fillStyle = "#d9d0b4";
  for (let i = 0; i <= 4; i++) {
    ctx.fillRect(i * 64 - 1, 0, 3, 256);
    ctx.fillRect(0, i * 64 - 1, 256, 3);
  }
  const t = finish(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

/** What you see through the open front door: the hẻm at night */
export const alleyNightTexture = () => {
  const { canvas, ctx } = make(512, 512);
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#9fd0ea");
  g.addColorStop(1, "#efe3c4");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const r = rng(4);
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = `rgba(${150 + Math.floor(r() * 60)},${120 + Math.floor(r() * 50)},80,${0.5 + r() * 0.4})`;
    ctx.fillRect(r() * 480, 40 + r() * 330, 14 + r() * 20, 18 + r() * 24);
  }
  ctx.fillStyle = "#6a6258";
  ctx.fillRect(0, 380, 512, 132);
  ctx.fillStyle = "#e8b04a";
  ctx.beginPath();
  ctx.arc(120, 420, 10, 0, Math.PI * 2);
  ctx.fill();
  return finish(canvas);
};


/** Woven rug with a central medallion */
export const rugTexture = () => {
  const { canvas, ctx } = make(512, 360);
  ctx.fillStyle = "#8f2b22";
  ctx.fillRect(0, 0, 512, 360);
  ctx.strokeStyle = "#e0b25a";
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, 476, 324);
  ctx.strokeStyle = "#1b3b5a";
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, 432, 280);
  ctx.fillStyle = "#e0b25a";
  ctx.beginPath();
  ctx.ellipse(256, 180, 120, 74, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1b3b5a";
  ctx.beginPath();
  ctx.ellipse(256, 180, 96, 56, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e0b25a";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(256 + Math.cos(a) * 60, 180 + Math.sin(a) * 34, 14, 7, a, 0, Math.PI * 2);
    ctx.fill();
  }
  return finish(canvas);
};

export const blobTexture = () => {
  const { canvas, ctx } = make(128, 128);
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return finish(canvas);
};

export const glowTexture = (color = "255,210,140") => {
  const { canvas, ctx } = make(128, 128);
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  g.addColorStop(0, `rgba(${color},0.95)`);
  g.addColorStop(0.25, `rgba(${color},0.35)`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return finish(canvas);
};

/** A pulsing "look here" marker: soft halo, bright ring, centre dot */
export const hotspotTexture = () => {
  const { canvas, ctx } = make(128, 128);
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(255,214,120,0.55)");
  g.addColorStop(1, "rgba(255,214,120,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = "rgba(255,236,170,0.95)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(64, 64, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,246,210,1)";
  ctx.beginPath();
  ctx.arc(64, 64, 8, 0, Math.PI * 2);
  ctx.fill();
  return finish(canvas);
};

const archPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + w / 2);
  ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
};

/** The front of a French-colonial central post office: yellow walls, white trim, arched shuttered windows, a clock, the name board */
export const postOfficeTexture = () => {
  const W = 1024;
  const H = 640;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = "#e3b948";
  ctx.fillRect(0, 0, W, H);
  const r = rng(12);
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = `rgba(90,60,20,${0.02 + r() * 0.05})`;
    ctx.fillRect(r() * W, r() * H, 2 + r() * 30, 1 + r() * 60);
  }
  // cornice and base
  ctx.fillStyle = "#f4ead0";
  ctx.fillRect(0, 0, W, 34);
  ctx.fillRect(0, 70, W, 10);
  ctx.fillStyle = "#6d6a63";
  ctx.fillRect(0, H - 60, W, 60);
  // name board
  ctx.fillStyle = "#f4ead0";
  ctx.fillRect(230, 92, 564, 112);
  ctx.strokeStyle = "#2f6a49";
  ctx.lineWidth = 6;
  ctx.strokeRect(238, 100, 548, 96);
  ctx.fillStyle = "#2f6a49";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 62px 'Oswald', sans-serif";
  ctx.fillText("POST OFFICE", W / 2, 136);
  ctx.font = "600 26px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("Bưu điện", W / 2, 176);
  // clock
  ctx.fillStyle = "#f4ead0";
  ctx.beginPath();
  ctx.arc(W / 2, 252, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2a2118";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(W / 2, 252);
  ctx.lineTo(W / 2, 214);
  ctx.moveTo(W / 2, 252);
  ctx.lineTo(W / 2 + 28, 262);
  ctx.stroke();
  // arched windows with green shutters, and the central entrance
  const win = (x: number) => {
    ctx.fillStyle = "#f4ead0";
    archPath(ctx, x - 8, 300, 136, 250);
    ctx.fill();
    ctx.fillStyle = "#8fb5cc";
    archPath(ctx, x, 308, 120, 242);
    ctx.fill();
    ctx.fillStyle = "#cfe3ee";
    ctx.fillRect(x + 12, 400, 30, 40);
    ctx.fillStyle = "#3f7a58";
    ctx.fillRect(x - 38, 330, 34, 210);
    ctx.fillRect(x + 124, 330, 34, 210);
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 2;
    for (let y = 338; y < 540; y += 12) {
      ctx.beginPath();
      ctx.moveTo(x - 38, y);
      ctx.lineTo(x - 4, y);
      ctx.moveTo(x + 124, y);
      ctx.lineTo(x + 158, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "#f4ead0";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x + 60, 308);
    ctx.lineTo(x + 60, 550);
    ctx.moveTo(x, 430);
    ctx.lineTo(x + 120, 430);
    ctx.stroke();
  };
  [90, 270, 640, 820].forEach(win);
  ctx.fillStyle = "#f4ead0";
  archPath(ctx, 424, 290, 176, 300);
  ctx.fill();
  const g = ctx.createLinearGradient(0, 300, 0, 590);
  g.addColorStop(0, "#3a2410");
  g.addColorStop(1, "#ffb869");
  ctx.fillStyle = g;
  archPath(ctx, 436, 300, 152, 290);
  ctx.fill();
  // pilasters
  ctx.fillStyle = "#f4ead0";
  [20, 190, 350, 660, 770, 960].forEach((x) => ctx.fillRect(x, 210, 14, 380));
  return finish(canvas);
};

/** Thank-you postcard pinned on the post-office wall, with a stamp and a postmark */
export const postcardTexture = () => {
  const W = 600;
  const H = 400;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = "#f4ead0";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#d8342b";
  ctx.lineWidth = 8;
  ctx.setLineDash([26, 14]);
  ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.setLineDash([]);
  ctx.fillStyle = "#1b4b9b";
  ctx.textAlign = "center";
  ctx.font = "400 76px 'Lobster', cursive";
  ctx.fillText("Thank you", W / 2, 150);
  ctx.fillText("for visiting!", W / 2, 232);
  ctx.fillStyle = "#2a2118";
  ctx.font = "600 28px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("Cảm ơn bạn đã ghé thăm", W / 2, 306);
  ctx.fillStyle = "#d8342b";
  ctx.fillRect(W - 128, 34, 84, 100);
  ctx.fillStyle = "#f4b73f";
  ctx.beginPath();
  ctx.arc(W - 86, 84, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(42,33,24,0.6)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W - 170, 110, 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W - 214, 100);
  ctx.lineTo(W - 126, 100);
  ctx.moveTo(W - 214, 118);
  ctx.lineTo(W - 126, 118);
  ctx.stroke();
  return finish(canvas);
};

/** Interior back wall of the post hall: yellow plaster, green wainscot, tall arched windows, a big clock */
export const postHallTexture = () => {
  const W = 1024;
  const H = 512;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = "#e0b546";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#2f6a49";
  ctx.fillRect(0, H - 120, W, 120);
  ctx.fillStyle = "#f4ead0";
  ctx.fillRect(0, H - 124, W, 8);
  [120, 420, 720].forEach((x) => {
    ctx.fillStyle = "#f4ead0";
    archPath(ctx, x - 8, 40, 196, 340);
    ctx.fill();
    ctx.fillStyle = "#8fb5cc";
    archPath(ctx, x, 48, 180, 332);
    ctx.fill();
    ctx.strokeStyle = "#f4ead0";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x + 90, 48);
    ctx.lineTo(x + 90, 380);
    ctx.moveTo(x, 200);
    ctx.lineTo(x + 180, 200);
    ctx.stroke();
  });
  return finish(canvas);
};

/** Hand-painted travel-poster art of four famous old Saigon landmarks */
export const landmarkPoster = (kind: "benthanh" | "ducba" | "buudien" | "nhahat") => {
  const W = 400;
  const H = 560;
  const { canvas, ctx } = make(W, H);
  const conf = {
    benthanh: { bg: "#a8392b", label: "BEN THANH MARKET", sub: "Chợ Bến Thành" },
    ducba: { bg: "#2f5f86", label: "NOTRE-DAME CATHEDRAL", sub: "Nhà thờ Đức Bà" },
    buudien: { bg: "#2f6a49", label: "CENTRAL POST OFFICE", sub: "Bưu điện Thành phố" },
    nhahat: { bg: "#8a5a2b", label: "MUNICIPAL THEATRE", sub: "Nhà hát Thành phố" },
  }[kind];
  const cream = "#f1e3c2";
  const ink = "#2a2118";
  ctx.fillStyle = conf.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2, 360);
    const a = (i / 20) * Math.PI * 2;
    ctx.lineTo(W / 2 + Math.cos(a) * 700, 360 + Math.sin(a) * 700);
    ctx.lineTo(W / 2 + Math.cos(a + 0.16) * 700, 360 + Math.sin(a + 0.16) * 700);
    ctx.fill();
  }
  ctx.strokeStyle = cream;
  ctx.lineWidth = 9;
  ctx.strokeRect(16, 16, W - 32, H - 32);
  ctx.fillStyle = cream;
  ctx.textAlign = "center";
  ctx.font = "400 70px 'Lobster', cursive";
  ctx.fillText("Sài Gòn", W / 2, 110);

  ctx.lineWidth = 4;
  ctx.strokeStyle = ink;
  const poly = (pts: [number, number][], fill: string) => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
  };
  const rect = (x: number, y: number, w: number, h: number, fill: string) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill);
  const arch = (x: number, y: number, w: number, h: number, fill: string) => {
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + w / 2);
    ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
  };
  const clock = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - r * 0.7);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * 0.5, cy + r * 0.2);
    ctx.stroke();
  };
  const ground = () => rect(50, 440, 300, 22, "#6d6a63");

  if (kind === "benthanh") {
    rect(70, 380, 260, 60, "#e0b546");
    [90, 135, 240, 285].forEach((x) => arch(x, 395, 28, 45, "#3a2410"));
    rect(150, 300, 100, 80, "#e0b546");
    arch(178, 335, 44, 45, "#3a2410");
    rect(170, 230, 60, 70, "#e0b546");
    poly([[165, 230], [235, 230], [200, 185]], "#d8342b");
    rect(193, 160, 14, 28, "#d8342b");
    clock(200, 262, 20);
    poly([[70, 380], [150, 380], [150, 345], [110, 330]], "#d8342b");
    poly([[330, 380], [250, 380], [250, 345], [290, 330]], "#d8342b");
    ground();
  } else if (kind === "ducba") {
    rect(120, 300, 160, 140, "#c0583f");
    rect(110, 210, 56, 100, "#c0583f");
    rect(234, 210, 56, 100, "#c0583f");
    poly([[106, 210], [170, 210], [138, 140]], "#6d3a2a");
    poly([[230, 210], [294, 210], [262, 140]], "#6d3a2a");
    [138, 262].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, 140);
      ctx.lineTo(x, 112);
      ctx.moveTo(x - 9, 124);
      ctx.lineTo(x + 9, 124);
      ctx.stroke();
    });
    poly([[166, 300], [234, 300], [200, 246]], "#c0583f");
    ctx.beginPath();
    ctx.arc(200, 332, 20, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();
    ctx.stroke();
    [132, 180, 228].forEach((x) => arch(x, 372, 34, 68, "#3a2410"));
    [122, 246].forEach((x) => arch(x, 240, 30, 50, "#1c2a4a"));
    ground();
  } else if (kind === "buudien") {
    rect(80, 330, 240, 110, "#e0b546");
    poly([[70, 330], [330, 330], [320, 312], [80, 312]], cream);
    [96, 148, 240, 292].forEach((x) => arch(x, 345, 30, 70, "#1c2a4a"));
    arch(172, 330, 56, 110, "#3a2410");
    rect(150, 250, 100, 62, "#e0b546");
    rect(166, 262, 68, 22, cream);
    poly([[145, 250], [255, 250], [200, 214]], cream);
    clock(200, 296, 0.1);
    ctx.beginPath();
    ctx.arc(200, 232, 14, 0, Math.PI * 2);
    ctx.fillStyle = cream;
    ctx.fill();
    ctx.stroke();
    ground();
  } else {
    rect(80, 390, 240, 50, "#d9c9a3");
    [100, 125, 150, 175, 200, 225, 250, 275].forEach((x) => rect(x, 320, 12, 70, cream));
    poly([[85, 320], [315, 320], [200, 255]], cream);
    ctx.beginPath();
    ctx.arc(200, 292, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#e0b546";
    ctx.fill();
    ctx.stroke();
    arch(168, 215, 64, 40, "#d9c9a3");
    ground();
  }

  ctx.fillStyle = cream;
  ctx.textAlign = "center";
  ctx.font = "700 30px 'Oswald', sans-serif";
  ctx.fillText(conf.label, W / 2, 500);
  ctx.font = "500 20px 'Be Vietnam Pro', sans-serif";
  ctx.fillText(conf.sub, W / 2, 528);
  return finish(canvas);
};

/** The back of a Stony Brook Seawolves shirt: white lettering on SBU red */
export const seawolvesTexture = () => {
  const { canvas, ctx } = make(256, 256);
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 46px 'Oswald', sans-serif";
  ctx.fillText("STONY", 128, 78);
  ctx.fillText("BROOK", 128, 128);
  ctx.font = "600 30px 'Oswald', sans-serif";
  ctx.fillText("SEAWOLVES", 128, 182);
  const t = finish(canvas);
  return t;
};

/** The Stony Brook Seawolves logo (public/seawolves-logo.svg), with a white halo so it reads on the red shirt */
export const seawolfLogoTexture = () => {
  const { canvas, ctx } = make(256, 256);
  const tex = finish(canvas);
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, 256, 256);
    const w = 214;
    const h = (w * 181) / 250;
    ctx.shadowColor = "rgba(255,255,255,0.95)";
    ctx.shadowBlur = 10;
    for (let i = 0; i < 3; i++) ctx.drawImage(img, (256 - w) / 2, (256 - h) / 2, w, h);
    tex.needsUpdate = true;
  };
  img.src = `${import.meta.env.BASE_URL}seawolves-logo.svg`;
  return tex;
};

/** The folded Alley Times as it lies on the table: masthead and the first columns, with a crease across the middle */
export const foldedPaperTexture = () => {
  const W = 512;
  const H = 360;
  const { canvas, ctx } = make(W, H);
  const r = rng(11);
  ctx.fillStyle = "#e8d9ae";
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 160; i++) {
    ctx.fillStyle = `rgba(90,60,20,${0.02 + r() * 0.05})`;
    ctx.fillRect(r() * W, r() * H, 2 + r() * 30, 1 + r() * 16);
  }
  ctx.fillStyle = "#2a2118";
  ctx.fillRect(22, 24, W - 44, 4);
  ctx.fillRect(22, 92, W - 44, 4);
  ctx.textAlign = "center";
  ctx.font = "700 54px 'Oswald', sans-serif";
  ctx.fillText("THE ALLEY TIMES", W / 2, 80);
  ctx.font = "600 15px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("★ EXPERIENCE NEWS ★  ·  BÁO HẺM  ·  PRICE: ONE COFFEE", W / 2, 118);
  const colW = (W - 44 - 24) / 3;
  for (let c = 0; c < 3; c++) {
    const x = 22 + c * (colW + 12);
    ctx.fillStyle = "#2a2118";
    ctx.fillRect(x, 140, colW * (0.55 + r() * 0.4), 14);
    for (let y = 168; y < H - 20; y += 11) {
      ctx.fillStyle = `rgba(42,33,24,${0.5 + r() * 0.3})`;
      ctx.fillRect(x, y, colW * (0.7 + r() * 0.3), 3);
    }
  }
  ctx.fillStyle = "rgba(42,33,24,0.14)";
  ctx.fillRect(0, H - 6, W, 6);
  return finish(canvas);
};

export type CoverArt = "robot" | "lens" | "loop" | "scales" | "quill";

/** A book cover, face-out on the shelf: flat colour, a bold line drawing, title and subtitle */
export const bookCoverTexture = (art: CoverArt, title: string, subtitle: string, bg: string, fg: string) => {
  const W = 600;
  const H = 800;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.fillStyle = fg;
  ctx.strokeStyle = fg;
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.save();
  ctx.translate(W / 2, 270);
  if (art === "robot") {
    ctx.strokeRect(-95, -70, 190, 150);
    ctx.beginPath();
    ctx.moveTo(0, -70);
    ctx.lineTo(0, -120);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -128, 10, 0, Math.PI * 2);
    ctx.fill();
    [-42, 42].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, -10, 17, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(0, 28, 36, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.strokeRect(-60, 100, 120, 40);
  } else if (art === "lens") {
    ctx.beginPath();
    ctx.arc(-10, -10, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.moveTo(62, 62);
    ctx.lineTo(125, 125);
    ctx.stroke();
    ctx.lineWidth = 7;
    const nodes: [number, number][] = [[-60, -30], [-10, -65], [40, -25], [-30, 25], [25, 35]];
    [[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [1, 3]].forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(nodes[a][0], nodes[a][1]);
      ctx.lineTo(nodes[b][0], nodes[b][1]);
      ctx.stroke();
    });
    nodes.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (art === "loop") {
    [0, Math.PI].forEach((a0) => {
      ctx.beginPath();
      ctx.arc(0, 0, 95, a0 + 0.35, a0 + Math.PI - 0.35);
      ctx.stroke();
      const a = a0 + Math.PI - 0.35;
      const [nx, ny] = [Math.cos(a), Math.sin(a)];
      const [x, y] = [nx * 95, ny * 95];
      ctx.beginPath();
      ctx.moveTo(x - ny * 36, y + nx * 36);
      ctx.lineTo(x + nx * 28, y + ny * 28);
      ctx.lineTo(x - nx * 28, y - ny * 28);
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
  } else if (art === "scales") {
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(0, 130);
    ctx.moveTo(-60, 135);
    ctx.lineTo(60, 135);
    ctx.moveTo(-120, -80);
    ctx.lineTo(120, -80);
    ctx.stroke();
    ctx.lineWidth = 6;
    [-120, 120].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, -80);
      ctx.lineTo(x - 50, 20);
      ctx.moveTo(x, -80);
      ctx.lineTo(x + 50, 20);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, 20, 50, 0, Math.PI);
      ctx.fill();
    });
  } else {
    ctx.beginPath();
    ctx.moveTo(-90, 110);
    ctx.quadraticCurveTo(-20, 40, 90, -120);
    ctx.quadraticCurveTo(70, 20, -20, 100);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-110, 135);
    ctx.lineTo(10, 135);
    ctx.stroke();
  }
  ctx.restore();
  ctx.textAlign = "center";
  let size = 74;
  const family = "'Oswald', sans-serif";
  ctx.font = `700 ${size}px ${family}`;
  while (ctx.measureText(title.toUpperCase()).width > W - 130 && size > 30) {
    size -= 2;
    ctx.font = `700 ${size}px ${family}`;
  }
  const words = title.toUpperCase().split(" ");
  const lines: string[] = [];
  if (ctx.measureText(words.join(" ")).width <= W - 130 && words.length < 3) lines.push(words.join(" "));
  else {
    const mid = Math.ceil(words.length / 2);
    lines.push(words.slice(0, mid).join(" "), words.slice(mid).join(" "));
  }
  ctx.font = `700 ${Math.min(size, 66)}px ${family}`;
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 520 + i * 70));
  ctx.font = "500 24px 'Be Vietnam Pro', sans-serif";
  const sub = subtitle.split(" ");
  const sl: string[] = [""];
  sub.forEach((w) => {
    const cur = sl[sl.length - 1];
    if (ctx.measureText(`${cur} ${w}`).width > W - 150 && cur) sl.push(w);
    else sl[sl.length - 1] = cur ? `${cur} ${w}` : w;
  });
  sl.forEach((l, i) => ctx.fillText(l, W / 2, 520 + lines.length * 70 + 8 + i * 32));
  return finish(canvas);
};

/** A round "COMING SOON" stamp for the blog's cover */
export const comingSoonTexture = () => {
  const { canvas, ctx } = make(256, 128);
  ctx.translate(128, 64);
  ctx.rotate(-0.2);
  ctx.strokeStyle = "#d8342b";
  ctx.fillStyle = "#d8342b";
  ctx.lineWidth = 6;
  ctx.strokeRect(-110, -40, 220, 80);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 44px 'Oswald', sans-serif";
  ctx.fillText("COMING SOON", 0, 2);
  return finish(canvas);
};

/** The laptop's keyboard deck: rows of dark keys and a trackpad on brushed aluminium */
export const laptopKeysTexture = () => {
  const W = 680;
  const H = 460;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = "#c5c8ce";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#1c1d22";
  const rows = [14, 14, 14, 13, 12];
  rows.forEach((n, r) => {
    const kw = (W - 60) / 14;
    const x0 = 30 + (14 - n) * kw * 0.5;
    for (let i = 0; i < n; i++) ctx.fillRect(x0 + i * kw + 2, 30 + r * 50, kw - 4, 42);
  });
  ctx.fillRect(30 + 3 * ((W - 60) / 14), 30 + 5 * 50, 6.5 * ((W - 60) / 14), 42);
  ctx.fillStyle = "#b3b6bd";
  ctx.fillRect(W / 2 - 110, 312, 220, 120);
  ctx.strokeStyle = "#9a9da4";
  ctx.lineWidth = 3;
  ctx.strokeRect(W / 2 - 110, 312, 220, 120);
  return finish(canvas);
};

/** What the laptop shows while you are at the desk: a soft wallpaper with a menu bar and a dock */
export const laptopScreenTexture = () => {
  const W = 640;
  const H = 420;
  const { canvas, ctx } = make(W, H);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#1b4b9b");
  g.addColorStop(0.55, "#8a3f6a");
  g.addColorStop(1, "#f4b73f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(0, 0, W, 18);
  ctx.fillStyle = "rgba(20,17,26,0.7)";
  ctx.fillRect(14, 6, 40, 6);
  ctx.fillRect(66, 6, 30, 6);
  ctx.fillRect(W - 70, 6, 56, 6);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillRect(70, 70, 300, 190);
  ctx.fillStyle = "#e4e6ea";
  ctx.fillRect(70, 70, 300, 22);
  ctx.fillStyle = "#14111a";
  for (let y = 108; y < 250; y += 18) ctx.fillRect(86, y, 150 + ((y * 7) % 90), 5);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(W / 2 - 110, H - 46, 220, 34);
  ["#d8342b", "#f4b73f", "#2c8c7e", "#1b4b9b", "#8a3f6a"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(W / 2 - 98 + i * 42, H - 41, 24, 24);
  });
  return finish(canvas);
};

/** Cloth speaker grille of a 1960s radio: gold and cream threads with a dark weave */
export const radioGrilleTexture = () => {
  const { canvas, ctx } = make(240, 170);
  ctx.fillStyle = "#c9a45a";
  ctx.fillRect(0, 0, 240, 170);
  for (let x = 0; x < 240; x += 6) {
    ctx.fillStyle = x % 12 ? "rgba(255,240,200,0.5)" : "rgba(60,35,15,0.35)";
    ctx.fillRect(x, 0, 3, 170);
  }
  for (let y = 0; y < 170; y += 6) {
    ctx.fillStyle = "rgba(60,35,15,0.18)";
    ctx.fillRect(0, y, 240, 2);
  }
  return finish(canvas);
};

/** The tuning dial: station names and kilohertz marks on a cream scale with a red needle */
export const radioDialTexture = () => {
  const { canvas, ctx } = make(260, 340);
  ctx.fillStyle = "#f3e2b0";
  ctx.fillRect(0, 0, 260, 340);
  ctx.fillStyle = "#2a2118";
  ctx.textAlign = "center";
  ctx.font = "700 30px 'Oswald', sans-serif";
  ctx.fillText("SÀI GÒN", 130, 56);
  ctx.font = "500 18px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("PHÁT THANH", 130, 82);
  ctx.strokeStyle = "#2a2118";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 20; i++) {
    const x = 24 + i * 10.8;
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.lineTo(x, i % 5 === 0 ? 200 : 180);
    ctx.stroke();
  }
  ctx.font = "600 17px 'Be Vietnam Pro', sans-serif";
  ["55", "80", "100", "130", "160"].forEach((t, i) => ctx.fillText(t, 24 + i * 54, 226));
  ctx.strokeStyle = "#d8342b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(98, 136);
  ctx.lineTo(98, 214);
  ctx.stroke();
  ctx.fillStyle = "#8a3f2a";
  ctx.font = "600 15px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("AM · kHz", 130, 282);
  return finish(canvas);
};

export const musicNoteTexture = () => {
  const { canvas, ctx } = make(64, 64);
  ctx.fillStyle = "#ffd9a0";
  ctx.font = "700 52px 'Be Vietnam Pro', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("♪", 32, 50);
  return finish(canvas);
};

/** The flag of Vietnam: a gold five-pointed star on red, with a faint cloth weave */
export const flagTexture = () => {
  const W = 300;
  const H = 200;
  const { canvas, ctx } = make(W, H);
  ctx.fillStyle = "#da251d";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffff00";
  ctx.beginPath();
  const cx = W / 2;
  const cy = H / 2;
  const R = H * 0.3;
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? R * 0.382 : R;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  for (let x = 0; x < W; x += 4) ctx.fillRect(x, 0, 1, H);
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
  return finish(canvas);
};
