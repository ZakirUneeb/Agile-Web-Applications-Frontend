// Jack
module.exports = function setCurrentPage(req, res, next) {
    const path = req.path.toLowerCase();

    if (path.startsWith('/home')) {
        res.locals.currentPage = 'home';
    } else if (path.startsWith('/profile')) {
        res.locals.currentPage = 'profile';
    } else if (path.startsWith('/manager/team')) {
        res.locals.currentPage = 'team';
    } else if (path.startsWith('/skills')) {
        res.locals.currentPage = 'skills';
    } else {
        res.locals.currentPage = ''; // Default value for other pages
    }

    next();
};