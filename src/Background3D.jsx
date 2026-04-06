import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { 
  MeshTransmissionMaterial, 
  MeshWobbleMaterial, 
  Float, 
  PerspectiveCamera, 
  Points, 
  PointMaterial 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Explicitly extend the materials to ensure R3F recognizes the tags
extend({ MeshTransmissionMaterial, MeshWobbleMaterial, PointMaterial });

const ParticleField = ({ count = 500, color = '#3b82f6', random = true }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = random ? (Math.random() - 0.5) * 15 : 0;
      p[i * 3 + 1] = random ? (Math.random() - 0.5) * 15 : i * 0.1;
      p[i * 3 + 2] = random ? (Math.random() - 0.5) * 15 : 0;
    }
    return p;
  }, [count, random]);

  return (
    <Points>
      <bufferGeometry>
        {/* FIX: Using the absolute standard bufferAttribute tag */}
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={points} 
          itemSize={3} 
        />
      </bufferGeometry>
      {/* FIX: PointMaterial must be lowercase after extend */}
      <pointMaterial size={0.07} color={color} transparent opacity={0.4} depthWrite={false} />
    </Points>
  );
};

const JourneyScene = () => {
  const cameraRef = useRef();

  useGSAP(() => {
    if (!cameraRef.current) return;
    gsap.to(cameraRef.current.position, {
      z: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} />
      
      <group>
        {/* Stage 1: Manual Writer */}
        <group position={[0, 0, 0]}>
          <Float speed={1.5}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.05, 0.02, 3]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </Float>
          <ParticleField count={1000} color="#ffffff" />
        </group>

        {/* Stage 2: Gemma Core */}
        <group position={[0, 0, -30]}>
          <Float speed={3}>
            <mesh>
              <sphereGeometry args={[1.5, 64, 64]} />
              <meshWobbleMaterial color="#3b82f6" factor={0.6} speed={2} />
            </mesh>
          </Float>
          <ParticleField count={800} color="#2dd4bf" random={false} />
        </group>

        {/* Stage 3: The Factory Vault */}
        <group position={[0, 0, -60]}>
          <mesh>
            <icosahedronGeometry args={[3, 1]} />
            <meshTransmissionMaterial thickness={1} color="#2dd4bf" />
          </mesh>
        </group>

        {/* Stage 4: FSD Bricks */}
        <group position={[0, 0, -90]}>
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh key={i} position={[(i % 3) * 2.5 - 2.5, Math.floor(i / 3) * 1.5 - 3, 0]}>
              <boxGeometry args={[1.5, 0.1, 2]} />
              <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      </group>
    </>
  );
};

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <JourneyScene />
      </Canvas>
    </div>
  );
}
