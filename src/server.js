const bodyParser = require('body-parser');
const express = require('express');

const config = require('../config.js');

const STATUS = config.STATUS;
const port = config.port;
const key = config.gMap.key;

const server = express();
server.use(bodyParser.json());

const places = [];

server.get('/places', (req, res) => {
  res.status(STATUS.OK).send({ places });
});

server.post('/places', (req, res) => {
  const q = req.body.query;

  if (q) {
    res.status(STATUS.OK).send({ query: q });
    return;
  }
  res.status(STATUS.USER_ERROR).send({ err: 'no query specified in body' });
});

server.listen(3000);
