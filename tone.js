'use strict';
require('dotenv').config({ silent: true }); // optional, handy for local development
var SpeechToText = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');
const TONE_APIKEY = 'vWQVgdj1wSN5PWr6XjPdCwaawWJe11C3tWKvmAyiXiay';
const TONE_URL =
  'https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/8f726794-7ad4-4963-8530-6b62787792d3';

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2020-01-19',
  authenticator: new IamAuthenticator({
    apikey: TONE_APIKEY
  }),
  url: TONE_URL
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
