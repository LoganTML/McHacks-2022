const { Room } = require('../../helpers/room');
const url = require('url');

const MAX_ROOMS = 30;
let rooms = [];

module.exports = (app, server) => {

    app.post('/api/room/new', (req, res) => {

        // Verify if the server is full
        if (rooms.length >= MAX_ROOMS) {
            // Server is full
            return res.status(400).send({ message: 'There are too many room sessions running right now. Come back later!'});
        }

        // Create a new room
        let room = new Room(10, (id) => {
            // Remove the room from the list
            rooms = rooms.filter((_room) => {
                return _room.id !== id;
            });

            console.log(`Room ${id} closed.`)
        });

        // Add the room to the list of rooms
        rooms.push(room);
        console.log(`Created a new room with id ${room.id}.`);

        return res.status(200).send({ id: room.id, message: "New room created." });

    });


    server.on('upgrade', (req, sock, head) => {

        const pathname = url.parse(req.url).pathname;

        // Find the room
        for (let room of rooms) {
            if (pathname === room.getPathname()) {

                room.socket.handleUpgrade(req, sock, head, (ws) => {

                    // Authentication
                    if (!room.authenticate(req)) {

                        // Failed authentication
                        sock.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                        sock.destroy();
                        return;
                    } else {
                        room.socket.emit('connection', ws, req);
                    }

                });
                return;
            }
        }

        // Room does not exist
        sock.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        sock.destroy();
        
    });
}





