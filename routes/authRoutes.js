const express = require('express');
const { registerUser, loginUser, updateSalonProfile, getSalonProfile } = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middleware/auth');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User & Salon Authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register user or salon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, salon]
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginUser);



router.put('/salon/profile', protect, updateSalonProfile);

router.get('/salon/profile', protect, getSalonProfile)

module.exports = router;
