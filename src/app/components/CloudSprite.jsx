'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

const CloudSprite = ({ position = [0, 0, 0], scale = 1, rotation = 0 }) => {
  const meshRef = useRef()
  const texture = useTexture('/test.png')

  // Configure texture - fix upside down issue
  useMemo(() => {
    if (texture) {
      texture.flipY = true // Changed to true to fix upside down
    }
  }, [texture])

  // Make sprite always face camera (billboard effect)
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position)
    }
  })

  if (!texture) return null

  return (
    <mesh ref={meshRef} position={position} rotation={[0, rotation, 0]}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={0.85}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default CloudSprite

