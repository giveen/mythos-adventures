const express = require("express");
const cors = require("cors");

// Routes
const storyRoutes = require("./routes/storyRoutes");
const characterRoutes = require("./routes/characterRoutes");
const activeCharacterRoutes = require("./routes/activeCharacterRoutes");
const rollRoutes = require("./routes/rollRoutes");   // <-- NEW for Step D
const sessionRoutes = require("./routes/sessionRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const marketRoutes = require("./routes/marketRoutes");
const spellRoutes = require("./routes/spellRoutes");
const ollamaRoutes = require('./routes/ollamaRoutes2');

// Ensure DB tables initialize
require("./db/characters");   // creates characters table if missing

// Initialize Express FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", storyRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/active-character", activeCharacterRoutes);
app.use("/api/roll", rollRoutes);   // <-- NEW dice + skill check API
app.use("/api/session", sessionRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/market", marketRoutes);
app.use('/api/spells', spellRoutes);
app.use('/api/ollama', ollamaRoutes);

// Try to initialize Ollama on startup (best-effort)
try {
  const ollamaService = require('./services/ollamaService');
  if (!ollamaService.hasOllamaCLI()) {
    (async () => {
      try {
        const r = await ollamaService.ensureOllamaInstalled();
        console.log('Ollama install check:', r);
      } catch (e) {
        console.warn('Ollama initialization failed:', e && e.message);
      }
    })();
  } else {
    console.log('Ollama already installed. Skipping auto-install.');
  }
} catch (e) {
  console.warn('Ollama service not available:', e && e.message);
}

// Start Server (use env PORT when available)
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`MythOS backend running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or set PORT to a different value.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
