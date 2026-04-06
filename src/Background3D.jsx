import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
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

// 1. FIXED: Proper ShaderMaterial definition for R3F
const GlowMaterial = THREE.shaderMaterial || function() {
  return new THREE.ShaderMaterial({
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
        float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
        gl_FragColor = vec4(uColor * pulse, 1.0);
      }
    `,
  });
};

// 2. FIXED: Registration of all custom/special elements
extend({ 
  GlowMaterial: THREE.ShaderMaterial, // Registering the class
  MeshTransmissionMaterial,
  MeshWobbleMaterial,
  PointMaterial
});

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
        {/* FIXED: Using standard bufferAttribute instead of float32Attribute */}
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={points} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointMaterial size={0.05} color={color} transparent opacity={0.6} depthWrite={false} />
    </Points>
  );
};

const JourneyScene = () => {
  const cameraRef = useRef();
  const materialRef = useRef();

  // Animation for the glowing bricks
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  useGSAP(() => {
    if (!cameraRef.current) return;
    
    // Link ScrollY to Camera Z-position (Traveling through the scenes)
    gsap.to(cameraRef.current.position, {
      z: -70, // Slightly deeper for better ending
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
        {/* Scene 1: Manual Writer (Hero) */}
        <group position={[0, 0, 0]}>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.05, 0.02, 2.5]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </Float>
          <ParticleField count={1200} color="#ffffff" random={true} />
        </group>

        {/* Scene 2: Collaboration (Gemma Core) */}
        <group position={[0, 0, -25]}>
          <Float speed={4} floatIntensity={2}>
            <mesh>
              <sphereGeometry args={[1.2, 64, 64]} />
              <meshWobbleMaterial color="#3b82f6" factor={0.6} speed={3} />
            </mesh>
          </Float>
          <ParticleField count={1000} color="#2dd4bf" random={false} />
        </group>

        {/* Scene 3: The Factory (Amazon Q Vault) */}
        <group position={[0, 0, -50]}>
          <mesh>
            <icosahedronGeometry args={[2.5, 3]} />
            <meshTransmissionMaterial 
              thickness={1.5} 
              roughness={0.05} 
              transmission={1} 
              color="#2dd4bf" 
            />
          </mesh>
          {[1.2, 1.8, 2.4].map((scale, i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0.1 * i, 0]}>
              <torusGeometry args={[scale, 0.03, 16, 100]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3} />
            </mesh>
          ))}
        </group>

        {/* Scene 4: The Output (FSD Bricks) */}
        <group position={[0, 0, -75]}>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[ (i % 3) * 2 - 2, Math.floor(i / 3) * 1.5 - 2, 0]}
            >
              <boxGeometry args={[1.2, 0.15, 1.5]} />
              {/* FIXED: Using primitive to mount the custom ShaderMaterial correctly */}
              <primitive 
                object={new THREE.ShaderMaterial({
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
                      float pulse = 0.6 + 0.4 * sin(uTime * 3.0 + gl_FragCoord.x * 0.01);
                      gl_FragColor = vec4(uColor * pulse, 0.9);
                    }
                  `,
                  transparent: true
                })} 
                ref={materialRef} 
                attach="material" 
              />
            </mesh>
          ))}
        </group>
      </group>
    </>
  );
};

export default function Background3D() {
  return (
    <div className="fixed inset-0">
      <Canvas dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 20, 10]} angle={0.2} penumbra={1} intensity={2} />
        <JourneyScene />
      </Canvas>
    </div>
  );
}
