const express = require("express");
const router = express.Router();
const controller = require("../controllers/characterController");

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.get);
router.delete("/:id", controller.remove);

module.exports = router;
