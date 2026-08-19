import { Router } from 'express';
import { databaseRows } from '../app';

const router = Router();

// Healthcheck endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DefesAi API',
    version: '2.0.0',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    activeCases: databaseRows.size,
    timestamp: new Date().toISOString(),
  });
});

export default router;
