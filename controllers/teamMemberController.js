const TeamMember = require('../models/teamMember')
const Service = require('../models/Service')
const WorkingHour = require('../models/Workinghour')
const { validationResult } = require('express-validator')

// @desc    Create a new team member
exports.createTeamMember = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const salonId = req.user.id
    const { name, profession, image, bio, services, workingHours } = req.body

    try {

        const salonServices = await Service.find({ salonId }).select('_id')

        const validServiceIds = salonServices.map(s => s._id.toString())

        const invalidServices = services.filter(sid => !validServiceIds.includes(sid))
        if (invalidServices.length > 0) {
            return res.status(400).json({ message: 'One or more services are invalid.' })
        }

        const salonSchedule = await WorkingHour.findOne({ userId: salonId })
        if (!salonSchedule) {
            return res.status(400).json({ message: 'Salon working hours not set' })
        }

        const salonHours = salonSchedule.hours.reduce((map, day) => {
            map[day.key] = day
            return map
        }, {})

        for (const day of workingHours) {
            const salonDay = salonHours[day.key]
            if (!salonDay) {
                return res.status(400).json({ message: `Invalid day key: ${day.key}` })
            }

            if (!day.closed && !salonDay.closed) {
                if (day.open < salonDay.open || day.close > salonDay.close) {
                    return res.status(400).json({
                        message: `Team member schedule on ${day.day} must be within salon working hours: ${salonDay.open} - ${salonDay.close}`
                    })
                }
            }
        }

        const newMember = new TeamMember({
            salonId,
            name,
            profession,
            image,
            bio,
            services,
            workingHours
        })

        await newMember.save()
        res.status(201).json(newMember)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Get all team members for a salon
exports.getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.find({ salonId: req.user.id })
            .populate('services', 'name duration priceRange')

        res.json(members)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Update a team member
exports.updateTeamMember = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { id } = req.params
    const salonId = req.user.id
    const { name, profession, image, bio, services, workingHours } = req.body
    console.log(services)
    try {
        const member = await TeamMember.findOne({ _id: id, salonId })
        if (!member) return res.status(404).json({ message: 'Team member not found' })

        const validServices = await Service.find({ salonId }).select('_id')
        const validServiceIds = validServices.map(s => s._id.toString())

        const invalid = services.filter(id => !validServiceIds.includes(id))
        if (invalid.length > 0)
            return res.status(400).json({ message: 'Invalid service(s) included' })

        const salonHours = await WorkingHour.findOne({ userId: salonId })
        const hoursMap = salonHours?.hours.reduce((acc, cur) => {
            acc[cur.key] = cur
            return acc
        }, {}) || {}

        for (const day of workingHours) {
            const refDay = hoursMap[day.key]
            if (!refDay) return res.status(400).json({ message: `Invalid day: ${day.key}` })

            if (!day.closed && !refDay.closed) {
                if (day.open < refDay.open || day.close > refDay.close)
                    return res.status(400).json({
                        message: `Working hours for ${day.day} must be between ${refDay.open} and ${refDay.close}`
                    })
            }
        }

        Object.assign(member, {
            name,
            profession,
            image,
            bio,
            services,
            workingHours
        })

        await member.save()
        res.json(member)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

// @desc    Delete a team member
exports.deleteTeamMember = async (req, res) => {
    const { id } = req.params
    try {
        const member = await TeamMember.findOneAndDelete({ _id: id, salonId: req.user.id })
        if (!member) return res.status(404).json({ message: 'Team member not found' })
        res.json({ message: 'Team member deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
