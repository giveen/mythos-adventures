const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/', marketController.listMarket);
router.post('/purchase', marketController.purchase);

module.exports = router;
