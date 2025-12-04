'use client'

import React from 'react'
import CloudSprite from './CloudSprite'

// A cloud group made of multiple sprites arranged to look like a cloud
const CloudGroup = ({ position = [0, 0, 0], baseScale = 1 }) => {
  // Arrange sprites in a cloud-like formation
  const spriteConfigs = [
    { offset: [0, 0, 0], scale: 1.0, rotation: 0 },
    { offset: [0.3, 0.2, 0], scale: 0.8, rotation: 0.3 },
    { offset: [-0.25, 0.15, 0], scale: 0.9, rotation: -0.2 },
    { offset: [0.2, -0.2, 0], scale: 0.85, rotation: 0.4 },
    { offset: [-0.2, -0.15, 0], scale: 0.75, rotation: -0.3 },
    { offset: [0.4, 0, 0], scale: 0.7, rotation: 0.2 },
    { offset: [-0.35, 0, 0], scale: 0.65, rotation: -0.25 },
  ]

  return (
    <group position={position}>
      {spriteConfigs.map((config, i) => (
        <CloudSprite
          key={i}
          position={[
            config.offset[0] * baseScale,
            config.offset[1] * baseScale,
            config.offset[2]
          ]}
          scale={config.scale * baseScale}
          rotation={config.rotation}
        />
      ))}
    </group>
  )
}

export default CloudGroup

