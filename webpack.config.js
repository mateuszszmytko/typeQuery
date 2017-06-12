var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');



module.exports = {
    entry: {
        app: ['./_dev/app.ts', 'es6-promise-polyfill']
    }, 
    devtool: "source-map",
    output: {
        path: __dirname + "/js",
        filename: "[name].min.js"
    },
	resolve: {
		alias: {
			 rq: path.resolve(__dirname, 'src')
		},
        extensions: [".ts", ".js", ".json", ".css"]
	},
    module: {
        rules: [
            { test: /\.ts?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.css$/,
                use: extractSass.extract({
                    fallback: "style-loader",
                    use: "css-loader?sourceMap&importLoaders=1"
                })
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    fallback: "style-loader",
                    use: "css-loader?sourceMap&importLoaders=1!sass-loader?sourceMap&importLoaders=1"
                })
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
	plugins: [
        new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true,
        sourceMap: true,
            mangle: {
                keep_fnames: true
            }
        }),
        extractSass
    ],

};