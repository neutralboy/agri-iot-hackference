const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    output: {
        publicPath: "/static/js/"
    },
    module: {
        rules: [{
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2016', 'react', 'stage-0']
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                loader: "sass-loader"
            }
        ]
    }
};