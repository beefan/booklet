const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8082;

const dao = require('./util/data-access-layer.js');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

/** 
 * GET A BOOKLET FROM THE MONGODB
 * RANDOM FOR NOW? 
 */
app.get('/api/v1/:id', (req, res) => {
  console.log('in server getter')
  console.log(req.params.id)
  // connect to mongodb client and send first booklet
  dao.getBookletById(req.params.id, res);
});

/**
 * POST A BOOKLET IN THE MONGODB
 */
app.post('/api/v1/save', (req, res) => {
  console.log('in server poster')
  console.log(req.body)
  dao.saveBooklet(req.body);
  res.status(201);
});

/**
 * LISTEN AT 8080
 */
app.listen(port, () => {
  console.log(`booklet listening for requests at http://localhost:${port}`);
});