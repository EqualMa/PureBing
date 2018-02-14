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
                use: ['css-loader']
            }
        ]
    }
};