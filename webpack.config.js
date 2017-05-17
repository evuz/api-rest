var path = require('path');
var webpack = require('webpack');

var entryPath = path.join(__dirname, 'client', 'src');
var outPath = path.join(__dirname, 'public', 'js');

module.exports = {
    context: entryPath,
    entry: './index.js',
    output: {
        path: outPath,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: { presets: ['es2015', 'react'] },
                exclude: /node_modules/
            },
            {
                test: /\.(sass|scss)$/, //Check for sass or scss file names
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'SERVER_URL': JSON.stringify(process.env.SERVER_URL ||  'http://localhost:3001/')
            }
        })
    ]
}