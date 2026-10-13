import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { app } from './src/server/app.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve port: respect CLI flag --port, then process.env.DEFAULT_APP_PORT, then process.env.PORT (ignoring 8080 which nginx occupies), fallback to 3000
function resolvePort(): number {
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const val = parseInt(process.argv[portArgIdx + 1], 10);
    if (!isNaN(val) && val > 0) return val;
  }
  if (process.env.DEFAULT_APP_PORT) {
    const val = parseInt(process.env.DEFAULT_APP_PORT, 10);
    if (!isNaN(val) && val > 0) return val;
  }
  if (process.env.PORT && process.env.PORT !== '8080') {
    const val = parseInt(process.env.PORT, 10);
    if (!isNaN(val) && val > 0) return val;
  }
  return 3000;
}

// Resolve host: respect CLI flag --host, fallback to 0.0.0.0
function resolveHost(): string {
  const hostArgIdx = process.argv.indexOf('--host');
  if (hostArgIdx !== -1 && process.argv[hostArgIdx + 1]) {
    return process.argv[hostArgIdx + 1];
  }
  return process.env.HOST || '0.0.0.0';
}

const PORT = resolvePort();
const HOST = resolveHost();

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[Karachi Bites] Production-grade server listening on http://${HOST}:${PORT}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    console.error(`[Karachi Bites] Server error:`, err);
    if (err.code === 'EADDRINUSE') {
      console.error(`[Karachi Bites] Port ${PORT} is already in use. Retrying or shutting down...`);
    }
  });

  const shutdown = () => {
    console.log('[Karachi Bites] Shutting down gracefully...');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();

export { app };
