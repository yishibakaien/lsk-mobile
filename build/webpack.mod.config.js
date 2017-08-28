
/**
 * ******！！废弃！！******
 * @type {[type]}
 */
const path = require('path');
const pak = require('../package.json');
const webpack = require('webpack');

// 格式化时间
module.exports = function(entry, isMinify) {
    const plugins = [
        // 配置全局变量
        new webpack.DefinePlugin({
            NODE_ENV: '"production"',
            'process.env.NODE_ENV': '"production"'
        }),
        // 为输出文件添加注释头
        new webpack.BannerPlugin([
            `created by ${pkg.author} on ${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()}`,
            `${pkg.name} v${pkg.version}`,
            `Copyright  ${new Date().getFullYear()}, ${pkg.author}, ${pkg.license} license`
        ].join('\n'))
    ];

    entry.forEach(item => {
        
    });
    if (isMinify) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true // 这里可以去掉开发环境中添加的console
                }
            }));
    }

    return {
        /**
         * 这个 context 是 ‘相对根目录’
         * 在这里指 ../src 目录下，src作为根目录
         */
        context: path.join(__dirname, '../src'),
        entry,
        output: {
            path: path.join(__dirname, '../dist'),
            filename: isMinify ? 'js/[name].[hash:8].min.js' : '[name].[hash:8].js',
            chunkFilename: 'js/[id].chunk.js' // chunk生成的配置
            // library: 'weui', // window对象挂载 weui
            // libraryTarget: 'umd', // window对象挂载 weui
            // umdNameDefine: true
        },
        module: {
            loaders: [
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loader: 'babel'
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    loader: 'html?minimize'
                }
            ]
        },
        plugins
    };
};
