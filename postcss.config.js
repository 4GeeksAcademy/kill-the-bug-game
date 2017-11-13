module.exports = {
	ident: "postcss",
	parse: require("./parse"),
	stringify: require("./stringify"),
	plugins: [require("autoprefixer")(), require("cssnano")()],
};
