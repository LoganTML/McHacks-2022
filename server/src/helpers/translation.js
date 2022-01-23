const fs = require('fs');
const path = require('path');
const { SpeechTranslationServiceClient } = require('@google-cloud/media-translation');

// Creates a client
var credentials = JSON.parse(fs.readFileSync(path.join(__dirname,'service.json')));
const client = new SpeechTranslationServiceClient({
    // optional auth parameters.
    credentials: credentials
});

// Translate audio into a different language and return audio
function translateAudio(audio, sourceLang, targetLang) {
    return new Promise((resolve, reject) => {

        const config = {
            audioConfig: {
                audioEncoding: 'OGG_OPUS',
                sourceLanguageCode: sourceLang,
                targetLanguageCode: targetLang
            },
            single_utterance: true
        };

        const initialRequest = {
            streamingConfig: config,
            audioContent: null
        }

        let currentTranslation = '';
        let currentRecognition = '';

        const stream = client.streamingTranslateSpeech()
        .on('error', (err) => {
            if (err.code && err.code === 4) {
                console.log('Streaming translation reached its deadline.');
            } else {
                console.log(err);
            }
        })
        .on('data', (res) => {
            const {result, speechEventType} = res;

            if (speechEventType === 'END_OF_SINGLE_UTTERANCE') {
                resolve(currentTranslation, currentRecognition);
                stream.destroy();
            } else {
                currentTranslation = result.textTranslationResult.translation;
                currentRecognition = result.recognitionResult;
                resolve(currentTranslation, currentRecognition);
                console.log(currentTranslation, currentRecognition);
            }

        });

        stream.write(initialRequest);
        const request = {
            audioContent: audio,
            streamingConfig: config
        }
        stream.write(request);
    });
}


module.exports = { translateAudio };