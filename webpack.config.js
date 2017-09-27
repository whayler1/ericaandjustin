const webpack = require('webpack');
const path = require('path');
const process = require('process');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const extractLess = new ExtractTextPlugin({
  filename: "[name].[contenthash].css"
});

const now = moment();
const lastMod = now.format('YYYY-MM-DD')

const paths = [
  {
    path: '/',
    lastMod,
    priority: '1',
    changeFreq: 'monthly'
  }
];

module.exports = (env) => {
  return {
    entry: {
      'index': './app/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: extractLess.extract({
            use: [{
              loader: "css-loader"
            }, {
              loader: "less-loader"
            }],
            fallback: "style-loader"
          })
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader'
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              query: {
                mozjpeg: {
                  quality: 65
                },
                pngquant:{
                  quality: "10-20",
                  speed: 4
                },
                svgo:{
                  plugins: [
                    {
                      removeViewBox: false
                    },
                    {
                      removeEmptyAttrs: false
                    }
                  ]
                },
                gifsicle: {
                  optimizationLevel: 7,
                  interlaced: false
                },
                optipng: {
                  optimizationLevel: 7,
                  interlaced: false
                }
              }
            }
          ]
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Erica and Justin are getting married',
        template: './app/index.pug',
        filename: 'index.html',
        chunks: ['index']
      }),
      new FaviconsWebpackPlugin({
        title: 'Erica and Justin',
        logo: './app/img/favicon.png'
      }),
      new SitemapPlugin('http://ericaandjustin.com', paths, {
        skipGzip: true
      }),
      extractLess
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 9090
    }
  };
}
