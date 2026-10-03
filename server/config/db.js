import fs from 'fs';
import net from 'net';
import os from 'os';
import path from 'path';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

function clearStaleLock(dbPath) {
  const lockFile = path.join(dbPath, 'mongod.lock');
  if (!fs.existsSync(lockFile)) return;
  const content = fs.readFileSync(lockFile, 'utf8').trim();
  if (!content || content === '0') {
    fs.writeFileSync(lockFile, '');
    return;
  }
  const pid = Number(content);
  if (!Number.isFinite(pid)) {
    fs.writeFileSync(lockFile, '');
    return;
  }
  try {
    process.kill(pid, 0);
  } catch {
    fs.writeFileSync(lockFile, '');
  }
}

function portOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    const done = (open) => {
      socket.destroy();
      resolve(open);
    };
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.setTimeout(400, () => done(false));
  });
}

async function startEmbeddedMongo() {
  if (memoryServer) return memoryServer.getUri();
  const port = Number(process.env.MONGO_PORT || 27018);
  const uri = `mongodb://127.0.0.1:${port}/`;
  if (await portOpen(port)) return uri;

  const dbPath = path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'mithaas-cafe', 'mongo');
  fs.mkdirSync(dbPath, { recursive: true });
  clearStaleLock(dbPath);

  try {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbPath,
        storageEngine: 'wiredTiger',
        port,
      },
    });
    return memoryServer.getUri();
  } catch (error) {
    if (await portOpen(port)) return uri;
    throw error;
  }
}

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  const externalUri = process.env.MONGODB_URI?.trim();
  const uri = externalUri || (await startEmbeddedMongo());
  await mongoose.connect(uri);
  console.log(externalUri ? 'Connected to MongoDB.' : 'Connected to local MongoDB storage.');
}

export async function disconnectDatabase() {
  await mongoose.disconnect().catch(() => {});
  if (memoryServer) {
    await memoryServer.stop().catch(() => {});
    memoryServer = null;
  }
}

export function databaseReady() {
  return mongoose.connection.readyState === 1;
}
