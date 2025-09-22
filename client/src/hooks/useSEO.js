import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook for managing SEO meta tags dynamically
export const useSEO = (seoConfig) => {
  const location = useLocation();
  
  useEffect(() => {
    if (!seoConfig) return;

    const {
      title,
      description,
      keywords,
      image,
      type = 'website',
      author = 'TravelGrid Team',
      publishedTime,
      modifiedTime,
      section,
      tags = []
    } = seoConfig;

    const baseUrl = 'https://travel-grid.vercel.app';
    const currentUrl = `${baseUrl}${location.pathname}`;

    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (property, content) => {
      if (!content) return;
      
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel, href) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (link) {
        link.setAttribute('href', href);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        document.head.appendChild(link);
      }
    };

    // Update primary meta tags
    if (title) updateMetaTag('title', title);
    if (description) updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    if (author) updateMetaTag('author', author);
    
    // Update canonical URL
    updateLinkTag('canonical', currentUrl);

    // Update Open Graph tags
    if (type) updateMetaTag('og:type', type);
    updateMetaTag('og:url', currentUrl);
    if (title) updateMetaTag('og:title', title);
    if (description) updateMetaTag('og:description', description);
    if (image) {
      updateMetaTag('og:image', image);
      updateMetaTag('og:image:alt', title || 'TravelGrid');
    }
    updateMetaTag('og:site_name', 'TravelGrid');
    updateMetaTag('og:locale', 'en_US');

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', currentUrl);
    if (title) updateMetaTag('twitter:title', title);
    if (description) updateMetaTag('twitter:description', description);
    if (image) {
      updateMetaTag('twitter:image', image);
      updateMetaTag('twitter:image:alt', title || 'TravelGrid');
    }
    updateMetaTag('twitter:creator', '@TravelGrid');
    updateMetaTag('twitter:site', '@TravelGrid');

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) updateMetaTag('article:published_time', publishedTime);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime);
      if (section) updateMetaTag('article:section', section);
      if (author) updateMetaTag('article:author', author);
      
      // Add article tags
      tags.forEach(tag => {
        const tagMeta = document.createElement('meta');
        tagMeta.setAttribute('property', 'article:tag');
        tagMeta.setAttribute('content', tag);
        document.head.appendChild(tagMeta);
      });
    }

    // Generate and update JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'Article' : 'WebSite',
      "name": title || 'TravelGrid',
      "description": description || 'Your ultimate travel companion',
      "url": currentUrl,
      "image": image || 'https://travel-grid.vercel.app/og-image.png',
      "author": {
        "@type": "Organization",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "TravelGrid",
        "logo": {
          "@type": "ImageObject",
          "url": "https://travel-grid.vercel.app/logo.jpg"
        }
      }
    };

    if (type === 'article') {
      jsonLd.datePublished = publishedTime;
      jsonLd.dateModified = modifiedTime;
      jsonLd.headline = title;
    } else {
      jsonLd.potentialAction = {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://travel-grid.vercel.app/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      };
    }

    // Remove existing JSON-LD
    const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    // Add new JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

  }, [location.pathname, seoConfig]);
};

// Hook for getting page-specific SEO config based on route
export const usePageSEO = () => {
  const location = useLocation();
  
  const getPageSEOConfig = () => {
    const path = location.pathname;
    
    // Define route patterns and their corresponding SEO configs
    const routeConfigs = {
      '/': {
        title: "TravelGrid | Discover Top Travel Packages, Hotels & Local Experiences",
        description: "Your ultimate travel companion! Discover amazing travel packages, book hotels, plan itineraries, and explore local experiences around the world. Plan your next adventure with ease.",
        keywords: "travel, travel packages, hotels, booking, travel planning, vacation, tourism, destinations, travel guides, travel tips, travel deals, adventure travel"
      },
      '/about': {
        title: "About TravelGrid | Your Ultimate Travel Companion",
        description: "Learn about TravelGrid - the comprehensive travel platform that makes trip planning effortless. Discover our mission to simplify travel experiences worldwide.",
        keywords: "about travelgrid, travel platform, travel company, travel mission, travel team, travel services"
      },
      '/hotels': {
        title: "Hotels & Accommodations | TravelGrid",
        description: "Find and book the perfect hotel for your next trip. Browse thousands of hotels worldwide with exclusive deals and instant booking confirmation.",
        keywords: "hotels, accommodations, hotel booking, hotel deals, luxury hotels, budget hotels, hotel reservations"
      },
      '/packages': {
        title: "Travel Packages & Deals | TravelGrid",
        description: "Discover amazing travel packages with great deals. All-inclusive vacation packages, adventure tours, and customized travel experiences.",
        keywords: "travel packages, vacation packages, tour packages, travel deals, all-inclusive packages, adventure tours, customized travel"
      },
      '/destinations': {
        title: "Travel Destinations | Explore the World with TravelGrid",
        description: "Explore amazing destinations around the world. Get travel guides, local insights, and plan your perfect trip to any destination.",
        keywords: "travel destinations, world destinations, travel guides, destination guides, travel planning, local experiences"
      },
      '/blog': {
        title: "Travel Blog & Tips | TravelGrid",
        description: "Read the latest travel tips, destination guides, and travel stories. Get inspired for your next adventure with our travel blog.",
        keywords: "travel blog, travel tips, travel stories, destination guides, travel inspiration, travel advice"
      },
      '/contact': {
        title: "Contact TravelGrid | Get in Touch",
        description: "Get in touch with TravelGrid team. We're here to help you plan your perfect trip and answer any travel-related questions.",
        keywords: "contact travelgrid, travel support, travel help, customer service, travel assistance"
      },
      '/faq': {
        title: "Frequently Asked Questions | TravelGrid",
        description: "Find answers to common questions about TravelGrid services, booking process, travel planning, and more.",
        keywords: "travelgrid faq, travel questions, booking help, travel support, travel assistance"
      },
      '/dashboard': {
        title: "My Dashboard | TravelGrid",
        description: "Manage your travel bookings, saved places, and travel history. Access your personalized travel dashboard.",
        keywords: "travel dashboard, my bookings, saved places, travel history, travel management"
      },
      '/login': {
        title: "Login | TravelGrid",
        description: "Sign in to your TravelGrid account to access your bookings, saved places, and personalized travel recommendations.",
        keywords: "travelgrid login, sign in, travel account, user login"
      },
      '/signup': {
        title: "Sign Up | TravelGrid",
        description: "Create your TravelGrid account to start planning amazing trips, save your favorite places, and get personalized travel recommendations.",
        keywords: "travelgrid signup, create account, travel registration, join travelgrid"
      },
      '/currency-converter': {
        title: "Currency Converter | TravelGrid",
        description: "Convert currencies with real-time exchange rates. Get accurate currency conversion for your travel planning and budgeting.",
        keywords: "currency converter, exchange rates, travel money, currency conversion, travel budget"
      },
      '/enhanced-currency': {
        title: "Enhanced Currency Converter | TravelGrid",
        description: "Advanced currency converter with real-time rates, historical data, and travel budgeting features.",
        keywords: "currency converter, exchange rates, travel money, currency conversion, travel budget, enhanced converter"
      },
      '/trip-calculator': {
        title: "Trip Cost Calculator | TravelGrid",
        description: "Calculate your trip expenses with our comprehensive travel cost calculator. Plan your budget for flights, hotels, food, and activities.",
        keywords: "trip calculator, travel cost calculator, budget planning, travel expenses, trip budget"
      },
      '/forum': {
        title: "Travel Forum | TravelGrid Community",
        description: "Join the TravelGrid community forum. Share travel experiences, ask questions, and connect with fellow travelers.",
        keywords: "travel forum, travel community, travel discussions, travel advice, travel experiences"
      },
      '/music': {
        title: "Travel Music Player | TravelGrid",
        description: "Discover the perfect travel playlist for your journey. Curated music for different travel moods and destinations.",
        keywords: "travel music, travel playlist, travel songs, music for travel, travel entertainment"
      },
      '/visa-checker': {
        title: "Visa Checker | TravelGrid",
        description: "Check visa requirements for your destination. Get up-to-date visa information and requirements for countries worldwide.",
        keywords: "visa checker, visa requirements, travel visa, visa information, travel documents"
      }
    };

    // Find matching route config
    for (const [route, config] of Object.entries(routeConfigs)) {
      if (path === route || path.startsWith(route + '/')) {
        return {
          ...config,
          image: "https://travel-grid.vercel.app/og-image.png"
        };
      }
    }

    // Default config for unmatched routes
    return {
      title: "TravelGrid | Discover Top Travel Packages, Hotels & Local Experiences",
      description: "Your ultimate travel companion! Discover amazing travel packages, book hotels, plan itineraries, and explore local experiences around the world.",
      keywords: "travel, travel packages, hotels, booking, travel planning, vacation, tourism, destinations",
      image: "https://travel-grid.vercel.app/og-image.png"
    };
  };

  return getPageSEOConfig();
};

export default useSEO;
