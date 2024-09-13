// Johnathan + Jack

// Jack
//  The login controller handled the POST request but didn’t properly validate passwords or set up JWT tokens correctly.
//  No role-based redirection was present.
//  Token Handling: Generates a JWT token and sets it in an HTTP-only cookie.
//  Redirection: Redirects users to /staff/home if they have the STAFF role; otherwise, redirects to /other/home.


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.user;
const SystemRole = db.systemRole; 

login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            where: { email },
            include: [{ model: SystemRole, as: 'systemRole' }]
        });

        if (!user) {
            return res.redirect('/login?error=invalid');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.redirect('/login?error=invalid');
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email, systemRole: user.systemRole.system_role_name },
            process.env.SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/home');
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/login?error=server');
    }
};


module.exports = { login };
