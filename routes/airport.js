const express = require('express');
const fetch = require('node-fetch');
const config = require('../config.js');

const router = express.Router();

const status = config.STATUS;
const key = config.gMap.key;
const output = config.OUTPUT_TYPE;
const baseURL = config.gMap.baseURL;
const textSearchBaseURL = `${baseURL}/textsearch/${output}?key=${key}`;
const detailedSearchBaseURL = `${baseURL}/details/${output}?key=${key}`;

router.get('/', (req, res) => {
  const q = req.query.query;
  const textSearchURL = `${textSearchBaseURL}&type=airport&query=${q}`;

  new Promise((resolve, reject) => {
    fetch(textSearchURL)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  }).then(placesData => {
    const placeId = placesData.results[0].place_id;
    const detailedSearchURL = `${detailedSearchBaseURL}&placeid=${placeId}`;

    fetch(detailedSearchURL)
      .then(response => response.json())
      .then(data => res.status(status.OK).send(data.result))
      .catch(err => console.log(err));
  });
});

module.exports = router;
