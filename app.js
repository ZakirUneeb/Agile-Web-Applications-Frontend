// Everyone

// Jack
// Middleware Import: The authenticateToken middleware is now imported from a dedicated file.
// Routing Order: The routing order was adjusted to ensure /login is handled first, and unrecognized endpoints are caught last.

const express = require('express');
const logger = require('morgan');
const path = require('path');  
const cookieParser = require('cookie-parser');  
const createError = require('http-errors');  
const app = express();

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = require('./middleware/authenticateToken');
const setCurrentPage = require('./middleware/setCurrentPage');

const homeRouter = require('./routes/common/home');
const profileRouter = require('./routes/common/profile');
const managerTeamRouter = require('./routes/manager/my_team');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const mySkillsRouter = require('./routes/my_skills');

const departmentsRouter = require('./routes/departments');
const usersRouter = require('./routes/user');
const skillsRouter = require('./routes/skill');
const skillCategoriesRouter = require('./routes/skill_category');
const skillEnrolmentsRouter = require('./routes/skill_enrolment');
const skillStrengthsRouter = require('./routes/skill_strength');
const jobRolesRouter = require('./routes/job_role');
const systemRolesRouter = require('./routes/system_role');

const adminAddStaffRouter = require('./routes/admin/add_staff');
const adminAllStaffRouter = require('./routes/admin/all_staff');
const adminDeleteStaffRouter = require('./routes/admin/delete_staff');
const adminEditStaffRouter = require('./routes/admin/edit_staff');
const adminViewStaffSkillsRouter = require('./routes/admin/view_staff_skills');
const adminAllSkillsRouter = require('./routes/admin/all_skills');
const adminAddSkillRouter = require('./routes/admin/add_skill');
const adminEditSkillRouter = require('./routes/admin/edit_skill');
const adminDeleteSkillRouter = require('./routes/admin/delete_skill');
const adminAllDepartmentsRouter = require('./routes/admin/all_departments');
const adminAddDepartmentRouter = require('./routes/admin/add_department');
const adminDeleteDepartmentRouter = require('./routes/admin/delete_department');
const adminViewStaffByDepartmentRouter = require('./routes/admin/view_staff_by_department');

const utilities = require('./utilities/utility');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(setCurrentPage);  // Apply setCurrentPage middleware globally

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/home', homeRouter);
app.use('/profile', profileRouter);
app.use('/my_skills', authenticateToken, mySkillsRouter);
app.use('/manager/team', managerTeamRouter);

app.use("/api/departments", authenticateToken, departmentsRouter);
app.use("/api/users", authenticateToken, usersRouter);
app.use("/api/skills", authenticateToken, skillsRouter);
app.use("/api/skill_categories", authenticateToken, skillCategoriesRouter);
app.use("/api/skill_enrolments", skillEnrolmentsRouter);
app.use("/api/skill_strengths", authenticateToken, skillStrengthsRouter);
app.use("/api/job_roles", authenticateToken, jobRolesRouter);
app.use("/api/system_roles", authenticateToken, systemRolesRouter);

app.use("/manager/team", authenticateToken, managerTeamRouter);

app.use("/admin/add_staff", authenticateToken, adminAddStaffRouter);
app.use("/admin/all_staff", authenticateToken, adminAllStaffRouter);
app.use("/admin/delete_staff", authenticateToken, adminDeleteStaffRouter);
app.use("/admin/edit_staff", authenticateToken, adminEditStaffRouter);
app.use("/admin/view_staff_skills", authenticateToken, adminViewStaffSkillsRouter);
app.use('/admin/all_skills', authenticateToken, adminAllSkillsRouter);
app.use("/admin/add_skill", authenticateToken, adminAddSkillRouter);
app.use("/admin/edit_skill", authenticateToken, adminEditSkillRouter);
app.use("/admin/delete_skill", authenticateToken, adminDeleteSkillRouter);
app.use('/admin/all_departments', authenticateToken, adminAllDepartmentsRouter);
app.use('/admin/add_department', authenticateToken, adminAddDepartmentRouter);
app.use('/admin/delete_department', authenticateToken, adminDeleteDepartmentRouter);
app.use('/admin/view_staff_by_department', authenticateToken, adminViewStaffByDepartmentRouter);

// Catch all for unrecognized endpoints
app.use((req, res) => {
    console.log("Unrecognized endpoint hit");
    utilities.formatErrorResponse(res, 400, "End point not recognised");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    console.log("Error handler hit");
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
