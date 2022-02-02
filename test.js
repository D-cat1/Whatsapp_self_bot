const mem = require('meme-maker')

let memeMaker = require('meme-maker')

let options = {
  image: 'a.webp',         // Required
  outfile: 'as.png',  // Required
  topText: 'nagis',            // Required
  bottomText: 'karna gadisuruh senyum sama ayang',           // Optional
  font: 'impact.ttf',      // Optional
  fontSize: 37,                   // Optional
  fontFill: '#FFF',               // Optional
  textPos: 'center',              // Optional
  strokeColor: '#000',            // Optional
  strokeWeight: 1.5                 // Optional
}

mem(options, function(err) {
  console.log('Image saved: ' + options.outfile)
});
