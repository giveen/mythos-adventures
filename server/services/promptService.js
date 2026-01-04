const fs = require("fs");
const path = require("path");

function loadSystemPrompt() {
  const filePath = path.join(__dirname, "..", "prompts", "system-prompt.md");
  return fs.readFileSync(filePath, "utf8");
}

module.exports = { loadSystemPrompt };
