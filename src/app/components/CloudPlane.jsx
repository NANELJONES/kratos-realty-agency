'use client'

import React, { useRef, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

const CloudPlane = ({ 
  position = [0, 0, 0], 
  width = 1, 
  height = 1, 
  opacity = 0.9,
  rotationY = 0 
}) => {
  const meshRef = useRef()
  const texture = useTexture('/test.png')
  const { viewport, camera } = useThree()

  // Configure texture - fix upside down
  useMemo(() => {
    if (texture) {
      texture.flipY = true
    }
  }, [texture])

  if (!texture) return null

  // Calculate size based on viewport
  // viewport gives us the world units that fit in the screen
  const actualWidth = width * viewport.width
  const actualHeight = height * viewport.height

  return (
    <mesh ref={meshRef} position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={[actualWidth, actualHeight]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default CloudPlane

