'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { NeonText3D } from './NeonText3D'
import { Lighting } from './Lighting'

export function Canvas3D() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Lighting />
          <NeonText3D />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
