const fs = require("fs");
const path = require("path");

const nodeModules = {};
fs
	.readdirSync("node_modules")
	.filter(x => [".bin"].indexOf(x) === -1)
	.forEach(mod => {
		nodeModules[mod] = `commonjs ${mod}`;
	});

module.exports = {
	target: "node",
	mode: "production",
	externals: nodeModules,
	entry: [`${__dirname}/source/ts/index.ts`],
	resolve: {
		extensions: [".ts", ".js"]
	},
	output: {
		path: `${__dirname}/build/`,
		filename: `updater.min.js`
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /\/node_modules\//,
			use: ["babel-loader", "ts-loader"]
		}]
	}
};
