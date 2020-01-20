'use strict';
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const NLU_APIKEY = 'BCFT8F9VncIGFhZqKWujkISu5HyWjSah4wZbv-ZxA7cp';
const NLU_URL =
  'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/f6963fcd-d251-45fa-89a4-cdf7a5f41e6b';

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: NLU_APIKEY
  }),
  url: NLU_URL
});

const analyzeParams = {
  url: 'www.ibm.com',
  features: {
    categories: {
      limit: 3
    }
  }
};

function nluAnalysis() {
  return new Promise(async (resolve, reject) => {
    console.log('\n Natural Language Understanding Processing... \n');
    try {
      let nluResult = await naturalLanguageUnderstanding.analyze(analyzeParams);
      console.log(JSON.stringify(nluResult, null, 2));
      resolve(nluResult.result);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  nluAnalysis: nluAnalysis
};
