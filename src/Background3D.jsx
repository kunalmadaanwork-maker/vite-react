// File 2: Background3D.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  MeshTransmissionMaterial, 
  Float, 
  PerspectiveCamera, 
  Points 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Starfield = () => {
  const points = useMemo(() => {
    const p = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100;
      p[i * 3 + 1] = (Math.random() - 0.5) * 100;
      p[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return p;
  }, []);

  return (
    <Points>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={points.length / 3} 
          array={points} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.4} />
    </Points>
  );
};

const NebulaGlow = () => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05);
  });

  return (
    <mesh ref={ref} position={[0, 0, -50]}>
      <sphereGeometry args={[20, 32, 32]} />
      <MeshTransmissionMaterial 
        thickness={2} 
        roughness={0} 
        transmission={1} 
        color="#1e3a8a" 
        transparent 
        opacity={0.3} 
      />
    </mesh>
  );
};

const JourneyObjects = () => {
  return (
    <group>
      {/* Stage 1: The Quill (Manual) */}
      <Float position={[0, 0, 0]} speed={2}>
        <mesh rotation={[0, 0, Math.PI/4]}>
          <cylinderGeometry args={[0.02, 0.01, 1.5]} />
          <meshPhysicalMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      {/* Stage 2: The Core (Copilot) */}
      <Float position={[2, 0, -25]} speed={4}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} roughness={0} metalness={1} />
        </mesh>
      </Float>

      {/* Stage 3: The Vault (Amazon Q) */}
      <group position={[-2, 0, -50]}>
        <mesh>
          <icosahedronGeometry args={[2, 1]} />
          <MeshTransmissionMaterial thickness={0.5} roughness={0.1} transmission={1} color="#2dd4bf" />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[2.5, 0.03, 16, 100]} />
          <meshPhysicalMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Stage 4: The Bricks (Output) */}
      <group position={[0, 0, -75]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[(i % 2) * 1.2 - 0.6, Math.floor(i / 2) * 0.6 - 1, 0]}>
            <boxGeometry args={[1, 0.1, 1]} />
            <meshPhysicalMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>

      {/* Final Horizon: The Ring */}
      <mesh position={[0, 0, -100]}>
        <torusGeometry args={[5, 0.05, 16, 100]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
      </mesh>
    </group>
  );
};

const SceneController = () => {
  const cameraRef = useRef();

  useGSAP(() => {
    gsap.to(cameraRef.current.position, {
      z: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} />
      <Starfield />
      <NebulaGlow />
      <JourneyObjects />
    </>
  );
};

export default function Background3D() {
  return (
    <Canvas dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      {/* Cinematic Fog: Objects emerge from dark */}
      <fog attach="fog" args={['#050505', 1, 60]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
      <SceneController />
    </Canvas>
  );
}
