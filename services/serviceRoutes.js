const express = require('express');
const {
    createService,
    getMyServices,
    updateService,
    deleteService,
} = require('../controllers/serviceController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

// Protected routes (salon must be logged in)
router.use(protect);

router.get('/', getMyServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
