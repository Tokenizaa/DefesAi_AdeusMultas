import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createApp, databaseRows, auditLogs } from './src/server/app';
import { seedDemoCase } from './src/server/seed/demo-case';
import { KNOWLEDGE_TESES } from './src/core/knowledge/knowledge-base';
import { marketingOrchestrator } from './src/server/workers/marketing-orchestrator.worker';
import { marketingMetricsCollector } from './src/server/workers/marketing-metrics.worker';

dotenv.config();

// ---------------------------------------------------------------------------
// Seed demo case
// ---------------------------------------------------------------------------
seedDemoCase(databaseRows);

// Record initial audit log
auditLogs.unshift({
  id: 'aud_init_001',
  timestamp: new Date().toISOString(),
  actor: 'System Kernel',
  action: 'SYSTEM_BOOTSTRAP',
  targetResource: 'system_core',
  ipHash: 'e3b0c44298fc1c149afbf4c8996fb924',
  details: `System initialized. Tables: 113, RAG Teses: ${KNOWLEDGE_TESES.length}`,
  gdprCompliant: true,
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const app = createApp();

  // Vite middleware (dev) or static assets (prod)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DefesAi Server running on http://0.0.0.0:${PORT}`);

    // Start background workers
    try {
      marketingOrchestrator.start();
      marketingMetricsCollector.collect().catch(() => {});
      databaseRows.loadAllFromSupabase?.()?.catch?.(() => {});
    } catch (workerErr) {
      console.warn('Background workers initialization notice:', workerErr);
    }
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
