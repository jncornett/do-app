const webpack = require('webpack')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = function(env) {
  if (!env) {
    env = {}
  }
  return {
    entry: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './src/index'
    ],
    output: {
      filename: '[name].bundle.js',
      path: __dirname + '/dist'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  env.production ? 'env' : ['env', {modules: false}],
                  'stage-0',
                  'react'
                ].filter(x => x),
                plugins: ['react-hot-loader/babel']
              }
            },
            {
              loader: 'eslint-loader',
              options: {
                emitWarning: !env.production
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: env.production ? 
            ExtractTextWebpackPlugin.extract({fallback: 'style-loader', use: 'css-loader'}) :
            ['style-loader', 'css-loader']
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.scss$/,
          include: /node_modules/,
          use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [ autoprefixer ]
                }
              },
              'sass-loader'
            ]
          })
        },
        // font awesome
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "url-loader?limit=10000&mimetype=application/font-woff"
        },
        // font awesome
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "file-loader"
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
      new webpack.ProvidePlugin({
        // Make "React" available throughout the app without needing to explicitly import it.
        React: 'react',
        PropTypes: 'prop-types'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: ({ context }) => context && context.includes('node_modules')
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html.ejs',
        filename: 'index.html'
      }),
      new HtmlWebpackPlugin({
        template: './src/error.html.ejs',
        filename: 'error.html'
      }),
      // Needs to be included *after* HtmlWebpackPlugin
      new ExtractTextWebpackPlugin({ filename: "styles.css", allChunks: true }),
      env.production && new UglifyjsWebpackPlugin({ cache: true, }),
      env.production && new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.NamedModulesPlugin(),
      // Needs to be last (for some reason) for HMR to work.
      new webpack.HotModuleReplacementPlugin(),
    ].filter(x => x),
    devtool: env.production ? 'cheap-module-source-map' : 'source-map',
    devServer: {
      hot: true
    }

  }
}