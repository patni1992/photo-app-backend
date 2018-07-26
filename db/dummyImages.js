const axios = require("axios");
const fs = require("fs");
const { unsplash } = require("../config/apikeys");

function getImages() {
  let promiseArray = [];
  let finalResults = [];
  for (let i = 1; i < 45; i++) {
    promiseArray.push(
      axios.get("https://api.unsplash.com/photos", {
        params: {
          client_id: unsplash.client_id,
          per_page: 30,
          page: i
        }
      })
    );
  }

  Promise.all(promiseArray)
    .then(function(responses) {
      let mergedResults = responses.map(response => {
        return response.data;
      });

      mergedResults = [].concat.apply([], mergedResults);

      finalResults = mergedResults
        .filter(img => {
          return img.width > img.height;
        })
        .map(test => {
          return test.urls.regular;
        });

      fs.writeFile(
        "dummyImages.json",
        JSON.stringify(finalResults, null, 4),
        "utf8",
        () =>
          console.log(finalResults.length + " imgs saved in dummyImages.json")
      );
    })
    .catch(e => console.log(e));
}

module.exports = getImages();
