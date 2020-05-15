// MongoDB set up information
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const dbName = 'booklets';
const client = new MongoClient(url, { useUnifiedTopology: true });

// pdf processing
const pdfParser = require('./pdf-parsing')

/**
 * fetch an arbitrary booklet from 
 * mongodb
 * 
 * @param {*} id 
 * @param {*} res 
 */
const getBookletById = (id, res) => {
  console.log('got ID ' + id)
  client.connect(err => {
    const db = client.db(dbName);
    findBookletById(db, (docs) => {
      res.send(docs[1]);
      client.close();
    });
  })
}

function findBookletById(db, callback) {
  const collection = db.collection('documents');
  collection.find({}).toArray((err, docs) => {
    console.log("found the following records");
    console.log(docs)
    callback(docs);
  })
}

const saveBooklet = booklet => {
  client.connect(err => {
    const db = client.db(dbName);
    insertBooklet(booklet, db, () => client.close());
  });
} 

function insertBooklet(booklet, db, callback) {
  const collection = db.collection('documents');
  collection.insertOne(booklet, (err, res) => {
    console.log('inserted booklet by api');
    callback(res);
  })
}

const insertSampleData = () => {
  client.connect((err) => {
    const db = client.db(dbName);
    insertPDF(db, function() {
    client.close();
    });
  });
}

function insertPDF(db, callback) {
  const collection = db.collection('documents');
  pdfParser.getBookletFromPDF().then( booklet => {
    collection.insertOne(booklet, function(err,result){
      console.log("inserted booklet");
      callback(result);
    });
  });
}

exports.getBookletById = getBookletById;
exports.insertSampleData = insertSampleData;
exports.saveBooklet = saveBooklet;
