"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function DistortSphere({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;
    meshRef.current.rotation.y += (mx * 0.2 + t * 0.08 - meshRef.current.rotation.y) * 0.04;
    meshRef.current.rotation.x += (my * 0.15 - meshRef.current.rotation.x) * 0.04;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.6, 64, 64]} />
      <MeshDistortMaterial
        color="#4F8CFF"
        distort={0.38}
        speed={2}
        roughness={0.05}
        metalness={0.7}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

function BackgroundShapes() {
  const torusRef = useRef<THREE.Mesh>(null);
  const icoRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torusRef.current) { torusRef.current.rotation.x = t * 0.15; torusRef.current.rotation.y = t * 0.1; }
    if (icoRef.current) { icoRef.current.rotation.y = -t * 0.12; icoRef.current.rotation.z = t * 0.08; }
    if (wireRef.current) { wireRef.current.rotation.x = t * 0.07; wireRef.current.rotation.z = -t * 0.1; }
  });

  return (
    <>
      <mesh ref={torusRef} position={[-3.2, 1.8, -2.5]}>
        <torusGeometry args={[0.55, 0.18, 16, 40]} />
        <meshBasicMaterial color="#4F8CFF" transparent opacity={0.14} wireframe />
      </mesh>
      <mesh ref={icoRef} position={[3.4, -1.5, -3]}>
        <icosahedronGeometry args={[0.7]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.12} wireframe />
      </mesh>
      <mesh ref={wireRef} position={[2.5, 2.8, -4]}>
        <sphereGeometry args={[0.65, 12, 12]} />
        <meshBasicMaterial color="#4F8CFF" transparent opacity={0.1} wireframe />
      </mesh>
    </>
  );
}

export function HeroSphere({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <pointLight color="#4F8CFF" intensity={3} position={[3, 3, 3]} />
        <pointLight color="#A855F7" intensity={2} position={[-3, -2, 2]} />
        <pointLight color="#ffffff" intensity={0.5} position={[0, 0, 5]} />
        <DistortSphere mouseRef={mouseRef} />
        <BackgroundShapes />
      </Suspense>
    </Canvas>
  );
}
