import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ZODIAC, sunLongitude, signIndexForLongitude } from './constellations.js';
import { makeEarthTexture, makeGlowTexture, makeStarGlowTexture, makeDotTexture, makeTextSprite } from './textures.js';

const RING = 110;      // radio del cinturón zodiacal
const ORBIT = 30;      // radio de la órbita terrestre
const SUN_R = 9;
const FIG_SCALE = 6.5; // escala de las figuras de constelación
const DEG = Math.PI / 180;

function starField() {
  const n = 1800;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(380 + Math.random() * 200);
    pos.set([v.x, v.y, v.z], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return g;
}

function circlePoints(r) {
  const pts = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }
  return pts;
}

function Sun() {
  const glow = useMemo(() => makeGlowTexture(), []);
  const glow2 = useMemo(
    () => makeGlowTexture('rgba(255,240,200,0.9)', 'rgba(255,180,60,0)'),
    []
  );
  return (
    <group>
      <mesh>
        <sphereGeometry args={[SUN_R, 48, 48]} />
        <meshBasicMaterial color="#ffdf6b" />
      </mesh>
      <sprite scale={[55, 55, 1]}>
        <spriteMaterial map={glow} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite scale={[26, 26, 1]}>
        <spriteMaterial map={glow2} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <pointLight intensity={900} distance={0} decay={2} color="#fff3d0" />
    </group>
  );
}

function Earth({ day }) {
  const ref = useRef();
  const tex = useMemo(() => makeEarthTexture(), []);
  const lambda = (sunLongitude(day) + 180) * DEG; // Tierra opuesta al signo visible
  const x = Math.cos(lambda) * ORBIT;
  const z = Math.sin(lambda) * ORBIT;
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6;
  });
  return (
    <mesh ref={ref} position={[x, 0, z]}>
      <sphereGeometry args={[2.6, 32, 32]} />
      <meshStandardMaterial map={tex} roughness={0.9} metalness={0} />
    </mesh>
  );
}

function SightArrow({ day }) {
  const shaft = useRef();
  const head = useRef();
  const lambda = (sunLongitude(day) + 180) * DEG;
  const earthPos = new THREE.Vector3(Math.cos(lambda) * ORBIT, 0, Math.sin(lambda) * ORBIT);
  const dir = earthPos.clone().negate().normalize(); // Tierra → Sol → anillo
  const headLen = 7;
  const end = earthPos.clone().addScaledVector(dir, ORBIT + RING - 6);
  const shaftStart = earthPos.clone().addScaledVector(dir, 3);
  const shaftLen = end.clone().sub(shaftStart).length() - headLen;
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

  useFrame(() => {
    if (shaft.current) {
      shaft.current.position.copy(shaftStart).addScaledVector(dir, shaftLen / 2);
      shaft.current.quaternion.copy(quat);
      shaft.current.scale.y = shaftLen;
    }
    if (head.current) {
      head.current.position.copy(end).addScaledVector(dir, -headLen / 2);
      head.current.quaternion.copy(quat);
    }
  });

  return (
    <group>
      <mesh ref={shaft} position={shaftStart.clone().addScaledVector(dir, shaftLen / 2)} quaternion={quat} scale={[1, shaftLen, 1]}>
        <cylinderGeometry args={[0.35, 0.35, 1, 10, 1, true]} />
        <meshBasicMaterial color="#d23bd2" />
      </mesh>
      <mesh ref={head} position={end.clone().addScaledVector(dir, -headLen / 2)} quaternion={quat}>
        <coneGeometry args={[1.6, headLen, 14]} />
        <meshBasicMaterial color="#ff5cf0" />
      </mesh>
    </group>
  );
}

// Tamaño aparente según magnitud: estrellas brillantes, medias y tenues
const MAG_BUCKETS = [
  { max: 2.5, size: 2.6 },
  { max: 3.8, size: 1.8 },
  { max: Infinity, size: 1.2 },
];

const STAR_LABEL_H = 0.3;     // alto de la leyenda en unidades locales de la figura
const STAR_LABEL_MIN_PX = 20; // alto mínimo en pantalla para que se lea de lejos
const STAR_LABEL_MAX_H = 1.35; // tope para que, al alejar la cámara, no se encimen
const _labelPos = new THREE.Vector3();
const _labelScale = new THREE.Vector3();

function FeaturedStar({ star, position, active }) {
  const glow = useMemo(() => makeStarGlowTexture(star.color), [star.color]);
  const label = useMemo(() => makeTextSprite(star.name, { color: star.color, italic: false }), [star]);
  const labelRef = useRef();
  useFrame(({ camera, size }) => {
    const sp = labelRef.current;
    if (!sp?.parent) return;
    sp.getWorldPosition(_labelPos);
    const parentScale = sp.parent.getWorldScale(_labelScale).y;
    const viewH = 2 * Math.tan((camera.fov * DEG) / 2) * _labelPos.distanceTo(camera.position);
    const minH = (STAR_LABEL_MIN_PX / size.height) * viewH / parentScale;
    const h = THREE.MathUtils.clamp(minH, STAR_LABEL_H, STAR_LABEL_MAX_H);
    sp.scale.set(h * label.aspect, h, 1);
  });
  const s = active ? 0.62 : 0.5;
  const left = star.label === 'left';
  return (
    <group position={position}>
      <sprite scale={[s, s, 1]}>
        <spriteMaterial map={glow} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite
        ref={labelRef}
        position={[left ? -0.14 : 0.14, 0, 0.02]}
        center={[left ? 1 : 0, 0.5]}
        scale={[STAR_LABEL_H * label.aspect, STAR_LABEL_H, 1]}
      >
        <spriteMaterial map={label.tex} transparent depthWrite={false} />
      </sprite>
    </group>
  );
}

function ConstellationFigure({ c, index, active, showLabels }) {
  const angle = (index * 30 + 15) * DEG;
  const x = Math.cos(angle) * RING;
  const z = Math.sin(angle) * RING;

  const { lineGeo, pointGeos } = useMemo(() => {
    const linePts = [];
    for (const [a, b] of c.lines) {
      linePts.push(...c.stars[a], 0, ...c.stars[b], 0);
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
    const featured = new Set(c.featured.map(f => f.index));
    const pgs = MAG_BUCKETS.map(({ max, size }, b) => {
      const min = b === 0 ? -Infinity : MAG_BUCKETS[b - 1].max;
      const pos = c.stars.flatMap(([sx, sy], i) =>
        !featured.has(i) && c.mags[i] > min && c.mags[i] <= max ? [sx, sy, 0] : []
      );
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      return { geo: g, size };
    });
    return { lineGeo: lg, pointGeos: pgs };
  }, [c]);

  const dot = useMemo(() => makeDotTexture(), []);
  const top = useMemo(() => Math.max(...c.stars.map(([, sy]) => sy)), [c]);
  const titles = useMemo(
    () => ({
      idle: makeTextSprite(c.name, { color: '#a9a9e0', italic: false }),
      active: makeTextSprite(c.name, { color: '#ff8ef2', italic: false }),
    }),
    [c.name]
  );
  const group = useRef();
  const title = useRef();
  useFrame(() => {
    if (!group.current) return;
    const target = active ? FIG_SCALE * 1.4 : FIG_SCALE;
    const s = THREE.MathUtils.lerp(group.current.scale.x, target, 0.12);
    group.current.scale.setScalar(s);
    if (title.current) title.current.position.y = top * s + 2.2;
  });

  const titleTex = active ? titles.active : titles.idle;
  const titleH = active ? 4.8 : 3.8;

  const lineColor = active ? '#ff5cf0' : '#7f7fd4';
  const starColor = active ? '#ffffff' : '#c9c9ff';

  return (
    <>
      <Billboard position={[x, 0, z]}>
        <group ref={group} scale={[FIG_SCALE, FIG_SCALE, FIG_SCALE]}>
          <lineSegments geometry={lineGeo}>
            <lineBasicMaterial color={lineColor} transparent opacity={active ? 1 : 0.65} />
          </lineSegments>
          {pointGeos.map(({ geo, size }) => (
            <points key={size} geometry={geo}>
              <pointsMaterial
                color={starColor}
                size={active ? size * 1.25 : size}
                map={dot}
                transparent
                alphaTest={0.1}
                depthWrite={false}
                sizeAttenuation
              />
            </points>
          ))}
          {c.featured.map(f => (
            <FeaturedStar key={f.star} star={f} position={[...c.stars[f.index], 0.01]} active={active} />
          ))}
        </group>
        <group ref={title} position={[0, top * FIG_SCALE + 2.2, 0]}>
          {showLabels && (
            <sprite center={[0.5, 0]} scale={[titleH * titleTex.aspect, titleH, 1]}>
              <spriteMaterial map={titleTex.tex} transparent depthWrite={false} />
            </sprite>
          )}
        </group>
      </Billboard>
    </>
  );
}

function EclipticBand() {
  const inner = useMemo(() => circlePoints(RING - 15), []);
  const outer = useMemo(() => circlePoints(RING + 15), []);
  const orbit = useMemo(() => circlePoints(ORBIT), []);
  return (
    <group>
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(inner.flatMap(p => [p.x, p.y, p.z])), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3d6fd8" transparent opacity={0.55} />
      </lineLoop>
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(outer.flatMap(p => [p.x, p.y, p.z])), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3d6fd8" transparent opacity={0.55} />
      </lineLoop>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[RING - 15, RING + 15, 128]} />
        <meshBasicMaterial color="#1a2b66" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(orbit.flatMap(p => [p.x, p.y, p.z])), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#8e8ee0" transparent opacity={0.8} />
      </lineLoop>
    </group>
  );
}

function EclipticLabel() {
  const { tex, aspect } = useMemo(() => makeTextSprite('Eclíptica'), []);
  const h = 7;
  return (
    <sprite position={[-72, -8, -24]} scale={[h * aspect, h, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  );
}

function Animator({ playing, speed, setDay }) {
  useFrame((_, dt) => {
    if (playing) setDay(d => ((d - 1 + dt * speed) % 365) + 1);
  });
  return null;
}

export default function Scene({ day, playing, speed, setDay, showLabels }) {
  const activeIdx = signIndexForLongitude(sunLongitude(day));
  const bg = useMemo(() => starField(), []);

  return (
    <Canvas camera={{ position: [0, 90, 230], fov: 50, near: 0.1, far: 2000 }} style={{ background: '#050510' }}>
      <ambientLight intensity={0.25} />
      <points geometry={bg}>
        <pointsMaterial color="#9db2e8" size={1.1} sizeAttenuation={false} transparent opacity={0.8} />
      </points>
      <Sun />
      <Earth day={day} />
      <SightArrow day={day} />
      <EclipticBand />
      <EclipticLabel />
      {ZODIAC.map((c, i) => (
        <ConstellationFigure key={c.name} c={c} index={i} active={i === activeIdx} showLabels={showLabels} />
      ))}
      <Animator playing={playing} speed={speed} setDay={setDay} />
      <OrbitControls enableDamping dampingFactor={0.08} maxDistance={700} minDistance={60} />
    </Canvas>
  );
}
