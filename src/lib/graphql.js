// GraphQL client utility - uses API route for server-side requests
export async function fetchGraphQL(query, variables = {}) {
  console.log('🚀 [fetchGraphQL] Sending request with:', { 
    query: query.substring(0, 200) + '...', 
    variables 
  })
  
  try {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    console.log('📡 [fetchGraphQL] Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [fetchGraphQL] Response error:', errorData)
      throw new Error(errorData.error || `GraphQL request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [fetchGraphQL] Response data:', data)

    if (data.error) {
      console.error('❌ [fetchGraphQL] Data error:', data.error)
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('❌ [fetchGraphQL] Fetch error:', error);
    throw error;
  }
}

// Build GraphQL where clause from filters
export function buildWhereClause(filters = {}) {
  console.log('🔍 [buildWhereClause] Input filters:', JSON.stringify(filters, null, 2))
  
  const whereConditions = []

  // Purpose filter - use lowercase to match enum values ("rent", "sale")
  if (filters.purpose && filters.purpose !== 'all') {
    const purposeValue = filters.purpose.toLowerCase()
    whereConditions.push(`purpose: ${purposeValue}`)
  }

  // Property type filter
  if (filters.propertyType && filters.propertyType !== 'all') {
    whereConditions.push(`propertyType: ${filters.propertyType}`)
  }

  // Note: Subcategory filter removed from where clause
  // propertySpecification is a union type and cannot be filtered directly in Hygraph where clauses
  // This filter will be applied client-side in propertiesService.js

  // Location filter (search in city, country, regionState, town)
  if (filters.location && filters.location !== 'all') {
    const locationParts = filters.location.split(',').map(p => p.trim().replace(/"/g, '\\"'))
    const locationOr = []
    
    locationParts.forEach(part => {
      if (part) {
        locationOr.push(`{ location: { city_contains: "${part}" } }`)
        locationOr.push(`{ location: { country_contains: "${part}" } }`)
        locationOr.push(`{ location: { regionState_contains: "${part}" } }`)
        locationOr.push(`{ location: { town_contains: "${part}" } }`)
      }
    })
    
    if (locationOr.length > 0) {
      whereConditions.push(`OR: [${locationOr.join(', ')}]`)
    }
  }

  // Note: Pricing and propertySpecification filters are removed from where clause
  // because they are union types and cannot be filtered directly in Hygraph where clauses
  // These filters will be applied client-side in propertiesService.js

  // Build the where clause
  if (whereConditions.length === 0) {
    console.log('🔍 [buildWhereClause] No conditions, returning empty string')
    return ''
  }

  const whereClause = `where: { ${whereConditions.join(', ')} }`
  console.log('🔍 [buildWhereClause] Generated where clause:', whereClause)
  return whereClause
}

// Query to fetch property listings with optional filters and pagination
export function buildPropertiesQuery(filters = {}, first = 10, skip = 0) {
  console.log('📝 [buildPropertiesQuery] Building query with:', { filters, first, skip })
  
  const whereClause = buildWhereClause(filters)
  const pagination = `first: ${first}, skip: ${skip}`
  const connectionArgs = []
  
  if (whereClause) {
    connectionArgs.push(whereClause)
  }
  if (pagination) {
    connectionArgs.push(pagination)
  }
  
  const argsString = connectionArgs.length > 0 ? `(${connectionArgs.join(', ')})` : ''
  
  const query = `
    query GetProperties {
      propertyListingsConnection${argsString} {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        aggregate {
          count
        }
        edges {
          node {
            id
            coverImage {
              url
            }
            location {
              city
              country
              fullAddress
              regionState
              town
            }
            pricing {
              ... on RentPricing {
                price
                currency
              }
              ... on SalePricing {
                price
                currency
              }
            }
            propertySpecification {
              ... on HousesAndApartment {
                bedroom
                bathroom
                housesAndApartmentSubCategory
              }
              ... on Land {
                soilType
                documentAvailability
                landSubCategory
              }
              ... on Office {
                numberOfRooms
                washrooms
                officesSubCategory
              }
            }
            propertySize {
              size
              sizeVariation
              unit
            }
            propertyStatus
            propertyType
            purpose
            title
            slug
          }
        }
      }
    }
  `
  
  console.log('📝 [buildPropertiesQuery] Final query:', query)
  return query
}

// Legacy query for backward compatibility (no filters, no pagination)
export const GET_PROPERTIES_QUERY = buildPropertiesQuery()

// Query to fetch enums
export const GET_ENUMS_QUERY = `
  query GetEnums {
    currency: __type(name: "Currency") {
      enumValues {
        name
      }
    }
    housesSubCategory: __type(name: "HousesSubCategory") {
      enumValues {
        name
      }
    }
    landsSubCategories: __type(name: "LandsSubCategories") {
      enumValues {
        name
      }
    }
    officesSubCategory: __type(name: "OfficesSubCategory") {
      enumValues {
        name
      }
    }
    propertyPurpose: __type(name: "PropertyPurpose") {
      enumValues {
        name
      }
    }
    propertyTypes: __type(name: "PropertyTypes") {
      enumValues {
        name
      }
    }
  }
`;

