process.traceDeprecation = true
const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MinifyPlugin = require("babel-minify-webpack-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'

const PROXY = 'https://drupal8.dd:8443'
const PUBLIC_PATH = '/themes/drupal-8-webpack-hmr/assets/dist/'

const config = {
    mode: !devMode ? 'production' : 'development',
    entry: {
        app: path.resolve(__dirname, './assets/js/app.js'),
    },
    devServer: {
        port: 8181,
        hot: true,
        https: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        proxy: {
            '/': {
                index: '',
                context: () => true,
                target: PROXY,
                changeOrigin: false,
                publicPath: PUBLIC_PATH,
                secure: false
            }
        }
    },
    devtool: devMode ? 'inline-source-map' : undefined,
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, './assets/dist'),
        publicPath: PUBLIC_PATH
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, '.')
        }
    },
    externals: {
        jquery: 'jQuery',
        Drupal: 'Drupal',
        drupalSettings: 'drupalSettings',
    },
    module: {
       rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'css-hot-loader',
                    ExtractCssChunks.loader,
                    "css-loader"
                ]
            },
           {
               test: /\.(sa|sc|c)ss$/,
               use: [
                    ExtractCssChunks.loader,
                   'css-loader',
                   {
                       loader: 'postcss-loader',
                       options: {
                           config: {
                               path: path.resolve(__dirname, './postcss.config.js')
                           }
                       }
                   },
                   'sass-loader',
               ],
           },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    useRelativePath: false,
                    emitFile: false //Prevents files from moving since they're correctly referenced
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new ExtractCssChunks({
            hot: true,
            filename: 'css/[name].css',
        }),
        new WebpackBuildNotifierPlugin({
            sound: 'Funk',
            successSound: 'Pop'
        }),
        new WriteFilePlugin({
            force: true,
	        test: /^(?!.*(hot)).*/,
        })
    ],
}

if ( process.env.NODE_ENV === 'production' ) {
    config.plugins.push(
        new CleanWebpackPlugin(['assets/dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new MinifyPlugin(),
        new OptimizeCssAssetsPlugin(),
        new ProgressBarPlugin()
    )
}

module.exports = config