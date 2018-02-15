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
const textSearchURL = config.gMap.textSearchURL;
const detailSearchURL = config.gMap.detailSearchURL;

const server = express();
server.use(bodyParser.json());

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ DATA ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
let places = [];
let placesDetailed = [];
const cache = {};

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* METHODS ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
const detailFetch = placeId => {
  console.log(placeId);
  fetch(`${detailSearchURL}/${output}?placeid=${placeId}&key=${key}`)
    .then(response => response.json())
    .then(
      data =>
        data.status === 'OK' ? place.push(data.result) : console.log(data),
    )
    .catch(err => console.log(err));
};

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* SCRIPTS *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* SERVER ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
server.get('/place', (req, res) => {
  const q = req.query.query;

  if (cache[q] !== undefined) {
    res.status(STATUS.OK).send(cache[q][0]);
    return;
  }

  fetch(`${textSearchURL}/${output}?query=${q}&key=${key}`)
    .then(response => response.json())
    .then(data => {
      cache[q] = data.results;
      res.status(STATUS.OK).send(data.results[0]);
    })
    .catch(err => console.error(err));
});

server.get('/places', (req, res) => {
  const q = req.query.query;

  if (cache[q] !== undefined) {
    res.status(STATUS.OK).send(cache[q]);
    return;
  }

  fetch(`${textSearchURL}/${output}?query=${q}&key=${key}`)
    .then(response => response.json())
    .then(data => (cache[q] = data))
    .catch(err => console.error(err));
});

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* LISTEN ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
server.listen(3000);

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* END *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
