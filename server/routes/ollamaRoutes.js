const https = require('https');
const express = require('express');
const router = express.Router();
const ollama = require('../services/ollamaService');
const os = require('os');
const { execSync } = require('child_process');

// System info endpoint (kept for debugging; frontend doesn't use it)
router.get('/sysinfo', (req, res) => {
  let cpu = '';
  try {
    const cpuinfo = execSync("cat /proc/cpuinfo | grep 'model name' | head -1", { encoding: 'utf8' });
    cpu = cpuinfo.split(':')[1]?.trim() || '';
  } catch (e) { cpu = os.cpus()[0]?.model || ''; }
  let ramGB = 0;
  try { ramGB = Math.round(os.totalmem() / (1024 ** 3)); } catch (e) { ramGB = 0; }
  let gpu = { brand: '', model: '', ramGB: null };
  try {
    const lspci = execSync("lspci | grep -i 'vga\\|3d' || true", { encoding: 'utf8' });
    const lines = lspci.split('\n').filter(Boolean);
    if (lines.length > 0) {
      const line = lines[0];
      let brand = '', model = '';
      if (/nvidia/i.test(line)) brand = 'NVIDIA';
      else if (/amd|radeon/i.test(line)) brand = 'AMD';
      else if (/intel/i.test(line)) brand = 'Intel';
      else brand = 'Unknown';
      const modelMatch = line.match(/: (.+)/);
      model = modelMatch ? modelMatch[1] : line;
      gpu = { brand, model, ramGB: null };
    }
  } catch (e) { gpu = { brand: '', model: '', ramGB: null }; }
  res.json({ cpu, ramGB, gpu });
});

// Delete a model
router.delete('/model/:name', (req, res) => {
  const name = req.params.name;
  if (!name) return res.status(400).json({ error: 'model name required' });
  try {
    console.log('[ollamaRoutes] DELETE /model/:name received:', name);
    const result = ollama.deleteModel(name);
    console.log('[ollamaRoutes] delete result:', result);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Accept delete by JSON body to avoid URL-encoding issues
router.post('/model/delete', (req, res) => {
  const name = req.body && req.body.model;
  if (!name) return res.status(400).json({ error: 'model required' });
  try {
    console.log('[ollamaRoutes] POST /model/delete received:', name);
    const result = ollama.deleteModel(name);
    console.log('[ollamaRoutes] delete result (body):', result);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Active model
router.get('/active-model', (req, res) => {
  res.json({ active: ollama.getActiveModel() });
});

router.post('/activate', (req, res) => {
  const model = req.body && req.body.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const result = ollama.activateModel(model);
  res.json(result);
});

router.post('/deactivate', (req, res) => {
  const result = ollama.deactivateModel();
  res.json(result);
});

// Pull progress
router.get('/pull-progress', (req, res) => {
  const model = req.query.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const prog = ollama.getPullProgress(model);
  if (!prog) return res.json({ progress: 0, status: 'idle' });
  res.json(prog);
});

// Latest version helper
function fetchLatestOllamaVersion() {
  return new Promise((resolve, reject) => {
    https.get('https://api.github.com/repos/ollama/ollama/releases/latest', {
      headers: { 'User-Agent': 'MythOS-Agent' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jd = JSON.parse(data);
          const v = jd.tag_name || jd.name || '';
          resolve(v.replace(/^v/i, ''));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

router.get('/latest-version', async (req, res) => {
  try {
    const v = await fetchLatestOllamaVersion();
    res.json({ latest: v });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Static available model suggestions
const AVAILABLE_MODELS = [
  { id: 'adi0adi/ollama_stheno-8b_v3.1_q6k', title: 'Stheno 8B (q6k)' },
  { id: 'Tohur/natsumura-storytelling-rp-llama-3.1', title: 'Natsumura Storytelling' },
  { id: 'SimonPu/Qwen3-Coder:30B-Instruct_Q4_K_XL', title: 'Qwen3-Coder 30B (quantized)' }
];

router.get('/status', async (req, res) => {
  try {
    const installed = ollama.hasOllamaCLI();
    const local = installed ? ollama.listLocalModels() : [];
    const gpu = ollama.detectGPU();
    const recommended = ollama.recommendModels(gpu);
    const version = installed ? ollama.getOllamaVersion() : null;
    res.json({ installed, local, gpu, recommended, version });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

router.post('/install', async (req, res) => {
  try {
    const r = await ollama.ensureOllamaInstalled();
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

router.get('/available', (req, res) => {
  res.json(AVAILABLE_MODELS);
});

router.post('/pull', async (req, res) => {
  const model = req.body && req.body.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  try {
    const result = await ollama.pullModel(model);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

module.exports = router;
const https = require('https');
const express = require('express');
const router = express.Router();
const ollama = require('../services/ollamaService');
const os = require('os');
const { execSync } = require('child_process');

// System info endpoint (kept but frontend no longer uses it)
router.get('/sysinfo', (req, res) => {
  let cpu = '';
  try {
    const cpuinfo = execSync("cat /proc/cpuinfo | grep 'model name' | head -1", { encoding: 'utf8' });
    cpu = cpuinfo.split(':')[1]?.trim() || '';
  } catch (e) { cpu = os.cpus()[0]?.model || ''; }

  let ramGB = 0;
  try { ramGB = Math.round(os.totalmem() / (1024 ** 3)); } catch (e) { ramGB = 0; }

  let gpu = { brand: '', model: '', ramGB: null };
  try {
    const lspci = execSync("lspci | grep -i 'vga\\|3d' || true", { encoding: 'utf8' });
    const lines = lspci.split('\n').filter(Boolean);
    if (lines.length > 0) {
      const line = lines[0];
      let brand = '', model = '';
      if (/nvidia/i.test(line)) brand = 'NVIDIA';
      else if (/amd|radeon/i.test(line)) brand = 'AMD';
      else if (/intel/i.test(line)) brand = 'Intel';
      else brand = 'Unknown';
      const modelMatch = line.match(/: (.+)/);
      model = modelMatch ? modelMatch[1] : line;
      gpu = { brand, model, ramGB: null };
    }
  } catch (e) { gpu = { brand: '', model: '', ramGB: null }; }

  res.json({ cpu, ramGB, gpu });
});

// Delete a model
router.delete('/model/:name', (req, res) => {
  const name = req.params.name;
  if (!name) return res.status(400).json({ error: 'model name required' });
  try {
    const result = ollama.deleteModel(name);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Active model
router.get('/active-model', (req, res) => {
  res.json({ active: ollama.getActiveModel() });
});

router.post('/activate', (req, res) => {
  const model = req.body && req.body.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const result = ollama.activateModel(model);
  res.json(result);
});

router.post('/deactivate', (req, res) => {
  const result = ollama.deactivateModel();
  res.json(result);
});

// Pull progress
router.get('/pull-progress', (req, res) => {
  const model = req.query.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const prog = ollama.getPullProgress(model);
  if (!prog) return res.json({ progress: 0, status: 'idle' });
  res.json(prog);
});

// Latest version helper
function fetchLatestOllamaVersion() {
  return new Promise((resolve, reject) => {
    https.get('https://api.github.com/repos/ollama/ollama/releases/latest', {
      headers: { 'User-Agent': 'MythOS-Agent' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jd = JSON.parse(data);
          const v = jd.tag_name || jd.name || '';
          resolve(v.replace(/^v/i, ''));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

router.get('/latest-version', async (req, res) => {
  try {
    const v = await fetchLatestOllamaVersion();
    res.json({ latest: v });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Static available model suggestions
const AVAILABLE_MODELS = [
  { id: 'adi0adi/ollama_stheno-8b_v3.1_q6k', title: 'Stheno 8B (q6k)' },
  { id: 'Tohur/natsumura-storytelling-rp-llama-3.1', title: 'Natsumura Storytelling' },
  { id: 'SimonPu/Qwen3-Coder:30B-Instruct_Q4_K_XL', title: 'Qwen3-Coder 30B (quantized)' }
];

router.get('/status', async (req, res) => {
  try {
    const installed = ollama.hasOllamaCLI();
    const local = installed ? ollama.listLocalModels() : [];
    const gpu = ollama.detectGPU();
    const recommended = ollama.recommendModels(gpu);
    const version = installed ? ollama.getOllamaVersion() : null;
    res.json({ installed, local, gpu, recommended, version });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

router.post('/install', async (req, res) => {
  try {
    const r = await ollama.ensureOllamaInstalled();
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

router.get('/available', (req, res) => {
  res.json(AVAILABLE_MODELS);
});

router.post('/pull', async (req, res) => {
  const model = req.body && req.body.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  try {
    const result = await ollama.pullModel(model);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

module.exports = router;
const https = require('https');
const express = require('express');
const router = express.Router();
const ollama = require('../services/ollamaService');
const os = require('os');
const { execSync } = require('child_process');

// System info endpoint: CPU, RAM, GPU (short)
router.get('/sysinfo', (req, res) => {
  // CPU
  let cpu = '';
  try {
    const cpuinfo = execSync("cat /proc/cpuinfo | grep 'model name' | head -1", { encoding: 'utf8' });
    cpu = cpuinfo.split(':')[1]?.trim() || '';
  } catch (e) { cpu = os.cpus()[0]?.model || ''; }

  // RAM (GB)
  let ramGB = 0;
  try {
    ramGB = Math.round(os.totalmem() / (1024 ** 3));
  } catch (e) { ramGB = 0; }

  // GPU (brand, model, ram if possible)
  let gpu = { brand: '', model: '', ramGB: null };
  try {
    const lspci = execSync("lspci | grep -i 'vga\\|3d' || true", { encoding: 'utf8' });
    const lines = lspci.split('\n').filter(Boolean);
    if (lines.length > 0) {
      // Try to parse first GPU line
      const line = lines[0];
      let brand = '', model = '';
      if (/nvidia/i.test(line)) brand = 'NVIDIA';
      else if (/amd|radeon/i.test(line)) brand = 'AMD';
      else if (/intel/i.test(line)) brand = 'Intel';
      else brand = 'Unknown';
      // Model: try to extract after brand
      const modelMatch = line.match(/: (.+)/);
      model = modelMatch ? modelMatch[1] : line;
      gpu = { brand, model, ramGB: null };
    }
  } catch (e) { gpu = { brand: '', model: '', ramGB: null }; }

  res.json({ cpu, ramGB, gpu });
});

// Delete a model from the local models dir
router.delete('/model/:name', (req, res) => {
  const name = req.params.name;
  if (!name) return res.status(400).json({ error: 'model name required' });
  try {
    const result = ollama.deleteModel(name);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Get active model
router.get('/active-model', (req, res) => {
  res.json({ active: ollama.getActiveModel() });
});

// Activate a model
router.post('/activate', (req, res) => {
  const model = req.body && req.body.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const result = ollama.activateModel(model);
  res.json(result);
});

// Deactivate model
router.post('/deactivate', (req, res) => {
  const result = ollama.deactivateModel();
  res.json(result);
});

// Progress polling endpoint
router.get('/pull-progress', (req, res) => {
  const model = req.query.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const prog = ollama.getPullProgress(model);
  if (!prog) return res.json({ progress: 0, status: 'idle' });
  res.json(prog);
});

// Helper to fetch latest version from Ollama website
function fetchLatestOllamaVersion() {
  return new Promise((resolve, reject) => {
    https.get('https://api.github.com/repos/ollama/ollama/releases/latest', {
      headers: { 'User-Agent': 'MythOS-Agent' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jd = JSON.parse(data);
          // Try tag_name or name
          const v = jd.tag_name || jd.name || '';
          resolve(v.replace(/^v/i, ''));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

router.get('/latest-version', async (req, res) => {
  try {
    const v = await fetchLatestOllamaVersion();
    res.json({ latest: v });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});




module.exports = router;


// Delete a model from the local models dir
router.delete('/model/:name', (req, res) => {
  const name = req.params.name;
  if (!name) return res.status(400).json({ error: 'model name required' });
  try {
    const result = ollama.deleteModel(name);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Get active model
router.get('/active-model', (req, res) => {
  res.json({ active: ollama.getActiveModel() });
});

// Activate a model
router.post('/activate', (req, res) => {
  const model = req.body && req.body.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const result = ollama.activateModel(model);
  res.json(result);
});

// Deactivate model
router.post('/deactivate', (req, res) => {
  const result = ollama.deactivateModel();
  res.json(result);
});

// Progress polling endpoint
router.get('/pull-progress', (req, res) => {
  const model = req.query.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  const prog = ollama.getPullProgress(model);
  if (!prog) return res.json({ progress: 0, status: 'idle' });
  res.json(prog);
});
// Helper to fetch latest version from Ollama website
function fetchLatestOllamaVersion() {
  return new Promise((resolve, reject) => {
    https.get('https://api.github.com/repos/ollama/ollama/releases/latest', {
      headers: { 'User-Agent': 'MythOS-Agent' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jd = JSON.parse(data);
          // Try tag_name or name
          const v = jd.tag_name || jd.name || '';
          resolve(v.replace(/^v/i, ''));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

router.get('/latest-version', async (req, res) => {
  try {
    const v = await fetchLatestOllamaVersion();
    res.json({ latest: v });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

// Static available model suggestions (could be extended or fetched)
const AVAILABLE_MODELS = [
  { id: 'adi0adi/ollama_stheno-8b_v3.1_q6k', title: 'Stheno 8B (q6k)' },
  { id: 'Tohur/natsumura-storytelling-rp-llama-3.1', title: 'Natsumura Storytelling' },
  { id: 'SimonPu/Qwen3-Coder:30B-Instruct_Q4_K_XL', title: 'Qwen3-Coder 30B (quantized)' }
];

router.get('/status', async (req, res) => {
  try {
    const installed = ollama.hasOllamaCLI();
    const local = installed ? ollama.listLocalModels() : [];
    const gpu = ollama.detectGPU();
    const recommended = ollama.recommendModels(gpu);
    const version = installed ? ollama.getOllamaVersion() : null;
    res.json({ installed, local, gpu, recommended, version });
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

router.post('/install', async (req, res) => {
  try {
    const r = await ollama.ensureOllamaInstalled();
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

router.get('/available', (req, res) => {
  res.json(AVAILABLE_MODELS);
});

router.post('/pull', async (req, res) => {
  const model = req.body && req.body.model;
  if (!model) return res.status(400).json({ error: 'model required' });
  try {
    const result = await ollama.pullModel(model);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message) });
  }
});

module.exports = router;
