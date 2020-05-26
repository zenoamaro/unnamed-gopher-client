const Path = require('path');
const dir = (...args) => Path.resolve(__dirname, ...args);

const config = (name, entry, target) => ({
  mode: 'production',
  devtool: 'cheap-module-source-map',
  target,

  entry: {
    [name]: dir(entry),
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['src', 'node_modules'],
  },

  module: {
    rules: [
      {test:/\.tsx?$/, loader:'ts-loader', exclude:/node_modules/},
      {test:/\.(png|svg|html|css)$/, loader:'file-loader', exclude:/node_modules/, options:{
        name: '[name].[ext]',
      }},
    ],
  },

  output: {
    path: dir('dist'),
    filename: '[name].js',
  },

  devServer: {
    writeToDisk: true,
    contentBase: dir('dist'),
    stats: 'errors-only',
  },
});

module.exports = [
  config('main', 'src/main/index.ts', 'electron-main'),
  config('app', 'src/index.tsx', 'electron-renderer'),
];
