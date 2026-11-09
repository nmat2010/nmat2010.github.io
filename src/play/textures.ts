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

/** One hẻm house front: tiled wall, shuttered windows, rails, plants, AC boxes, a ground floor. */
export const facadeTexture = (wall: string, trim: string, seed: number, shop: ShopKind) => {
  const W = 512;
  const H = 1280;
  const { canvas, ctx } = make(W, H);
  const r = rng(seed);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(20,16,30,${0.02 + r() * 0.05})`;
    ctx.fillRect(r() * W, r() * H, 2 + r() * 26, 1 + r() * 60);
  }
  const floors = 4;
  const fh = 256;
  for (let f = 0; f < floors; f++) {
    const y0 = f * fh + 20;
    ctx.fillStyle = trim;
    ctx.fillRect(0, y0 + fh - 28, W, 10);
    for (let w = 0; w < 2; w++) {
      const x = 56 + w * 230;
      const lit = r() > 0.5;
      ctx.fillStyle = trim;
      ctx.fillRect(x - 8, y0 + 34, 164, 146);
      ctx.fillStyle = lit ? "#f3e2a8" : "#7f98a8";
      ctx.fillRect(x, y0 + 42, 148, 130);
      ctx.strokeStyle = "rgba(20,16,30,0.55)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 74, y0 + 42);
      ctx.lineTo(x + 74, y0 + 172);
      ctx.stroke();
      if (!lit && r() > 0.5) {
        ctx.fillStyle = "#3a8a6a";
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(x + 20 + i * 34, y0 + 180, 12 + r() * 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    // balcony rail
    ctx.strokeStyle = "#14111a";
    ctx.lineWidth = 3;
    for (let x = 30; x < W - 30; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, y0 + fh - 78);
      ctx.lineTo(x, y0 + fh - 30);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(30, y0 + fh - 78);
    ctx.lineTo(W - 30, y0 + fh - 78);
    ctx.stroke();
    if (r() > 0.55) {
      ctx.fillStyle = "#d9d6cc";
      ctx.fillRect(W - 140 + r() * 20, y0 + 60, 90, 54);
      ctx.fillStyle = "#9c988e";
      ctx.fillRect(W - 130 + r() * 20, y0 + 70, 70, 6);
    }
  }
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
