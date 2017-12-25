const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
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
        new CleanWebpackPlugin(),
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
