const WebSocket = require('ws');
const url = require('url');

class Room {
    //'export' allows it to be called in another class

    /**
     * Room
     * @param maxUsers Max users allowed inside the room
     * @param onRemove Callback function to call when the room is removed
     */
    constructor(maxUsers = 10, onRemove = () => {}) {

        // Generate a random id to reference the room
        this.id = this.generateKey(10);
        
        this.maxUsers = maxUsers;
        this.timeout = null;
        this.resetTimeout();
        this.onRemove = onRemove;
        this.users = [];

        // Create a new socket server
        this.socket = new WebSocket.Server({ noServer: true });

        // Handle incoming connections to the room
        this.socket.on('connection', (ws, req) => {

            // Get the connection parameters
            let params = url.parse(req.url, true);

            // Create the user
            let user = {
                nickname: String(params.query.nickname),
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
            user.ws.on('message', (message) => {
                let msg = JSON.parse(message);
                let data = msg.data;

                switch(msg.type) {

                    // Handle the voice signal
                    case "voice":
                        // Define some headers
                        var newData = data.split(';');
                        newData[0] = "data:audio/ogg;"
                        newData = newData[0] + newData[1];

                        for (const otherUser of this.users) {
                            if (otherUser.nickname != user.nickname) {
                                otherUser.ws.send(JSON.stringify({
                                    type: "receiveVoice",
                                    data: newData
                                }));
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