const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
		a: './src/a',
		d: ['./src/d'],
        main:'./css/main.styl'
	},
    output: {
        path: './bin',
		filename: "[name].js",
        chunkFilename: "[id].js"
    },
	module: {
		loaders: [
            // Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader")
            },
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'react-hot!jsx-loader?harmony'
			}
        ]
	},
	plugins: [
        new webpack.optimize.UglifyJsPlugin({
			mangle: {
				except: ['$super', '$', 'exports', 'require']
			},
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new ExtractTextPlugin("[name].css", {
            allChunks: true
        }),
		new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"d", /* filename= */"d.bundle.js")
    ]

 };
