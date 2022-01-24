const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { baseConf } = require('./webpack.config.base')
const { merge } = require('webpack-merge')

module.exports = merge(baseConf, {
    mode: 'production',
    entry: {
        'index': path.resolve(__dirname, '../src/index'),
        'index.all': path.resolve(__dirname, '../src/index.all')
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin()
        ],
    },
    externals: {
        // vue: 'Vue',
        '@cloudbase/js-sdk': 'cloudbase'
    },
    plugins: [
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __DEBUGGER__: false
        }),
    ]
})