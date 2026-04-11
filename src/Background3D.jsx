import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
  MeshTransmissionMaterial, 
  MeshDistortMaterial, 
  Points 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const getQualityTier = () => {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile || memory <= 2 || cores <= 2) return 'low';
  if (memory <= 4 || cores <= 4) return 'mid';
  return 'high';
};

// ─── COSMIC VEINS: Long streaks of light that fix the "Void" feeling ───
const CosmicVeins = ({ isDark }) => {
  const veins = useMemo(() => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        pos: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, 0],
        color: isDark ? (Math.random() > 0.5 ? '#7C3AED' : '#2DD4BF') : '#94A3B8',
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: [0.1, 0.1, 150], // Very long, thin needles
      });
    }
    return data;
  }, [isDark]);

  return (
    <group>
      {veins.map((v, i) => (
        <mesh key={i} position={v.pos} rotation={v.rot} scale={v.scale}>
          <cylinderGeometry args={[0.02, 0.02, 1]} />
          <meshBasicMaterial color={v.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

const GalaxyCore = ({ isDark, quality }) => {
  const pointsRef = useRef();
  const originalPositions = useRef(null);
  const currentPositions = useRef(null);
  const velocities = useRef(null);
  const mouseGlobal = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseGlobal.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseGlobal.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const { count, positions, colors } = useMemo(() => {
    const tierCounts = { low: 3000, mid: 8000, high: 15000 };
    const numParticles = tierCounts[quality];
    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);
    const arms = 4;
    const spin = 0.4;

    for (let i = 0; i < numParticles; i++) {
      const r = Math.pow(Math.random(), 0.6) * 80;
      const armIndex = i % arms;
      const branchAngle = (armIndex / arms) * Math.PI * 2;
      const spinAngle = r * spin;
      const angle = branchAngle + spinAngle;
      const scatter = (Math.random() - 0.5) * Math.max(r * 0.15, 1.5);
      const scatterY = (Math.random() - 0.5) * Math.max(r * 0.05, 0.5);

      pos[i * 3]     = Math.cos(angle) * r + scatter;
      pos[i * 3 + 1] = scatterY;
      pos[i * 3 + 2] = Math.sin(angle) * r + scatter;

      const color = new THREE.Color();
      if (r < 15) color.set(isDark ? '#FFFDE7' : '#9E9E9E');
      else if (r < 45) color.set(isDark ? (Math.random() > 0.5 ? '#90CAF9' : '#FFCC80') : (Math.random() > 0.5 ? '#7986CB' : '#78909C'));
      else color.set(isDark ? '#9C27B0' : '#B0BEC5');

      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
    }
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

    const mouseX = mouseGlobal.current.x * 60; 
    const mouseY = mouseGlobal.current.y * 30;

    const influenceRadius = quality === 'high' ? 15 : 10;
    const springStrength = 0.03;
    const drag = 0.9;
    const repelStrength = 0.2;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const dx = curr[ix] - mouseX;
      const dy = curr[iy] - mouseY;
      const dist2D = Math.sqrt(dx * dx + dy * dy);

      if (dist2D < influenceRadius && dist2D > 0.1) {
        const force = (influenceRadius - dist2D) / influenceRadius;
        vel[ix] += (dx / dist2D) * force * repelStrength;
        vel[iy] += (dy / dist2D) * force * repelStrength;
      }

      vel[ix] *= drag; vel[iy] *= drag; vel[iz] *= drag;
      curr[ix] += vel[ix] + (orig[ix] - curr[ix]) * springStrength;
      curr[iy] += vel[iy] + (orig[iy] - curr[iy]) * springStrength;
      curr[iz] += vel[iz] + (orig[iz] - curr[iz]) * springStrength;
      posAttr.setXYZ(i, curr[ix], curr[iy], curr[iz]);
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y -= 0.0003;
  });

  return (
    <group position={[0, -8, -30]} rotation={[0.12, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.14} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
};

const NebulaCloud = ({ position, color, scale }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.rotation.z += 0.001;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial distort={0.6} speed={2} radius={1} color={color} transparent opacity={0.1} />
    </mesh>
  );
};

const AsteroidBelt = ({ position, color }) => {
  const count = 1500;
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 10;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  return (
    <group position={position}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color={color} transparent opacity={0.3} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
};

const SpaceObjects = ({ isDark }) => {
  return (
    <group>
      <Float position={[0, 0, -140]} speed={2} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[10, 4]} />
          <MeshTransmissionMaterial 
            transmission={1} thickness={2} roughness={0} chromaticAberration={0.5}
            color={isDark ? '#C084FC' : '#A78BFA'} transparent opacity={0.6}
          />
        </mesh>
        <pointLight intensity={30} color="#C084FC" distance={100} />
      </Float>
    </group>
  );
};

const RocketCamera = () => {
  const cameraRef = useRef();
  useGSAP(() => {
    if (!cameraRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
    });
    tl.to(cameraRef.current.position, { z: -145, x: 0, y: 0, ease: 'none' }, 0)
      .to(cameraRef.current.rotation, { z: 0.05, ease: 'none' }, 0)
      .to(cameraRef.current.rotation, { z: -0.05, ease: 'none' }, 0.5)
      .to(cameraRef.current.rotation, { z: 0, ease: 'none' }, 1);
  }, []);
  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={75} near={0.1} far={300} />;
};

const HeroGlow = ({ isDark }) => {
  const haloPositions = useMemo(() => {
    const count = 1200; const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 20;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.6;
      pos[i * 3 + 2] = -3 - Math.random() * 12;
    }
    return pos;
  }, []);

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={1200} array={haloPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.18} color={isDark ? '#A855F7' : '#8B5CF6'} transparent opacity={0.65} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
};

export default function Background3D({ theme }) {
  const isDark = theme === 'dark';
  const quality = getQualityTier();

  return (
    <Canvas dpr={quality === 'high' ? [1, 2] : [1, 1]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <Suspense fallback={null}>
        <color attach="background" args={[isDark ? '#030303' : '#FFF8E7']} />
        {/* TIGHTENED FOG: Creates a more seamless transition between assets */}
        <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 10, 180]} />
        <ambientLight intensity={isDark ? 0.3 : 0.9} />
        <pointLight position={[0, 0, 10]} intensity={isDark ? 4 : 2} color={isDark ? '#C084FC' : '#7C3AED'} />
        
        {/* GLOBAL CONNECTORS: Always visible to remove the "nothingness" */}
        <CosmicVeins isDark={isDark} />
        <RocketCamera />
        <HeroGlow isDark={isDark} />
        
        {/* BEAT 1: Hero Cluster */}
        <GalaxyCore isDark={isDark} quality={quality} />

        {/* BEAT 2: AI Journey Cluster - Moved closer to core to avoid gap */}
        <NebulaCloud position={[-20, 5, -40]} scale={[30, 15, 20]} color={isDark ? '#7C3AED' : '#DDD6FE'} />
        <AsteroidBelt position={[0, 0, -55]} color={isDark ? '#C084FC' : '#A78BFA'} />

        {/* BEAT 3: Horizon Transition - Adding a "bridge" nebula here */}
        <NebulaCloud position={[10, 0, -80]} scale={[40, 20, 30]} color={isDark ? '#3B82F6' : '#BFDBFE'} />

        {/* BEAT 4: Built With AI Cluster */}
        <NebulaCloud position={[20, -10, -100]} scale={[30, 15, 20]} color={isDark ? '#0D9488' : '#CCFBF1'} />
        <AsteroidBelt position={[0, 0, -115]} color={isDark ? '#2DD4BF' : '#0D9488'} />

        {/* BEAT 5: Finale */}
        <SpaceObjects isDark={isDark} />
      </Suspense>
    </Canvas>
  );
}
