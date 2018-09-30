const bjs = require("bitcoinjs-lib");
const ypubToXpub = require("./ypubToXpub");
const minimist = require("minimist");

//Override some settings
const args = minimist(process.argv.slice(2));
let xpub = args.p;
const networkName = args.n || "bitcoin";
console.log(networkName);
const addressIndexes = args.i || 10; //Number of addresses to generate in TX history

const network = bjs.networks[networkName];

if (!network) {
	console.log("ERROR: Invalid network");
	process.exit(1);
}

if (!xpub) {
	console.log("ERROR: Pass through xpub/ypub as an argument");
	process.exit(1);
}

//If you have a ybup address instead if xpub, convert it first
if (xpub.startsWith("ypub")) {
	xpub = ypubToXpub(xpub);
}

//Assuming it's mainnet for trezors
module.exports = { cacheDir: "./cache", xpub, network, addressIndexes };
