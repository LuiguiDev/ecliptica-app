import * as THREE from 'three';

// Textura procedural de la Tierra (azul + continentes verdes simplificados)
export function makeEarthTexture() {
  const w = 512, h = 256;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1a4f9c';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#2e7d32';
  const blobs = [
    [70, 90, 45, 30], [110, 130, 25, 40], [90, 60, 30, 20],
    [200, 80, 40, 25], [240, 110, 30, 35], [260, 70, 35, 25],
    [300, 140, 45, 30], [380, 90, 35, 28], [420, 130, 30, 30],
    [350, 60, 50, 22], [160, 170, 35, 25], [450, 70, 40, 22],
  ];
  for (const [x, y, rx, ry] of blobs) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#e8f4ff';
  ctx.fillRect(0, 0, w, 14);
  ctx.fillRect(0, h - 14, w, 14);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Sprite de texto (etiquetas 3D)
export function makeTextSprite(text, { color = '#d84bd8', fontSize = 44 } = {}) {
  const c = document.createElement('canvas');
  const ctx0 = c.getContext('2d');
  ctx0.font = `italic 600 ${fontSize}px 'Segoe UI', sans-serif`;
  const w = Math.ceil(ctx0.measureText(text).width) + 20;
  c.width = w; c.height = fontSize + 24;
  const ctx = c.getContext('2d');
  ctx.font = `italic 600 ${fontSize}px 'Segoe UI', sans-serif`;
  ctx.fillStyle = color;
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 8;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 10, c.height / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, aspect: c.width / c.height };
}

// Sprite de resplandor radial para el Sol
export function makeGlowTexture(inner = 'rgba(255,230,150,1)', outer = 'rgba(255,150,40,0)') {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, 'rgba(255,200,90,0.55)');
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Resplandor de una estrella destacada en el color dado (hex)
export function makeStarGlowTexture(color) {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.12, color);
  g.addColorStop(0.35, `${color}66`);
  g.addColorStop(1, `${color}00`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Disco suave para dibujar estrellas redondas con THREE.Points
export function makeDotTexture() {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.55, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}
