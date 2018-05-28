const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval',

  entry: ['index.tsx'],

  output: {
    filename: 'index.js',
    publicPath: 'dist',
    path: path.resolve('dist'),
  },

  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.html',
  })],

  devServer: {
    port: 3000,
    historyApiFallback: true,
    contentBase: 'src',
    inline: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['src', 'node_modules'],
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader', 'awesome-typescript-loader'],
        include: path.resolve('src'),
      },
    ],
  },
};
