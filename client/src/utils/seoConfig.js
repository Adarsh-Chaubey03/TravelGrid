// SEO configurations for different pages
export const seoConfig = {
  home: {
    title: 'TravelGrid | Discover Top Travel Packages, Hotels & Local Experiences',
    description: 'TravelGrid - Discover top travel packages, hotels & local experiences around the world. Plan your next trip with ease using our AI-powered travel planning tools, currency converter, and comprehensive travel guides.',
    keywords: 'travel, travel packages, hotels, travel planning, AI travel planner, currency converter, travel guides, destinations, booking, vacation planning, travel tips, travel forum',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "TravelGrid",
      "description": "Discover top travel packages, hotels & local experiences around the world. Plan your next trip with ease using our AI-powered travel planning tools.",
      "url": "https://travelgrid.com",
      "logo": "https://travelgrid.com/logo.jpg",
      "sameAs": [
        "https://github.com/travelgrid",
        "https://twitter.com/travelgrid"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi", "Spanish", "German", "French"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "offers": {
        "@type": "Offer",
        "category": "Travel Services",
        "description": "Travel packages, hotel bookings, travel planning, and destination guides"
      }
    }
  },
  
  about: {
    title: 'About TravelGrid | Your Ultimate Travel Planning Companion',
    description: 'Learn about TravelGrid - the innovative travel platform that combines AI-powered planning, comprehensive destination guides, and seamless booking experiences to make your travel dreams come true.',
    keywords: 'about travelgrid, travel platform, AI travel planning, travel technology, travel innovation, travel company',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About TravelGrid",
      "description": "Learn about TravelGrid - the innovative travel platform that combines AI-powered planning, comprehensive destination guides, and seamless booking experiences.",
      "url": "https://travelgrid.com/about",
      "mainEntity": {
        "@type": "TravelAgency",
        "name": "TravelGrid",
        "description": "Innovative travel platform with AI-powered planning tools"
      }
    }
  },

  hotels: {
    title: 'Hotels & Accommodations | TravelGrid - Best Hotel Deals Worldwide',
    description: 'Find and book the best hotels worldwide with TravelGrid. Compare prices, read reviews, and discover amazing accommodations for your next trip. Best hotel deals and exclusive offers.',
    keywords: 'hotels, hotel booking, accommodation, hotel deals, hotel reviews, travel accommodation, hotel comparison, best hotels',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Hotels and Accommodations",
      "description": "Find and book the best hotels worldwide with TravelGrid",
      "url": "https://travelgrid.com/hotels",
      "itemListElement": {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "LodgingBusiness",
          "name": "TravelGrid Hotels",
          "description": "Worldwide hotel booking and accommodation services"
        }
      }
    }
  },

  packages: {
    title: 'Travel Packages | TravelGrid - All-Inclusive Vacation Deals',
    description: 'Discover amazing travel packages and all-inclusive vacation deals with TravelGrid. From budget-friendly trips to luxury getaways, find the perfect travel package for your next adventure.',
    keywords: 'travel packages, vacation deals, all-inclusive packages, travel deals, holiday packages, travel offers, vacation planning',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Travel Packages",
      "description": "Amazing travel packages and all-inclusive vacation deals",
      "url": "https://travelgrid.com/packages",
      "itemListElement": {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "TouristTrip",
          "name": "TravelGrid Packages",
          "description": "Comprehensive travel packages for all destinations"
        }
      }
    }
  },

  destinations: {
    title: 'Travel Destinations | TravelGrid - Explore Amazing Places Worldwide',
    description: 'Explore amazing travel destinations worldwide with TravelGrid. Discover hidden gems, popular tourist spots, and get comprehensive travel guides for your next adventure.',
    keywords: 'travel destinations, places to visit, tourist destinations, travel guides, destination guides, travel spots, vacation destinations',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Travel Destinations",
      "description": "Explore amazing travel destinations worldwide",
      "url": "https://travelgrid.com/destinations",
      "itemListElement": {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Place",
          "name": "Travel Destinations",
          "description": "Amazing places to visit around the world"
        }
      }
    }
  },

  travelPlanGenerator: {
    title: 'AI Travel Plan Generator | TravelGrid - Create Perfect Itineraries',
    description: 'Create perfect travel itineraries with TravelGrid\'s AI-powered travel plan generator. Get personalized recommendations, optimized routes, and detailed day-by-day plans for your trip.',
    keywords: 'AI travel planner, travel itinerary, travel plan generator, trip planning, vacation planner, travel route planner, AI travel assistant',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TravelGrid AI Travel Plan Generator",
      "description": "AI-powered travel plan generator for creating perfect itineraries",
      "url": "https://travelgrid.com/travel-plan-generator",
      "applicationCategory": "TravelApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },

  currencyConverter: {
    title: 'Currency Converter | TravelGrid - Real-Time Exchange Rates',
    description: 'Convert currencies with TravelGrid\'s real-time currency converter. Get accurate exchange rates for over 160 currencies and plan your travel budget effectively.',
    keywords: 'currency converter, exchange rates, travel money, currency exchange, travel budget, money converter, foreign exchange',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TravelGrid Currency Converter",
      "description": "Real-time currency converter with accurate exchange rates",
      "url": "https://travelgrid.com/currency-converter",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },

  blog: {
    title: 'Travel Blog | TravelGrid - Travel Tips, Guides & Stories',
    description: 'Read the latest travel tips, destination guides, and travel stories on TravelGrid\'s blog. Get expert advice, travel hacks, and inspiration for your next adventure.',
    keywords: 'travel blog, travel tips, travel guides, travel stories, travel advice, travel inspiration, travel hacks, destination guides',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "TravelGrid Blog",
      "description": "Travel tips, guides, and stories for travelers worldwide",
      "url": "https://travelgrid.com/blog",
      "publisher": {
        "@type": "Organization",
        "name": "TravelGrid",
        "logo": {
          "@type": "ImageObject",
          "url": "https://travelgrid.com/logo.jpg"
        }
      }
    }
  },

  contact: {
    title: 'Contact TravelGrid | Get in Touch with Our Travel Experts',
    description: 'Contact TravelGrid for travel assistance, booking support, or general inquiries. Our travel experts are here to help you plan your perfect trip.',
    keywords: 'contact travelgrid, travel support, travel assistance, customer service, travel help, booking support',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact TravelGrid",
      "description": "Get in touch with TravelGrid travel experts",
      "url": "https://travelgrid.com/contact",
      "mainEntity": {
        "@type": "TravelAgency",
        "name": "TravelGrid",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi", "Spanish", "German", "French"]
        }
      }
    }
  },

  faq: {
    title: 'TravelGrid FAQ | Frequently Asked Questions',
    description: 'Find answers to frequently asked questions about TravelGrid services, booking process, travel planning, and more. Get quick help with common travel queries.',
    keywords: 'travelgrid faq, travel questions, booking help, travel support, travel assistance, common questions',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "TravelGrid FAQ",
      "description": "Frequently asked questions about TravelGrid services",
      "url": "https://travelgrid.com/faq",
      "mainEntity": {
        "@type": "Question",
        "name": "TravelGrid Services FAQ",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common questions and answers about TravelGrid travel services"
        }
      }
    }
  }
};

// Function to get SEO config for a specific route
export const getSEOConfig = (pathname) => {
  const route = pathname.replace('/', '') || 'home';
  return seoConfig[route] || seoConfig.home;
};

// Function to generate dynamic SEO for specific content
export const generateDynamicSEO = (type, data) => {
  switch (type) {
    case 'hotel':
      return {
        title: `${data.name} | Hotel Details - TravelGrid`,
        description: `Book ${data.name} with TravelGrid. ${data.description || 'Experience luxury and comfort at this amazing hotel.'} Best rates and exclusive deals available.`,
        keywords: `${data.name}, hotel booking, ${data.location}, accommodation, hotel deals, travel booking`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": data.name,
          "description": data.description,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": data.location
          },
          "url": `https://travelgrid.com/hotels/${data.id}`,
          "image": data.image
        }
      };
    
    case 'destination':
      return {
        title: `${data.name} | Travel Guide - TravelGrid`,
        description: `Discover ${data.name} with TravelGrid's comprehensive travel guide. Find attractions, hotels, restaurants, and plan your perfect trip to ${data.name}.`,
        keywords: `${data.name}, travel guide, ${data.country}, attractions, travel tips, destination guide`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": data.name,
          "description": data.description,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": data.country
          },
          "url": `https://travelgrid.com/destinations/${data.id}`
        }
      };
    
    case 'package':
      return {
        title: `${data.title} | Travel Package - TravelGrid`,
        description: `Book ${data.title} travel package with TravelGrid. ${data.description} All-inclusive deals with best prices and exclusive offers.`,
        keywords: `${data.title}, travel package, ${data.destination}, vacation package, travel deals, holiday package`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": data.title,
          "description": data.description,
          "url": `https://travelgrid.com/packages/${data.id}`,
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": data.currency || "USD"
          }
        }
      };
    
    default:
      return seoConfig.home;
  }
};
