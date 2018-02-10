module.exports = function(env) {
  if (!env) {
    env = {}
  }
  return {
    entry: './src/index.jsx',
    output: {
      filename: '[name].bundle.js',
      path: __dirname + '/dist'
    }
  }
}