// Everyone
const express = require('express');
const logger = require('morgan');
const path = require('path');  
const cookieParser = require('cookie-parser');  
const createError = require('http-errors');  
const app = express();

const jwt = require('jsonwebtoken');
require('dotenv').config();

const departmentsRouter = require('./routes/departments');
const usersRouter = require('./routes/user');
const skillsRouter = require('./routes/skill');
const skillCategoriesRouter = require('./routes/skill_category');
const skillEnrolmentsRouter = require('./routes/skill_enrolment');
const skillStrengthsRouter = require('./routes/skill_strength');
const jobRolesRouter = require('./routes/job_role');
const systemRolesRouter = require('./routes/system_role');
const utilities = require('./utilities/utility');
const loginRouter = require('./routes/login');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
    const tokenReceived = authHeader.split(' ')[1];
    
    jwt.verify(tokenReceived, process.env.SECRET, (err, user) => {
    if (err) {
    return res.sendStatus(401);
    }
    req.user = user;
    next(); 
    });
    } else {
    res.sendStatus(401); 
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/departments", authenticateToken, departmentsRouter);
app.use("/api/users", authenticateToken, usersRouter);
app.use("/api/skills", authenticateToken, skillsRouter);
app.use("/api/skill_categories", authenticateToken, skillCategoriesRouter);
app.use("/api/skill_enrolments", skillEnrolmentsRouter);
app.use("/api/skill_strengths", authenticateToken, skillStrengthsRouter);
app.use("/api/job_roles", authenticateToken, jobRolesRouter);
app.use("/api/system_roles", authenticateToken, systemRolesRouter);
app.use("", loginRouter);
app.use((req, res) =>
    utilities.formatErrorResponse(res, 400, "End point not recognised"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
