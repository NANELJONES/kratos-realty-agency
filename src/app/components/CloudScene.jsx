'use client'

import React, { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import CloudPlane from './CloudPlane'

// Camera controller that responds to scroll
const ScrollCamera = ({ scrollProgress }) => {
  const cameraRef = useRef()
  
  useFrame(() => {
    if (cameraRef.current) {
      // Move camera forward in z-space based on scroll
      const zPosition = 5 - scrollProgress * 25
      cameraRef.current.position.z = zPosition
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0, 5]}
      fov={50}
    />
  )
}

// Helper function to generate random value between min and max
const random = (min, max) => Math.random() * (max - min) + min

const CloudScene = ({ scrollProgress = 0 }) => {
  // Generate random sizes for each cloud - memoized so they stay consistent
  const cloudConfigs = useMemo(() => {
    const positions = [
      [0, 2.5, -5], [0, 0.5, -8], [0, -1.5, -12],
      [-2, 1.8, -6], [2.5, 1.2, -7], [-1.5, -0.8, -10], [2, -0.5, -11],
      [-3.5, 2.2, -4], [3.2, 2.5, -4.5], [-2.8, -1.2, -9], [3.5, -1.8, -9.5],
      [0, 3, -15], [0, -2, -18], [-1.5, 0, -20], [1.8, 0.8, -22],
      [0, 2, -28], [0, -1, -32]
    ]
    
    return positions.map((pos, i) => {
      // Different size ranges based on layer/depth
      let widthMin, widthMax, heightMin, heightMax
      
      if (i < 3) {
        // Background layer - large clouds
        widthMin = 1.0
        widthMax = 2.2
        heightMin = 0.35
        heightMax = 0.6
      } else if (i < 7) {
        // Mid layer - medium clouds
        widthMin = 0.6
        widthMax = 1.1
        heightMin = 0.25
        heightMax = 0.45
      } else if (i < 11) {
        // Foreground layer - smaller clouds
        widthMin = 0.4
        widthMax = 0.8
        heightMin = 0.2
        heightMax = 0.35
      } else if (i < 15) {
        // Deep background - very large clouds
        widthMin = 1.2
        widthMax = 2.0
        heightMin = 0.35
        heightMax = 0.55
      } else {
        // Far distance - largest clouds
        widthMin = 1.8
        widthMax = 2.5
        heightMin = 0.45
        heightMax = 0.65
      }
      
      return {
        position: pos,
        width: random(widthMin, widthMax),
        height: random(heightMin, heightMax),
        opacity: random(0.55, 0.95),
        rotationY: random(-0.3, 0.3)
      }
    })
  }, [])

  return (
    <div 
      className="fixed inset-0 w-full h-full"
      style={{ 
        background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #FFFFFF 100%)'
      }}
    >
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          <ScrollCamera scrollProgress={scrollProgress} />
          
          {/* Strategically placed clouds with random sizes */}
          {cloudConfigs.map((config, i) => (
            <CloudPlane
              key={i}
              position={config.position}
              width={config.width}
              height={config.height}
              opacity={config.opacity}
              rotationY={config.rotationY}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  )
}

export default CloudScene

