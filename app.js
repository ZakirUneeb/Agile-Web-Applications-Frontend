// Everyone
const express = require('express');
const logger = require('morgan');
const app = express();

const jwt = require('jsonwebtoken');
require('dotenv').config();


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
const loginRouter = require('./routes/login');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization; //looking for our header
    if (authHeader) { //Should contain “Bearer ” followed by the token
    const tokenReceived = authHeader.split(' ')[1];//retrieve value after space
    
    //Compare JWT token received with payload + SECRET
    jwt.verify(tokenReceived, process.env.SECRET, (err, user) => {
    if (err) {
    return res.sendStatus(401);
    }
    req.user = user; //save user information into request 
    next(); //invoke next middleware function (calling router)
    });
    } else {
    res.sendStatus(404);
    }
}


app.use(express.json());
app.use(logger('dev'));
app.set('port', port); //Port to listen on
app.listen(port); //Start the server

app.use("/api/departments", authenticateToken, departmentsRouter);
app.use("/api/users", authenticateToken, usersRouter);
app.use("/api/skills", authenticateToken, skillsRouter);
app.use("/api/skill_categories", authenticateToken, skillCategoriesRouter);
app.use("/api/skill_enrolments", authenticateToken, skillEnrolmentsRouter);
app.use("/api/skill_strengths", authenticateToken, skillStrengthsRouter);
app.use("/api/job_roles", authenticateToken, jobRolesRouter);
app.use("/api/system_roles", authenticateToken, systemRolesRouter);
app.use("", loginRouter);
app.use((req, res) =>
    utilities.formatErrorResponse(res, 400, "End point not recognised"));

module.exports = app;