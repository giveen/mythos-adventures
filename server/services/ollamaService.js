// In-memory active model tracking and parameters
let activeModel = null;
let activeParams = null;

function getActiveModel() {
  return activeModel;
}

function getActiveParams() {
  return activeParams;
}

function activateModel(model, params) {
  activeModel = model;
  // Default parameters to apply on activation (can be overridden by caller)
  activeParams = Object.assign({
    temperature: 1.0,
    top_p: 0.92,
    top_k: 60,
    repeat_penalty: 1.18,
    repeat_last_n: 128,
    presence_penalty: 0.8,
    frequency_penalty: 0.7,
    num_ctx: 16384,
    mirostat: 0,
    seed: 12345
  }, params || {});

  // Optionally, pre-load the model by running a no-op generate in detached mode
  // spawn('ollama', ['generate', model, '--prompt', ''], { detached: true });
  return { active: model, params: activeParams };
}

function deactivateModel() {
  activeModel = null;
  activeParams = null;
  return { active: null };
}
function getOllamaVersion() {
  try {
    const out = execSync('ollama --version', { encoding: 'utf8' });
    return String(out).trim();
  } catch (e) {
    return null;
  }
}

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Default Ollama models directory (Linux/macOS typical)
const MODELS_DIR = process.env.OLLAMA_MODELS_DIR || '/usr/share/ollama/models';

function hasOllamaCLI() {
  try {
    execSync('ollama --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function installOllamaLinux() {
  // Always run the install script to ensure latest version
  try {
    execSync('curl -fsSL https://ollama.com/install.sh | sh', { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error('Failed to install Ollama via install.sh:', e && e.message);
    return false;
  }
}

async function ensureOllamaInstalled() {
  const platform = os.platform();
  if (platform === 'linux') {
    const ok = installOllamaLinux();
    return { installed: ok };
  }
  // For unsupported platforms, return not installed and instructions
  return { installed: hasOllamaCLI(), message: `Platform ${platform} not auto-installable` };
}

function listLocalModels() {
  try {
    const out = execSync('ollama ls', { encoding: 'utf8' });
    // Try to parse as JSON, fallback to parsing table output
    try {
      const parsed = JSON.parse(out);
      if (Array.isArray(parsed)) return parsed.map(p => (p && (p.name || p.id)) || String(p));
      return parsed;
    } catch (e) {
      const lines = String(out).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      // Remove header line if present (e.g. "NAME ID SIZE MODIFIED")
      const filtered = lines.filter(l => !/^NAME\b/i.test(l));
      // First whitespace-separated column is the model id
      const ids = filtered.map(l => {
        const parts = l.split(/\s+/);
        return parts.length ? parts[0] : l;
      }).filter(Boolean);
      return ids;
    }
  } catch (e) {
    return [];
  }
}

// Normalize a model id for comparison: trim, remove tag suffix like ':latest', and return basename
function normalizeModelId(id) {
  if (!id) return '';
  let s = String(id).trim();
  // remove surrounding quotes
  s = s.replace(/^"|"$/g, '');
  // remove trailing :tag (e.g., :latest)
  const parts = s.split(':');
  if (parts.length > 1) {
    // if there is a colon and tag looks like 'latest' or a tag, drop it
    parts.pop();
    s = parts.join(':');
  }
  // basename after last '/'
  const base = s.includes('/') ? s.substring(s.lastIndexOf('/') + 1) : s;
  return { full: s, base };
}

function pullModel(model) {
  pullProgress[model] = { progress: 0, status: 'pulling', error: null };
  return new Promise((resolve, reject) => {
    const cmd = spawn('ollama', ['pull', model]);
    const logs = [];
    cmd.stdout.on('data', (d) => {
      const str = String(d);
      logs.push(str);
      // Try to parse progress
      const lines = str.split(/\r?\n/);
      for (const line of lines) {
        const pct = parseOllamaPullProgress(line);
        if (pct !== null) pullProgress[model].progress = pct;
      }
    });
    cmd.stderr.on('data', (d) => logs.push(String(d)));
    cmd.on('close', (code) => {
      if (code === 0) {
        pullProgress[model].progress = 100;
        pullProgress[model].status = 'done';
        resolve({ ok: true });
      } else {
        pullProgress[model].status = 'error';
        pullProgress[model].error = `ollama pull exited ${code}`;
        reject(new Error(`ollama pull exited ${code}`));
      }
      setTimeout(() => { delete pullProgress[model]; }, 60000);
    });
    cmd.on('error', (err) => {
      pullProgress[model].status = 'error';
      pullProgress[model].error = String(err);
      reject(err);
      setTimeout(() => { delete pullProgress[model]; }, 60000);
    });
  });
}

// Delete a model file from the local models dir
function deleteModel(modelName) {
  // Prefer using the Ollama CLI to remove models when available
  try {
    if (hasOllamaCLI()) {
      const { spawnSync } = require('child_process');
      // Try common removal commands (rm or delete)
      let res = spawnSync('ollama', ['rm', modelName], { encoding: 'utf8' });
      if (res && res.status === 0) return { deleted: true, cli: 'rm' };
      res = spawnSync('ollama', ['delete', modelName], { encoding: 'utf8' });
      if (res && res.status === 0) return { deleted: true, cli: 'delete' };

      // Try to match short names against local models using normalization
      const locals = listLocalModels();
      const nm = normalizeModelId(modelName);
      let match = null;
      for (const l of locals) {
        const ln = normalizeModelId(l);
        if (ln.full === nm.full) { match = l; break; }
        if (ln.base === nm.base) { match = l; break; }
        if ((l || '').includes(modelName)) { match = l; break; }
      }
      if (match) {
        try {
          const r2 = spawnSync('ollama', ['rm', match], { encoding: 'utf8' });
          if (r2 && r2.status === 0) return { deleted: true, cli: 'rm', matched: match };
          const r3 = spawnSync('ollama', ['delete', match], { encoding: 'utf8' });
          if (r3 && r3.status === 0) return { deleted: true, cli: 'delete', matched: match };
        } catch (e) {
          // fall through to filesystem fallback
        }
      }
    }
  } catch (e) {
    // continue to filesystem fallback
  }

  // Filesystem fallback: try to locate a matching directory/file under MODELS_DIR
  try {
    const locals = listLocalModels();
    // Normalize requested name
    const nm = normalizeModelId(modelName);
    // Try to find a matching local model by normalized full, then base, then includes
    let match = null;
    for (const l of locals) {
      const ln = normalizeModelId(l);
      if (ln.full === nm.full) { match = l; break; }
      if (ln.base === nm.base) { match = l; break; }
      if ((l || '').includes(modelName)) { match = l; break; }
    }
    const target = match ? normalizeModelId(match).full : nm.full;
    const filePath = path.join(MODELS_DIR, target);
    if (!filePath.startsWith(MODELS_DIR)) throw new Error('Invalid model name');
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      }
      return { deleted: true, matched: match || null };
    }
  } catch (e) {
    // ignore and return not found below
  }
  return { deleted: false, error: 'Not found' };
}

// In-memory progress state (model -> {progress, status, error})
const pullProgress = {};

function parseOllamaPullProgress(line) {
  // Example: "pulling manifest ...  12%"
  const match = line.match(/([0-9]{1,3})%/);
  if (match) return parseInt(match[1], 10);
  return null;
}

function pullModel(model) {
  pullProgress[model] = { progress: 0, status: 'pulling', error: null };
  return new Promise((resolve, reject) => {
    const cmd = spawn('ollama', ['pull', model]);
    const logs = [];
    cmd.stdout.on('data', (d) => {
      const str = String(d);
      logs.push(str);
      // Try to parse progress
      const lines = str.split(/\r?\n/);
      for (const line of lines) {
        const pct = parseOllamaPullProgress(line);
        if (pct !== null) pullProgress[model].progress = pct;
      }
    });
    cmd.stderr.on('data', (d) => logs.push(String(d)));
    cmd.on('close', (code) => {
      if (code === 0) {
        pullProgress[model].progress = 100;
        pullProgress[model].status = 'done';
        resolve({ ok: true, logs: logs.join('') });
      } else {
        pullProgress[model].status = 'error';
        pullProgress[model].error = `ollama pull exited ${code}`;
        reject(new Error(`ollama pull exited ${code}: ${logs.join('')}`));
      }
      // Clean up after a short delay
      setTimeout(() => { delete pullProgress[model]; }, 60000);
    });
    cmd.on('error', (err) => {
      pullProgress[model].status = 'error';
      pullProgress[model].error = String(err);
      reject(err);
      setTimeout(() => { delete pullProgress[model]; }, 60000);
    });
  });
}

function getPullProgress(model) {
  return pullProgress[model] || null;
}

function generateModel(model, messages) {
  const { spawnSync } = require('child_process');
  const prompt = Array.isArray(messages) ? messages.map(m => `${m.role}: ${m.content}`).join('\n') : String(messages);
  try {
    // Build args for generate including active params
    const args = ['generate', model, '--prompt', prompt];
    if (activeParams && typeof activeParams === 'object') {
      for (const [k, v] of Object.entries(activeParams)) {
        const flag = `--${k.replace(/_/g, '-')}`;
        args.push(flag, String(v));
      }
    }
    // Remove --json for compatibility with older Ollama
    const res = spawnSync('ollama', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    if (res.error) throw res.error;
    const out = res.stdout || res.stderr || '';
    // Try to extract the first non-empty line as the response
    const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return { content: lines.length ? lines[0] : out };
  } catch (e) {
    throw e;
  }
}

function detectGPU() {
  // Try NVIDIA via nvidia-smi
  try {
    const out = execSync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader', { encoding: 'utf8' });
    const lines = out.trim().split('\n').filter(Boolean);
    const gpus = lines.map(l => {
      const parts = l.split(',').map(p => p.trim());
      return { name: parts[0], memory: parts[1] };
    });
    return { type: 'nvidia', gpus };
  } catch (e) {
    // fallback: check lspci for AMD/Intel
    try {
      const l = execSync("lspci | grep -i 'vga\|3d' || true", { encoding: 'utf8' });
      if (l && /amd|radeon/i.test(l)) return { type: 'amd', info: l.trim() };
      if (l && /intel/i.test(l)) return { type: 'intel', info: l.trim() };
    } catch (e2) {
      // ignore
    }
  }
  return { type: 'none' };
}

function recommendModels(gpuInfo) {
  const choices = [];
  if (!gpuInfo || gpuInfo.type === 'none') {
    choices.push({ id: 'cpu-friendly', reason: 'No GPU detected — prefer small quantized models (q4/q6) or cloud LLMs.' });
    choices.push({ id: 'adi0adi/ollama_stheno-8b_v3.1_q6k', reason: '8B quantized model suitable for CPU or small GPU.' });
    return choices;
  }

  if (gpuInfo.type === 'nvidia') {
    const memStr = (gpuInfo.gpus && gpuInfo.gpus[0] && gpuInfo.gpus[0].memory) || '';
    const memMb = Number((memStr || '').replace(/[^0-9]/g, ''));
    if (memMb >= 24000) {
      choices.push({ id: 'SimonPu/Qwen3-Coder:30B-Instruct_Q4_K_XL', reason: 'Large GPU (>=24GB) — 30B models are feasible with quantized runtimes.' });
      choices.push({ id: 'Tohur/natsumura-storytelling-rp-llama-3.1', reason: 'High-quality storytelling model.' });
    } else if (memMb >= 12000) {
      choices.push({ id: 'Tohur/natsumura-storytelling-rp-llama-3.1', reason: '12–24GB GPU — good for 13B models or 8B quantized.' });
      choices.push({ id: 'adi0adi/ollama_stheno-8b_v3.1_q6k', reason: '8B quantized model — likely to fit.' });
    } else {
      choices.push({ id: 'adi0adi/ollama_stheno-8b_v3.1_q6k', reason: 'Small GPU — use 8B quantized models.' });
      choices.push({ id: 'Tohur/natsumura-storytelling-rp-llama-3.1', reason: 'May still work if quantized.' });
    }
    return choices;
  }

  return [{ id: 'adi0adi/ollama_stheno-8b_v3.1_q6k', reason: 'Default suggestion' }];
}

module.exports = {
  hasOllamaCLI,
  ensureOllamaInstalled,
  listLocalModels,
  pullModel,
  getPullProgress,
  generateModel,
  detectGPU,
  recommendModels,
  getOllamaVersion,
  getActiveModel,
  getActiveParams,
  activateModel,
  deactivateModel,
  deleteModel,
  MODELS_DIR
};
