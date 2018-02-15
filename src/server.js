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
const textSearchURL = config.gMap.textSearchURL;
const detailSearchURL = config.gMap.detailSearchURL;

let places = [];
let place = [];

const writeToFile = _ => {
  fs.writeFileSync('places.txt', JSON.stringify({ places }), 'utf8');
};

const loadFile = _ => {
  places = JSON.parse(fs.readFileSync('places.txt', 'utf8')).places;
};

loadFile();

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* SERVER CALLS ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
server.get('/places', (req, res) => {
  res.status(STATUS.OK).send(
    places.map(place => {
      return `${place.name}: ${place.formatted_address}`;
    }),
  );
});

server.get('/place', (req, res) => {
  fetch(`${detailSearchURL}/${output}?placeid=${places[0].place_id}&key=${key}`)
    .then(response => response.json())
    .then(
      data =>
        data.status === 'OK'
          ? res.status(STATUS.OK).send(data.result.opening_hours)
          : res.status(STATUS.USER_ERROR).send(),
    )
    .catch(err => console.log(err));
});

server.post('/places', (req, res) => {
  const q = req.body.query;

  if (!q) {
    res.status(STATUS.USER_ERROR).send({ err: 'no query specified in body' });
    return;
  }

  fetch(`${textSearchURL}/${output}?query=${q}&key=${key}`, {
    method: 'GET',
    headers: {},
    body: null,
    redirect: 'follow',
  })
    .then(response => response.json())
    .then(data => {
      data.results.forEach(
        place =>
          places.filter(
            placeCheck =>
              placeCheck.formatted_address === place.formatted_address,
          ).length > 0
            ? null
            : places.push(place),
      );
      writeToFile();
    })
    .then(res.status(STATUS.OK).send('Search successful.'))
    .catch(err => console.error(err));
});

server.listen(3000);
