const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
	watch: true,
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
				exclude: /(node_modules)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["env"],
					},
				},
			},
			{
				test: /\.css$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader",
				}),
			}
		],
	},
	plugins: [
		new ExtractTextPlugin("./css/[name]-style.css"),
		new BrowserSyncPlugin(
			{
				host: "localhost",
				port: 3000,
				proxy: "http://localhost:8080/",
				files: [
					{
						match: ["**/*.html"],
						fn: function(event) {
							if (event === "change") {
								const bs = require("browser-sync").get("bs-webpack-plugin");
								bs.reload();
							}
						},
					}
				],
			},
			{}
		)
	],
	devServer: {
		contentBase: path.resolve(__dirname, "public/"),
	},
};
