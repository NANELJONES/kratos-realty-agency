'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { listings, formatPrice } from '../Data'
import { HiLocationMarker, HiHome, HiOfficeBuilding, HiCube } from 'react-icons/hi'

const FeaturedProperties = () => {
  const [featuredListings, setFeaturedListings] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        console.log('🔍 [Featured Properties] Fetching properties...')
        const response = await fetch('/api/properties/featured?limit=8')
        console.log('🔍 [Featured Properties] Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('🔍 [Featured Properties] Data received:', data)
        
        if (data.error) {
          console.error('❌ [Featured Properties] API returned error:', data.error)
          setFeaturedListings(listings.slice(0, 8))
        } else if (data.properties && data.properties.length > 0) {
          console.log('✅ [Featured Properties] Setting', data.properties.length, 'properties')
          setFeaturedListings(data.properties)
        } else {
          console.warn('⚠️ [Featured Properties] No properties in response, using fallback')
          setFeaturedListings(listings.slice(0, 8))
        }
      } catch (error) {
        console.error('❌ [Featured Properties] Error fetching featured properties:', error)
        // Fallback to mock data if API fails
        setFeaturedListings(listings.slice(0, 8))
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeaturedProperties()
  }, [])

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 relative z-20">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading properties...</div>
        </div>
      </section>
    )
  }

  if (featuredListings.length === 0) {
    return null
  }

  return (
    <section className="w-full py-12 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 relative z-20">
      <div className="">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="huge_text mb-4 leading-tight">
              Our Featured
            
              Properties
            </h2>
          </motion.div>

          {/* Descriptive Text Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-4"
          >
  
            <div className="space-y-3 md:space-y-4">
              <p className="text-sm md:text-base lg:text-lg text-white leading-relaxed">
                Our featured properties represent the finest selection of real estate opportunities available. Each property has been carefully curated based on exceptional location, quality construction, and outstanding value. From luxury residential estates to prime commercial spaces, these listings showcase the best of what the market has to offer.
              </p>
          
            </div>
          </motion.div>
        </div>

        {/* Properties Grid - grouped in pairs, alternating layout */}
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
          {(() => {
            const rows = []
            for (let i = 0; i < featuredListings.length; i += 2) {
              const rowIndex = i / 2
              const firstItem = featuredListings[i]
              const secondItem = featuredListings[i + 1]
              const isEvenRow = rowIndex % 2 === 0
              
              // Even rows: Big (left), Small (right)
              // Odd rows: Small (left), Big (right)
              // We'll always use flex-row, but swap sizes and use order for positioning
              
              rows.push(
                <motion.div
                  key={rowIndex}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: rowIndex * 0.1 }}
                  className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8"
                >
                  {/* First Item - Big on even rows (left), Small on odd rows (left) */}
                  {firstItem && (
                    <motion.div
                      key={firstItem.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: (rowIndex * 0.1) + 0.05 }}
                      className={`flex flex-col w-full md:w-1/2 md:order-1`}
                    >
                      {/* Image Container */}
                      <div className={`relative w-full overflow-hidden mb-3 md:mb-4 ${
                        isEvenRow 
                          ? 'h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]' 
                          : 'h-48 sm:h-56 md:h-72 lg:h-80 xl:h-96'
                      }`}>
                        <Image
                          src={firstItem.image}
                          alt={firstItem.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            firstItem.type === 'sale' 
                              ? 'bg-primary text-white' 
                              : 'bg-secondary text-white'
                          }`}>
                            {firstItem.type === 'sale' ? 'For Sale' : 'For Rent'}
                          </span>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="flex flex-col">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-2">
                          {firstItem.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <HiLocationMarker className="w-4 h-4 text-white/80" />
                          <p className="text-sm md:text-base text-white/80">
                            {firstItem.location}
                          </p>
                        </div>
                        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3">
                          {firstItem.price || (firstItem.priceValue ? formatPrice(firstItem.priceValue, firstItem.type) : 'Price on request')}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <HiHome className="w-4 h-4 text-white/80" />
                            <span className="text-sm md:text-base text-white/80">
                              {firstItem.bedrooms} Bed
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HiOfficeBuilding className="w-4 h-4 text-white/80" />
                            <span className="text-sm md:text-base text-white/80">
                              {firstItem.bathrooms} Bath
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HiCube className="w-4 h-4 text-white/80" />
                            <span className="text-sm md:text-base text-white/80">
                              {firstItem.squareFeet.toLocaleString()} sqft
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Second Item - Small on even rows (right), Big on odd rows (right) */}
                  {secondItem && (
                    <motion.div
                      key={secondItem.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: (rowIndex * 0.1) + 0.1 }}
                      className={`flex flex-col w-full md:w-1/2 md:order-2`}
                    >
                      {/* Image Container */}
                      <div className={`relative w-full overflow-hidden mb-3 md:mb-4 ${
                        isEvenRow 
                          ? 'h-48 sm:h-56 md:h-72 lg:h-80 xl:h-96' 
                          : 'h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]'
                      }`}>
                        <Image
                          src={secondItem.image}
                          alt={secondItem.title}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            secondItem.type === 'sale' 
                              ? 'bg-primary text-white' 
                              : 'bg-secondary text-white'
                          }`}>
                            {secondItem.type === 'sale' ? 'For Sale' : 'For Rent'}
                          </span>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="flex flex-col">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-2">
                          {secondItem.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <HiLocationMarker className="w-4 h-4 text-white/80" />
                          <p className="text-sm md:text-base text-white/80">
                            {secondItem.location}
                          </p>
                        </div>
                        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3">
                          {secondItem.price || (secondItem.priceValue ? formatPrice(secondItem.priceValue, secondItem.type) : 'Price on request')}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <HiHome className="w-4 h-4 text-white/80" />
                            <span className="text-sm md:text-base text-white/80">
                              {secondItem.bedrooms} Bed
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HiOfficeBuilding className="w-4 h-4 text-white/80" />
                            <span className="text-sm md:text-base text-white/80">
                              {secondItem.bathrooms} Bath
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <HiCube className="w-4 h-4 text-white/80" />
                            <span className="text-sm md:text-base text-white/80">
                              {secondItem.squareFeet.toLocaleString()} sqft
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            }
            return rows
          })()}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties
