// File 2: Background3D.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const DataCoreMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#2dd4bf'), // Teal
    uColor2: new THREE.Color('#3b82f6'), // Blue
  },
  // Vertex Shader: Breathing effect via sine displacement
  `
  varying vec2 vUv;
  varying float vDistortion;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    // Create a breathing pulse based on vertex position and time
    float distortion = sin(position.y * 2.0 + uTime) * 0.15;
    vDistortion = distortion;
    
    vec3 newPosition = position + normal * distortion;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
  `,
  // Fragment Shader: Glowing tech aesthetic
  `
  varying vec2 vUv;
  varying float vDistortion;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  void main() {
    // Mix colors based on distortion and time
    float mixFactor = vDistortion * 5.0 + 0.5 * sin(uTime * 0.5);
    vec3 finalColor = mix(uColor1, uColor2, clamp(mixFactor, 0.0, 1.0));
    
    // Add a subtle glow based on distance from center (approximate)
    float glow = 0.8 + 0.2 * sin(uTime + vUv.x * 10.0);
    
    gl_FragColor = vec4(finalColor * glow, 0.85);
  }
  `
);

DataCoreMaterial.preload();

const DataCore = () => {
  const meshRef = useRef();
  
  // Pre-allocate objects outside useFrame to prevent memory leaks
  const rotationX = 0;
  const rotationY = 0;

  useFrame((state) => {
    const { clock, pointer } = state;
    const t = clock.getElapsedTime();

    // Update shader time
    meshRef.current.material.uTime = t;

    // Smooth rotation reacting to mouse position
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x, 
      pointer.y * 0.5, 
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y, 
      pointer.x * 0.5, 
      0.05
    );
    
    // Constant slow spin
    meshRef.current.rotation.z += 0.002;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 16]} />
      <DataCoreMaterial transparent wireframe />
    </mesh>
  );
};

export default function Background3D() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 4], fov: 75 }} 
      dpr={[1, 2]}
    >
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <DataCore />
    </Canvas>
  );
}