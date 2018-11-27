const expect = require("chai").expect;
const { makeRelativeUrlAbsolute } = require("../../helpers/path");

// prettier-ignore
describe("helpers", function() {

  describe("Path", function() {

    describe("makeRelativeUrlAbsolute", function() {

      it("should make a relative url aboslute", function() {
        expect(makeRelativeUrlAbsolute("images/hello.jpg")).equal(process.env.FILEPATH + "images/hello.jpg")
    });
      

      it("should ignore aboslute url", function() {
        expect(makeRelativeUrlAbsolute("https://github.com/")).equal("https://github.com/")
      });
      
    });
  });
});
