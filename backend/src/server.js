import express from 'express';
import cors from 'cors';
import { getEnv } from './lib/env.js';
import { insertChatMessage } from './services/supabase.js';

const env = getEnv();
const app = express();

app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'flixcod-api',
    supabaseConfigured: env.isConfigured,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    mode: 'device-first',
    providers: ['Open Code', 'Google Gemini', 'openclaw', 'Open Source'],
    storage: env.isConfigured ? 'supabase' : 'memory-only'
  });
});

app.post('/api/chat', async (req, res) => {
  const {
    message = '',
    provider = 'Open Source',
    model = 'default',
    localMode = true,
    userId = 'anonymous'
  } = req.body || {};

  const cleanMessage = String(message).trim();
  if (!cleanMessage) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const output = `FlixCod> ${cleanMessage}`;

  const dbResult = await insertChatMessage({
    user_id: userId,
    provider,
    model,
    local_mode: localMode,
    input_text: cleanMessage,
    output_text: output
  });

  return res.json({
    output,
    provider,
    model,
    mode: localMode ? 'local-device' : 'cloud-proxy',
    persisted: dbResult.ok,
    persistenceMessage: dbResult.ok ? 'Saved to Supabase.' : dbResult.reason
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(env.port, () => {
  console.log(`FlixCod backend listening on http://localhost:${env.port}`);

const app = express();
app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin }));
app.use(express.json());

async function ensureDb() {
  const dir = path.dirname(dbPath);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(dbPath);
  } catch {
    const initialData = {
      users: [],
      toolEvents: [],
      createdAt: new Date().toISOString(),
      version: 1
    };
    await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw);
}

async function writeDb(nextDb) {
  await fs.writeFile(dbPath, JSON.stringify(nextDb, null, 2), 'utf-8');
}

const validateEmail = (email) => /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]{2,}$/.test(email);

async function authRequired(req, res, next) {
  const userId = req.header('x-user-id');
  if (!userId) {
    return res
      .status(401)
      .json({ error: 'registration_required', message: 'User registration is required to use tools.' });
  }

  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'invalid_user', message: 'Session is invalid. Please register again.' });
  }

  req.user = user;
  return next();
}

app.get('/api/health', async (_req, res) => {
  const db = await readDb();
  res.json({
    status: 'ok',
    service: 'flixcod-api',
    dbFile: dbPath,
    timestamp: new Date().toISOString(),
    users: db.users.length,
    events: db.toolEvents.length
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name = '', email = '' } = req.body || {};
  const safeName = String(name).trim();
  const safeEmail = String(email).trim().toLowerCase();

  if (safeName.length < 2) {
    return res.status(400).json({ error: 'invalid_name', message: 'Name must be at least 2 characters.' });
  }

  if (!validateEmail(safeEmail)) {
    return res.status(400).json({ error: 'invalid_email', message: 'Please enter a valid email address.' });
  }

  const db = await readDb();
  let user = db.users.find((item) => item.email === safeEmail);

  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: safeName,
      email: safeEmail,
      createdAt: new Date().toISOString(),
      plan: 'free'
    };
    db.users.push(user);
    await writeDb(db);
  }

  return res.status(201).json({
    message: 'Registered successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan
    }
  });
});

app.get('/api/tools', authRequired, (_req, res) => {
  res.json({
    tools: [
      { key: 'chat', name: 'AI Chat', requiresRegistration: true },
      { key: 'terminal-helper', name: 'Terminal Helper', requiresRegistration: true },
      { key: 'deploy-guide', name: 'Deploy Guide', requiresRegistration: true }
    ]
  });
});

app.post('/api/chat', authRequired, async (req, res) => {
  const { message = '', provider = 'Open Source', model = 'default', localMode = true } = req.body || {};
  const db = await readDb();

  db.toolEvents.push({
    id: crypto.randomUUID(),
    type: 'chat',
    userId: req.user.id,
    provider,
    model,
    localMode: Boolean(localMode),
    messageLength: String(message).trim().length,
    at: new Date().toISOString()
  });
  await writeDb(db);

  res.json({
    output: `Echo: ${message}`,
    provider,
    model,
    mode: localMode ? 'local-device' : 'cloud-proxy',
    note: 'Starter endpoint جاهز للربط مع Gemini/OpenRouter/Supabase Edge Functions.'
  });
});

const port = process.env.PORT || 8787;
ensureDb().then(() => {
  app.listen(port, () => {
    console.log(`FlixCod backend listening on http://localhost:${port}`);
    console.log(`DB file: ${dbPath}`);
  });
});
