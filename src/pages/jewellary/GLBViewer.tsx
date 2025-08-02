'use client';
import React, { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import { Group, SpotLight } from 'three';
import { motion } from 'framer-motion';

interface GLBModelProps {
  url: string;
}

const GLBModel: React.FC<GLBModelProps> = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  const modelRef = useRef<Group>(null!);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005; // Slow rotation
    }
  });

  return <primitive ref={modelRef} position={[0, -0.005, 0]} rotation={[Math.PI / 3, Math.PI / 1, 0]} scale={2.9} object={gltf.scene} />;
};

// Custom spotlight component
const MovingSpotlight = () => {
  const spotLightRef = useRef<SpotLight>(null!);
  const angle = useRef(0);

  useFrame(({ clock }) => {
    if (spotLightRef.current) {
      // Create a circular motion for the spotlight
      angle.current = clock.getElapsedTime() * 0.5;
      const radius = 4;
      spotLightRef.current.position.x = Math.sin(angle.current) * radius;
      spotLightRef.current.position.z = Math.cos(angle.current) * radius;
      spotLightRef.current.position.y = 5;
      // Make the spotlight always look at the center
      spotLightRef.current.target.position.set(0, 0, 0);
      spotLightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <spotLight
        ref={spotLightRef}
        intensity={1.5}
        angle={0.6}
        penumbra={0.5}
        distance={10}
        castShadow
        color="#ffffff"
      />
    </>
  );
};

const GLBViewer: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  const handleModelLoad = () => {
    setLoaded(true);
  };

  return (
    <motion.div
      className="w-1/2 flex justify-start self-end  items-center  h-[500px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Canvas style={{ height: '500px', width: 'max' }} camera={{ position: [0, 0, 2], fov: 45 }} shadows>
        {/* Main ambient light - provides general illumination */}
        <ambientLight intensity={0.6} color="#ffffff" />

        {/* Key light - main directional light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Fill light - softer light from opposite side */}
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.8}
          color="#c0e0ff"
        />

        {/* Rim light - creates highlight around edges */}
        <directionalLight
          position={[0, -5, -5]}
          intensity={0.6}
          color="#ffe0c0"
        />

        {/* Bottom light to illuminate the underside */}
        <pointLight
          position={[0, -3, 0]}
          intensity={0.5}
          color="#ffffff"
        />

        {/* Moving spotlight for dynamic lighting */}
        <MovingSpotlight />

        {/* Optional environment map for realistic reflections */}
        <Environment preset="sunset" />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.7}
          scale={10}
          blur={1.5}
          far={1}
          color="#000000"
        />

        <Suspense fallback={null}>
          <GLBModel url="/model/ringModel2.glb" />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />

      </Canvas>

      {/* Optional loading indicator */}
      {/* {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg">Loading model...</span>
        </div>
      )} */}
    </motion.div>
  );
};

export default GLBViewer;