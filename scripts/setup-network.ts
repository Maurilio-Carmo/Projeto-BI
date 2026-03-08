// scripts/setup-network.ts

import * as os   from 'os';
import * as fs   from 'fs';
import * as path from 'path';
import * as net  from 'net';

const ROOT          = path.resolve(__dirname, '..');
const BACKEND_ENV   = path.join(ROOT, 'backend', '.env');
const FRONTEND_ENV  = path.join(ROOT, 'frontend', '.env.local');
const BACKEND_PORT  = getBackendPort();
const FRONTEND_PORT = 5173;

// ─── Template do backend/.env ────────────────────────────────────────────────
const BACKEND_ENV_TEMPLATE: Record<string, string> = {
  // Banco de dados
  DATABASE_HOST:     'localhost',
  DATABASE_PORT:     '3306',
  DATABASE_USER:     'root',
  DATABASE_PASSWORD: 'masterkey',
  DATABASE_NAME:     'fiscalsync',

  // API Externa (VarejoFácil) — preencher manualmente após geração
  EXTERNAL_API_BASE_URL: 'https://mercado.varejofacil.com/api/v1',
  EXTERNAL_API_TOKEN:    '',

  // Servidor NestJS
  PORT: '3000',

  // CORS — preenchido automaticamente pelo script de rede
  FRONTEND_URL:    'http://localhost:5173',
  ALLOWED_ORIGINS: 'http://localhost:5173',
};

// ─── Utilitários de ENV ──────────────────────────────────────────────────────

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};

  return fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .reduce<Record<string, string>>((acc, line) => {
      const t = line.trim();
      if (!t || t.startsWith('#')) return acc;
      const sep = t.indexOf('=');
      if (sep === -1) return acc;
      acc[t.slice(0, sep).trim()] = t.slice(sep + 1).trim();
      return acc;
    }, {});
}

function writeEnvFile(filePath: string, data: Record<string, string>): void {
  const content = Object.entries(data).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

function upsertEnvFile(filePath: string, updates: Record<string, string>): void {
  writeEnvFile(filePath, { ...parseEnvFile(filePath), ...updates });
}

function getBackendPort(): number {
  const env = parseEnvFile(path.join(path.resolve(__dirname, '..'), 'backend', '.env'));
  return parseInt(env['PORT'] ?? '3000', 10);
}

// ─── Criação automática do backend/.env ─────────────────────────────────────

/**
 * Se o backend/.env não existir, cria a partir do template.
 * Retorna true se o arquivo foi criado agora, false se já existia.
 */
function ensureBackendEnv(): boolean {
  if (fs.existsSync(BACKEND_ENV)) return false;

  const g = '\x1b[32m', y = '\x1b[33m', c = '\x1b[36m', b = '\x1b[1m', r = '\x1b[0m';

  console.log(`${y}⚙  backend/.env não encontrado — criando a partir do template...${r}`);
  writeEnvFile(BACKEND_ENV, BACKEND_ENV_TEMPLATE);
  console.log(`${g}✔  backend/.env criado em:${r} ${c}${BACKEND_ENV}${r}`);
  console.log(`${b}   ⚠  Preencha os campos obrigatórios antes de iniciar:${r}`);
  console.log(`      • DATABASE_PASSWORD`);
  console.log(`      • EXTERNAL_API_TOKEN\n`);

  return true;
}

// ─── Verificação de portas ───────────────────────────────────────────────────

/**
 * Verifica se uma porta TCP está ocupada na máquina local.
 * Resolve com true se ocupada, false se livre.
 */
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err: NodeJS.ErrnoException) => {
      resolve(err.code === 'EADDRINUSE');
    });

    server.once('listening', () => {
      server.close(() => resolve(false));
    });

    server.listen(port, '0.0.0.0');
  });
}

async function checkPorts(): Promise<boolean> {
  const y = '\x1b[33m', g = '\x1b[32m', rr = '\x1b[31m', r = '\x1b[0m';

  const ports = [
    { port: BACKEND_PORT,  label: `Backend  (NestJS)` },
    { port: FRONTEND_PORT, label: `Frontend (Vite)  ` },
  ];

  let allFree = true;

  console.log('🔍 Verificando disponibilidade de portas...');

  for (const { port, label } of ports) {
    const inUse = await isPortInUse(port);
    if (inUse) {
      console.log(`   ${rr}✖  ${label} — porta ${port} já está em uso!${r}`);
      allFree = false;
    } else {
      console.log(`   ${g}✔  ${label} — porta ${port} livre${r}`);
    }
  }

  if (!allFree) {
    console.log(`\n${y}⚠  Encerre o processo que usa a(s) porta(s) acima antes de iniciar.${r}`);
    console.log(`   Dica: ${y}lsof -i :<porta>${r} ou ${y}netstat -ano | findstr <porta>${r}\n`);
  } else {
    console.log();
  }

  return allFree;
}

// ─── Detecção de IP e configuração de rede ──────────────────────────────────

function detectLocalIP(): string | null {
  const IGNORED_PREFIXES = ['127.', '169.254.', '0.'];
  const IGNORED_IFACES   = /^(lo\d*|docker|br-|veth|vmnet|virbr|tun|tap|vbox)/i;

  for (const [name, addrs] of Object.entries(os.networkInterfaces())) {
    if (!addrs)                    continue;
    if (IGNORED_IFACES.test(name)) continue;

    for (const addr of addrs) {
      if (addr.family !== 'IPv4') continue;
      if (addr.internal)          continue;
      if (IGNORED_PREFIXES.some(p => addr.address.startsWith(p))) continue;
      return addr.address;
    }
  }
  return null;
}

function applyNetworkConfig(ip: string): void {
  const backendUrl  = `http://${ip}:${BACKEND_PORT}`;
  const frontendUrl = `http://${ip}:${FRONTEND_PORT}`;

  upsertEnvFile(FRONTEND_ENV, { VITE_API_URL: backendUrl });

  upsertEnvFile(BACKEND_ENV, {
    FRONTEND_URL:    frontendUrl,
    ALLOWED_ORIGINS: `${frontendUrl},http://localhost:${FRONTEND_PORT}`,
  });
}

function printBanner(ip: string): void {
  const g = '\x1b[32m', c = '\x1b[36m', y = '\x1b[33m', b = '\x1b[1m', r = '\x1b[0m';

  console.log(`\n${g}╔══════════════════════════════════════════════════╗${r}`);
  console.log(`${g}║${r}${b}       🚀  FiscalSync — Rede Local Detectada      ${r}${g}║${r}`);
  console.log(`${g}╠══════════════════════════════════════════════════╣${r}`);
  console.log(`${g}║${r}  ${y}IP detectado ${r}  : ${b}${c}${ip}${r}`);
  console.log(`${g}║${r}  ${y}Backend      ${r}  : ${c}http://${ip}:${BACKEND_PORT}${r}`);
  console.log(`${g}║${r}  ${y}Frontend     ${r}  : ${c}http://${ip}:${FRONTEND_PORT}${r}`);
  console.log(`${g}╚══════════════════════════════════════════════════╝\n${r}`);
}

function printLocalFallback(): void {
  const y = '\x1b[33m', c = '\x1b[36m', r = '\x1b[0m';
  console.log(`${y}⚠  IP de rede não detectado. Rodando apenas em localhost.${r}`);
  console.log(`   Backend  : ${c}http://localhost:${BACKEND_PORT}${r}`);
  console.log(`   Frontend : ${c}http://localhost:${FRONTEND_PORT}${r}\n`);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // 1. Garante que o backend/.env exista
  ensureBackendEnv();

  // 2. Verifica se as portas estão livres
  const portsOk = await checkPorts();

  // 3. Detecta IP e aplica config de rede
  const ip = detectLocalIP();

  if (ip) {
    printBanner(ip);
    applyNetworkConfig(ip);
    console.log('\x1b[32m✔  Ambiente configurado para rede local.\x1b[0m');

    if (!portsOk) {
      console.log('\x1b[33m⚠  Portas ocupadas detectadas — resolva antes de iniciar os serviços.\x1b[0m\n');
    } else {
      console.log('\x1b[2m   Iniciando serviços...\x1b[0m\n');
    }
  } else {
    printLocalFallback();
  }
}

main().catch((err) => {
  console.error('\x1b[31m✖  Erro inesperado no setup:\x1b[0m', err);
  process.exit(1);
});