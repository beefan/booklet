const express = require('express')
const cors = require('cors')

// MongoDB set up information
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017";
const dbName = 'booklets';
const client = new MongoClient(url, { useUnifiedTopology: true });

const app = express()
const port = 8080
//const bookletPath = 'ex-booklets/goldman-individual-society-and-the-state.pdf'
const bookletPath = 'ex-booklets/psychedelic-miracle.pdf'

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get('/', (req, res) => {
  // connect to mongodb client and send first booklet
  client.connect(err => {
    console.log('successfully connected via ext api call')
    const db = client.db(dbName);
    findBookletById(db, (docs) => {
      res.send(docs[1]);
      client.close();
    });
  })
});

app.use(cors())
app.options('*', cors())
app.listen(port, () => {
  console.log(`booklet listening for requests at http://localhost:${port}`);
});

function findBookletById(db, callback) {
  const collection = db.collection('documents');
  collection.find({}).toArray((err, docs) => {
    console.log("found the following records");
    console.log(docs)
    callback(docs);
  })
}
/*****************************************
 * ******** insert pdf as booklet ********
 * ***************************************
 */
// client.connect((err) => {
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   insertPDF(db, function() {
//     client.close();
//   });
// });

/**
 * 
 * @param {*} db 
 * @param {*} callback 
 */
function insertPDF(db, callback) {
  const collection = db.collection('documents');
  getBookletFromPDF(bookletPath).then( booklet => {
    collection.insertOne(booklet, function(err,result){
      console.log("inserted booklet");
      callback(result);
    });
  });
}
/**
 * 
 * @param {*} path 
 */
async function getBookletFromPDF(path) {
  const fs = require('fs');
  const pdf = require('pdf-parse');
  let dataBuffer = fs.readFileSync(path);

  return pdf(dataBuffer).then(data => {
    return createBookletFromPDFData(data)
  });
}
/**
 * 
 * @param {*} data 
 */
function createBookletFromPDFData(data) {
  let booklet = {}
  booklet.title = data.info.Title;
  booklet.author = data.info.Author;
  let scenes = [];
  let textArr = data.text.split("\n");
  const punc = '."!?'
  const pMarker = "pxxx-xxx"

  //filter out page numbers/ pdf artifacts 
  textArr = textArr.filter(line => {
    //if the first character of a new line is a number, 
    //or an empty string, don't include it
    return !(/\d/.test(line.substring(0, 1)) || (line === '' || line === ' '));
  });
  
  //find paragraphs
  //line is shorter than one before or after it and ends in punctuation. 
  textArr.forEach((line, index) => {
    if (punc.includes(line.substring(line.length - 1)) && (line.length < textArr[index - 1].length || line.length < textArr[index + 1].length)) {
      textArr.splice(index + 1, 0, pMarker);
    }
  });

  //split paragraphs into sentence arrays
  paragraphs = textArr.join(' ').split(pMarker);

  //put paragraphs into scenes
  for (let i = 0; i < paragraphs.length; i++) {
    const scene =  {
      title: paragraphs[i].substring(0, 9),
      text: paragraphs[i],
      format: {
        color: '',
        hltColor: '',
        bgColor: '',
        speed: ''
      }
    }
    scenes.push(scene);
  }

  booklet.scenes = scenes;

  return booklet;
}