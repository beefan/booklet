const express = require('express')
const cors = require('cors')

const app = express()
const port = 8080
const bookletPath = 'ex-booklets/goldman-individual-society-and-the-state.pdf'
//const bookletPath = 'ex-booklets/psychedelic-miracle.pdf'

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
  getBookletFromPDF(bookletPath).then( booklet => res.send(booklet));
});

app.use(cors())
app.options('*', cors())
app.listen(port, () => {
  console.log(`booklet listening for requests at http://localhost:${port}`);
});

function getBooklet() {
  let booklet = {}

  let acts = []
  let exAct = []
  let exScene = []
  let exPara = []
  let exSentence = "example lorem ipsum example lorem ipsum example lorem ipsum."

  //10 example sentence in paragraph
  for (let i = 0; i < 10; i++) {
    exPara.push(i + " " + exSentence);
  }

  //5 example paragraph in scene
  for (let i = 0; i < 5; i++) {
    exScene.push(exPara);
  }

  //6 example scenes in act
  for (let i = 0; i < 6; i++) {
    exAct.push(exScene);
  }

  //4 example acts in acts
  for (let i = 0; i < 4; i++) {
    acts.push(exAct);
  }

  booklet.acts = acts;
  booklet.title = 'Test Title'
  booklet.author = 'Behtoven'

  return booklet;
}

async function getBookletFromPDF(path) {
  const fs = require('fs');
  const pdf = require('pdf-parse');
  let dataBuffer = fs.readFileSync(path);

  return pdf(dataBuffer).then(data => {
    return createBookletFromPDFData(data)
  });
}

function createBookletFromPDFData(data) {
  let booklet = {}
  booklet.id = 123;
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
  // paragraphs = paragraphs.map( p => {
  //   return p.split(/(?<=(?<!p.m|a.m|Dr|Mr|Mrs)[.?!"] )/);
  // });

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