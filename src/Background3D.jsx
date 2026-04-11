import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// ─── Quality Detection ────────────────────────────────────────────────────────
const getQualityTier = () => {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile || memory <= 2 || cores <= 2) return 'low';
  if (memory <= 4 || cores <= 4) return 'mid';
  return 'high';
};

// ─── Scene Background — forces canvas bg to match theme (fixes light mode) ───
const SceneBackground = ({ isDark }) => {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(isDark ? '#030303' : '#FFF8E7');
  }, [isDark, scene]);
  return null;
};
const GalaxyCore = ({ isDark, quality }) => {
  const pointsRef = useRef();

  // Store original + current positions + velocities as refs so they persist
  const originalPositions = useRef(null);
  const currentPositions = useRef(null);
  const velocities = useRef(null);

  const { count, positions, colors } = useMemo(() => {
    const tierCounts = { low: 3000, mid: 8000, high: 15000 };
    const numParticles = tierCounts[quality];

    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);

    const arms = 4;
    const spin = 0.4;

    for (let i = 0; i < numParticles; i++) {
      // Radius biased toward center so core is denser
      const r = Math.pow(Math.random(), 0.6) * 80;
      const armIndex = i % arms;
      const branchAngle = (armIndex / arms) * Math.PI * 2;
      const spinAngle = r * spin;
      const angle = branchAngle + spinAngle;

      // Gaussian-ish scatter — more scatter at outer edges
      const scatter = (Math.random() - 0.5) * Math.max(r * 0.15, 1.5);
      const scatterY = (Math.random() - 0.5) * Math.max(r * 0.05, 0.5);

      pos[i * 3]     = Math.cos(angle) * r + scatter;
      pos[i * 3 + 1] = scatterY;
      pos[i * 3 + 2] = Math.sin(angle) * r + scatter;

      // Color zones
      const color = new THREE.Color();
      if (r < 15) {
        // Core: warm white-gold
        color.set(isDark ? '#FFFDE7' : '#9E9E9E');
      } else if (r < 45) {
        // Mid: blue-white or orange
        color.set(isDark
          ? (Math.random() > 0.5 ? '#90CAF9' : '#FFCC80')
          : (Math.random() > 0.5 ? '#7986CB' : '#78909C'));
      } else {
        // Outer: violet/purple fading
        color.set(isDark ? '#9C27B0' : '#B0BEC5');
      }

      col[i * 3]     = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    // Store in refs for mutation during hover
    originalPositions.current = pos.slice();
    currentPositions.current = pos.slice();
    velocities.current = new Float32Array(numParticles * 3);

    return { count: numParticles, positions: pos, colors: col };
  }, [quality, isDark]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const orig = originalPositions.current;
    const curr = currentPositions.current;
    const vel = velocities.current;

    // Project mouse to galaxy plane
    const mouseX = state.pointer.x * 45;
    const mouseY = state.pointer.y * 25;

    const influenceRadius = quality === 'high' ? 14 : quality === 'mid' ? 10 : 7;
    const springStrength = 0.035;
    const drag = 0.88;
    const repelStrength = 0.18;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

      const dx = curr[ix] - mouseX;
      const dy = curr[iy] - mouseY;
      const dist2D = Math.sqrt(dx * dx + dy * dy);

      if (dist2D < influenceRadius && dist2D > 0.01) {
        const force = (influenceRadius - dist2D) / influenceRadius;
        vel[ix] += (dx / dist2D) * force * repelStrength;
        vel[iy] += (dy / dist2D) * force * repelStrength;
      }

      // Drag
      vel[ix] *= drag;
      vel[iy] *= drag;
      vel[iz] *= drag;

      // Spring back to original position
      curr[ix] += vel[ix] + (orig[ix] - curr[ix]) * springStrength;
      curr[iy] += vel[iy] + (orig[iy] - curr[iy]) * springStrength;
      curr[iz] += vel[iz] + (orig[iz] - curr[iz]) * springStrength;

      posAttr.setXYZ(i, curr[ix], curr[iy], curr[iz]);
    }

    posAttr.needsUpdate = true;

    // Slow galaxy rotation
    pointsRef.current.rotation.y -= 0.0003;
  });

  return (
    // FIX: Position closer to camera start (z=15), less negative z
    <group position={[0, -8, -30]} rotation={[0.12, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={quality === 'low' ? 0.18 : 0.14}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

// ─── Nebula Clouds ────────────────────────────────────────────────────────────
const NebulaClouds = ({ isDark, quality }) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) ref1.current.rotation.y = t * 0.04;
    if (ref2.current) ref2.current.rotation.x = -t * 0.025;
    if (ref3.current) ref3.current.rotation.z = t * 0.015;
  });

  return (
    <>
      {/* Violet nebula — visible from start */}
      <mesh ref={ref1} position={[-18, 4, -35]}>
        <sphereGeometry args={[16, 24, 24]} />
        <MeshTransmissionMaterial
          transmission={1} thickness={8} roughness={0.85} chromaticAberration={0.25}
          color={isDark ? '#7C3AED' : '#DDD6FE'} transparent opacity={isDark ? 0.15 : 0.08}
        />
      </mesh>

      {/* Amber nebula — mid scroll */}
      {quality !== 'low' && (
        <mesh ref={ref2} position={[22, -6, -65]}>
          <sphereGeometry args={[20, 24, 24]} />
          <MeshTransmissionMaterial
            transmission={1} thickness={8} roughness={0.85} chromaticAberration={0.25}
            color={isDark ? '#D97706' : '#FDE68A'} transparent opacity={isDark ? 0.10 : 0.06}
          />
        </mesh>
      )}

      {/* Teal nebula — deep scroll */}
      {quality === 'high' && (
        <mesh ref={ref3} position={[0, 8, -95]}>
          <sphereGeometry args={[22, 24, 24]} />
          <MeshTransmissionMaterial
            transmission={1} thickness={8} roughness={0.85} chromaticAberration={0.25}
            color={isDark ? '#0D9488' : '#CCFBF1'} transparent opacity={isDark ? 0.08 : 0.05}
          />
        </mesh>
      )}
    </>
  );
};

// ─── Space Objects ────────────────────────────────────────────────────────────
const SpaceObjects = ({ isDark, quality }) => {
  // Star cluster: dense point ball
  const clusterPositions = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 2.5;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  // Cosmic dust ribbon: point torus
  const ribbonPositions = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    const R = 10, r = 2.5;
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      pos[i * 3]     = (R + r * Math.cos(v)) * Math.cos(u);
      pos[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      pos[i * 3 + 2] = r * Math.sin(v);
    }
    return pos;
  }, []);

  // Void particles: scattered deep space stars
  const voidPositions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = -40 - Math.random() * 80;
    }
    return pos;
  }, []);

  const clusterRef = useRef();
  const ribbonRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (clusterRef.current) {
      clusterRef.current.scale.setScalar(0.97 + Math.sin(t * 1.2) * 0.03);
    }
    if (ribbonRef.current) {
      ribbonRef.current.rotation.x += 0.0008;
      ribbonRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      {/* Star cluster */}
      <Float position={[10, 3, -28]} speed={1.2} floatIntensity={0.6}>
        <points ref={clusterRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={400} array={clusterPositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.12} color={isDark ? '#FFC857' : '#F59E0B'} transparent opacity={0.9} sizeAttenuation depthWrite={false} />
        </points>
      </Float>

      {/* Cosmic dust ribbon — FIX: use points not mesh+pointsMaterial */}
      <points ref={ribbonRef} position={[-14, 0, -58]} rotation={[Math.PI / 2.5, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={600} array={ribbonPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color={isDark ? '#818CF8' : '#6366F1'} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>

      {/* Void particles — deep space background stars */}
      {quality !== 'low' && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={200} array={voidPositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.06} color={isDark ? '#FFFFFF' : '#94A3B8'} transparent opacity={0.3} sizeAttenuation depthWrite={false} />
        </points>
      )}

      {/* Distant galaxy sprite */}
      {quality === 'high' && (
        <Float position={[28, 12, -105]} speed={0.5} floatIntensity={0.3}>
          <points>
            <sphereGeometry args={[3, 16, 16]} />
            <pointsMaterial size={0.08} color={isDark ? '#C084FC' : '#A78BFA'} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
          </points>
        </Float>
      )}
    </group>
  );
};

// ─── Rocket Camera ────────────────────────────────────────────────────────────
const RocketCamera = () => {
  const cameraRef = useRef();

  useGSAP(() => {
    if (!cameraRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    tl.to(cameraRef.current.position, { z: -35, x: 4, y: -2, ease: 'none' }, 0)
      .to(cameraRef.current.position, { z: -65, x: -4, y: 3,  ease: 'none' }, 0.3)
      .to(cameraRef.current.position, { z: -90, x: 2,  y: -1, ease: 'none' }, 0.6)
      .to(cameraRef.current.position, { z: -120, x: 0, y: 0,  ease: 'none' }, 0.85);

    tl.to(cameraRef.current.rotation, { z:  0.05, ease: 'none' }, 0)
      .to(cameraRef.current.rotation, { z: -0.07, ease: 'none' }, 0.3)
      .to(cameraRef.current.rotation, { z:  0.03, ease: 'none' }, 0.6)
      .to(cameraRef.current.rotation, { z:  0,    ease: 'none' }, 0.85);
  }, []);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 15]}
      fov={75}
      near={0.1}
      far={200}
    />
  );
};

// ─── Hero Glow — fills the black void behind the hero card ───────────────────
// Camera starts at z=15, hero card is at z=0, so we need rich visuals at z=-2 to z=-18
const HeroGlow = ({ isDark }) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  // Dense particle halo surrounding the hero zone
  const haloPositions = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Ring/halo shape — particles around the edges, not center
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 20; // hollow center so card is visible
      const spread = (Math.random() - 0.5) * 8;
      pos[i * 3]     = Math.cos(angle) * radius + spread;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.6 + spread * 0.5;
      pos[i * 3 + 2] = -3 - Math.random() * 12;
    }
    return pos;
  }, []);

  // Soft floating wisps — large semi-transparent planes with additive blending
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) {
      ref1.current.rotation.z = t * 0.04;
      ref1.current.material.opacity = 0.12 + Math.sin(t * 0.5) * 0.04;
    }
    if (ref2.current) {
      ref2.current.rotation.z = -t * 0.03;
      ref2.current.material.opacity = 0.10 + Math.sin(t * 0.7 + 1) * 0.03;
    }
    if (ref3.current) {
      ref3.current.rotation.z = t * 0.025;
      ref3.current.material.opacity = 0.08 + Math.sin(t * 0.4 + 2) * 0.02;
    }
  });

  return (
    <group>
      {/* Particle halo ring around hero */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={1200} array={haloPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color={isDark ? '#A855F7' : '#8B5CF6'}
          transparent
          opacity={0.65}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Large soft violet glow — left side */}
      <mesh ref={ref1} position={[-18, 6, -10]}>
        <circleGeometry args={[20, 32]} />
        <meshBasicMaterial
          color={isDark ? '#7C3AED' : '#8B5CF6'}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Large soft fuchsia glow — right side */}
      <mesh ref={ref2} position={[20, -4, -8]}>
        <circleGeometry args={[18, 32]} />
        <meshBasicMaterial
          color={isDark ? '#C026D3' : '#A21CAF'}
          transparent
          opacity={0.10}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Deep blue glow — bottom */}
      <mesh ref={ref3} position={[0, -16, -12]}>
        <circleGeometry args={[22, 32]} />
        <meshBasicMaterial
          color={isDark ? '#1D4ED8' : '#3730A3'}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright core accent — dead center, very subtle */}
      <mesh position={[0, 0, -6]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial
          color={isDark ? '#A78BFA' : '#7C3AED'}
          transparent
          opacity={isDark ? 0.06 : 0.04}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Background3D({ theme }) {
  const isDark = theme === 'dark';
  const quality = getQualityTier();

  return (
    <Canvas
      dpr={quality === 'high' ? [1, 2] : quality === 'mid' ? [1, 1.5] : [1, 1]}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance', alpha: false }}
    >
      <Suspense fallback={null}>
        <SceneBackground isDark={isDark} />
        <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 20, 140]} />

        <ambientLight intensity={isDark ? 0.3 : 0.9} />
        <pointLight position={[0, 0, 10]}    intensity={isDark ? 4 : 2}     color={isDark ? '#C084FC' : '#7C3AED'} />
        <pointLight position={[-20, 10, -50]} intensity={isDark ? 2 : 1}     color={isDark ? '#FB923C' : '#D97706'} />
        <pointLight position={[15, -5, -85]}  intensity={isDark ? 1.5 : 0.8} color={isDark ? '#2DD4BF' : '#0D9488'} />

        <RocketCamera />
        <HeroGlow     isDark={isDark} />
        <GalaxyCore   isDark={isDark} quality={quality} />
        <NebulaClouds isDark={isDark} quality={quality} />
        <SpaceObjects isDark={isDark} quality={quality} />
      </Suspense>
    </Canvas>
  );
}
