var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;
var DedupePlugin = webpack.optimize.DedupePlugin;
var WebpackNotifierPlugin = require('webpack-notifier');
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'WhiteLabel';
var source = '/src/index.js';

var plugins = [],
    outputFile;

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({
        minimize: true
    }));
    plugins.push(new OccurrenceOrderPlugin());
    plugins.push(new DedupePlugin());
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
    plugins.push(new WebpackNotifierPlugin())
}

var config = {
    entry: ['babel-polyfill', __dirname + source],
    devtool: env === 'build' ? '' : 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    noParse: [
        "axios"
    ],
    externals: {},
    module: {
        loaders: [{
            test: /(\.jsx|\.js)$/,
            loader: 'babel',
            exclude: /(node_modules|bower_components)/
        }, {
            test: /(\.jsx|\.js)$/,
            loader: "eslint-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: plugins
};

module.exports = config;
