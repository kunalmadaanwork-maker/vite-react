// File 1: Background3D.jsx
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
  MeshTransmissionMaterial, 
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

const GalaxyCore = ({ isDark, quality }) => {
  const pointsRef = useRef();
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0));
  const isHovering = useRef(false);

  const { count, colors, sizes, originalPositions } = useMemo(() => {
    const tierCounts = { low: 3000, mid: 7000, high: 15000 };
    const numParticles = tierCounts[quality];
    
    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);
    const siz = new Float32Array(numParticles);

    const arms = 4;
    const spin = 0.3;

    for (let i = 0; i < numParticles; i++) {
      const r = Math.random() * 100;
      const armIndex = i % arms;
      const branchAngle = (armIndex / arms) * Math.PI * 2;
      const spinAngle = r * spin;
      const angle = branchAngle + spinAngle;
      
      // Gaussian scatter
      const scatter = (Math.random() - 0.5) * (r * 0.2);
      
      pos[i * 3] = Math.cos(angle) * r + scatter;
      pos[i * 3 + 1] = (Math.random() - 0.5) * (10 / (r * 0.1 + 1)); 
      pos[i * 3 + 2] = Math.sin(angle) * r + scatter;

      // Color Zoning
      let color = new THREE.Color();
      if (r < 20) {
        color.set(isDark ? '#FFF5C0' : '#BDBDBD'); // Core
        siz[i] = 0.3;
      } else if (r < 60) {
        const mix = Math.random() > 0.5 ? '#C8E6FF' : '#FFB347';
        color.set(isDark ? mix : '#94A3B8'); // Mid
        siz[i] = 0.15;
      } else {
        color.set(isDark ? '#6B21A8' : '#CBD5E1'); // Outer
        siz[i] = 0.05;
      }
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return { count: numParticles, colors: col, sizes: siz, originalPositions: pos };
  }, [quality, isDark]);

  const currentPositions = useMemo(() => new Float32Array(originalPositions), [originalPositions]);
  const velocities = useMemo(() => new Float32Array(originalPositions.length), [originalPositions]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      isHovering.current = true;
      // Simple NDC to World projection for Z=0 plane
      mouseWorld.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0
      ).unproject(pointsRef.current?.matrixWorld || new THREE.Matrix4());
    };
    const handleMouseLeave = () => { isHovering.current = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const influenceRadius = quality === 'high' ? 12 : 8;
    const springStrength = isHovering.current ? 0.03 : 0.06;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      
      const dx = currentPositions[ix] - mouseWorld.current.x;
      const dy = currentPositions[iy] - mouseWorld.current.y;
      const dz = currentPositions[iz] - mouseWorld.current.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < influenceRadius) {
        const force = (influenceRadius - dist) / influenceRadius;
        velocities[ix] += (dx / dist) * force * 0.15;
        velocities[iy] += (dy / dist) * force * 0.15;
        velocities[iz] += (dz / dist) * force * 0.15;
      }

      velocities[ix] *= 0.92;
      velocities[iy] *= 0.92;
      velocities[iz] *= 0.92;

      currentPositions[ix] += velocities[ix] + (originalPositions[ix] - currentPositions[ix]) * springStrength;
      currentPositions[iy] += velocities[iy] + (originalPositions[iy] - currentPositions[iy]) * springStrength;
      currentPositions[iz] += velocities[iz] + (originalPositions[iz] - currentPositions[iz]) * springStrength;

      posAttr.setXYZ(i, currentPositions[ix], currentPositions[iy], currentPositions[iz]);
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y -= 0.0003;
  });

  return (
    <group position={[0, -15, -60]} rotation={[0.15, 0, 0]}>
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={originalPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.1} 
          vertexColors 
          transparent 
          opacity={0.8} 
          sizeAttenuation={true} 
        />
      </Points>
    </group>
  );
};

const NebulaClouds = ({ isDark, quality }) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref1.current.rotation.y = t * 0.05;
    ref2.current.rotation.x = -t * 0.03;
    ref3.current.rotation.z = t * 0.02;
  });

  return (
    <>
      <mesh ref={ref1} position={[-20, 5, -45]}>
        <sphereGeometry args={[18, 32, 32]} />
        <MeshTransmissionMaterial 
          transmission={1} thickness={8} roughness={0.8} chromaticAberration={0.3} 
          color={isDark ? '#7C3AED' : '#DDD6FE'} transparent opacity={0.12} 
        />
      </mesh>
      {(quality !== 'low') && (
        <mesh ref={ref2} position={[25, -8, -75]}>
          <sphereGeometry args={[22, 32, 32]} />
          <MeshTransmissionMaterial 
            transmission={1} thickness={8} roughness={0.8} chromaticAberration={0.3} 
            color={isDark ? '#D97706' : '#FDE68A'} transparent opacity={0.08} 
          />
        </mesh>
      )}
      {(quality === 'high' || quality === 'mid') && (
        <mesh ref={ref3} position={[0, 10, -100]}>
          <sphereGeometry args={[25, 32, 32]} />
          <MeshTransmissionMaterial 
            transmission={1} thickness={8} roughness={0.8} chromaticAberration={0.3} 
            color={isDark ? '#0D9488' : '#CCFBF1'} transparent opacity={0.06} 
          />
        </mesh>
      )}
    </>
  );
};

const SpaceObjects = ({ isDark, quality }) => {
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      <Float position={[8, 2, -35]} speed={1} floatIntensity={0.5}>
        <Points>
          <sphereGeometry args={[1, 16, 16]} />
          <pointsMaterial size={0.08} color="#FFC857" transparent opacity={0.8} />
        </Points>
      </Float>

      <mesh position={[-15, 0, -65]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[12, 3, 2, 80]} />
        <pointsMaterial size={0.05} color="#818CF8" transparent opacity={0.4} />
      </mesh>

      {quality === 'high' && (
        <>
          <mesh position={[30, 15, -110]}>
            <planeGeometry args={[8, 8]} />
            <meshBasicMaterial map={gradientTexture} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
          </mesh>
          {Array.from({ length: 200 }).map((_, i) => (
            <Points key={i} position={[(Math.random()-0.5)*100, (Math.random()-0.5)*100, -40 - Math.random()*80]}>
              <bufferGeometry>
                <float32Attribute attach="attributes-position" args={[new Float32Array([0,0,0])]} />
              </bufferGeometry>
              <pointsMaterial size={0.04} color="white" transparent opacity={0.3} />
            </Points>
          ))}
        </>
      )}
    </group>
  );
};

const RocketCamera = () => {
  const cameraRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2
      }
    });

    tl.to(cameraRef.current.position, { z: -40, x: 3, y: -2, ease: 'none' }, 0)
      .to(cameraRef.current.position, { z: -75, x: -5, y: 4, ease: 'none' }, 0.3)
      .to(cameraRef.current.position, { z: -100, x: 2, y: -1, ease: 'none' }, 0.6)
      .to(cameraRef.current.position, { z: -125, x: 0, y: 0, ease: 'none' }, 0.85);

    tl.to(cameraRef.current.rotation, { z: 0.05, ease: 'none' }, 0)
      .to(cameraRef.current.rotation, { z: -0.08, ease: 'none' }, 0.3)
      .to(cameraRef.current.rotation, { z: 0.03, ease: 'none' }, 0.6)
      .to(cameraRef.current.rotation, { z: 0, ease: 'none' }, 0.85);
  }, []);

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 15]} fov={75} near={0.1} far={200} />;
};

export default function Background3D({ theme }) {
  const isDark = theme === 'dark';
  const quality = getQualityTier();

  return (
    <Canvas 
      dpr={quality === 'high' ? [1, 2] : quality === 'mid' ? [1, 1.5] : [1, 1]}
      gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={[isDark ? '#030303' : '#FFF8E7', 5, 130]} />
      <ambientLight intensity={isDark ? 0.2 : 0.8} />
      <pointLight position={[0, 0, -20]} intensity={isDark ? 3 : 1.5} color={isDark ? "#C084FC" : "#7C3AED"} />
      <pointLight position={[-20, 10, -60]} intensity={isDark ? 2 : 1} color={isDark ? "#FB923C" : "#D97706"} />
      <pointLight position={[15, -5, -90]} intensity={isDark ? 1.5 : 0.8} color={isDark ? "#2DD4BF" : "#0D9488"} />
      
      <RocketCamera />
      <GalaxyCore isDark={isDark} quality={quality} />
      <NebulaClouds isDark={isDark} quality={quality} />
      <SpaceObjects isDark={isDark} quality={quality} />
    </Canvas>
  );
}
