import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOConfig, generateDynamicSEO } from '../utils/seoConfig';

// Hook for managing SEO on different pages
export const useSEO = (customSEO = null, dynamicData = null) => {
  const location = useLocation();
  
  useEffect(() => {
    let seoData;
    
    if (customSEO) {
      seoData = customSEO;
    } else if (dynamicData) {
      seoData = generateDynamicSEO(dynamicData.type, dynamicData.data);
    } else {
      seoData = getSEOConfig(location.pathname);
    }

    // Update document title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && seoData.description) {
      metaDescription.setAttribute('content', seoData.description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && seoData.keywords) {
      metaKeywords.setAttribute('content', seoData.keywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && seoData.title) {
      ogTitle.setAttribute('content', seoData.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && seoData.description) {
      ogDescription.setAttribute('content', seoData.description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://travelgrid.com${location.pathname}`);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && seoData.image) {
      ogImage.setAttribute('content', seoData.image);
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType && seoData.type) {
      ogType.setAttribute('content', seoData.type);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && seoData.title) {
      twitterTitle.setAttribute('content', seoData.title);
    }

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription && seoData.description) {
      twitterDescription.setAttribute('content', seoData.description);
    }

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', `https://travelgrid.com${location.pathname}`);
    }

    const twitterImage = document.querySelector('meta[property="twitter:image"]');
    if (twitterImage && seoData.image) {
      twitterImage.setAttribute('content', seoData.image);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://travelgrid.com${location.pathname}`);

    // Add structured data if provided
    if (seoData.structuredData) {
      // Remove existing structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(seoData.structuredData);
      document.head.appendChild(script);
    }

  }, [location.pathname, customSEO, dynamicData]);

  return null;
};

export default useSEO;
