const express = require("express");
const logger = require("morgan");
const path = require("path");

const config = require("../config");

const app = express();
const HTML_FILE = path.join(__dirname, "../dist/index.html");
const NODE_ENV = config.get("NODE_ENV");

app.disable("x-powered-by");

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(HTML_FILE);
  });
} else if (NODE_ENV === "development") {
  app.use(logger("dev"));
}

module.exports = app;
