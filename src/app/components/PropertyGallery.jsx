'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { HiPlay, HiX } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

const PropertyGallery = ({ coverImage, gallery = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  // Combine cover image with gallery
  const allMedia = [
    { url: coverImage?.url, type: 'image', mimeType: null },
    ...(gallery || []).map(item => ({
      url: item.url,
      type: item.mimeType?.startsWith('video/') ? 'video' : 'image',
      mimeType: item.mimeType,
    }))
  ].filter(item => item.url)

  const handleMediaClick = (index) => {
    const media = allMedia[index]
    if (media.type === 'video') {
      setSelectedVideo(media.url)
      setIsVideoModalOpen(true)
    } else {
      setSelectedIndex(index)
    }
  }

  const closeModal = () => {
    setSelectedIndex(null)
    setIsVideoModalOpen(false)
    setSelectedVideo(null)
  }

  const isVideo = (url, mimeType) => {
    if (mimeType) return mimeType.startsWith('video/')
    return url?.match(/\.(mp4|webm|ogg|mov)$/i)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Swiper */}
        <Swiper
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[Navigation, Thumbs]}
          className="main-swiper"
        >
          {allMedia.map((media, index) => (
            <SwiperSlide key={index}>
              <div 
                className="relative w-full h-[400px] md:h-[500px] max-h-[500px] rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => handleMediaClick(index)}
              >
                {media.type === 'video' || isVideo(media.url, media.mimeType) ? (
                  <>
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <HiPlay className="w-16 h-16 text-white" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={media.url}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnails Swiper */}
        {allMedia.length > 1 && (
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={12}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs]}
            className="thumbs-swiper"
          >
            {allMedia.map((media, index) => (
              <SwiperSlide key={index} className="!w-32 md:!w-40">
                <div
                  className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => handleMediaClick(index)}
                >
                  {media.type === 'video' || isVideo(media.url, media.mimeType) ? (
                    <>
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                        <HiPlay className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-secondary transition-colors z-10"
            >
              <HiX className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allMedia[selectedIndex]?.url}
                alt={`Gallery image ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>
            {selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex(selectedIndex - 1)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-secondary transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                ←
              </button>
            )}
            {selectedIndex < allMedia.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex(selectedIndex + 1)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-secondary transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-secondary transition-colors z-10"
            >
              <HiX className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PropertyGallery

