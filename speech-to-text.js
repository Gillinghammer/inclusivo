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

const params = {
  // From file
  audio: fs.createReadStream('./resources/meeting.mp3'),
  contentType: 'audio/mp3',
  speakerLabels: true,
  audioMetrics: false,
  objectMode: false,
  interimResults: false
};

function transcribeAudio() {
  return new Promise((resolve, reject) => {
    console.log('\n Transcribing audio now... \n');
    speechToText
      .recognize(params)
      .then(response => {
        // console.log(JSON.stringify(response.result, null, 2));
        let results = response.result.results;
        let transcription = '';
        results.forEach(result => {
          // console.log('result', result);
          console.log(JSON.stringify(result, null, 2));
          transcription += result.alternatives[0].transcript + ' ';
        });
        resolve(transcription);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

module.exports = {
  transcribeAudio: transcribeAudio
};
