'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Cloud = ({ position = [0, 0, 0], scale = [1, 1, 1] }) => {
  const meshRef = useRef()

  // Improved cloud shader material for realistic puffy clouds
  const cloudMaterial = useMemo(() => {
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      void main() {
        vPosition = position;
        vNormal = normal;
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uLightDirection;
      
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      // Improved hash function for better noise
      vec3 hash3(vec3 p) {
        p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
                 dot(p, vec3(269.5, 183.3, 246.1)),
                 dot(p, vec3(113.5, 271.9, 124.6)));
        return fract(sin(p) * 43758.5453123);
      }

      // Smooth 3D noise
      float noise3D(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        vec3 c000 = hash3(i + vec3(0.0, 0.0, 0.0));
        vec3 c100 = hash3(i + vec3(1.0, 0.0, 0.0));
        vec3 c010 = hash3(i + vec3(0.0, 1.0, 0.0));
        vec3 c110 = hash3(i + vec3(1.0, 1.0, 0.0));
        vec3 c001 = hash3(i + vec3(0.0, 0.0, 1.0));
        vec3 c101 = hash3(i + vec3(1.0, 0.0, 1.0));
        vec3 c011 = hash3(i + vec3(0.0, 1.0, 1.0));
        vec3 c111 = hash3(i + vec3(1.0, 1.0, 1.0));
        
        float x00 = mix(c000.x, c100.x, f.x);
        float x10 = mix(c010.x, c110.x, f.x);
        float x01 = mix(c001.x, c101.x, f.x);
        float x11 = mix(c011.x, c111.x, f.x);
        
        float y0 = mix(x00, x10, f.y);
        float y1 = mix(x01, x11, f.y);
        
        return mix(y0, y1, f.z);
      }

      // Simplified FBM - fewer octaves for better performance
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        // Reduced to 3 octaves for performance
        for (int i = 0; i < 3; i++) {
          value += amplitude * noise3D(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }

      void main() {
        vec3 pos = vWorldPosition * 0.2;
        pos += uTime * 0.01;
        
        // Simplified cloud density
        float density = fbm(pos);
        
        // Create smooth spherical falloff
        float dist = length(vPosition);
        float shape = 1.0 - smoothstep(0.2, 1.0, dist);
        
        // Combine density and shape
        float cloud = density * shape;
        cloud = smoothstep(0.3, 0.7, cloud);
        
        // Simple lighting
        vec3 normal = normalize(vNormal);
        float light = dot(normal, normalize(uLightDirection)) * 0.5 + 0.5;
        
        // Mix colors
        vec3 color = mix(uColor2, uColor1, light);
        
        // Apply alpha
        float alpha = cloud * 0.8;
        if (alpha < 0.01) discard;
        
        gl_FragColor = vec4(color, alpha);
      }
    `

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Vector3(1.0, 1.0, 1.0) }, // Bright white
        uColor2: { value: new THREE.Vector3(0.6, 0.65, 0.7) }, // Shadow gray
        uLightDirection: { value: new THREE.Vector3(1.0, 1.0, 0.3).normalize() }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending
    })
  }, [])

  // Animate the cloud
  useFrame((state) => {
    if (meshRef.current) {
      cloudMaterial.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale} material={cloudMaterial}>
      <sphereGeometry args={[1, 16, 16]} />
    </mesh>
  )
}

export default Cloud

