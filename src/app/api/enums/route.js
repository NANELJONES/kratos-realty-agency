import { NextResponse } from 'next/server'

const GRAPHQL_ENDPOINT = process.env.GRAPH_QL_ENDPOINT_API_KEY;
const GRAPHQL_TOKEN = process.env.GRAPH_QL_TOKEN;

// Cache for enums (in-memory cache, resets on server restart)
let enumsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const GET_ENUMS_QUERY = `
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

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (enumsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(enumsCache);
    }

    if (!GRAPHQL_ENDPOINT) {
      return NextResponse.json(
        { error: 'GraphQL endpoint not configured' },
        { status: 500 }
      );
    }

    if (!GRAPHQL_TOKEN) {
      return NextResponse.json(
        { error: 'GraphQL token not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRAPHQL_TOKEN}`,
      },
      body: JSON.stringify({
        query: GET_ENUMS_QUERY,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GraphQL request failed:', response.statusText, errorText);
      return NextResponse.json(
        { error: `GraphQL request failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return NextResponse.json(
        { error: 'GraphQL errors', errors: data.errors },
        { status: 400 }
      );
    }

    // Format the enums
    const formattedEnums = {
      currencies: data.data?.currency?.enumValues?.map(v => v.name) || [],
      housesSubCategory: data.data?.housesSubCategory?.enumValues?.map(v => v.name) || [],
      landsSubCategories: data.data?.landsSubCategories?.enumValues?.map(v => v.name) || [],
      officesSubCategory: data.data?.officesSubCategory?.enumValues?.map(v => v.name) || [],
      propertyPurpose: data.data?.propertyPurpose?.enumValues?.map(v => v.name) || [],
      propertyTypes: data.data?.propertyTypes?.enumValues?.map(v => v.name) || [],
    };

    // Update cache
    enumsCache = formattedEnums;
    cacheTimestamp = now;

    return NextResponse.json(formattedEnums);
  } catch (error) {
    console.error('Enums API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

