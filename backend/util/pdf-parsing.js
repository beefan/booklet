/**
 * 
 * @param {*} path 
 */
function getBookletFromPDF(pdf, userId) {
  const fs = require('fs');
  const pdfParser = require('pdf-parse');
  const dataBuffer = fs.readFileSync(pdf.path);
  
  return pdfParser(dataBuffer).then(data => {
    return createBookletFromPDFData(data, userId)
  });
}

/**
 * 
 * @param {*} data 
 */
function createBookletFromPDFData(data, userId) {
  let booklet = {}
  booklet.title = data.info.Title;
  booklet.author = data.info.Author;
  booklet.userId = userId;
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
      title: paragraphs[i].substring(0, 15),
      body: paragraphs[i],
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