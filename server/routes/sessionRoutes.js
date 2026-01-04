const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

router.post("/save", controller.saveSession);
router.post("/summarize", controller.summarizeSession);
router.get("/list", controller.listSessions);
router.get("/:id", controller.getSession);

module.exports = router;
