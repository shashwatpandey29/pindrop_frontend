import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { useRef } from "react";

function MorphingBlob({ color, position, speed, distort }: any) {
  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
        />
      </Sphere>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#fdfdfd]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Lights */}
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

        {/* 3D Objects */}
        <MorphingBlob color="#FF3041" position={[3, 2, -2]} speed={2} distort={0.4} />
        <MorphingBlob color="#fb923c" position={[-4, -2, -1]} speed={1.5} distort={0.5} />
        <MorphingBlob color="#fecaca" position={[-2, 3, -4]} speed={2.5} distort={0.6} />
        <MorphingBlob color="#1e293b" position={[0, -3, -3]} speed={1} distort={0.3} />
      </Canvas>
      
      {/* Final blur overlay to make the 3D objects look like "Ambient Glows" */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[100px]" />
    </div>
  );
}