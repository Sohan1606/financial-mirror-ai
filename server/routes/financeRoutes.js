const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authenticate = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/profile', financeController.getFinancialProfile);
router.post('/profile', financeController.saveFinancialProfile);
router.post('/simulations', financeController.saveSimulation);
router.get('/simulations', financeController.getSimulations);

module.exports = router;
