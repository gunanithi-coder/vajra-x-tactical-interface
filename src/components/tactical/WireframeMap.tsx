import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTactical } from '@/contexts/TacticalContext';

const TerrainMesh = ({ isJammed }: { isJammed: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 40, 40);
    const positions = geo.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      // Create terrain-like displacement
      const z = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 1.5 + 
                Math.sin(x * 0.3 + y * 0.2) * 0.8;
      positions.setZ(i, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  const color = isJammed ? '#ff3333' : '#ffb000';

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <meshBasicMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.4}
      />
    </mesh>
  );
};

const PositionMarker = () => {
  const markerRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (markerRef.current) {
      markerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.5;
    }
  });

  return (
    <group ref={markerRef} position={[0, 0.5, 0]}>
      <mesh>
        <coneGeometry args={[0.3, 0.6, 4]} />
        <meshBasicMaterial color="#ffb000" wireframe />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color="#ffb000" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const CoordinateLabels = ({ coordinates }: { coordinates: { lat: number; lng: number; alt: number } }) => {
  return (
    <group position={[-8, 3, -8]}>
      <Text
        fontSize={0.4}
        color="#ffb000"
        anchorX="left"
        font="/fonts/JetBrainsMono-Regular.ttf"
      >
        {`LAT: ${coordinates.lat.toFixed(4)}°`}
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.4}
        color="#ffb000"
        anchorX="left"
        font="/fonts/JetBrainsMono-Regular.ttf"
      >
        {`LNG: ${coordinates.lng.toFixed(4)}°`}
      </Text>
      <Text
        position={[0, -1, 0]}
        fontSize={0.4}
        color="#ffb000"
        anchorX="left"
        font="/fonts/JetBrainsMono-Regular.ttf"
      >
        {`ALT: ${coordinates.alt.toFixed(0)}m`}
      </Text>
    </group>
  );
};

export const WireframeMap = () => {
  const { coordinates, isJammed } = useTactical();
  const gridColor = isJammed ? '#ff3333' : '#ffb000';

  return (
    <div className={`w-full h-full min-h-[400px] ${isJammed ? 'bg-destructive/5' : ''}`}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        
        <Grid
          position={[0, -2, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor={gridColor}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={gridColor}
          fadeDistance={50}
          fadeStrength={1}
          infiniteGrid
        />
        
        <TerrainMesh isJammed={isJammed} />
        <PositionMarker />
        <CoordinateLabels coordinates={coordinates} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
};
