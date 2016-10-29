const express = require('express'); // replace express with express.io
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const middleware = require('./config/middleware');
const routes = require('./config/routes');
// var db = require('./config/database.js');
const port = process.env.PORT || 3000;

middleware(app, express);
routes(app, express, io);

io.sockets.in('chat').emit('someEvent2', 'what is going on, party people?');


server.listen(port, function(err) {
  err ? console.log('Server error', err) : console.log('Server running on port', port);
});

module.exports = app;