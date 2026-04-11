import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshTransmissionMaterial } from '@react-three/drei';
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

// Organic Nebula Component: Uses clusters instead of single spheres 
const OrganicNebula = ({ position, color, isDark, scale = 1 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group position={position} scale={scale} ref={ref}>
      {/* Main core */}
      <mesh scale={[1.2, 0.6, 1.1]}>
        <sphereGeometry args={[12, 20, 20]} />
        <MeshTransmissionMaterial 
          transmission={1} thickness={8} roughness={0.9} 
          color={color} transparent opacity={isDark ? 0.12 : 0.07}
        />
      </mesh>
      {/* Wisp outlier 1 */}
      <mesh position={[7, -3, -2]} scale={[0.6, 0.4, 0.8]}>
        <sphereGeometry args={[10, 16, 16]} />
        <MeshTransmissionMaterial color={color} opacity={isDark ? 0.08 : 0.04} transparent roughness={1} />
      </mesh>
      {/* Wisp outlier 2 */}
      <mesh position={[-6, 4, 3]} scale={[0.5, 0.7, 0.4]}>
        <sphereGeometry args={[12, 16, 16]} />
        <MeshTransmissionMaterial color={color} opacity={isDark ? 0.05 : 0.03} transparent roughness={1} />
      </mesh>
    </group>
  );
};

const GalaxyCore = ({ isDark, quality }) => {
  const pointsRef = useRef();
  const originalPositions = useRef(null);
  const currentPositions = useRef(null);
  const velocities = useRef(null);

  const { count, positions, colors } = useMemo(() => {
    const tierCounts = { low: 3000, mid: 8000, high: 15000 };
    const numParticles = tierCounts[quality];
    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const r = Math.pow(Math.random(), 0.6) * 80;
      const angle = (i % 4 / 4) * Math.PI * 2 + r * 0.4;
      pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * (r * 0.15);
      pos[i * 3 + 1] = (Math.random() - 0.5) * (r * 0.05);
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * (r * 0.15);

      const color = new THREE.Color();
      if (r < 15) color.set(isDark ? '#FFFDE7' : '#9E9E9E');
      else if (r < 45) color.set(isDark ? (Math.random() > 0.5 ? '#90CAF9' : '#FFCC80') : '#78909C');
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
    const curr = currentPositions.current;
    const orig = originalPositions.current;
    const vel = velocities.current;
    
    // Physics-driven hover interaction 
    const mouseX = state.pointer.x * 45;
    const mouseY = state.pointer.y * 25;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const dx = curr[ix] - mouseX;
      const dy = curr[iy] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 12 && dist > 0.1) {
        const force = (12 - dist) / 12;
        vel[ix] += (dx / dist) * force * 0.2;
        vel[iy] += (dy / dist) * force * 0.2;
      }
      vel[ix] *= 0.88; vel[iy] *= 0.88; vel[iz] *= 0.88;
      curr[ix] += vel[ix] + (orig[ix] - curr[ix]) * 0.035;
      curr[iy] += vel[iy] + (orig[iy] - curr[iy]) * 0.035;
      curr[iz] += vel[iz] + (orig[iz] - curr[iz]) * 0.035;
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

const RocketCamera = () => {
  const cameraRef = useRef();
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });
    // FIX: Smoother initial start at current position (z:15) to avoid scroll jumps [cite: 60-61]
    tl.to(cameraRef.current.position, { z: -35, x: 4, y: -2, ease: 'power1.inOut' }, 0)
      .to(cameraRef.current.position, { z: -75, x: -6, y: 3, ease: 'none' }, 0.3)
      .to(cameraRef.current.position, { z: -110, x: 3, y: -2, ease: 'none' }, 0.65)
      .to(cameraRef.current.position, { z: -145, x: 0, y: 0, ease: 'power1.out' }, 0.85);
  }, []);

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={75} near={0.1} far={220} />;
};

export default function Background3D({ theme }) {
  const isDark = theme === 'dark';
  const quality = getQualityTier();

  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
      <Suspense fallback={null}>
        <color attach="background" args={[isDark ? '#030303' : '#FFF8E7']} />
        <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 20, 160]} />
        <ambientLight intensity={isDark ? 0.3 : 0.9} />
        
        <RocketCamera />
        <GalaxyCore isDark={isDark} quality={quality} />
        
        {/* Organic Nebula Clusters  */}
        <OrganicNebula position={[-18, 4, -35]} color={isDark ? '#7C3AED' : '#DDD6FE'} isDark={isDark} />
        <OrganicNebula position={[25, -8, -80]} color={isDark ? '#D97706' : '#FDE68A'} isDark={isDark} scale={1.6} />
        <OrganicNebula position={[-12, 10, -125]} color={isDark ? '#0D9488' : '#CCFBF1'} isDark={isDark} scale={1.9} />
        
        {/* Deep Space Filler for the Contact Footer  */}
        <Float position={[0, -5, -155]} speed={1.5} rotationIntensity={0.5}>
           <points>
              <sphereGeometry args={[45, 32, 32]} />
              <pointsMaterial size={0.06} color={isDark ? '#FFFFFF' : '#94A3B8'} transparent opacity={0.25} sizeAttenuation depthWrite={false} />
           </points>
        </Float>
      </Suspense>
    </Canvas>
  );
}
