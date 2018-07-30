const { filePath } = require("../config");

function makeRelativeUrlAbsolute(schema, propToModify) {
  schema.post("init", function() {
    const r = new RegExp("^(?:[a-z]+:)?//", "i");

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
