const seed = require("../db/seed");

let run = true;

before(function(done) {
  if (!run) return;
  seed.init(2, 3, 3).then(() => {
    done();
  });
  run = false;
});
