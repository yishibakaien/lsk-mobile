'use strict';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const getEntries = require('./func.js').getEntries;

let config = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].chunk.js',
        // publicPath: 'http://localhost:5000/'
    },
    resolve: {
        extensions: ['.js', '.css', '.styl']
    },
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre', // 取代preloader
            loader: 'eslint-loader',
            include: path.resolve(__dirname, '../src'),
            exclude: path.resolve(__dirname, '../node_modules')
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader']
            })
        }, {
            test: /\.styl$/,
            use: ExtractTextPlugin.extract({
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
                name: '../images/[name].[ext]',
                // 这个to 是hack file-loader 之后才有，参见 file-loader hack 文件
                to: './images/[name].[ext]',
                useRelativePath: true
            }
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: '../fonts/[name].[ext]',
                // 这个to 是hack file-loader 之后才有
                to: './fonts/[name].[ext]',
                useRelativePath: true
            }
        }]
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 3
        }),
        // 打开浏览器
        new OpenBrowserPlugin({
            url: 'http://localhost:5000'
        })
    ],
    devServer: {
        port: 5000, // 端口
        inline: true,
        disableHostCheck: true,
        hot: false
    }
};
// 读取文件生成entry 和 html
// // 这里读取html 防止而外js文件生成多余html
const entries = getEntries(path.resolve(__dirname, '../src/pages/**/*.html'));
let entry = {};
for (let item of entries) {
    entry[item.basename] = item.path.replace('.html', '.js');
    let conf = {
        filename: `${item.basename}.html`,
        template: item.path,
        inject: true,
        hash: false,
        chunks: ['common', item.basename]
    };
    config.plugins.push(new htmlWebpackPlugin(conf));
}
config.entry = entry;

module.exports = config;
