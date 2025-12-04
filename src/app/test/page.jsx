'use client'

import React, { useState } from 'react'
import Filters from '../components/Filters'
import { getProperties } from '../../lib/propertiesService'

const TestPage = () => {
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({
    purpose: 'all',
    propertyType: 'all',
    subCategory: 'all',
    location: 'all',
    priceRange: { min: 0, max: 10000000 },
    currency: 'all',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)

  // Fetch properties on mount
  React.useEffect(() => {
    async function fetchProps() {
      const data = await getProperties()
      setProperties(data)
    }
    fetchProps()
  }, [])

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
    console.log('Applied filters:', cleanedFilters)
  }

  const handleResetFilters = (resetFilters) => {
    setFilters(resetFilters)
    setAppliedFilters(resetFilters)
  }

  return (
    <div className="min-h-screen bg-primary pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <h1 className="text-3xl font-bold text-white mb-8">Filters Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <Filters
                properties={properties}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

          {/* Applied Filters Display */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Applied Filters</h2>
              <pre className="text-sm text-white/80 bg-white/5 p-4 rounded-lg overflow-auto">
                {JSON.stringify(appliedFilters, null, 2)}
              </pre>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Properties Count</h3>
                <p className="text-white/80">
                  Total properties: <span className="font-semibold text-white">{properties.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage
