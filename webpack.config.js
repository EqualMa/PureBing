// const path = require('path');

module.exports = {
    entry: './PureBingTM.js',
    output: {
        filename: './dist/PureBingTM.min.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-loader']
            }
        ]
    }
};