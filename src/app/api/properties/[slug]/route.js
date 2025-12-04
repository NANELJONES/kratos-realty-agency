import { NextResponse } from 'next/server'

const GRAPHQL_ENDPOINT = process.env.GRAPH_QL_ENDPOINT_API_KEY;
const GRAPHQL_TOKEN = process.env.GRAPH_QL_TOKEN;

const GET_PROPERTY_BY_SLUG_QUERY = `
  query GetPropertyBySlug($slug: String!) {
    propertyListing(where: { slug: $slug }) {
      id
      coverImage {
        url
      }
      description {
        raw
      }
      disclaimer
      gallery {
        url
        mimeType
      }
      isFeatured
      location {
        city
        country
        fullAddress
        regionState
        town
        propertyLocation {
          latitude
          longitude
        }
      }
      pricing {
        ... on RentPricing {
          id
          minimumDuration
          negotiable
          price
          priceDuration
          currency
        }
        ... on SalePricing {
          id
          price
          currency
        }
      }
      propertySize {
        size
        sizeVariation
        unit
      }
      propertySpecification {
        ... on HousesAndApartment {
          id
          furnishing
          bedroom
          bathroom
          kitchen
          housesAndApartmentSubCategory
        }
        ... on Land {
          soilType
          stage
          topography
          documentAvailability
          landSubCategory
        }
        ... on Office {
          id
          numberOfRooms
          receptionArea
          furnishing
          totalFloorArea
          washrooms
          officesSubCategory
        }
      }
      propertyStatus
      propertyType
      purpose
      title
      slug
      views
      shares
    }
  }
`;

export async function GET(request, { params }) {
  try {
    // In Next.js 13+, params needs to be awaited
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    if (!GRAPHQL_ENDPOINT || !GRAPHQL_TOKEN) {
      return NextResponse.json(
        { error: 'GraphQL API endpoint or token is not configured' },
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
        query: GET_PROPERTY_BY_SLUG_QUERY,
        variables: { slug },
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

    if (!data.data?.propertyListing) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data.data.propertyListing);
  } catch (error) {
    console.error('Property API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

