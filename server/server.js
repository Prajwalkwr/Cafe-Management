import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import api from './routes/index.js';
import { connectDatabase, databaseReady, disconnectDatabase } from './config/db.js';
import { seedIfEmpty } from './seed.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is missing. Using a temporary secret until you set one in .env.');
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.locals.databaseReady = databaseReady;

const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

function allowedOrigin(origin) {
  if (!origin) return true;
  return origins.some((rule) => {
    if (rule === origin) return true;
    if (!rule.includes('*')) return false;
    const pattern = new RegExp(`^${rule.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^.]*')}$`);
    return pattern.test(origin);
  });
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(cors({ origin: (origin, done) => done(null, allowedOrigin(origin)) }));
app.use(express.json({ limit: '1mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', api);

const dist = path.resolve(__dirname, '../dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next();
      return;
    }
    res.sendFile(path.join(dist, 'index.html'), (error) => {
      if (error) next();
    });
  });
}

app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
const server = app.listen(port);
server.on('listening', () => {
  console.log(`Mithaas Café server listening on port ${port}`);
  bootDatabase();
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. The Mithaas server already running will keep handling requests.`);
    return;
  }
  console.error(error);
  process.exit(1);
});

let booting = false;

async function bootDatabase() {
  if (booting) return;
  booting = true;
  try {
    await connectDatabase();
    await seedIfEmpty();
  } catch (error) {
    console.error('Database connection failed. The site will stay up and show a clear error.');
    console.error(error instanceof Error ? error.message : error);
    setTimeout(bootDatabase, 2000);
  } finally {
    booting = false;
  }
}

async function shutdown() {
  server.close();
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
