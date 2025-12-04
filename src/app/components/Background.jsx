'use client'

import React, { useEffect, useRef } from 'react'
import CanvasScrollClip from 'canvas-scroll-clip'

const Background = () => {
  const FRAME_START = 1
  const FRAME_END = 299
  const TOTAL_FRAMES = FRAME_END - FRAME_START + 1
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    // Get scroll height for scroll area
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

    // Initialize canvas-scroll-clip
    // Frame path pattern: /bg_video/Comp/Comp_00001.jpg (with 5-digit padding)
    instanceRef.current = new CanvasScrollClip(containerRef.current, {
      framePath: '/bg_video/Comp/Comp_00001.jpg', // Base path - will be replaced with correct frame number
      frameCount: TOTAL_FRAMES,
      scrollArea: scrollHeight || 5000, // Use actual scroll height or fallback
      startFrame: FRAME_START,
      endFrame: FRAME_END,
      // Custom frame path function since frames start at 1, not 0
      getFramePath: (frameIndex) => {
        const frameNum = FRAME_START + frameIndex
        const paddedFrame = String(frameNum).padStart(5, '0')
        return `/bg_video/Comp/Comp_${paddedFrame}.jpg`
      }
    })

    // Cleanup
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy?.()
        instanceRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {/* Gradient overlay from primary color to transparent */}
    
    </div>
  )
}

export default Background


