const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const formidable = require('formidable')
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
  console.log('get booklet ' + req.params.id)
  dao.getBookletById(req.params.id, res);
});

/**
 * POST A BOOKLET IN THE MONGODB
 */
app.post('/api/v1/save', (req, res) => {
  console.log('post booklet')
  dao.saveBooklet(req.body, res);
});

/**
 * GET LIKES BY USER ID
 */
app.get('/api/v1/likes/:userId', (req, res) => {
  console.log('get likes for user ' + req.params.userId)
  dao.getLikesByUserId(req.params.userId, res);
});

/**
 * GET BOOKLETS BY USER ID
 */
app.get('api/v1/all/:userId', (req, res) => {
  console.log('get booklets by user ' + req.params.userId)
  dao.getBookletsByUserId(req.params.userId, res);
});

/** 
 * UPLOAD USER PDF AS BOOKLET 
 */
app.post('api/v1/pdf/:userId', (req, res) => {
  console.log('upload booklet as pdf')
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    console.log('Fields', fields)
    console.log('Files', files)
    for (const pdf of Object.entries(files)) {
      console.log('this is a saving of a pdf')
      // save a pdf 
      dao.savePdfAsBooklet(pdf, req.params.userId, res);    }
  })

  
})

/**
 * LISTEN AT 8080
 */
app.listen(port, () => {
  console.log(`booklet listening for requests at http://localhost:${port}`);
});