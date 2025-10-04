const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESlintPlugin = require("eslint-webpack-plugin")

const { title } = require('process')
const { Template } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    mode: 'production',
    entry: {
        filename: path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[contenthash].js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'body',
        }),
        new MiniCssExtractPlugin({
            filename: 'main.[contenthash].css'
        }
        ),
        new ESlintPlugin({
            extensions: ['.ts', '.js', '.tsx', '.jsx'],
            failOnError: false
        }),
        ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/, 
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader', 
                    options: {
                        presets: [
                            '@babel/preset-env', 
                            '@babel/preset-typescript' 
                        ]
                    }
                }
            },
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],

            },
            {
                test: /\.(png|jpg|jpeg|svg|gif|webp)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024
                    },

                },
                generator: {
                    filename: 'images/[name].[contenthash][ext]'
                },
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4,
                            },
                            webp: {
                                quality: 75,
                            },
                        }
                    }
                ],

            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash][ext]'
                }
            }
        ],
    },
    optimization: {
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
        ],
        minimize: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './dist'),
        },
        hot: true,
        open: true,
        port: 9000,
        liveReload: true,
    }
};