const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');
const path = require('path');

class Room {
    //'export' allows it to be called in another class

    /**
     * Room
     * @param maxUsers Max users allowed inside the room
     * @param onRemove Callback function to call when the room is removed
     */
    constructor(maxUsers = 10, lat, long, onRemove = () => {}) {

        // Generate a random id to reference the room
        this.id = this.generateKey(10);
        
        this.lat = lat;
        this.long = long;
    
        var allThemes = [
            "https://cdn.glitch.com/1061d524-9d0f-4b25-97fd-48ebd0fce63c%2Fsceneglb.glb?1546534633849",
            "https://cdn.rawgit.com/KhronosGroup/glTF-Sample-Models/9176d098/1.0/Duck/glTF/Duck.gltf",
            "https://cdn.rawgit.com/siouxcitizen/3DModel/a1c2e475/yuusha.gltf"
        ]

        this.theme = allThemes[Math.floor(Math.random() * allThemes.length)];

        this.maxUsers = maxUsers;
        this.timeout = null;
        this.resetTimeout();
        this.onRemove = onRemove;
        this.users = [];

        // // Creates a translator
        // var credentials = JSON.parse(fs.readFileSync(path.join(__dirname,'service.json')));
        // let client = new SpeechTranslationServiceClient({
        //     // optional auth parameters.
        //     credentials: credentials
        // });

        // const config = {
        //     audioConfig: {
        //         audioEncoding: 'MP3',
        //         sourceLanguageCode: 'fr-FR',
        //         targetLanguageCode: 'en-US'
        //     },
        //     // single_utterance: true
        // };

        // const initialRequest = {
        //     streamingConfig: config,
        //     audioContent: null
        // }

        // const stream = client.streamingTranslateSpeech()
        // .on('error', (err) => {
        //     if (err.code && err.code === 4) {
        //         console.log('Streaming translation reached its deadline.');
        //     } else {
        //         console.log(err);
        //     }
        // })
        // .on('data', (res) => {
        //     const {result, speechEventType} = res;

        //     let currentTranslation = result.textTranslationResult.translation;

        //     // Send the translation to all users
        //     for (const otherUser of this.users) {
        //         otherUser.ws.send(JSON.stringify({
        //             type: "receiveSubtitle",
        //             data: currentTranslation
        //         }));
        //     }

        // });

        // stream.write(initialRequest);

        // Create a new socket server
        this.socket = new WebSocket.Server({ noServer: true });

        // Handle incoming connections to the room
        this.socket.on('connection', (ws, req) => {

            // Get the connection parameters
            let params = url.parse(req.url, true);

            // Create the user
            let user = {
                nickname: String(params.query.nickname),
                long: String(params.query.long),
                lat: String(params.query.lat),
                ws: ws
            }

            // Add the user to the room
            this.users.push(user);

            // Get all the users' nicknames
            let nicknames = [];
            for (const otherUser of this.users) {
                nicknames.push(otherUser.nickname);
            }

            // Update all the other users
            for (const otherUser of this.users) {
                otherUser.ws.send(JSON.stringify({
                    type: "receiveUsers",
                    data: nicknames
                }));
            }

            // Handle incoming messages from the user
            // The signal name is 'message' but it can be anything else you can have multiple signals
            user.ws.on('message', async (message) => {
                let msg = JSON.parse(message);
                let data = msg.data;

                switch(msg.type) {

                    // Handle the voice signal
                    case "voice":
                        // Define some headers
                        var newData = data.split(';');
                        newData[0] = "data:audio/ogg;"
                        newData = newData[0] + newData[1];

                        // if (stream && !stream.destroyed) {
                        //     stream.write({
                        //         audioContent: newData,
                        //         streamingConfig: config
                        //     });
                        // }

                        

                        let toSend = JSON.stringify({
                            type: "receiveVoice",
                            data: newData
                        });

                        for (const otherUser of this.users) {
                            if (otherUser.nickname != user.nickname) {
                                otherUser.ws.send(toSend);
                            }
                        }
                        break;
                    
                    // Handle users update
                    case "users":
                        // Get all the users' nicknames
                        
                        let nicknames = [];
                        for (const otherUser of this.users) {
                            nicknames.push(otherUser.nickname);
                        }
                        
                        user.ws.send(JSON.stringify({
                            type: "receiveUsers",
                            data: nicknames
                        }));
                        break;
                    default:
                        break;
                }
            });

            // Handle the user disconnecting
            user.ws.on('close', () => {
                this.resetTimeout();
                user.ws.terminate();

                // Remove the user from the room
                this.users = this.users.filter((_user) => {
                    return _user.nickname !== user.nickname;
                });

                // Get all the users' nicknames
                let nicknames = [];
                for (const otherUser of this.users) {
                    nicknames.push(otherUser.nickname);
                }

                // Update all the other users
                for (const otherUser of this.users) {
                    otherUser.ws.send(JSON.stringify({
                        type: "receiveUsers",
                        data: nicknames
                    }));
                }

            });
        });

        // Handle the closing of the room
        this.socket.on('close', () => {
            this.remove();
        });
    }

    /**
     * Generate a random key
     * @param length Length of the key to generate
     * @returns 
     */
    generateKey(length) {

        let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        
        // Generate a random key of the given length composed of all possible alphanumeric characters. 
        let key = '';
        for (let i = 0; i < length; i++) {
            key += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
    
        return key;
    }

    /**
     * Reset the timeout of the room
     */
    resetTimeout() {
        if (this.timeout != null) clearTimeout(this.timeout); // Clear the timeout if it exists

        // Set a new timeout to remove the room after a certain amount of time
        this.timeout = setTimeout(() => {
            console.log(`Session ${this.id} has timed out.`)
            this.remove();
        }, 600000); // Max 10 minutes of inactivity
    }

    /**
     * Remove the room
     */
    remove() {
        // Clear the timeout if it exists
        if (this.timeout != null) clearTimeout(this.timeout);

        // Close all connections
        this.socket.clients.forEach((ws) => {
            ws.close();
        });

        // Call the callback function
        this.onRemove(this.id);
    }

    /**
     * Get path of the room
     */
    getPathname() {
        return `/room/${this.id}`;
    }

    /**
     * Authenticate a user to join the room
     */
    authenticate(req) {
        
        // Verify if the room is available for player
        if (this.users.length >= this.maxUsers) {
            return false;
        }

        var params = url.parse(req.url, true).query;

        // Nickname verification
        if (params.nickname) {

            // Verify for username length
            if (params.nickname.length == 0 && params.nickname.length > 15) return false;

            // Verify for username doubles
            for (const client of this.users) {
                if (client.nickname === params.nickname) {
                    return false;
                }
            }

        } else {
            return false;
        }

        return true;

    }
}

module.exports = { Room };