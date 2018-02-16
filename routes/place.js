const express = require('express');
const fetch = require('node-fetch');
const config = require('../config.js');

const cache = require('../cache/cache');

const router = express.Router();

const status = config.STATUS;
const key = config.gMap.key;
const output = config.OUTPUT_TYPE;
const baseURL = config.gMap.baseURL;
const textSearchBaseURL = `${baseURL}/textsearch/${output}?key=${key}`;
const detailedSearchBaseURL = `${baseURL}/details/${output}?key=${key}`;

router.get('/', (req, res) => {
  const q = req.query.query;
  const textSearchURL = `${textSearchBaseURL}&query=${q}`;

  if (cache[textSearchURL] !== undefined) {
    const placeId = cache[textSearchURL][0].place_id;
    const detailedSearchURL = `${detailedSearchBaseURL}&placeid=${placeId}`;

    if (cache[detailedSearchURL] !== undefined) {
      res.status(STATUS.OK).send(cache[detailedSearchURL]);
      return;
    }

    fetch(detailedSearchURL)
      .then(response => response.json())
      .then(data => (cache[detailedSearchURL] = data.result))
      .then(_ => res.status(status.OK).send(cache[detailedSearchURL]))
      .catch(err => console.log(err));
    return;
  }

  new Promise((resolve, reject) => {
    fetch(textSearchURL)
      .then(response => response.json())
      .then(data => (cache[textSearchURL] = data.results))
      .then(_ => resolve(cache[textSearchURL]))
      .catch(err => reject(err));
  }).then(placesData => {
    const placeId = placesData[0].place_id;
    const detailedSearchURL = `${detailedSearchBaseURL}&placeid=${placeId}`;

    fetch(detailedSearchURL)
      .then(response => response.json())
      .then(data => (cache[detailedSearchURL] = data.result))
      .then(_ => res.status(status.OK).send(cache[detailedSearchURL]))
      .catch(err => console.log(err));
  });
});

module.exports = router;
