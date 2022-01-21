const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { baseConf } = require('./webpack.config.base')
const { merge } = require('webpack-merge')

module.exports = merge(baseConf, {
    devtool: 'source-map',
    mode: 'development',
    entry: {
        'index.all': path.resolve(__dirname, '../src/index.all')
    },
    devServer: {
        contentBase: '/',
        port: 3000,
        open: false,
        hot: true,
        compress: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '评论组件',
            template: path.resolve(__dirname, '../public/index.ejs'),
            envId: process.env.envId,
            pageHash: process.env.hash
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __DEBUGGER__: true
        }),
    ]
})
