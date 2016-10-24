const express = require('express');
const app = express();
const middleware = require('./config/middleware');
const routes = require('./config/routes');
// var db = require('./config/database.js');
const port = process.env.PORT || 3000;

middleware(app, express);
routes(app, express);

app.listen(port, console.log('App listening on port:', port));

module.exports = app;