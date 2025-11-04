'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { MeshStandardMaterial, Color } from 'three'
import * as THREE from 'three'

export function NeonText3D() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { text, color, size } = useConfiguratorStore()

  // Calculate scale based on size
  const scaleMap: Record<string, number> = {
    small: 0.5,
    medium: 1,
    large: 1.5,
    'extra-large': 2,
  }

  const scale = scaleMap[size] || 1

  // Create neon glow material
  const neonMaterial = new MeshStandardMaterial({
    color: new Color(color),
    emissive: new Color(color),
    emissiveIntensity: 2,
    metalness: 0.1,
    roughness: 0.1,
  })

  // Subtle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={scale}>
      {/* Using basic text rendering - you can add custom fonts later */}
      <mesh>
        <planeGeometry args={[text.length * 0.8, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Text label for now - replace with Text3D when fonts are available */}
      <group position={[-text.length * 0.4, 0, 0]}>
        {text.split('').map((char, i) => (
          <mesh key={i} position={[i * 0.8, 0, 0]}>
            <boxGeometry args={[0.6, 1, 0.3]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
