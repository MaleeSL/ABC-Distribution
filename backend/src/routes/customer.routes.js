
const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');

// Get customers
router.get('/', customerController.getCustomers);

// Add customer
router.post('/', customerController.createCustomer);

// Update customer
router.put('/:id', customerController.updateCustomer);

module.exports = router;
