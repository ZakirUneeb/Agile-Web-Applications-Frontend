// Everyone
const express = require('express');
const logger = require('morgan');
const path = require('path');  
const cookieParser = require('cookie-parser');  
const createError = require('http-errors');  
const app = express();

const port = process.env.PORT || '8900';
const departmentsRouter = require('./routes/departments');
const usersRouter = require('./routes/user');
const skillsRouter = require('./routes/skill');
const skillCategoriesRouter = require('./routes/skill_category');
const skillEnrolmentsRouter = require('./routes/skill_enrolment');
const skillStrengthsRouter = require('./routes/skill_strength');
const jobRolesRouter = require('./routes/job_role');
const systemRolesRouter = require('./routes/system_role');
const utilities = require('./utilities/utility');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', port);
app.listen(port);

app.use("/api/departments", departmentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/skill_categories", skillCategoriesRouter);
app.use("/api/skill_enrolments", skillEnrolmentsRouter);
app.use("/api/skill_strengths", skillStrengthsRouter);
app.use("/api/job_roles", jobRolesRouter);
app.use("/api/system_roles", systemRolesRouter);

app.use((req, res) => 
    utilities.formatErrorResponse(res, 400, "End point not recognised")
);

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
