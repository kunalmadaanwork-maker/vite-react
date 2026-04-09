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

  useFrame(() => { groupRef.current.rotation.y -= 0.0005; });

  return (
    <group ref={groupRef} position={[0, -10, -50]} rotation={[0.2, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} color={isDark ? "#ffffff" : "#334155"} transparent opacity={isDark ? 0.6 : 0.4} sizeAttenuation={true} fog={true} />
      </points>
    </group>
  );
};

const NebulaGlow = ({ isDark }) => {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.y += 0.001;
    ref.current.rotation.z += 0.0005;
  });
  return (
    <mesh ref={ref} position={[0, 0, -40]}>
      <sphereGeometry args={[35, 64, 64]} />
      <MeshTransmissionMaterial thickness={10} roughness={0.6} transmission={1} chromaticAberration={0.5} color={isDark ? "#4c1d95" : "#b45309"} transparent opacity={isDark ? 0.15 : 0.08} />
    </mesh>
  );
};

// NEW: The Saturn Rings (Framing the Hero Container)
const SaturnRings = ({ isDark }) => {
  const ringGroup = useRef();
  
  useFrame(() => {
    ringGroup.current.rotation.z -= 0.001;
    ringGroup.current.rotation.y += 0.0005;
  });

  // Tilted backwards and framing the center
  return (
    <group ref={ringGroup} position={[0, 0, -15]} rotation={[1.4, 0, 0.2]}>
      {/* Outer Thin Ring */}
      <mesh>
        <torusGeometry args={[14, 0.02, 16, 100]} />
        <meshBasicMaterial color={isDark ? "#8b5cf6" : "#475569"} transparent opacity={0.6} />
      </mesh>
      {/* Middle Thick Glowing Ring */}
      <mesh>
        <torusGeometry args={[13.5, 0.15, 16, 100]} />
        <meshBasicMaterial color={isDark ? "#c026d3" : "#64748b"} transparent opacity={0.3} />
      </mesh>
      {/* Inner Thin Ring */}
      <mesh>
        <torusGeometry args={[12.8, 0.03, 16, 100]} />
        <meshBasicMaterial color={isDark ? "#2dd4bf" : "#94a3b8"} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// FIXED: Infinite looping, denser asteroid field forming a tunnel
const AsteroidBelt = ({ isDark }) => {
  const meshRef = useRef();
  const count = 300; 
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 25; 
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      const z = -Math.random() * 150; 
      
      const scale = Math.random() * 0.8 + 0.2; 
      const rx = Math.random() * 0.02;
      const ry = Math.random() * 0.02;
      const rz = Math.random() * 0.02;
      temp.push({ x, y, z, scale, rx, ry, rz });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cameraZ = state.camera.position.z;

    particles.forEach((particle, i) => {
      let zOffset = (particle.z - cameraZ) % 150;
      
      if (zOffset > 10) zOffset -= 150;
      if (zOffset < -140) zOffset += 150;

      const finalZ = cameraZ + zOffset;

      dummy.position.set(particle.x, particle.y + Math.sin(time + i) * 0.5, finalZ);
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
      <meshStandardMaterial 
        color={isDark ? "#a78bfa" : "#94a3b8"} 
        emissive={isDark ? "#4c1d95" : "#475569"}
        emissiveIntensity={0.6}
        roughness={0.5} 
        transparent 
        opacity={0.9} 
      />
    </instancedMesh>
  );
};

const JourneyObjects = ({ isDark }) => {
  const coreColor = isDark ? "#c026d3" : "#0f172a"; 
  const vaultColor = isDark ? "#2dd4bf" : "#475569"; 

  return (
    <group>
      <SaturnRings isDark={isDark} />
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
      <ambientLight intensity={isDark ? 0.4 : 1} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 2 : 1.5} color={isDark ? "#c026d3" : "#0f172a"} />
      <SceneController isDark={isDark} />
    </Canvas>
  );
}
