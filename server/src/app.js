const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json())
app.use(cors());

// Create and initialize HTTP server.
const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('Server listening on port 3000');
});

// Load all routes
require('./routes')(app, server);