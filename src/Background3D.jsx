// File 2: Background3D.jsx
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

// Custom Glowing Material for "FSD Bricks"
const GlowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#2dd4bf') },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    void main() {
      float pulse = 0.5 + 0.5 * sin(uTime * 2.0);
      gl_FragColor = vec4(uColor * pulse, 1.0);
    }
  `,
});

// Critical: Lowercase tag registration
extend({ GlowMaterial });

const ParticleField = ({ count = 500, color = '#3b82f6', random = true }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = random ? (Math.random() - 0.5) * 10 : 0;
      p[i * 3 + 1] = random ? (Math.random() - 0.5) * 10 : i * 0.1;
      p[i * 3 + 2] = random ? (Math.random() - 0.5) * 10 : 0;
    }
    return p;
  }, [count, random]);

  return (
    <Points>
      <bufferGeometry>
        <float32Attribute attach="attributes-position" args={[points]} />
      </bufferGeometry>
      <pointMaterial size={0.02} color={color} transparent opacity={0.6} />
    </Points>
  );
};

const JourneyScene = () => {
  const cameraRef = useRef();
  const groupRef = useRef();

  useGSAP(() => {
    // Link ScrollY to Camera Z-position
    gsap.to(cameraRef.current.position, {
      z: -60, 
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
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      
      <group ref={groupRef}>
        {/* Scene 1: Manual Writer (Hero) */}
        <group position={[0, 0, 0]}>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.05, 0.02, 2]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </Float>
          <ParticleField count={1000} color="#ffffff" random={true} />
        </group>

        {/* Scene 2: Collaboration (Gemma Core) */}
        <group position={[0, 0, -20]}>
          <Float speed={5} floatIntensity={2}>
            <mesh>
              <sphereGeometry args={[1, 64, 64]} />
              <MeshWobbleMaterial color="#3b82f6" factor={0.4} speed={2} />
            </mesh>
          </Float>
          <ParticleField count={800} color="#2dd4bf" random={false} />
        </group>

        {/* Scene 3: The Factory (Amazon Q Vault) */}
        <group position={[0, 0, -40]}>
          <mesh>
            <icosahedronGeometry args={[2, 2]} />
            <MeshTransmissionMaterial 
              thickness={0.5} 
              roughness={0.1} 
              transmission={1} 
              color="#2dd4bf" 
            />
          </mesh>
          {/* Guardrail Rings */}
          {[1, 1.5, 2].map((scale, i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[scale, 0.02, 16, 100]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
            </mesh>
          ))}
        </group>

        {/* Scene 4: The Output (FSD Bricks) */}
        <group position={[0, 0, -60]}>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[ (i % 3) * 1.5 - 1.5, Math.floor(i / 3) * 1.5 - 2, 0]}
            >
              <boxGeometry args={[1, 0.1, 1.2]} />
              <glowMaterial uColor={new THREE.Color('#2dd4bf')} />
            </mesh>
          ))}
        </group>
      </group>
    </>
  );
};

export default function Background3D() {
  return (
    <Canvas dpr={[1, 2]}>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <JourneyScene />
    </Canvas>
  );
}
