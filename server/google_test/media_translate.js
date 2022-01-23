// Allow user input from terminal
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function doTranslationLoop() {
  rl.question("Press any key to translate or 'q' to quit: ", answer => {
    if (answer.toLowerCase() === 'q') {
      rl.close();
    } else {
      translateFromMicrophone();
    }
  });
}

// Node-Record-lpcm16
const recorder = require('node-record-lpcm16');

// Imports the Cloud Media Translation client library
const {
  SpeechTranslationServiceClient,
} = require('@google-cloud/media-translation');

// Creates a client
var credentials = JSON.parse(fs.readFileSync(path.join(__dirname,'service.json')));
const client = new SpeechTranslationServiceClient({
    // optional auth parameters.
    credentials: credentials
});

function translateFromMicrophone() {
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const encoding = 'linear16';
  const sampleRateHertz = 16000;
  const sourceLanguage = 'en-US';
  const targetLanguage = 'en-US';
  console.log('Begin speaking ...');

  const config = {
    audioConfig: {
      audioEncoding: encoding,
      sourceLanguageCode: sourceLanguage,
      // targetLanguageCode: targetLanguage,
    },
    // singleUtterance: true,
  };

  // First request needs to have only a streaming config, no data.
  const initialRequest = {
    streamingConfig: config,
    audioContent: null,
  };

  let currentTranslation = '';
  let currentRecognition = '';
  // Create a recognize stream
  const stream = client
    .streamingTranslateSpeech()
    .on('error', e => {
      if (e.code && e.code === 4) {
        console.log('Streaming translation reached its deadline.');
      } else {
          console.log("ouf")
        console.log(e);
      }
    })
    .on('data', response => {
      const {result, speechEventType} = response;
      if (speechEventType === 'END_OF_SINGLE_UTTERANCE') {
        console.log(`\nFinal translation: ${currentTranslation}`);
        console.log(`Final recognition result: ${currentRecognition}`);

        stream.destroy();
        recording.stop();
      } else {
        currentTranslation = result.textTranslationResult.translation;
        currentRecognition = result.recognitionResult;
        console.log(`\nPartial translation: ${currentTranslation}`);
        console.log(`Partial recognition result: ${currentRecognition}`);
      }
    });

console.log("tes")

  let isFirst = true;
  // Start recording and send microphone input to the Media Translation API
  const recording = recorder.record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0, //silence threshold
    recordProgram: 'rec',
    silence: '5.0', //seconds of silence before ending
  });
  recording
    .stream()
    .on('data', chunk => {

        // console.log(chunk.toString('base64'))
      if (isFirst) {
        stream.write(initialRequest);
        isFirst = false;
      }
      const request = {
        streamingConfig: config,
        audioContent: chunk.toString('base64'),
      };
      if (!stream.destroyed) {
        stream.write(request);
      }
    })
    .on('close', () => {
      doTranslationLoop();
    });
}

doTranslationLoop();