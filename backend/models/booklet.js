const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const Booklet = new Schema({
  userId: mongoose.Types.ObjectId,
  title: String,
  author: String,
  scenes: [{ title: String, 
             body: String, 
             format: {
                color: String, 
                hltColor: String, 
                bgColor: String, 
                speed: String
              }
          }],
likes: [ mongoose.Types.ObjectId ]
})

module.exports = mongoose.model('Booklet', Booklet);