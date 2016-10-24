// var path = require('path');

module.exports = {
  entry: [
    'babel-polyfill', //Babel can’t support all of ES6 with compilation alone — it also requires some runtime support. In particular, the new ES6 built-ins like Set, Map and Promise must be polyfilled
    './client/src/index.jsx'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: './client/public/bundle.js'
  },
  devtool: 'source-map', // find the correct line in source code
  module: {
    loaders: [{
      exclude: /node_modules/, // skip node modules!
      loader: 'babel-loader', // 'babel' vs 'babel-loader' any difference???
      // query:{  // unecessary w/ .babelrc ???
      //   presets: ['es2015', 'react', "stage-1"] // Options to configure babel with
      // },
      test: /\.jsx?$/,   // necessary? Only run `.js` and `.jsx` files through Babel  
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
};
