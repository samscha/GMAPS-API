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

router.get('/', (req, res) => {
  const q = req.query.query;
  const textSearchURL = `${textSearchBaseURL}&query=${q}`;

  if (cache[textSearchURL]) {
    res.status(status.OK).send(cache[textSearchURL]);
    return;
  }

  fetch(textSearchURL)
    .then(response => response.json())
    .then(data => (cache[textSearchURL] = data.results))
    .then(_ => res.status(status.OK).send(cache[textSearchURL]))
    .catch(err => console.log(err));
});

module.exports = router;
