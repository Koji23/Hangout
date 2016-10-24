const path = require('path');

module.exports = function(app, express) {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
  });
}