const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('../middleware/errorHandler');
const appEvent = require('../events/app-event');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

appEvent(app);

app.use('/v1', require('../route'));

app.use(errorHandler);

module.exports = app;