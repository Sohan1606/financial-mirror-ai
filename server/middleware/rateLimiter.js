function rateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const max = options.max || 100; // max requests per window
  const message = options.message || { message: 'Too many requests, please try again later' };
  
  // Create a separate store for each instance of the rate limiter
  const rateLimitStore = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, firstRequest: now });
      return next();
    }

    const record = rateLimitStore.get(key);
    
    // Reset if window has expired
    if (now - record.firstRequest > windowMs) {
      rateLimitStore.set(key, { count: 1, firstRequest: now });
      return next();
    }

    // Increment count
    record.count++;

    // Check if limit exceeded
    if (record.count > max) {
      return res.status(429).json(message);
    }

    // Set rate limit headers
    res.set('X-RateLimit-Limit', max);
    res.set('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.set('X-RateLimit-Reset', new Date(record.firstRequest + windowMs).getTime());

    next();
  };
}

module.exports = rateLimiter;
