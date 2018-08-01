const chai = require("chai");
const app = require("../../app").app;
const User = require("../../models/User");
const expect = chai.expect;
const request = require("supertest");

describe("controllers", () => {
  describe("image", () => {
    describe("GET /images", () => {
      it("should return images", done => {
        request(app)
          .get("/images")
          .expect(200)
          .expect(res => {
            expect(res.body.docs)
              .to.be.instanceof(Array)
              .to.have.length.above(0);
            expect(res.body)
              .to.be.an("Object")
              .to.include.keys("docs", "total", "limit", "page", "pages");
          })
          .end(done);
      });
    });

    describe("POST /images", () => {
      it("should be able to create new image", done => {
        User.findOne({}).then(user => {
          const testImage = `${__dirname}/dummyCat.jpeg`;

          const dataToSend = {
            tags: "test1234, hello, test",
            description: "test image"
          };

          request(app)
            .post("/images")
            .set("Authorization", "Bearer " + user.generateJWT())
            .attach("image", testImage)
            .field("tags", dataToSend.tags)
            .field("description", dataToSend.description)
            .expect(200);

          done();
        });
      });
    });
  });
});
