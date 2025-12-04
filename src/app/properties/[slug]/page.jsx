'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  HiLocationMarker, 
  HiHome, 
  HiOfficeBuilding, 
  HiCube,
  HiCheckCircle,
  HiEye
} from 'react-icons/hi'
import PropertyGallery from '../../components/PropertyGallery'
import ContactForm from '../../components/ContactForm'
import ShareButton from '../../components/ShareButton'
import RichTextRenderer from '../../components/RichTextRenderer'
import { formatLocation, formatPrice, getPropertySpecification, formatEnumValue } from '../../../lib/propertyDataDictionary'
import { trackView, trackShare, initializeTracker } from '../../../lib/viewTracker'

const PropertyPage = () => {
  const params = useParams()
  const slug = params.slug
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize tracker
    initializeTracker()

    async function fetchProperty() {
      try {
        setLoading(true)
        const response = await fetch(`/api/properties/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Property not found')
          } else {
            setError('Failed to load property')
          }
          return
        }

        const data = await response.json()
        setProperty(data)
        
        // Track view
        if (data.id) {
          trackView(data.id)
        }
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('An error occurred while loading the property')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProperty()
    }
  }, [slug])

  const handleShare = () => {
    if (property?.id) {
      trackShare(property.id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary pt-12 pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin -full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading property...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-primary pt-12 pb-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/80 text-xl mb-4">{error || 'Property not found'}</p>
          <a href="/properties" className="text-secondary hover:text-[#d19a2e] transition-colors">
            ← Back to Properties
          </a>
        </div>
      </div>
    )
  }

  const location = formatLocation(property.location)
  const price = formatPrice(property.pricing, property.purpose)
  const spec = getPropertySpecification(property)
  const purpose = property.purpose || 'sale'
  const status = property.propertyStatus || 'available'

  return (
    <div className="min-h-screen bg-primary pt-12 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <a 
            href="/properties" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            ← Back to Properties
          </a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font- text-white mb-3">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-white/80">
                      <HiLocationMarker className="w-5 h-5 text-secondary" />
                      <span>{location}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      purpose === 'sale' 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary text-white'
                    }`}>
                      {purpose === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      status === 'available' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : status === 'sold' || status === 'rented'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/10 text-white/80'
                    }`}>
                      Status: {formatEnumValue(status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton property={property} onShare={handleShare} />
                  <div className="flex items-center gap-1 p-2">
                    <HiEye className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm">{property.views || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl text-white mb-4">Gallery</h2>
              <PropertyGallery 
                coverImage={property.coverImage}
                gallery={property.gallery}
              />
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="space-y-3">
              <span className="text-white/60 text-sm font-medium">Price:</span>
                <div className="flex items-center gap-3 flex-wrap">
               
                  <span className="text-4xl md:text-5xl lg:text-6xl  text-secondary">
                    {price}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    purpose === 'sale' 
                      ? 'bg-primary text-white' 
                      : 'bg-secondary text-white'
                  }`}>
                    {purpose === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  {property.pricing?.minimumDuration && (
                    <span className="text-white/60 text-sm">
                      Minimum: {property.pricing.minimumDuration}
                    </span>
                  )}
                  {property.pricing?.negotiable && (
                    <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                      Negotiable
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 -xl p-6"
            >
              <h2 className="text-2xl font- text-white mb-6">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {spec && spec.data && (
                  <>
                    {property.propertyType === 'housesAndApartments' && (
                      <>
                        {spec.data.bedroom && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiHome className="w-5 h-5" />
                              <span className="text-sm">Bedrooms</span>
                            </div>
                            <p className="text-white font-semibold">{spec.data.bedroom}</p>
                          </div>
                        )}
                        {spec.data.bathroom && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiOfficeBuilding className="w-5 h-5" />
                              <span className="text-sm">Bathrooms</span>
                            </div>
                            <p className="text-white font-semibold">{spec.data.bathroom}</p>
                          </div>
                        )}
                        {spec.data.kitchen && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCube className="w-5 h-5" />
                              <span className="text-sm">Kitchens</span>
                            </div>
                            <p className="text-white font-semibold">{spec.data.kitchen}</p>
                          </div>
                        )}
                        {spec.data.furnishing && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCheckCircle className="w-5 h-5" />
                              <span className="text-sm">Furnishing</span>
                            </div>
                            <p className="text-white font-semibold capitalize">{formatEnumValue(spec.data.furnishing)}</p>
                          </div>
                        )}
                        {spec.data.housesAndApartmentSubCategory && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCheckCircle className="w-5 h-5" />
                              <span className="text-sm">House Type</span>
                            </div>
                            <p className="text-white font-semibold capitalize">{formatEnumValue(spec.data.housesAndApartmentSubCategory)}</p>
                          </div>
                        )}
                      </>
                    )}
                    {property.propertyType === 'offices' && (
                      <>
                        {spec.data.numberOfRooms && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiHome className="w-5 h-5" />
                              <span className="text-sm">Rooms</span>
                            </div>
                            <p className="text-white font-semibold">{spec.data.numberOfRooms}</p>
                          </div>
                        )}
                        {spec.data.washrooms && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiOfficeBuilding className="w-5 h-5" />
                              <span className="text-sm">Washrooms</span>
                            </div>
                            <p className="text-white font-semibold">{spec.data.washrooms}</p>
                          </div>
                        )}
                        {spec.data.totalFloorArea && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCube className="w-5 h-5" />
                              <span className="text-sm">Floor Area</span>
                            </div>
                            <p className="text-white font-semibold">{spec.data.totalFloorArea} sq ft</p>
                          </div>
                        )}
                        {spec.data.receptionArea !== undefined && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCheckCircle className="w-5 h-5" />
                              <span className="text-sm">Reception Area</span>
                            </div>
                            <p className="text-white font-semibold capitalize">
                              {spec.data.receptionArea ? 'Yes' : 'No'}
                            </p>
                          </div>
                        )}
                        {spec.data.furnishing && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCheckCircle className="w-5 h-5" />
                              <span className="text-sm">Furnishing</span>
                            </div>
                            <p className="text-white font-semibold capitalize">{formatEnumValue(spec.data.furnishing)}</p>
                          </div>
                        )}
                        {spec.data.officesSubCategory && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCheckCircle className="w-5 h-5" />
                              <span className="text-sm">Office Type</span>
                            </div>
                            <p className="text-white font-semibold capitalize">
                              {Array.isArray(spec.data.officesSubCategory) && spec.data.officesSubCategory.length > 0
                                ? spec.data.officesSubCategory.map(cat => formatEnumValue(cat)).join(', ')
                                : formatEnumValue(spec.data.officesSubCategory)}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    {property.propertyType === 'lands' && (
                      <>
                        {spec.data.soilType && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCube className="w-5 h-5" />
                              <span className="text-sm">Soil Type</span>
                            </div>
                            <p className="text-white font-semibold capitalize">{spec.data.soilType}</p>
                          </div>
                        )}
                        {spec.data.topography && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCube className="w-5 h-5" />
                              <span className="text-sm">Topography</span>
                            </div>
                            <p className="text-white font-semibold capitalize">{spec.data.topography}</p>
                          </div>
                        )}
                        {spec.data.documentAvailability !== undefined && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCheckCircle className="w-5 h-5" />
                              <span className="text-sm">Documents</span>
                            </div>
                            <p className="text-white font-semibold capitalize">
                              {spec.data.documentAvailability ? 'Available' : 'Not Available'}
                            </p>
                          </div>
                        )}
                        {spec.data.landSubCategory && (
                          <div>
                            <div className="flex items-center gap-2 text-white/60 mb-1">
                              <HiCheckCircle className="w-5 h-5" />
                              <span className="text-sm">Land Type</span>
                            </div>
                            <p className="text-white font-semibold capitalize">{formatEnumValue(spec.data.landSubCategory)}</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
                {property.propertySize && (
                  <div>
                    <div className="flex items-center gap-2 text-white/60 mb-1">
                      <HiCube className="w-5 h-5" />
                      <span className="text-sm">Size</span>
                    </div>
                    <p className="text-white font-semibold capitalize">
                      {property.propertySize.size.toLocaleString()} {property.propertySize.unit}
                    </p>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-1">
                    <HiCheckCircle className="w-5 h-5" />
                    <span className="text-sm">Type</span>
                  </div>
                  <p className="text-white font-semibold capitalize">{formatEnumValue(property.propertyType)}</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {property.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 -xl p-6"
              >
                <h2 className="text-2xl font- text-white mb-6">Description</h2>
                <RichTextRenderer content={property.description} />
              </motion.div>
            )}

            {/* Disclaimer */}
            {property.disclaimer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 -xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">Disclaimer</h3>
                <p className="text-white/80">{property.disclaimer}</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ContactForm property={property} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyPage
