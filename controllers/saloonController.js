const User = require('../models/User');
const Service = require('../models/Service');
const TeamMember = require('../models/teamMember');
const WorkingHour = require('../models/Workinghour');

exports.getFilteredSalons = async (req, res) => {
    try {
        const {
            search = '',
            location = '',
            rating = 0,
            priceRange = ''
        } = req.query;

        const ratingNum = parseFloat(rating) || 0;

        // Step 1: If searching, find matching salonIds from services
        let matchedSalonIds = [];
        if (search) {
            const matchingServices = await Service.find({
                name: { $regex: search, $options: 'i' }
            }).select('salonId');

            matchedSalonIds = matchingServices.map(service => service.salonId.toString());
        }

        // Step 2: Build User (Salon) query
        const userQuery = {
            role: 'salon',
            // rating: { $gte: ratingNum }
        };

        if (search) {
            userQuery.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { _id: { $in: matchedSalonIds } }
            ];
        }

        if (location) {
            userQuery.address = { $regex: location, $options: 'i' };
        }

        if (priceRange) {
            userQuery.priceRange = priceRange;
        }

        // Step 3: Get Salons
        const salons = await User.find(userQuery).select('-password').lean();
        console.log('🔍 Final Query:', userQuery);
        console.log('✅ Found Salons:', salons.length);

        // Step 4: Enrich salons
        const enrichedSalons = await Promise.all(
            salons.map(async (salon) => {
                const [services, team, workingHours] = await Promise.all([
                    Service.find({ salonId: salon._id }).lean(),
                    TeamMember.find({ salonId: salon._id }).select('-__v').populate('services').lean(),
                    WorkingHour.findOne({ userId: salon._id }).lean(),
                ]);

                return {
                    ...salon,
                    services,
                    teamMembers: team,
                    workingHours: workingHours?.hours || []
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: enrichedSalons.length,
            salons: enrichedSalons
        });

    } catch (err) {
        console.error('❌ Error fetching salons:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching salons'
        });
    }
};


exports.getSalonDetail = async (req, res) => {
    try {
        const salonId = req.params.id;

        const salon = await User.findOne({ _id: salonId, role: 'salon' }).select('-password').lean();
        if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });

        const [services, staff, workingHours] = await Promise.all([
            Service.find({ salonId }).lean(),
            TeamMember.find({ salonId }).populate('services').lean(),
            WorkingHour.findOne({ userId: salonId }).lean(),
        ]);

        return res.status(200).json({
            success: true,
            salon: {
                ...salon,
                services,
                staff,
                workingHours: workingHours?.hours || [],
            },
        });
    } catch (err) {
        console.error('Error fetching salon detail:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};