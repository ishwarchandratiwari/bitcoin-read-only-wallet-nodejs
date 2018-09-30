const fs = require("fs");
const settings = require("./settings");

const { cacheDir } = settings;

if (!fs.existsSync(cacheDir)) {
	fs.mkdirSync(cacheDir);
}

const saveCacheAddressData = async (filename, data) => {
	return new Promise((resolve, onError) => {
		fs.writeFile(
			`${cacheDir}/${filename}`,
			JSON.stringify(data),
			(err, data) => {
				if (err) {
					onError(err);
				} else {
					resolve(true);
				}
			}
		);
	});
};

const readCachedAddressData = async filename => {
	return new Promise((resolve, onError) => {
		try {
			fs.readFile(`${cacheDir}/${filename}`, (err, buf) => {
				if (err) {
					resolve(false);
				} else {
					resolve(JSON.parse(buf.toString()));
				}
			});
		} catch (e) {
			resolve(false);
		}
	});
};

module.exports = { saveCacheAddressData, readCachedAddressData };
