'use client'

import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { listings, formatPrice } from '../Data'
import Button from './Button'
import { HiOutlineSearch, HiOutlineMail } from 'react-icons/hi'
import { motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'

const FeaturedProperties = () => {
  const [featuredListings, setFeaturedListings] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        console.log('🔍 [Header Featured] Fetching properties...')
        const response = await fetch('/api/properties/featured?limit=5')
        console.log('🔍 [Header Featured] Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('🔍 [Header Featured] Data received:', data)
        
        if (data.error) {
          console.error('❌ [Header Featured] API returned error:', data.error)
          setFeaturedListings(listings.slice(0, 5))
        } else if (data.properties && data.properties.length > 0) {
          console.log('✅ [Header Featured] Setting', data.properties.length, 'properties')
          setFeaturedListings(data.properties)
        } else {
          console.warn('⚠️ [Header Featured] No properties in response, using fallback')
          setFeaturedListings(listings.slice(0, 5))
        }
      } catch (error) {
        console.error('❌ [Header Featured] Error fetching featured properties:', error)
        // Fallback to mock data if API fails
        setFeaturedListings(listings.slice(0, 5))
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeaturedProperties()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (featuredListings.length === 0) {
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full -8"
    >
      {/* <h2 className="text-3xl md:text-4xl  text-white mb-6">Featured Properties</h2> */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={15}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="featured-properties-swiper"
      >
        {featuredListings.map((listing, index) => (
          <SwiperSlide key={listing.id}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 1.2 + (index * 0.1),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="overflow-hidden text-whitehover:-xl transition-duration-300 h-full"
            >
              <div className="relative w-full h-40 sm:h-48 md:h-56">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                    listing.type === 'sale' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
              </div>
              <div className="">
                <h6 className="text-base sm:text-lg md:text-xl font-medium text-white mb-1 sm:mb-2 line-clamp-1">
                  {listing.title}
                </h6>
                <p className="!text-[0.8em] text-white capitalize">
                  {listing.price || (listing.priceValue ? formatPrice(listing.priceValue, listing.type) : 'Price on request')}
                </p>
                <p className="text-white !text-[0.8em]">
                   {listing.location}
                </p>
                {/* <div className="flex items-center gap-4 text-sm -600 mb-3">
                  <span>🛏️ {listing.bedrooms} Bed</span>
                  <span>🚿 {listing.bathrooms} Bath</span>
                  <span>📐 {listing.squareFeet.toLocaleString()} sqft</span>
                </div>
                <p className="-600 text-sm line-clamp-2">
                  {listing.description}
                </p> */}
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .featured-properties-swiper .swiper-button-next,
        .featured-properties-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          padding: 8px;
        }
        .featured-properties-swiper .swiper-button-next:after,
        .featured-properties-swiper .swiper-button-prev:after {
          font-size: 10px;
        }
        .featured-properties-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }
        .featured-properties-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </motion.div>
  )
}


const Header = () => {
  return (
    <div className="w-full relative h-auto min-h-[600px] max-h-[900px] md:h-screen">
      {/* Decorative vertical line with dots - only absolute on md+ */}
      <div className="hidden md:flex absolute left-8 md:left-4 top-0 bottom-0 items-center h-full z-10">
        <div className="relative h-full flex py-6 flex-col items-center">
          {/* Top dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="w-3 h-3 rounded-full bg-white relative z-10"
          ></motion.div>
          {/* Vertical line - positioned to touch dots */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="w-0.5 flex-1 bg-white/30 origin-center"
            style={{ marginTop: '-1.5px', marginBottom: '-1.5px' }}
          ></motion.div>
          {/* Bottom dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.8,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="w-3 h-3 rounded-full bg-white relative z-10"
          ></motion.div>
        </div>
      </div>

      <div className="w-full px-2 md:px-8 lg:px-16 py-8  h-full md:h-auto gap-[1em] md:py-0 lg:h-full  flex flex-col justify-between items-start">
        {/* Logo - normal flow on mobile, absolute on md+ */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
         animate={{ opacity: 1, scale: 1, rotate: 0 }}
         transition={{ 
           duration: 1, 
           delay: 0.1,
           type: "spring",
           stiffness: 150,
           damping: 12
         }}
         className='relative md:absolute top-0  right-0 md:right-[5%] mb-4 md:mb-0 w-24 h-24 w-[10em] h-[10em] lg:w-[20em] lg:h-[20em]'
       >
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-full h-full"
        >
          <Image
            src="/logo.png"
            alt="Kratos Realty Agency Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        </motion.div> 
      

        {/* Company Name */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1, 
          delay: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="flex flex-wrap md:max-w-2xl lg:max-w-5xl gap-2 md:gap-4 mt-4 md:mt-0"
      >
      <motion.h1 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 1, 
          delay: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 12
        }}
        className="text-3xl sm:text-4xl   md:!text-[4em] lg:!text-[7em] text-white mb-2 md:mb-6 leading-tight"
      >
          Kratos 
        </motion.h1>

        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 12
          }}
          className=" sm:text-4xl  md:!text-[4em] lg:!text-[7em] text-white mb-2 md:mb-6 leading-tight"
        >
          Realty 
        </motion.h1>

        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 12
          }}
          className="text-3xl sm:text-4xl  md:!text-[4em] lg:!text-[7em] text-white mb-2 md:mb-6 leading-tight"
        >
          Agency 
        </motion.h1>


        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="!text-[0.8em] 2xl:hidden mt-4 sm:mt-8 md:mt-[10em] text-white leading-relaxed max-w-lg mb-4 md:mb-8"
        >
          Where every property tells a story, and every transaction begins a new chapter in your real estate journey.
        </motion.p>
      </motion.div>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="!text-[0.8em] hidden 2xl:block mt-4 sm:mt-8 md:mt-[10em] text-white leading-relaxed max-w-lg mb-4 md:mb-8"
        >
          Where every property tells a story, and every transaction begins a new chapter in your real estate journey.
        </motion.p>
        

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="flex flex-row gap-3 sm:gap-4 mb-4 md:mb-8 w-full"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto"
          >
            <Link href="/properties">
              <Button variant="primary">
                <HiOutlineSearch className="w-4 h-4 sm:w-5 sm:h-5" />
               Explore Properties
              </Button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto"
          >
            <Link href="/#contactUs">
              <Button variant="secondary">
                <HiOutlineMail className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Featured Properties - normal flow on mobile, absolute on md+ */}
        <div className='relative lg:absolute bottom-0 lg:max-w-4xl right-0 lg:right-0 w-full lg:w-2/3 mt-8 md:mt-0  md:px-0'>
        <FeaturedProperties />
        </div>
       
      </div>
    </div>
  )
}

export default Header
