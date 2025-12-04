'use client'

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProperties } from '../../lib/propertiesService'
import { formatLocation, getPropertyDetails } from '../../lib/propertyDataDictionary'
import PropertyLists from '../components/PropertyLists'
import Filters from '../components/Filters'
import { 
  HiSearch,
  HiFilter,
  HiViewGrid,
  HiViewList
} from 'react-icons/hi'

const PropertiesPage = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [skip, setSkip] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    purpose: 'all',
    propertyType: 'all',
    subCategory: 'all',
    location: 'all',
    priceRange: { min: 0, max: 10000000 },
    currency: 'all',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Calculate max price for slider
  const maxPrice = useMemo(() => {
    if (properties.length === 0) return 10000000
    const prices = properties
      .map(p => p.pricing?.price || 0)
      .filter(p => p > 0)
    return Math.max(...prices, 10000000)
  }, [properties])

  // Initialize price range on mount
  useEffect(() => {
    if (maxPrice > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: { min: 0, max: maxPrice }
      }))
      setAppliedFilters(prev => ({
        ...prev,
        priceRange: { min: 0, max: maxPrice }
      }))
    }
  }, [maxPrice])

  // Build server filters helper
  const buildServerFilters = useMemo(() => {
    console.log('🔧 [PropertiesPage] Building server filters from:', { appliedFilters, searchQuery })
    
    const serverFilters = {
      purpose: appliedFilters.purpose !== 'all' ? appliedFilters.purpose : undefined,
      propertyType: appliedFilters.propertyType !== 'all' ? appliedFilters.propertyType : undefined,
      location: appliedFilters.location !== 'all' ? appliedFilters.location : undefined,
      priceRange: appliedFilters.priceRange,
      currency: appliedFilters.currency !== 'all' ? appliedFilters.currency : undefined,
      subCategory: appliedFilters.subCategory !== 'all' ? appliedFilters.subCategory : undefined,
      searchQuery: searchQuery || undefined,
    }

    // Add specification filters
    Object.keys(appliedFilters).forEach(key => {
      if (key.startsWith('spec_') && appliedFilters[key] && appliedFilters[key] !== 'all' && appliedFilters[key] !== '') {
        serverFilters[key] = appliedFilters[key]
      }
    })

    // Remove undefined values
    Object.keys(serverFilters).forEach(key => {
      if (serverFilters[key] === undefined) {
        delete serverFilters[key]
      }
    })

    console.log('🔧 [PropertiesPage] Final server filters:', serverFilters)
    return serverFilters
  }, [appliedFilters, searchQuery])

  // Fetch initial properties (first 10) when filters change
  useEffect(() => {
    async function fetchInitialData() {
      console.log('🔄 [PropertiesPage] Fetching initial data with filters:', buildServerFilters)
      setLoading(true)
      setSkip(0)
      setHasMore(true)
      try {
        const result = await getProperties(buildServerFilters, 10, 0)
        console.log('✅ [PropertiesPage] Fetch result:', {
          propertiesCount: result.properties.length,
          hasMore: result.hasMore,
          totalCount: result.totalCount
        })
        setProperties(result.properties)
        setHasMore(result.hasMore)
        setTotalCount(result.totalCount)
      } catch (error) {
        console.error('❌ [PropertiesPage] Error fetching data:', error)
        console.error('❌ [PropertiesPage] Error stack:', error.stack)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [buildServerFilters])

  // Load more properties (infinite scroll)
  const loadMoreProperties = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const nextSkip = skip + 10
      const result = await getProperties(buildServerFilters, 10, nextSkip)
      
      setProperties(prev => [...prev, ...result.properties])
      setHasMore(result.hasMore)
      setSkip(nextSkip)
    } catch (error) {
      console.error('Error loading more properties:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, skip, buildServerFilters])

  // Intersection Observer for infinite scroll
  const sentinelRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    }

    const observerCallback = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
        loadMoreProperties()
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const sentinel = sentinelRef.current
    
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [hasMore, loadingMore, loading, loadMoreProperties])

  // Properties are already filtered server-side, so use them directly
  const filteredProperties = properties

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = (filtersToApply = null) => {
    // Use provided filters or fall back to current filters state
    const filtersToUse = filtersToApply || filters
    
    // Clean up filters before applying - remove empty strings and undefined values
    const cleanedFilters = { ...filtersToUse }
    
    // Remove empty specification filters
    Object.keys(cleanedFilters).forEach(key => {
      if (key.startsWith('spec_')) {
        if (cleanedFilters[key] === '' || cleanedFilters[key] === undefined) {
          delete cleanedFilters[key]
        }
      }
    })
    
    // Also remove 'all' values for main filters to keep it clean
    if (cleanedFilters.purpose === 'all') delete cleanedFilters.purpose
    if (cleanedFilters.propertyType === 'all') delete cleanedFilters.propertyType
    if (cleanedFilters.subCategory === 'all') delete cleanedFilters.subCategory
    if (cleanedFilters.location === 'all') delete cleanedFilters.location
    if (cleanedFilters.currency === 'all') delete cleanedFilters.currency
    
    setAppliedFilters(cleanedFilters)
  }

  const handleResetFilters = (resetFilters) => {
    setFilters(resetFilters)
    setAppliedFilters(resetFilters)
    setSearchQuery('')
  }

  // Helper function to extract text from rich text
  function extractTextFromRichText(richText) {
    if (!richText || !richText.children) return ''
    
    let text = ''
    richText.children.forEach(child => {
      if (child.text) {
        text += child.text + ' '
      } else if (child.children) {
        child.children.forEach(subChild => {
          if (subChild.text) {
            text += subChild.text + ' '
          }
        })
      }
    })
    
    return text.trim()
  }

  if (loading) {
  return (
      <div className="min-h-screen bg-primary pt-12 pb-8 flex items-center justify-center">
        <p className="text-white/80 text-lg">Loading properties...</p>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-primary pt-12 pb-8 !pt-12 !pb-8">
      <div className="flex relative">
        {/* Fixed Sidebar - Desktop Only */}
        <aside className="hidden lg:block fixed left-0 top-12 bottom-0 w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 z-10">
          <div className="h-full p-6">
            <Filters
              properties={properties}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-80 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 !px-4 sm:!px-6 md:!px-8 lg:!px-10 xl:!px-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8 !mb-6 md:!mb-8"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 !mb-2">Browse Properties</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl !text-sm md:!text-base">
              Discover your perfect home from our curated collection of premium properties
            </p>
          </motion.div>

          {/* Search and View Toggle Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 !mb-4"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between !gap-3">
              {/* Search Input */}
              <div className="relative flex-1 w-full sm:max-w-md">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all !pl-10 !pr-4 !py-2 !text-sm"
                />
              </div>

              {/* View Mode Toggle and Filter Button (Mobile) */}
              <div className="flex gap-2 items-center w-full sm:w-auto !gap-2">
                {/* Filter Button - Mobile/Tablet Only */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 !px-3 !py-2"
                >
                  <HiFilter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                {/* View Toggle */}
                <div className="flex gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1 !gap-1 !p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-full transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-secondary text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    } !p-1.5`}
                  >
                    <HiViewGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-full transition-all ${
                      viewMode === 'list' 
                        ? 'bg-secondary text-white' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    } !p-1.5`}
                  >
                    <HiViewList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Modal - Mobile/Tablet Only */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                
                {/* Modal */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-primary border-r border-white/10 z-50"
                >
                  <div className="h-full p-6">
                    <Filters
                      properties={properties}
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onApplyFilters={handleApplyFilters}
                      onResetFilters={handleResetFilters}
                      isModal={true}
                      onClose={() => setShowFilters(false)}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between !mb-4">
            <p className="text-white/80 text-sm !text-sm">
              {loading ? (
                'Loading...'
              ) : (
                <>
                  Showing <span className="font-semibold text-white">{filteredProperties.length}</span> 
                  {totalCount > 0 && ` of ${totalCount}`} properties
                </>
              )}
            </p>
          </div>

          {/* Properties Grid/List */}
          <PropertyLists 
            properties={filteredProperties} 
            viewMode={viewMode}
            loading={loading}
          />

          {/* Infinite Scroll Sentinel */}
          {hasMore && !loading && (
            <div ref={sentinelRef} className="h-20 flex items-center justify-center">
              {loadingMore && (
                <p className="text-white/60 text-sm">Loading more properties...</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default PropertiesPage
