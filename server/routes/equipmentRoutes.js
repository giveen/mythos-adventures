const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

router.get('/', equipmentController.listEquipment);
router.get('/:id', equipmentController.getEquipment);

module.exports = router;
