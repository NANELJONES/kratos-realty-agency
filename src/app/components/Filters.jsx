'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { HiX, HiSearch } from 'react-icons/hi'
import { PROPERTY_TYPE_SPECS } from '../../lib/propertyDataDictionary'

// Module-level cache for enums (shared across all Filters component instances)
let globalEnumsCache = null
let globalEnumsCachePromise = null

const Filters = ({ 
  properties = [],
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  isModal = false,
  onClose
}) => {
  const [enums, setEnums] = useState(null)
  const [loading, setLoading] = useState(true)
  const [localFilters, setLocalFilters] = useState(filters)
  const [locationSearch, setLocationSearch] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  // Fetch enums on mount (with module-level caching shared across all instances)
  useEffect(() => {
    // Check if we already have cached enums globally
    if (globalEnumsCache) {
      setEnums(globalEnumsCache)
      setLoading(false)
      return
    }

    // If there's already a fetch in progress, wait for it
    if (globalEnumsCachePromise) {
      globalEnumsCachePromise
        .then(data => {
          setEnums(data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
      return
    }

    // Start a new fetch and cache the promise
    const fetchPromise = fetch('/api/enums')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to fetch enums')
      })
      .then(data => {
        // Cache the enums globally
        globalEnumsCache = data
        globalEnumsCachePromise = null
        setEnums(data)
        setLoading(false)
        return data
      })
      .catch(error => {
        console.error('Error fetching enums:', error)
        globalEnumsCachePromise = null
        setLoading(false)
        throw error
      })

    globalEnumsCachePromise = fetchPromise
  }, [])

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
    if (filters.location && filters.location !== 'all') {
      setLocationSearch(filters.location)
    }
  }, [filters])

  // Search locations
  useEffect(() => {
    const searchLocations = async () => {
      if (locationSearch.length < 2) {
        setLocationSuggestions([])
        setShowLocationSuggestions(false)
        return
      }

      try {
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(locationSearch)}`)
        if (response.ok) {
          const data = await response.json()
          setLocationSuggestions(data.locations || [])
          setShowLocationSuggestions(data.locations && data.locations.length > 0)
        }
      } catch (error) {
        console.error('Error searching locations:', error)
        setLocationSuggestions([])
        setShowLocationSuggestions(false)
      }
    }

    const timeoutId = setTimeout(searchLocations, 300)
    return () => clearTimeout(timeoutId)
  }, [locationSearch])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLocationSuggestions && !event.target.closest('.location-search-container')) {
        setShowLocationSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showLocationSuggestions])

  // Get available subcategories based on selected property type
  const availableSubCategories = useMemo(() => {
    if (!enums || localFilters.propertyType === 'all') return []
    
    switch (localFilters.propertyType) {
      case 'housesAndApartments':
        return enums.housesSubCategory || []
      case 'lands':
        return enums.landsSubCategories || []
      case 'offices':
        return enums.officesSubCategory || []
      default:
        return []
    }
  }, [enums, localFilters.propertyType])

  // Get property specification fields based on property type
  const specificationFields = useMemo(() => {
    if (!localFilters.propertyType || localFilters.propertyType === 'all') return null
    return PROPERTY_TYPE_SPECS[localFilters.propertyType]?.specificationFields || null
  }, [localFilters.propertyType])

  // Calculate max price for slider
  const maxPrice = useMemo(() => {
    if (properties.length === 0) return 10000000
    const prices = properties
      .map(p => p.pricing?.price || 0)
      .filter(p => p > 0)
    return Math.max(...prices, 10000000)
  }, [properties])

  // Helper to capitalize first letter
  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Helper to format enum values
  const formatEnumValue = (value) => {
    if (!value) return ''
    // Split by camelCase and capitalize each word
    return value
      .split(/(?=[A-Z])/)
      .map(word => capitalize(word))
      .join(' ')
  }

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev, [key]: value }
      
      // Reset subcategory and specifications when property type changes
      if (key === 'propertyType') {
        newFilters.subCategory = 'all'
        // Reset all specification filters
        if (specificationFields) {
          Object.entries(specificationFields).forEach(([field, config]) => {
            // Use 'all' for dropdowns and booleans, empty string for text/number inputs
            if (config.type === 'dropdown' || config.type === 'boolean') {
              newFilters[`spec_${field}`] = 'all'
            } else {
              newFilters[`spec_${field}`] = ''
            }
          })
        }
      }
      
      return newFilters
    })
  }

  const handleLocationSelect = (location) => {
    setLocationSearch(location)
    handleFilterChange('location', location)
    setShowLocationSuggestions(false)
  }

  const handleLocationInputChange = (e) => {
    const value = e.target.value
    setLocationSearch(value)
    if (value === '') {
      handleFilterChange('location', 'all')
    }
  }

  const handleApply = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Clean up the filters - remove empty strings and keep only meaningful values
    const cleanedFilters = { ...localFilters }
    
    // Remove empty specification filters
    Object.keys(cleanedFilters).forEach(key => {
      if (key.startsWith('spec_')) {
        if (cleanedFilters[key] === '' || cleanedFilters[key] === undefined) {
          delete cleanedFilters[key]
        }
      }
    })
    
    // Update the filters state first
    onFiltersChange(cleanedFilters)
    
    // Then apply the cleaned filters directly (don't wait for state update)
    onApplyFilters(cleanedFilters)
    
    if (isModal && onClose) {
      onClose()
    }
  }

  const handleReset = () => {
    const resetFilters = {
      purpose: 'all',
      propertyType: 'all',
      subCategory: 'all',
      location: 'all',
      priceRange: { min: 0, max: maxPrice },
      currency: 'all',
    }
    // Reset specification filters
    if (specificationFields) {
      Object.entries(specificationFields).forEach(([field, config]) => {
        // Use 'all' for dropdowns and booleans, empty string for text/number inputs
        if (config.type === 'dropdown' || config.type === 'boolean') {
          resetFilters[`spec_${field}`] = 'all'
        } else {
          resetFilters[`spec_${field}`] = ''
        }
      })
    }
    setLocalFilters(resetFilters)
    setLocationSearch('')
    onResetFilters(resetFilters)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-white/80 text-sm">Loading filters...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 flex-shrink-0 px-2">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleReset}
            className="text-xs text-secondary hover:text-white transition-colors whitespace-nowrap"
          >
            Reset All
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2"
            >
              <HiX className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Filters Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2">
        <div className="space-y-6 w-full pb-4">
        {/* Purpose Filter */}
        <div className="w-full">
          <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">Purpose</label>
          <select
            value={localFilters.purpose || 'all'}
            onChange={(e) => handleFilterChange('purpose', e.target.value)}
            className="w-full max-w-full px-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary !px-4 !py-2.5 [&>option]:!bg-primary [&>option]:!text-white"
          >
            <option value="all">All Purposes</option>
            {enums?.propertyPurpose?.map(purpose => (
              <option key={purpose} value={purpose.toLowerCase()}>
                {formatEnumValue(purpose)}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Filter */}
        <div className="w-full">
          <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">Property Type</label>
          <select
            value={localFilters.propertyType || 'all'}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full max-w-full px-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary !px-4 !py-2.5 [&>option]:!bg-primary [&>option]:!text-white"
          >
            <option value="all">All Types</option>
            {enums?.propertyTypes?.map(type => (
              <option key={type} value={type}>
                {formatEnumValue(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Filter - Only show if property type is selected */}
        {localFilters.propertyType !== 'all' && availableSubCategories.length > 0 && (
          <div className="w-full">
            <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">
              {localFilters.propertyType === 'housesAndApartments' ? 'House Subcategory' :
               localFilters.propertyType === 'lands' ? 'Land Subcategory' :
               localFilters.propertyType === 'offices' ? 'Office Subcategory' : 'Subcategory'}
            </label>
            <select
              value={localFilters.subCategory || 'all'}
              onChange={(e) => handleFilterChange('subCategory', e.target.value)}
              className="w-full max-w-full px-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary !px-4 !py-2.5 [&>option]:!bg-primary [&>option]:!text-white"
            >
              <option value="all">All Subcategories</option>
              {availableSubCategories.map(subCat => (
                <option key={subCat} value={subCat}>
                  {formatEnumValue(subCat)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Property Specifications - Dynamic based on property type */}
        {specificationFields && Object.entries(specificationFields).map(([field, config]) => {
          // Furnishing dropdown
          if (config.type === 'dropdown' && field === 'furnishing') {
            return (
              <div key={field} className="w-full">
                <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">{config.label}</label>
                <select
                  value={localFilters[`spec_${field}`] || 'all'}
                  onChange={(e) => handleFilterChange(`spec_${field}`, e.target.value)}
                  className="w-full max-w-full px-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary !px-4 !py-2.5 [&>option]:!bg-primary [&>option]:!text-white"
                >
                  <option value="all">Any</option>
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                </select>
              </div>
            )
          }
          // Number fields - text input
          else if (config.type === 'number') {
            return (
              <div key={field} className="w-full">
                <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">{config.label}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={`Enter ${config.label.toLowerCase()}`}
                  value={localFilters[`spec_${field}`] || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    // Allow only numbers
                    const numericValue = value.replace(/[^0-9]/g, '')
                    handleFilterChange(`spec_${field}`, numericValue)
                  }}
                  className="w-full max-w-full px-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-secondary !px-4 !py-2.5"
                />
              </div>
            )
          }
          // Boolean fields - dropdown
          else if (config.type === 'boolean') {
            return (
              <div key={field} className="w-full">
                <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">{config.label}</label>
                <select
                  value={localFilters[`spec_${field}`] || 'all'}
                  onChange={(e) => handleFilterChange(`spec_${field}`, e.target.value)}
                  className="w-full max-w-full px-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary !px-4 !py-2.5 [&>option]:!bg-primary [&>option]:!text-white"
                >
                  <option value="all">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            )
          }
          // Text fields - text input
          else if (config.type === 'text') {
            return (
              <div key={field} className="w-full">
                <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">{config.label}</label>
                <input
                  type="text"
                  placeholder={`Enter ${config.label.toLowerCase()}`}
                  value={localFilters[`spec_${field}`] || ''}
                  onChange={(e) => handleFilterChange(`spec_${field}`, e.target.value)}
                  className="w-full max-w-full px-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-secondary !px-4 !py-2.5"
                />
              </div>
            )
          }
          return null
        })}

        {/* Location Search */}
        <div className="w-full relative location-search-container">
          <label className="block text-sm font-medium text-white/80 mb-2.5 !mb-2.5">Location</label>
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 z-10" />
            <input
              type="text"
              placeholder="Search by city, state, country, or town..."
              value={locationSearch}
              onChange={handleLocationInputChange}
              onFocus={() => {
                if (locationSearch.length >= 2 && locationSuggestions.length > 0) {
                  setShowLocationSuggestions(true)
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary !pl-10 !pr-4 !py-2.5"
            />
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-primary border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
            {locationSearch.length >= 2 && !loading && locationSuggestions.length === 0 && showLocationSuggestions && (
              <div className="absolute z-50 w-full mt-1 bg-primary border border-white/20 rounded-lg shadow-lg p-4 text-sm text-white/60 text-center">
                No locations found
              </div>
            )}
          </div>
        </div>

        {/* Price Range with Currency */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-sm font-medium text-white/80">Price Range</label>
            {/* Currency Filter */}
            <select
              value={localFilters.currency || 'all'}
              onChange={(e) => handleFilterChange('currency', e.target.value)}
              className="px-3 py-1.5 text-xs bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary [&>option]:!bg-primary [&>option]:!text-white"
            >
              <option value="all">All Currencies</option>
              {enums?.currencies?.map(currency => (
                <option key={currency} value={currency}>
                  {currency.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <label className="block text-xs text-white/60 mb-3 !mb-3 break-words">
            {localFilters.currency !== 'all' ? localFilters.currency.toUpperCase() : 'Currency'} {localFilters.priceRange?.min?.toLocaleString() || 0} - {localFilters.priceRange?.max?.toLocaleString() || maxPrice}
          </label>
          <div className="flex gap-2 items-center mb-4 w-full !gap-2 !mb-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Min Price"
              value={localFilters.priceRange?.min || ''}
              onChange={(e) => {
                const value = e.target.value
                // Allow empty string, numbers, and handle commas
                const numericValue = value.replace(/[^0-9]/g, '')
                const parsedValue = numericValue === '' ? '' : parseInt(numericValue)
                handleFilterChange('priceRange', { 
                  ...localFilters.priceRange, 
                  min: parsedValue === '' ? 0 : parsedValue
                })
              }}
              onBlur={(e) => {
                // Ensure min is at least 0
                const value = parseInt(e.target.value) || 0
                handleFilterChange('priceRange', { 
                  ...localFilters.priceRange, 
                  min: Math.max(0, value)
                })
              }}
              className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary !px-3 !py-2.5 placeholder-white/40"
            />
            <span className="text-white/60 text-sm flex-shrink-0">-</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Max Price"
              value={localFilters.priceRange?.max || ''}
              onChange={(e) => {
                const value = e.target.value
                // Allow empty string, numbers, and handle commas
                const numericValue = value.replace(/[^0-9]/g, '')
                const parsedValue = numericValue === '' ? '' : parseInt(numericValue)
                handleFilterChange('priceRange', { 
                  ...localFilters.priceRange, 
                  max: parsedValue === '' ? maxPrice : parsedValue
                })
              }}
              onBlur={(e) => {
                // Ensure max is within valid range
                const value = parseInt(e.target.value) || maxPrice
                handleFilterChange('priceRange', { 
                  ...localFilters.priceRange, 
                  max: Math.min(maxPrice, Math.max(0, value))
                })
              }}
              className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-secondary !px-3 !py-2.5 placeholder-white/40"
            />
          </div>
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={localFilters.priceRange?.max || maxPrice}
            onChange={(e) => handleFilterChange('priceRange', { 
              ...localFilters.priceRange, 
              max: parseInt(e.target.value) 
            })}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider !h-2 max-w-full"
            style={{
              background: `linear-gradient(to right, #E6AD3A 0%, #E6AD3A ${((localFilters.priceRange?.max || maxPrice) / maxPrice) * 100}%, rgba(255,255,255,0.2) ${((localFilters.priceRange?.max || maxPrice) / maxPrice) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>
        </div>
      </div>

      {/* Apply Filters Button - Fixed at Bottom */}
      <div className="pt-4 border-t border-white/10 bg-primary flex-shrink-0 px-2">
        <button
          onClick={handleApply}
          className="w-full bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d19a2e] transition-all duration-300 hover:shadow-lg hover:shadow-secondary/40"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default Filters

