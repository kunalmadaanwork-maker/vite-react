import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
  MeshTransmissionMaterial, 
  MeshDistortMaterial, 
  Points 
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const getQualityTier = () => {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile || memory <= 2 || cores <= 2) return 'low';
  if (memory <= 4 || cores <= 4) return 'mid';
  return 'high';
};

const SceneBackground = ({ isDark }) => {
  const { scene } = useThree();
  React.useEffect(() => {
    scene.background = new THREE.Color(isDark ? '#030303' : '#FFF8E7');
  }, [isDark, scene]);
  return null;
};

const GalaxyCore = ({ isDark, quality }) => {
  const pointsRef = useRef();
  const originalPositions = useRef(null);
  const currentPositions = useRef(null);
  const velocities = useRef(null);

  const { count, positions, colors } = useMemo(() => {
    const tierCounts = { low: 3000, mid: 8000, high: 15000 };
    const numParticles = tierCounts[quality];
    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);
    const arms = 4;
    const spin = 0.4;

    for (let i = 0; i < numParticles; i++) {
      const r = Math.pow(Math.random(), 0.6) * 80;
      const armIndex = i % arms;
      const branchAngle = (armIndex / arms) * Math.PI * 2;
      const spinAngle = r * spin;
      const angle = branchAngle + spinAngle;
      const scatter = (Math.random() - 0.5) * Math.max(r * 0.15, 1.5);
      const scatterY = (Math.random() - 0.5) * Math.max(r * 0.05, 0.5);

      pos[i * 3]     = Math.cos(angle) * r + scatter;
      pos[i * 3 + 1] = scatterY;
      pos[i * 3 + 2] = Math.sin(angle) * r + scatter;

      const color = new THREE.Color();
      if (r < 15) color.set(isDark ? '#FFFDE7' : '#9E9E9E');
      else if (r < 45) color.set(isDark ? (Math.random() > 0.5 ? '#90CAF9' : '#FFCC80') : (Math.random() > 0.5 ? '#7986CB' : '#78909C'));
      else color.set(isDark ? '#9C27B0' : '#B0BEC5');

      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
    }
    originalPositions.current = pos.slice();
    currentPositions.current = pos.slice();
    velocities.current = new Float32Array(numParticles * 3);
    return { count: numParticles, positions: pos, colors: col };
  }, [quality, isDark]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const orig = originalPositions.current;
    const curr = currentPositions.current;
    const vel = velocities.current;

    // FIX: Map pointer to a range that matches the galaxy's world scale
    const mouseX = state.pointer.x * 60; 
    const mouseY = state.pointer.y * 30;

    const influenceRadius = quality === 'high' ? 15 : 10;
    const springStrength = 0.03;
    const drag = 0.9;
    const repelStrength = 0.2;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const dx = curr[ix] - mouseX;
      const dy = curr[iy] - mouseY;
      const dist2D = Math.sqrt(dx * dx + dy * dy);

      if (dist2D < influenceRadius && dist2D > 0.1) {
        const force = (influenceRadius - dist2D) / influenceRadius;
        vel[ix] += (dx / dist2D) * force * repelStrength;
        vel[iy] += (dy / dist2D) * force * repelStrength;
      }

      vel[ix] *= drag; vel[iy] *= drag; vel[iz] *= drag;
      curr[ix] += vel[ix] + (orig[ix] - curr[ix]) * springStrength;
      curr[iy] += vel[iy] + (orig[iy] - curr[iy]) * springStrength;
      curr[iz] += vel[iz] + (orig[iz] - curr[iz]) * springStrength;
      posAttr.setXYZ(i, curr[ix], curr[iy], curr[iz]);
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y -= 0.0003;
  });

  return (
    <group position={[0, -8, -30]} rotation={[0.12, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.14} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
};

const NebulaClouds = ({ isDark, quality }) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref1.current) ref1.current.rotation.y = t * 0.04;
    if (ref2.current) ref2.current.rotation.x = -t * 0.025;
    if (ref3.current) ref3.current.rotation.z = t * 0.015;
  });

  return (
    <>
      {/* Organic Violet Nebula */}
      <mesh ref={ref1} position={[-18, 4, -35]} scale={[1.5, 0.8, 1.2]}>
        <icosahedronGeometry args={[16, 4]} />
        <MeshDistortMaterial 
          distort={0.4} speed={2} radius={1}
          color={isDark ? '#7C3AED' : '#DDD6FE'} transparent opacity={0.12} 
        />
      </mesh>

      {/* Organic Amber Nebula */}
      {quality !== 'low' && (
        <mesh ref={ref2} position={[22, -6, -65]} scale={[1.2, 1.4, 0.9]}>
          <icosahedronGeometry args={[20, 4]} />
          <MeshDistortMaterial 
            distort={0.5} speed={1.5} radius={1}
            color={isDark ? '#D97706' : '#FDE68A'} transparent opacity={0.10} 
          />
        </mesh>
      )}

      {/* Organic Teal Nebula */}
      {quality !== 'low' && (
        <mesh ref={ref3} position={[0, 8, -95]} scale={[1.8, 0.7, 1.3]}>
          <icosahedronGeometry args={[22, 4]} />
          <MeshDistortMaterial 
            distort={0.3} speed={2.5} radius={1}
            color={isDark ? '#0D9488' : '#CCFBF1'} transparent opacity={0.08} 
          />
        </mesh>
      )}
    </>
  );
};

const SpaceObjects = ({ isDark, quality }) => {
  const clusterPositions = useMemo(() => {
    const count = 400; const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 2.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const ribbonPositions = useMemo(() => {
    const count = 600; const pos = new Float32Array(count * 3);
    const R = 10, r = 2.5;
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      pos[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
      pos[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      pos[i * 3 + 2] = r * Math.sin(v);
    }
    return pos;
  }, []);

  return (
    <group>
      <Float position={[10, 3, -28]} speed={1.2} floatIntensity={0.6}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={400} array={clusterPositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.12} color={isDark ? '#FFC857' : '#F59E0B'} transparent opacity={0.9} sizeAttenuation depthWrite={false} />
        </points>
      </Float>

      <points position={[-14, 0, -58]} rotation={[Math.PI / 2.5, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={600} array={ribbonPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.07} color={isDark ? '#818CF8' : '#6366F1'} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>

      {/* FINAL DESTINATION: Light source for Contact Section */}
      <Float position={[0, 0, -130]} speed={2} floatIntensity={1}>
        <mesh scale={[1, 1, 1]}>
          <icosahedronGeometry args={[6, 4]} />
          <MeshTransmissionMaterial 
            transmission={1} thickness={2} roughness={0} chromaticAberration={0.5}
            color={isDark ? '#C084FC' : '#A78BFA'} transparent opacity={0.4}
          />
        </mesh>
        <pointLight intensity={10} color="#C084FC" distance={30} />
      </Float>
    </group>
  );
};

const RocketCamera = () => {
  const cameraRef = useRef();

  useGSAP(() => {
    if (!cameraRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    // Smooth linear journey without abrupt offsets
    tl.to(cameraRef.current.position, { z: -130, x: 0, y: 0, ease: 'none' }, 0)
      .to(cameraRef.current.rotation, { z: 0.05, ease: 'none' }, 0)
      .to(cameraRef.current.rotation, { z: -0.05, ease: 'none' }, 0.5)
      .to(cameraRef.current.rotation, { z: 0, ease: 'none' }, 1);
  }, []);

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={75} near={0.1} far={200} />;
};

const HeroGlow = ({ isDark }) => {
  const haloPositions = useMemo(() => {
    const count = 1200; const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 20;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.6;
      pos[i * 3 + 2] = -3 - Math.random() * 12;
    }
    return pos;
  }, []);

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={1200} array={haloPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.18} color={isDark ? '#A855F7' : '#8B5CF6'} transparent opacity={0.65} sizeAttenuation depthWrite={false} />
      </points>
      <mesh position={[-18, 6, -10]}>
        <circleGeometry args={[20, 32]} />
        <meshBasicMaterial color={isDark ? '#7C3AED' : '#8B5CF6'} transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[20, -4, -8]}>
        <circleGeometry args={[18, 32]} />
        <meshBasicMaterial color={isDark ? '#C026D3' : '#A21CAF'} transparent opacity={0.10} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export default function Background3D({ theme }) {
  const isDark = theme === 'dark';
  const quality = getQualityTier();

  return (
    <Canvas dpr={quality === 'high' ? [1, 2] : [1, 1]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <Suspense fallback={null}>
        <SceneBackground isDark={isDark} />
        <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 20, 150]} />
        <ambientLight intensity={isDark ? 0.3 : 0.9} />
        <pointLight position={[0, 0, 10]} intensity={isDark ? 4 : 2} color={isDark ? '#C084FC' : '#7C3AED'} />
        <pointLight position={[-20, 10, -50]} intensity={isDark ? 2 : 1} color={isDark ? '#FB923C' : '#D97706'} />
        <pointLight position={[15, -5, -85]} intensity={isDark ? 1.5 : 0.8} color={isDark ? '#2DD4BF' : '#0D9488'} />
        <RocketCamera />
        <HeroGlow isDark={isDark} />
        <GalaxyCore isDark={isDark} quality={quality} />
        <NebulaClouds isDark={isDark} quality={quality} />
        <SpaceObjects isDark={isDark} quality={quality} />
      </Suspense>
    </Canvas>
  );
}
