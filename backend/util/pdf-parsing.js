// paths of PDFs used to insert example data. 
// const bookletPath = 'ex-booklets/goldman-individual-society-and-the-state.pdf'
const bookletPath = 'ex-booklets/psychedelic-miracle.pdf'

/**
 * 
 * @param {*} path 
 */
async function getBookletFromPDF() {
  const fs = require('fs');
  const pdf = require('pdf-parse');
  let dataBuffer = fs.readFileSync(bookletPath);

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

exports.getBookletFromPDF = getBookletFromPDF;