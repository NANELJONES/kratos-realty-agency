import { NextResponse } from 'next/server'

const GRAPHQL_ENDPOINT = process.env.GRAPH_QL_ENDPOINT_API_KEY;
const GRAPHQL_TOKEN = process.env.GRAPH_QL_TOKEN;

export async function POST(request) {
  try {
    const { query, variables } = await request.json();
    
    console.log('🌐 [API GraphQL] Received request')
    console.log('🌐 [API GraphQL] Query:', query?.substring(0, 300) + '...')
    console.log('🌐 [API GraphQL] Variables:', variables)

    if (!GRAPHQL_ENDPOINT) {
      console.error('❌ [API GraphQL] Endpoint not configured')
      return NextResponse.json(
        { error: 'GraphQL endpoint not configured' },
        { status: 500 }
      );
    }

    if (!GRAPHQL_TOKEN) {
      console.error('❌ [API GraphQL] Token not configured')
      return NextResponse.json(
        { error: 'GraphQL token not configured' },
        { status: 500 }
      );
    }

    console.log('🌐 [API GraphQL] Sending to:', GRAPHQL_ENDPOINT)
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRAPHQL_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: variables || {},
      }),
    });

    console.log('🌐 [API GraphQL] Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API GraphQL] Request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 500)
      });
      return NextResponse.json(
        { error: `GraphQL request failed: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('🌐 [API GraphQL] Response data:', JSON.stringify(data).substring(0, 500) + '...')

    if (data.errors) {
      console.error('❌ [API GraphQL] GraphQL errors:', JSON.stringify(data.errors, null, 2));
      return NextResponse.json(
        { error: 'GraphQL errors', errors: data.errors },
        { status: 400 }
      );
    }

    console.log('✅ [API GraphQL] Success, returning data')
    return NextResponse.json(data.data || data);
  } catch (error) {
    console.error('❌ [API GraphQL] Route error:', error);
    console.error('❌ [API GraphQL] Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

