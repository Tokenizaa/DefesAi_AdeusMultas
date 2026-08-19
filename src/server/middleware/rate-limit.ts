import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter: 200 requests per IP per 15-minute window.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
});

/**
 * Strict rate limiter: 20 requests per IP per 15-minute window.
 * Applied to /api/ai and /api/auth endpoints.
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite de requisições excedido para este serviço.' },
});
