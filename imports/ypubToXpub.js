const b58 = require("bs58check");

const ypubToXpub = ypub => {
	let data = b58.decode(ypub);
	data = data.slice(4);
	data = Buffer.concat([Buffer.from("0488b21e", "hex"), data]);
	return b58.encode(data);
};

module.exports = ypubToXpub;
