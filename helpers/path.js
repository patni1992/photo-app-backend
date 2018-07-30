const { filePath } = require("../config");
function makeRelativeUrlAbsolute(path) {
  const r = new RegExp("^(?:[a-z]+:)?//", "i");

  if (!r.test(path)) {
    path = (filePath + path).replace(/([^:]\/)\/+/g, "$1");
  }

  return path;
}

module.exports = {
  makeRelativeUrlAbsolute
};
