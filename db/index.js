const mongoose = require("mongoose");

function init() {
  mongoose.connect(
    process.env.DBURI,
    { useNewUrlParser: true }
  );
  mongoose.Promise = global.Promise;

  mongoose.connection.on("connected", function() {
    console.log("Mongoose connected to " + process.env.DBURI);
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
}

module.exports = {
  init
};
