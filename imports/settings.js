const bjs = require("bitcoinjs-lib");

let settings = {
	network: bjs.networks.bitcoin,
	cacheDir: "./cache"
};

module.exports = settings;
