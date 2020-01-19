const express = require('express');
let speechTools = require('./speech-to-text.js');
let nluTools = require('./nlu.js');
let moderatorTools = require('./moderator.js');
let nlu = nluTools.nluAnalysis;
let transcribe = speechTools.transcribeAudio;
const app = express();
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
