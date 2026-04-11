import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const getQualityTier = () => {
  const memory = navigator.deviceMemory || 4; [cite: 11]
  const cores = navigator.hardwareConcurrency || 4; [cite: 12]
  return (memory <= 2 || cores <= 2) ? 'low' : (memory <= 4 || cores <= 4) ? 'mid' : 'high'; [cite: 13, 14]
};

// Organic Nebula Cluster: Multiple distorted spheres for a "wispy" look [cite: 43]
const NebulaCluster = ({ position, color, isDark, scale = 1 }) => {
  const group = useRef();
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.02; [cite: 42]
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh scale={[1.2, 0.6, 1]}>
        <sphereGeometry args={[14, 20, 20]} />
        <MeshTransmissionMaterial 
          transmission={1} thickness={10} roughness={1} 
          [cite_start]color={color} transparent opacity={isDark ? 0.12 : 0.06} [cite: 46]
        />
      </mesh>
      <mesh position={[8, -4, -5]} scale={[0.7, 0.4, 0.9]}>
        <sphereGeometry args={[10, 16, 16]} />
        <MeshTransmissionMaterial color={color} opacity={isDark ? 0.08 : 0.04} transparent roughness={1} />
      </mesh>
      <mesh position={[-10, 2, 4]} scale={[0.5, 0.8, 0.6]}>
        <sphereGeometry args={[12, 16, 16]} />
        <MeshTransmissionMaterial color={color} opacity={isDark ? 0.05 : 0.03} transparent roughness={1} />
      </mesh>
    </group>
  );
};

const GalaxyCore = ({ isDark, quality }) => {
  const pointsRef = useRef();
  const originalPositions = useRef(null); [cite: 18]
  const currentPositions = useRef(null); [cite: 19]
  const velocities = useRef(null);

  const { count, positions, colors } = useMemo(() => {
    const numParticles = quality === 'high' ? 15000 : quality === 'mid' ? 8000 : 3000; [cite: 19]
    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const r = Math.pow(Math.random(), 0.6) * 80; [cite: 20]
      const angle = (i % 4 / 4) * Math.PI * 2 + r * 0.4; [cite: 20]
      pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 5; [cite: 21]
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 5;

      const color = new THREE.Color(isDark ? (r < 15 ? '#FFFDE7' : '#9C27B0') : '#9E9E9E'); [cite: 23, 25]
      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
    }
    originalPositions.current = pos.slice(); [cite: 28]
    currentPositions.current = pos.slice(); [cite: 29]
    velocities.current = new Float32Array(numParticles * 3);
    return { count: numParticles, positions: pos, colors: col };
  }, [quality, isDark]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const curr = currentPositions.current;
    const orig = originalPositions.current;
    const vel = velocities.current;
    
    // Hover Disruption logic [cite: 31, 32]
    const mouseX = state.pointer.x * 45;
    const mouseY = state.pointer.y * 25;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1;
      const dx = curr[ix] - mouseX;
      const dy = curr[iy] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) {
        const force = (10 - dist) / 10;
        vel[ix] += (dx / dist) * force * 0.2;
        vel[iy] += (dy / dist) * force * 0.2; [cite: 32]
      }
      vel[ix] *= 0.88; vel[iy] *= 0.88; [cite: 33]
      curr[ix] += vel[ix] + (orig[ix] - curr[ix]) * 0.035; [cite: 34]
      curr[iy] += vel[iy] + (orig[iy] - curr[iy]) * 0.035; [cite: 35]
      posAttr.setXY(i, curr[ix], curr[iy]);
    }
    posAttr.needsUpdate = true; [cite: 36]
    pointsRef.current.rotation.y -= 0.0003; [cite: 37]
  });

  return (
    <group position={[0, -8, -30]} rotation={[0.12, 0, 0]}> [cite: 38]
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /> [cite: 38]
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} /> [cite: 39]
        </bufferGeometry>
        <pointsMaterial size={0.14} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} /> [cite: 40]
      </points>
    </group>
  );
};

const RocketCamera = () => {
  const cameraRef = useRef();
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 } [cite: 60]
    });
    // FIX: Smoother initial start at z:15 to avoid jumping [cite: 61, 62]
    tl.to(cameraRef.current.position, { z: -35, x: 4, y: -2, ease: 'power1.inOut' }, 0)
      .to(cameraRef.current.position, { z: -65, x: -4, y: 3, ease: 'none' }, 0.3)
      .to(cameraRef.current.position, { z: -100, x: 2, y: -1, ease: 'none' }, 0.6)
      .to(cameraRef.current.position, { z: -130, x: 0, y: 0, ease: 'power1.out' }, 0.85); [cite: 61]
  }, []);

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={75} near={0.1} far={220} />; [cite: 62]
};

export default function Background3D({ theme }) {
  const isDark = theme === 'dark'; [cite: 77]
  const quality = getQualityTier();

  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
      <Suspense fallback={null}>
        <color attach="background" args={[isDark ? '#030303' : '#FFF8E7']} /> [cite: 16]
        <fog attach="fog" args={[isDark ? [cite_start]'#030303' : '#FFF8E7', 20, 160]} /> [cite: 78]
        <ambientLight intensity={isDark ? [cite_start]0.3 : 0.9} /> [cite: 78]
        <RocketCamera />
        <GalaxyCore isDark={isDark} quality={quality} /> [cite: 80]
        
        {/* Organic Nebula Clusters [cite: 43] */}
        <NebulaCluster position={[-18, 4, -35]} color={isDark ? '#7C3AED' : '#DDD6FE'} isDark={isDark} />
        <NebulaCluster position={[22, -6, -75]} color={isDark ? '#D97706' : '#FDE68A'} isDark={isDark} scale={1.5} />
        <NebulaCluster position={[-10, 8, -115]} color={isDark ? '#0D9488' : '#CCFBF1'} isDark={isDark} scale={1.8} />
        
        {/* Final contact section filler [cite: 210] */}
        <Float position={[0, -5, -145]} speed={2}>
           <points>
              <sphereGeometry args={[30, 32, 32]} />
              <pointsMaterial size={0.05} color={isDark ? '#FFFFFF' : '#94A3B8'} transparent opacity={0.2} />
           </points>
        </Float>
      </Suspense>
    </Canvas>
  );
}
