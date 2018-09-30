const moment = require("moment");
const fetchTransactionData = require("./imports/fetchTransactionData");
const generateAddresses = require("./imports/generateAddresses");
const colorConsole = require("./imports/colorConsoleLog");
const makeCoffee = require("./imports/makeCoffee");
const ypubToXpub = require("./imports/ypubToXpub");
const settings = require("./imports/settings");

const { greenConsoleLog, redConsoleLog, blueBgConsoleLog } = colorConsole;

const getAddressTransactions = async (address, type) => {
	let data = await fetchTransactionData(address, type);

	//Just keep trying
	while (data.error) {
		console.error(data.error);
		await makeCoffee();
		data = await fetchTransactionData(address, type);
	}

	const { txs } = data;

	let transactions = [];

	txs.forEach(tx => {
		const { value, time, txid } = tx;
		let satoshis = Number(value) * 100000000;
		if (type === "spent") {
			satoshis = satoshis * -1;
		}
		transactions.push({ satoshis, time, type, txid });
	});
	return transactions;
};

//As we're monitoring change and receive addresses, ignore the transactions where we sent to oursleves
const mergeTransactions = transactions => {
	let mergedTransactions = {};

	transactions.forEach(transaction => {
		const { txid } = transaction;

		if (mergedTransactions[txid]) {
			const satoshis = mergedTransactions[txid].satoshis + transaction.satoshis;
			const type = satoshis > 0 ? "received" : "spent";

			mergedTransactions[txid] = { ...transaction, type, satoshis };
		} else {
			mergedTransactions[txid] = transaction;
		}
	});

	const mergedTransactionArrays = Object.keys(mergedTransactions).map(
		txid => mergedTransactions[txid]
	);

	return mergedTransactionArrays;
};

const processAddresses = async addresses => {
	let transactions = [];

	for (let index = 0; index < addresses.length; index++) {
		const address = addresses[index];

		//Get all transactions where we received
		const receiveTransactions = await getAddressTransactions(
			address,
			"received"
		);

		transactions = transactions.concat(receiveTransactions);

		//Get all transactions where we spent
		const spentTransactions = await getAddressTransactions(address, "spent");
		transactions = transactions.concat(spentTransactions);
	}

	//Remove duplicates and just keep totals of TXs
	transactions = mergeTransactions(transactions);

	transactions.sort((a, b) => {
		return a.time - b.time;
	});

	return transactions;
};

const satToBTC = sats => {
	return sats / 100000000;
};

const printHistory = xpub => {
	//If you have a ybup address instead if xpub, convert it first
	if (xpub.startsWith("ypub")) {
		xpub = ypubToXpub(xpub);
	}

	const { addressIndexes } = settings;
	const receiveAddresses = generateAddresses(xpub, addressIndexes);
	const changeAddresses = generateAddresses(xpub, addressIndexes, 1);

	//process.exit(1);
	processAddresses([...receiveAddresses, ...changeAddresses]).then(
		transactionList => {
			let total = 0;
			console.log("\n*****************************************************\n");
			transactionList.forEach(transaction => {
				const { satoshis, time, type } = transaction;
				total = total + satoshis;
				const formattedTime = moment.unix(time).format("LLL");
				const btc = satToBTC(satoshis);
				//console.log("\n");
				//console.log(type.toUpperCase());

				if (type === "spent") {
					redConsoleLog(formattedTime);
					redConsoleLog(`BTC: ${btc}`);
				} else {
					greenConsoleLog(formattedTime);
					greenConsoleLog(`BTC: ${btc}`);
				}
				console.log("\n");
			});

			console.log("______________________\n");
			blueBgConsoleLog(`Total balance: ${satToBTC(total)}`);
			console.log("\n*****************************************************\n");
		}
	);
};

printHistory(settings.xpub);
