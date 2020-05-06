const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
   module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
    }
    ]
  },
};