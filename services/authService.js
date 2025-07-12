const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (data) => {
    const { fullName, email, password, address, role } = data;

    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already in use');

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ fullName, email, password: hashed, address, role });
    await user.save();

    return { id: user._id, email: user.email, role: user.role };
};

exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    console.log(`Generated token for user ${user._id}: ${token}`);
    return { user: { id: user._id, email: user.email, role: user.role, auth_token: token } };
};
