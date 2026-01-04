const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");

router.post("/story", storyController.handleStory);

module.exports = router;
