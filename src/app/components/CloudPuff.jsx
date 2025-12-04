'use client'

import React from 'react'
import Cloud from './Cloud'

// Simplified cloud puff - fewer spheres for better performance
const CloudPuff = ({ position = [0, 0, 0], baseScale = 1 }) => {
  const offsets = [
    [0, 0, 0],
    [0.4, 0.3, 0.2],
    [-0.3, 0.2, -0.15],
    [0.25, -0.25, 0.2],
  ]

  const scales = [
    [1.0, 1.0, 1.0],
    [0.85, 0.9, 0.9],
    [0.9, 0.85, 0.85],
    [0.8, 0.85, 0.8],
  ]

  return (
    <group position={position}>
      {offsets.map((offset, i) => (
        <Cloud
          key={i}
          position={offset}
          scale={scales[i].map(s => s * baseScale)}
        />
      ))}
    </group>
  )
}

export default CloudPuff

