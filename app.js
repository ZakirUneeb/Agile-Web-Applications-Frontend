const express = require('express');
const logger = require('morgan');
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

app.use(express.json());
app.use(logger('dev'));
app.set('port', port); //Port to listen on
app.listen(port); //Start the server

app.use("/api/departments", departmentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/skill_categories", skillCategoriesRouter);
app.use("/api/skill_enrolments", skillEnrolmentsRouter);
app.use("/api/skill_strengths", skillStrengthsRouter);
app.use("/api/job_roles", jobRolesRouter);
app.use("/api/system_roles", systemRolesRouter);
app.use((req, res) =>
    utilities.formatErrorResponse(res,400,
        "End point not recognised"));
        
module.exports = app;