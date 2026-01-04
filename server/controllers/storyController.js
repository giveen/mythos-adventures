const { generateStoryResponse } = require("../services/llmService");

async function handleStory(req, res) {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const result = await generateStoryResponse([{ role: "user", content: prompt }]);

    // result is { content, actionResult }
    res.json({ reply: result.content, actionResult: result.actionResult });
  } catch (err) {
    console.error("StoryController error:", err);
    res.status(500).json({ error: "LLM error" });
  }
}

module.exports = { handleStory };
