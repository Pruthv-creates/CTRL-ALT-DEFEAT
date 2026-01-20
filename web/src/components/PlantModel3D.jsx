import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Loader } from 'lucide-react';

function Model({ modelPath }) {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={2} />;
}

const PlantModel3D = ({ modelPath }) => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: '#f5f5f5' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <Model modelPath={modelPath} />
                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        autoRotate={false}
                        minDistance={2}
                        maxDistance={10}
                    />
                    <Environment preset="sunset" />
                </Suspense>
            </Canvas>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }}>
                <Loader className="animate-spin text-[#1a4d2e]" size={48} />
            </div>
        </div>
    );
};

export default PlantModel3D;
