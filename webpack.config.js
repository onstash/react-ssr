const path = require("path");
const webpack = require("webpack");
// UglifyJSPlugin is used to do tree-shaking and remove dead & ununsed code
// using es6 modules (import & export)
// Reference: https://webpack.js.org/guides/tree-shaking/
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// AssetsPlugin is used to generate a JSON file with the client bundle path details
// Structure of the JSON file -
// {
//    manifest: { js: <vendorBundlePath> },
//    vendor: { js: <manifestBundlePath> },
//    app: { js: <appBundlePath> }
// }
// Reference: https://github.com/kossnocorp/assets-webpack-plugin
const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    entry: {
        app: "./app/index.js",
        vendor: [
            'react',
            'react-dom',
            'isomorphic-fetch',
            'react-router'
        ]
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js'
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: "babel-loader",
                include: path.join(__dirname, "app"),
                exclude: /node_modules/,
                query: {
                    presets: ["env", "react"],
                    compact: false,
                    cacheDirectory: true
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(path.join(__dirname, "build")),
        new CompressionPlugin(),
        new AssetsPlugin({
          path: path.join(process.cwd(), 'build'),
          prettyPrint: true
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    // Disabled because of an issue with Uglify breaking seemingly valid code:
                    // https://github.com/facebookincubator/create-react-app/issues/2376
                    // Pending further investigation:
                    // https://github.com/mishoo/UglifyJS2/issues/2011
                    comparisons: false,
                    // All console.* calls are discarded
                    // https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options
                    drop_console: true
                },
                output: {
                    // Turned on because emoji and regex is not minified properly using default
                    // https://github.com/facebookincubator/create-react-app/issues/2488
                    ascii_only: true,
                },
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: ['vendor', 'manifest'], // vendor libs + extracted manifest
          minChunks: Infinity,
        }),
    ]
};
