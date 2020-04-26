const express = require('express')
const cors = require('cors')

const app = express()
const port = 8080

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4000");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.get('/', (req, res) => {
    res.send(getBooklet())
});

app.use(cors())
app.options('*', cors())
app.listen(port, () => console.log(`booklet listening for requests at http://localhost:${port}`))

function getBooklet() {
    let booklet = {}

    let acts = []
    let exAct = []
    let exScene = []
    let exPara = []
    let exSentence = "example lorem ipsum example lorem ipsum example lorem ipsum."
    
    //10 example sentence in paragraph
    for( let i=0; i<10; i++){
      exPara.push(i + " " + exSentence);
    }

    //5 example paragraph in scene
    for( let i=0; i<5; i++){
      exScene.push(exPara);
    }

    //6 example scenes in act
    for(let i=0; i<6; i++) {
      exAct.push(exScene);
    }

    //4 example acts in acts
    for( let i=0; i<4; i++) {
      acts.push(exAct);
    }

    booklet.acts = acts;
    booklet.title = 'Test Title'
    booklet.author = 'Behtoven'

    return booklet;
}