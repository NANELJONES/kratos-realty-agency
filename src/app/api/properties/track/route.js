import { NextResponse } from 'next/server'

const GRAPHQL_ENDPOINT = process.env.GRAPH_QL_ENDPOINT_API_KEY;
const GRAPHQL_TOKEN = process.env.GRAPH_QL_TOKEN;

// GraphQL mutation to increment views - update each property individually
// Note: Hygraph might not support batch updates with increment, so we'll update individually
const INCREMENT_VIEW_MUTATION = `
  mutation IncrementView($id: ID!, $currentViews: Int!) {
    updatePropertyListing(where: { id: $id }, data: { views: $currentViews }) {
      id
      views
    }
  }
`;

// GraphQL mutation to increment shares
const INCREMENT_SHARE_MUTATION = `
  mutation IncrementShare($id: ID!, $currentShares: Int!) {
    updatePropertyListing(where: { id: $id }, data: { shares: $currentShares }) {
      id
      shares
    }
  }
`;

// Query to get current views and shares
const GET_PROPERTY_STATS_QUERY = `
  query GetPropertyStats($ids: [ID!]!) {
    propertyListingsConnection(where: { id_in: $ids }) {
      edges {
        node {
          id
          views
          shares
        }
      }
    }
  }
`;

export async function POST(request) {
  try {
    const { views = [], shares = [] } = await request.json();

    if (!GRAPHQL_ENDPOINT || !GRAPHQL_TOKEN) {
      return NextResponse.json(
        { error: 'GraphQL API endpoint or token is not configured' },
        { status: 500 }
      );
    }

    const results = {
      viewsUpdated: 0,
      sharesUpdated: 0,
    };

    // Get all unique property IDs
    const allIds = [...new Set([...views.map(v => v.propertyId), ...shares.map(s => s.propertyId)])];
    
    if (allIds.length === 0) {
      return NextResponse.json(results);
    }

    // First, fetch current views and shares for all properties
    let propertyStats = {};
    try {
      const statsResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GRAPHQL_TOKEN}`,
        },
        body: JSON.stringify({
          query: GET_PROPERTY_STATS_QUERY,
          variables: { ids: allIds },
        }),
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (!statsData.errors && statsData.data?.propertyListingsConnection?.edges) {
          statsData.data.propertyListingsConnection.edges.forEach(edge => {
            propertyStats[edge.node.id] = {
              views: edge.node.views || 0,
              shares: edge.node.shares || 0,
            };
          });
        }
      }
    } catch (error) {
      console.error('Error fetching property stats:', error);
    }

    // Count views and shares per property
    const viewCounts = {};
    views.forEach(view => {
      viewCounts[view.propertyId] = (viewCounts[view.propertyId] || 0) + 1;
    });

    const shareCounts = {};
    shares.forEach(share => {
      shareCounts[share.propertyId] = (shareCounts[share.propertyId] || 0) + 1;
    });

    // Update views for each property
    const viewUpdatePromises = Object.keys(viewCounts).map(async (propertyId) => {
      const currentViews = propertyStats[propertyId]?.views || 0;
      const increment = viewCounts[propertyId];
      const newViews = currentViews + increment;

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GRAPHQL_TOKEN}`,
          },
          body: JSON.stringify({
            query: INCREMENT_VIEW_MUTATION,
            variables: { id: propertyId, currentViews: newViews },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.errors) {
            results.viewsUpdated++;
            return true;
          }
        }
      } catch (error) {
        console.error(`Error updating views for property ${propertyId}:`, error);
      }
      return false;
    });

    // Update shares for each property
    const shareUpdatePromises = Object.keys(shareCounts).map(async (propertyId) => {
      const currentShares = propertyStats[propertyId]?.shares || 0;
      const increment = shareCounts[propertyId];
      const newShares = currentShares + increment;

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GRAPHQL_TOKEN}`,
          },
          body: JSON.stringify({
            query: INCREMENT_SHARE_MUTATION,
            variables: { id: propertyId, currentShares: newShares },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.errors) {
            results.sharesUpdated++;
            return true;
          }
        }
      } catch (error) {
        console.error(`Error updating shares for property ${propertyId}:`, error);
      }
      return false;
    });

    // Wait for all updates to complete
    await Promise.all([...viewUpdatePromises, ...shareUpdatePromises]);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Tracking API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

