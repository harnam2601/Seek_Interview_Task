const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/', adminController.getAdminPage);

router.post('/add-special', adminController.postSpecial);

router.post('/edit-special', adminController.postEditSpecial);

module.exports = router;
