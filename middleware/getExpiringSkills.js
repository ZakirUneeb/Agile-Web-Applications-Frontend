const { getExpiringSkills } = require('../controllers/skill_enrolment');

const fetchExpiringSkills = async (req, res, next) => {
    if (req.user) {
        try {
            const expiringSkills = await getExpiringSkills(req.user.userId);
            res.locals.expiringSkills = expiringSkills;
        } catch (error) {
            console.error('Error fetching expiring skills:', error);
            res.locals.expiringSkills = [];
        }
    } else {
        res.locals.expiringSkills = [];
    }
    next();
};

module.exports = fetchExpiringSkills;
