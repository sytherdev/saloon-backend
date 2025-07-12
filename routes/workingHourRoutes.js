const express = require('express');
const router = express.Router();
const workingHourController = require('../controllers/workingHourController');
const { protect } = require('../middleware/auth'); // your JWT auth

/**
 * @swagger
 * /working-hours:
 *   post:
 *     summary: Create or update working hours
 *     tags: [WorkingHours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day: { type: string }
 *                     key: { type: string }
 *                     open: { type: string }
 *                     close: { type: string }
 *                     closed: { type: boolean }
 *                     breaks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           start: { type: string }
 *                           end: { type: string }
 *     responses:
 *       200:
 *         description: Working hours saved
 *       500:
 *         description: Server error
 */
router.post('/', protect, workingHourController.saveWorkingHours);

/**
 * @swagger
 * /working-hours:
 *   get:
 *     summary: Get working hours of logged-in user
 *     tags: [WorkingHours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Working hours fetched
 *       500:
 *         description: Server error
 */
router.get('/', protect, workingHourController.getWorkingHours);

module.exports = router;
