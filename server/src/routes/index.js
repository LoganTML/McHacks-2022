const fs = require('fs');

// Import all routes
module.exports = (app, server) => {
    fs.readdirSync(__dirname + '/api/').forEach((file) => {
        require(`./api/${file.substring(0, file.indexOf('.'))}`)(app, server);
    });
}