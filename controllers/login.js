const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.user;

login = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email);
    console.log('Provided password:', password);

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Authentication failed' });
        }

        console.log('User found:', user.email);
        console.log('Stored hashed password:', user.password);

        const passwordString = String(password);

        console.log('Password for comparison:', passwordString);

        const testHash = await bcrypt.hash('password', 10);
        const testCompare = await bcrypt.compare('password', testHash);
        console.log('Test comparison result:', testCompare);

        const isPasswordValid = await bcrypt.compare(passwordString, user.password);

        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { login };