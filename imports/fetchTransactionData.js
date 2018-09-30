//If we have a cached file rather use that instead of a network request

const axios = require("axios");

const makeCoffee = require("./makeCoffee");
const { readCachedAddressData, saveCacheAddressData } = require("./caching");

const fetchFreshData = async (address, type) => {
	let callType;
	if (type === "received") {
		callType = "get_tx_received";
	} else {
		callType = "get_tx_spent";
	}

	const url = `https://chain.so/api/v2/${callType}/BTC/${address}`;

	try {
		const res = await axios.get(url);
		return res.data.data;
	} catch (error) {
		//console.error("FAILED api call ", address);
		let message = "";
		if (!error.code) {
			message = "Unknown error";
			//console.error("^^^^^^^^", error);
		} else if (error.data) {
			message = error.data;
			console.log(error.data);
		} else {
			message = error.code;
		}

		return { error: `API call failed for address: ${address}. (${message})` };
	}
};

const fetchTransactionData = async (address, type) => {
	if (type !== "spent" && type !== "received") {
		console.error("Invalid transaction type. Must be 'spent' or 'received'");
		process.exit(1);
	}

	const cacheFileName = `${address}-tx-${type}.json`;

	let data = await readCachedAddressData(cacheFileName);

	let getFreshData = !data;

	if (data) {
		const { updatedAt } = data;
		const ONE_HOUR = 60 * 60 * 1000;
		const now = new Date().getTime();
		const timeSinceLastUpdate = now - updatedAt;
		if (timeSinceLastUpdate / ONE_HOUR > 0.5) {
			getFreshData = true;
		}
	}

	if (getFreshData) {
		await makeCoffee();
		data = await fetchFreshData(address, type);
		if (!data.error) {
			//Update with latest data for using again
			const cacheData = { ...data, updatedAt: Date.now() };
			await saveCacheAddressData(cacheFileName, cacheData);
		}
	}

	return data;
};

module.exports = fetchTransactionData;
