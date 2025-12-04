'use client'

import React, { useState } from 'react'
import { HiShare, HiCheck } from 'react-icons/hi'

const ShareButton = ({ property, onShare }) => {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/properties/${property?.slug || property?.id}`
    : ''

  const shareText = `Check out this property: ${property?.title || ''}`
  const shareUrl = encodeURIComponent(currentUrl)

  const handleShare = async (platform) => {
    // Track share
    if (onShare) {
      onShare()
    }

    let shareLink = ''

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`
        break
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
        break
      case 'copy':
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(currentUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
        return
      default:
        return
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400')
    }

    setShowShareMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
      >
        <HiShare className="w-5 h-5 text-white/80" />
        <span className="text-white/80 text-sm hidden sm:inline">Share</span>
      </button>

      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />

          {/* Share Menu */}
          <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 z-50 min-w-[200px]">
            <div className="space-y-2">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <span className="w-5 h-5 flex items-center justify-center text-blue-500 font-bold">f</span>
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <span className="w-5 h-5 flex items-center justify-center text-blue-400 font-bold">𝕏</span>
                <span>Twitter</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <span className="w-5 h-5 flex items-center justify-center text-green-500 font-bold">W</span>
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <span className="w-5 h-5 flex items-center justify-center text-blue-600 font-bold">in</span>
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                {copied ? (
                  <>
                    <HiCheck className="w-5 h-5 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <HiShare className="w-5 h-5 text-white/60" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ShareButton

