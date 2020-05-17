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

// doesn't actually search by Id yet
function findBookletById(db, callback) {
  const collection = db.collection('documents');
  collection.find({}).toArray((err, docs) => {
    callback(docs);
  })
}

const saveBooklet = (booklet, res) => {
  client.connect(err => {
    const db = client.db(dbName);
    insertBooklet(booklet, db, () => {
      res.status(201);
      client.close()
    });
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

function insertPDF(pdf, userId, db, callback) {
  const collection = db.collection('documents');
  pdfParser.getBookletFromPDF(pdf).then( booklet => {
    console.log(' insert pdf to ' + userId)
    // all I need to do to add userId???
    booklet.userId = userId;
    collection.insertOne(booklet, function(err,result){
      console.log("inserted booklet");
      callback(result);
    });
  });
}

const getLikesByUserId = (userId, res) => {
  client.connect(err => {
    const db = client.db(dbName);
    findLikesByUser(userId, db, (docs) => {
      res.send(docs);
      client.close();
    });
  });
}

function findLikesByUser(userId, db, callback) {
    const collection = db.collection('documents');
    console.log('getting likes by userId ' + userId)
    // implement logic to find all booklets liked by 
    // certain userId
    // right now data is not set up to include likes
    // user login // account has yet to be set up
    // for now, just return all booklets
    collection.find({}).toArray((err, docs) => {
      callback(docs);
    })
}

const getBookletsByUserId = (userId, res) => {
  client.connect(err => {
    const db = client.db(dbName);
    findBookletsByUserId(userId, db, (docs) => {
      res.send(docs);
      client.close();
    });
  });
}

function findBookletsByUserId(userId, db, callback) {
  const collection = db.collection('documents');
  console.log('getting booklets by userId ' + userId)
  // implement logic to find all booklets by 
  // certain userId
  // right now data is not set up to include likes
  // user login // account has yet to be set up
  // for now, just return all booklets
  collection.find({}).toArray((err, docs) => {
    callback(docs);
  })
}

const savePdfAsBooklet = (pdf, userId, res) => {
  client.connect(err => {
    const db = client.db(dbName);
    insertPDF(pdf, userId, db, (docs) => {
      res.status(201);
      client.close();
    });
  });
}

exports.getBookletById = getBookletById;
exports.insertSampleData = insertSampleData;
exports.saveBooklet = saveBooklet;
exports.getLikesByUserId = getLikesByUserId;
exports.getBookletByUserId = getBookletsByUserId;
exports.savePdfAsBooklet = savePdfAsBooklet;