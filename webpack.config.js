const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
	entry: "./src/js/game/Game.js",
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
						presets: ["es2017"],
					},
				},
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader",
							options: {
								importLoaders: 1,
							},
						},
						"sass-loader"
					],
				}),
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader",
			},
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
	plugins: [
		new ExtractTextPlugin("./css/[name]-style.css"),
		new BrowserSyncPlugin({
			host: "localhost",
			port: 3000,
			proxy: "http://localhost:8080/",
			files: [
				{
					match: ["**/*.html"],
					fn: function (event) {
						if (event === "change") {
							const bs = require("browser-sync").get("bs-webpack-plugin");
							bs.reload();
						}
					},
				}
			],
		}),
		new UglifyJsPlugin({
			uglifyOptions: {
				sourceMap: true,
				ie8: false,
				ecma: 8,
				output: {
					comments: false,
					beautify: false,
				},
			},
		})
	],
	devServer: {
		contentBase: path.resolve(__dirname, "public/"),
	},
};
