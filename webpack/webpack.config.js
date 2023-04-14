const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const PACKAGE = require("../package.json");
const version = PACKAGE.version.split(".").splice(0, 2).join(".");

module.exports = {
	mode: "development",
	entry: "./src/index.ts",
	devtool: "source-map",
	output: {
		filename: `${PACKAGE.name}.${version}.js`,
		path: path.resolve(__dirname, "../dist"),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.((c|sa|sc)ss)$/i,
				exclude: /((global).((c|sa|sc)ss))$/i,
				use: [
					"lit-css-loader",
					// Can be `less-loader`
					"sass-loader",
				],
			},
			{
				test: /((global).((c|sa|sc)ss))$/i,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
						},
					},
					// Can be `less-loader`
					"sass-loader",
				],
			},
			// For webpack v5
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(png|jpe?g|gif|jp2|webp)$/,
				loader: "file-loader",
				options: {
					name: "images/[name].[ext]",
				},
			},
			{
				test: /\.(svg)$/,
				loader: "file-loader",
				options: {
					name: "icons/[name].[ext]",
				},
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
		}),
	],
	devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
};
