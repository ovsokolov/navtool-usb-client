var webpack = require('webpack');
const path = require('path');
module.exports = {
target: 'electron-renderer',
entry: {
  app: ['webpack/hot/dev-server', './javascripts/entry.js'],
},
output: {
  path: path.join(__dirname, '/../public/built'),
  filename: 'bundle.js',
  publicPath: 'http://localhost:8080/built/'
},
devServer: {
  contentBase: './public',
  publicPath: 'http://localhost:8080/built/'
},
module: {
 rules: [
   { test: /\.json$/, use: "json-loader" },
   { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }, 
   { test: /\.css$/, use: 'style-loader!css-loader' },
   { test: /\.less$/, use: 'style-loader!css-loader!less-loader'}
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