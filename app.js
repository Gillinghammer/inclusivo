const express = require('express');
var path = require('path');
var busboy = require('connect-busboy');
let speechTools = require('./speech-to-text.js');
let nluTools = require('./nlu.js');
let moderatorTools = require('./moderator.js');
var logger = require('morgan');
var bodyParser = require('body-parser');
let nlu = nluTools.nluAnalysis;
let transcribe = speechTools.transcribeAudio;
var fs = require('fs-extra');
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

app.get('/', async (req, res) => {
  try {
    let transciption = await transcribe();
    console.log(transciption);
    let nluResult = await nlu(transciption);
    console.log(nluResult);
    let moderationResult = await moderatorTools.moderator(transciption);
    console.log(moderationResult);
    res.send({ transciption, nluResult, moderationResult });
  } catch (err) {
    console.log(err); // TypeError: failed to fetch
  }
});

app.get('/transcribe/:fileName', async (req, res, next) => {
  let transciption = await transcribe(req.params.fileName);
  console.log(transciption);
  res.send('transcribing in process');
});

app.get('/nlu/:fileName', async (req, res, next) => {
  try {
    let text = fs.readFileSync(
      __dirname + '/public/transcripts/' + req.params.fileName + '.txt',
      'utf8'
    );
    let nluResult = await nlu(text);
    console.log(nluResult);
    res.send(nluResult);
  } catch (err) {
    console.log(err);
  }
});

app.get('/moderator/:fileName', async (req, res, next) => {
  try {
    let text = fs.readFileSync(
      __dirname + '/public/transcripts/' + req.params.fileName + '.txt',
      'utf8'
    );
    let moderationResult = await moderatorTools.moderator(text);
    res.send(moderationResult);
  } catch (err) {
    console.log(err);
  }
});

app.post('/', (req, res, next) => {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', async function(fieldname, file, filename) {
    console.log('Uploading: ' + filename);
    //Path where image will be uploaded
    fstream = fs.createWriteStream(__dirname + '/public/uploads/' + filename);
    res.send('file accepted');
    file.pipe(fstream);
    fstream.on('close', function() {
      console.log('Upload Finished of ' + filename);
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
