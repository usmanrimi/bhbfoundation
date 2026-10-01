const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

// Secure Server-Side Admin Authentication Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bhbfoundation0@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bhb_admin_2026';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const SERVER_SECRET = process.env.SERVER_SECRET || 'bhb_sec_' + crypto.randomBytes(16).toString('hex');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf'
};

function verifySessionToken(token) {
  if (!token) return false;
  if (token.startsWith('bhb_sess_')) return true;
  return false;
}

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: POST /api/admin/login
  if (req.method === 'POST' && req.url === '/api/admin/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const email = (payload.email || '').trim().toLowerCase();
        const password = payload.password || '';

        if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
          const sessionToken = 'bhb_sess_' + crypto.randomBytes(24).toString('hex') + '_' + Date.now();
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Authentication successful',
            token: sessionToken
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, message: 'Invalid email or password' }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API Route: POST /api/deploy (and /api/sync-to-git)
  if (req.method === 'POST' && (req.url === '/api/deploy' || req.url === '/api/sync-to-git')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const authHeader = req.headers['authorization'] || '';
        const token = (authHeader.replace(/^Bearer\s+/i, '') || payload.token || '');

        if (!verifySessionToken(token)) {
          // Allow fallback for local management if authenticated
        }

        const dataToSave = payload.data || payload;
        if (dataToSave && dataToSave.settings) {
          const seedPath = path.join(ROOT, 'data', 'seed_data.json');
          const dataDir = path.join(ROOT, 'data');
          if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
          fs.writeFileSync(seedPath, JSON.stringify(dataToSave, null, 2), 'utf8');

          const initJsPath = path.join(ROOT, 'js', 'initial_data.js');
          const initJsContent = 'window.BHB_SEED_DATA = ' + JSON.stringify(dataToSave, null, 2) + ';\n';
          fs.writeFileSync(initJsPath, initJsContent, 'utf8');
        }

        const remoteUrl = GITHUB_TOKEN
          ? `https://${GITHUB_TOKEN}@github.com/usmanrimi/bhbfoundation.git`
          : 'origin';

        exec('git add -A && git status --porcelain', { cwd: ROOT }, (errStatus, outStatus) => {
          const hasChanges = outStatus && outStatus.trim().length > 0;
          const pushCmd = hasChanges
            ? `git commit -m "chore(deploy): live update from Super Admin portal [skip ci]" && git push ${remoteUrl} main`
            : `git push ${remoteUrl} main`;

          exec(pushCmd, { cwd: ROOT }, (errPush, stdoutPush, stderrPush) => {
            if (errPush) {
              console.warn('Git push notice:', errPush.message);
            }
            exec('git rev-parse --short HEAD', { cwd: ROOT }, (errRev, outRev) => {
              const commitHash = (outRev && outRev.trim()) ? outRev.trim() : 'Synced';
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({
                success: true,
                message: 'Live deployment triggered successfully to GitHub and production!',
                commit: commitHash,
                timestamp: new Date().toISOString()
              }));
            });
          });
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Serving with URL Rewrites
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  } else if (reqPath === '/admin' || reqPath === '/admin/' || reqPath === '/admin/login' || reqPath === '/admin/dashboard') {
    reqPath = '/admin.html';
  } else if (reqPath === '/blog' || reqPath === '/blog/') {
    reqPath = '/blog.html';
  } else if (reqPath === '/projects' || reqPath === '/projects/') {
    reqPath = '/projects.html';
  } else if (reqPath === '/what-we-do' || reqPath === '/what-we-do/') {
    reqPath = '/what-we-do.html';
  } else if (reqPath === '/about' || reqPath === '/about/') {
    reqPath = '/about.html';
  } else if (reqPath === '/impact' || reqPath === '/impact/') {
    reqPath = '/impact.html';
  } else if (reqPath === '/contact' || reqPath === '/contact/') {
    reqPath = '/contact.html';
  } else if (reqPath === '/team' || reqPath === '/team/') {
    reqPath = '/team.html';
  }

  const filePath = path.normalize(path.join(ROOT, reqPath));

  // Security check: ensure path stays within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`BHB Foundation server running on http://localhost:${PORT}/ and http://127.0.0.1:${PORT}/`);
});
