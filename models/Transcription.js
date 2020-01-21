//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var TranscriptionSchema = new Schema({
  text: String,
  name: String
});

const Transcription = mongoose.model('Transcription', TranscriptionSchema);
module.exports = { Transcription };
