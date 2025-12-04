import { NextResponse } from 'next/server'
import { buildPropertiesQuery } from '../../../../lib/graphql'

const GRAPHQL_ENDPOINT = process.env.GRAPH_QL_ENDPOINT_API_KEY
const GRAPHQL_TOKEN = process.env.GRAPH_QL_TOKEN

export async function GET(request) {
  try {
    console.log('🚀 [Featured API] Request received')
    console.log('🚀 [Featured API] Request URL:', request.url)
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    console.log('🚀 [Featured API] Limit:', limit)
    
    // Build GraphQL query
    const query = buildPropertiesQuery({}, limit, 0)
    console.log('🚀 [Featured API] Query built')
    
    // Call GraphQL endpoint directly (server-side)
    if (!GRAPHQL_ENDPOINT || !GRAPHQL_TOKEN) {
      console.error('❌ [Featured API] GraphQL credentials not configured')
      return NextResponse.json(
        { error: 'GraphQL endpoint not configured', properties: [] },
        { status: 500 }
      )
    }
    
    console.log('🚀 [Featured API] Calling GraphQL endpoint directly...')
    const graphqlResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRAPHQL_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: {},
      }),
    })
    
    if (!graphqlResponse.ok) {
      const errorText = await graphqlResponse.text()
      console.error('❌ [Featured API] GraphQL request failed:', errorText)
      throw new Error(`GraphQL request failed: ${graphqlResponse.statusText}`)
    }
    
    const graphqlData = await graphqlResponse.json()
    console.log('🚀 [Featured API] GraphQL response received')
    
    if (graphqlData.errors) {
      console.error('❌ [Featured API] GraphQL errors:', graphqlData.errors)
      throw new Error(graphqlData.errors[0]?.message || 'GraphQL query failed')
    }
    
    const edges = graphqlData?.data?.propertyListingsConnection?.edges || []
    const properties = edges.map(edge => edge.node)
    console.log('🚀 [Featured API] Properties count:', properties.length)
    
    if (properties.length === 0) {
      console.log('⚠️ [Featured API] No properties found, returning empty array')
      return NextResponse.json({ properties: [] })
    }
    
    // Transform properties to match the format expected by components
    const formattedProperties = properties.map(property => {
      const location = property.location
      const pricing = property.pricing
      const spec = property.propertySpecification
      
      // Format location
      const locationParts = []
      if (location?.city) locationParts.push(location.city)
      if (location?.regionState) locationParts.push(location.regionState)
      if (location?.country) locationParts.push(location.country)
      const locationString = locationParts.join(', ') || location?.fullAddress || 'Location not specified'
      
      // Get bedrooms and bathrooms
      let bedrooms = 0
      let bathrooms = 0
      let squareFeet = 0
      
      if (spec) {
        if (spec.bedroom) bedrooms = spec.bedroom
        if (spec.bathroom) bathrooms = spec.bathroom
        if (property.propertySize?.size) {
          squareFeet = property.propertySize.size
        }
      }
      
      // Format price
      const price = pricing?.price || 0
      const currency = pricing?.currency || 'GHS'
      const purpose = property.purpose || 'sale'
      
      let formattedPrice = ''
      if (purpose === 'rent') {
        formattedPrice = `${currency} ${price.toLocaleString()}/month`
      } else {
        formattedPrice = `${currency} ${price.toLocaleString()}`
      }
      
      return {
        id: property.id,
        title: property.title,
        image: property.coverImage?.url || '/image1.jpg',
        location: locationString,
        price: formattedPrice,
        priceValue: price,
        type: purpose,
        bedrooms,
        bathrooms,
        squareFeet,
        slug: property.slug,
      }
    })
    
    console.log('✅ [Featured API] Returning', formattedProperties.length, 'properties')
    return NextResponse.json({ properties: formattedProperties })
  } catch (error) {
    console.error('❌ [Featured API] Error:', error)
    console.error('❌ [Featured API] Error stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch featured properties', properties: [] },
      { status: 500 }
    )
  }
}

