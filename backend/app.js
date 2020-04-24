const express = require('express')
const cors = require('cors')

const app = express()
const port = 8080

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4001");
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
    let act1 = []

    let scene1 = "example lorem ipsum example lorem ipsum example lorem ipsum. example lorem ipsum example lorem ipsum example lorem ipsum."
    let scene2 = "example lorem ipsum example lorem ipsum example lorem ipsum. example lorem ipsum example lorem ipsum example lorem ipsum."
    let scene3 = "example lorem ipsum example lorem ipsum example lorem ipsum. example lorem ipsum example lorem ipsum example lorem ipsum."
    
    act1.push(scene1)
    act1.push(scene2)
    act1.push(scene3)

    acts.push(act1)
    acts.push(act1)
    acts.push(act1)

    booklet.acts = []
    booklet.acts.push(acts)

    booklet.title = 'Test Title'
    booklet.author = 'Behtoven'

    return booklet;
}