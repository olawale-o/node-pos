const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", proxy("http://localhost:5001"));
app.use("/api/products", proxy("http://localhost:5002"));

module.exports = app;
