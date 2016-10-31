const express = require('express'); // replace express with express.io
const app = express();
const fs = require('fs');
// const http = require('http');
const https = require('https');
const options = {
  key: fs.readFileSync('localhost.key'),
  cert: fs.readFileSync('localhost.crt')
};
const httpsServer = https.createServer(options, app);
const io = require('socket.io')(httpsServer);
const middleware = require('./config/middleware');
const routes = require('./config/routes');

const port = process.env.PORT || 3000;

middleware(app, express);
routes(app, express, io);

// io.sockets.in('chat').emit('someEvent2', 'what is going on, party people?');


httpsServer.listen(port, function(err) {
  err ? console.log('Server error', err) : console.log('Server running on port', port);
});

// module.exports = app;