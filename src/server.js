/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* IMPORTS ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
const config = require('../config.js');

const places = require('../routes/places');
const place = require('../routes/place');
const airports = require('../routes/airports');
const airport = require('../routes/airport');

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
server.use('/places', places);
server.use('/place', place);
server.use('/airports', airports);
server.use('/airport', airport);

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ CACHE *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
const cache = {};

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* LISTEN ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
server.listen(port);

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* END *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
