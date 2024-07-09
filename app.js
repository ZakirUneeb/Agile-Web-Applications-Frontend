const express = require('express');
const logger = require('morgan');
const app = express();

const port = process.env.PORT || '8900';
const departmentsRouter = require('./routes/departments');
const utilities = require('./utilities/utility');

app.use(express.json());
app.use(logger('dev'));
app.set('port', port); //Port to listen on
app.listen(port); //Start the server

app.use("/api/departments", departmentsRouter);
app.use((req, res) =>
    utilities.formatErrorResponse(res,400,
        "End point not recognised"));
        
module.exports = app;