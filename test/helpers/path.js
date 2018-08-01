const should = require("chai").should();
const { makeRelativeUrlAbsolute } = require("../../helpers/path");
const { filePath } = require("../../config");

// prettier-ignore
describe("helpers", function() {

  describe("Path", function() {

    describe("makeRelativeUrlAbsolute", function() {

      it("should make a relative url aboslute", function() {
        makeRelativeUrlAbsolute("images/hello.jpg").should.equal(filePath + "images/hello.jpg")
    });
      

      it("should ignore aboslute url", function() {
        makeRelativeUrlAbsolute("https://github.com/").should.equal("https://github.com/")
      });
      
    });
  });
});
