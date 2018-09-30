const bjs = require("bitcoinjs-lib");
const bip32 = require("bip32");

const settings = require("./settings");
const { network } = settings;

const generateAddresses = (xpub, count, derive = 0) => {
	let addresses = [];

	for (let index = 0; index < count; index++) {
		const payment = bjs.payments.p2sh({
			redeem: bjs.payments.p2wpkh({
				pubkey: bip32
					.fromBase58(xpub, network)
					.derive(derive)
					.derive(index).publicKey
			})
		});
		addresses.push(payment.address);
	}

	return addresses;
};

module.exports = generateAddresses;
