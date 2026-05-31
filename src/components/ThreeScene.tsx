// @ts-nocheck
'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Float, Sparkles, Line, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Device capability checker to ensure smooth performance
function getParticleCount(high: number, low: number) {
  if (typeof window === 'undefined') return high;
  const isMobile = window.innerWidth < 768;
  const isLowEnd = (navigator.hardwareConcurrency || 4) <= 4;
  return (isMobile || isLowEnd) ? low : high;
}

// Custom GLSL Shader for the pulsating outer Cyber Shield
const CyberShieldMaterial = shaderMaterial(
  { time: 0, colorA: new THREE.Color('#ec4899'), colorB: new THREE.Color('#8b5cf6') },
  // vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Dynamic sweeping grid effect across the sphere
      float gridX = sin(vPosition.x * 8.0 + time) * 0.5 + 0.5;
      float gridY = sin(vPosition.y * 8.0 + time * 1.2) * 0.5 + 0.5;
      float alpha = (gridX * gridY) * 0.6 + 0.1;
      
      // Pulse glow based on time and vertical position
      float pulse = sin(time * 2.0 - vPosition.y) * 0.5 + 0.5;
      vec3 finalColor = mix(colorA, colorB, pulse * vUv.x);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ CyberShieldMaterial });

function CyberCore() {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.time = t;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.15;
      innerRef.current.rotation.y = t * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = t * -0.05;
      outerRef.current.rotation.y = t * -0.08;
    }
  });

  return (
    <group>
      {/* Inner Dense Data Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshBasicMaterial color="#ec4899" wireframe wireframeLinewidth={2} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Outer Cyber Shield running the custom shader */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[4, 32, 32]} />
        {/* @ts-ignore - custom shader material injected via extend */}
        <cyberShieldMaterial ref={materialRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// Data Streams representing incoming network traffic mapping
function DataStreams() {
  const lineCount = getParticleCount(20, 8);
  const lines = useMemo(() => {
    return new Array(lineCount).fill(0).map(() => {
      const radius = 5 + Math.random() * 5;
      const height = (Math.random() - 0.5) * 12;
      const speed = 0.1 + Math.random() * 0.4;
      const points = [];
      for(let i=0; i <= 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, height + Math.sin(angle * 2) * 2, Math.sin(angle) * radius));
      }
      const curve = new THREE.CatmullRomCurve3(points, true);
      return { curve, speed, radius };
    });
  }, [lineCount]);

  const refs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    refs.current.forEach((ref, i) => {
      if(ref) {
        ref.rotation.y = t * lines[i].speed * (i % 2 === 0 ? 1 : -1);
        ref.rotation.z = Math.sin(t * 0.5 + i) * 0.1;
      }
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <group key={i} ref={(el) => { if(el) refs.current[i] = el; }}>
          <Line 
            points={line.curve.getPoints(64)}
            color={i % 3 === 0 ? '#8b5cf6' : (i % 2 === 0 ? '#ec4899' : '#06b6d4')}
            opacity={0.25}
            transparent
            lineWidth={1.5}
          />
        </group>
      ))}
    </group>
  );
}

// Subtle abstract starfield for depth
function Starfield() {
  const [positions, colors] = useMemo(() => {
    const count = getParticleCount(2500, 800);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 25;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      color.setHSL(0.8 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if(ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Global Camera Parallax based on actual mouse position
function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    // Smooth damp towards mouse position
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 2.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.current.y * 2.5, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#05010a] overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#05010a', 10, 30]} />
        
        {/* Cinematic 3-point lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#ec4899" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#8b5cf6" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#06b6d4" distance={20} />
        
        <CameraRig />
        
        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
          <CyberCore />
          <DataStreams />
        </Float>
        
        <Starfield />
        <Sparkles count={getParticleCount(250, 60)} scale={18} size={2.5} speed={0.4} opacity={0.4} color="#f9a8d4" />
      </Canvas>
      
      {/* Premium Vignette Overlay for depth and text readability */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05010a_100%)] opacity-90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05010a]/50 to-[#05010a]" />
    </div>
  );
}
