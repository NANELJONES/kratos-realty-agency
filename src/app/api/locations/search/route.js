import { NextResponse } from 'next/server'
import { GET_PROPERTIES_QUERY } from '../../../../lib/graphql'

const GRAPHQL_ENDPOINT = process.env.GRAPH_QL_ENDPOINT_API_KEY;
const GRAPHQL_TOKEN = process.env.GRAPH_QL_TOKEN;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';

    if (!search || search.length < 2) {
      return NextResponse.json({ locations: [] });
    }

    if (!GRAPHQL_ENDPOINT || !GRAPHQL_TOKEN) {
      return NextResponse.json(
        { error: 'GraphQL not configured', locations: [] },
        { status: 500 }
      );
    }

    // Fetch properties directly from GraphQL
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRAPHQL_TOKEN}`,
      },
      body: JSON.stringify({
        query: GET_PROPERTIES_QUERY,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    const data = result.data;

    if (!data?.propertyListingsConnection?.edges) {
      return NextResponse.json({ locations: [] });
    }

    // Filter and extract unique locations
    const searchLower = search.toLowerCase();
    const locationMap = new Map(); // Use Map to store unique locations with full details
    
    data.propertyListingsConnection.edges.forEach(edge => {
      const loc = edge.node.location;
      if (loc) {
        // Check if search matches any location field (country, city, regionState, town)
        const matchesSearch = 
          (loc.city && loc.city.toLowerCase().includes(searchLower)) ||
          (loc.country && loc.country.toLowerCase().includes(searchLower)) ||
          (loc.regionState && loc.regionState.toLowerCase().includes(searchLower)) ||
          (loc.town && loc.town && loc.town.toLowerCase().includes(searchLower));
        
        if (matchesSearch) {
          // Create a formatted location string
          const parts = [];
          if (loc.city) parts.push(loc.city);
          if (loc.regionState) parts.push(loc.regionState);
          if (loc.country) parts.push(loc.country);
          const locationStr = parts.join(', ') || loc.fullAddress || 'Location not specified';
          
          // Use location string as key to ensure uniqueness
          if (locationStr && locationStr !== 'Location not specified') {
            if (!locationMap.has(locationStr)) {
              locationMap.set(locationStr, {
                display: locationStr,
                city: loc.city || '',
                country: loc.country || '',
                regionState: loc.regionState || '',
                town: loc.town || '',
                fullAddress: loc.fullAddress || '',
              });
            }
          }
        }
      }
    });

    // Convert to array and sort
    const locations = Array.from(locationMap.values())
      .sort((a, b) => a.display.localeCompare(b.display));
    
    return NextResponse.json({ locations: locations.map(loc => loc.display) });
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', locations: [] },
      { status: 500 }
    );
  }
}

