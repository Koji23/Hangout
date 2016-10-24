const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = function(app, express) {
  app.use(morgan('dev'));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../../client/public')));
}