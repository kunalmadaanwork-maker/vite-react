// File 2: Background3D.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Starfield = ({ isDark }) => {
  const points = useMemo(() => {
    const p = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 150;
      p[i * 3 + 1] = (Math.random() - 0.5) * 150;
      p[i * 3 + 2] = (Math.random() - 0.5) * 150;
    }
    return p;
  }, []);

  return (
    // FIX 1 & 3: Using native lowercase <points>
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      {/* FIX 2: Increased size to 0.15, and added fog={false} so they don't get hidden */}
      <pointsMaterial 
        size={0.15} 
        color={isDark ? "#ffffff" : "#64748b"} 
        transparent 
        opacity={isDark ? 0.8 : 0.4} 
        sizeAttenuation={true} 
        fog={false} 
      />
    </points>
  );
};

const NebulaGlow = ({ isDark }) => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y += 0.001;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05);
  });

  return (
    <mesh ref={ref} position={[5, -5, -40]}>
      <sphereGeometry args={[30, 64, 64]} />
      <MeshTransmissionMaterial 
        thickness={5} 
        roughness={0.4} 
        transmission={1} 
        color={isDark ? "#701a75" : "#0ea5e9"} 
        transparent 
        opacity={isDark ? 0.2 : 0.1} 
      />
    </mesh>
  );
};

const JourneyObjects = ({ isDark }) => {
  const coreColor = isDark ? "#7c3aed" : "#0284c7"; // Violet vs Ocean
  const vaultColor = isDark ? "#c026d3" : "#38bdf8"; // Magenta vs Sky

  return (
    <group>
      {/* Stage 1: The Manual Quill (Keeping this solid to represent the 'old/manual' way) */}
      <Float position={[0, 0, 0]} speed={1.5}>
        <mesh rotation={[0, 0, Math.PI/4]}>
          <cylinderGeometry args={[0.02, 0.01, 2]} />
          <meshPhysicalMaterial color={isDark ? "#ffffff" : "#0f172a"} emissive={isDark ? "#ffffff" : "#000000"} emissiveIntensity={0.5} />
        </mesh>
      </Float>

      {/* Stage 2: The Core (UPGRADED TO STARDUST) */}
      <Float position={[3, -1, -30]} speed={3}>
        <points>
          {/* 32x32 segments creates a beautiful dotted globe */}
          <sphereGeometry args={[1.5, 32, 32]} />
          <pointsMaterial color={coreColor} size={0.05} sizeAttenuation transparent opacity={0.8} />
        </points>
      </Float>

      {/* Stage 3: The Vault (UPGRADED TO CONSTELLATION) */}
      <group position={[-3, 1, -60]}>
        <points>
          <icosahedronGeometry args={[2.5, 4]} />
          <pointsMaterial color={vaultColor} size={0.04} transparent opacity={0.9} />
        </points>
        <points rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[3.2, 0.4, 16, 100]} />
          <pointsMaterial color={vaultColor} size={0.02} transparent opacity={0.6} />
        </points>
      </group>

      {/* Stage 4: Precision Output (UPGRADED TO DATA CLUSTERS) */}
      <group position={[0, 0, -90]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <points key={i} position={[(i % 3) * 1.5 - 1.5, Math.floor(i / 3) * 1.5 - 2, 0]}>
            {/* Added segments (4, 2, 4) to generate more points per box */}
            <boxGeometry args={[1, 0.1, 1.2, 4, 2, 4]} />
            <pointsMaterial color={coreColor} size={0.03} transparent opacity={0.7} />
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
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} />
      <Starfield isDark={isDark} />
      <NebulaGlow isDark={isDark} />
      <JourneyObjects isDark={isDark} />
    </>
  );
};

export default function Background3D({ theme }) {
  const isDark = theme === 'dark';

  return (
    <Canvas dpr={[1, 2]}>
      <fog attach="fog" args={[isDark ? '#030303' : '#f8fafc', 10, 80]} />
      <ambientLight intensity={isDark ? 0.2 : 0.8} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 1.5 : 2} color={isDark ? "#7c3aed" : "#38bdf8"} />
      <SceneController isDark={isDark} />
    </Canvas>
  );
}
