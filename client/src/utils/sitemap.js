// Sitemap generator utility
export const generateSitemap = () => {
  const baseUrl = 'https://travel-grid.vercel.app';
  const currentDate = new Date().toISOString();
  
  const routes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/hotels', priority: '0.9', changefreq: 'weekly' },
    { url: '/packages', priority: '0.9', changefreq: 'weekly' },
    { url: '/destinations', priority: '0.9', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'monthly' },
    { url: '/currency-converter', priority: '0.8', changefreq: 'monthly' },
    { url: '/enhanced-currency', priority: '0.8', changefreq: 'monthly' },
    { url: '/trip-calculator', priority: '0.8', changefreq: 'monthly' },
    { url: '/forum', priority: '0.8', changefreq: 'daily' },
    { url: '/music', priority: '0.7', changefreq: 'monthly' },
    { url: '/visa-checker', priority: '0.8', changefreq: 'monthly' },
    { url: '/travel-plan-generator', priority: '0.8', changefreq: 'monthly' },
    { url: '/packing-checklist', priority: '0.7', changefreq: 'monthly' },
    { url: '/trending-spots', priority: '0.8', changefreq: 'weekly' },
    { url: '/login', priority: '0.6', changefreq: 'monthly' },
    { url: '/signup', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
    { url: '/terms', priority: '0.5', changefreq: 'yearly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Function to download sitemap (development only)
export const downloadSitemap = () => {
  if (process.env.NODE_ENV === 'development') {
    const sitemap = generateSitemap();
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Function to validate SEO meta tags (development only)
export const validateSEO = () => {
  if (process.env.NODE_ENV !== 'development') {
    return [];
  }
  
  const issues = [];
  
  // Check for required meta tags
  const requiredTags = [
    'title',
    'description',
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image'
  ];
  
  requiredTags.forEach(tag => {
    const meta = document.querySelector(`meta[property="${tag}"]`) || 
                 document.querySelector(`meta[name="${tag}"]`);
    if (!meta) {
      issues.push(`Missing meta tag: ${tag}`);
    }
  });
  
  // Check title length
  const title = document.title;
  if (title.length > 60) {
    issues.push(`Title too long: ${title.length} characters (recommended: 50-60)`);
  }
  
  // Check description length
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const descLength = description.getAttribute('content').length;
    if (descLength > 160) {
      issues.push(`Description too long: ${descLength} characters (recommended: 150-160)`);
    }
  }
  
  // Check for canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push('Missing canonical URL');
  }
  
  return issues;
};

// Function to test social media previews
export const testSocialPreviews = () => {
  const tests = [
    {
      name: 'Facebook Debugger',
      url: 'https://developers.facebook.com/tools/debug/',
      description: 'Test how your page appears when shared on Facebook'
    },
    {
      name: 'Twitter Card Validator',
      url: 'https://cards-dev.twitter.com/validator',
      description: 'Test how your page appears when shared on Twitter'
    },
    {
      name: 'LinkedIn Post Inspector',
      url: 'https://www.linkedin.com/post-inspector/',
      description: 'Test how your page appears when shared on LinkedIn'
    },
    {
      name: 'WhatsApp Link Preview',
      url: 'https://developers.facebook.com/tools/debug/',
      description: 'Test how your page appears when shared on WhatsApp'
    }
  ];
  
  return tests;
};

export default {
  generateSitemap,
  downloadSitemap,
  validateSEO,
  testSocialPreviews
};
