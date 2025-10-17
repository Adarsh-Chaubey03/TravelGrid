import sanitizeHtml from 'sanitize-html';
import qs from 'qs';


const enhancedSanitizationMiddleware = (req, res, next) => {
  try {
    
    if (req.originalUrl.includes('?')) {
      const queryPart = req.originalUrl.split('?')[1];
      req.query = qs.parse(queryPart, {
        allowPrototypes: false,
        depth: 10,
        parameterLimit: 1000,
      });
    }

    
    const sanitizeData = (data) => {
      if (typeof data === 'string') {
        return sanitizeHtml(data, {
          allowedTags: [],
          allowedAttributes: {},
          disallowedTagsMode: 'discard',
        }).trim();
      }

      if (Array.isArray(data)) {
        return data.map((item) => sanitizeData(item));
      }

      if (data && typeof data === 'object') {
        const clean = {};
        for (const key of Object.keys(data)) {
          clean[key] = sanitizeData(data[key]);
        }
        return clean;
      }

      return data;
    };

    
    req.body = sanitizeData(req.body);
    req.query = sanitizeData(req.query);
    req.params = sanitizeData(req.params);

    next();
  } catch (error) {
    console.error('[Sanitization Error]:', error.message);
    res.status(400).json({ message: 'Invalid or malicious input detected' });
  }
};

export default enhancedSanitizationMiddleware;
