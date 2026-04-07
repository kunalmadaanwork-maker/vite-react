// File 2: Background3D.jsx (FINAL CRASH-PROOF FIX)
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { MeshTransmissionMaterial, MeshWobbleMaterial, Float, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// 1. FIXED: We MUST extend all custom or library materials explicitly
extend({ PointMaterial, MeshTransmissionMaterial, MeshWobbleMaterial });

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
        {/* 2. FIXED: Replaced custom float32Attribute tag with standard bufferAttribute */}
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={points} 
          itemSize={3} 
        />
      </bufferGeometry>
      {/* 3. FIXED: PointMaterial must be lowercase in JSX */}
      <pointMaterial size={0.07} color={color} transparent opacity={0.4} depthWrite={false} />
    </Points>
  );
};

// rest of your JourneyScene...
