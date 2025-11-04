'use client'

import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

export function Lighting() {
  const { color } = useConfiguratorStore()
  const { scene } = useThree()

  // Update fog color based on neon color
  useEffect(() => {
    scene.fog = new THREE.Fog(color, 2, 10)
  }, [color, scene])

  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
      />
      
      {/* Colored point lights for neon effect */}
      <pointLight
        position={[2, 2, 2]}
        color={color}
        intensity={2}
        distance={10}
      />
      <pointLight
        position={[-2, -2, 2]}
        color={color}
        intensity={1.5}
        distance={10}
      />
      
      {/* Rim light for edge glow */}
      <pointLight
        position={[0, 0, -5]}
        color={color}
        intensity={1}
        distance={10}
      />
    </>
  )
}
