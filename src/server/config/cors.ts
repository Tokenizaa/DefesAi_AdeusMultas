import cors from 'cors';

const PORT = process.env.PORT || 3000;

/**
 * Allowed origins for CORS — explicitly listed, never wildcard.
 */
export const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  `http://localhost:${PORT}`,
  process.env.PRODUCTION_URL || 'https://defesai.com.br',
].filter(Boolean);

/**
 * CORS middleware configured with origin validation.
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
