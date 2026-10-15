const express = require('express');
const router = express.Router();
const { getShippingMethods, getPublicConfig } = require('../controllers/storeController');

router.get('/shipping-methods', getShippingMethods);
router.get('/config', getPublicConfig);

module.exports = router;
