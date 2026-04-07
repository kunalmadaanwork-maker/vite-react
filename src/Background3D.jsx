import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, PerspectiveCamera, Points } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// 1. EXTEND BLOCK COMPLETELY REMOVED. 
// We are using native elements and standard Drei components. Zero risk of constructor crashes.

const Starfield = () => {
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
      {/* Lowercase native Three.js pointsMaterial - never crashes */}
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </Points>
  );
};

const NebulaGlow = () => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y += 0.001;
    ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05);
  });

  return (
    <mesh ref={ref} position={[5, -5, -40]}>
      <sphereGeometry args={[25, 64, 64]} />
      {/* Uppercase Drei Component used directly - perfectly safe */}
      <MeshTransmissionMaterial 
        thickness={5} 
        roughness={0.2} 
        chromaticAberration={1} 
        transmission={1} 
        color="#701a75" 
        transparent 
        opacity={0.15} 
      />
    </mesh>
  );
};

const JourneyObjects = () => {
  return (
    <group>
      {/* Stage 1: The Quill */}
      <Float position={[0, 0, 0]} speed={1.5}>
        <mesh rotation={[0, 0, Math.PI/4]}>
          <cylinderGeometry args={[0.02, 0.01, 2]} />
          <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </Float>

      {/* Stage 2: The Core */}
      <Float position={[3, -1, -30]} speed={3}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshPhysicalMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2} roughness={0} metalness={1} />
        </mesh>
      </Float>

      {/* Stage 3: The Vault */}
      <group position={[-3, 1, -60]}>
        <mesh>
          <icosahedronGeometry args={[2.5, 1]} />
          <MeshTransmissionMaterial thickness={1} roughness={0} transmission={1} color="#c026d3" />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[3.2, 0.02, 16, 100]} />
          <meshPhysicalMaterial color="#c026d3" emissive="#c026d3" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Stage 4: The Bricks */}
      <group position={[0, 0, -90]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[(i % 3) * 1.5 - 1.5, Math.floor(i / 3) * 1.5 - 2, 0]}>
            <boxGeometry args={[1, 0.1, 1.2]} />
            <meshPhysicalMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const SceneController = () => {
  const cameraRef = useRef();
  useGSAP(() => {
    gsap.to(cameraRef.current.position, {
      z: -110,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
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
      <color attach="background" args={['#030303']} />
      <fog attach="fog" args={['#030303', 5, 80]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#7c3aed" />
      <SceneController />
    </Canvas>
  );
}
