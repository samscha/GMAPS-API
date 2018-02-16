const express = require('express');
const fetch = require('node-fetch');
const config = require('../config.js');

const router = express.Router();

const status = config.STATUS;
const key = config.gMap.key;
const output = config.OUTPUT_TYPE;
const baseURL = config.gMap.baseURL;
const textSearchBaseURL = `${baseURL}/textsearch/${output}?key=${key}`;

router.get('/', (req, res) => {
  const q = req.query.query;
  const textSearchURL = `${textSearchBaseURL}&type=airport&query=${q}`;

  fetch(textSearchURL)
    .then(response => response.json())
    .then(data => res.status(status.OK).send(data.results))
    .catch(err => console.log(err));
});

module.exports = router;
