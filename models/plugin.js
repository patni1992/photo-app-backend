const { filePath } = require("../config");

function makeRelativeUrlAbsolute(schema, propToModify) {
  schema.post("init", function() {
    var r = new RegExp("^(?:[a-z]+:)?//", "i");

    if (!r.test(this.path)) {
      this[propToModify] = (filePath + this[propToModify]).replace(
        /([^:]\/)\/+/g,
        "$1"
      );
    }
  });
}

module.exports = {
  makeRelativeUrlAbsolute
};
