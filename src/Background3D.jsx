// File 2: Background3D.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// 1. PERFORMANCE OPTIMIZED: The Swirling Singularity
const SwirlingGalaxy = ({ isDark }) => {
  const groupRef = useRef();
  
  // Math to generate a 3-arm spiral galaxy exactly once
  const points = useMemo(() => {
    const count = 4000;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 100;
      const spinAngle = radius * 0.1; // The bend of the black hole
      const branchAngle = ((i % 3) * 2 * Math.PI) / 3; // 3 galaxy arms
      const angle = branchAngle + spinAngle;
      
      p[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 10; // X
      p[i * 3 + 1] = (Math.random() - 0.5) * (15 - radius * 0.1); // Y (Flatter at edges)
      p[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 10; // Z
    }
    return p;
  }, []);

  useFrame(() => {
    // Rotating the parent group costs 0 CPU compared to rotating individual particles
    groupRef.current.rotation.y -= 0.0005;
  });

  return (
    <group ref={groupRef} position={[0, -10, -50]} rotation={[0.2, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
        </bufferGeometry>
        {/* Dark Mode: Starlight. Light Mode (Latte): High-Contrast Charcoal Dust */}
        <pointsMaterial 
          size={0.15} 
          color={isDark ? "#ffffff" : "#334155"} 
          transparent 
          opacity={isDark ? 0.6 : 0.4} 
          sizeAttenuation={true} 
          fog={true} 
        />
      </points>
    </group>
  );
};

// 2. The Volumetric Nebula (Tea-stained in Light Mode)
const NebulaGlow = ({ isDark }) => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y += 0.001;
    ref.current.rotation.z += 0.0005;
  });

  return (
    <mesh ref={ref} position={[0, 0, -40]}>
      <sphereGeometry args={[35, 64, 64]} />
      <MeshTransmissionMaterial 
        thickness={10} 
        roughness={0.6} 
        transmission={1} 
        chromaticAberration={0.5}
        // Dark: Deep Indigo. Light: Cosmic Amber/Tea
        color={isDark ? "#4c1d95" : "#b45309"} 
        transparent 
        opacity={isDark ? 0.15 : 0.08} 
      />
    </mesh>
  );
};

// 3. The Journey Objects (Stardust Constellations)
const JourneyObjects = ({ isDark }) => {
  const coreColor = isDark ? "#c026d3" : "#0f172a"; // Magenta vs Deep Navy
  const vaultColor = isDark ? "#2dd4bf" : "#475569"; // Teal vs Slate

  return (
    <group>
      {/* Stage 1: Manual (Solid to represent legacy) */}
      <Float position={[0, 0, 0]} speed={1.5}>
        <mesh rotation={[0, 0, Math.PI/4]}>
          <cylinderGeometry args={[0.02, 0.01, 2]} />
          <meshPhysicalMaterial color={isDark ? "#ffffff" : "#0f172a"} emissive={isDark ? "#ffffff" : "#000000"} emissiveIntensity={0.5} />
        </mesh>
      </Float>

      {/* Stage 2: Copilot Sync (Stardust Core) */}
      <Float position={[4, -1, -30]} speed={3}>
        <points>
          <sphereGeometry args={[1.5, 48, 48]} />
          <pointsMaterial color={coreColor} size={0.06} transparent opacity={0.8} />
        </points>
      </Float>

      {/* Stage 3: The Vault (Constellation) */}
      <group position={[-4, 1, -60]}>
        <points>
          <icosahedronGeometry args={[2.5, 5]} />
          <pointsMaterial color={vaultColor} size={0.05} transparent opacity={0.9} />
        </points>
        <points rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[3.2, 0.5, 32, 100]} />
          <pointsMaterial color={vaultColor} size={0.02} transparent opacity={0.5} />
        </points>
      </group>

      {/* Stage 4: Precision Output (Data Clusters) */}
      <group position={[0, 0, -90]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <points key={i} position={[(i % 3) * 1.5 - 1.5, Math.floor(i / 3) * 1.5 - 2, 0]}>
            <boxGeometry args={[1, 0.1, 1.2, 5, 2, 5]} />
            <pointsMaterial color={coreColor} size={0.04} transparent opacity={0.7} />
          </points>
        ))}
      </group>
    </group>
  );
};

const SceneController = ({ isDark }) => {
  const cameraRef = useRef();
  useGSAP(() => {
    gsap.to(cameraRef.current.position, {
      z: -110,
      ease: 'power1.inOut', // Smoother camera acceleration
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 }
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} />
      <SwirlingGalaxy isDark={isDark} />
      <NebulaGlow isDark={isDark} />
      <JourneyObjects isDark={isDark} />
    </>
  );
};

export default function Background3D({ theme }) {
  const isDark = theme === 'dark';

  return (
    <Canvas dpr={[1, 2]}>
      {/* FOG TRANSITION: Dark Void (#030303) vs Cosmic Latte (#FFF8E7) */}
      <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 10, 90]} />
      <ambientLight intensity={isDark ? 0.2 : 0.8} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 2 : 1} color={isDark ? "#c026d3" : "#0f172a"} />
      <SceneController isDark={isDark} />
    </Canvas>
  );
}
