'use strict';
require('dotenv').config({ silent: true }); // optional, handy for local development
var SpeechToText = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
var LineIn = require('line-in'); // the `mic` package also works - it's more flexible but requires a bit more setup
var wav = require('wav');
const SPEECH_TO_TEXT_APIKEY = 'HdjeD-M166Fh62W6o74yyYhpoLjJmZUwbHc2RVafyWQb';
const SPEECH_TO_TEXT_URL =
  'https://api.us-east.speech-to-text.watson.cloud.ibm.com/instances/a720c4ee-b553-477c-8bcb-5208aa8896e4';

const speechToText = new SpeechToText({
  authenticator: new IamAuthenticator({
    apikey: SPEECH_TO_TEXT_APIKEY
  }),
  url: SPEECH_TO_TEXT_URL
});

var lineIn = new LineIn(); // 2-channel 16-bit little-endian signed integer pcm encoded audio @ 44100 Hz

var wavStream = new wav.Writer({
  sampleRate: 44100,
  channels: 2
});

var recognizeStream = speechToText.recognizeUsingWebSocket({
  contentType: 'audio/wav',
  interimResults: true
});

lineIn.pipe(wavStream);

wavStream.pipe(recognizeStream);

recognizeStream.pipe(process.stdout);
