'use strict';

const express = require('express')
const PORT = process.env.PORT || 5000;
const app = express();
const myParser = require("body-parser");
const cors = require('cors');

var corsOptions = {
  origin: 'null',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
// app.use(express.static(__dirname));


// Home page route.
app.get('/', function (req, res) {
  res.send('App home page');
});

// define what happens when user calls this specific path
app.route('https://abroadvote.herokuapp.com/query/:text').get((req, res, next) => {
  const requestedText = req.params['text'];
  let result = runSample(requestedText);
  result.then(function(value) {
    res.send(value);
  });
});

app.use(myParser.json({extended : true}));
app.post('https://abroadvote.herokuapp.com/query/:text', (req, res, next) => {
  const requestedText = req.params['text'];
  let body = req.body;
  let result = runSampleContext(requestedText, body);
  result.then(function(value) {
    res.send(value);
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//GOOGLE_APPLICATION_CREDENTIALS

async function runSample(textString) {
  const uuid = require('uuid');
  const dialogflow = require('dialogflow');
  const sessionId = uuid.v4();
  const projectId = 'overseas-vote';

  var config = {
    projectId: 'overseas-vote',
    keyFilename: '/Users/rebeccasanders/Desktop/ChatbotFiles/googlePrivateKey.json'
  };
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(config);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: textString,
        languageCode: 'en-US',
      },
    },
  };
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  // console.log(`  Query: ${result.queryText}`);
  // console.log(`  Response: ${result.fulfillmentText}`);
  // if (result.intent) {
  //   console.log(`  Intent: ${result.intent.displayName}`);
  // } else {
  //   console.log(`No intent matched.`);
  // }
  return result;
}

async function runSampleContext(textString, body) {
  const uuid = require('uuid');
  const dialogflow = require('dialogflow');
  const sessionId = uuid.v4();
  const projectId = 'overseas-vote';

  var config = {
    projectId: 'overseas-vote',
    keyFilename: '/Users/rebeccasanders/Desktop/ChatbotFiles/googlePrivateKey.json'
  };

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient(config);
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: textString,
        languageCode: 'en-US',
      },
    },
  };

  request.queryParams = {
    contexts: body,
  };

  const responses = await sessionClient.detectIntent(request);

  const result = responses[0].queryResult;
  console.log(result);
  console.log(`  Response: ${result.fulfillmentText}`);
  // console.log(`  Query: ${result.queryText}`);
  // console.log('Output contexts: ${result.outputContexts}')
  
  
  // if (result.intent) {
  //   console.log(`  Intent: ${result.intent.displayName}`);
  // } else {
  //   console.log(`No intent matched.`);
  // }
  return result;
}