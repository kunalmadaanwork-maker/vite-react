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

// ─── THE DOUBLE-LAYER TUNNEL: Fills both the periphery and the center ───
const WarpTunnel = ({ isDark, quality }) => {
  const count = quality === 'high' ? 25000 : 12000;
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const z = Math.random() * -300 + 20; 
      const angle = Math.random() * Math.PI * 2;
      
      // MIXED RADIUS: Some particles far (20-60), some close (0-15) to kill the hollow center
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
  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.0005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={points.pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={points.col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
};

// ─── REUSABLE STAR CLUSTER: Used to place density at multiple points in the journey ───
const StarCluster = ({ position, isDark, density = 1, color = '#ffffff' }) => {
  const pointsRef = useRef();
  const count = 5000 * density;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const clusterColor = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.7) * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      col[i * 3] = clusterColor.r;
      col[i * 3 + 1] = clusterColor.g;
      col[i * 3 + 2] = clusterColor.b;
    }
    return { positions: pos, colors: col };
  }, [count, color]);

  useFrame((state) => {
    if (pointsRef.current) pointsRef.current.rotation.y += 0.001;
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.6} sizeAttenuation depthWrite={false} />
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
        <pointsMaterial size={0.12} color={color} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
};

const SingularityFinale = ({ isDark }) => {
  return (
    <group position={[0, 0, -140]}>
      <Float speed={3} floatIntensity={2}>
        <mesh>
          <icosahedronGeometry args={[8, 4]} />
          <MeshTransmissionMaterial 
            transmission={1} thickness={2} roughness={0} chromaticAberration={0.8}
            color={isDark ? '#C084FC' : '#A78BFA'} transparent opacity={0.8}
          />
        </mesh>
        <pointLight intensity={50} color="#C084FC" distance={100} />
      </Float>
      {/* High density particle shell around the singularity */}
      <StarCluster position={[0, 0, 0]} color={isDark ? '#C084FC' : '#A78BFA'} density={2} />
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
        <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 10, 250]} />
        <ambientLight intensity={isDark ? 0.3 : 0.9} />
        <pointLight position={[0, 0, 10]} intensity={isDark ? 4 : 2} color={isDark ? '#C084FC' : '#7C3AED'} />
        
        {/* THE FIX: Always visible tunnel aroud the camera */}
        <WarpTunnel isDark={isDark} quality={quality} />
        
        <RocketCamera />
        <HeroGlow isDark={isDark} />
        
        {/* BEAT 1: Hero Core (z= -30) */}
        <StarCluster position={[0, -8, -30]} color={isDark ? '#FFFDE7' : '#9E9E9E'} density={3} />

        {/* BEAT 2: AI Journey Cluster (z= -60) */}
        <NebulaWall position={[-20, 5, -50]} scale={[40, 20, 30]} color={isDark ? '#7C3AED' : '#DDD6FE'} />
        <AsteroidBelt position={[0, 0, -60]} color={isDark ? '#C084FC' : '#A78BFA'} />
        <StarCluster position={[10, 0, -65]} color={isDark ? '#90CAF9' : '#7986CB'} density={1} />

        {/* BEAT 3: Horizon Cluster (z= -90) */}
        <NebulaWall position={[0, 0, -90]} scale={[60, 40, 40]} color={isDark ? '#3B82F6' : '#BFDBFE'} />
        <StarCluster position={[-10, 5, -90]} color={isDark ? '#C084FC' : '#A78BFA'} density={1} />

        {/* BEAT 4: Built With AI Cluster (z= -120) */}
        <NebulaWall position={[20, -10, -120]} scale={[40, 20, 30]} color={isDark ? '#0D9488' : '#CCFBF1'} />
        <AsteroidBelt position={[0, 0, -130]} color={isDark ? '#2DD4BF' : '#0D9488'} />
        <StarCluster position={[0, 0, -125]} color={isDark ? '#2DD4BF' : '#0D9488'} density={1} />

        {/* BEAT 5: The Singularity Finale (z= -140) */}
        <SingularityFinale isDark={isDark} />
      </Suspense>
    </Canvas>
  );
}
