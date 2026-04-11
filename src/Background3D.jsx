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

// ─── WARP VORTEX: Continuous spiraling particles that fix the "nothingness" ───
const WarpVortex = ({ isDark, quality }) => {
  const count = quality === 'high' ? 15000 : 7000;
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread particles along the entire journey
      const z = Math.random() * -200 + 20;
      const angle = Math.random() * Math.PI * 2;
      // Radius increases as we go deeper to create a "funnel" effect
      const radius = Math.random() * (Math.abs(z) * 0.5 + 10);
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = z;

      const color = new THREE.Color();
      color.set(isDark ? (Math.random() > 0.8 ? '#C084FC' : '#ffffff') : '#94A3B8');
      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
    }
    return { pos, col };
  }, [quality, isDark]);

  const pointsRef = useRef();
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z += 0.001; // Slow vortex spin
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={points.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
};

// ─── STARDUST BELT: Large rings the user flies through at intervals ───
const StardustBelt = ({ position, color, isDark }) => {
  const count = 2000;
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 10;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
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

const NebulaCloud = ({ position, color, scale, isDark }) => {
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
      <MeshDistortMaterial distort={0.5} speed={2} radius={1} color={color} transparent opacity={0.08} />
    </mesh>
  );
};

const NebulaSystem = ({ isDark, quality }) => {
  return (
    <group>
      <NebulaCloud position={[-20, 5, -30]} scale={[20, 10, 15]} color={isDark ? '#7C3AED' : '#DDD6FE'} isDark={isDark} />
      <NebulaCloud position={[20, -5, -50]} scale={[15, 15, 10]} color={isDark ? '#D97706' : '#FDE68A'} isDark={isDark} />
      <NebulaCloud position={[-10, 10, -70]} scale={[25, 10, 20]} color={isDark ? '#0D9488' : '#CCFBF1'} isDark={isDark} />
      <NebulaCloud position={[25, 0, -90]} scale={[15, 20, 15]} color={isDark ? '#C026D3' : '#F5D0FE'} isDark={isDark} />
      <NebulaCloud position={[-20, -10, -110]} scale={[20, 12, 18]} color={isDark ? '#3B82F6' : '#BFDBFE'} isDark={isDark} />
      <NebulaCloud position={[0, 5, -130]} scale={[35, 20, 30]} color={isDark ? '#A78BFA' : '#DDD6FE'} isDark={isDark} />
    </group>
  );
};

const SpaceObjects = ({ isDark, quality }) => {
  const clusterPositions = useMemo(() => {
    const count = 400; const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 2.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <group>
      <Float position={[10, 3, -28]} speed={1.2} floatIntensity={0.6}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={400} array={clusterPositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.12} color={isDark ? '#FFC857' : '#F59E0B'} transparent opacity={0.9} sizeAttenuation depthWrite={false} />
        </points>
      </Float>

      {/* FINAL DESTINATION: Huge bright core for Contact Section */}
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
        <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 20, 250]} />
        <ambientLight intensity={isDark ? 0.3 : 0.9} />
        <pointLight position={[0, 0, 10]} intensity={isDark ? 4 : 2} color={isDark ? '#C084FC' : '#7C3AED'} />
        <pointLight position={[-20, 10, -50]} intensity={isDark ? 2 : 1} color={isDark ? '#FB923C' : '#D97706'} />
        <pointLight position={[15, -5, -85]} intensity={isDark ? 1.5 : 0.8} color={isDark ? '#2DD4BF' : '#0D9488'} />
        
        <WarpVortex isDark={isDark} quality={quality} />
        <RocketCamera />
        <HeroGlow isDark={isDark} />
        <GalaxyCore isDark={isDark} quality={quality} />
        <NebulaSystem isDark={isDark} quality={quality} />
        <SpaceObjects isDark={isDark} quality={quality} />
        
        {/* The Belts that break the void */}
        <StardustBelt position={[0, 0, -60]} color={isDark ? '#C084FC' : '#A78BFA'} isDark={isDark} />
        <StardustBelt position={[0, 0, -110]} color={isDark ? '#2DD4BF' : '#0D9488'} isDark={isDark} />
      </Suspense>
    </Canvas>
  );
}
