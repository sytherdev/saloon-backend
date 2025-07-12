const express = require('express')
const { body } = require('express-validator')
const { protect } = require('../middleware/auth')
const {
    createTeamMember,
    getTeamMembers,
    updateTeamMember,
    deleteTeamMember
} = require('../controllers/teamMemberController')

const router = express.Router()

// @route   POST /api/team
// @desc    Create a team member
// @access  Private
router.post(
    '/',
    protect,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('profession').notEmpty().withMessage('Profession is required'),
        body('services').isArray({ min: 1 }).withMessage('At least one service is required'),
        body('workingHours').isArray({ min: 1 }).withMessage('Working hours required')
    ],
    createTeamMember
)

// @route   GET /api/team
// @desc    Get all team members for the logged-in salon
// @access  Private
router.get('/', protect, getTeamMembers)

// @route   PUT /api/team/:id
// @desc    Update a team member
// @access  Private
router.put(
    '/:id',
    protect,
    [
        body('name').notEmpty(),
        body('profession').notEmpty(),
        body('services').isArray({ min: 1 }),
        body('workingHours').isArray({ min: 1 })
    ],
    updateTeamMember
)

// @route   DELETE /api/team/:id
// @desc    Delete a team member
// @access  Private
router.delete('/:id', protect, deleteTeamMember)

module.exports = router
