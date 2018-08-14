const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./middleware/cors");
const db = require("./db");
const _ = require("lodash");
const morgan = require("morgan");
const { port } = require("./config");
db.init();
const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors);

app.use(require("./routes"));

app.use(function(err, req, res, next) {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports.app = app;
