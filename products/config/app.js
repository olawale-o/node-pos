const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("../middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/app-event", require("../api/v1/app-event"));
app.use(require("../api/v1/index"));
app.use(errorHandler);

module.exports = app;
