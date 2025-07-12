const express = require('express');
const router = express.Router();
const salonController = require('../controllers/saloonController');

// GET /api/salons?search=&location=&rating=&priceRange=
router.get('/', salonController.getFilteredSalons);


router.get('/:id', salonController.getSalonDetail);
module.exports = router;
