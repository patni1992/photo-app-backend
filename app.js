const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./middleware/cors");
const db = require("./db");
const _ = require("lodash");
const fs = require('fs');
const morgan = require("morgan");
require('dotenv').config()

const uploadFolder = __dirname + "/uploads/"

db.init();

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static(uploadFolder));
app.use(cors);

app.use(require("./routes"));

app.use(function(err, req, res, next) {
  console.log(err)
  if (_.get(err, "error.isJoi")) {
    return res.status(400).json({
      type: err.type,
      message: err.error.toString()
    });
  }

  let message = _.get(err, "errors.text.message") || err.message;
  res.status(err.status || 500);
  res.json({
    message
  });
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));

module.exports.app = app;
