// Data Dictionary for Property Specifications

export const PROPERTY_TYPE_SPECS = {
  housesAndApartments: {
    name: 'Houses & Apartments',
    subCategoryField: 'housesAndApartmentSubCategory',
    specificationFields: {
      bedroom: { label: 'Bedrooms', type: 'number', icon: 'bed' },
      bathroom: { label: 'Bathrooms', type: 'number', icon: 'bath' },
      kitchen: { label: 'Kitchens', type: 'number', icon: 'kitchen' },
      furnishing: { label: 'Furnishing', type: 'dropdown', icon: 'furniture' },
    },
  },
  lands: {
    name: 'Lands',
    subCategoryField: 'landSubCategory',
    specificationFields: {
      soilType: { label: 'Soil Type', type: 'text', icon: 'land' },
      stage: { label: 'Stage', type: 'text', icon: 'stage' },
      topography: { label: 'Topography', type: 'text', icon: 'topography' },
      documentAvailability: { label: 'Documents Available', type: 'boolean', icon: 'document' },
    },
  },
  offices: {
    name: 'Offices',
    subCategoryField: 'officesSubCategory',
    specificationFields: {
      numberOfRooms: { label: 'Rooms', type: 'number', icon: 'room' },
      washrooms: { label: 'Washrooms', type: 'number', icon: 'bath' },
      totalFloorArea: { label: 'Floor Area', type: 'number', icon: 'area' },
      receptionArea: { label: 'Reception Area', type: 'boolean', icon: 'reception' },
      furnishing: { label: 'Furnishing', type: 'dropdown', icon: 'furniture' },
    },
  },
};

// Helper function to get property specification based on type
export function getPropertySpecification(property) {
  const { propertyType, propertySpecification } = property;
  
  if (!propertySpecification) return null;

  switch (propertyType) {
    case 'housesAndApartments':
      return {
        type: 'housesAndApartments',
        data: propertySpecification,
        specs: PROPERTY_TYPE_SPECS.housesAndApartments,
      };
    case 'lands':
      return {
        type: 'lands',
        data: propertySpecification,
        specs: PROPERTY_TYPE_SPECS.lands,
      };
    case 'offices':
      return {
        type: 'offices',
        data: propertySpecification,
        specs: PROPERTY_TYPE_SPECS.offices,
      };
    default:
      return null;
  }
}

// Helper function to format location
export function formatLocation(location) {
  if (!location) return 'Location not specified';
  
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.regionState) parts.push(location.regionState);
  if (location.country) parts.push(location.country);
  
  return parts.join(', ') || location.fullAddress || 'Location not specified';
}

// Helper function to format price
export function formatPrice(pricing, purpose) {
  if (!pricing) return 'Price not available';
  
  const currency = pricing.currency?.toUpperCase() || 'USD';
  const price = pricing.price;
  
  if (purpose === 'rent') {
    const duration = pricing.priceDuration || 'month';
    return `${currency} ${price.toLocaleString()}/${duration}`;
  }
  
  return `${currency} ${price.toLocaleString()}`;
}

// Helper function to get property size display
export function formatPropertySize(propertySize) {
  if (!propertySize) return 'Size not specified';
  
  const { size, unit } = propertySize;
  return `${size.toLocaleString()} ${unit}`;
}

// Helper function to get bedrooms/bathrooms based on property type
export function getPropertyDetails(property) {
  const spec = getPropertySpecification(property);
  
  if (!spec) return { bedrooms: null, bathrooms: null, size: null };
  
  const { type, data } = spec;
  
  switch (type) {
    case 'housesAndApartments':
      return {
        bedrooms: data.bedroom,
        bathrooms: data.bathroom,
        size: formatPropertySize(property.propertySize),
      };
    case 'offices':
      return {
        bedrooms: data.numberOfRooms,
        bathrooms: data.washrooms,
        size: formatPropertySize(property.propertySize),
      };
    case 'lands':
      return {
        bedrooms: null,
        bathrooms: null,
        size: formatPropertySize(property.propertySize),
      };
    default:
      return { bedrooms: null, bathrooms: null, size: null };
  }
}

// Helper function to format enum values (e.g., "housesAndApartments" -> "Houses And Apartments")
export function formatEnumValue(value) {
  if (!value) return '';
  return value
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/([a-z])([0-9])/g, '$1 $2') // Add space between letters and numbers
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
    .trim();
}

