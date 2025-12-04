// Dummy real estate listings data
export const listings = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 1250000,
    location: "Beverly Hills, CA",
    type: "sale", // for sale
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 4500,
    description: "Stunning modern villa with panoramic city views and private pool",
    status: "available" // available or pending
  },
  {
    id: 2,
    title: "Downtown Loft Apartment",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 3200,
    location: "Manhattan, NY",
    type: "rent", // for rent
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: "Spacious loft in the heart of downtown with exposed brick and high ceilings",
    status: "available"
  },
  {
    id: 3,
    title: "Beachfront Condo",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 850000,
    location: "Miami Beach, FL",
    type: "sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    description: "Beautiful beachfront property with ocean views and resort amenities",
    status: "pending"
  },
  {
    id: 4,
    title: "Cozy Family Home",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 2800,
    location: "Austin, TX",
    type: "rent",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2400,
    description: "Perfect family home with large backyard and updated kitchen",
    status: "available"
  },
  {
    id: 5,
    title: "Penthouse Suite",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80&auto=format",
    price: 2500000,
    location: "Chicago, IL",
    type: "sale",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 3500,
    description: "Luxurious penthouse with floor-to-ceiling windows and private terrace",
    status: "available"
  },
  {
    id: 6,
    title: "Suburban Townhouse",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 2100,
    location: "Seattle, WA",
    type: "rent",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1600,
    description: "Well-maintained townhouse in quiet neighborhood near schools",
    status: "pending"
  },
  {
    id: 7,
    title: "Historic Brownstone",
    image: "https://images.unsplash.com/photo-1568605117034-72e1a3cd415a?w=800&h=600&fit=crop&q=80&auto=format",
    price: 950000,
    location: "Boston, MA",
    type: "sale",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    description: "Charming historic brownstone with original architectural details",
    status: "available"
  },
  {
    id: 8,
    title: "Modern Studio Apartment",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 1800,
    location: "San Francisco, CA",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    description: "Bright and modern studio in trendy neighborhood with great amenities",
    status: "pending"
  },
  {
    id: 9,
    title: "Mountain View Estate",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 1850000,
    location: "Aspen, CO",
    type: "sale",
    bedrooms: 6,
    bathrooms: 5,
    squareFeet: 5200,
    description: "Spectacular mountain estate with ski-in/ski-out access and hot tub",
    status: "available"
  },
  {
    id: 10,
    title: "Garden Apartment",
    image: "https://images.unsplash.com/photo-1600607688969-a5d73d60e7e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 2400,
    location: "Portland, OR",
    type: "rent",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1100,
    description: "Charming garden-level apartment with private patio and updated features",
    status: "pending"
  }
];

// Helper function to format price
export const formatPrice = (price, type) => {
  if (type === 'rent') {
    return `$${price.toLocaleString()}/mo`;
  }
  return `$${price.toLocaleString()}`;
};

// Helper function to get listings by type
export const getListingsByType = (type) => {
  return listings.filter(listing => listing.type === type);
};

// Helper function to get listing by id
export const getListingById = (id) => {
  return listings.find(listing => listing.id === id);
};

export default listings;

