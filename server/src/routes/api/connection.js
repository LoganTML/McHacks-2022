const { Room } = require('../../helpers/room');
const url = require('url');

const MAX_ROOMS = 30;
let rooms = [];

module.exports = (app, server) => {
    app.post('/api/rooms/test', (req, res) => {
        let data = [];
        for (room of rooms) {
            data.push({
                id: room.id,
                lat: room.lat,
                long: room.long
            });
        }
        return res.status(200).send({rooms: data, message: "Success"});
    });

    app.post('/api/room/new', (req, res) => {

        // Verify if the server is full
        if (rooms.length >= MAX_ROOMS) {
            // Server is full
            return res.status(400).send({ message: 'There are too many room sessions running right now. Come back later!'});
        }

        // Create a new room
        let room = new Room(10, req.query.lat, req.query.long, (id) => {
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

    app.post('/api/room/get', (req, res) => {

        let minRoom = null;
        let min = 5;

        console.log(req.query)

        rooms
            .filter(function(room){

                const R = 6371;

                let userLat = req.query.lat;
                let userLong = req.query.long;

                const dLat = (userLat - room.lat) * Math.PI / 180;
                const dLong = (userLong - room.long) * Math.PI / 180;

                const roomLat = room.lat * Math.PI / 180;
                userLat = userLat * Math.PI / 180;

                const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLong/2) * Math.sin(dLong/2) * Math.cos(roomLat) * Math.cos(userLat); 

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                const d = R * c;

                if(d <= min) { min = d; minRoom = room; }
            })
                    
            if(minRoom != null){
                return res.status(200).send({ id: minRoom.id, distance: min, lat: minRoom.lat, long: minRoom.long, theme: minRoom.theme, message: "Closest Room data" });
            }


            // Verify if the server is full
            if (rooms.length >= MAX_ROOMS) {
                // Server is full
                return res.status(400).send({ message: 'There are too many room sessions running right now. Come back later!'});
            }

            // Create a new room
            let room = new Room(10, req.query.lat, req.query.long, (id) => {
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

        //return res.status(400).send({ message: 'There are no rooms right now. Try again later!'});
        
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





