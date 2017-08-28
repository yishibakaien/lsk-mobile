'use strict';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const extractCss = new ExtractTextPlugin('css/[name].css');

module.exports = {
    rules: [{
        test: /\.js$/,
        enforce: 'pre', // 取代preloader
        loader: 'eslint-loader',
        include: path.resolve(__dirname, '../src'),
        exclude: path.resolve(__dirname, '../node_modules')
    }, {
        test: /\.css$/,
        use: extractCss.extract({
            fallback: 'style-loader',
            use: ['css-loader']
        })
    }, {
        test: /\.styl$/,
        use: extractCss.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'stylus-loader']
        })
    }, {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../src'),
        exclude: path.resolve(__dirname, '../node_modules'),
        query: {
            presets: ['es2015']
        }
    }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
            limit: 10000,
            name: 'images/[name].[ext]'
        }
    }, {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        loader: 'url-loader',
        query: {
            limit: 10000,
            name: 'fonts/[name].[ext]'
        }
    }]
};