// File 2: Background3D.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, PerspectiveCamera, Points } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Accepts the 'isDark' boolean to swap colors
const Starfield = ({ isDark }) => {
  const points = useMemo(() => {
    const p = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100;
      p[i * 3 + 1] = (Math.random() - 0.5) * 100;
      p[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return p;
  }, []);

  return (
    <Points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      {/* Dark mode: White stars. Light mode: Subtle slate-blue data nodes */}
      <pointsMaterial 
        size={0.04} 
        color={isDark ? "#ffffff" : "#64748b"} 
        transparent 
        opacity={isDark ? 0.6 : 0.3} 
        sizeAttenuation 
      />
    </Points>
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
      <sphereGeometry args={[25, 64, 64]} />
      <MeshTransmissionMaterial 
        thickness={5} 
        roughness={0.2} 
        chromaticAberration={1} 
        transmission={1} 
        /* Dark: Magenta Nebula. Light: Soft Azure/Cyan glow */
        color={isDark ? "#701a75" : "#0ea5e9"} 
        transparent 
        opacity={isDark ? 0.15 : 0.1} 
      />
    </mesh>
  );
};

const JourneyObjects = ({ isDark }) => {
  // Define colors based on theme
  const coreColor = isDark ? "#7c3aed" : "#0284c7"; // Violet vs Ocean Blue
  const vaultColor = isDark ? "#c026d3" : "#38bdf8"; // Magenta vs Sky Blue
  const emissiveInt = isDark ? 2 : 0.5; // Less glow in light mode, more glass reflection

  return (
    <group>
      {/* Stage 1: The Quill */}
      <Float position={[0, 0, 0]} speed={1.5}>
        <mesh rotation={[0, 0, Math.PI/4]}>
          <cylinderGeometry args={[0.02, 0.01, 2]} />
          <meshPhysicalMaterial color={isDark ? "#ffffff" : "#0f172a"} emissive={isDark ? "#ffffff" : "#000000"} emissiveIntensity={0.5} />
        </mesh>
      </Float>

      {/* Stage 2: The Core */}
      <Float position={[3, -1, -30]} speed={3}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshPhysicalMaterial color={coreColor} emissive={coreColor} emissiveIntensity={emissiveInt} roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>

      {/* Stage 3: The Vault */}
      <group position={[-3, 1, -60]}>
        <mesh>
          <icosahedronGeometry args={[2.5, 1]} />
          <MeshTransmissionMaterial thickness={1} roughness={0.1} transmission={1} color={vaultColor} />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[3.2, 0.02, 16, 100]} />
          <meshPhysicalMaterial color={vaultColor} emissive={vaultColor} emissiveIntensity={emissiveInt} />
        </mesh>
      </group>

      {/* Stage 4: The Bricks */}
      <group position={[0, 0, -90]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[(i % 3) * 1.5 - 1.5, Math.floor(i / 3) * 1.5 - 2, 0]}>
            <boxGeometry args={[1, 0.1, 1.2]} />
            <meshPhysicalMaterial color={coreColor} emissive={coreColor} emissiveIntensity={emissiveInt} />
          </mesh>
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

// 1. Receive the 'theme' prop from App.jsx
export default function Background3D({ theme }) {
  const isDark = theme === 'dark';

  return (
    <Canvas dpr={[1, 2]}>
      {/* 2. PRO-TIP: We removed <color attach="background"> so the CSS fade behind the canvas shows through! */}
      {/* Fog color changes instantly to match the new background */}
      <fog attach="fog" args={[isDark ? '#030303' : '#f8fafc', 5, 80]} />
      <ambientLight intensity={isDark ? 0.2 : 0.8} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 1.5 : 2} color={isDark ? "#7c3aed" : "#38bdf8"} />
      <SceneController isDark={isDark} />
    </Canvas>
  );
}
