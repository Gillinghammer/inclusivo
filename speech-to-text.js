'use strict';
require('dotenv').config({ silent: true }); // optional, handy for local development
var SpeechToText = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');
const SPEECH_TO_TEXT_APIKEY = 'HdjeD-M166Fh62W6o74yyYhpoLjJmZUwbHc2RVafyWQb';
const SPEECH_TO_TEXT_URL =
  'https://api.us-east.speech-to-text.watson.cloud.ibm.com/instances/a720c4ee-b553-477c-8bcb-5208aa8896e4';

const speechToText = new SpeechToText({
  authenticator: new IamAuthenticator({
    apikey: SPEECH_TO_TEXT_APIKEY
  }),
  url: SPEECH_TO_TEXT_URL,
  disableSslVerification: true
});

function formatTranscript(results) {
  let transcription = '';
  results.forEach(result => {
    transcription += result.alternatives[0].transcript + ' ';
  });
  return transcription;
}

function saveTranscript(text, filename) {
  fs.writeFile(
    __dirname + '/public/transcripts/' + filename + '.txt',
    text,
    function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    }
  );
  return true;
}

function transcribeAudio(fileName) {
  return new Promise(async (resolve, reject) => {
    const params = {
      audio: fs.createReadStream(__dirname + '/public/uploads/' + fileName),
      contentType: 'audio/mp3',
      speakerLabels: true,
      audioMetrics: false,
      objectMode: false,
      interimResults: false
    };
    console.log('\n Transcribing audio now... \n');
    try {
      let { result } = await speechToText.recognize(params);
      let formattedTranscript = formatTranscript(result.results);
      saveTranscript(formattedTranscript, fileName);
      resolve(formattedTranscript);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  transcribeAudio: transcribeAudio
};
