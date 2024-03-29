const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const { version, author } = require('../package.json')

const banner =
    'BComments v' + version + '\n' +
    '(c) 2021-' + new Date().getFullYear() + ' ' + author + '\n' +
    'Released under the MIT License.\n' +
    'Last Update: ' + (new Date()).toLocaleString()

module.exports.baseConf = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].min.js',
        globalObject: 'this',
        library: {
            name: 'BComments',
            type: 'umd',
            export: 'default'
        },
        clean: true
    },
    resolve: {
        alias: {
            crypto: false,
            '@': path.resolve(__dirname, '../src/utils/'),
            '+': path.resolve(__dirname, '../src/components/'),
            '~': path.resolve(__dirname, '../src/views/'),
            'css': path.resolve(__dirname, '../src/styles/'),
            's': path.resolve(__dirname, '../src/store/'),
        },
        extensions: ['.js', '.vue']
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            // extract: true,
                            runtimeGenerator: require.resolve('./svg-to-icon'),
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            customElement: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.css$/, use: [
                    'css-loader'
                ]
            },
            {
                test: /\.less$/, use: [
                    'to-string-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new VueLoaderPlugin(),
        // new SpriteLoaderPlugin()
    ],
    stats: {
        colors: true,
    },
}
