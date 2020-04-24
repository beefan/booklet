const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send(getBooklet())
});

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