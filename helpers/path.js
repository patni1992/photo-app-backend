function makeRelativeUrlAbsolute(path) {
  const r = new RegExp("^(?:[a-z]+:)?//", "i");

  if (!r.test(path)) {
    path = (process.env.FILEPATH + path).replace(/([^:]\/)\/+/g, "$1");
  }

  return path;
}

module.exports = {
  makeRelativeUrlAbsolute
};
