import SEOHead from './SEOHead';

// SEO configurations for different pages
export const pageSEOConfig = {
  home: {
    title: "TravelGrid | Discover Top Travel Packages, Hotels & Local Experiences",
    description: "Your ultimate travel companion! Discover amazing travel packages, book hotels, plan itineraries, and explore local experiences around the world. Plan your next adventure with ease.",
    keywords: "travel, travel packages, hotels, booking, travel planning, vacation, tourism, destinations, travel guides, travel tips, travel deals, adventure travel",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  about: {
    title: "About TravelGrid | Your Ultimate Travel Companion",
    description: "Learn about TravelGrid - the comprehensive travel platform that makes trip planning effortless. Discover our mission to simplify travel experiences worldwide.",
    keywords: "about travelgrid, travel platform, travel company, travel mission, travel team, travel services",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  hotels: {
    title: "Hotels & Accommodations | TravelGrid",
    description: "Find and book the perfect hotel for your next trip. Browse thousands of hotels worldwide with exclusive deals and instant booking confirmation.",
    keywords: "hotels, accommodations, hotel booking, hotel deals, luxury hotels, budget hotels, hotel reservations",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  packages: {
    title: "Travel Packages & Deals | TravelGrid",
    description: "Discover amazing travel packages with great deals. All-inclusive vacation packages, adventure tours, and customized travel experiences.",
    keywords: "travel packages, vacation packages, tour packages, travel deals, all-inclusive packages, adventure tours, customized travel",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  destinations: {
    title: "Travel Destinations | Explore the World with TravelGrid",
    description: "Explore amazing destinations around the world. Get travel guides, local insights, and plan your perfect trip to any destination.",
    keywords: "travel destinations, world destinations, travel guides, destination guides, travel planning, local experiences",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  blog: {
    title: "Travel Blog & Tips | TravelGrid",
    description: "Read the latest travel tips, destination guides, and travel stories. Get inspired for your next adventure with our travel blog.",
    keywords: "travel blog, travel tips, travel stories, destination guides, travel inspiration, travel advice",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  contact: {
    title: "Contact TravelGrid | Get in Touch",
    description: "Get in touch with TravelGrid team. We're here to help you plan your perfect trip and answer any travel-related questions.",
    keywords: "contact travelgrid, travel support, travel help, customer service, travel assistance",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  faq: {
    title: "Frequently Asked Questions | TravelGrid",
    description: "Find answers to common questions about TravelGrid services, booking process, travel planning, and more.",
    keywords: "travelgrid faq, travel questions, booking help, travel support, travel assistance",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  dashboard: {
    title: "My Dashboard | TravelGrid",
    description: "Manage your travel bookings, saved places, and travel history. Access your personalized travel dashboard.",
    keywords: "travel dashboard, my bookings, saved places, travel history, travel management",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  login: {
    title: "Login | TravelGrid",
    description: "Sign in to your TravelGrid account to access your bookings, saved places, and personalized travel recommendations.",
    keywords: "travelgrid login, sign in, travel account, user login",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  signup: {
    title: "Sign Up | TravelGrid",
    description: "Create your TravelGrid account to start planning amazing trips, save your favorite places, and get personalized travel recommendations.",
    keywords: "travelgrid signup, create account, travel registration, join travelgrid",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  currency: {
    title: "Currency Converter | TravelGrid",
    description: "Convert currencies with real-time exchange rates. Get accurate currency conversion for your travel planning and budgeting.",
    keywords: "currency converter, exchange rates, travel money, currency conversion, travel budget",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  calculator: {
    title: "Trip Cost Calculator | TravelGrid",
    description: "Calculate your trip expenses with our comprehensive travel cost calculator. Plan your budget for flights, hotels, food, and activities.",
    keywords: "trip calculator, travel cost calculator, budget planning, travel expenses, trip budget",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  forum: {
    title: "Travel Forum | TravelGrid Community",
    description: "Join the TravelGrid community forum. Share travel experiences, ask questions, and connect with fellow travelers.",
    keywords: "travel forum, travel community, travel discussions, travel advice, travel experiences",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  music: {
    title: "Travel Music Player | TravelGrid",
    description: "Discover the perfect travel playlist for your journey. Curated music for different travel moods and destinations.",
    keywords: "travel music, travel playlist, travel songs, music for travel, travel entertainment",
    image: "https://travel-grid.vercel.app/og-image.png"
  },
  
  visa: {
    title: "Visa Checker | TravelGrid",
    description: "Check visa requirements for your destination. Get up-to-date visa information and requirements for countries worldwide.",
    keywords: "visa checker, visa requirements, travel visa, visa information, travel documents",
    image: "https://travel-grid.vercel.app/og-image.png"
  }
};

// Component to render SEO for specific pages
const PageSEO = ({ pageKey, customTitle, customDescription, customKeywords, customImage }) => {
  const config = pageSEOConfig[pageKey] || pageSEOConfig.home;
  
  return (
    <SEOHead
      title={customTitle || config.title}
      description={customDescription || config.description}
      keywords={customKeywords || config.keywords}
      image={customImage || config.image}
    />
  );
};

export default PageSEO;
