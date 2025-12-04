import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatLocation, getPropertyDetails } from '../../lib/propertyDataDictionary'
import { 
  HiLocationMarker, 
  HiHome, 
  HiOfficeBuilding, 
  HiCube
} from 'react-icons/hi'

const ListingCard = ({ property, viewMode = 'grid' }) => {
  const imageUrl = property.coverImage?.url || property.gallery?.[0]?.url || '/placeholder.jpg'
  const location = formatLocation(property.location)
  const price = formatPrice(property.pricing, property.purpose)
  const details = getPropertyDetails(property)
  const purpose = property.purpose || 'sale'
  const status = property.propertyStatus || 'available'

  return (
    <Link href={`/properties/${property.slug || property.id}`} className="block h-full">
      <div className={`group ${viewMode === 'grid'
        ? 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20 h-full flex flex-col'
        : 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-secondary/50 transition-all duration-300 flex-1'
      }`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${
          viewMode === 'grid' 
            ? 'h-48 md:h-56 ' 
            : 'h-56 md:h-full md:w-72 md:min-h-[280px]'
        }`}>
          <Image
            src={imageUrl}
            alt={property.title || 'Property'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              purpose === 'sale' 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-white'
            }`}>
              {purpose === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            {status !== 'available' && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/90 text-white">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h5 className="text-base md:!text-lg  text-white mb-1.5 group-hover:text-secondary transition-colors line-clamp-1">
            {property.title || 'Untitled Property'}
          </h5>
          
          <div className="flex items-center gap-1.5 mb-2">
            <HiLocationMarker className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
            <p className="text-xs md:!text-sm text-white/80 truncate">
              {location}
            </p>
          </div>

          <p className="text-lg md:text-xl font-bold text-white mb-3">
            {price}
          </p>

          <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-white/10 mt-auto">
            {details.bedrooms !== null && (
              <div className="flex items-center gap-1">
                <HiHome className="w-3.5 h-3.5 text-white/60" />
                <span className="text-xs text-white/80">
                  {details.bedrooms} {property.propertyType === 'offices' ? 'Rooms' : 'Bed'}
                </span>
              </div>
            )}
            {details.bathrooms !== null && (
              <div className="flex items-center gap-1">
                <HiOfficeBuilding className="w-3.5 h-3.5 text-white/60" />
                <span className="text-xs text-white/80">
                  {details.bathrooms} {property.propertyType === 'offices' ? 'Washrooms' : 'Bath'}
                </span>
              </div>
            )}
            {details.size && (
              <div className="flex items-center gap-1">
                <HiCube className="w-3.5 h-3.5 text-white/60" />
                <span className="text-xs text-white/80">
                  {details.size}
                </span>
              </div>
            )}
          </div>

          {viewMode === 'list' && property.description?.raw && (
            <p className="text-sm text-white/70 mt-4 line-clamp-2">
              {extractTextFromRichText(property.description.raw)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

// Helper function to extract plain text from rich text
function extractTextFromRichText(richText) {
  if (!richText || !richText.children) return '';
  
  let text = '';
  richText.children.forEach(child => {
    if (child.text) {
      text += child.text + ' ';
    } else if (child.children) {
      child.children.forEach(subChild => {
        if (subChild.text) {
          text += subChild.text + ' ';
        }
      });
    }
  });
  
  return text.trim();
}

export default ListingCard

