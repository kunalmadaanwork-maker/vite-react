import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const SwirlingGalaxy = ({ isDark }) => {
  const groupRef = useRef();
  
  const points = useMemo(() => {
    const count = 4000;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 100;
      const spinAngle = radius * 0.1; 
      const branchAngle = ((i % 3) * 2 * Math.PI) / 3; 
      const angle = branchAngle + spinAngle;
      
      p[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 10; 
      p[i * 3 + 1] = (Math.random() - 0.5) * (15 - radius * 0.1); 
      p[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 10; 
    }
    return p;
  }, []);

  useFrame(() => {
    groupRef.current.rotation.y -= 0.0005;
  });

  return (
    <group ref={groupRef} position={[0, -10, -50]} rotation={[0.2, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
        </bufferGeometry>
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
        color={isDark ? "#4c1d95" : "#b45309"} 
        transparent 
        opacity={isDark ? 0.15 : 0.08} 
      />
    </mesh>
  );
};

// THE FIX: Asteroids are now permanently anchored along the left side of the journey
const AsteroidBelt = ({ isDark }) => {
  const meshRef = useRef();
  const count = 150; 
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Anchored strictly to the left side (X: -8 to -14)
      const x = -11 + (Math.random() - 0.5) * 6;
      // Spread vertically 
      const y = (Math.random() - 0.5) * 20;
      // Stretched along the entire camera journey (Z: 10 down to -130)
      const z = 10 - Math.random() * 140; 
      
      const scale = Math.random() * 0.8 + 0.2; 
      const rx = Math.random() * 0.02;
      const ry = Math.random() * 0.02;
      const rz = Math.random() * 0.02;
      temp.push({ x, y, z, scale, rx, ry, rz });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    const time = Date.now() * 0.0005;
    particles.forEach((particle, i) => {
      // Individual rocks bob and spin, but the belt itself never swings away
      dummy.position.set(particle.x, particle.y + Math.sin(time + i) * 0.5, particle.z);
      dummy.rotation.set(time * particle.rx * 50, time * particle.ry * 50, time * particle.rz * 50);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshPhysicalMaterial 
        color={isDark ? "#8b5cf6" : "#94a3b8"} 
        roughness={0.9} 
        transparent 
        opacity={isDark ? 0.3 : 0.5} 
      />
    </instancedMesh>
  );
};

const JourneyObjects = ({ isDark }) => {
  const coreColor = isDark ? "#c026d3" : "#0f172a"; 
  const vaultColor = isDark ? "#2dd4bf" : "#475569"; 

  return (
    <group>
      {/* The Asteroid Belt now safely occupies the left gutter */}
      <AsteroidBelt isDark={isDark} />

      <Float position={[4, -1, -30]} speed={3}>
        <points>
          <sphereGeometry args={[1.5, 48, 48]} />
          <pointsMaterial color={coreColor} size={0.06} transparent opacity={0.8} />
        </points>
      </Float>

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
      ease: 'power1.inOut', 
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
      <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 10, 90]} />
      <ambientLight intensity={isDark ? 0.2 : 0.8} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 2 : 1} color={isDark ? "#c026d3" : "#0f172a"} />
      <SceneController isDark={isDark} />
    </Canvas>
  );
}
