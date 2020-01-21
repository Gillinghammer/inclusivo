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
//Import the mongoose module
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://admin:r0adst3r@ds211269.mlab.com:11269/inclusivo';
var TranscriptionModel = require('./models/Transcription');
var Transcription = TranscriptionModel.Transcription;
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
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
  let fileName = req.params.fileName;
  let transciption = await transcribe(fileName);
  console.log(transciption);
  let t = new Transcription({
    text: transciption,
    name: fileName
      .split('.')
      .slice(0, -1)
      .join('.')
  });
  t.save();
  res.send(t);
});

app.get('/transcribe/list', async (req, res, next) => {
  console.log('hello ', Transcription);
  let list = await Transcription.find({});
  res.send('list');
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
