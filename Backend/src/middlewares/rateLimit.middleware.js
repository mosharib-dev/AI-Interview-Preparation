/**
 * Minimal in-memory rate limiter.
 *
 * This is intentionally dependency-free so it works out of the box.
 * NOTE: it only rate-limits per Node process — if you run multiple
 * instances behind a load balancer, swap this for a shared-store limiter
 * (e.g. `express-rate-limit` backed by Redis) before scaling horizontally.
 */
function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 10, message = "Too many requests. Please try again later." } = {}) {
    const hits = new Map(); // ip -> { count, resetAt }

    // periodically clear stale entries so the map doesn't grow forever
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of hits.entries()) {
            if (value.resetAt <= now) hits.delete(key);
        }
    }, windowMs).unref();

    return function rateLimit(req, res, next) {
        const key = req.ip;
        const now = Date.now();
        const entry = hits.get(key);

        if (!entry || entry.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        if (entry.count >= max) {
            const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
            res.set("Retry-After", String(retryAfterSeconds));
            return res.status(429).json({ message });
        }

        entry.count += 1;
        next();
    };
}

module.exports = { createRateLimiter };
