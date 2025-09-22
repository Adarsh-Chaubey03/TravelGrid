import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({
  title = "TravelGrid | Discover Top Travel Packages, Hotels & Local Experiences",
  description = "Your ultimate travel companion! Discover amazing travel packages, book hotels, plan itineraries, and explore local experiences around the world. Plan your next adventure with ease.",
  keywords = "travel, travel packages, hotels, booking, travel planning, vacation, tourism, destinations, travel guides, travel tips, travel deals, adventure travel",
  image = "https://travel-grid.vercel.app/og-image.png",
  url = "https://travel-grid.vercel.app",
  type = "website",
  author = "TravelGrid Team",
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const location = useLocation();
  const currentUrl = `${url}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property, content) => {
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

    // Update or create link tags
    const updateLinkTag = (rel, href) => {
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

    // Primary Meta Tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '7 days');

    // Canonical URL
    updateLinkTag('canonical', currentUrl);

    // Open Graph Tags
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', currentUrl);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:image:alt', title);
    updateMetaTag('og:site_name', 'TravelGrid');
    updateMetaTag('og:locale', 'en_US');

    // Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', currentUrl);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:image:alt', title);
    updateMetaTag('twitter:creator', '@TravelGrid');
    updateMetaTag('twitter:site', '@TravelGrid');

    // Article specific tags (if type is article)
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

    // JSON-LD Structured Data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'Article' : 'WebSite',
      "name": title,
      "description": description,
      "url": currentUrl,
      "image": image,
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

  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, section, tags, currentUrl]);

  return null; // This component doesn't render anything
};

export default SEOHead;
