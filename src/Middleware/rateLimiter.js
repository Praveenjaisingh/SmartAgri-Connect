/**
 * Simple in-memory rate limiter (no redis needed)
 * For production use express-rate-limit with a Redis store.
 */
const rateStore = new Map();

function rateLimiter({ windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.' } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateStore.has(key)) {
      rateStore.set(key, []);
    }

    const timestamps = rateStore.get(key).filter(ts => ts > windowStart);
    timestamps.push(now);
    rateStore.set(key, timestamps);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - timestamps.length));
    console.log({ip: req.ip,remote: req.connection.remoteAddress,key,count: timestamps.length,max});

    if (timestamps.length > max) {
      return res.status(429).json({
        status: false,
        errors: [message]
      });
    }

    next();
  };
}

setInterval(() => {
  const cutoff = Date.now() - 15 * 60 * 1000;
  for (const [key, timestamps] of rateStore.entries()) {
    const fresh = timestamps.filter(ts => ts > cutoff);
    if (fresh.length === 0) {
      rateStore.delete(key);
    } else {
      rateStore.set(key, fresh);
    }
  }
}, 5 * 60 * 1000);

module.exports = rateLimiter;
