var webpack = require('webpack');
var path = require('path');

var dir = {
  js: __dirname + '/resource/js',
  jsDist: __dirname + '/public/js',
};

module.exports = {
  dir: dir,
  entry: {
    main: dir.js + '/crowi.js',
    reveal: dir.js + '/crowi-reveal.js',
    components: dir.js + '/crowi-components.jsx',
  },
  output: {
    path: dir.jsDist,
    filename: "crowi-[name].js"
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader' }
    ]
  },
  resolve: {
    root: [path.join(__dirname, "bower_components")],
    alias: {
      head: path.join(__dirname, 'bower_components/reveal.js/lib/js/head.min.js'),
      html5shiv: path.join(__dirname, 'bower_components/reveal.js/lib/js/html5shiv.js'),
      reveal: path.join(__dirname, 'bower_components/reveal.js/js/reveal.js'),
      bootstrap: path.join(__dirname, 'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'),
      highlight: path.join(__dirname, 'bower_components/highlightjs/highlight.pack.js'),
    },
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
        hljs: "highlight"
    }),
  ]
};
