'use strict';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pkg = require('../package.json');
const getEntries = require('./func.js').getEntries;

// 实例化 ExtractTextPlugin
// const extractCss = new ExtractTextPlugin('css/[name].[hash:8].css');

let config = {
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].chunk.js'
    },
    resolve: {
        extensions: ['.js', '.css', '.styl'],
        alias: {
            'api': path.resolve(__dirname, '../src/api'),
            'config': path.resolve(__dirname, '../src/config'),
            'common': path.resolve(__dirname, '../src/common'),
            'plugins': path.resolve(__dirname, '../src/common/plugins'),
            'utils': path.resolve(__dirname, '../src/common/scripts/utils')
        }
    },
    module: {
        rules: [/*{
            test: /\.js$/,
            enforce: 'pre', // 取代preloader
            loader: 'eslint-loader',
            include: path.resolve(__dirname, '../src'),
            exclude: path.resolve(__dirname, '../node_modules')
        },*/{
            test: /\.styl$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader', 'stylus-loader']
            })
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader']
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
            options: {
                limit: 10000,
                name: '../images/[name].[ext]',
                // 这个to 是hack file-loader 之后才有
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
        new ExtractTextPlugin('css/[name].[hash:8].css'),
        // build 时删除dist目录
        new CleanPlugin(['dist'], {
            root: path.resolve(__dirname, '../')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 5
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // 为生成的文件添加注释头
        new webpack.BannerPlugin([
            `created by ${pkg.author} on ${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()}`,
            `${pkg.name} v${pkg.version}`,
            `Copyright  ${new Date().getFullYear()}, ${pkg.author}, ${pkg.license} license`
        ].join('\n')),
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify('prod') 
            // 为了便于调试，这里 npm run build 打包时，依然使用 dev 2017年9月22日15:17:28 cqw
            'process.env.NODE_ENV': JSON.stringify('dev')
        }),
        new CopyWebpackPlugin([
            { from: './src/images', to: './images' }, // 拷贝图片
            { from: './src/common/fonts', to: './fonts' } // 拷贝字体
        ])
    ]
};
// 读取文件生成entry 和 html
// 这里读取html 防止而外js文件生成多余html
const entries = getEntries(path.resolve(__dirname, '../src/pages/**/*.html'));
let entry = {};
for (let item of entries) {
    entry[item.basename] = item.path.replace('.html', '.js');
    let conf = {
        filename: `${item.basename}.html`,
        template: item.path,
        inject: true,
        hash: false,
        chunks: ['common', item.basename],
        minify: {
            removeComments: true,
            collapseWhitespace: true    
        }
    };
    config.plugins.push(new htmlWebpackPlugin(conf));
}
config.entry = entry;

module.exports = config;
