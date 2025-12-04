import { fetchGraphQL, buildPropertiesQuery, GET_ENUMS_QUERY } from './graphql';

// Fetch properties with optional filters and pagination (server-side filtering)
export async function getProperties(filters = {}, first = 10, skip = 0) {
  console.log('🏠 [getProperties] Called with:', { filters, first, skip })
  
  try {
    const query = buildPropertiesQuery(filters, first, skip);
    console.log('🏠 [getProperties] Query built, fetching...')
    
    const data = await fetchGraphQL(query);
    console.log('🏠 [getProperties] Received data:', data)
    
    if (!data?.propertyListingsConnection?.edges) {
      console.warn('⚠️ [getProperties] No edges in response')
      return { properties: [], hasMore: false, totalCount: 0 };
    }
    
    let properties = data.propertyListingsConnection.edges.map(edge => ({
      id: edge.node.id || Math.random().toString(),
      ...edge.node,
    }));
    
    console.log('🏠 [getProperties] Mapped properties count:', properties.length)

    const hasMore = data.propertyListingsConnection.pageInfo?.hasNextPage || false;
    const totalCount = data.propertyListingsConnection.aggregate?.count || 0;
    
    console.log('🏠 [getProperties] Pagination info:', { hasMore, totalCount })

    // Apply specification filters client-side (since GraphQL might not support nested filters)
    // This is a fallback for complex filters that can't be done server-side
    if (filters && Object.keys(filters).some(key => key.startsWith('spec_'))) {
      properties = properties.filter(property => {
        if (!property.propertySpecification) return false;
        
        const spec = property.propertySpecification;
        let matches = true;

        Object.keys(filters).forEach(key => {
          if (key.startsWith('spec_')) {
            const field = key.replace('spec_', '');
            const filterValue = filters[key];
            
            if (filterValue && filterValue !== 'all' && filterValue !== '') {
              let specValue = null;
              
              if (property.propertyType === 'housesAndApartments') {
                specValue = spec[field];
              } else if (property.propertyType === 'lands') {
                specValue = spec[field];
              } else if (property.propertyType === 'offices') {
                specValue = spec[field];
              }
              
              if (specValue === null || specValue === undefined) {
                matches = false;
                return;
              }
              
              if (typeof specValue === 'number') {
                const filterNum = parseInt(filterValue);
                if (!isNaN(filterNum)) {
                  matches = matches && specValue >= filterNum;
                } else {
                  matches = false;
                }
              } else if (typeof specValue === 'boolean') {
                const boolValue = filterValue === 'true';
                matches = matches && specValue === boolValue;
              } else if (typeof specValue === 'string') {
                if (field === 'furnishing') {
                  matches = matches && specValue.toLowerCase() === filterValue.toLowerCase();
                } else {
                  matches = matches && specValue.toLowerCase().includes(filterValue.toLowerCase());
                }
              }
            }
          }
        });
        
        return matches;
      });
    }

    // Apply subcategory filter client-side if needed
    if (filters.subCategory && filters.subCategory !== 'all' && filters.propertyType && filters.propertyType !== 'all') {
      properties = properties.filter(property => {
        if (!property.propertySpecification) return false;
        const spec = property.propertySpecification;
        
        if (filters.propertyType === 'housesAndApartments' && spec.housesAndApartmentSubCategory) {
          return spec.housesAndApartmentSubCategory === filters.subCategory;
        } else if (filters.propertyType === 'lands' && spec.landSubCategory) {
          return spec.landSubCategory === filters.subCategory;
        } else if (filters.propertyType === 'offices' && spec.officesSubCategory) {
          return Array.isArray(spec.officesSubCategory) 
            ? spec.officesSubCategory.includes(filters.subCategory)
            : spec.officesSubCategory === filters.subCategory;
        }
        return false;
      });
    }

    // Apply price range filter client-side (pricing is a union type, can't filter in where clause)
    if (filters.priceRange) {
      const minPrice = filters.priceRange.min || 0;
      const maxPrice = filters.priceRange.max || 10000000;
      properties = properties.filter(property => {
        if (!property.pricing) return false;
        const price = property.pricing.price;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply currency filter client-side
    if (filters.currency && filters.currency !== 'all') {
      const currencyValue = filters.currency.toLowerCase();
      properties = properties.filter(property => {
        if (!property.pricing) return false;
        return property.pricing.currency?.toLowerCase() === currencyValue;
      });
    }

    // Apply search query client-side (text search)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const searchLower = filters.searchQuery.toLowerCase();
      properties = properties.filter(property => {
        const title = property.title?.toLowerCase() || '';
        const location = `${property.location?.city || ''} ${property.location?.regionState || ''} ${property.location?.country || ''}`.toLowerCase();
        return title.includes(searchLower) || location.includes(searchLower);
      });
    }
    
    return { properties, hasMore, totalCount };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], hasMore: false, totalCount: 0 };
  }
}

// Fetch enums for filters
export async function getEnums() {
  try {
    const data = await fetchGraphQL(GET_ENUMS_QUERY);
    
    return {
      currencies: data?.currency?.enumValues?.map(v => v.name) || [],
      housesSubCategory: data?.housesSubCategory?.enumValues?.map(v => v.name) || [],
      landsSubCategories: data?.landsSubCategories?.enumValues?.map(v => v.name) || [],
      officesSubCategory: data?.officesSubCategory?.enumValues?.map(v => v.name) || [],
      propertyPurpose: data?.propertyPurpose?.enumValues?.map(v => v.name) || [],
      propertyTypes: data?.propertyTypes?.enumValues?.map(v => v.name) || [],
    };
  } catch (error) {
    console.error('Error fetching enums:', error);
    return {
      currencies: [],
      housesSubCategory: [],
      landsSubCategories: [],
      officesSubCategory: [],
      propertyPurpose: [],
      propertyTypes: [],
    };
  }
}

// Get unique locations from properties
export function getUniqueLocations(properties) {
  const locations = new Set();
  
  properties.forEach(property => {
    if (property.location) {
      const locationStr = formatLocation(property.location);
      if (locationStr && locationStr !== 'Location not specified') {
        locations.add(locationStr);
      }
    }
  });
  
  return Array.from(locations).sort();
}

// Helper function to format location (duplicated for client-side use)
function formatLocation(location) {
  if (!location) return 'Location not specified';
  
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.regionState) parts.push(location.regionState);
  if (location.country) parts.push(location.country);
  
  return parts.join(', ') || location.fullAddress || 'Location not specified';
}

