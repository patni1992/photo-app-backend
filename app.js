const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./middleware/cors");
const db = require("./db");
const _ = require("lodash");

const app = express();
db.init();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors);

app.use(require("./routes"));

app.use(function(err, req, res, next) {
  let message = _.get(err, "errors.text.message") || err.message;
  res.status(err.status || 500);
  res.json({
    errors: {
      message
    }
  });
});

app.listen(5000, () => console.log("Example app listening on port 5000!"));
