/* eslint-disable */
// VENDORED from Claude Design ("Buyue Hero.html" → hero-scene.js). Adapted for the
// Next.js app: wrapped as initHeroScene(mount) → destroy(); its own navbar, theme
// toggle, language toggle and copy rendering are removed (the production app owns
// those and renders #head/#sub/#ctas from next-intl). Do not lint/format — kept
// close to source on purpose so it can be re-synced from the design.
import * as THREE from 'three';

export function initHeroScene(__mountEl) {
  const __ac = new AbortController();
  const __sig = __ac.signal;
  let __running = true;
  let __raf1 = 0,
    __raf2 = 0;
  let __themeObs = null;
  // Reset cross-frame flags so a re-init (React StrictMode dev double-mount) is clean.
  ['__revealed','__textShown','__hudOn','__light','__mEnergy','__frame','__textRects','__T','__err','__pmx','__pmy'].forEach((k) => {
    try { delete window[k]; } catch (_e) {}
  });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NObj = __mountEl;

// ---------- renderer / scene / view camera ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;
NObj.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070609, 0.018);

const view = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
view.position.set(2.7, 1.8, 6.4);
const viewTarget = new THREE.Vector3(0, 1.0, 0.7);
view.lookAt(viewTarget);

// ---------- environment map (soft, cheerful reflections) ----------
const pmrem = new THREE.PMREMGenerator(renderer);
function envTex() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#2a2622'); g.addColorStop(0.5, '#141210'); g.addColorStop(1, '#050404');
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  const spot = (cx, cy, r, col) => { const rg = x.createRadialGradient(cx, cy, 2, cx, cy, r); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(0, 0, 1024, 512); };
  spot(300, 160, 300, 'rgba(255,225,190,1)');
  spot(800, 140, 260, 'rgba(180,215,240,0.95)');
  spot(600, 80, 240, 'rgba(200,225,190,0.7)');
  spot(512, 12, 380, 'rgba(255,255,255,0.6)');
  // crisp studio softbox panels — give metal/glass real hard reflections
  const soft = (cx, cy, w, h, a) => { const rg = x.createLinearGradient(cx-w/2, cy, cx+w/2, cy); rg.addColorStop(0,'rgba(255,255,255,0)'); rg.addColorStop(0.5,'rgba(255,255,255,'+a+')'); rg.addColorStop(1,'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(cx-w/2, cy-h/2, w, h); x.strokeStyle='rgba(255,255,255,'+(a*0.5)+')'; x.lineWidth=2; x.strokeRect(cx-w/2, cy-h/2, w, h); };
  soft(240, 180, 150, 220, 0.95);
  soft(760, 150, 120, 180, 0.7);
  soft(512, 360, 300, 60, 0.4);
  const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; return t;
}
scene.environment = pmrem.fromEquirectangular(envTex()).texture;

// ---------- procedural PBR maps (real-surface feel) ----------
function noiseMap(size, base, amp, scale) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
  const img = x.createImageData(size, size); const d = img.data;
  for (let i = 0; i < size*size; i++) { const n = base + (Math.random()-0.5)*amp; const v = Math.max(0, Math.min(255, n*255)); d[i*4]=d[i*4+1]=d[i*4+2]=v; d[i*4+3]=255; }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(scale||3, scale||3); return t;
}
function brushedMap(size, dir) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
  x.fillStyle = '#808080'; x.fillRect(0,0,size,size);
  for (let i = 0; i < size*3; i++) { const p = Math.random()*size; const a = Math.random()*0.28; x.strokeStyle = 'rgba('+(Math.random()>0.5?'255,255,255,':'0,0,0,')+a+')'; x.lineWidth = Math.random()*1.4+0.3; x.beginPath(); if (dir==='v'){ x.moveTo(p,0); x.lineTo(p+ (Math.random()-0.5)*4, size); } else { x.moveTo(0,p); x.lineTo(size, p+(Math.random()-0.5)*4); } x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2,2); return t;
}
function normalFromBumps(size, count, r) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
  x.fillStyle = '#8080ff'; x.fillRect(0,0,size,size);
  for (let i = 0; i < count; i++) { const px = Math.random()*size, py = Math.random()*size; const g = x.createRadialGradient(px-r*0.3, py-r*0.3, 0, px, py, r); g.addColorStop(0,'#a0a0ff'); g.addColorStop(0.5,'#8080ff'); g.addColorStop(1,'#6060ff'); x.fillStyle = g; x.beginPath(); x.arc(px,py,r,0,7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4,4); return t;
}
const shellRough = noiseMap(256, 0.42, 0.14, 3);
const shellNormal = normalFromBumps(256, 900, 3);
const darkRough = noiseMap(256, 0.55, 0.18, 4);
const brushV = brushedMap(256, 'v');
const gripNormal = normalFromBumps(128, 1600, 4);

// ---------- lights ----------
const hemi = new THREE.HemisphereLight(0x3a352c, 0x080604, 0.9); scene.add(hemi);
const amb = new THREE.AmbientLight(0xffffff, 0.22); scene.add(amb);
const key = new THREE.SpotLight(0xffd9b8, 180, 24, Math.PI / 4, 0.55, 1.1);
key.position.set(-3, 2.6, 4.2); key.target.position.copy(viewTarget); scene.add(key, key.target);
const rimL = new THREE.PointLight(0xffb070, 90, 18, 1.6); rimL.position.set(3.6, 1.6, -1.0); scene.add(rimL);
const sageL = new THREE.PointLight(0xffd9a0, 40, 16, 1.7); sageL.position.set(-2.4, 0.4, 2.6); scene.add(sageL);
const fillL = new THREE.DirectionalLight(0xfff2e4, 1.0); fillL.position.set(2, 1.4, 6); scene.add(fillL);
const keyWhite = new THREE.DirectionalLight(0xffffff, 1.1); keyWhite.position.set(-2, 3, 4); scene.add(keyWhite);

// ---------- materials (black magnesium + bronze cinematic) ----------
const M = {
  shell: new THREE.MeshPhysicalMaterial({ color: 0x030303, roughness: 0.13, metalness: 0.7, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 1.9, roughnessMap: darkRough, normalMap: shellNormal, normalScale: new THREE.Vector2(0.4,0.4) }),
  shellSage: new THREE.MeshPhysicalMaterial({ color: 0x050505, roughness: 0.14, metalness: 0.72, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: 1.85, roughnessMap: brushV, normalMap: brushV, normalScale: new THREE.Vector2(0.12,0.12) }),
  shellDark: new THREE.MeshPhysicalMaterial({ color: 0x050505, roughness: 0.6, metalness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.5, envMapIntensity: 1.1, roughnessMap: darkRough, normalMap: shellNormal, normalScale: new THREE.Vector2(0.5,0.5) }),
  chrome: new THREE.MeshStandardMaterial({ color: 0x8a8d92, roughness: 0.28, metalness: 1.0, envMapIntensity: 1.6, roughnessMap: brushV, normalMap: brushV, normalScale: new THREE.Vector2(0.14,0.14) }),
  bronze: new THREE.MeshStandardMaterial({ color: 0xbc9656, roughness: 0.3, metalness: 1.0, envMapIntensity: 1.6, roughnessMap: brushV, normalMap: brushV, normalScale: new THREE.Vector2(0.12,0.12) }),
  gold: new THREE.MeshStandardMaterial({ color: 0xe8c884, roughness: 0.26, metalness: 1.0, envMapIntensity: 1.7, roughnessMap: brushV }),
  glassPanel: new THREE.MeshPhysicalMaterial({ color: 0x0e0e0e, roughness: 0.06, metalness: 0, transmission: 0.7, thickness: 0.6, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6, transparent: true }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x03050a, roughness: 0.05, metalness: 0, transmission: 0.28, thickness: 1.5, ior: 1.72, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.9, iridescence: 0.95, iridescenceIOR: 2.0, emissive: 0x000000, emissiveIntensity: 0 }),
  coat: new THREE.MeshPhysicalMaterial({ color: 0x2a3320, roughness: 0.02, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.6, iridescence: 1.0, iridescenceIOR: 2.0, iridescenceThicknessRange: [140, 520], transparent: true, opacity: 0.42 }),
  glowFlame: new THREE.MeshStandardMaterial({ color: 0xffb488, emissive: 0xff6a34, emissiveIntensity: 2.6, roughness: 0.4 }),
  glowGold: new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: 0xe8a24a, emissiveIntensity: 2.2, roughness: 0.4 }),
  glowSage: new THREE.MeshStandardMaterial({ color: 0xffc98a, emissive: 0xff7a45, emissiveIntensity: 2.0, roughness: 0.4 }),
  core: new THREE.MeshStandardMaterial({ color: 0xffd0a0, emissive: 0xff7a45, emissiveIntensity: 2.8, roughness: 0.4 }),
  screen: new THREE.MeshStandardMaterial({ color: 0x0a0d10, roughness: 0.08, metalness: 0.2, emissive: 0x1a1206, emissiveIntensity: 0.7 }),
};

// rounded-box geometry (soft neumorphic edges)
function roundedBoxGeo(w, h, d, r) {
  const s = new THREE.Shape(); const x = -w/2, y = -h/2;
  s.moveTo(x+r, y); s.lineTo(x+w-r, y); s.quadraticCurveTo(x+w, y, x+w, y+r);
  s.lineTo(x+w, y+h-r); s.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  s.lineTo(x+r, y+h); s.quadraticCurveTo(x, y+h, x, y+h-r);
  s.lineTo(x, y+r); s.quadraticCurveTo(x, y, x+r, y);
  const bev = Math.min(0.06, d*0.24);
  const g = new THREE.ExtrudeGeometry(s, { depth: d - bev*2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 4, curveSegments: 10 });
  g.center(); return g;
}
function rbox(w, h, d, r, m, p, rot) { const g = new THREE.Mesh(roundedBoxGeo(w, h, d, r), m); g.position.set(...p); if (rot) g.rotation.set(...rot); return g; }
function cyl(rt, rb, h, m, p, s = 40, rot = [0,0,0]) { const g = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m); g.position.set(...p); g.rotation.set(...rot); return g; }
function sph(r, m, p) { const g = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), m); g.position.set(...p); return g; }

// ═══════════════ BUYUE CONCEPT CAMERA — ground-up iconic build ═══════════════
const cam = new THREE.Group();
const parts = [];
let pDelay = 0;
function reg(mesh, dist = 2.6) {
  const dir = new THREE.Vector3(Math.random()-0.5, Math.random()-0.3, Math.random()-0.5).normalize();
  parts.push({ mesh, home: mesh.position.clone(), homeRot: mesh.rotation.clone(),
    scatter: mesh.position.clone().add(dir.multiplyScalar(dist)),
    scatterRot: new THREE.Euler((Math.random()-0.5)*1.7, (Math.random()-0.5)*1.7, (Math.random()-0.5)*1.7),
    delay: pDelay });
  pDelay += 0.03; return mesh;
}
function lring(rt, rb, h, m, z, s = 56) { const g = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m); g.rotation.x = Math.PI/2; g.position.z = z; return g; }

// extra materials
const gripRubber = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0b, roughness: 0.92, metalness: 0.0, clearcoat: 0.18, clearcoatRoughness: 0.7, normalMap: gripNormal, normalScale: new THREE.Vector2(0.7,0.7), envMapIntensity: 0.4 });
const matRubber = gripRubber;
const carbon = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, roughness: 0.45, metalness: 0.5, clearcoat: 0.8, clearcoatRoughness: 0.25, normalMap: gripNormal, normalScale: new THREE.Vector2(0.25,0.25), envMapIntensity: 1.0 });
const copperGlow = new THREE.MeshStandardMaterial({ color: 0xbc7a3a, emissive: 0xff7a30, emissiveIntensity: 1.3, roughness: 0.35, metalness: 0.9 });

// halo signature material + amber
const haloMat = new THREE.MeshStandardMaterial({ color: 0xbc9656, emissive: 0xff7a45, emissiveIntensity: 0.25, roughness: 0.3, metalness: 1.0, envMapIntensity: 1.4 });
const amberMat = new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: 0xff7a45, emissiveIntensity: 2.2, roughness: 0.4 });

// lathe helper — ONE continuous swept surface (kills the stacked-cylinder look)
function lathe(profile, mat, seg = 100) {
  const pts = profile.map(p => new THREE.Vector2(p[0], p[1]));
  const g = new THREE.LatheGeometry(pts, seg);
  const m = new THREE.Mesh(g, mat); m.rotation.x = Math.PI/2; return m; // +Y profile -> +Z axis
}
function engBand(texts, r, w, z, group, colHex) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 56; const x = c.getContext('2d');
  x.fillStyle = '#0b0b0b'; x.fillRect(0,0,1024,56); x.fillStyle = colHex||'#e8c884'; x.font='700 26px Instrument Sans, sans-serif'; x.textBaseline='middle';
  const step = 1024/texts.length; texts.forEach((t,i)=>x.fillText(t, i*step+14, 30));
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 100, 1, true), new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.3, roughness: 0.35, metalness: 0.6, color: 0x141414 }));
  m.rotation.x = Math.PI/2; m.position.z = z; group.add(m); return m;
}

const BX = -0.35;

// ══ BODY — continuous faceted slab with the DIAGONAL signature (ExtrudeGeometry) ══
const bShape = new THREE.Shape();
bShape.moveTo(-0.525, -0.5);
bShape.lineTo(0.525, -0.5);
bShape.lineTo(0.525, 0.34);
bShape.lineTo(0.12, 0.5);          // diagonal shoulder line
bShape.lineTo(-0.525, 0.28);
bShape.closePath();
const bodyGeo = new THREE.ExtrudeGeometry(bShape, { depth: 0.8, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 6 });
bodyGeo.center();
const body = new THREE.Mesh(bodyGeo, M.shell); body.position.set(BX, 0.1, -0.18); cam.add(reg(body));
// structural spine inlay (bronze, along the diagonal)
const diagonal = rbox(1.08, 0.05, 0.06, 0.02, M.bronze, [BX-0.02, 0.42, 0.24], [0,0,0.18]); cam.add(reg(diagonal));
// recessed rear-lower carbon inlay panel
const spine = rbox(0.9, 0.34, 0.05, 0.03, carbon, [BX+0.05, -0.28, 0.26]); cam.add(reg(spine));

// ══ FLOATING TOP PLATE (shadow-gap channel) ══
const topPlate = rbox(0.78, 0.07, 0.6, 0.04, M.shellDark, [BX+0.02, 0.6, -0.14]); cam.add(reg(topPlate, 1.6));
// two machined dials with knurled bronze edges
function dial(px, pz) {
  const g = new THREE.Group(); g.position.set(px, 0.66, pz);
  g.add(lathe([[0,0],[0.14,0],[0.15,0.02],[0.15,0.09],[0.12,0.12],[0,0.12]], M.shellDark, 40));
  for (let i=0;i<28;i++){ const a=i/28*Math.PI*2; const k=new THREE.Mesh(new THREE.BoxGeometry(0.01,0.09,0.02),M.bronze); k.position.set(Math.cos(a)*0.15,0.05,Math.sin(a)*0.15); k.rotation.y=-a; g.add(k); }
  const cap=new THREE.Mesh(new THREE.CircleGeometry(0.11,32),M.bronze); cap.rotation.x=-Math.PI/2; cap.position.y=0.121; g.add(cap);
  return g;
}
cam.add(reg(dial(BX+0.34, -0.24), 1.5));
cam.add(reg(dial(BX-0.16, -0.3), 1.5));
// OLED strip (recessed)
const oc = document.createElement('canvas'); oc.width=240; oc.height=90; const ox=oc.getContext('2d');
ox.fillStyle='#070a0c'; ox.fillRect(0,0,240,90); ox.fillStyle='#ff8a45'; ox.font='800 42px Instrument Sans, sans-serif'; ox.fillText('8K',14,46); ox.fillStyle='#e8c884'; ox.font='600 20px Instrument Sans, sans-serif'; ox.fillText('60p',96,42); ox.fillStyle='#8a8f95'; ox.font='600 16px Instrument Sans, sans-serif'; ox.fillText('T2.0 · ISO 800',14,74); ox.fillStyle='#ff7a45'; ox.fillRect(176,54,52,20); ox.fillStyle='#070a0c'; ox.fillRect(179,57,38,14);
const otex=new THREE.CanvasTexture(oc); otex.colorSpace=THREE.SRGBColorSpace;
const oled=new THREE.Mesh(new THREE.PlaneGeometry(0.34,0.13), new THREE.MeshStandardMaterial({map:otex,emissive:0xffffff,emissiveMap:otex,emissiveIntensity:0.85,roughness:0.2})); oled.position.set(BX+0.06,0.638,0.02); oled.rotation.x=-Math.PI/2; cam.add(reg(oled,1.4));
// record dot + hot-shoe inlay with gold pins + mic seam
const rec = cyl(0.045,0.045,0.04, amberMat, [BX-0.22,0.638,0.12],20,[Math.PI/2,0,0]); cam.add(reg(rec,1.3));
const shoe = rbox(0.22,0.03,0.26,0.01, M.shellDark, [BX+0.02,0.645,-0.16]); cam.add(reg(shoe,1.4));
for(let i=0;i<4;i++){ const pin=rbox(0.018,0.01,0.13,0.004,M.gold,[BX-0.05+i*0.035,0.662,-0.16]); cam.add(reg(pin,1.3)); }
for(let i=0;i<8;i++){ const h=cyl(0.008,0.008,0.02,M.shellDark,[BX-0.14+i*0.03,0.64,0.2],6); cam.add(reg(h,1.2)); }

// ══ SCULPTED GRIP (continuous lathe form) + monogram ══
const gripProf = [[0,-0.5],[0.16,-0.5],[0.22,-0.34],[0.2,-0.1],[0.24,0.16],[0.2,0.4],[0.12,0.5],[0,0.5]];
const grip = lathe(gripProf, gripRubber, 40); grip.rotation.x = 0; grip.rotation.z = Math.PI/2; grip.position.set(BX-0.62, 0.06, 0.14); grip.scale.set(1,1,1.2); cam.add(reg(grip));
const markTex = new THREE.TextureLoader().load('/assets/buyue-mark.png'); markTex.colorSpace = THREE.SRGBColorSpace;
const markPlate = rbox(0.2,0.26,0.03,0.03, M.shellDark, [BX-0.7,-0.02,0.16],[0,-0.15,0]); cam.add(reg(markPlate,1.4));
const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.14,0.18), new THREE.MeshStandardMaterial({ map: markTex, transparent:true, emissive:0xbc9656, emissiveMap:markTex, emissiveIntensity:0.5, roughness:0.4, metalness:0.6, color:0xbc9656 })); mark.position.set(BX-0.716,-0.02,0.17); mark.rotation.y=-0.15; cam.add(reg(mark,1.4));

// ══ MILLED COOLING FINS (architecture, not holes) ══
const finRecess = rbox(0.34, 0.62, 0.06, 0.03, M.shellDark, [BX+0.5, 0.06, -0.1]); cam.add(reg(finRecess,1.5));
for (let i=0;i<7;i++){ const fin = rbox(0.28, 0.04, 0.05, 0.01, M.bronze, [BX+0.52, 0.32 - i*0.085, -0.1]); cam.add(reg(fin,1.4)); }
const finGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.58), copperGlow); finGlow.position.set(BX+0.55,0.06,-0.1); finGlow.rotation.y=-Math.PI/2; cam.add(reg(finGlow,1.3));

// ══ MOUNT RING ══
const mount = lathe([[0.44,0.24],[0.54,0.24],[0.56,0.3],[0.52,0.34],[0.44,0.34]], M.chrome, 64); cam.add(reg(mount));
const mountPins = new THREE.Group();
for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; const p=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.02,0.02),M.gold); p.position.set(Math.cos(a)*0.5,0.1+Math.sin(a)*0.5,0.3); mountPins.add(p);} cam.add(reg(mountPins,1.5));

// ══ THE CREATIVE CORE — LATHE-SWEPT LENS (one continuous surface) ══
const lens = new THREE.Group(); lens.position.set(0, 0.1, 0.34);
const LR = 0.62;
const barrelProfile = [
  [0.50,0.00],[0.56,0.02],[0.58,0.10],[0.60,0.12],[0.60,0.32],[0.55,0.35],[0.51,0.39],
  [0.55,0.43],[0.585,0.46],[0.585,0.62],[0.52,0.65],[0.52,0.69],[0.56,0.72],[0.58,0.82],
  [0.60,0.88],[0.62,0.98],[0.615,1.06],[0.645,1.10],[0.62,1.14],[0.55,1.17],[0.46,1.19],[0.41,1.20]
];
const barrel = lathe(barrelProfile, M.shellDark, 120); lens.add(barrel);
// engraved barrel band (spec + scales)
engBand(['BUYUE','24-70mm','T2.0','CINE','∞','5','3','1.5','1','0.7','0.5','●'], LR*0.92, 0.16, 0.2, lens, '#bc9656');
// FLOATING focus ring (knurled, rotates) — sits in the 0.37 channel
const focusRing = new THREE.Group();
focusRing.add(lathe([[0.6,0.36],[0.63,0.38],[0.63,0.5],[0.6,0.52]], M.shell, 80));
for (let i=0;i<80;i++){ const a=i/80*Math.PI*2; const k=new THREE.Mesh(new THREE.BoxGeometry(0.016,0.13,0.05),M.bronze); k.position.set(Math.cos(a)*0.635, Math.sin(a)*0.635, 0.44); k.rotation.z=a; focusRing.add(k); }
lens.add(focusRing);
// FLOATING aperture ring (engraved, in the 0.67 channel)
engBand(['T2','2.8','4','5.6','8','11','16','22'], 0.6, 0.12, 0.68, lens, '#e8c884');
// receding OPTICAL GROUPS (6, parallax depth)
for (let i=0;i<6;i++){ const r = LR*(0.7 - i*0.09); const z = 0.44 + i*0.09; const el = lathe([[0,z],[r*0.7,z],[r,z+0.01]], (i%2?M.chrome:M.shellDark), 48); lens.add(el); const t=new THREE.Mesh(new THREE.TorusGeometry(r,0.008,10,48),M.bronze); t.position.z=z+0.012; lens.add(t); }
// dark inner cavity so we see INTO the lens
const cavityWall = new THREE.Mesh(new THREE.CylinderGeometry(LR*0.66, LR*0.42, 0.55, 64, 1, true), new THREE.MeshStandardMaterial({ color:0x04050a, roughness:0.6, metalness:0.4, side:THREE.DoubleSide })); cavityWall.rotation.x=Math.PI/2; cavityWall.position.z=0.68; lens.add(cavityWall);
// mechanical IRIS (11 blades)
const iris = new THREE.Group(); iris.position.z = 0.9; const irisBlades = [];
const bladeMat = new THREE.MeshStandardMaterial({ color:0x100d09, roughness:0.45, metalness:0.8, envMapIntensity:1.1, side:THREE.DoubleSide });
for (let i=0;i<11;i++){ const a=i/11*Math.PI*2; const bl=new THREE.Mesh(new THREE.CircleGeometry(LR*0.6,3,a,Math.PI*0.85),bladeMat); const pv=new THREE.Group(); pv.rotation.z=a; pv.add(bl); bl.position.set(LR*0.48,0,0); iris.add(pv); irisBlades.push({pv,base:a}); }
lens.add(iris); window.__iris = irisBlades;
// deep GLASS + coat + core spark
const gGeo = new THREE.SphereGeometry(0.9, 56, 36, 0, Math.PI*2, 0, Math.PI*0.4);
const glass = new THREE.Mesh(gGeo, M.glass); glass.rotation.x=-Math.PI/2; glass.position.z=1.02; glass.scale.set(LR*0.62,LR*0.62,0.5); lens.add(glass);
const coat = new THREE.Mesh(gGeo, M.coat); coat.rotation.x=-Math.PI/2; coat.position.z=1.03; coat.scale.set(LR*0.64,LR*0.64,0.5); lens.add(coat);
// crisp dark front-element rim ring — sharp contrast stroke framing the glass
const rimRing = new THREE.Mesh(new THREE.TorusGeometry(LR*0.63, 0.045, 20, 96), new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.32, metalness: 0.85, envMapIntensity: 1.4 }));
rimRing.position.z = 1.12; lens.add(rimRing);
// thin inner bright lip catches the key light for definition
const rimLip = new THREE.Mesh(new THREE.TorusGeometry(LR*0.6, 0.012, 14, 96), M.gold);
rimLip.position.z = 1.14; lens.add(rimLip);
const core = sph(0.12, M.core, [0,0,0]); core.position.z=0.86; lens.add(core);
const coreHalo = new THREE.Mesh(new THREE.TorusGeometry(0.15,0.03,12,40), amberMat); coreHalo.position.z=0.84; lens.add(coreHalo);
// floating BEZEL (detached front ring)
const bezel = lathe([[0.58,1.18],[0.66,1.2],[0.66,1.28],[0.6,1.3]], M.bronze, 80); lens.add(bezel);
// ══ THE BRONZE HALO — signature (ignites on key moments) ══
const halo = new THREE.Mesh(new THREE.TorusGeometry(LR*1.08, 0.022, 18, 90), haloMat); halo.position.z = 1.16; lens.add(halo); window.__halo = haloMat;
const coreLight = new THREE.PointLight(0xff7a45, 0, 5, 2); coreLight.position.set(0, 0.1, 1.4); cam.add(coreLight);
// Layer E — dedicated soft pulse light inside the lens (illuminates nearby panels on the swell)
const pulseLight = new THREE.PointLight(0xffb877, 0, 6.5, 2); pulseLight.position.set(0, 0, 1.3); lens.add(pulseLight);
cam.add(reg(lens, 2.4));

// ══════════ LAYER B — THE CREATIVE PORTAL (subtle light emerging from the lens) ══════════
// Attached to the lens so it originates exactly at the glass. Very low density, all outward, no particles.
const portal = new THREE.Group(); portal.position.set(0, 0, 1.16); lens.add(portal);
// warm dimensional depth-glow seen through the front element (breathes softly)
const portalGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,196,138,1)'), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
portalGlow.scale.set(1.15, 1.15, 1); portalGlow.position.set(0, 0, -0.22); portal.add(portalGlow);
// a second, tighter inner glow for optical depth
const portalCore = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,232,196,1)'), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
portalCore.scale.set(0.5, 0.5, 1); portalCore.position.set(0, 0, -0.16); portal.add(portalCore);
// soft tapered light-ribbon texture (no hard dots — a luminous stroke)
function ribbonTex(){ const c = document.createElement('canvas'); c.width = 24; c.height = 256; const g = c.getContext('2d');
  const grd = g.createLinearGradient(0,0,0,256); grd.addColorStop(0,'rgba(255,255,255,0)'); grd.addColorStop(0.5,'rgba(255,255,255,1)'); grd.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0,0,24,256);
  const hz = g.createLinearGradient(0,0,24,0); hz.addColorStop(0,'rgba(0,0,0,0)'); hz.addColorStop(0.5,'rgba(0,0,0,1)'); hz.addColorStop(1,'rgba(0,0,0,0)');
  g.globalCompositeOperation = 'destination-in'; g.fillStyle = hz; g.fillRect(0,0,24,256);
  const t = new THREE.CanvasTexture(c); return t; }
const ribTexShared = ribbonTex();
const ribCols = [0xffce93, 0xffb27a, 0xe6c8ff, 0xffe1be, 0xffc59a];
const ribbons = [];
for (let i=0;i<5;i++){
  const m = new THREE.MeshBasicMaterial({ map: ribTexShared, color: ribCols[i], transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 1.5), m); portal.add(mesh);
  ribbons.push({ mesh, ang: (i/5)*Math.PI*2, phase: i/5, speed: 0.045 + i*0.006 });
}
window.__portalB = { portalGlow, portalCore, ribbons };

// ══ EVF (rear top-left) ══
const evf = rbox(0.34,0.26,0.32,0.05, M.shellDark, [BX-0.2,0.66,-0.5]); cam.add(reg(evf,1.6));
const eyecup = lathe([[0,0],[0.14,0],[0.16,0.04],[0.13,0.14],[0.09,0.16]], gripRubber, 32); eyecup.position.set(BX-0.2,0.68,-0.66); cam.add(reg(eyecup,1.5));

// ══ REAR ARTICULATING SCREEN (live UI) ══
const scc = document.createElement('canvas'); scc.width = 384; scc.height = 240; const sxx = scc.getContext('2d');
sxx.fillStyle='#06080a'; sxx.fillRect(0,0,384,240); sxx.fillStyle='#0d1116'; sxx.fillRect(0,0,384,30);
sxx.fillStyle='#ff5a3a'; sxx.beginPath(); sxx.arc(18,15,6,0,7); sxx.fill();
sxx.fillStyle='#eef1f4'; sxx.font='700 14px Instrument Sans, sans-serif'; sxx.fillText('REC 8K',30,20);
sxx.fillStyle='#8fa0ad'; sxx.font='600 12px Instrument Sans, sans-serif'; sxx.fillText('T2.0  1/50  ISO800',170,20);
const gg=sxx.createLinearGradient(0,40,0,190); gg.addColorStop(0,'#2a3a55'); gg.addColorStop(0.6,'#b5844f'); gg.addColorStop(1,'#3a2818'); sxx.fillStyle=gg; sxx.fillRect(20,40,344,150);
sxx.fillStyle='#3a2416'; sxx.beginPath(); sxx.moveTo(20,190); sxx.quadraticCurveTo(150,120,364,170); sxx.lineTo(364,190); sxx.fill();
sxx.strokeStyle='#e8c884'; sxx.lineWidth=2; sxx.strokeRect(150,95,84,60);
sxx.fillStyle='#0d1116'; sxx.fillRect(0,200,384,40);
sxx.fillStyle='#ff8a45'; for(let i=0;i<44;i++){ const hh=Math.abs(Math.sin(i*0.4)*Math.cos(i*0.13))*24+2; sxx.fillRect(8+i*8,236-hh,5,hh); }
sxx.fillStyle='#eef1f4'; sxx.font='600 12px Instrument Sans, sans-serif'; sxx.fillText('00:12:47:03',12,218);
const scrTex=new THREE.CanvasTexture(scc); scrTex.colorSpace=THREE.SRGBColorSpace;
const scrFrame = rbox(1.0,0.72,0.05,0.05, M.shellDark, [BX+0.02,0.08,-0.6]); cam.add(reg(scrFrame,1.6));
const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.6), new THREE.MeshStandardMaterial({ map:scrTex, emissive:0xffffff, emissiveMap:scrTex, emissiveIntensity:0.75, roughness:0.18, metalness:0.1 })); scr.position.set(BX+0.02,0.08,-0.626); scr.rotation.y=Math.PI; cam.add(scr);

// ══ I/O + battery + tripod + micro ══
const flap = rbox(0.05,0.4,0.28,0.03, gripRubber, [BX-0.55,-0.02,-0.16]); cam.add(reg(flap,1.4));
for(let i=0;i<4;i++){ const port=rbox(0.02,0.05,0.1,0.01,M.shellDark,[BX-0.58,0.14-i*0.11,-0.16]); cam.add(reg(port,1.3)); const pin=rbox(0.008,0.022,0.06,0.004,M.chrome,[BX-0.6,0.14-i*0.11,-0.16]); cam.add(reg(pin,1.3)); }
for(let i=0;i<3;i++){ const led=sph(0.012, amberMat, [BX+0.3,0.48,-0.48+i*0.06]); cam.add(reg(led,1.3)); }
const plate = lathe([[0,-0.5],[0.17,-0.5],[0.19,-0.46],[0.17,-0.44],[0,-0.44]], M.chrome, 24); plate.position.set(BX,0,-0.12); cam.add(reg(plate,1.5));
for (const sp of [[BX-0.42,0.4,0.28],[BX-0.42,-0.26,0.28],[BX+0.34,0.4,0.28],[BX+0.34,-0.26,0.28]]) { const sc=cyl(0.02,0.02,0.03,M.chrome,sp,6,[Math.PI/2,0,0]); cam.add(reg(sc,1.4)); }
// micro serial label
const slc=document.createElement('canvas'); slc.width=256; slc.height=40; const slx=slc.getContext('2d'); slx.fillStyle='#0b0b0b'; slx.fillRect(0,0,256,40); slx.fillStyle='#8a7a5a'; slx.font='600 20px Manrope'; slx.fillText('BUYUE  BX-001  ·  8K',10,26);
const sltex=new THREE.CanvasTexture(slc); sltex.colorSpace=THREE.SRGBColorSpace;
const serial=new THREE.Mesh(new THREE.PlaneGeometry(0.28,0.044), new THREE.MeshStandardMaterial({map:sltex,roughness:0.6,metalness:0.4,emissive:0x1a140a,emissiveMap:sltex,emissiveIntensity:0.3})); serial.position.set(BX+0.1,-0.44,0.27); cam.add(reg(serial,1.3));

scene.add(cam);

// ---------- glow / bloom sprites ----------
function glowTex(col) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64,64,0,64,64,64); g.addColorStop(0, col); g.addColorStop(0.4, col.replace('1)','0.5)')); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0,0,128,128); return new THREE.CanvasTexture(c);
}
const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,160,100,1)'), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
coreGlow.scale.set(1.6, 1.6, 1); coreGlow.position.set(0, 1.15, 1.35); scene.add(coreGlow);
// rotating volumetric god-rays behind the Core
function rayTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.translate(256,256);
  for (let i=0;i<48;i++){ x.rotate(Math.PI*2/48); const g = x.createLinearGradient(0,0,0,256); g.addColorStop(0,'rgba(255,150,90,0.5)'); g.addColorStop(1,'rgba(255,150,90,0)'); x.fillStyle=g; const w=(i%2?5:12); x.beginPath(); x.moveTo(-w,0); x.lineTo(w,0); x.lineTo(2,256); x.lineTo(-2,256); x.fill(); }
  return new THREE.CanvasTexture(c);
}
const rays = new THREE.Sprite(new THREE.SpriteMaterial({ map: rayTex(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
rays.scale.set(6, 6, 1); rays.position.set(0, 1.15, 0.2); scene.add(rays);

function flareTex() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 24; const x = c.getContext('2d');
  const g = x.createLinearGradient(0,0,256,0);
  g.addColorStop(0,'rgba(150,200,240,0)'); g.addColorStop(0.35,'rgba(170,210,245,0.6)'); g.addColorStop(0.5,'rgba(255,255,255,0.95)'); g.addColorStop(0.65,'rgba(255,190,140,0.6)'); g.addColorStop(1,'rgba(234,196,107,0)');
  x.fillStyle = g; x.fillRect(0,0,256,24); return new THREE.CanvasTexture(c);
}
const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
flare.scale.set(4.2, 0.4, 1); flare.position.set(0, 1.15, 1.4); scene.add(flare);

const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.2, 40, 1, true), new THREE.MeshBasicMaterial({ color: 0xffb070, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
cone.rotation.x = -Math.PI / 2; cone.position.set(0, 1.1, 2.6); scene.add(cone);

// ---------- particle fields ----------
function points(n, spread, size, col, opacity) {
  const g = new THREE.BufferGeometry(); const pos = new Float32Array(n*3);
  for (let i = 0; i < n; i++) { pos[i*3]=(Math.random()-0.5)*spread; pos[i*3+1]=(Math.random()-0.5)*spread*0.6; pos[i*3+2]=(Math.random()-0.5)*spread; }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ size, color: col, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, map: glowTex('rgba(255,255,255,1)'), sizeAttenuation: true });
  return new THREE.Points(g, m);
}
const stars = points(340, 42, 0.06, 0xcdd8e4, 0); stars.visible = false;
const embers2 = points(150, 16, 0.05, 0xf0b070, 0); embers2.visible = false;
const emberV = []; for (let i = 0; i < 150; i++) emberV.push({ sx:(Math.random()-0.5)*0.0018, sy: Math.random()*0.0038+0.001, sz:(Math.random()-0.5)*0.0018 });

const fogSprites = [];
for (let i = 0; i < 5; i++) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(130,100,80,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0.10, depthWrite: false }));
  s.scale.set(9+Math.random()*6, 6+Math.random()*4, 1); s.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*3, -3-Math.random()*4);
  scene.add(s); fogSprites.push({ s, ph: Math.random()*6 });
}

// birth streams
// ══ STUDIO SET: softbox rigs, boom light, reflector — first-scene decor ══
const studio = new THREE.Group(); /* Layer 2 — NOT added to scene (architecture-only pass) */
function scyl(r1,r2,h,m,p,rot){ const g=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,18),m); g.position.set(...p); if(rot)g.rotation.set(...rot); return g; }
const softboxGlowMat = new THREE.MeshStandardMaterial({ color: 0xfff4e2, emissive: 0xffe3bd, emissiveIntensity: 1.7, roughness: 0.9 });
function makeRig(x, ry){
  const rig = new THREE.Group();
  // tripod stand
  for (let i=0;i<3;i++){ const a=i*Math.PI*2/3; const leg=scyl(0.022,0.022,1.5,M.shellDark,[Math.sin(a)*0.42,-2.02,Math.cos(a)*0.42],[Math.sin(a)*0.42*0.55,0,-Math.cos(a)*0.42*0.55]); leg.rotation.z=Math.sin(a)*0.28; leg.rotation.x=-Math.cos(a)*0.28; rig.add(leg); }
  rig.add(scyl(0.03,0.03,2.5,M.shellDark,[0,-1.15,0]));
  rig.add(scyl(0.05,0.05,0.14,M.bronze,[0,-0.42,0]));
  // softbox head (angled toward centre)
  const head = new THREE.Group();
  const box = rbox(1.05,1.35,0.16,0.06,M.shellDark,[0,0,0]); head.add(box);
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.88,1.18), softboxGlowMat); panel.position.z=0.09; head.add(panel);
  head.position.set(0,0.15,0); head.rotation.y=ry; head.rotation.x=-0.12;
  rig.add(head);
  rig.position.set(x,1.0,-3.6);
  studio.add(rig);
  return { rig, panel };
}
const rigL = null, rigR = null;
// (small rigs replaced by the pro boom + roller rigs below)
// overhead boom light
const boom = new THREE.Group();
boom.add(scyl(0.028,0.028,3.4,M.shellDark,[1.7,0,0],[0,0,Math.PI/2]));
const boomHead = new THREE.Group();
boomHead.add(scyl(0.3,0.42,0.5,M.shellDark,[0,0,0],[Math.PI*0.62,0,0]));
const boomDisc = new THREE.Mesh(new THREE.CircleGeometry(0.26,24), softboxGlowMat); boomDisc.position.set(0,-0.18,0.16); boomDisc.rotation.x=-Math.PI*0.38; boomHead.add(boomDisc);
boomHead.position.set(0,0,0); boom.add(boomHead);
boom.position.set(-14.5,5.2,-3.2); studio.add(boom);
// reflector disc on a low stand (right of camera)
const refl = new THREE.Group();
refl.add(scyl(0.02,0.02,1.3,M.shellDark,[0,-0.85,0]));
const discM = new THREE.MeshStandardMaterial({ color: 0xe8dcc2, roughness: 0.35, metalness: 0.75, envMapIntensity: 1.2, side: THREE.DoubleSide });
const disc = new THREE.Mesh(new THREE.CircleGeometry(0.55,28), discM); disc.rotation.y=-0.8; disc.position.y=0.15; refl.add(disc);
disc.add(new THREE.Mesh(new THREE.RingGeometry(0.53,0.57,28), M.bronze));
refl.position.set(3.3,0.35,-2.8); refl.rotation.y=0.25; studio.add(refl);
// apple boxes near the left rig (set-dressing)
studio.add(rbox(0.62,0.3,0.42,0.03,M.bronze,[-11.2,-1.86,-2.4],[0,0.4,0]));
studio.add(rbox(0.5,0.26,0.36,0.03,M.shellDark,[-11.05,-1.58,-2.35],[0,0.18,0]));
// soft warm fill from the rigs
const rigLightL = new THREE.PointLight(0xffe0b8, 20, 14, 1.8); rigLightL.position.set(-10.2,1.3,-2.8); studio.add(rigLightL);
const rigLightR = new THREE.PointLight(0xffe0b8, 20, 14, 1.8); rigLightR.position.set(-0.8,1.3,-2.8); studio.add(rigLightR);
// ── added set-dressing: marks, cables, dolly, backdrop roll, c-stand, ladder, fan, clapper ──
const tapeMat = new THREE.MeshBasicMaterial({ color: 0xd8b26a, transparent: true });
function tapeX(x,z,s){ const g=new THREE.Group(); [0.7,-0.7].forEach(r=>{ const m=new THREE.Mesh(new THREE.PlaneGeometry(s,0.055), tapeMat); m.rotation.x=-Math.PI/2; m.rotation.z=r; g.add(m); }); g.position.set(x,-1.99,z); studio.add(g); }
tapeX(-8.2,-1.6,0.34); tapeX(-4.2,-2.0,0.3); tapeX(1.4,-2.6,0.3);
// floor cables snaking from the rig bases
function cable(pts,r){ const c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))); const m=new THREE.Mesh(new THREE.TubeGeometry(c,24,r,6), M.shellDark); studio.add(m); return m; }
cable([[-11.6,-1.98,-2.6],[-9.8,-1.99,-2.2],[-8.4,-1.98,-2.9],[-6.8,-1.99,-2.4]],0.028);
cable([[-1.6,-1.98,-2.8],[-0.4,-1.99,-2.3],[0.9,-1.98,-2.9]],0.028);
// dolly slider rails (front floor, off the text zone)
const dolly = new THREE.Group();
[-0.09,0.09].forEach(o=>dolly.add(scyl(0.022,0.022,2.2,M.chrome,[o,0,0],[0,0,Math.PI/2])));
dolly.add(rbox(0.3,0.08,0.26,0.02,M.shellDark,[0.3,0.07,0],[0,0,0]));
dolly.position.set(-3.6,-1.97,-0.6); dolly.rotation.y=0.5; studio.add(dolly);
// paper backdrop roll (deep background, high)
const roll = new THREE.Group();
roll.add(scyl(0.16,0.16,7.4,new THREE.MeshStandardMaterial({ color: 0xe9e0cd, roughness: 0.8 }),[0,0,0],[0,0,Math.PI/2]));
roll.add(scyl(0.05,0.05,7.8,M.shellDark,[0,0,0],[0,0,Math.PI/2]));
roll.position.set(-5.4,5.6,-5.6); studio.add(roll);
// spare C-stand with empty arm (far back-left)
const cst = new THREE.Group();
cst.add(scyl(0.026,0.026,2.6,M.shellDark,[0,-0.7,0]));
cst.add(scyl(0.02,0.02,1.1,M.bronze,[0.5,0.62,0],[0,0,Math.PI/2]));
for(let i=0;i<3;i++){ const a=i*Math.PI*2/3; cst.add(scyl(0.018,0.018,0.8,M.shellDark,[Math.sin(a)*0.25,-1.95,Math.cos(a)*0.25],[Math.sin(a)*0.5,0,-Math.cos(a)*0.5])); }
cst.position.set(-11.6,0,-4.4); studio.add(cst);
// short studio ladder (back-right)
const ladder = new THREE.Group();
[-0.3,0.3].forEach(o=>ladder.add(scyl(0.03,0.03,2.0,M.bronze,[o,0,0],[0.16,0,0])));
for(let i=0;i<4;i++) ladder.add(scyl(0.022,0.022,0.6,M.shellDark,[0,-0.75+i*0.5,(-0.75+i*0.5)*0.16],[0,0,Math.PI/2]));
ladder.position.set(-0.2,-1.0,-4.6); ladder.rotation.y=-0.35; studio.add(ladder);
// small studio fan on a stand (left), blades spin slowly
const fan = new THREE.Group();
fan.add(scyl(0.02,0.02,1.2,M.shellDark,[0,-0.75,0]));
const fanHead = new THREE.Group();
fanHead.add(new THREE.Mesh(new THREE.TorusGeometry(0.3,0.03,8,24), M.bronze));
const fanBlades = new THREE.Group();
for(let i=0;i<4;i++){ const b=new THREE.Mesh(new THREE.PlaneGeometry(0.09,0.24), M.chrome); b.position.set(Math.sin(i*Math.PI/2)*0.16, Math.cos(i*Math.PI/2)*0.16, 0); b.rotation.z=-i*Math.PI/2; b.rotation.y=0.5; fanBlades.add(b); }
fanHead.add(fanBlades); fanHead.position.y=0; fan.add(fanHead);
fan.position.set(-8.9,-0.6,-3.1); fan.rotation.y=0.5; studio.add(fan);
// clapperboard leaning on the apple boxes
const clap = new THREE.Group();
clap.add(rbox(0.5,0.34,0.03,0.015,M.shellDark,[0,0,0]));
const clapTop = rbox(0.5,0.09,0.03,0.012,M.bronze,[-0.03,0.235,0],[0,0,0.22]); clap.add(clapTop);
clap.position.set(-10.6,-1.72,-2.2); clap.rotation.set(-0.28,0.5,0.06); studio.add(clap);
// dust motes floating in the boom-light beam
// (dust motes removed — decor is fully static)
// ── PRO RIGS (reference-style): boom stand + roller stand ──
function caster(g,x,z){ g.add(sph(0.06,M.chrome,[x,-0.02,z])); }
function sandbag(g,p,rot){ const b=rbox(0.34,0.2,0.14,0.05,M.shellDark,p,rot); g.add(b); return b; }
function softboxHead(w,h){ const head=new THREE.Group(); head.add(rbox(w,h,0.18,0.06,M.shellDark,[0,0,0])); const panel=new THREE.Mesh(new THREE.PlaneGeometry(w*0.82,h*0.85), softboxGlowMat); panel.position.z=0.1; head.add(panel); return head; }
// LEFT: boom-arm stand with counterweight (like the reference)
const boomRig = new THREE.Group();
caster(boomRig,0.5,0); caster(boomRig,-0.25,0.43); caster(boomRig,-0.25,-0.43);
for(let i=0;i<3;i++){ const a=i*Math.PI*2/3; const leg=scyl(0.026,0.026,1.1,M.chrome,[Math.sin(a+0.52)*0.28,0.42,Math.cos(a+0.52)*0.28]); leg.rotation.z=Math.sin(a+0.52)*0.5; leg.rotation.x=-Math.cos(a+0.52)*0.5; boomRig.add(leg); }
boomRig.add(scyl(0.038,0.038,3.3,M.chrome,[0,1.75,0]));
boomRig.add(scyl(0.06,0.06,0.16,M.bronze,[0,3.35,0]));
sandbag(boomRig,[0.3,0.28,0.18],[0,0.4,0]); sandbag(boomRig,[-0.32,0.26,0.05],[0,-0.3,0]);
const boomArm = new THREE.Group();
boomArm.add(scyl(0.028,0.028,3.1,M.chrome,[0.9,0,0],[0,0,Math.PI/2]));
const cwBag = sandbag(boomArm,[-0.62,-0.28,0],[0,0,0.1]);
boomArm.add(scyl(0.012,0.012,0.24,M.shellDark,[-0.62,-0.1,0]));
const bigBox = softboxHead(1.5,1.9); bigBox.position.set(2.45,0.1,0.25); bigBox.rotation.set(-0.42,0.5,0.08); boomArm.add(bigBox);
boomArm.position.set(0,3.42,0); boomArm.rotation.z=0.42;
boomRig.add(boomArm);
boomRig.position.set(-14.6,-2.0,-3.8); boomRig.rotation.y=0.35; studio.add(boomRig);
// RIGHT: roller-stand softbox (like the reference right unit)
const rollerRig = new THREE.Group();
for(let i=0;i<3;i++){ const a=i*Math.PI*2/3+0.3; const sp=scyl(0.024,0.024,0.62,M.shellDark,[Math.sin(a)*0.28,0.06,Math.cos(a)*0.28],[0,0,0]); sp.rotation.z=Math.sin(a)*1.35; sp.rotation.x=-Math.cos(a)*1.35; rollerRig.add(sp); caster(rollerRig,Math.sin(a)*0.52,Math.cos(a)*0.52); }
rollerRig.add(rbox(0.16,0.1,0.12,0.03,M.bronze,[0,0.16,0]));
rollerRig.add(scyl(0.032,0.032,3.0,M.chrome,[0,1.6,0]));
const rollBox = softboxHead(1.25,1.55); rollBox.position.set(-0.4,3.15,0.15); rollBox.rotation.set(-0.3,-0.55,-0.06); rollerRig.add(rollBox);
rollerRig.position.set(2.2,-2.0,-3.9); studio.add(rollerRig);
// ── ceiling rig: dark band + pipes + fluorescent tubes ──
const ceil = new THREE.Group();
ceil.add(rbox(20,1.1,2.4,0.05,new THREE.MeshStandardMaterial({ color: 0x1b1916, roughness: 0.9 }),[0,0.55,0]));
ceil.add(scyl(0.045,0.045,19,M.bronze,[0,-0.12,0.5],[0,0,Math.PI/2]));
ceil.add(scyl(0.045,0.045,19,M.shellDark,[0,-0.05,-0.5],[0,0,Math.PI/2]));
const tubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e4, emissiveIntensity: 2.2, roughness: 0.5 });
const tube1 = scyl(0.05,0.05,2.6,tubeMat,[-3.2,-0.5,0.2],[0,0,Math.PI/2]);
const tube2 = scyl(0.05,0.05,2.6,tubeMat,[3.4,-0.62,0.1],[0,0,Math.PI/2]);
[[-3.2,0.2],[3.4,0.1]].forEach(([tx,tz])=>{ ceil.add(scyl(0.014,0.014,0.5,M.shellDark,[tx-0.9,-0.28,tz])); ceil.add(scyl(0.014,0.014,0.5,M.shellDark,[tx+0.9,-0.28,tz])); });
ceil.add(tube1); ceil.add(tube2);
ceil.position.set(-6,7.4,-6.2); studio.add(ceil);
// ── pro lighting: warm key spot (left boom) + soft fill (right roller) ──
const keySpot = new THREE.SpotLight(0xffdcae, 70, 34, 0.6, 0.6, 1.1);
keySpot.position.set(-11.6,2.6,-3.0); studio.add(keySpot);
keySpot.target.position.set(0,1.1,1.4); studio.add(keySpot.target);
const fillSpot = new THREE.SpotLight(0xfff0dc, 34, 26, 0.6, 0.65, 1.3);
fillSpot.position.set(4.6,1.6,-3.4); studio.add(fillSpot);
fillSpot.target.position.set(0,1.1,1.4); studio.add(fillSpot.target);
// golden bounce light — warm indirect fill from the floor (reference grade)
const goldBounce = new THREE.PointLight(0xffd9a8, 0, 18, 2.0); goldBounce.position.set(0,-1.4,2.4); studio.add(goldBounce);
// ── STAGED REVEAL registry: each decor group arrives with slide/rise + tiny settle ──
const reveals = [];
function stageIn(obj, s, dur, off){ obj.userData.base = obj.position.clone(); reveals.push({ obj, s, dur, off: new THREE.Vector3(...off) }); obj.visible = false; }
function easeOutBackS(p){ const c = 1.20158; return 1 + (c+1)*Math.pow(p-1,3) + c*Math.pow(p-1,2); }
// ── luxury additions: podium, ring light, plants, floor spot, LED strips, bg title ──
const marbleMat = new THREE.MeshPhysicalMaterial({ color: 0xf2ede4, roughness: 0.22, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.25, envMapIntensity: 1.1 });
const ledMat = new THREE.MeshStandardMaterial({ color: 0xe8c884, emissive: 0xe8a24a, emissiveIntensity: 0, roughness: 0.4, transparent: true, opacity: 0 }); ledMat.userData.noFade = 1;
const podium = new THREE.Group();
podium.add(scyl(0.95,1.08,1.9,marbleMat,[0,0.95,0]));
podium.add(scyl(1.02,1.02,0.1,M.bronze,[0,0.05,0]));
const ledRing = new THREE.Mesh(new THREE.TorusGeometry(0.98,0.022,10,64), ledMat); ledRing.rotation.x = Math.PI/2; ledRing.position.y = 1.86; podium.add(ledRing);
// plaque
const plaqueCv = document.createElement('canvas'); plaqueCv.width=512; plaqueCv.height=256;
{ const px=plaqueCv.getContext('2d'); px.fillStyle='#141210'; px.fillRect(0,0,512,256); px.strokeStyle='#bc9656'; px.lineWidth=6; px.strokeRect(14,14,484,228); px.fillStyle='#e8c884'; px.font='700 52px Instrument Sans, sans-serif'; px.textAlign='center'; px.fillText('BUYUE COMPANY',256,118); px.fillStyle='#a89272'; px.font='500 30px Instrument Sans, sans-serif'; px.fillText('VISUAL STORYTELLING',256,178); }
const plaqueTex = new THREE.CanvasTexture(plaqueCv);
const plaqueMat = new THREE.MeshBasicMaterial({ map: plaqueTex, transparent: true, opacity: 0 }); plaqueMat.userData.noFade = 1;
const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.85,0.42), plaqueMat); plaque.position.set(0,1.35,1.04); plaque.rotation.x=-0.05; podium.add(plaque);
podium.position.set(0,-2.05,0.6); studio.add(podium);
// ring light (right side)
const ringGlowMat = new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffd9a0, emissiveIntensity: 0, roughness: 0.5, transparent: true, opacity: 0 }); ringGlowMat.userData.noFade = 1;
const ringLight = new THREE.Group();
for(let i=0;i<3;i++){ const a=i*Math.PI*2/3; const lg=scyl(0.02,0.02,0.9,M.shellDark,[Math.sin(a)*0.3,0.34,Math.cos(a)*0.3]); lg.rotation.z=Math.sin(a)*0.75; lg.rotation.x=-Math.cos(a)*0.75; ringLight.add(lg); }
ringLight.add(scyl(0.026,0.026,2.2,M.shellDark,[0,1.5,0]));
const ringTorus = new THREE.Mesh(new THREE.TorusGeometry(0.58,0.045,12,48), ringGlowMat); ringTorus.position.y=2.85; ringLight.add(ringTorus);
ringLight.add(new THREE.Mesh(new THREE.TorusGeometry(0.66,0.02,8,48), M.shellDark)).children; ringLight.children[ringLight.children.length-1].position.y=2.85;
ringLight.position.set(3.1,-2.0,-3.0); studio.add(ringLight);
// plants (stylized: dark pot + leaf fans)
const leafMat = new THREE.MeshStandardMaterial({ color: 0x3d5233, roughness: 0.85 });
const potMat = new THREE.MeshStandardMaterial({ color: 0x191714, roughness: 0.6, metalness: 0.3 });
function makePlant(scale){ const g=new THREE.Group(); g.add(scyl(0.26,0.2,0.42,potMat,[0,0.21,0])); g.add(scyl(0.24,0.24,0.04,M.bronze,[0,0.44,0]));
  for(let i=0;i<7;i++){ const a=i*Math.PI*2/7 + (i%2)*0.3; const leaf=new THREE.Mesh(new THREE.SphereGeometry(0.09,8,10), leafMat); leaf.scale.set(0.5,4.2+(i%3),0.5); leaf.position.set(Math.sin(a)*0.16,0.75+(i%3)*0.1,Math.cos(a)*0.16); leaf.rotation.z=Math.sin(a)*0.35; leaf.rotation.x=-Math.cos(a)*0.35; g.add(leaf); }
  g.scale.setScalar(scale); return g; }
const plantL = makePlant(1.25); plantL.position.set(-13.6,-2.0,-2.4); studio.add(plantL);
const plantR = makePlant(1.05); plantR.position.set(4.0,-2.0,-2.6); studio.add(plantR);
// floor spotlight (corner, warm)
const floorGlowMat = new THREE.MeshStandardMaterial({ color: 0xffe2b0, emissive: 0xffc070, emissiveIntensity: 0, roughness: 0.5, transparent: true, opacity: 0 }); floorGlowMat.userData.noFade = 1;
const floorSpot = new THREE.Group();
floorSpot.add(scyl(0.16,0.22,0.34,M.shellDark,[0,0.17,0],[0.5,0,0.2]));
const floorDisc = new THREE.Mesh(new THREE.CircleGeometry(0.13,20), floorGlowMat); floorDisc.position.set(0.09,0.31,0.1); floorDisc.rotation.set(-0.9,0.25,0); floorSpot.add(floorDisc);
floorSpot.add(rbox(0.3,0.06,0.2,0.02,M.bronze,[0,0.03,0]));
floorSpot.position.set(-9.4,-2.0,-1.6); floorSpot.rotation.y=0.5; studio.add(floorSpot);
// hidden LED wall strips (vertical, far edges)
// (wall LED strips omitted — they read as stray lines at this view angle)
// background title (fade + lift only)
function textPlane(txt, sub, w, h, fs, fs2){ const c=document.createElement('canvas'); c.width=1024; c.height=512; const px=c.getContext('2d');
  px.fillStyle='#1b1916'; px.font='400 '+Math.round(fs*1.15)+'px Instrument Serif, serif'; px.textAlign='center'; px.fillText(txt,512,230);
  px.strokeStyle='#bc9656'; px.lineWidth=5; px.beginPath(); px.moveTo(340,290); px.lineTo(684,290); px.stroke();
  if(sub){ px.fillStyle='#6b5d49'; px.font='600 '+fs2+'px Instrument Sans, sans-serif'; px.letterSpacing='14px'; px.fillText(sub,512,370); }
  const tex=new THREE.CanvasTexture(c); const m=new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0 }); m.userData.noFade=1;
  return new THREE.Mesh(new THREE.PlaneGeometry(w,h), m); }
const bgTitle = textPlane('BUYUE COMPANY','BRANDING · CONTENT · DESIGN', 4.4, 2.2, 96, 40);
bgTitle.position.set(-5.05,3.55,-5.2); studio.add(bgTitle);
const bgSub = textPlane('WE TURN IDEAS INTO EXPERIENCES','', 3.1, 1.55, 44, 30);
bgSub.position.set(-5.05,2.32,-5.2); studio.add(bgSub);
// ── staged entrance schedule (weight + inertia, small overshoot) ──
stageIn(ceil, 4.4, 1.1, [0,3,0]);
stageIn(boomRig, 5.0, 1.2, [-4,0,0]);
stageIn(rollerRig, 5.6, 1.1, [2.5,0,0]);
stageIn(cst, 6.0, 0.9, [-2,0,0]);
stageIn(refl, 6.2, 0.9, [1.5,0,0]);
stageIn(ringLight, 6.4, 1.0, [0,-2.6,0]);
stageIn(ladder, 6.7, 0.9, [0,0,-2]);
stageIn(floorSpot, 7.0, 0.9, [-1.5,0,0]);
stageIn(fan, 7.2, 0.9, [-1.2,0,0]);
stageIn(plantL, 7.4, 0.9, [0,-1.1,0]);
stageIn(plantR, 7.6, 0.9, [0,-1.1,0]);
stageIn(dolly, 7.8, 0.9, [0,0,1.5]);
stageIn(clap, 8.0, 0.8, [0,-0.6,0]);
stageIn(podium, 8.2, 1.2, [0,-2.5,0]);
stageIn(bgTitle, 9.2, 1.2, [0,-0.45,0]);
stageIn(bgSub, 9.8, 1.1, [0,-0.4,0]);
// ── Layer 1: pure architecture (walls, ceiling, floor — no fixtures) ──
const arch = new THREE.Group(); scene.add(arch);
const wallMat = new THREE.MeshStandardMaterial({ color: 0xf4ecdc, roughness: 0.92, metalness: 0.0, transparent: true, opacity: 0 });
const ceilMat = new THREE.MeshStandardMaterial({ color: 0xf7f0e2, roughness: 0.95, metalness: 0.0, transparent: true, opacity: 0 });
const floorMat = new THREE.MeshStandardMaterial({ color: 0xece4d3, roughness: 0.55, metalness: 0.08, transparent: true, opacity: 0 });
// back wall — the visual anchor, tall + wide (centered on the branding panel axis, cx)
const cx = -4.4;
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(46, 22), wallMat); backWall.position.set(cx, 2, -8.5); arch.add(backWall);
// subtle vertical panel grooves on the back wall (very faint)
for (let i=-5;i<=5;i++){ const groove = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 20), new THREE.MeshBasicMaterial({ color: 0xd8cfbc, transparent: true, opacity: 0 })); groove.material.userData.grooveFade = 1; groove.position.set(cx + i*3.4, 2, -8.48); arch.add(groove); }
// side walls — symmetric, shallow (~32°) so they only add depth, never compete with the center wall
const wallL = new THREE.Mesh(new THREE.PlaneGeometry(24, 22), wallMat.clone()); wallL.position.set(cx-13.6, 2, -5.4); wallL.rotation.y = Math.PI*0.18; arch.add(wallL);
const wallR = new THREE.Mesh(new THREE.PlaneGeometry(24, 22), wallMat.clone()); wallR.position.set(cx+13.6, 2, -5.4); wallR.rotation.y = -Math.PI*0.18; arch.add(wallR);
// large rounded-corner archway between back and side walls (torus quarter, warm)
function cornerArc(x,z,ry){ const t=new THREE.Mesh(new THREE.TorusGeometry(4.0,0.4,10,20,Math.PI*0.5), wallMat.clone()); t.rotation.set(0, ry, 0); t.position.set(x,2,z); arch.add(t); return t; }
cornerArc(cx-9.9, -8.2, 0);
cornerArc(cx+9.9, -8.2, -Math.PI*0.5);
// ceiling — large flat plane with a shallow recessed inner panel (centered on cx)
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(34, 22), ceilMat); ceiling.rotation.x = Math.PI/2; ceiling.position.set(cx, 8, -3); arch.add(ceiling);
const ceilInner = new THREE.Mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ color: 0xfaf3e5, roughness: 0.95, transparent: true, opacity: 0 })); ceilInner.rotation.x = Math.PI/2; ceilInner.position.set(cx, 7.94, -3); arch.add(ceilInner);
// floor — premium microcement, subtle sheen (centered on cx)
const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 24), floorMat); floor.rotation.x = -Math.PI/2; floor.position.set(cx, -2.02, -1.5); arch.add(floor);

// ══════════════ LAYER 2 — PROFESSIONAL STUDIO LIGHTING SYSTEM ══════════════
// Only lighting infrastructure. No props. Fixtures live at the top/left/right edges only.
const L2 = new THREE.Group(); scene.add(L2);
const L2lights = [];           // {light, base} — intensity scales with fade k
const L2emis = [];             // {mat, base} — emissive diffusers scale with k
const L2mats = [];             // opaque fixture materials fade with k
function L2mat(cfg){ const m = new THREE.MeshStandardMaterial(Object.assign({ transparent:true, opacity:0 }, cfg)); L2mats.push(m); return m; }
function L2diffuser(w,h,color,emissive,base){ const m = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: base, roughness: 0.95, transparent: true, opacity: 0 }); L2emis.push({ mat: m, base }); const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h), m); return mesh; }
const blackShell = L2mat({ color: 0x14120f, roughness: 0.82, metalness: 0.25, envMapIntensity: 0.55 });
// colour temperatures → warm-neutral hexes
const C_KEY = 0xfff0e0, C_FILL = 0xfff3e8, C_BACK = 0xffe9d4, C_ACCENT = 0xffcf94, C_LED = 0xfff2df;

// ── MAIN CEILING SOFTBOX — suspended, centred high above the Hero, deep in Z ──
const mainBox = new THREE.Group();
mainBox.add(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.5, 3.2), blackShell));            // matte black exterior
const mainDiff = L2diffuser(4.8, 2.8, 0xfff6ec, 0xffe9cf, 1.15); mainDiff.rotation.x = Math.PI/2; mainDiff.position.y = -0.26; mainBox.add(mainDiff);
mainBox.add(new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,2.4,8), blackShell)).position.set(-1.8,1.2,0); // drop wires
mainBox.add(new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,2.4,8), blackShell)).position.set(1.8,1.2,0);
mainBox.position.set(-2, 6.7, -4.4); L2.add(mainBox); mainBox.visible = false;   // fixture hidden (hanging blob + drop wire removed); light kept
const mainSoft = new THREE.SpotLight(0xfff4ea, 0, 26, 0.85, 0.9, 1.2); mainSoft.position.set(-2, 6.5, -4.0); mainSoft.target.position.set(0, 1.1, 1.2); L2.add(mainSoft, mainSoft.target); L2lights.push({ light: mainSoft, base: 46 });

// ── LINEAR LED BAR — long warm ceiling tube, parallel, subtle ──
const l2LedMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: C_LED, emissiveIntensity: 0, roughness: 0.5, transparent: true, opacity: 0 }); L2emis.push({ mat: l2LedMat, base: 1.6 });
const ledBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 9.5, 12), l2LedMat); ledBar.rotation.z = Math.PI/2; ledBar.position.set(-2, 7.2, -1.4); L2.add(ledBar);
L2.add(new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.14, 0.22), blackShell)).position.set(-2, 7.32, -1.4); // housing above the tube
const ledGlow = new THREE.PointLight(C_LED, 0, 12, 2.2); ledGlow.position.set(-2, 6.9, -1.2); L2.add(ledGlow); L2lights.push({ light: ledGlow, base: 9 });

// ── LEFT KEY LIGHT — large soft key at far-left edge, partially in frame ──
const keyRig = new THREE.Group();
keyRig.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.2, 0.4), blackShell));
const keyDiff = L2diffuser(2.3, 2.9, 0xfff4e6, 0xffdcb4, 1.0); keyDiff.position.z = 0.22; keyRig.add(keyDiff);
keyRig.position.set(-11.6, 1.6, -2.2); keyRig.rotation.y = 0.6; L2.add(keyRig);
const keyLight = new THREE.SpotLight(C_KEY, 0, 30, 0.7, 0.75, 1.15); keyLight.position.set(-10.8, 2.0, -1.6); keyLight.target.position.set(0, 1.1, 1.3); L2.add(keyLight, keyLight.target); L2lights.push({ light: keyLight, base: 52 });

// ── RIGHT FILL LIGHT — large soft fill at far-right edge, lower intensity ──
const fillRig = new THREE.Group();
fillRig.add(new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.0, 0.4), blackShell));
const fillDiff = L2diffuser(2.1, 2.7, 0xfff6ee, 0xffe6cc, 0.85); fillDiff.position.z = 0.22; fillRig.add(fillDiff);
fillRig.position.set(9.6, 1.5, -2.2); fillRig.rotation.y = -0.6; L2.add(fillRig);
const fillLight = new THREE.SpotLight(C_FILL, 0, 28, 0.75, 0.8, 1.25); fillLight.position.set(8.8, 1.8, -1.6); fillLight.target.position.set(0, 1.1, 1.3); L2.add(fillLight, fillLight.target); L2lights.push({ light: fillLight, base: 26 });

// ── BACK LIGHT — invisible rim, hidden behind the side walls, for separation ──
const backL = new THREE.PointLight(C_BACK, 0, 16, 2.0); backL.position.set(-6.5, 2.2, -6.0); L2.add(backL); L2lights.push({ light: backL, base: 22 });
const backR = new THREE.PointLight(C_BACK, 0, 16, 2.0); backR.position.set(2.5, 2.2, -6.0); L2.add(backR); L2lights.push({ light: backR, base: 22 });

// ── PRACTICAL ACCENTS — tiny warm sources tucked in the architecture (fixtures unseen) ──
[[-13.2, 4.2, -5.2], [8.8, 4.0, -5.2], [-2, -1.4, -5.6]].forEach(p => {
  const a = new THREE.PointLight(C_ACCENT, 0, 9, 2.4); a.position.set(...p); L2.add(a); L2lights.push({ light: a, base: 7 });
});
// ══════════════ LAYER 2.5 — ARCHITECTURAL DEPTH & SPATIAL COMPOSITION ══════════════
// Structure only. No props. Richness lives at the edges + background; center is protected.
const A25 = new THREE.Group(); scene.add(A25);
const A25meshes = [];            // opaque surfaces fade with kA
const A25coves = [];             // {light, base} hidden indirect coves
function A25mesh(geo, mat, pos, rot){ const m = new THREE.Mesh(geo, mat); m.position.set(...pos); if (rot) m.rotation.set(...rot); A25meshes.push(m); A25.add(m); return m; }
// monochrome material breakup — same ivory family, different finish
const mPlaster = () => new THREE.MeshStandardMaterial({ color: 0xf1e8d7, roughness: 0.94, metalness: 0, envMapIntensity: 0.35, transparent: true, opacity: 0 });
const mSatin   = () => new THREE.MeshStandardMaterial({ color: 0xf6efe1, roughness: 0.5, metalness: 0.05, envMapIntensity: 0.6, transparent: true, opacity: 0 });
const mStone   = () => new THREE.MeshStandardMaterial({ color: 0xe9e0cf, roughness: 0.78, metalness: 0, envMapIntensity: 0.4, transparent: true, opacity: 0 });
const mDeep    = () => new THREE.MeshStandardMaterial({ color: 0xdcd3c0, roughness: 1.0, metalness: 0, envMapIntensity: 0.2, transparent: true, opacity: 0 }); // shadow-gap backing (softened)

// ── LAYER A — far background architecture (pushed deep for spatial scale) ──
A25mesh(new THREE.PlaneGeometry(60, 30), mPlaster(), [-4.4, 3, -13.5]);                          // deep backdrop (centered on panel axis)
A25mesh(new THREE.BoxGeometry(15, 22, 0.6), mSatin(), [-16.0, 2, -11.5], [0, 0.42, 0]);         // far left mass (symmetric about cx)
A25mesh(new THREE.BoxGeometry(15, 22, 0.6), mSatin(), [7.2, 2, -11.5], [0, -0.42, 0]);          // far right mass (symmetric about cx)

// ── LAYER B — background wall: large geometric panels, shallow relief + shadow reveals ──
// deep backing so the gaps between panels read as soft shadow lines
A25mesh(new THREE.PlaneGeometry(30, 20), mDeep(), [-4.4, 2, -8.62]);
const bwPanels = [[-11.8, 3.6, 12.6], [-4.4, 4.2, 13.4], [3.0, 3.6, 12.6], [-8.4, -1.4, 9.2], [-0.4, -1.6, 9.2]];
bwPanels.forEach((p, i) => {
  const pan = A25mesh(new THREE.BoxGeometry(p[2]*0.42, p[1], 0.5), (i % 2 ? mStone() : mPlaster()), [p[0], 2.1, -8.2]);  // relief forward of backing → gap shadow
  pan.geometry.parameters && (pan.userData.chamfer = 1);
});
// horizontal reveal line across the wall (thin deep recess)
A25mesh(new THREE.BoxGeometry(28, 0.16, 0.4), mDeep(), [-2, 0.1, -8.35]);

// ── LAYER B — side walls: layered offset sections (no longer flat) ──
[[-18.4, 0.5, 1], [10.4, -0.5, -1]].forEach(([x, ry, dir]) => {
  A25mesh(new THREE.BoxGeometry(10, 16, 0.5), mSatin(), [x, 3.4, -3.2], [0, ry, 0]);            // upper offset slab
  A25mesh(new THREE.BoxGeometry(9, 7, 0.5), mStone(), [x + dir*0.5, -0.6, -1.2], [0, ry, 0]);   // lower offset slab, stepped forward
  A25mesh(new THREE.BoxGeometry(0.4, 15, 0.9), mDeep(), [x - dir*1.2, 2, -2.6], [0, ry, 0]);    // vertical shadow gap
});

// ── CEILING DEPTH — floating planes, recessed pockets, hidden coves ──
A25mesh(new THREE.BoxGeometry(20, 0.6, 10), mSatin(), [-2, 8.1, -3]);                            // raised outer frame
A25mesh(new THREE.BoxGeometry(13, 0.4, 6), mPlaster(), [-2, 7.4, -2.4]);                         // lower floating inner plane
A25mesh(new THREE.BoxGeometry(6, 0.3, 3.4), mStone(), [-2, 6.9, -1.6]);                          // deepest recessed pocket
// hidden coves — soft indirect only, fixtures never visible
[[-9, 7.2, -2], [5, 7.2, -2], [-2, 7.0, -5.4]].forEach(p => {
  const c = new THREE.PointLight(0xffe9d2, 0, 11, 2.4); c.position.set(...p); A25.add(c); A25coves.push({ light: c, base: 6 });
});

// ── CURVED TRANSITIONS — soft radius pieces at wall/ceiling meets (Apple-store quality) ──
function A25arc(r, x, y, z, rot){ const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.5, 12, 24, Math.PI*0.5), mPlaster()); t.position.set(x, y, z); t.rotation.set(...rot); A25meshes.push(t); A25.add(t); return t; }
A25arc(3.4, -12, 7.2, -6, [0, 0, 0]);           // top-left cove curve
A25arc(3.4, 8, 7.2, -6, [0, -Math.PI/2, 0]);    // top-right cove curve
A25arc(2.6, -12, -1.8, -6, [Math.PI, 0, 0]);    // bottom-left curve
A25arc(2.6, 8, -1.8, -6, [Math.PI, -Math.PI/2, 0]);

// ══════════════ LAYER 3 — SUBTLE PRODUCTION REALISM ══════════════
// Real-studio equipment at the far edges only. Middle 60% (Hero safe zone) stays empty.
const L3 = new THREE.Group(); scene.add(L3);
const L3meshes = [];
function L3M(cfg){ const m = new THREE.MeshStandardMaterial(Object.assign({ transparent: true, opacity: 0 }, cfg)); return m; }
const mGraphite = L3M({ color: 0x2b2b2e, roughness: 0.5, metalness: 0.72, envMapIntensity: 0.85 });
const mBlack    = L3M({ color: 0x161618, roughness: 0.62, metalness: 0.4, envMapIntensity: 0.5 });
const mAlu      = L3M({ color: 0x9a9a9e, roughness: 0.34, metalness: 0.9, envMapIntensity: 1.15 });
const mChamp    = L3M({ color: 0xcaa96a, roughness: 0.4, metalness: 0.85, envMapIntensity: 1.05 });
const mRubber   = L3M({ color: 0x1b1b1c, roughness: 0.94, metalness: 0.05, envMapIntensity: 0.3 });
const mFabric   = L3M({ color: 0x242426, roughness: 1.0, metalness: 0, envMapIntensity: 0.25 });
const mGreen    = L3M({ color: 0x5c6b52, roughness: 0.82, metalness: 0, envMapIntensity: 0.35 });
const mPot      = L3M({ color: 0x3a352f, roughness: 0.68, metalness: 0.15, envMapIntensity: 0.5 });
const mWood     = L3M({ color: 0x6b5238, roughness: 0.7, metalness: 0.05, envMapIntensity: 0.4 });
const mScreen   = L3M({ color: 0x0d0e10, roughness: 0.25, metalness: 0.3, envMapIntensity: 0.6 });
function L3add(geo, mat, pos, rot, parent){ const m = new THREE.Mesh(geo, mat); m.position.set(...pos); if (rot) m.rotation.set(...rot); L3meshes.push(m); (parent || L3).add(m); return m; }
function L3cyl(r1, r2, h, mat, pos, rot, parent){ return L3add(new THREE.CylinderGeometry(r1, r2, h, 14), mat, pos, rot, parent); }

// ── LEFT PRODUCTION ZONE (far left edge) ──
const zL = new THREE.Group(); zL.position.set(-19.5, -2.0, -1.4); zL.rotation.y = 0.4; L3.add(zL);
// C-stand: wheeled base legs + riser + grip head + extension arm
for (let i = 0; i < 3; i++){ const a = i*Math.PI*2/3 + 0.4; L3cyl(0.03, 0.03, 1.5, mBlack, [Math.sin(a)*0.5, 0.34, Math.cos(a)*0.5], [Math.cos(a)*0.9, 0, -Math.sin(a)*0.9], zL); }
L3cyl(0.045, 0.045, 3.4, mAlu, [0, 1.7, 0], null, zL);                         // riser
L3add(new THREE.BoxGeometry(0.12, 0.16, 0.12), mGraphite, [0, 3.3, 0], null, zL);   // grip head knuckle
L3cyl(0.03, 0.03, 1.3, mAlu, [0.6, 3.4, 0], [0, 0, Math.PI/2], zL);            // extension arm
// folded 5-in-1 reflector (thin disc leaning on the stand)
L3add(new THREE.CircleGeometry(0.85, 28), mFabric, [0.7, 1.2, 0.2], [0, 0.3, 0.35], zL);
L3add(new THREE.TorusGeometry(0.85, 0.03, 8, 28), mGraphite, [0.7, 1.2, 0.2], [0, 0.3, 0.35], zL);
// sandbag over the base
L3add(new THREE.BoxGeometry(0.5, 0.22, 0.24), mFabric, [0.2, 0.14, 0.3], [0, 0.3, 0.05], zL);
// folded flag frame leaning behind
L3add(new THREE.BoxGeometry(0.7, 1.0, 0.04), mBlack, [-0.7, 0.9, -0.2], [0, 0.4, 0.18], zL);
L3add(new THREE.TorusGeometry(0.06, 0.02, 6, 10), mGraphite, [-0.7, 1.4, -0.2], [0, 0.4, 0.18], zL); // grip clamp

// ── RIGHT PRODUCTION ZONE (far right edge) ──
const zR = new THREE.Group(); zR.position.set(10.4, -2.0, -1.6); zR.rotation.y = -0.4; L3.add(zR);
// ring light — OFF, dark plastic, no glow
L3cyl(0.03, 0.03, 2.9, mBlack, [0, 1.45, 0], null, zR);
L3cyl(0.05, 0.05, 0.5, mGraphite, [0, 0.25, 0], null, zR);
for (let i = 0; i < 3; i++){ const a = i*Math.PI*2/3; L3cyl(0.025, 0.025, 0.6, mBlack, [Math.sin(a)*0.28, 0.06, Math.cos(a)*0.28], [Math.cos(a)*1.2, 0, -Math.sin(a)*1.2], zR); }
L3add(new THREE.TorusGeometry(0.6, 0.09, 12, 40), mGraphite, [0, 3.0, 0.05], [0.2, 0, 0], zR);   // the ring (matte, dark)
L3add(new THREE.CircleGeometry(0.5, 32), mBlack, [0, 3.0, 0.02], [0.2, 0, 0], zR);               // dead diffuser
// boom arm on its own stand
L3cyl(0.035, 0.035, 3.2, mAlu, [-1.2, 1.6, -0.3], null, zR);
L3cyl(0.028, 0.028, 2.4, mBlack, [-0.2, 3.2, -0.3], [0, 0, Math.PI/2.4], zR);
L3add(new THREE.BoxGeometry(0.3, 0.24, 0.16), mFabric, [-2.05, 2.55, -0.3], null, zR);           // counterweight bag
// equipment case (flight case) on the floor
const caseM = L3add(new THREE.BoxGeometry(1.2, 0.7, 0.8), mBlack, [0.9, 0.35, 0.6], [0, -0.2, 0], zR);
for (const sx of [-0.55, 0.55]) for (const sz of [-0.35, 0.35]) L3add(new THREE.BoxGeometry(0.1, 0.72, 0.1), mChamp, [0.9 + sx*Math.cos(0.2), 0.35, 0.6 + sz], null, zR); // corner protectors
L3add(new THREE.BoxGeometry(0.22, 0.12, 0.06), mChamp, [0.9, 0.5, 1.02], null, zR);              // latch plate
// folded softbox bag leaning
L3add(new THREE.BoxGeometry(0.34, 1.5, 0.16), mFabric, [1.9, 0.75, 0.1], [0, -0.3, 0.14], zR);

// ── CEILING STRUCTURE — rails, tracks, suspension points (subtle, integrated) ──
L3add(new THREE.BoxGeometry(16, 0.1, 0.14), mGraphite, [-2, 7.6, -0.4], null);                   // rig rail
L3add(new THREE.BoxGeometry(0.14, 0.1, 8), mGraphite, [-8, 7.62, -3], null);                     // cross track
L3add(new THREE.BoxGeometry(0.14, 0.1, 8), mGraphite, [4, 7.62, -3], null);
[-8, -2, 4].forEach(x => { L3cyl(0.02, 0.02, 0.5, mAlu, [x, 7.35, -0.4], null); L3add(new THREE.BoxGeometry(0.12, 0.06, 0.12), mBlack, [x, 7.08, -0.4], null); }); // suspension drops + saddles

// ── CABLE MANAGEMENT — removed (no black wires) ──
// cable runs + hooks removed per request

// ── PRODUCTION ACCESSORIES — tiny believable details at the edges ──
L3add(new THREE.BoxGeometry(0.4, 0.28, 0.3), mGraphite, [-12.0, -1.72, -0.2], [0, 0.4, 0]);      // lens case (left)
L3add(new THREE.BoxGeometry(0.24, 0.34, 0.05), mBlack, [-18.2, 0.4, -3], [0, 0.5, 0]);           // wall power/controller (left wall)
L3add(new THREE.BoxGeometry(0.24, 0.34, 0.05), mBlack, [10.1, 0.4, -3], [0, -0.5, 0]);           // wall controller (right wall)
L3add(new THREE.BoxGeometry(0.16, 0.1, 0.12), mChamp, [11.6, -1.78, 0.4], null);                 // quick-release plate (right)

// ── ONE PLANT — large, muted, far corner only ──
const plant = new THREE.Group(); plant.position.set(-16.4, -2.0, -4.2); L3.add(plant);
L3cyl(0.42, 0.34, 0.9, mPot, [0, 0.45, 0], null, plant);
L3add(new THREE.SphereGeometry(0.15, 8, 8), mPot, [0, 0.9, 0], null, plant);                     // soil mound
for (let i = 0; i < 9; i++){ const a = i/9*Math.PI*2; const bl = L3add(new THREE.BoxGeometry(0.06, 1.3 + Math.random()*0.5, 0.24), mGreen, [Math.sin(a)*0.2, 1.6, Math.cos(a)*0.2], [Math.sin(a)*0.4, a, Math.cos(a)*0.4], plant); }

// ── CAMERA EMPHASIS — soft rim to separate the Hero from the background (art-direction pass) ──
const camRim = new THREE.SpotLight(0xffe9d0, 30, 12, 0.5, 0.85, 1.3); camRim.position.set(1.9, 3.4, -1.9); camRim.target.position.set(0, 1.2, 1.2); scene.add(camRim, camRim.target);
const camRim2 = new THREE.SpotLight(0xfff2e2, 18, 12, 0.55, 0.9, 1.3); camRim2.position.set(-2.0, 2.8, -1.6); camRim2.target.position.set(0, 1.15, 1.2); scene.add(camRim2, camRim2.target);
// soft top light — premium product-reveal key from directly above the camera
const camTop = new THREE.SpotLight(0xfff4e8, 26, 10, 0.6, 0.95, 1.2); camTop.position.set(-0.2, 4.4, 0.6); camTop.target.position.set(-0.2, 0.1, 0.4); scene.add(camTop, camTop.target);

// ══ LAYER C — balance pieces: right production cluster + left cinema spot + wood accent ══
const zC = new THREE.Group(); zC.position.set(13.2, -2.0, -2.6); zC.rotation.y = -0.5; L3.add(zC);
L3cyl(0.05, 0.05, 0.4, mGraphite, [0, 0.22, 0], null, zC);
L3cyl(0.07, 0.07, 3.4, mBlack, [0, 2.0, 0], null, zC);
L3add(new THREE.BoxGeometry(0.16, 3.0, 0.05), mScreen, [0.08, 2.0, 0], null, zC);
const mon = new THREE.Group(); mon.position.set(-1.7, 0, 0.4); zC.add(mon);
L3add(new THREE.CylinderGeometry(0.28, 0.34, 0.05, 20), mBlack, [0, 0.03, 0], null, mon);
L3cyl(0.035, 0.035, 1.7, mAlu, [0, 0.9, 0], null, mon);
L3add(new THREE.BoxGeometry(1.15, 0.66, 0.05), mScreen, [0, 1.7, 0.06], null, mon);
L3add(new THREE.BoxGeometry(1.2, 0.72, 0.06), mBlack, [0, 1.7, 0.02], null, mon);
const cart = new THREE.Group(); cart.position.set(-0.4, 0, 1.4); cart.rotation.y = 0.3; zC.add(cart);
L3add(new THREE.BoxGeometry(1.3, 0.06, 0.8), mGraphite, [0, 0.9, 0], null, cart);
L3add(new THREE.BoxGeometry(1.3, 0.06, 0.8), mGraphite, [0, 0.45, 0], null, cart);
for (const sx of [-0.58, 0.58]) for (const sz of [-0.32, 0.32]) L3cyl(0.03, 0.03, 0.9, mBlack, [sx, 0.45, sz], null, cart);
for (const sx of [-0.58, 0.58]) for (const sz of [-0.32, 0.32]) L3add(new THREE.SphereGeometry(0.07, 8, 8), mRubber, [sx, 0.04, sz], null, cart);
const trip = new THREE.Group(); trip.position.set(1.4, 0, 0.8); zC.add(trip);
for (let i=0;i<3;i++){ const a=i*Math.PI*2/3+0.4; L3cyl(0.03, 0.02, 2.2, mAlu, [Math.sin(a)*0.45, 1.05, Math.cos(a)*0.45], [Math.cos(a)*0.38, 0, -Math.sin(a)*0.38], trip); }
L3add(new THREE.CylinderGeometry(0.09, 0.09, 0.2, 16), mGraphite, [0, 2.1, 0], null, trip);
L3add(new THREE.BoxGeometry(0.12, 0.16, 0.3), mBlack, [0, 2.28, 0.02], [-0.15,0,0], trip);
const fspot = new THREE.Group(); fspot.position.set(-15.4, -2.0, -3.2); fspot.rotation.y = 0.5; L3.add(fspot);
for (let i=0;i<3;i++){ const a=i*Math.PI*2/3; L3cyl(0.02,0.02,0.5,mBlack,[Math.sin(a)*0.22,0.06,Math.cos(a)*0.22],[Math.cos(a)*1.3,0,-Math.sin(a)*1.3],fspot); }
L3cyl(0.03,0.03,0.7,mBlack,[0,0.4,0],null,fspot);
L3add(new THREE.CylinderGeometry(0.26,0.3,0.5,20), mGraphite, [0,0.95,0.1],[0.5,0,0],fspot);
L3add(new THREE.CircleGeometry(0.24,24), mScreen, [0,1.12,0.32],[0.5,0,0],fspot);
for (let i=0;i<4;i++){ const a=i*Math.PI/2; L3add(new THREE.BoxGeometry(0.34,0.34,0.02), mBlack, [Math.sin(a)*0.28,0.95+Math.cos(a)*0.28,0.34],[0.5,0,a],fspot); }
const bench = new THREE.Group(); bench.position.set(-17.2, -2.0, -4.6); bench.rotation.y = 0.5; L3.add(bench);
L3add(new THREE.BoxGeometry(2.6, 0.12, 0.6), mWood, [0, 0.7, 0], null, bench);
for (const sx of [-1.1, 1.1]) L3add(new THREE.BoxGeometry(0.1, 0.7, 0.5), mWood, [sx, 0.35, 0], null, bench);

// ══════════ LAYER D — THE CREATIVE ECOSYSTEM (curated far-depth creative artifacts) ══════════
const ECO = new THREE.Group(); scene.add(ECO);
const ecoItems = [];
const ecoFrameMat = () => new THREE.MeshStandardMaterial({ color: 0x9a9a9e, roughness: 0.4, metalness: 0.85, envMapIntensity: 1.0, transparent: true, opacity: 0 });
function artboard(wpx, hpx, ww, hh, pos, ry, draw){
  const c = document.createElement('canvas'); c.width = wpx; c.height = hpx; const x = c.getContext('2d'); draw(x, wpx, hpx);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const mat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.22, roughness: 0.5, metalness: 0.1, transparent: true, opacity: 0 });
  const grp = new THREE.Group(); grp.position.set(...pos); grp.rotation.y = ry;
  const fr = new THREE.Mesh(new THREE.PlaneGeometry(ww+0.05, hh+0.05), ecoFrameMat()); fr.position.z = -0.012; grp.add(fr);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(ww, hh), mat); grp.add(face);
  ECO.add(grp); ecoItems.push({ grp, mats: [mat, fr.material], base: pos.slice(), by: pos[1], phase: Math.random()*6.28, bob: 0.1 + Math.random()*0.08, spin: (Math.random()-0.5)*0.12, sp: 0.3 + Math.random()*0.3 });
  return grp;
}
function rr(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a+r,b); x.arcTo(a+w,b,a+w,b+h,r); x.arcTo(a+w,b+h,a,b+h,r); x.arcTo(a,b+h,a,b,r); x.arcTo(a,b,a+w,b,r); x.fill(); }
// A — COLOR SYSTEM (ivory board, accent swatches)
artboard(360, 460, 1.5, 1.92, [-6.6, 3.0, -6.2], 0.42, (x,w,h)=>{ x.fillStyle='#f3ecdd'; x.fillRect(0,0,w,h); const cols=['#ff7a45','#e8c884','#3fb8a6','#8a6cff','#26242a']; cols.forEach((c,i)=>{ x.fillStyle=c; rr(x,40,50+i*74,w-80,58,10); }); x.fillStyle='#26242a'; x.font='700 26px Instrument Sans, sans-serif'; x.fillText('COLOR SYSTEM',40,h-40); });
// B — TYPE STUDY (graphite board, big letterform)
artboard(360, 440, 1.5, 1.83, [6.3, 2.4, -6.8], -0.42, (x,w,h)=>{ x.fillStyle='#1b1a1e'; x.fillRect(0,0,w,h); x.fillStyle='#f3ecdd'; x.font='800 220px Instrument Sans, sans-serif'; x.fillText('Aa',44,230); x.fillStyle='#8a8f95'; x.font='600 22px Instrument Sans, sans-serif'; ['Manrope · Display','Regular / Medium / Bold','ABCDEFGHIJK','abcdefghijk 0123'].forEach((t,i)=>x.fillText(t,44,300+i*34)); x.fillStyle='#ff8a45'; x.font='700 24px Instrument Sans, sans-serif'; x.fillText('TYPOGRAPHY',44,h-32); });
// C — CAMPAIGN MOODBOARD (tonal grid + one accent)
artboard(420, 420, 1.75, 1.75, [-5.0, 0.3, -7.6], 0.32, (x,w,h)=>{ x.fillStyle='#eae2d2'; x.fillRect(0,0,w,h); const g=[['#cfc6b4','#bcb3a0'],['#ff6f61','#a8a090'],['#9a9284','#d8cfbc']]; for(let r=0;r<3;r++)for(let c=0;c<2;c++){ x.fillStyle=g[r][c]; rr(x,30+c*196,30+r*118,176,100,10);} x.fillStyle='#26242a'; x.font='700 24px Instrument Sans, sans-serif'; x.fillText('CAMPAIGN CONCEPT',30,h-22); });
// D — STRATEGY / ANALYTICS (dark board, minimal chart)
artboard(440, 380, 1.83, 1.58, [5.4, 0.0, -7.2], -0.36, (x,w,h)=>{ x.fillStyle='#141317'; x.fillRect(0,0,w,h); x.strokeStyle='#3a3740'; x.lineWidth=1; for(let i=1;i<4;i++){x.beginPath();x.moveTo(40,60+i*70);x.lineTo(w-40,60+i*70);x.stroke();} x.fillStyle='#4a86ff'; [90,150,120,200,170,240].forEach((v,i)=>rr(x,55+i*62,h-70-v,34,v,5)); x.strokeStyle='#3fb8a6'; x.lineWidth=3; x.beginPath(); [90,150,120,200,170,240].forEach((v,i)=>{const px=72+i*62,py=h-80-v; i?x.lineTo(px,py):x.moveTo(px,py);}); x.stroke(); x.fillStyle='#e6e2da'; x.font='700 22px Instrument Sans, sans-serif'; x.fillText('STRATEGY · ANALYTICS',40,44); });
window.__ecoItems = ecoItems;

// ══════════ CENTER BRANDING WALL — luxury showroom sign, aligned to the lens's screen axis ══════════
const brandWall = new THREE.Group(); brandWall.position.set(-4.4, 0, 0); arch.add(brandWall);
// ── luxury layered installation: dark-bronze box · champagne-titanium frame · optical crystal · milk glass ──
const brandMeshes = [];
const bAdd = (m, opa) => { if (opa != null) m.material.userData.opa = opa; brandMeshes.push(m); brandWall.add(m); return m; };
// ── floating luxury glass branding panel (Apple / B&O / Dior showroom) — no wall, no brown ──
const matTube    = new THREE.MeshBasicMaterial({ color: 0xfff1da, transparent: true, opacity: 0, toneMapped: false });                                                        // warm LED perimeter (self-lit)
const matCham    = new THREE.MeshStandardMaterial({ color: 0xd8c7a2, roughness: 0.22, metalness: 1.0, envMapIntensity: 1.4, transparent: true, opacity: 0 });                   // thin champagne-titanium border
const matCrystal = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, ior: 1.5, reflectivity: 0.6, transmission: 0.3, thickness: 0.5, envMapIntensity: 1.4, transparent: true, opacity: 0, depthWrite: false }); // optical crystal gloss (behind text)
const matEdge    = new THREE.MeshStandardMaterial({ color: 0xfff4e0, emissive: 0xffcf8f, emissiveIntensity: 1.4, roughness: 0.18, metalness: 0.2, transparent: true, opacity: 0 });  // polished lit glass edge
// soft floating drop shadow (panel hovers 3-5 cm off the background)
const brandShadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(30,22,14,1)'), transparent: true, opacity: 0, depthWrite: false })); brandShadow.scale.set(6.6, 5.0, 1); brandShadow.position.set(0, 2.42, -3.9); brandWall.add(brandShadow);
const brandTube = bAdd(rbox(5.62, 3.94, 0.16, 0.34, matTube, [0, 2.5, -3.64]), 1);        // bright warm LED rounded-rect rim
const brandCrystalEdge = bAdd(rbox(5.5, 3.82, 0.2, 0.32, matEdge, [0, 2.5, -3.6]), 1);    // polished lit glass edge just inside the rim
const brandCham = bAdd(rbox(5.44, 3.76, 0.14, 0.31, matCham, [0, 2.5, -3.58]), 1);        // thin champagne titanium border line
const brandCrystal = bAdd(rbox(5.34, 3.66, 0.26, 0.3, matCrystal, [0, 2.5, -3.55]), 0.28); // optical crystal slab (depth/gloss, behind the face)
// hidden warm top LED wash (3200K) above the panel + soft logo halo
const brandTopLed = new THREE.Mesh(roundedBoxGeo(3.2, 0.05, 0.05, 0.02), new THREE.MeshBasicMaterial({ color: 0xffe6c2, transparent: true, opacity: 0, toneMapped: false })); brandTopLed.position.set(0, 4.42, -3.5); brandWall.add(brandTopLed);
const brandGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,250,242,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false })); brandGlow.scale.set(2.8, 2.2, 1); brandGlow.position.set(0, 3.05, -3.52); brandWall.add(brandGlow);
const brandHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,220,160,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false })); brandHalo.scale.set(8.2, 6.6, 1); brandHalo.position.set(0, 2.5, -4.4); brandWall.add(brandHalo);
// moving highlight streak sweeping across the glass
const brandStreak = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,255,255,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false })); brandStreak.scale.set(0.6, 3.6, 1); brandStreak.position.set(0, 2.5, -3.46); brandWall.add(brandStreak);
const brandKey = new THREE.SpotLight(0xfff2df, 0, 10, 0.62, 0.7, 1.2); brandKey.position.set(0, 4.6, -2.6); brandKey.target.position.set(0, 2.7, -3.6); brandWall.add(brandKey, brandKey.target);
const brandAccent = new THREE.SpotLight(0xffcf8a, 0, 9, 0.7, 0.85, 1.4); brandAccent.position.set(-1.8, 1.4, -2.4); brandAccent.target.position.set(0, 2.5, -3.6); brandWall.add(brandAccent, brandAccent.target);
window.__brandLights = { brandKey, brandAccent };
window.__brandFx = { crystal: brandCrystal, crystalEdge: brandCrystalEdge, tube: brandTube, edge: brandCrystalEdge, topLed: brandTopLed, glow: brandGlow, halo: brandHalo, shadow: brandShadow, streak: brandStreak };
(function(){ const c = document.createElement('canvas'); c.width = 2200; c.height = 1500; const x = c.getContext('2d');
  x.textBaseline = 'alphabetic';
  function roundRect(a,b,w,h,r){ x.beginPath(); x.moveTo(a+r,b); x.arcTo(a+w,b,a+w,b+h,r); x.arcTo(a+w,b+h,a,b+h,r); x.arcTo(a,b+h,a,b,r); x.arcTo(a,b,a+w,b,r); x.closePath(); }
  function drawText(){
    x.clearRect(0,0,2200,1500);
    // solid frosted sign face (baked) so the text can never be washed out or sorted away
    const bg = x.createLinearGradient(0,0,0,1500); bg.addColorStop(0,'#fbf6ec'); bg.addColorStop(0.5,'#f4ecdb'); bg.addColorStop(1,'#ece1cd');
    roundRect(70,60,2060,1380,120); x.fillStyle = bg; x.fill();
    // soft cream bloom behind the logo
    const gl = x.createRadialGradient(1100,360,30,1100,360,620); gl.addColorStop(0,'rgba(255,253,247,0.9)'); gl.addColorStop(1,'rgba(255,253,247,0)'); x.fillStyle = gl; roundRect(70,60,2060,1380,120); x.fill();
    const title = 'BUYUE COMPANY'; x.font = '400 210px Instrument Serif, serif'; const ls = 6;
    let tw = 0; x.textAlign='left'; for (const ch of title) tw += x.measureText(ch).width + ls; tw -= ls; let cx = 1100 - tw/2;
    for (const ch of title){ x.lineWidth = 9; x.strokeStyle = 'rgba(255,252,244,0.85)'; x.strokeText(ch, cx, 720); x.fillStyle = '#171009'; x.fillText(ch, cx, 720); x.lineWidth = 2; x.strokeStyle = 'rgba(0,0,0,0.4)'; x.strokeText(ch, cx, 720); cx += x.measureText(ch).width + ls; }
    x.textAlign = 'center';
    x.fillStyle = '#2f2820'; x.font = '600 62px JetBrains Mono, monospace'; x.fillText('B R A N D I N G   ·   C O N T E N T   ·   D E S I G N', 1100, 1000);
    x.fillStyle = '#443a30'; x.font = '600 60px Instrument Sans, sans-serif'; x.fillText('W E   T U R N   I D E A S   I N T O   E X P E R I E N C E S', 1100, 1200);
    const dg = x.createLinearGradient(880, 0, 1320, 0); dg.addColorStop(0, 'rgba(226,74,51,0)'); dg.addColorStop(0.5, 'rgba(226,74,51,1)'); dg.addColorStop(1, 'rgba(226,74,51,0)'); x.fillStyle = dg; x.fillRect(880, 862, 440, 6);
  }
  drawText();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  const img = new Image(); img.onload = () => { drawText(); const h = 400, w = h * (img.naturalWidth/img.naturalHeight); const lx0 = 1100 - w/2, ly0 = 110;
    x.save(); x.shadowColor = 'rgba(60,20,10,0.4)'; x.shadowBlur = 18; x.shadowOffsetY = 5; x.drawImage(img, lx0, ly0, w, h); x.shadowColor = 'transparent'; x.drawImage(img, lx0, ly0, w, h); x.restore();
    tex.needsUpdate = true; }; img.src = '/assets/buyue-logo.png';
  const opaqueBack = new THREE.Mesh(new THREE.PlaneGeometry(5.16, 3.52), new THREE.MeshBasicMaterial({ color: 0xf5edda, transparent: true, opacity: 0, toneMapped: false })); opaqueBack.position.set(0, 2.5, -3.5); opaqueBack.renderOrder = 5; brandMeshes.push(opaqueBack); brandWall.add(opaqueBack);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(5.12, 3.49), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, toneMapped: false, depthWrite: true })); plate.material.userData.opa = 1;
  plate.position.set(0, 2.5, -3.48); plate.renderOrder = 6; brandMeshes.push(plate); brandWall.add(plate);
})();
window.__brandMeshes = brandMeshes;

// ══════════ FLOOR STAGE LIGHTS — 4 moving event fixtures (2 left, 2 right), warm amber sweep ══════════
const stage = new THREE.Group(); scene.add(stage);
const stageRig = new THREE.Group(); view.add(stageRig);   // fixtures live here, locked to the camera frame
const stageUnits = [], stageMeshes = [];
const stMatte = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.5, metalness: 0.6, envMapIntensity: 0.6, transparent: true, opacity: 0 });
const stMatte2 = new THREE.MeshStandardMaterial({ color: 0x0d0d0f, roughness: 0.7, metalness: 0.4, envMapIntensity: 0.5, transparent: true, opacity: 0 });
function stageFixture(lx, ly, lz, ry, side, phase){
  // parented to the render camera → locked to a bottom corner of the frame, always visible & symmetric
  const g = new THREE.Group(); g.position.set(lx, ly, lz); g.rotation.set(0.32, ry, 0); stageRig.add(g);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.13, 20), stMatte2); base.position.y = 0.06; g.add(base); stageMeshes.push(base);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.11, 16), stMatte); neck.position.y = 0.17; g.add(neck); stageMeshes.push(neck);
  const yoke = new THREE.Group(); yoke.position.y = 0.24; g.add(yoke);
  [-0.19, 0.19].forEach(px => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.055), stMatte); p.position.set(px, 0.2, 0); yoke.add(p); stageMeshes.push(p); });
  const head = new THREE.Group(); head.position.y = 0.4; head.rotation.x = -0.55; yoke.add(head);   // tilt up so the barrel faces inward-forward, not its back
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 0.46, 24), stMatte); barrel.rotation.x = Math.PI/2; head.add(barrel); stageMeshes.push(barrel);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 8, 24), stMatte2); ring.position.z = -0.22; head.add(ring); stageMeshes.push(ring);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0xffdca0, emissive: 0xF2A24A, emissiveIntensity: 0, roughness: 0.4, transparent: true, opacity: 0 });
  const lensFace = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), lensMat); lensFace.position.z = -0.23; lensFace.rotation.y = Math.PI; head.add(lensFace); stageMeshes.push(lensFace);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(245,168,74,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
  glow.scale.set(1.6, 1.6, 1.6); glow.position.z = -0.24; head.add(glow);
  const cg = new THREE.ConeGeometry(0.6, 7.0, 28, 1, true); cg.translate(0, -3.5, 0); cg.rotateX(Math.PI/2);
  const cone = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ color: 0xF2A24A, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); cone.position.z = -0.24; head.add(cone);
  stageUnits.push({ head, cone, lensMat, glow, side, phase });
}
// local coords in camera space: bottom-left & bottom-right corners, angled inward
stageFixture(-2.7, -1.45, -4.4, 0.6, -1, 0.0);
stageFixture(2.7, -1.45, -4.4, -0.6, 1, 1.6);
window.__stage = { stageUnits, stageMeshes };

// ── hide every Layer-2 prop (fixtures, podium, plants, LEDs, title, plaque) ──
studio.visible = false;
// clone shared materials so fading the studio never touches the camera
{ const cloned = new Map();
  studio.traverse(o => { if (o.isMesh && o.material !== softboxGlowMat && o.material !== discM && !o.material.userData.noFade) {
    if (!cloned.has(o.material)) cloned.set(o.material, o.material.clone());
    o.material = cloned.get(o.material);
  } });
}

const streams = [];
// Scratch vectors reused every frame in updateStreams (was 2 clones × 46 seeds × streams
// per frame — heavy GC churn during the burst). Same math, zero allocation.
const _streamA = new THREE.Vector3(), _streamB = new THREE.Vector3();
function spawnStream(target, color) {
  const n = 46; const g = new THREE.BufferGeometry(); const pos = new Float32Array(n*3);
  const from = new THREE.Vector3(0, 1.15, 1.3);
  for (let i = 0; i < n; i++) { pos[i*3]=from.x; pos[i*3+1]=from.y; pos[i*3+2]=from.z; }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ size: 0.07, color, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, map: glowTex('rgba(255,255,255,1)') });
  const p = new THREE.Points(g, m); scene.add(p);
  const seeds = []; for (let i = 0; i < n; i++) seeds.push({ off: new THREE.Vector3((Math.random()-0.5)*0.6,(Math.random()-0.5)*0.6,(Math.random()-0.5)*0.6), d: Math.random()*0.25 });
  streams.push({ p, from: from.clone(), target, seeds, t: 0, life: 1.2, n });
}
function updateStreams(dt) {
  for (let i = streams.length-1; i >= 0; i--) {
    const s = streams[i]; s.t += dt; const gp = s.p.geometry.attributes.position.array;
    for (let k = 0; k < s.n; k++) {
      const a = clamp01((s.t - s.seeds[k].d) / (s.life - s.seeds[k].d));
      const e = a*a*(3-2*a);
      const cur = _streamA.copy(s.from).lerp(s.target, e).add(_streamB.copy(s.seeds[k].off).multiplyScalar(Math.sin(a*Math.PI)));
      gp[k*3]=cur.x; gp[k*3+1]=cur.y; gp[k*3+2]=cur.z;
    }
    s.p.geometry.attributes.position.needsUpdate = true;
    s.p.material.opacity = 0.95 * (1 - clamp01((s.t-0.65)/0.55));
    if (s.t > s.life) { scene.remove(s.p); s.p.geometry.dispose(); s.p.material.dispose(); streams.splice(i,1); }
  }
}

// ══ 3D FILM-STRIP birth: a cinematic strip ejects from the lens, the card rides it, then it fades ══
function filmTex() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#0c0a08'; x.fillRect(0,0,128,256);
  for (let f = 0; f < 4; f++) {
    const fy = f*64 + 6;
    const g = x.createLinearGradient(0,fy,0,fy+52); g.addColorStop(0,'#2a3550'); g.addColorStop(0.55,'#c9884f'); g.addColorStop(1,'#3a2416'); x.fillStyle = g; x.fillRect(26, fy, 76, 52);
    x.fillStyle = 'rgba(255,220,170,0.35)'; x.beginPath(); x.arc(80, fy+16, 7, 0, 7); x.fill();
  }
  x.fillStyle = '#f2ead8';
  for (let i = 0; i < 16; i++) { const y = i*16 + 3; x.fillRect(6, y, 9, 9); x.fillRect(113, y, 9, 9); }
  x.fillStyle = '#bc9656'; x.fillRect(22,0,2,256); x.fillRect(104,0,2,256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 3);
  return t;
}
const sparkTex = glowTex('rgba(255,255,255,1)');
function spawnBurst(A) {
  A.formed = true; return;   // spark particles disabled per request — photos form with no dots
  const N = 130;
  const pos = new Float32Array(N*3), col = new Float32Array(N*3);
  const cw = A.ctx.canvas.width, ch = A.ctx.canvas.height;
  let img = null; try { img = A.ctx.getImageData(0,0,cw,ch).data; } catch(e){}
  const targ = new Array(N), swirl = new Array(N);
  for (let i=0;i<N;i++){
    const lx = (Math.random()-0.5)*A.w, ly = (Math.random()-0.5)*A.h;
    targ[i] = { lx, ly };
    let r=234,g=150,b=90;
    if (img){ const u=clamp01(lx/A.w+0.5), v=clamp01(0.5-ly/A.h); const px=Math.min(cw-1,(u*cw)|0), py=Math.min(ch-1,(v*ch)|0); const k=(py*cw+px)*4; r=img[k];g=img[k+1];b=img[k+2]; }
    // brighten so the colour reads as a glowing spark on any background
    col[i*3]=Math.min(1, r/255*1.5+0.32); col[i*3+1]=Math.min(1, g/255*1.5+0.28); col[i*3+2]=Math.min(1, b/255*1.5+0.24);
    swirl[i] = { a0: Math.random()*Math.PI*2, R: 0.3+Math.random()*0.75, turns: 1.3+Math.random()*1.7, rise: 0.35+Math.random()*0.8, sp: 0.6+Math.random()*0.9 };
    pos[i*3]=pivot.x+(Math.random()-0.5)*0.1; pos[i*3+1]=pivot.y+(Math.random()-0.5)*0.1; pos[i*3+2]=pivot.z+0.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  const mat = new THREE.PointsMaterial({ map: sparkTex, size: 0.14, vertexColors: true, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const points = new THREE.Points(geo, mat); points.frustumCulled = false; scene.add(points);
  A.burst = { points, geo, mat, pos, targ, swirl, N };
}
const _vr = new THREE.Vector3(), _vu = new THREE.Vector3();
function updateBurst(A, lb, t) {
  const b = A.burst; if (!b) return;
  const s = clamp01(lb / 1.05);
  const es = 1 - Math.pow(1-s, 3);
  _vr.set(1,0,0).applyQuaternion(view.quaternion);
  _vu.set(0,1,0).applyQuaternion(view.quaternion);
  const gs = A.grp.scale.x, cp = A.grp.position, P0 = pivot;
  for (let i=0;i<b.N;i++){
    const tg = b.targ[i], sw = b.swirl[i];
    const txw = cp.x + _vr.x*tg.lx*gs + _vu.x*tg.ly*gs;
    const tyw = cp.y + _vr.y*tg.lx*gs + _vu.y*tg.ly*gs;
    const tzw = cp.z + _vr.z*tg.lx*gs + _vu.z*tg.ly*gs;
    const bx = P0.x+(txw-P0.x)*es, by = P0.y+(tyw-P0.y)*es, bz = P0.z+(tzw-P0.z)*es;
    const ang = sw.a0 + s*sw.turns*Math.PI*2 + t*sw.sp;
    const rad = (1-es)*sw.R, ca = Math.cos(ang)*rad, sa = Math.sin(ang)*rad, riseY = (1-es)*sw.rise;
    b.pos[i*3]   = bx + _vr.x*ca + _vu.x*sa;
    b.pos[i*3+1] = by + _vr.y*ca + _vu.y*sa + riseY;
    b.pos[i*3+2] = bz + _vr.z*ca + _vu.z*sa;
  }
  b.geo.attributes.position.needsUpdate = true;
  b.mat.opacity = s < 0.66 ? 1 : Math.max(0, 1-(s-0.66)/0.34);
  b.mat.size = 0.17 - s*0.07;
  if (s >= 1) { scene.remove(b.points); b.geo.dispose(); b.mat.dispose(); A.burst = null; A.formed = true; }
}

// capture logo particle swarm
const logoGrp = new THREE.Group(); logoGrp.position.copy(new THREE.Vector3(0, 1.2, 1.35)); scene.add(logoGrp);
const logoGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,205,130,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
logoGlow.scale.set(3.4, 3.4, 1); logoGrp.add(logoGlow);
let logoPts = null, logoTargets = null, logoN = 0;
(function loadLogo() {
  const img = new Image(); img.src = '/assets/buyue-mark.png';
  img.onload = () => {
    const s = 96, c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d');
    x.drawImage(img, 0, 0, s, s); const data = x.getImageData(0,0,s,s).data;
    const pts = [];
    for (let y = 0; y < s; y += 1) for (let px = 0; px < s; px += 1) { const a = data[(y*s+px)*4+3]; if (a > 110 && Math.random() > 0.4) pts.push([(px/s-0.5)*2.5, -(y/s-0.5)*2.5]); }
    logoN = pts.length; logoTargets = new Float32Array(logoN*3);
    const pos = new Float32Array(logoN*3);
    for (let i = 0; i < logoN; i++) {
      logoTargets[i*3]=pts[i][0]; logoTargets[i*3+1]=pts[i][1]; logoTargets[i*3+2]=0;
      const r = 2.5+Math.random()*2, th = Math.random()*Math.PI*2, ph = Math.random()*Math.PI;
      pos[i*3]=Math.sin(ph)*Math.cos(th)*r; pos[i*3+1]=Math.sin(ph)*Math.sin(th)*r; pos[i*3+2]=Math.cos(ph)*r;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ size: 0.07, color: 0xffd88a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, map: glowTex('rgba(255,232,180,1)') });
    logoPts = new THREE.Points(g, m); logoGrp.add(logoPts);
  };
})();

// ---------- artifacts (premium glassmorphism holo cards) ----------
function panelMesh(cw, ch, drawFn, name, hero) {
  const SS = 2; // supersample for crisp text
  const c = document.createElement('canvas'); c.width = cw*SS; c.height = ch*SS;
  const ctx = c.getContext('2d'); ctx.scale(SS, SS);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const w = (hero?0.86:0.74), h = w * (ch/cw);
  const grp = new THREE.Group();
  // frosted glass backing (glassmorphism)
  const backMat = new THREE.MeshPhysicalMaterial({ color: 0x0b0f14, roughness: 0.18, metalness: 0.0, transmission: 0.55, thickness: 0.4, ior: 1.4, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 1.2, transparent: true, opacity: 0.9 });
  const back = new THREE.Mesh(roundedBoxGeo(w*1.1, h*1.16, 0.05, 0.06), backMat); back.position.z = -0.05; grp.add(back);
  // bronze bezel frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xbc9656, roughness: 0.3, metalness: 1.0, envMapIntensity: 1.4, transparent: true });
  const frame = new THREE.Mesh(roundedBoxGeo(w*1.14, h*1.2, 0.03, 0.06), frameMat); frame.position.z = -0.06; grp.add(frame);
  // content panel (emissive UI)
  const mat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: hero?1.0:0.8, roughness: 0.28, metalness: 0.1, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h*0.98), mat); mesh.position.z = 0.005; grp.add(mesh);
  // header title bar (baked)
  const hc = document.createElement('canvas'); hc.width = 680; hc.height = 88; const hx = hc.getContext('2d'); hx.scale(2,2);
  hx.fillStyle = 'rgba(10,9,8,0.9)'; hx.fillRect(0,0,340,44); hx.fillStyle = '#eac46b'; hx.font = '700 21px Instrument Sans, sans-serif'; hx.textBaseline='middle'; hx.fillText((name||'').toUpperCase(), 16, 24);
  hx.fillStyle = '#ff7a45'; hx.beginPath(); hx.arc(320,22,6,0,7); hx.fill();
  const htex = new THREE.CanvasTexture(hc); htex.colorSpace = THREE.SRGBColorSpace; htex.anisotropy = 8;
  const header = new THREE.Mesh(new THREE.PlaneGeometry(w, h*0.16), new THREE.MeshStandardMaterial({ map: htex, emissive: 0xffffff, emissiveMap: htex, emissiveIntensity: 0.7, transparent: true, roughness: 0.4 }));
  header.position.set(0, h*0.5 - h*0.08 + 0.01, 0.02); grp.add(header);
  // amber base accent line
  const accent = new THREE.Mesh(new THREE.PlaneGeometry(w*0.9, 0.012), new THREE.MeshBasicMaterial({ color: 0xff7a45, transparent: true, blending: THREE.AdditiveBlending })); accent.position.set(0, -h*0.5+0.02, 0.03); grp.add(accent);
  // HUD corner brackets (bronze)
  const brMat = new THREE.MeshStandardMaterial({ color: 0xe8c884, roughness: 0.3, metalness: 1.0, transparent: true });
  for (const [sx,sy] of [[-1,1],[1,1],[-1,-1],[1,-1]]) {
    const cb = new THREE.Group();
    const a = new THREE.Mesh(new THREE.PlaneGeometry(0.1,0.012), brMat); a.position.x = sx*0.045;
    const b = new THREE.Mesh(new THREE.PlaneGeometry(0.012,0.1), brMat); b.position.y = sy*0.045;
    cb.add(a,b); cb.position.set(sx*(w*0.5+0.02), sy*(h*0.5+0.02), 0.03); grp.add(cb);
  }
  // node dot + short connector stub
  const node = new THREE.Mesh(new THREE.SphereGeometry(0.02,12,12), new THREE.MeshBasicMaterial({ color: 0xeac46b })); node.position.set(-(w*0.5+0.06), -(h*0.5), 0.02); grp.add(node);
  // soft backing glow
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(234,150,90,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
  glow.scale.set(w*2.4, h*2.4, 1); glow.position.z = -0.1; grp.add(glow);
  return { grp, ctx, tex, draw: drawFn, cw, ch, glow, mat, frameMat, backMat, header, accent };
}
const RED = '#cf5138', GOLD = '#eac46b', INK = '#f5f7f9';
function bg(ctx, w, h, top, bot) { const g = ctx.createLinearGradient(0,0,0,h); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0,0,w,h); }

function drawIdentity(ctx, w, h, t) {
  bg(ctx, w, h, '#0e1410', '#070a08');
  // construction guides (golden ratio + grid)
  const mx = w*0.28, my = h*0.46, R = h*0.26;
  ctx.strokeStyle = 'rgba(234,196,107,0.22)'; ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(mx, my, R/(1.618**i), 0, Math.PI*2); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(245,247,249,0.05)';
  for (let gx = 1; gx < 8; gx++) { ctx.beginPath(); ctx.moveTo(w*gx/8,0); ctx.lineTo(w*gx/8,h); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0,my); ctx.lineTo(w,my); ctx.stroke();
  // monogram — building bronze strokes
  const prog = Math.min(1, (Math.sin(t*0.6)*0.5+0.5)*1.3);
  ctx.strokeStyle = '#eac46b'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(mx-R*0.5, my-R*0.8); ctx.lineTo(mx-R*0.5, my+R*0.8); ctx.stroke();
  ctx.beginPath(); ctx.arc(mx-R*0.12, my-R*0.4, R*0.42, -Math.PI*0.5, -Math.PI*0.5 + Math.PI*2*prog); ctx.stroke();
  ctx.beginPath(); ctx.arc(mx-R*0.12, my+R*0.4, R*0.46, -Math.PI*0.5, -Math.PI*0.5 + Math.PI*2*prog); ctx.stroke();
  ctx.fillStyle = '#cf5138'; [[mx-R*0.5,my-R*0.8],[mx-R*0.5,my+R*0.8]].forEach(p=>ctx.fillRect(p[0]-4,p[1]-4,8,8));
  // wordmark with wipe reveal
  const rev = (t*0.35)%1.6; const word = 'BUYUE';
  ctx.font = '800 30px Instrument Sans, sans-serif'; ctx.textBaseline = 'alphabetic';
  const wx = w*0.5, wy = h*0.34;
  ctx.fillStyle = 'rgba(245,247,249,0.12)'; ctx.fillText(word, wx, wy);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy-32, Math.min(1,rev)* (w-wx-14), 40); ctx.clip();
  ctx.fillStyle = '#f5f7f9'; ctx.fillText(word, wx, wy); ctx.restore();
  // palette swatches sliding in
  const cols = ['#cf5138','#ff7a45','#eac46b','#bbcfb3','#f5f7f9'];
  cols.forEach((c,i)=>{ const ap = clamp01(rev*2 - i*0.25); const bx = wx + i*((w-wx-14)/5); ctx.globalAlpha = ap; ctx.fillStyle = c; ctx.fillRect(bx, h*0.46, (w-wx-14)/5 - 4, h*0.12); });
  ctx.globalAlpha = 1;
  // type specimen
  ctx.fillStyle = '#f5f7f9'; ctx.font = '800 30px Instrument Sans, sans-serif'; ctx.fillText('Aa', wx, h*0.78);
  ctx.fillStyle = 'rgba(245,247,249,0.45)'; ctx.font = '600 11px Instrument Sans, sans-serif'; ctx.fillText('MANROPE · NASKH', wx+56, h*0.76);
  ctx.fillStyle = 'rgba(187,207,179,0.8)'; ctx.font = '600 10px Instrument Sans, sans-serif'; ctx.fillText('BRAND SYSTEM ●', wx+56, h*0.86);
}
function drawAnalytics(ctx, w, h, t) {
  bg(ctx, w, h, '#0f1a22', '#080d12');
  const reach = (32.7 + Math.sin(t*0.8)*0.6);
  ctx.fillStyle = 'rgba(245,247,249,0.5)'; ctx.font = '600 12px Instrument Sans, sans-serif'; ctx.fillText('TOTAL REACH', 16, h*0.28);
  ctx.fillStyle = GOLD; ctx.font = '800 44px Instrument Sans, sans-serif'; ctx.fillText(reach.toFixed(1)+'M', 14, h*0.5);
  ctx.fillStyle = '#bbcfb3'; ctx.font = '700 14px Instrument Sans, sans-serif'; ctx.fillText('\u25B2 +207%', 16, h*0.62);
  const gy = h*0.66, gh = h*0.28;
  ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= 22; i++) { const x = 16+(w-32)*i/22, v = (Math.sin(i*0.5+t*1.2)*0.25+0.5+i*0.02), y = gy+gh - v*gh; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
  ctx.stroke();
  for (let i = 0; i < 9; i++) { const bh2 = (Math.sin(i+t*2)*0.4+0.6)*gh*0.7; ctx.fillStyle = 'rgba(187,207,179,0.5)'; ctx.fillRect(16+i*(w-32)/9, gy+gh-bh2, (w-32)/9-4, bh2); }
}
function drawPhoto(ctx, w, h, t) {
  const dev = Math.sin(t*0.5)*0.5+0.5;
  const g = ctx.createLinearGradient(0,0,0,h); g.addColorStop(0, '#2a3a55'); g.addColorStop(0.5, '#c98a5a'); g.addColorStop(1, '#5a3320'); ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  ctx.fillStyle = 'rgba(255,230,180,'+(0.6*dev)+')'; ctx.beginPath(); ctx.arc(w*0.7, h*0.35, 26, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#3a2416'; ctx.beginPath(); ctx.moveTo(0,h); ctx.quadraticCurveTo(w*0.4, h*0.6, w, h*0.8); ctx.lineTo(w,h); ctx.fill();
  ctx.fillStyle = 'rgba(8,10,14,'+(1-dev)+')'; ctx.fillRect(0,0,w,h);
  const sx = (t*80)%(w+80)-40; const lg = ctx.createLinearGradient(sx-30,0,sx+30,0); lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(0.5,'rgba(255,255,255,0.25)'); lg.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle = lg; ctx.fillRect(sx-30,0,60,h);
  ctx.strokeStyle = 'rgba(245,247,249,0.7)'; ctx.lineWidth = 2;
  [[10,10],[w-10,10],[10,h-10],[w-10,h-10]].forEach((p,i)=>{ ctx.beginPath(); const dx=i%2?-14:14, dy=i<2?14:-14; ctx.moveTo(p[0],p[1]); ctx.lineTo(p[0]+dx,p[1]); ctx.moveTo(p[0],p[1]); ctx.lineTo(p[0],p[1]+dy); ctx.stroke(); });
  ctx.fillStyle = INK; ctx.font = '700 13px Instrument Sans, sans-serif'; ctx.fillText('● PHOTOGRAPHY', 16, h-16);
}
function drawVideo(ctx, w, h, t) {
  bg(ctx, w, h, '#141814', '#080a08');
  const scroll = (t*40)%40;
  for (let i = -1; i < 6; i++) { const x = i*(w/5)+(w/10)-scroll; const g = ctx.createLinearGradient(x,0,x+w/6,0); g.addColorStop(0, `hsl(${(i*36+t*20)%360},45%,55%)`); g.addColorStop(1, `hsl(${(i*36+t*20+30)%360},45%,45%)`); ctx.fillStyle = g; ctx.fillRect(x, h*0.28, w/6-8, h*0.44); }
  ctx.fillStyle = 'rgba(245,247,249,0.5)'; for (let i = 0; i < 10; i++) { const x = (i*(w/9)-scroll*0.6+w)%w; ctx.fillRect(x, 10, 12, 8); ctx.fillRect(x, h-18, 12, 8); }
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(16, h-30, w-32, 4);
  ctx.fillStyle = RED; ctx.fillRect(16, h-30, (w-32)*((t*0.15)%1), 4);
  ctx.fillStyle = INK; ctx.font = '700 13px Instrument Sans, sans-serif'; ctx.fillText('00:'+String(Math.floor(t*3)%60).padStart(2,'0'), 16, 26);
}
let likes = 1240;
function drawCampaign(ctx, w, h, t) {
  bg(ctx, w, h, '#efe7de', '#ddd1c4');
  ctx.fillStyle = '#e0a94f'; ctx.beginPath(); ctx.arc(28, 26, 12, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(47,47,45,0.85)'; ctx.font = '700 13px Instrument Sans, sans-serif'; ctx.fillText('buyue.studio', 48, 24);
  ctx.fillStyle = 'rgba(47,47,45,0.4)'; ctx.font = '500 11px Instrument Sans, sans-serif'; ctx.fillText('Sponsored', 48, 38);
  const ig = ctx.createLinearGradient(0,46,w,h*0.72); ig.addColorStop(0,'#cf5138'); ig.addColorStop(1,'#eac46b'); ctx.fillStyle = ig; ctx.fillRect(16, 46, w-32, h*0.5);
  ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.font = '800 22px Instrument Sans, sans-serif'; ctx.fillText('NEW DROP', 32, 46+h*0.28);
  const beat = 1+Math.sin(t*4)*0.12; ctx.save(); ctx.translate(30, h-26); ctx.scale(beat,beat); ctx.fillStyle = '#cf5138'; ctx.font = '20px sans-serif'; ctx.fillText('♥', -8, 7); ctx.restore();
  likes += Math.random() < 0.3 ? 1 : 0;
  ctx.fillStyle = 'rgba(47,47,45,0.9)'; ctx.font = '700 14px Instrument Sans, sans-serif'; ctx.fillText(likes.toLocaleString()+' likes', 50, h-20);
}
function drawMood(ctx, w, h, t) {
  bg(ctx, w, h, '#16130f', '#0b0908');
  const cols = ['#cf5138','#eac46b','#bbcfb3','#2f2f2d','#f5f7f9'];
  cols.forEach((c,i)=>{ ctx.fillStyle = c; ctx.fillRect(16+i*(w-32)/5, 16, (w-32)/5-6, h*0.22); });
  ctx.fillStyle = 'rgba(245,247,249,0.9)'; ctx.font = '800 30px Instrument Sans, sans-serif'; ctx.fillText('Aa', 20, h*0.62);
  ctx.font = '400 13px Instrument Sans, sans-serif'; ctx.fillStyle = 'rgba(245,247,249,0.5)'; ctx.fillText('Manrope · Naskh', 80, h*0.55);
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(40+i*46, h*0.82, 18, 0, Math.PI*2); ctx.fillStyle = ['#cfd2d6','#e6bd6a','#bbcfb3'][i]; ctx.fill(); }
  ctx.strokeStyle = 'rgba(234,196,107,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(w*0.62, h*0.5, w*0.32, h*0.4);
  ctx.fillStyle = 'rgba(245,247,249,0.6)'; ctx.font = '700 12px Manrope'; ctx.fillText('DIRECTION', 16, h-14);
}
const cardImgs = {};
function loadCardImg(key, src){ const im = new Image(); im.crossOrigin = 'anonymous'; im.src = src; cardImgs[key] = im; }
// WebP q82 at source resolution (10.4MB PNG -> 0.89MB, 91% smaller). The cards are only
// ever drawn through a contrast/saturate/brightness canvas filter (drawImageCover), so the
// re-encode is perceptually indistinguishable; PNG sources kept in-repo for re-export.
loadCardImg('card1', '/assets/card-1.webp');
loadCardImg('card2', '/assets/card-2.webp');
loadCardImg('card3', '/assets/card-3.webp');
loadCardImg('card4', '/assets/card-4.webp');
loadCardImg('card5', '/assets/card-5.webp');
loadCardImg('card6', '/assets/card-6.webp');
function drawImageCover(ctx, w, h, im){
  ctx.fillStyle = '#080a0e'; ctx.fillRect(0,0,w,h);
  if (!im || !im.complete || !im.naturalWidth) return;
  const ir = im.naturalWidth/im.naturalHeight, cr = w/h; let dw, dh;
  if (ir > cr) { dh = h; dw = h*ir; } else { dw = w; dh = w/ir; }
  ctx.save(); ctx.filter = 'contrast(1.2) saturate(1.28) brightness(1.05)';
  ctx.drawImage(im, (w-dw)/2, (h-dh)/2, dw, dh);
  ctx.restore();
  // crisp dark edge stroke for definition against the light background
  const lw = Math.max(2.5, w*0.016); ctx.strokeStyle = 'rgba(10,10,14,0.72)'; ctx.lineWidth = lw;
  ctx.strokeRect(lw/2, lw/2, w-lw, h-lw);
}
function drawCard1(ctx, w, h, t){ drawImageCover(ctx, w, h, cardImgs.card1); }
function drawCard2(ctx, w, h, t){ drawImageCover(ctx, w, h, cardImgs.card2); }
function drawCard3(ctx, w, h, t){ drawImageCover(ctx, w, h, cardImgs.card3); }
function drawCard4(ctx, w, h, t){ drawImageCover(ctx, w, h, cardImgs.card4); }
function drawCard5(ctx, w, h, t){ drawImageCover(ctx, w, h, cardImgs.card5); }
function drawCard6(ctx, w, h, t){ drawImageCover(ctx, w, h, cardImgs.card6); }
// bare photo plane — no glass/frame/header chrome, floats naturally from the lens
function imgPanelMesh(cw, ch, drawFn, name, hero){
  const c = document.createElement('canvas');
  // RES kept >= the 1448px card source, so no real pixels are downsampled — the old 2048
  // upscaled interpolated headroom, costing ~40% more VRAM + mip build for zero visible gain.
  const RES = 1536; c.width = RES; c.height = Math.round(RES*ch/cw);
  const ctx = c.getContext('2d'); ctx.scale(c.width/cw, c.height/ch);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const w = 1.18, h = w * (ch/cw);
  const grp = new THREE.Group();
  // soft contact shadow behind the print
  const shadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(0,0,0,0.9)'), transparent: true, opacity: 0.28, depthWrite: false }));
  shadow.scale.set(w*1.7, h*1.7, 1); shadow.position.z = -0.12; grp.add(shadow);
  // the photo itself (raycast target at children[1])
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, fog: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); grp.add(mesh);
  // dummies so the shared animation loop stays happy
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(234,150,90,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
  glow.scale.set(w*2.2, h*2.2, 1); glow.position.z = -0.1; grp.add(glow);
  const header = { material: { opacity: 0 } }, accent = { material: { opacity: 0 } };
  return { grp, ctx, tex, draw: drawFn, cw, ch, w, h, glow, mat, frameMat: mat, backMat: mat, header, accent, bare: true };
}
const artDefs = [
  { name: 'Brand Identity', d: drawCard1, cw: 340, ch: 254, col: -1, tier: 1, phase: 0, hero: true, img: true, mul: 0.8, xAdj: -0.04, yAdj: -0.22, ord: 1 },
  { name: 'Analytics', d: drawCard2, cw: 330, ch: 266, col: 1, tier: 1, phase: 1.05, hero: true, img: true, xAdj: 1.04, yAdj: -0.765, mul: 0.66, ord: 0 },
  { name: 'Photography', d: drawCard3, cw: 350, ch: 280, col: -1, tier: 0, phase: 2.1, hero: true, img: true, mul: 0.8, xAdj: -0.04, yAdj: 0.17, ord: 3 },
  { name: 'Video Production', d: drawCard4, cw: 340, ch: 255, col: 1, tier: 0, phase: 3.1, hero: false, img: true, xAdj: 1.04, yAdj: 0.209, mul: 0.68, ord: 2 },
  { name: 'Social Campaign', d: drawCard5, cw: 350, ch: 280, col: -1, tier: -1, phase: 4.2, hero: false, img: true, mul: 0.8, xAdj: -0.04, yAdj: 0.68, ord: 5 },
  { name: 'Creative Direction', d: drawCard6, cw: 340, ch: 255, col: 1, tier: -1, phase: 5.0, hero: false, img: true, xAdj: 1.04, yAdj: 1.183, mul: 0.68, ord: 4 },
];
const pivot = new THREE.Vector3(0, 1.2, 2.15);
const arts = artDefs.map((def) => {
  const pm = (def.img ? imgPanelMesh : panelMesh)(def.cw, def.ch, def.d, def.name, def.hero);
  pm.grp.scale.setScalar(0.001); pm.grp.position.copy(pivot); scene.add(pm.grp);
  return Object.assign(pm, def, { spawn: 4.4 + def.ord * 0.66, born: false, streamed: false });
});
window.__probeCards = () => arts.map(a => { const c=a.grp.position, w=a.w*a.grp.scale.x, h=a.h*a.grp.scale.x; const top=c.clone(); top.y+=h/2; const bot=c.clone(); bot.y-=h/2; const vt=top.project(view), vb=bot.project(view), v=c.clone().project(view); return { name: a.name, col: a.col, sx: Math.round((v.x*0.5+0.5)*innerWidth), sy: Math.round((-v.y*0.5+0.5)*innerHeight), ph: Math.round(((-vb.y*0.5+0.5)-(-vt.y*0.5+0.5))*innerHeight) }; });
window.__viewInfo = () => ({ w: innerWidth, h: innerHeight });
window.__cardDist = () => ({ cam: view.position.toArray().map(n=>+n.toFixed(2)), cards: arts.map(a => ({ name: a.name, col: a.col, dist: +a.grp.position.distanceTo(view.position).toFixed(2), pos: a.grp.position.toArray().map(n=>+n.toFixed(2)) })) });
window.__probePoint = (x,y,z) => { const v = new THREE.Vector3(x,y,z).project(view); return { sx: Math.round((v.x*0.5+0.5)*innerWidth), sy: Math.round((-v.y*0.5+0.5)*innerHeight) }; };
const captureFlash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex('rgba(255,255,255,1)'), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
captureFlash.scale.set(2.6, 2.6, 1); captureFlash.position.set(0, 0.1, 1.55); cam.add(captureFlash);

// ---------- interaction ----------
let mx = 0, my = 0, tmx = 0, tmy = 0;
const reticle = document.getElementById('reticle'), tip = document.getElementById('tip');
const cta1 = document.getElementById('cta1'), cta2 = document.getElementById('cta2');
const mouse = new THREE.Vector2(-2,-2); const ray = new THREE.Raycaster(); let hovered = null;
addEventListener('mousemove', e => {
  tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5;
  const dxm = tmx - (window.__pmx||0), dym = tmy - (window.__pmy||0); window.__pmx = tmx; window.__pmy = tmy;
  window.__mEnergy = Math.min(1, (window.__mEnergy||0) + Math.hypot(dxm,dym)*6);
  mouse.set((e.clientX/innerWidth)*2-1, -(e.clientY/innerHeight)*2+1);
  // READ both CTA rects up-front, THEN do every style write — so a transform write never
  // sits between two getBoundingClientRect() reads (which forces a second sync layout). Still
  // reads the LIVE (transformed) rect, so the magnetic feedback is byte-identical.
  const r1 = cta1 && cta1.getBoundingClientRect(), r2 = cta2 && cta2.getBoundingClientRect();
  reticle.style.opacity = '1'; reticle.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  const magnet = (b, r) => { if(!b || !r) return; const dx = e.clientX-(r.left+r.width/2), dy = e.clientY-(r.top+r.height/2); const dist = Math.hypot(dx,dy); b.style.transform = dist<150 ? `translate(${dx*0.2}px,${dy*0.26}px)` : 'translate(0,0)'; };
  magnet(cta1, r1); magnet(cta2, r2);
}, { signal: __sig });
let scrollTarget = 0, scrollP = 0, captured = false;
addEventListener('scroll', () => { scrollTarget = Math.min(1, scrollY / (innerHeight * 2.4)); }, { signal: __sig, passive: true });

// ---------- headline ----------
const HEAD = { en: [['We',0],['Sell',0],['Results,',1],['Not',0],['Promises.',0]], sub: 'Buyue is a full-service marketing and advertising agency, and one of the operating brands of Noble Business Group. We help brands build a powerful market presence through clear strategy, content that resonates, smart campaigns, and creative execution that connects the idea to the result.' };
function buildHead() {
  const el = document.getElementById('head'); el.innerHTML = ''; let idx = 0;
  HEAD.en.forEach((wd, wi) => {
    const wspan = document.createElement('span'); wspan.className = 'word' + (wd[1] ? ' hi' : '');
    [...wd[0]].forEach(ch => { const s = document.createElement('span'); s.className = 'ltr'; s.textContent = ch; s.style.transitionDelay = (idx*0.05) + 's'; wspan.appendChild(s); idx++; });
    el.appendChild(wspan); if (wi < HEAD.en.length - 1) el.appendChild(document.createTextNode(' '));
  });
  document.getElementById('sub').textContent = HEAD.sub;
}
// buildHead() intentionally NOT called — the copy (#head/#sub/#ctas) is rendered by
// the React scaffold from next-intl; the scene only reveals it (adds `.in`).

// ---------- timeline + easings ----------
const clock = new THREE.Clock(); let T = reduce ? 12 : 0; let headShown = false, uiShown = false, revealT = -1;
function clamp01(v){ return v<0?0:v>1?1:v; }
function lerp(a,b,t){ return a+(b-a)*t; }
function easeOutQuint(x){ return 1 - Math.pow(1-x, 5); }
function easeInOutCubic(x){ return x<0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2; }
function easeOutExpo(x){ return x===1?1:1-Math.pow(2,-10*x); }
function smoothstep(x){ x=clamp01(x); return x*x*(3-2*x); }
const _eA = new THREE.Euler(), _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
const _slot = new THREE.Vector3(); // reused per card/frame for the artifact slot target (was new Vector3)

function stepFrame() {
  window.__frame = (window.__frame||0) + 1;
  const dt = Math.min(clock.getDelta(), 0.05); if (!reduce && window.__heroStarted) T += dt;
  const t = reduce ? 12 : T;
  scrollP += (scrollTarget - scrollP) * 0.09;

  // smooth camera assembly
  parts.forEach(p => {
    const a = clamp01((t - 2.0 - p.delay) / 1.05);
    const e = easeOutQuint(a);
    p.mesh.position.lerpVectors(p.scatter, p.home, e);
    _q1.setFromEuler(p.scatterRot); _q2.setFromEuler(p.homeRot);
    p.mesh.quaternion.slerpQuaternions(_q1, _q2, e);
    p.mesh.scale.setScalar(Math.max(0.001, 0.4 + e*0.6));
    p.mesh.visible = a > 0;
  });

  const ig = clamp01((t - 4.2) / 1.4);
  M.core.emissiveIntensity = 1.2 + ig*2.4 + Math.sin(t*3)*0.3*ig;
  M.glowFlame.emissiveIntensity = 2.0 + ig*1.2 + Math.sin(t*2.2)*0.3;
  M.glowGold.emissiveIntensity = 1.8 + Math.sin(t*1.7+1)*0.3;
  M.glowSage.emissiveIntensity = 1.6 + Math.sin(t*1.9+2)*0.3;
  coreLight.intensity = ig*5 + Math.sin(t*4)*0.6*ig;
  const glowK = window.__light ? 0.12 : 1;
  coreGlow.material.opacity = ig*0.6*glowK;
  coreGlow.scale.setScalar(1.2 + Math.sin(t*2)*0.1 + ig*0.35);
  flare.material.opacity = ig*(0.32 + Math.sin(t*2.5)*0.12)*glowK;
  flare.scale.set(3.2 + Math.sin(t*1.5)*0.5, 0.36, 1);
  cone.material.opacity = ig*0.07*(0.8+Math.sin(t*1.2)*0.2)*glowK;

  // ── per-card capture choreography (iris blink + flash + camera aim) ──
  let capEnv = 0, aimYawT = 0, aimPitchT = 0;
  arts.forEach(A => {
    const lb = t - A.spawn;
    if (lb > -0.12 && lb < 0.32) capEnv = Math.max(capEnv, 1 - Math.abs(lb - 0.05) / 0.2);
    if (lb > 0.02 && lb < 0.8) { const w2 = 1 - Math.abs(lb - 0.4) / 0.4; if (w2 > 0) { aimYawT += A.col * 0.5 * w2; aimPitchT += -(A.tier) * 0.16 * w2; } }
  });
  capEnv = clamp01(capEnv);
  window.__camAimY = lerp(window.__camAimY || 0, aimYawT, 0.2);
  window.__camAimX = lerp(window.__camAimX || 0, aimPitchT, 0.2);
  captureFlash.material.opacity = capEnv * (window.__light ? 0.6 : 1.05);
  captureFlash.scale.setScalar(2.2 + capEnv * 2.2);

  // smooth lens life + gentle camera drift
  focusRing.rotation.z = Math.sin(t*0.4)*0.25 + t*0.04;
  // mechanical iris breathe (open/close) + blink on each capture
  if (window.__iris) { const open = clamp01(0.55 + Math.sin(t*0.7)*0.28 - capEnv*1.1); window.__iris.forEach(b => { b.pv.rotation.z = b.base + (1-open)*0.9; }); }
  // BUYUE bronze halo — signature: dormant at rest, ignites on capture / key moments
  if (window.__halo) { const ignite = Math.max(capEnv, t>4.4 ? 0.35 : 0); window.__halo.emissiveIntensity = 0.2 + ignite*2.6 + Math.sin(t*2.2)*0.15*ignite; window.__halo.emissive.setHSL(0.06 + Math.sin(t*0.5)*0.03, 0.85, 0.55); }
  cam.position.y = 0.85 + Math.sin(t*0.6)*0.02;
  // reveal flourish: 3D spin-out, then settle facing the viewer + pulled back
  let flY = 0, flX = 0, flS = 0, settle = 0;
  if (revealT >= 0) {
    const p = clamp01((t - revealT) / 1.7); const b = Math.sin(p*Math.PI); const e = 1-Math.pow(1-p,3);
    flY = e*Math.PI*2; flX = b*0.28; flS = b*0.12;
    settle = easeInOutCubic(clamp01((t - revealT - 1.0) / 1.6));   // face-forward + dolly-back
  }
  const baseYaw = Math.sin(t*0.22)*0.10 + mx*0.42;
  cam.rotation.y = baseYaw*(1 - settle*0.7) + settle*0.70 + flY + (window.__camAimY||0);
  cam.rotation.x = (Math.sin(t*0.3)*0.02 - my*0.2)*(1 - settle*0.5) + flX + (window.__camAimX||0);
  cam.rotation.z = mx*0.05*(1 - settle*0.6);
  // far behind the headline, centred exactly on the two-line block (behind RESULTS/PROMISES)
  cam.position.z = -settle*6.2;
  cam.position.x = -settle*4.7;
  cam.position.y = (0.85 + Math.sin(t*0.6)*0.02) - settle*0.55;
  cam.scale.setScalar((1 + flS) * (1 + settle*0.16));
  // interactive energy: moving the mouse makes the Core & halo flare and rings spin
  const me = (window.__mEnergy = (window.__mEnergy||0) * 0.94);
  M.core.emissiveIntensity += me*2.2 + capEnv*2.6;
  if (window.__halo) window.__halo.emissiveIntensity += me*2.4;
  coreLight.intensity += me*3 + capEnv*3.5;
  focusRing.rotation.z += me*0.15;

  // artifacts (capture blink → emerge from lens → travel + grow → settle)
  arts.forEach(A => {
    const lb = t - A.spawn;
    if (lb < 0) { A.grp.visible = false; return; }
    A.grp.visible = true;
    if (!A.born) { A.born = true; M.core.emissiveIntensity += 1.2; }
    const emerge = clamp01((lb - 0.14) / 0.5);
    const settle = easeInOutCubic(clamp01((lb - 0.2) / 0.8));
    // Layer F — per-card personality + one coordinated ~12s hero breath
    const breath = 1 + Math.sin(t * (Math.PI*2/12) + 0.4) * 0.12;
    const fFreqY = 0.5 + (A.ord % 3) * 0.06;      // each card its own vertical rhythm
    const fFreqZ = 0.34 + (A.ord % 2) * 0.07;
    const ampY = (0.026 + (A.ord % 3) * 0.007) * breath;
    const ampZ = (0.022 + (A.ord % 2) * 0.006) * breath;
    const fx = Math.sin(t*fFreqY + A.phase) * ampY;
    const fz = Math.sin(t*fFreqZ + A.phase*1.3) * ampZ;
    _slot.set(A.col*2.6 + (A.xAdj||0) + fx, A.tier*1.72 + (A.yAdj||0), 0.55 + fz).add(pivot);
    A.grp.position.lerpVectors(pivot, _slot, settle);
    // tiny handcrafted roll (~0.5–1.2°), never mirrored between neighbours
    A.grp.rotation.z = Math.sin(t*fFreqY*0.7 + A.phase) * (0.005 + (A.ord % 3) * 0.0025) * settle;
    if (!A.streamed && lb >= 0.3) { A.streamed = true; try { spawnBurst(A); } catch(e){ window.__berr = 'spawn: '+(e.stack||e.message); } }
    if (A.burst) { try { updateBurst(A, lb-0.3, t); } catch(e){ window.__berr = 'update: '+(e.stack||e.message); A.burst=null; } }
    const sc = lerp(0.14, 1, easeOutQuint(emerge)) * (A.bare ? (A.mul||1)*1.12 : (0.9 + (A.hero?0.15:0)));
    A.grp.scale.setScalar(Math.max(0.001, sc));
    A.grp.lookAt(view.position);
    // static photos: draw once, and redraw until the image has actually loaded — not every frame
    if (!A.drawn) {
      A.draw(A.ctx, A.cw, A.ch, t + A.phase); A.tex.needsUpdate = true;
      const im = cardImgs['card' + (arts.indexOf(A) + 1)];
      A.drawn = !!(im && im.complete && im.naturalWidth);
    }
    // photo materialises as the spark burst gathers into it (no residue)
    const formO = A.formed ? 1 : clamp01((lb - 0.75) / 0.5);
    A.mat.opacity = formO; if (A.grp.children[0]) A.grp.children[0].material.opacity = 0.28*formO;
    A.glow.material.opacity = A === hovered ? 0.55 : (A.hero?0.2:0.12)*formO;
    A.header.material.opacity = A.mat.opacity; A.accent.material.opacity = A.mat.opacity;
    const lift = A === hovered ? 1.12 : 1; A.grp.scale.setScalar(A.grp.scale.x + (sc*lift - A.grp.scale.x)*0.2);
  });

  if (false) {
    ray.setFromCamera(mouse, view);
    const meshes = arts.filter(a=>a.grp.visible).map(a=>a.grp.children[1]);
    const hit = ray.intersectObjects(meshes, false)[0];
    const now = hit ? arts.find(a=>a.grp.children[1]===hit.object) : null;
    if (now !== hovered) { hovered = now; if (now){ tip.style.opacity='1'; tip.innerHTML = '<b>'+now.name+'</b> · born from the lens'; } else tip.style.opacity='0'; }
    if (hovered) { const v = hovered.grp.position.clone().project(view); tip.style.left = ((v.x*0.5+0.5)*innerWidth)+'px'; tip.style.top = ((-v.y*0.5+0.5)*innerHeight)+'px'; }
  }
  tip.style.opacity='0';

  // particles
  // stars/embers2 are never added to the scene (orphaned) — only simulate + re-upload their
  // buffers if they are actually in the graph, so we don't re-upload ~490 points/frame for
  // nothing. Behaviour identical when they ARE parented.
  if (stars.parent) { const sp = stars.geometry.attributes.position.array; for (let i=0;i<sp.length;i+=3){ sp[i]+=0.0004; if(sp[i]>21)sp[i]-=42; } stars.geometry.attributes.position.needsUpdate = true; stars.rotation.y += 0.0002; }
  if (embers2.parent) { const ep = embers2.geometry.attributes.position.array; for (let i=0;i<emberV.length;i++){ ep[i*3]+=emberV[i].sx; ep[i*3+1]+=emberV[i].sy; ep[i*3+2]+=emberV[i].sz; if(ep[i*3+1]>8){ ep[i*3+1]=-8; ep[i*3]=(Math.random()-0.5)*16; } } embers2.geometry.attributes.position.needsUpdate = true; }
  fogSprites.forEach(f=>{ f.s.position.x += Math.sin(t*0.1+f.ph)*0.001; f.s.material.opacity = 0.08 + Math.sin(t*0.3+f.ph)*0.03; });
  updateStreams(dt);
  flare.position.set(0, cam.position.y+0.3, 1.4);
  // warm volumetric rays projecting FORWARD from the lens — headline born from its light
  rays.position.set(cam.position.x, cam.position.y + 0.12, cam.position.z + 1.35);
  rays.material.rotation = t*0.05;
  const rayBreathe = 0.72 + Math.sin(t*0.5)*0.28;
  rays.material.opacity = (0.12 + settle*0.24 + ig*0.16) * rayBreathe * (window.__light?0.4:1);
  rays.scale.setScalar((5.5 + settle*2.2) + Math.sin(t*0.4)*0.5);

  // logo swarm (smooth) forms on capture
  if (logoPts) {
    const cp = 0; // logo-capture swarm disabled in the re-sequenced flow
    if (cp > 0) {
      const dirV = view.position.clone().sub(viewTarget).normalize();
      const front = viewTarget.clone().add(dirV.multiplyScalar(2.5)); front.y += 0.05;
      logoGrp.position.lerp(front, 0.12); logoGrp.scale.setScalar(1.05 + cp*0.35);
      // swarm formation — only while capturing (cp>0). Skipping avoids a full logo
      // position-buffer re-upload every frame for an always opacity-0 (invisible) cloud.
      const lp = logoPts.geometry.attributes.position.array; const k = 0.06 + cp*0.06;
      for (let i = 0; i < logoN; i++) { lp[i*3]=lerp(lp[i*3],logoTargets[i*3],k); lp[i*3+1]=lerp(lp[i*3+1],logoTargets[i*3+1],k); lp[i*3+2]=lerp(lp[i*3+2],logoTargets[i*3+2],k); }
      logoPts.geometry.attributes.position.needsUpdate = true;
      logoPts.material.opacity = Math.min(1, cp*1.4);
      logoGlow.material.opacity = cp*0.55;
      logoGrp.lookAt(view.position); logoGrp.rotation.z = Math.sin(t*0.3)*0.05;
    }
    stars.material.opacity = 0; embers2.material.opacity = 0;
    const cp0 = document.getElementById('copy'); if (cp0) cp0.style.opacity = String(1 - smoothstep(cp));
  }

  // ── re-sequenced reveal: nothing but the camera until you scroll ──
  // cards fade out as you begin scrolling
  // scroll cue: show in part 1 once the cards are out, hide as soon as scrolling starts
  const cueEl = document.getElementById('scrollcue');
  if (cueEl) { const showCue = t > 11 && scrollP < 0.02 && !window.__revealed; cueEl.classList.toggle('in', showCue); }
  // viewfinder HUD: on as soon as the camera is assembled (first scene)
  if (t > 4.4 && !window.__hudOn) { window.__hudOn = true; const hd = document.getElementById('hud'); if (hd) hd.classList.add('in'); }
  const cardK = window.__revealed ? 1 : smoothstep(clamp01((scrollP - 0.03) / 0.1));
  // Layer 1 architecture: fade the room in with the camera, out on scroll
  const archIn = clamp01((t - 3.2) / 1.6);
  const kA = (1 - cardK) * archIn;
  arch.visible = kA > 0.005;
  if (arch.visible) {
    arch.traverse(o => { if (o.isMesh) { o.material.transparent = true; o.material.opacity = (o.material.userData.grooveFade ? 0.35 : 1) * kA; } });
    // branding wall: layered luxury installation — staggered assembly + translucent glass layers
    if (window.__brandMeshes) {
      const bK = clamp01((kA - 0.15) / 0.4);
      brandMeshes.forEach(m => { const target = bK * (m.material.userData.opa ?? 1); m.material.opacity = m.material.emissiveMap ? Math.max(m.material.opacity, target) : target; });
      window.__brandLights.brandKey.intensity = 12 * bK;
      window.__brandLights.brandAccent.intensity = 8 * bK;
      const fx = window.__brandFx, pulse = 0.86 + Math.sin(t * 0.8) * 0.14;
      fx.crystal.position.z = -3.7 + smoothstep(bK) * 0.14;
      fx.tube.material.opacity = bK * (0.85 + Math.sin(t * 0.9) * 0.15);
      fx.edge.material.emissiveIntensity = 1.4 * bK * pulse;
      fx.topLed.material.opacity = bK; 
      fx.glow.material.opacity = bK * 0.22 * pulse;
      fx.halo.material.opacity = bK * 0.3 * pulse;
      fx.shadow.material.opacity = bK * 0.22;
      fx.streak.material.opacity = bK * 0.12 * (0.5 + Math.sin(t * 0.5) * 0.5);
      fx.streak.position.x = Math.sin(t * 0.35) * 2.2;
    }
  }
  // Layer 2 lighting: same fade as the room; lights + diffusers scale with kA
  L2.visible = kA > 0.005;
  if (L2.visible) {
    const breathe = 0.95 + Math.sin(t * (Math.PI*2/12)) * 0.05;   // coordinated ~12s hero breath
    L2lights.forEach(o => { o.light.intensity = o.base * kA * breathe; });
    L2emis.forEach(o => { o.mat.emissiveIntensity = o.base * kA; o.mat.opacity = kA; });
    L2mats.forEach(m => { m.opacity = kA; });
    // rim/top lights breathe on the same cycle for connected light choreography
    camRim.intensity = 30 * breathe; camRim2.intensity = 18 * breathe; camTop.intensity = 26 * breathe;
  }
  // Layer 2.5 architectural depth: fades with the room (kept quiet so it reads as relief, not blocks)
  A25.visible = kA > 0.005;
  if (A25.visible) {
    A25meshes.forEach(m => { m.material.opacity = kA * 0.8; });
    A25coves.forEach(o => { o.light.intensity = o.base * kA; });
  }
  // Layer 3 production realism: eased back so the edges don't compete with the Hero
  L3.visible = kA > 0.005;
  if (L3.visible) { L3meshes.forEach(m => { m.material.opacity = kA * 0.86; }); }
  // Floor stage lights: slow amber sweep crossing behind the camera, fading with the room
  if (window.__stage) {
    stage.visible = kA > 0.005;
    stageRig.visible = kA > 0.005;
    if (stageRig.visible) {
      stageMeshes.forEach(m => { m.material.opacity = kA; });
      stageUnits.forEach(u => {
        const flick = 0.9 + Math.sin(t * 0.8 + u.phase) * 0.1;
        u.cone.material.opacity = 0.11 * kA * flick;
        u.lensMat.emissiveIntensity = 2.6 * kA * flick; u.lensMat.opacity = kA;
        u.glow.material.opacity = 0.85 * kA * flick;
      });
    }
  }
  // Layer D creative ecosystem: curated far-depth boards, each drifting on its own phase
  if (window.__ecoItems) {
    const eco = (1 - cardK) * clamp01((t - 4.2) / 1.8) * 0.82;
    ECO.visible = eco > 0.005;
    if (ECO.visible) ecoItems.forEach(it => {
      it.grp.position.y = it.by + Math.sin(t * it.sp + it.phase) * it.bob;
      it.grp.rotation.z = Math.sin(t * it.sp * 0.7 + it.phase) * 0.02;
      it.grp.rotation.y = it.grp.rotation.y; // keep base yaw; micro parallax below
      it.grp.rotation.x = Math.sin(t * 0.2 + it.phase) * 0.02;
      it.mats[0].opacity = eco; it.mats[1].opacity = eco * 0.9;
    });
  }
  // Layer B creative portal: emerges with the camera, fades out as the portfolio settles/scrolls
  if (window.__portalB) {
    const on = (1 - cardK) * clamp01((t - 4.6) / 1.6);
    const dim = window.__light ? 0.85 : 1;
    // Layer E — signature pulse: one slow warm swell every ~10s, long calm between
    const period = 10.0, pt = (t % period) / period;
    const env = pt < 0.45 ? Math.pow(Math.sin(pt / 0.45 * Math.PI), 2) : 0;
    const cyc = Math.floor(t / period);
    const amp = 0.82 + 0.18 * Math.sin(cyc * 1.7);   // subtle cycle-to-cycle variation (never an obvious loop)
    const pulse = env * amp * on;
    pulseLight.intensity = pulse * (window.__light ? 2.0 : 2.8);
    if (window.__halo) window.__halo.emissiveIntensity = 0.25 + pulse * 0.9;
    portalGlow.material.opacity = (0.22 + Math.sin(t*0.8)*0.05 + pulse * 0.35) * on * dim;
    portalCore.material.opacity = (0.30 + Math.sin(t*1.1+1)*0.06 + pulse * 0.5) * on * dim;
    portalCore.scale.setScalar(0.5 + pulse * 0.25);
    ribbons.forEach((r, i) => {
      r.phase += r.speed * 0.016; if (r.phase > 1) r.phase -= 1;
      const p = r.phase;
      const rad = 0.18 + p * 1.35;                       // outward, toward the portfolio
      const sway = Math.sin(t*0.5 + i*1.3) * 0.12;
      r.mesh.position.set(Math.cos(r.ang)*rad + sway, Math.sin(r.ang)*rad, 0.05 + p*0.55);
      r.mesh.rotation.z = r.ang - Math.PI/2 + Math.sin(t*0.4+i)*0.15;
      const fade = Math.sin(Math.min(1, p) * Math.PI);   // ease in then out over the travel
      r.mesh.material.opacity = fade * 0.2 * on * dim;
      r.mesh.scale.set(0.7 + p*0.5, 0.6 + p*1.0, 1);
    });
  }
  const setIn = clamp01((t - 3.2) / 1.4);
  studio.visible = false;    // Layer 2 props disabled (architecture-only pass)
  if (false && studio.visible) {
    const k = (1 - cardK) * setIn;
    studio.position.y = (1 - easeOutQuint(setIn)) * -0.6;
    softboxGlowMat.emissiveIntensity = 1.5 * k;
    softboxGlowMat.opacity = k; softboxGlowMat.transparent = true;
    rigLightL.intensity = (22 + Math.sin(t*0.8)*6) * k;
    rigLightR.intensity = (22 + Math.sin(t*0.8+1.6)*6) * k;
    studio.traverse(o => { if (o.isMesh && o.material !== softboxGlowMat && !o.material.userData.noFade) { o.material.transparent = true; o.material.opacity = k; } });
    // staged assembly: each piece slides/rises in with a tiny settle
    reveals.forEach(r => { const p = clamp01((t - r.s) / r.dur); if (p <= 0) { r.obj.visible = false; return; } r.obj.visible = true; const e = easeOutBackS(p); r.obj.position.copy(r.obj.userData.base).addScaledVector(r.off, -(1 - e)); });
    // managed glows (fade + activate in order)
    const ledOn = clamp01((t - 9.0) / 0.8) * k;
    ledMat.emissiveIntensity = 2.4 * ledOn; ledMat.opacity = ledOn;
    const ringOn = clamp01((t - 7.2) / 0.7) * k;
    ringGlowMat.emissiveIntensity = 2.6 * ringOn; ringGlowMat.opacity = ringOn;
    const fsOn = clamp01((t - 7.7) / 0.6) * k;
    floorGlowMat.emissiveIntensity = 2.4 * fsOn; floorGlowMat.opacity = fsOn;
    plaqueMat.opacity = clamp01((t - 9.2) / 0.8) * k;
    bgTitle.material.opacity = clamp01((t - 9.2) / 1.0) * k;
    bgSub.material.opacity = clamp01((t - 9.8) / 0.9) * k;
    refl.rotation.y = 0.25;
    keySpot.intensity = 50 * k;
    fillSpot.intensity = 30 * k;
    goldBounce.intensity = 14 * k;
    tubeMat.emissiveIntensity = 2.0 * k;
  }
  if (cardK > 0) arts.forEach(A => { A.mat.opacity = 1-cardK; A.frameMat.opacity = 1-cardK; if (A.backMat) A.backMat.opacity = (1-cardK)*0.9; A.header.material.opacity = 1-cardK; A.accent.material.opacity = 1-cardK; if (cardK >= 0.99) A.grp.visible = false; });
  // once cards are gone, spin the camera (3D flourish) then reveal navbar + text
  if (!window.__revealed && scrollP > 0.14) {
    window.__revealed = true; revealT = t;
  }
  if (revealT >= 0 && !window.__textShown && (t - revealT) > 0.85) {
    window.__textShown = true;
    ['head','sub','ctas'].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('in'); });
  }

  // smooth capture (headline reveal handled above; camera stays as-is)
  if (!captured && scrollP > 0.14) { captured = true; }

  // smooth parallax camera + dolly
  mx += (tmx - mx) * 0.07; my += (tmy - my) * 0.07;
  const dolly = 0;
  const camDist = 6.4;
  view.position.x = Math.cos(-0.15 + mx*0.9) * camDist * 0.42 + 2.7;
  view.position.z = camDist - Math.abs(mx)*0.4;
  view.position.y = 1.8 + my*0.28;
  view.lookAt(viewTarget.x - mx*0.3, viewTarget.y + my*0.14, viewTarget.z);

  renderer.render(scene, view);
  window.__T = T;
}
function tick(){ if(!__running) return; if(!(document.hidden || window.__heroPaused)){ try{ stepFrame(); }catch(e){ if(!window.__err) window.__err=(e&&e.message)||String(e); } } __raf1 = requestAnimationFrame(tick); }
window.__seekRender = (tt, n) => { T = tt; for(let i=0;i<(n||1);i++){ try{ stepFrame(); }catch(e){ window.__err=(e&&e.message)||String(e); } } };
// Return visit (window.__heroSkipIntro, set by LandingScene when the intro already played
// this session): open directly on the finished hero — timeline settled, cards gone, camera
// behind the headline, warm rays lit — instead of replaying the cinematic. Seeding these to
// their settled values makes the very FIRST painted frame the end state; T then ticks on
// from here for ambient life. revealT is set 3s in the past so the reveal flourish reads as
// fully settled (settle=1) on frame one.
if (!reduce && window.__heroSkipIntro) {
  T = 12; revealT = 9; window.__revealed = true; window.__hudOn = true;
  const _hud = document.getElementById('hud'); if (_hud) _hud.classList.add('in');
}
// PRE-WARM the GPU before the first visible frame. The camera parts are glossy
// MeshPhysicalMaterials (clearcoat + env-map + normal maps) whose shaders otherwise compile
// LAZILY the moment each part first appears — mid-assembly — stalling frames and making the
// timeline jump (choppy formation). renderer.compile() compiles every material + uploads its
// textures now, synchronously, while the preloader cover is still up (initHeroScene blocks
// here, so the cover simply holds a few ms longer). The assembly then plays on a warm GPU.
try { if (renderer.compile) renderer.compile(scene, view); } catch (_e) {}
tick();

addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); view.aspect = innerWidth/innerHeight; view.updateProjectionMatrix(); }, { signal: __sig });

// AR/EN language + copy are owned by the production app: next-intl renders #head/
// #sub/#ctas per locale (RTL via <html dir>). The scene only reveals them.

window.__seek = (v) => { T = v; };
window.__scroll = (v) => { scrollTarget = v; scrollP = v; };

// ══ LIGHT / DARK theme toggle ══
// warm studio background texture for light mode (mesh-gradient blobs + dot grid)
function makeBgLight(){
  const c=document.createElement('canvas'); c.width=1280; c.height=800; const x=c.getContext('2d');
  // studio cyclorama sweep: toned top wall, bright mid, grounded floor
  const g=x.createLinearGradient(0,0,0,800);
  g.addColorStop(0,'#e0d8c8'); g.addColorStop(0.46,'#f1ebdf'); g.addColorStop(0.72,'#f7f2e9'); g.addColorStop(1,'#d8ccb7');
  x.fillStyle=g; x.fillRect(0,0,1280,800);
  // broad studio wall light pools (soft key spill on the backdrop)
  const pool=(cx,cy,rw,rh,col)=>{ x.save(); x.translate(cx,cy); x.scale(rw,rh); const rg=x.createRadialGradient(0,0,0,0,0,1); rg.addColorStop(0,col); rg.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=rg; x.beginPath(); x.arc(0,0,1,0,7); x.fill(); x.restore(); };
  pool(300,340,260,520,'rgba(255,238,214,0.5)');
  pool(1000,320,250,520,'rgba(220,232,255,0.34)');
  // colored studio gels
  const blob=(cx,cy,r,col)=>{ const rg=x.createRadialGradient(cx,cy,0,cx,cy,r); rg.addColorStop(0,col); rg.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=rg; x.fillRect(0,0,1280,800); };
  blob(250,150,470,'rgba(234,150,90,0.26)');
  blob(1050,120,430,'rgba(120,150,220,0.20)');   // cool gel top-right for colour contrast
  blob(860,660,470,'rgba(187,207,179,0.20)');
  blob(400,720,400,'rgba(255,122,69,0.16)');
  // studio floor bounce
  const fl=x.createRadialGradient(640,770,20,640,770,640); fl.addColorStop(0,'rgba(255,252,245,0.5)'); fl.addColorStop(1,'rgba(255,252,245,0)'); x.fillStyle=fl; x.fillRect(0,520,1280,280);
  // horizon seam where wall meets floor
  const hz=x.createLinearGradient(0,560,0,604); hz.addColorStop(0,'rgba(110,86,54,0)'); hz.addColorStop(0.5,'rgba(110,86,54,0.12)'); hz.addColorStop(1,'rgba(110,86,54,0)'); x.fillStyle=hz; x.fillRect(0,560,1280,44);
  // subtle guide lines only
  x.strokeStyle='rgba(55,40,26,0.05)'; x.lineWidth=1;
  for(let xx=0;xx<1280;xx+=160){ x.beginPath(); x.moveTo(xx,0); x.lineTo(xx,800); x.stroke(); }
  // soft rounded architecture: warm corner arcs (hidden-LED feel, reference grade)
  x.lineWidth=30; x.lineCap='round';
  const arc=(cx,cy,r,a0,a1,al)=>{ const gr=x.createRadialGradient(cx,cy,r-46,cx,cy,r+46); gr.addColorStop(0,'rgba(255,214,150,0)'); gr.addColorStop(0.5,'rgba(255,214,150,'+al+')'); gr.addColorStop(1,'rgba(255,214,150,0)'); x.strokeStyle=gr; x.beginPath(); x.arc(cx,cy,r,a0,a1); x.stroke(); };
  arc(150,150,190,Math.PI,Math.PI*1.5,0.5); arc(1130,150,190,Math.PI*1.5,Math.PI*2,0.5);
  arc(150,650,190,Math.PI*0.5,Math.PI,0.28); arc(1130,650,190,0,Math.PI*0.5,0.28);
  // long warm ceiling LED bar
  const cb=x.createLinearGradient(0,26,0,58); cb.addColorStop(0,'rgba(255,205,130,0)'); cb.addColorStop(0.5,'rgba(255,205,130,0.75)'); cb.addColorStop(1,'rgba(255,205,130,0)');
  x.fillStyle=cb; x.fillRect(300,26,680,32);
  const cbGlow=x.createRadialGradient(640,44,10,640,44,420); cbGlow.addColorStop(0,'rgba(255,214,150,0.34)'); cbGlow.addColorStop(1,'rgba(255,214,150,0)');
  x.fillStyle=cbGlow; x.fillRect(180,0,920,240);
  // vignette — depth + global contrast
  const vg=x.createRadialGradient(640,360,220,640,420,820); vg.addColorStop(0,'rgba(30,20,10,0)'); vg.addColorStop(0.7,'rgba(30,20,10,0.14)'); vg.addColorStop(1,'rgba(30,20,10,0.5)'); x.fillStyle=vg; x.fillRect(0,0,1280,800);
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}
window.__setTheme = (light) => {
  if (light) {
    window.__light = true;
    scene.background = (window.__bgLight || (window.__bgLight = makeBgLight())); scene.fog.color.set(0xf3ecdf); scene.fog.density = 0.0052;
    hemi.intensity = 1.16; hemi.color.set(0xffefda); amb.intensity = 0.34; renderer.toneMappingExposure = 0.95;
    stars.material.opacity = 0; embers2.material.opacity = 0;
  } else {
    window.__light = false;
    scene.background = null; scene.fog.color.set(0x070609); scene.fog.density = 0.018;
    hemi.intensity = 0.9; hemi.color.set(0x3a352c); amb.intensity = 0.22; renderer.toneMappingExposure = 1.04;
    stars.material.opacity = 0; embers2.material.opacity = 0;
  }
};
// Theme is owned by the production app (data-theme on <html> via ThemeToggle). Sync
// the 3D scene's lighting/background to it, and follow live toggles.
{
  const readLight = () => document.documentElement.getAttribute('data-theme') === 'light';
  window.__setTheme(readLight());
  __themeObs = new MutationObserver(() => window.__setTheme(readLight()));
  __themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

// ══ JOY LAYER — colorful cursor spark-trail + click-burst of creative particles ══
(function sparkles(){
  const cv = document.getElementById('sparkles'); if (!cv) return;
  const x = cv.getContext('2d'); let W, H, dpr = Math.min(devicePixelRatio||1, 2);
  const fit = () => { W = cv.width = innerWidth*dpr; H = cv.height = innerHeight*dpr; x.setTransform(dpr,0,0,dpr,0,0); };
  fit(); addEventListener('resize', fit, { signal: __sig });
  const COLORS = ['#ff7a45','#eac46b','#bbcfb3','#f6b48c','#f5f7f9','#cf5138'];
  const REACTIONS = ['heart','comment','youtube','facebook','instagram','tiktok','whatsapp','linkedin'];
  function rr(px,py,w,h,r){ x.beginPath(); x.moveTo(px-w/2+r,py-h/2); x.arcTo(px+w/2,py-h/2,px+w/2,py+h/2,r); x.arcTo(px+w/2,py+h/2,px-w/2,py+h/2,r); x.arcTo(px-w/2,py+h/2,px-w/2,py-h/2,r); x.arcTo(px-w/2,py-h/2,px+w/2,py-h/2,r); x.fill(); }
  function youtube(px,py,s){ x.fillStyle='#FF0000'; rr(px,py,s*2.2,s*1.5,s*0.45); x.fillStyle='#fff'; x.beginPath(); x.moveTo(px-s*0.3,py-s*0.4); x.lineTo(px-s*0.3,py+s*0.4); x.lineTo(px+s*0.45,py); x.fill(); }
  function facebook(px,py,s){ x.fillStyle='#1877F2'; rr(px,py,s*2,s*2,s*0.5); x.fillStyle='#fff'; x.font='800 '+(s*1.7)+'px Georgia, serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillText('f',px,py+s*0.05); x.textAlign='left'; }
  function instagram(px,py,s){ x.fillStyle='#E1306C'; rr(px,py,s*2,s*2,s*0.6); x.strokeStyle='#fff'; x.lineWidth=s*0.22; x.beginPath(); x.arc(px,py,s*0.55,0,7); x.stroke(); x.fillStyle='#fff'; x.beginPath(); x.arc(px+s*0.55,py-s*0.55,s*0.16,0,7); x.fill(); }
  function tiktok(px,py,s){ x.fillStyle='#000'; rr(px,py,s*2,s*2,s*0.5); x.fillStyle='#25F4EE'; x.font='800 '+(s*1.6)+'px Arial'; x.textAlign='center'; x.textBaseline='middle'; x.fillText('\u266A',px-s*0.08,py); x.fillStyle='#FE2C55'; x.fillText('\u266A',px+s*0.08,py); x.fillStyle='#fff'; x.fillText('\u266A',px,py); x.textAlign='left'; }
  function whatsapp(px,py,s){ x.fillStyle='#25D366'; x.beginPath(); x.arc(px,py,s,0,7); x.fill(); x.fillStyle='#fff'; x.beginPath(); x.arc(px,py,s*0.5,Math.PI*0.15,Math.PI*1.15); x.lineWidth=s*0.3; x.strokeStyle='#fff'; x.stroke(); x.beginPath(); x.arc(px+s*0.3,py+s*0.3,s*0.16,0,7); x.fill(); }
  function linkedin(px,py,s){ x.fillStyle='#0A66C2'; rr(px,py,s*2,s*2,s*0.4); x.fillStyle='#fff'; x.font='800 '+(s*1.0)+'px Arial'; x.textAlign='center'; x.textBaseline='middle'; x.fillText('in',px,py+s*0.05); x.textAlign='left'; }
  function heart(px,py,s){ x.beginPath(); x.moveTo(px,py+s*0.35); x.bezierCurveTo(px-s,py-s*0.5,px-s*0.5,py-s,px,py-s*0.35); x.bezierCurveTo(px+s*0.5,py-s,px+s,py-s*0.5,px,py+s*0.35); x.fill(); }
  function comment(px,py,s){ x.beginPath(); const r=s*0.4; x.moveTo(px-s+r,py-s*0.7); x.arcTo(px+s,py-s*0.7,px+s,py+s*0.5,r); x.arcTo(px+s,py+s*0.5,px-s,py+s*0.5,r); x.lineTo(px-s*0.3,py+s*0.5); x.lineTo(px-s*0.6,py+s); x.lineTo(px-s*0.6,py+s*0.5); x.arcTo(px-s,py+s*0.5,px-s,py-s*0.7,r); x.arcTo(px-s,py-s*0.7,px+s,py-s*0.7,r); x.fill(); }
  function messenger(px,py,s){ x.fillStyle='#0084FF'; x.beginPath(); x.arc(px,py,s,0,7); x.fill(); x.fillStyle='#fff'; x.beginPath(); x.moveTo(px-s*0.5,py+s*0.05); x.lineTo(px-s*0.05,py-s*0.2); x.lineTo(px+s*0.2,py+s*0.05); x.lineTo(px+s*0.55,py-s*0.2); x.lineTo(px+s*0.05,py+s*0.25); x.lineTo(px-s*0.2,py+s*0.02); x.closePath(); x.fill(); }
  function threads(px,py,s){ x.fillStyle='#000'; rr(px,py,s*2,s*2,s*0.55); x.fillStyle='#fff'; x.font='800 '+(s*1.5)+'px Georgia, serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillText('@',px,py+s*0.05); x.textAlign='left'; }
  function xcom(px,py,s){ x.fillStyle='#000'; rr(px,py,s*2,s*2,s*0.5); x.fillStyle='#fff'; x.font='800 '+(s*1.4)+'px Arial'; x.textAlign='center'; x.textBaseline='middle'; x.fillText('X',px,py+s*0.05); x.textAlign='left'; }
  function snapchat(px,py,s){ x.fillStyle='#FFFC00'; rr(px,py,s*2,s*2,s*0.5); x.fillStyle='#fff'; x.beginPath(); x.arc(px,py-s*0.1,s*0.55,Math.PI,0); x.lineTo(px+s*0.55,py+s*0.35); for(let i=0;i<=6;i++){ const xx=px+s*0.55-i*(s*1.1/6); x.lineTo(xx, py+s*0.35+(i%2?-s*0.12:s*0.12)); } x.closePath(); x.fill(); }
  function share(px,py,s){ x.fillStyle='#1877F2'; x.beginPath(); x.arc(px,py,s,0,7); x.fill(); x.strokeStyle='#fff'; x.lineWidth=s*0.16; x.lineJoin='round'; x.beginPath(); x.arc(px-s*0.05,py+s*0.15,s*0.5,-Math.PI*0.15,Math.PI*0.9); x.stroke(); x.fillStyle='#fff'; x.beginPath(); x.moveTo(px+s*0.55,py-s*0.55); x.lineTo(px+s*0.1,py-s*0.35); x.lineTo(px+s*0.4,py-s*0.02); x.closePath(); x.fill(); }
  function like(px,py,s){ x.fillStyle='#1877F2'; x.beginPath(); x.arc(px,py,s,0,7); x.fill(); x.fillStyle='#fff'; x.fillRect(px-s*0.55,py-s*0.05,s*0.28,s*0.6); rr(px+s*0.12,py+s*0.08,s*0.72,s*0.5,s*0.14); x.beginPath(); x.moveTo(px-s*0.1,py-s*0.05); x.lineTo(px+s*0.05,py-s*0.55); x.lineTo(px+s*0.28,py-s*0.4); x.lineTo(px+s*0.18,py-s*0.05); x.closePath(); x.fill(); }
  function love(px,py,s){ x.fillStyle='#F33E58'; x.beginPath(); x.arc(px,py,s,0,7); x.fill(); x.fillStyle='#fff'; heart(px,py,s*0.72); }
  function wow(px,py,s){ x.fillStyle='#F7B928'; x.beginPath(); x.arc(px,py,s,0,7); x.fill(); x.fillStyle='#5a3b00'; x.beginPath(); x.ellipse(px-s*0.32,py-s*0.15,s*0.13,s*0.22,0,0,7); x.ellipse(px+s*0.32,py-s*0.15,s*0.13,s*0.22,0,0,7); x.fill(); x.beginPath(); x.ellipse(px,py+s*0.38,s*0.22,s*0.3,0,0,7); x.fill(); }
  const ps = []; const rings = [];
  // branded reaction icons that drift in the background
  const ICONS = ['facebook','whatsapp','messenger','instagram','linkedin','threads','xcom','snapchat','tiktok','youtube','like','love','wow','comment','share','love','comment','love','comment'];
  const ICONDRAW = {youtube,facebook,instagram,tiktok,whatsapp,linkedin,messenger,threads,xcom,snapchat,share,like,love,wow,comment,heart};
  let iconIdx = 0, iconsSeeded = false;
  let sideFlip = false;
  function sideX(){ sideFlip = !sideFlip; const band = sideFlip ? [0.05,0.24] : [0.72,0.95]; return (band[0]+Math.random()*(band[1]-band[0]))*innerWidth; }
  function spawnIcon(){
    const shape = ICONS[Math.random()*ICONS.length|0];
    // spawn anywhere along the side margins (not only from the bottom); always drift UP,
    // fading out before nearing the navbar so no text is ever blocked
    const y = innerHeight*0.28 + Math.random()*(innerHeight*0.66);
    const p = { x:sideX(), y, vx:0, vy:-(0.14+Math.random()*0.1), r:4.2, c:'#fff', shape, rot:0, vr:0, icon:true, age:0, dur:340, fin:28, fout:44 };
    // right side gets a slight density boost via an extra nudge outward
    ps.push(p);
  }
  function spawn(px, py, n, power) {
    for (let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, sp=(Math.random()*power+0.4);
      const shape = REACTIONS[Math.random()*REACTIONS.length|0];
      ps.push({ x:px, y:py, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp - 0.3, life:1, r:Math.random()*3+1.4, c:COLORS[Math.random()*COLORS.length|0], shape, rot:Math.random()*7, vr:(Math.random()-0.5)*0.4, len:Math.random()*14+8 }); }
  }
  let lx=0, ly=0, moved=false;
  addEventListener('mousemove', e => { lx=e.clientX; ly=e.clientY; moved=true; }, { signal: __sig });
  addEventListener('pointerdown', e => {
    if (!window.__revealed) return;
    window.__mEnergy = 1;
    const fl = document.getElementById('flash'); if (fl) fl.animate([{opacity:0},{opacity:0.32,offset:0.2},{opacity:0}], {duration:520, easing:'ease-out'});
  }, { signal: __sig });
  let amb = 0;
  function star(px,py,r,rot){ x.beginPath(); for(let i=0;i<10;i++){ const rr=i%2?r:r*0.45, a=rot+i*Math.PI/5; const sx=px+Math.cos(a)*rr, sy=py+Math.sin(a)*rr; i?x.lineTo(sx,sy):x.moveTo(sx,sy);} x.closePath(); x.fill(); }
  function loop(){
    if(!__running) return;
    // Skip the whole sparkle pass (clear + sim + draw) while the layer is hidden past the
    // hero or the tab is backgrounded — but keep the rAF alive so scroll-back-up resumes
    // on the very next frame. Same output: nothing is on screen in either state.
    if(document.hidden || window.__heroPaused){ __raf2 = requestAnimationFrame(loop); return; }
    x.clearRect(0,0,W,H);
    // branded reaction icons: fade in, hold ~5s, fade out in place — then a new one elsewhere
    if (window.__textShown && !iconsSeeded) { iconsSeeded = true; for(let i=0;i<22;i++){ spawnIcon(); ps[ps.length-1].age = i*14; } }
    const iconCount = ps.reduce((a,p)=>a+(p.icon?1:0),0);
    if (window.__textShown && iconCount < 22 && (amb=(amb+1)%6)===0) spawnIcon();
    // shockwave rings
    for (let i=rings.length-1;i>=0;i--){ const rg=rings[i]; rg.r+=9; rg.life-=0.03; if(rg.life<=0){rings.splice(i,1);continue;} x.globalAlpha=rg.life*0.6; x.strokeStyle=rg.c; x.lineWidth=2.5; x.shadowColor=rg.c; x.shadowBlur=12; x.beginPath(); x.arc(rg.x,rg.y,rg.r,0,7); x.stroke(); }
    for (let i=ps.length-1;i>=0;i--){ const p=ps[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=(p.amb||p.icon)?0:0.045; p.vx*=(p.amb||p.icon)?0.999:0.98; p.vy*=(p.amb||p.icon)?1:0.985; p.rot+=p.vr;
      if (p.icon){ p.age++; const navLimit = innerHeight*0.22; if(p.age>p.dur || p.y < navLimit){ ps.splice(i,1); continue; }
        // fade out completely whenever the icon sits over the headline / sub / CTA rects
        let textFade = 1;
        if (!window.__textRects || (window.__frame|0)%30===0) { window.__textRects = ['head','sub','ctas'].map(id=>{ const el=document.getElementById(id); if(!el) return null; const r=el.getBoundingClientRect(); return r.width?{l:r.left-48,r:r.right+48,t:r.top-40,b:r.bottom+40}:null; }).filter(Boolean); }
        for (const r of (window.__textRects||[])) if (p.x>r.l && p.x<r.r && p.y>r.t && p.y<r.b) { textFade = 0; break; }
        const nearNav = clamp01((p.y - navLimit) / (innerHeight*0.08)); const a = (p.age<p.fin ? p.age/p.fin : (p.age>p.dur-p.fout ? (p.dur-p.age)/p.fout : 1)) * nearNav;
        p.tf = textFade===0 ? 0 : (p.tf==null ? textFade : p.tf + (textFade - p.tf)*0.12);
        x.globalAlpha=Math.max(0,a*p.tf)*0.95; x.shadowBlur=3; x.shadowColor='rgba(80,60,40,0.22)'; const S=(p.r+2)*2.0; if(x.globalAlpha>0.02)(ICONDRAW[p.shape]||comment)(p.x,p.y,S*0.7); continue; }
      if (p.amb){ if(p.y<-20)p.y=innerHeight+20; if(p.x<-20)p.x=innerWidth+20; if(p.x>innerWidth+20)p.x=-20; }
      p.life-=p.amb?0.0035:0.016;
      if (p.life<=0){ ps.splice(i,1); continue; }
      x.globalAlpha = Math.max(0,p.life); x.fillStyle = p.c; x.shadowColor = p.c; x.shadowBlur = 8;
      const S=(p.r+2)*2.0;
      const L={youtube,facebook,instagram,tiktok,whatsapp,linkedin};
      if (L[p.shape]) { x.shadowBlur=6; x.shadowColor='rgba(0,0,0,0.4)'; L[p.shape](p.x,p.y,S*0.7); }
      else if (p.shape==='heart') heart(p.x,p.y,S);
      else if (p.shape==='comment') comment(p.x,p.y,S);
      else { x.beginPath(); x.arc(p.x,p.y,S*0.4,0,7); x.fill(); }
    }
    x.globalAlpha=1; x.shadowBlur=0;
    __raf2 = requestAnimationFrame(loop);
  }
  __raf2 = requestAnimationFrame(loop);
})();

  // ── Teardown (React unmount): stop loops, drop listeners + observer, free GL. ──
  function __destroy() {
    __running = false;
    cancelAnimationFrame(__raf1);
    cancelAnimationFrame(__raf2);
    try { __ac.abort(); } catch (_e) {}
    try { if (__themeObs) __themeObs.disconnect(); } catch (_e) {}
    // Free the GPU + JS graph. renderer.dispose() alone frees NEITHER the geometries/
    // materials/textures NOR the PMREM target — without this the whole studio (tens of MB
    // of VRAM) leaks on every teardown/re-init. Runs only after the last painted frame.
    const __disposeMat = (m) => { if(!m) return; for (const k in m){ const v = m[k]; if (v && v.isTexture) { try { v.dispose(); } catch (_e) {} } } try { m.dispose(); } catch (_e) {} };
    const __disposeTree = (o) => { try { o && o.traverse((n) => { if (n.geometry) { try { n.geometry.dispose(); } catch (_e) {} } const mm = n.material; if (Array.isArray(mm)) mm.forEach(__disposeMat); else if (mm) __disposeMat(mm); }); } catch (_e) {} };
    try { __disposeTree(scene); } catch (_e) {}
    try { __disposeTree(studio); } catch (_e) {}
    try { if (scene.environment && scene.environment.dispose) scene.environment.dispose(); } catch (_e) {}
    try { stars.geometry.dispose(); __disposeMat(stars.material); } catch (_e) {}
    try { embers2.geometry.dispose(); __disposeMat(embers2.material); } catch (_e) {}
    try { pmrem.dispose(); } catch (_e) {}
    try { renderer.dispose(); } catch (_e) {}
    try { renderer.forceContextLoss(); } catch (_e) {}
    try {
      const el = renderer.domElement;
      if (el && el.parentNode) el.parentNode.removeChild(el);
    } catch (_e) {}
    // Drop scene-owned globals that pin the graph — the function refs close over the whole
    // closure (renderer/scene), so they must go too or nothing above can be GC'd.
    ['__revealed','__textShown','__hudOn','__light','__mEnergy','__frame','__textRects','__T','__err','__pmx','__pmy','__camAimX','__camAimY','__iris','__halo','__brandMeshes','__brandLights','__brandFx','__seek','__scroll','__seekRender','__setTheme'].forEach((k) => { try { delete window[k]; } catch (_e) {} });
  }
  return __destroy;
}
