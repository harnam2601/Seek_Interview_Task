const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/create-order', shopController.postOrder);

router.post('/cart/apply-special', shopController.applySpecial);

module.exports = router;
