import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";

function FloatingSphere({ color, position, speed, distort }: any) {
  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={2}>
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

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#fdfdfd]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        {/* Large Brand Red Orb */}
        <FloatingSphere color="#FF3041" position={[3, 2, -2]} speed={2} distort={0.4} />
        
        {/* Soft Orange Orb */}
        <FloatingSphere color="#fb923c" position={[-4, -2, -1]} speed={1.5} distort={0.5} />
        
        {/* Ghost Slate Orb */}
        <FloatingSphere color="#94a3b8" position={[0, -3, -3]} speed={1} distort={0.3} />
        
        {/* Soft Pink Orb */}
        <FloatingSphere color="#fecaca" position={[-2, 3, -4]} speed={2.5} distort={0.6} />
      </Canvas>
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[80px]"></div>
    </div>
  );
}