const https = require('https');

// Helper to make HTTPS requests
function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// GitHub API helper to create/update a file
async function updateGitHubFile(owner, repo, filePath, base64Content, commitMessage, token) {
  const getOpt = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${filePath}`,
    method: 'GET',
    headers: {
      'User-Agent': 'BHB-Foundation-CMS',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  const existing = await request(getOpt);
  const sha = (existing.data && existing.data.sha) ? existing.data.sha : undefined;

  const payload = JSON.stringify({
    message: commitMessage,
    content: base64Content,
    sha: sha,
    branch: 'main'
  });

  const putOpt = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${filePath}`,
    method: 'PUT',
    headers: {
      'User-Agent': 'BHB-Foundation-CMS',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const res = await request(putOpt, payload);
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(`GitHub API error (${res.status}): ${res.data?.message || res.raw}`);
  }
  return res.data;
}

module.exports = async (req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const cmsData = body.data || body;
    const token = body.githubToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    const deployHook = body.deployHookUrl || process.env.VERCEL_DEPLOY_HOOK;

    let commitHash = 'Synced';
    let deployTriggered = false;

    // 1. If Vercel Deploy Hook URL is provided, trigger a deployment
    if (deployHook) {
      try {
        const urlObj = new URL(deployHook);
        await request({
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: 'POST'
        });
        deployTriggered = true;
      } catch (hookErr) {
        console.warn('Vercel Deploy Hook notification:', hookErr.message);
      }
    }

    // 2. If GitHub Token is available and we have CMS data, commit directly to GitHub repository
    if (token && cmsData && cmsData.settings) {
      const owner = 'usmanrimi';
      const repo = 'bhbfoundation';

      // Update data/seed_data.json
      const seedBase64 = Buffer.from(JSON.stringify(cmsData, null, 2), 'utf8').toString('base64');
      await updateGitHubFile(owner, repo, 'data/seed_data.json', seedBase64, 'chore(cms): update seed_data from Super Admin', token);

      // Update js/initial_data.js
      const initJsStr = 'window.BHB_SEED_DATA = ' + JSON.stringify(cmsData, null, 2) + ';\n';
      const initBase64 = Buffer.from(initJsStr, 'utf8').toString('base64');
      const gitResult = await updateGitHubFile(owner, repo, 'js/initial_data.js', initBase64, 'chore(cms): update initial_data from Super Admin', token);

      if (gitResult && gitResult.commit) {
        commitHash = gitResult.commit.sha.substring(0, 7);
      }
      deployTriggered = true;
    }

    return res.status(200).json({
      success: true,
      message: deployTriggered
        ? 'Live deployment triggered successfully to GitHub and production!'
        : 'Changes saved locally. Add a GitHub Token or Vercel Deploy Hook in Super Admin Settings for instant cloud publishing.',
      commit: commitHash,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Deployment handler error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
