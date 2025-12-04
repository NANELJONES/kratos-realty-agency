'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const AboutUs = () => {
  const fallbackImage = '/image1.jpg'
  
  // Array of brand images from /public/brand folder
  const images = [
    '/brand/COMPRESSED LOGO.jpg',
    '/brand/COMPRESSED LOGO ANALYSIS.jpg',
    '/brand/NEW CONTACT US.jpg',
    '/brand/COMPRESSED PATTERN.jpg',
    '/brand/COMPRESSED SLOGAN.jpg'
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [failedImages, setFailedImages] = useState(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 2000) // Change image every 2 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [images.length])

  const handleImageError = () => {
    setFailedImages((prev) => new Set([...prev, currentImageIndex]))
  }

  // Get the current image source, using fallback if this image has failed
  const getCurrentImageSrc = () => {
    if (failedImages.has(currentImageIndex)) {
      return fallbackImage
    }
    return images[currentImageIndex]
  }
  return (
    <section id="aboutUs" className="relative w-full py-12 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 z-20">
      <div className="max-w-7xl mx-auto">
        {/* About Us Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <h4 className="text-2xl md:text-3xl lg:text-4xl  text-white mb-2">
            About Us
          </h4>
          <div className="w-16 md:w-24 h-0.5 bg-white"></div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex items-end gap-8 md:gap-12 lg:gap-16">
 
            {/* Main Slogan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 md:mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-[4em]  lg:!text-[5em] font-semibold text-white leading-tight lg:w-[90%]">
             "Reality in the
                
                Clouds of Realty"
              </h1>

               {/* Slogan Continuation with Promise */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6 md:mb-8 relative"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <h4 className="text-2xl  italic  font-thin md:text-3xl lg:text-4xl text-white">
                  is not just a slogan, its a
                </h4>
                <div className="relative">
                  {/* Building Image */}
                  <div className="absolute -top-8 -right-8 md:-top-12 md:-right-12 lg:-top-16 lg:-right-16 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 opacity-80 -z-10">
                    <Image
                      src="/brand/COMPRESSED SLOGAN.jpg"
                      alt="Modern Building"
                      fill
                      className="object-cover object-top -lg"
                    />
                  </div>
                  {/* Promise Word */}
                  <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-secondary relative z-10">
                    Promise
                  </span>
                </div>
              </div>
            </motion.div>
            </motion.div>

           

          </div>

          {/* Right Column */}
          <div className="flex  flex-col-reverse lg:flex-row items-end gap-8 md:gap-12 lg:gap-16 justify-between ">
        


                {/* Placeholder Box */}
                <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full h-64 md:h-80 lg:h-70 bg-gray-300 max-w-lg self-end mt-10 lg:mt-[10em] overflow-hidden -lg"
            >
              <Image
                src={getCurrentImageSrc()}
                alt={`Brand image ${currentImageIndex + 1}`}
                fill
                className="object-cover object-top transition-opacity duration-500"
                priority={currentImageIndex === 0}
                onError={handleImageError}
                unoptimized={failedImages.has(currentImageIndex)}
              />
            </motion.div>

            {/* Body Text Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-4 md:space-y-6 max-w-xl self-start"
            >
              <p className="text-sm md:text-base lg:text-lg text-white leading-relaxed">
                Kratos Realty Agency is a forward-thinking real estate firm that blends local
                market expertise with cutting-edge digital innovation. Based in Ghana, we
                provide buyers, sellers, landlords, and investors with a trusted platform to
                discover and manage real estate opportunities.
              </p>
              <br/>
              <p className="text-sm md:text-base lg:text-lg text-white leading-relaxed">
                With years of dedicated service in the real estate agency industry, we have
                established ourselves as a trusted partner for all your property needs. Our
                team of seasoned professionals brings decades of combined experience, ensuring
                that every transaction is handled with the utmost care, integrity, and
                expertise. We understand the nuances of the market and are committed to
                delivering exceptional results that exceed expectations.
              </p>
            </motion.div>
          </div>





   
      </div>
    </section>
  )
}

export default AboutUs
