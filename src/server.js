/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* IMPORTS ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
const config = require('../config.js');

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ CONSTANTS *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
const STATUS = config.STATUS;

const port = config.port;

const key = config.gMap.key;
const output = config.OUTPUT_TYPE;
const baseURL = config.gMap.baseURL;
const textSearchBaseURL = `${baseURL}/textsearch/${output}?key=${key}`;
const detailedSearchBaseURL = `${baseURL}/details/${output}?key=${key}`;

const server = express();
server.use(bodyParser.json());

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ CACHE *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
const cache = {};

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* METHODS ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
const fetchData = (URL, res) => {
  return fetch(`${URL}`)
    .then(response => response.json())
    .then(
      data =>
        data.results ? (cache[URL] = data.results) : (cache[URL] = data.result),
    )
    .then(_ => (res ? res.status(STATUS.OK).send(cache[URL]) : null))
    .catch(err => console.log(err));
};

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* SCRIPTS *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
// none

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* SERVER ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
server.get('/places', (req, res) => {
  const q = req.query.query.split(' ').join('+');
  const TEXTSEARCH_URL = `${textSearchBaseURL}&query=${q}`;

  if (cache[TEXTSEARCH_URL] !== undefined) {
    res.status(STATUS.OK).send(cache[TEXTSEARCH_URL]);
    return;
  }

  fetchData(TEXTSEARCH_URL, res);
});

server.get('/place', (req, res) => {
  const q = req.query.query.split(' ').join('+');
  const TEXTSEARCH_URL = `${textSearchBaseURL}&query=${q}`;

  if (cache[TEXTSEARCH_URL] !== undefined) {
    const placeId = cache[TEXTSEARCH_URL][0].place_id;
    const DETAILS_URL = `${detailedSearchBaseURL}&placeid=${placeId}`;

    if (cache[DETAILS_URL] !== undefined) {
      res.status(STATUS.OK).send(cache[DETAILS_URL]);
      return;
    }

    fetchData(DETAILS_URL, res);
    return;
  }

  fetchData(TEXTSEARCH_URL).then(_ => {
    const placeId = cache[TEXTSEARCH_URL][0].place_id;
    const DETAILS_URL = `${detailedSearchBaseURL}&placeid=${placeId}`;

    fetchData(DETAILS_URL, res);
    return;
  });
});

server.get('/airports', (req, res) => {
  const q = req.query.query.split(' ').join('+');
  const TEXTSEARCH_URL = `${textSearchBaseURL}&query=${q}&type=airport`;

  if (cache[TEXTSEARCH_URL]) {
    res.status(STATUS.OK).send(cache[TEXTSEARCH_URL]);
    return;
  }

  fetchData(TEXTSEARCH_URL, res);
});

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* LISTEN ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
server.listen(3000);

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* END *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
