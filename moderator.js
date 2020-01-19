'use strict';
var unirest = require('unirest');
var req = unirest(
  'POST',
  'https://ai-powered-content-moderator.p.rapidapi.com/text'
);

req.headers({
  'x-rapidapi-host': 'ai-powered-content-moderator.p.rapidapi.com',
  'x-rapidapi-key': 'dSpK8su5COmshgWk0J0FPBicbQr0p1P6X6Tjsn4vJux3nOpaud',
  'content-type': 'application/x-www-form-urlencoded'
});

function moderator(text) {
  return new Promise((resolve, reject) => {
    console.log('\n Moderator... \n');
    req.form({
      translate: 'es',
      text
    });

    req.end(function(res) {
      if (res.error) reject(new Error(res.error));
      console.log(res.body);
      resolve(res.body);
    });
  });
}

module.exports = {
  moderator: moderator
};
