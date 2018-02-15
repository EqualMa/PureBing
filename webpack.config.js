const webpack = require("webpack");

const ENTRY_JS_PATH = './PureBingTM/PureBingTM.js';

module.exports = {
    entry: ENTRY_JS_PATH,
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
            },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    devtool: 'module-source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.BannerPlugin({
            banner: require("./dev/banner").getHeadComment(ENTRY_JS_PATH),
            raw: true, entryOnly: true
        }),
    ],
};