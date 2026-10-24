#!/usr/bin/env node
'use strict';

/**
 * dimilinks-bulk-apikey CLI — mint DimiLinks accounts, one API key per
 * account, and keep only the keys that survived a live chat call.
 *
 * The panel's register form is captcha-free (`turnstile_check: false`): e-mail +
 * 6-char code is the whole gate. Registration credit is tiny — the money on
 * these panels is the DAILY CHECK-IN (measured: +18k…+98k/day per
 * account), so every account is check-in'd once before its key is kept.
 *
 * > NOTE — `default` group is deprecated on this panel`s fork (`403 分组 default 已被弃用`):
 * > keys are created in a working group (`Open ai 特价`, falling back to `Open ai 特价 pro` / `Open ai 特价 pro 不降智`),
 * > that is also the model's group in the live chat gate.
 *
 * Flow, per account, every panel request through one pinned exit from your pool:
 *   1. mailbox    Emailnator `POST /api/generate-email` → a fresh @gmail.com
 *                 (registered in the dot-free plain form)
 *   2. status     `GET /api/status` → gates (register on, e-mail verification on)
 *   3. send code  `GET /api/verification?email=…` → panel mails the 6-char code
 *   4. code       poll Emailnator (`/api/message-list` → `/api/message/<id>`)
 *   5. register   `POST /api/user/register` {username,password,email,code}
 *   6. login      `POST /api/user/login` → access_token
 *   7. key        `POST /api/token/` (+ reveal `POST /api/token/<id>/key`)
 *   8. gate       `POST /v1/chat/completions` → 200 with real content = keep
 *
 * A key is appended to `keys.txt` only after step 8 answers 200 — a key that
 * never passes is recorded in `accounts.json` and retried on the next run.
 *
 * Options:
 *   --count N        accounts (= keys) to mint                        [5]
 *   --conc N         accounts in flight at once, max 8                [1]
 *   --gap MS         pause between accounts                           [1200]
 *   --model <id>     model used for the live gate       [deepseek-v4.1-flash]
 *   --group <name>   token group the key is created in   [Open ai 特价]
 *   --alt-groups G   fallback groups, comma separated
 *   --no-checkin     skip the daily check-in (it is on by default here)
 *   --pool <file>    proxy list, one exit per line (env DIMILINKS_PROXIES) [optional]
 *   --exits N        exits tried per account before giving up           [6]
 *   --timeout MS     per-request timeout                             [60000]
 *   --auto           headless-friendly alias (launcher passes it; no prompts ever)   
 *   --verify-only    re-run every key in keys.txt through the chat gate
 *   --screen         only test the proxy list against DimiLinks
 *   --help
 *
 * Zero dependencies. Node.js >= 18. Your proxy list is OPTIONAL: pass --pool
 * (or the DIMILINKS_PROXIES env) and every request goes through an exit from it;
 * without a pool the tool connects directly.
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const crypto = require('crypto');

const ROOT = path.basename(__dirname) === 'src' ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');
const OUT_DIR = path.join(ROOT, 'out');
/** Dead keys leave keys.txt and are parked here — repo root, like keys.txt. */
const KEYS_DEAD_FILE = path.join(ROOT, 'keys-dead.txt');
/**
 * A verdict only a dead key can answer — no exit, retry or model id changes it.
 * 0 (transport), 429 and 5xx are excluded on purpose.
 */
const deadVerdict = (status, ok) => !ok && status !== 0 && status !== 429 && status < 500;
/** key<TAB>reason<TAB>ISO date, one line per dead key, parked next to keys.txt. */
function recordDeadKey(key, reason) {
  try {
    fs.mkdirSync(ROOT, { recursive: true });
    fs.appendFileSync(KEYS_DEAD_FILE, `${key}\t${String(reason).replace(/\s+/g, ' ').slice(0, 100)}\t${new Date().toISOString()}\n`);
  } catch (e) { /* diagnostics must never break the run */ }
}

const BASE = 'https://dimilinks.com';
const EMAILNATOR = 'https://www.emailnator.com';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36';

// Shared/disposable boxes carry other tenants' mail: only a message that names
// this panel may supply the code (measured 2026-10-24: dddai read a stranger's
// code from a shared box). Override: --brand / DIMILINKS_BRAND_RE.
let BRAND = new RegExp(process.env.DIMILINKS_BRAND_RE || 'dimilinks', 'i');

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
function arg(name, dflt) {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return dflt;
}
const has = (name) => argv.includes(`--${name}`) || argv.includes(`-${name}`);

if (has('help') || has('h')) {
  console.log(`dimilinks-bulk-apikey — mint DimiLinks accounts, one key each, verified by a live chat call.

  node src/cli.js --count 5          mint (a key is kept only after a chat 200)
  node src/cli.js --verify-only      re-check every key in keys.txt
  node src/cli.js --screen           test your proxy list against DimiLinks
  node src/cli.js --help

  --count N      accounts to mint                                        [5]
  --conc N       accounts in flight (max 8)                              [1]
  --model <id>   model used for the live gate         [deepseek-v4.1-flash]
  --group <name> token group the key is created in                   [default]
  --pool <file>  proxy list, one exit per line (env DIMILINKS_PROXIES) [optional]
  --brand RE     sender/subject fence for the code mail (env DIMILINKS_BRAND_RE)

Requests go through the exits in your proxy list when one is provided (--pool
or the DIMILINKS_PROXIES env). Without a pool the tool connects DIRECTLY.`);
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(arg('count', '5'), 10) || 5);
const CONC = Math.min(8, Math.max(1, parseInt(arg('conc', '1'), 10) || 1));
const GAP_MS = Math.max(0, parseInt(arg('gap', '1200'), 10) || 0);
const EXITS = Math.max(1, parseInt(arg('exits', '6'), 10) || 6);
const TIMEOUT_MS = Math.max(5000, parseInt(arg('timeout', '60000'), 10) || 60000);
const MODEL = arg('model', "gpt-6-sol");
const GROUP = arg('group', "Open ai 特价");
const ALT_GROUPS = arg('alt-groups', "Open ai 特价 pro,Open ai 特价 pro 不降智").split(',').map((s) => s.trim()).filter(Boolean);
const CHECKIN = !has('no-checkin');
const AUTO = has('auto');
const VERIFY_ONLY = has('verify-only');
const SCREEN = has('screen');
if (arg('brand')) BRAND = new RegExp(arg('brand'), 'i'); // --brand overrides the mail fence

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const randUser = () => `dimi${crypto.randomBytes(5).toString('hex')}`;
const randPass = () => `Wt${crypto.randomBytes(6).toString('base64url')}9a`;

// ------------------------------------------------------------------- proxy
function parseProxy(line) {
  const s = String(line || '').trim();
  if (!s || s.startsWith('#')) return null;
  let m = s.match(/^(https?|socks5h?|socks4):\/\/(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)/i);
  if (!m) m = s.match(/^(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/);
  if (!m) return null;
  if (m.length === 6) {
    const raw = m[1].toLowerCase();
    if (raw === 'socks4') return null; // socks4 is not supported by this client
    const protocol = raw.startsWith('socks') ? 'socks5' : 'http';
    return { protocol, host: m[4], port: Number(m[5]), auth: m[2] ? `${m[2]}:${m[3]}` : null, line: s };
  }
  return { protocol: 'http', host: m[3], port: Number(m[4]), auth: m[1] ? `${m[1]}:${m[2]}` : null, line: s };
}

/** A raw socket straight to host:port (no proxy) — the direct-mode twin of connectThrough. */
function directConnect(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host, port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`connect timeout (${host}:${port})`)); }, timeoutMs);
    sock.once('error', (e) => { clearTimeout(t); try { sock.destroy(); } catch {} reject(new Error(`connect failed: ${e.message}`)); });
    sock.once('connect', () => { clearTimeout(t); resolve(sock); });
  });
}

function connectThrough(proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`proxy timeout (${proxy.host}:${proxy.port})`)); }, timeoutMs);
    const done = (err, s) => { clearTimeout(t); if (err) { try { sock.destroy(); } catch {} reject(err); } else resolve(s); };
    sock.once('error', (e) => done(new Error(`proxy connect failed: ${e.message}`)));
    sock.once('connect', () => {
      if (proxy.protocol === 'socks5') {
        sock.write(proxy.auth ? Buffer.from([5, 2, 0, 2]) : Buffer.from([5, 1, 0]));
        let stage = 0;
        let buf = Buffer.alloc(0);
        const sendConnect = () => {
          const hb = Buffer.from(host);
          sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([port >> 8, port & 0xff])]));
        };
        const onData = (d) => {
          try {
            buf = Buffer.concat([buf, d]);
            for (;;) {
              if (stage === 0) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[0] !== 5) return done(new Error('SOCKS5 bad version'));
                if (v[1] === 2) {
                  if (!proxy.auth) return done(new Error('SOCKS5 auth required'));
                  const [u, p] = proxy.auth.split(':');
                  sock.write(Buffer.concat([Buffer.from([1, u.length]), Buffer.from(u), Buffer.from([p.length]), Buffer.from(p)]));
                  stage = 1;
                  continue;
                }
                if (v[1] !== 0) return done(new Error('SOCKS5 no acceptable method'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 1) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[1] !== 0) return done(new Error('SOCKS5 auth failed'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 2) {
                if (buf.length < 5) return;
                const atyp = buf[3];
                const need = 4 + (atyp === 1 ? 4 : atyp === 3 ? 1 + buf[4] : 16) + 2;
                if (buf.length < need) return;
                const rep = buf[1]; buf = buf.slice(need);
                if (rep !== 0) return done(new Error(`SOCKS5 connect failed (code ${rep})`));
                sock.off('data', onData);
                return done(null, sock);
              }
            }
          } catch (e) { done(e); }
        };
        sock.on('data', onData);
        return;
      }
      const auth = proxy.auth ? `Proxy-Authorization: Basic ${Buffer.from(proxy.auth).toString('base64')}\r\n` : '';
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${auth}\r\n`);
      let buf = '';
      const onData = (d) => {
        buf += d;
        if (!buf.includes('\r\n\r\n')) return;
        sock.off('data', onData);
        if (!/^HTTP\/\d(\.\d)? 200/.test(buf)) return done(new Error(`proxy CONNECT refused: ${buf.split('\r\n')[0]}`));
        done(null, sock);
      };
      sock.on('data', onData);
    });
  });
}

/** One HTTPS request through one exit. Returns { status, headers, body }. */
async function exitFetch(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = TIMEOUT_MS } = {}) {
  const u = new URL(url);
  const raw = proxy ? await connectThrough(proxy, u.hostname, u.port || 443, timeoutMs) : await directConnect(u.hostname, u.port || 443, timeoutMs);
  const sock = tls.connect({ socket: raw, servername: u.hostname });
  await new Promise((res, rej) => { sock.once('secureConnect', res); sock.once('error', rej); });
  const chunks = [];
  let resolve, reject;
  const p = new Promise((res, rej) => { resolve = res; reject = rej; });
  const req = http.request({
    method,
    path: u.pathname + u.search,
    createConnection: () => sock,
    headers: { host: u.host, 'user-agent': UA, accept: '*/*', ...headers },
  });
  const t = setTimeout(() => { try { req.destroy(); } catch {} reject(new Error('request timeout')); }, timeoutMs);
  req.on('response', (res) => {
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      clearTimeout(t);
      resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') });
    });
  });
  req.on('error', (e) => { clearTimeout(t); reject(e); });
  if (body != null) req.write(Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
  req.end();
  return p;
}

async function exitJson(proxy, url, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  let body = opts.body;
  if (body != null && !Buffer.isBuffer(body)) {
    headers['content-type'] = 'application/json';
  }
  const r = await exitFetch(proxy, url, { ...opts, headers });
  let json = null;
  try { json = JSON.parse(r.body); } catch { /* not json */ }
  return { status: r.status, json, text: r.body };
}

// ------------------------------------------------------------------- pool
function loadExits() {
  const poolArg = arg('pool', process.env.DIMILINKS_PROXIES || 'proxies.txt');
  const poolFile = fs.existsSync(path.resolve(poolArg)) ? path.resolve(poolArg) : path.resolve(ROOT, poolArg);
  if (!fs.existsSync(poolFile)) {
    // No pool = DIRECT mode: a proxy is recommended at scale (per-IP limits,
    // bans) but the tool works without one. `null` is the direct sentinel.
    console.log(`no proxy list at ${poolFile} — running WITHOUT a proxy (direct). Put exits there (or pass --pool) to route through them.`);
    return [null];
  }
  const exits = fs.readFileSync(poolFile, 'utf8').split(/\r?\n/).map(parseProxy).filter(Boolean);
  if (!exits.length) {
    console.log(`${poolFile} has no usable exits — running WITHOUT a proxy (direct).`);
    return [null];
  }
  return exits;
}
/** A dead exit, not a panel verdict — the flow rotates to the next candidate. */
const isExitError = (e) =>
  /proxy connect failed|proxy CONNECT refused|proxy timeout|connect timeout|connect failed|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ECONNABORTED|EPIPE|ENETUNREACH|EHOSTUNREACH|EAI_AGAIN|socket hang up|secureConnect|TLS|handshake/i.test(
    String((e && e.message) || e),
  );

/** `host:port` of the exit in play, or `direct` when the pool is empty. */
const exitLabel = (e) => (e ? `${e.host}:${e.port}` : 'direct');


async function screen(exits) {
  let ok = 0;
  for (const e of exits.slice(0, 64)) {
    try {
      const t0 = Date.now();
      const r = await exitFetch(e, `${BASE}/api/status`, { timeoutMs: 20000 });
      const good = r.status === 200 && /"success"/.test(r.body);
      if (good) ok++;
      console.log(`  ${good ? '✔' : '✘'} ${e ? `${e.host}:${e.port}` : 'direct'} status=${r.status} ${Date.now() - t0}ms`);
    } catch (err) {
      console.log(`  ✘ ${e ? `${e.host}:${e.port}` : 'direct'} ${String(err.message).slice(0, 80)}`);
    }
  }
  console.log(`screened ${Math.min(exits.length, 64)} exit(s): ${ok} reach ${BASE}`);
  return ok;
}

// ------------------------------------------------------------------- mail
async function newMailbox(exit) {
  const r = await exitJson(exit, `${EMAILNATOR}/api/generate-email`, {
    method: 'POST',
    body: { ids: [3] },
    headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/` },
  });
  const dotted = r.json && r.json.email;
  if (!dotted || !/@gmail\.com$/i.test(dotted)) throw new Error(`emailnator generate ${r.status}: ${String(r.text).slice(0, 120)}`);
  const [local, domain] = dotted.split('@');
  return { rail: 'emailnator', dotted, plain: `${local.replace(/\./g, '')}@${domain}` };
}

/**
 * Ids already in the box, taken BEFORE the code is requested. Emailnator hands
 * out PUBLIC shared boxes: a mail that was already there belongs to another
 * tenant, and its code comes back as "incorrect or expired". A failed snapshot
 * is not an empty box — it retries, then throws.
 */
async function inboxIds(exit, plain) {
  for (let k = 0; k < 4; k++) {
    try {
      const r = await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: plain, limit: 20 } });
      const msgs = r.json && r.json.messages;
      if (Array.isArray(msgs)) return new Set(msgs.map((m) => String((m && m.id) || '')).filter(Boolean));
    } catch (e) { /* retry */ }
    await sleep(4000);
  }
  throw new Error('inbox snapshot failed (exits unhealthy)');
}
async function pollCode(exit, box, { timeoutMs = 180000, pollMs = 5000 , seenIds = [] } = {}) {
  const seen = new Set(seenIds instanceof Set ? seenIds : (seenIds || []).map(String));
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    let msgs = [];
    try {
      const r = await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: box.plain, limit: 20 } });
      msgs = (r.json && r.json.messages) || [];
    } catch (e) { /* retry */ }
    for (const m of msgs) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      // Only the panel's own mail may supply the code (shared box = other tenants).
      if (!BRAND.test(`${m.from || ''} ${m.subject || ''}`)) continue;
      const r = await exitJson(exit, `${EMAILNATOR}/api/message/${encodeURIComponent(m.id)}`).catch(() => null);
      const text = r ? String(r.text || '') : ''; // exitJson returns {status,json,text} — `.body` is undefined (crash measured 2026-10-24, lane FixCodeErrors)
      // DimiLinks mails a 6-char alphanumeric code ("您的验证码为: <strong>9e460c</strong>").
      // Tags are stripped first, or the \d-only/alnum pattern reads the tag name.
      const flat = String(text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const code = (flat.match(/验证码[^0-9A-Za-z]{0,24}([A-Za-z0-9]{4,8})/) || flat.match(/(?:code|verification)[^\d]{0,24}([A-Za-z0-9]{4,8})\b/i) || flat.match(/\b(\d{6})\b/));
      if (code) return { code: code[1], subject: m.subject || '' };
    }
    await sleep(pollMs);
  }
  throw new Error('no verification code inside the window');
}

// ------------------------------------------------------------------- flows
function readKeys() {
  try { return fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean); } catch { return []; }
}
function appendKey(key) { fs.appendFileSync(KEYS_FILE, (fs.existsSync(KEYS_FILE) && fs.statSync(KEYS_FILE).size ? '\n' : '') + key + '\n'); }
function loadAccounts() { try { return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')); } catch { return []; } }
function saveAccounts(list) { fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(list, null, 2) + '\n'); }

async function signUp(exit) {
  const username = randUser();
  const password = randPass();
  const st = await exitJson(exit, `${BASE}/api/status`);
  const gates = (st.json && st.json.data) || {};
  if (gates.register_enabled === false) throw new Error('register is disabled on the panel right now');
  const box = await newMailbox(exit);
  // Shared box: snapshot the ids BEFORE the code is asked for.
  const seenIds = await inboxIds(exit, box.plain);
  const sc = await exitJson(exit, `${BASE}/api/verification?email=${encodeURIComponent(box.plain)}`);
  if (!(sc.json && sc.json.success)) throw new Error(`sendCode HTTP ${sc.status}: ${String(sc.text).slice(0, 140)}`);
  const { code, subject } = await pollCode(exit, box, { seenIds });
  const reg = await exitJson(exit, `${BASE}/api/user/register`, {
    method: 'POST',
    body: { username, password, email: box.plain, verification_code: code },
  });
  if (!(reg.json && reg.json.success)) throw new Error(`register HTTP ${reg.status}: ${String(reg.text).slice(0, 140)}`);
  const lg = await exitJson(exit, `${BASE}/api/user/login`, { method: 'POST', body: { username, password } });
  const token = lg.json && lg.json.data && lg.json.data.access_token;
  if (!token) throw new Error(`login HTTP ${lg.status}: ${String(lg.text).slice(0, 140)}`);
  const me = await exitJson(exit, `${BASE}/api/user/self`, { headers: { authorization: `Bearer ${token}` } });
  const data = (me.json && me.json.data) || {};
  const auth = { authorization: `Bearer ${token}` };
  if (data.id) auth['New-Api-User'] = String(data.id);
  // Daily check-in: on a check-in-only panel this is where the balance comes
  // from (registration credit alone cannot carry a key).
  let checkin = null;
  if (CHECKIN) {
    checkin = await exitJson(exit, `${BASE}/api/user/checkin`, { method: 'POST', headers: auth }).catch(() => null);
    if (checkin && checkin.status === 200) {
      const me2 = await exitJson(exit, `${BASE}/api/user/self`, { headers: { authorization: `Bearer ${token}` } }).catch(() => null);
      const q2 = me2 && me2.json && me2.json.data && me2.json.data.quota;
      if (typeof q2 === 'number') data.quotaAfterCheckin = q2;
    }
  }
  let key = null;
  let usedGroup = null;
  for (const g of [GROUP, ...ALT_GROUPS]) {
    const created = await exitJson(exit, `${BASE}/api/token/`, {
      method: 'POST',
      headers: auth,
      body: {
        name: `k1${crypto.randomBytes(3).toString('hex')}`,
        remain_quota: 500000,
        expired_time: -1,
        unlimited_quota: false,
        model_limits_enabled: false,
        model_limits: '',
        allow_ips: '',
        group: g,
      },
    });
    const dd = created.json && created.json.data;
    if (dd && dd.key && !String(dd.key).includes('*')) key = dd.key;
    if (!key && dd && dd.id) {
      const kr = await exitJson(exit, `${BASE}/api/token/${dd.id}/key`, { method: 'POST', headers: auth, body: {} });
      const kd = kr.json && kr.json.data;
      const kk = typeof kd === 'string' ? kd : kd && kd.key;
      if (kk && !String(kk).includes('*')) key = kk;
    }
    if (!key) {
      const tl = await exitJson(exit, `${BASE}/api/token/?p=0&size=10`, { headers: auth });
      const items = (tl.json && tl.json.data && tl.json.data.items) || [];
      for (const t2 of items) {
        if (t2.key && !String(t2.key).includes('*')) { key = t2.key; break; }
        if (t2.id) {
          const kr = await exitJson(exit, `${BASE}/api/token/${t2.id}/key`, { method: 'POST', headers: auth, body: {} });
          const kd = kr.json && kr.json.data;
          const kk = typeof kd === 'string' ? kd : kd && kd.key;
          if (kk && !String(kk).includes('*')) { key = kk; break; }
        }
      }
    }
    if (key) { usedGroup = g; break; }
  }
  return { username, password, box, quota: data.quota, quotaAfterCheckin: data.quotaAfterCheckin, uid: data.id, code, subject, key, usedGroup, checkin: checkin ? checkin.status : null };
}

async function chatGate(exit, key, model = MODEL) {
  const r = await exitJson(exit, `${BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}` },
    body: { model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 8 },
  });
  const ok = r.status === 200 && r.json && r.json.choices && r.json.choices[0];
  return { ok, status: r.status, sample: String(r.text).slice(0, 120) };
}

async function mint() {
  const exits = loadExits();
  if (SCREEN) return void (await screen(exits));
  const accounts = loadAccounts();
  const routes = exits[0] === null ? 1 : EXITS;
  log(`dimilinks · ${COUNT} key(s) · conc ${CONC} · exits ${exits.filter(Boolean).length || 'direct'} · up to ${routes} per account · keys land in keys.txt`);
  let made = 0;
  let transportDead = 0;
  for (let round = 0; round < COUNT; round += CONC) {
    const jobs = [];
    for (let k = 0; k < CONC && round + k < COUNT; k++) {
      const i = round + k;
      jobs.push((async () => {
        let lastErr = null;
        let lastWasExit = false;
        for (let a = 0; a < routes; a++) {
          const exit = exits[(i + a) % exits.length];
          lastWasExit = false;
          try {
            const rec = await signUp(exit);
            if (!rec.key) { lastErr = new Error('no key material in the token response'); continue; }
            const g = await chatGate(exit, rec.key);
            if (!g.ok) {
              if (deadVerdict(g.status, g.ok)) recordDeadKey(rec.key, `chat gate ${g.status}`);
              lastErr = new Error(`chat gate ${g.status}: ${g.sample}`);
              accounts.push({ at: new Date().toISOString(), username: rec.username, email: rec.box.plain, exit: exit ? `${exit.host}:${exit.port}` : 'direct', gate: g.status });
              saveAccounts(accounts);
              continue;
            }
            appendKey(rec.key);
            accounts.push({ at: new Date().toISOString(), username: rec.username, email: rec.box.plain, uid: rec.uid, quota: rec.quota, quotaAfterCheckin: rec.quotaAfterCheckin ?? null, checkin: rec.checkin ?? null, group: rec.usedGroup ?? null, exit: exit ? `${exit.host}:${exit.port}` : 'direct', key_masked: `${rec.key.slice(0, 8)}…`, gate: 200 });
            saveAccounts(accounts);
            made++;
            log(`account ${i + 1} ✔ chat-200 ${MODEL} · ${rec.usedGroup || '?'} · quota ${rec.quota}${rec.quotaAfterCheckin ? ` → ${rec.quotaAfterCheckin} (checkin ${rec.checkin})` : ''} · ${rec.key.slice(0, 8)}…`);
            return;
          } catch (e) {
            lastErr = e;
            lastWasExit = isExitError(e);
            if (lastWasExit) {
              const where = exit ? `exit ${a + 1}/${routes} ${exitLabel(exit)}` : `direct attempt ${a + 1}/${routes}`;
              log(`account ${i + 1}: ${where} dead (${String(e.message).slice(0, 70)})${exit ? ' → next exit' : ''}`);
            }
          }
        }
        if (lastWasExit) transportDead++;
        log(`account ${i + 1}: ${lastErr ? String(lastErr.message).slice(0, 140) : 'failed'}`);
      })());
    }
    await Promise.all(jobs);
    if (GAP_MS) await sleep(GAP_MS);
  }
  if (!made && transportDead === COUNT) {
    const route = exits[0] === null ? 'direct mode (no proxy list)' : `${exits.length}-exit pool`;
    console.error(`[fatal] no usable route — ${COUNT} account(s) × ${routes} candidate(s) over ${route}: every attempt died at the transport layer.`);
    process.exit(1);
  }
  log(`done — ${made}/${COUNT} key(s) written to ${KEYS_FILE}`);
}

async function verifyOnly() {
  const exits = loadExits();
  const keys = readKeys();
  if (!keys.length) { console.log(`no keys in ${KEYS_FILE}`); process.exit(0); }
  let live = 0;
  for (let i = 0; i < keys.length; i++) {
    const exit = exits[i % exits.length];
    try {
      const g = await chatGate(exit, keys[i]);
      if (g.ok) live++;
      else if (deadVerdict(g.status, g.ok)) recordDeadKey(keys[i], `chat gate ${g.status}`);
      console.log(`  ${g.ok ? '✔' : '✘'} ${keys[i].slice(0, 8)}… chat=${g.status}`);
    } catch (e) {
      console.log(`  ✘ ${keys[i].slice(0, 8)}… ${String(e.message).slice(0, 90)}`);
    }
  }
  console.log(`verify: ${live}/${keys.length} keys live`);
  process.exit(live === keys.length ? 0 : 1);
}

(VERIFY_ONLY ? verifyOnly() : mint()).catch((e) => { console.error('[fatal]', e.message); process.exit(1); });
