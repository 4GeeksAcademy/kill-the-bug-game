const path = require("path");
module.exports = {
	entry: "./src/js/game/Game.js",
	mode: 'development',
	devtool: "source-map",
	output: {
		path: path.resolve(__dirname, "public"),
		filename: "[name]-bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: [
							"@babel/plugin-proposal-class-properties",
							[
								"@babel/plugin-transform-runtime",
								{
									"regenerator": true
								}
							]
						]
					},
				},
			},
			{
				test: /\.(css)$/, use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}]
			}, //css only files
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: "img/",
						},
					}
				],
			}
		],
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, "public"),
		},
	},
};
