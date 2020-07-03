/* webpack -p --config ./webpack-production.config.js */
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'app');
var APP_DIR = path.resolve(__dirname, 'javascripts');

module.exports = {
target: 'electron-renderer',
entry: APP_DIR + '/entry.js',
output: {
  path: BUILD_DIR,
  filename: 'bundle.js'
},
module: {
 rules: [
   { test: /\.json$/, loader: "json-loader" },
   { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
   { test: /\.css$/, loader: 'style-loader!css-loader' },
   { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}
 ]
},
node: {
  fs: "empty"
},
  plugins: [
   new webpack.HotModuleReplacementPlugin(),
   new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
 ]
}
