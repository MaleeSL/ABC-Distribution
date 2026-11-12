const express = require('express');
const router = express.Router();

// hdpu controller file ek import krgnn meken
const dashboardController = require('../controllers/dashboard.controller');

// get request ekk awma dashboardsummery function ek vada krnn hdnv
router.get('/summary', dashboardController.getDashboardSummary);

module.exports = router;