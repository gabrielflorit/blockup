const path = require('path')
const webpack = require('webpack')

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'].map(function(v) {
							return require.resolve('babel-preset-' + v)
						}),
					},
				},
			},
		],
	},
	devtool: 'cheap-module-eval-source-map',
	resolveLoader: {
		modules: [path.resolve(__dirname, '../node_modules')],
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
		}),
	],
}
