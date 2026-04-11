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

// ─── Quality Detection ────────────────────────────────────────────────────────
const getQualityTier = () => {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile || memory <= 2 || cores <= 2) return 'low';
  if (memory <= 4 || cores <= 4) return 'mid';
  return 'high';
};

// ─── TEXTURE GENERATOR: Turns square pixels into soft glowing orbs ───
const createCircleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  
  // Hot Core: center is pure white for high "stellar temperature"
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
  // Soft Falloff: gradual fade to prevent harsh edges
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
};

// ─── WARP TUNNEL: The "Anti-Void" cylinder with Inner and Outer layers ───
const WarpTunnel = ({ isDark, quality }) => {
  const orbTexture = useMemo(() => createCircleTexture(), []);
  const count = quality === 'high' ? 25000 : 12000;
  
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const z = Math.random() * -300 + 20; 
      const angle = Math.random() * Math.PI * 2;
      // Fix the hollow center: mix of close (0-15) and far (20-60) particles
      const isInner = Math.random() > 0.7;
      const radius = isInner ? Math.random() * 15 : 20 + Math.random() * 40;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = z;

      const color = new THREE.Color();
      color.set(isDark ? (Math.random() > 0.9 ? '#C084FC' : '#ffffff') : '#94A3B8');
      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
    }
    return { pos, col };
  }, [quality, isDark]);

  const ref = useRef();
  useFrame(() => { if (ref.current) ref.current.rotation.z += 0.0005; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={points.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        map={orbTexture} 
        vertexColors 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
};

// ─── GALAXY CORE: High-impact interactive center ───
const GalaxyCore = ({ isDark, quality }) => {
  const pointsRef = useRef();
  const orbTexture = useMemo(() => createCircleTexture(), []);
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
      pos[i * 3] = Math.cos(angle) * r + scatter;
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

  useFrame(() => {
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
        <pointsMaterial 
          size={0.12} 
          map={orbTexture} 
          vertexColors 
          transparent 
          opacity={0.9} 
          sizeAttenuation 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
        />
      </points>
    </group>
  );
};

const NebulaWall = ({ position, color, scale }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
      ref.current.rotation.x += 0.001;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial distort={0.7} speed={1.5} radius={1} color={color} transparent opacity={0.25} />
    </mesh>
  );
};

const AsteroidBelt = ({ position, color }) => {
  const orbTexture = useMemo(() => createCircleTexture(), []);
  const count = 2000;
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 15;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
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
        <pointsMaterial 
          size={0.1} 
          map={orbTexture} 
          color={color} 
          transparent 
          opacity={0.5} 
          sizeAttenuation 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
        />
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
          <MeshTransmissionMaterial transmission={1} thickness={2} roughness={0} chromaticAberration={0.5} color={isDark ? '#C084FC' : '#A78BFA'} transparent opacity={0.6} />
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

    // FIX: Explicit duration of 1 ensures Z movement spans 100% of the scroll
    tl.to(cameraRef.current.position, { 
      z: -145, 
      x: 0, 
      y: 0, 
      duration: 1, 
      ease: 'none' 
    }, 0);

    tl.to(cameraRef.current.rotation, { z: 0.05, duration: 0.3, ease: 'none' }, 0);
    tl.to(cameraRef.current.rotation, { z: -0.05, duration: 0.3, ease: 'none' }, 0.3);
    tl.to(cameraRef.current.rotation, { z: 0, duration: 0.4, ease: 'none' }, 0.6);
  }, []);
  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={75} near={0.1} far={300} />;
};

const HeroGlow = ({ isDark }) => {
  const orbTexture = useMemo(() => createCircleTexture(), []);
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
        <pointsMaterial size={0.12} map={orbTexture} color={isDark ? '#A855F7' : '#8B5CF6'} transparent opacity={0.65} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
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
        <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 10, 200]} />
        <ambientLight intensity={isDark ? 0.3 : 0.9} />
        <pointLight position={[0, 0, 10]} intensity={isDark ? 4 : 2} color={isDark ? '#C084FC' : '#7C3AED'} />
        
        <WarpTunnel isDark={isDark} quality={quality} />
        <RocketCamera />
        <HeroGlow isDark={isDark} />
        <GalaxyCore isDark={isDark} quality={quality} />
        <NebulaWall position={[-10, 0, -40]} scale={[40, 40, 40]} color={isDark ? '#7C3AED' : '#DDD6FE'} />
        <AsteroidBelt position={[0, 0, -60]} color={isDark ? '#C084FC' : '#A78BFA'} />
        <NebulaWall position={[0, 0, -80]} scale={[60, 40, 60]} color={isDark ? '#3B82F6' : '#BFDBFE'} />
        <NebulaWall position={[10, 0, -100]} scale={[40, 40, 40]} color={isDark ? '#0D9488' : '#CCFBF1'} />
        <AsteroidBelt position={[0, 0, -120]} color={isDark ? '#2DD4BF' : '#0D9488'} />
        <SpaceObjects isDark={isDark} />
      </Suspense>
    </Canvas>
  );
}
