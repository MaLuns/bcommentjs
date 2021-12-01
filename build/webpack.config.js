const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');
const { baseConf } = require('./webpack.config.base')
const { merge } = require('webpack-merge')

module.exports = merge(baseConf, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __DEBUGGER__: false
        }),
    ]
})