const path = require('path');
module.exports = {
  webpack: {
    publicPath: './',
    devServer:{
      open:false
    },
    target: 'electron-renderer',
    htmlPlugin: {
      filename: 'index.html',
      template: path.resolve(__dirname, './src/app/index.ejs'),
    },
  }
}