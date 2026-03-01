import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PhotoMeshProps {
  imageUrl: string;
}

function PhotoMesh({ imageUrl }: PhotoMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const progressRef = useRef(0);
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      textureRef.current = tex;
      if (meshRef.current) {
        (meshRef.current.material as THREE.MeshBasicMaterial).map = tex;
        (meshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }
    });
    return () => {
      textureRef.current?.dispose();
    };
  }, [imageUrl]);

  useEffect(() => {
    (camera as THREE.PerspectiveCamera).position.z = 3;
  }, [camera]);

  useFrame((_, delta) => {
    progressRef.current = Math.min(progressRef.current + delta * 0.3, 1);
    const eased = 1 - Math.pow(1 - progressRef.current, 3);
    (camera as THREE.PerspectiveCamera).position.z = 3 - eased * 1.2;
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(Date.now() * 0.0003) * 0.04;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.2, 2.0]} />
      <meshBasicMaterial />
    </mesh>
  );
}

interface ThreePhotoCanvasProps {
  imageUrl: string;
}

export default function ThreePhotoCanvas({ imageUrl }: ThreePhotoCanvasProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1} />
      <PhotoMesh imageUrl={imageUrl} />
    </Canvas>
  );
}
