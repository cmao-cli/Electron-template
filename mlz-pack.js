const path = require('path');
module.exports = {
  webpack: {
    publicPath: './',
    htmlPlugin: {
      filename: 'index.html',
      template: path.resolve(__dirname, './src/app/index.ejs'),
    },
  }
}