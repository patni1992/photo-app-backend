const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("./middleware/cors");
const dbURI = "mongodb://127.0.0.1/my_database";
var _ = require("lodash");
const Comment = require("./models/Comment");
mongoose.connect(dbURI);
mongoose.Promise = global.Promise;

mongoose.connection.on("connected", function() {
  console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on("error", function(err) {
  console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", function() {
  console.log("Mongoose disconnected");
});

gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log("Mongoose disconnected through " + msg);
    callback();
  });
};
// For nodemon restarts
process.once("SIGUSR2", function() {
  gracefulShutdown("nodemon restart", function() {
    process.kill(process.pid, "SIGUSR2");
  });
});
// For app termination
process.on("SIGINT", function() {
  gracefulShutdown("app termination", function() {
    process.exit(0);
  });
});

const app = express();

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
