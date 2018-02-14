// const path = require('path');

module.exports = {
    entry: './PureBingTM/PureBingTM.js',
    output: {
        filename: './dist/PureBingTM.min.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]']
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    }
};