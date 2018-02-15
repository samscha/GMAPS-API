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

// server.post('/places', (req, res) => {
//   const q = req.body.query;

//   if (!q) {
//     res.status(STATUS.USER_ERROR).send({ err: 'no query specified in body' });
//     return;
//   }

//   fetch(`${textSearchURL}/${output}?query=${q}&key=${key}`)
//     .then(response => response.json())
//     .then(data => {
//       places = [...data.results];
//       places.forEach(place => {
//         fetch(
//           `${detailSearchURL}/${output}?placeid=${place.place_id}&key=${key}`,
//         )
//           .then(response => response.json())
//           .then(data => placesDetailed.push(data.result))
//           .catch(err => console.error(err));
//       });
//     })
//     .then(_ => writeToFile())
//     .then(_ => res.status(STATUS.OK).send('Search successful.'))
//     .catch(err => console.error(err));
// });

// server.delete('/places', (req, res) => {
//   places = [];
//   writeToFile();
//   res.status(STATUS.OK).send('Delete successful.');
// });

// // server.get('/place', (req, res) => {
// //   res.status(STATUS.OK).send(
// //     placesDetailed.map(place => {
// //       return `open now: ${place.opening_hours.open_now} - ${
// //         place.name
// //       } - address: ${place.formatted_address}`;
// //     }),
// //   );
// // });

// server.post('/place', (req, res) => {
//   places.forEach(placeObject => {
//     fetch(
//       `${detailSearchURL}/${output}?placeid=${placeObject.place_id}&key=${key}`,
//     )
//       .then(response => response.json())
//       .then(data =>
//         data.results.forEach(
//           placeDetailed =>
//             placeDetailed.filter(
//               placeCheck =>
//                 placeCheck.formatted_address ===
//                 placeDetailed.formatted_address,
//             ).length > 0
//               ? null
//               : place.push(placeDetailed),
//         ),
//       )
//       .then(_ => writeToFile())
//       .then(_ =>
//         res.status(STATUS.OK).send('Places details added succesfully.'),
//       )
//       .catch(err => console.log(err));
//   });
// });

// server.delete('/place', (req, res) => {
//   placesDetailed = [];
//   writeToFile();
//   res.status(STATUS.OK).send('Delete successful.');
// });

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* LISTEN ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
server.listen(3000);

/* ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* END *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
