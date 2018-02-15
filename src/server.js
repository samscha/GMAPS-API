const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');

const config = require('../config.js');

const STATUS = config.STATUS;
const port = config.port;

const server = express();
server.use(bodyParser.json());

const key = config.gMap.key;
const output = config.OUTPUT_TYPE;
const URL = config.gMap.baseURL;

let places = [];

const writeToFile = _ => {
  fs.writeFileSync('places.txt', JSON.stringify({ places }), 'utf8');
};

const loadFile = _ => {
  places = JSON.parse(fs.readFileSync('places.txt', 'utf8')).places;
};

loadFile();

server.get('/places', (req, res) => {
  console.log(places);
  res.status(STATUS.OK).send(
    places.map(place => {
      return `${place.name}: ${place.formatted_address}`;
    }),
  );
});

server.post('/places', (req, res) => {
  const q = req.body.query;
  const type = req.body.type;
  const city = req.body.city;

  if (!q) {
    res.status(STATUS.USER_ERROR).send({ err: 'no query specified in body' });
    return;
  }

  fetch(`${URL}/${output}?query=${q}&key=${key}`, {
    method: 'GET',
    headers: {},
    body: null,
    redirect: 'follow',
  })
    .then(response => response.json())
    .then(data => data.results.forEach(place => places.push(place)))
    .then(writeToFile())
    .catch(err => console.error(err));

  res.status(STATUS.OK).send('ok');
});

server.listen(3000);
