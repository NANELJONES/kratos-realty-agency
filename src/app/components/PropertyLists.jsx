'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ListingCard from './ListingCard'

const PropertyLists = ({ properties, viewMode = 'grid', loading = false }) => {
  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-white/60 text-xl">Loading properties...</p>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-white/60 text-xl mb-3">No properties found</p>
        <p className="text-white/40 text-sm">Try adjusting your filters</p>
      </motion.div>
    )
  }

  return (
    <div className={viewMode === 'grid' 
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 !gap-4 lg:!gap-5' 
      : 'flex flex-col gap-6 !gap-6'
    }>
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className={viewMode === 'grid' 
            ? 'group' 
            : 'flex flex-col md:flex-row gap-6 group'
          }
        >
          <ListingCard property={property} viewMode={viewMode} />
        </motion.div>
      ))}
    </div>
  )
}

export default React.memo(PropertyLists)

