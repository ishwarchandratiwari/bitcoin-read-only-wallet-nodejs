const makeCoffee = (seconds = 1) => {
	console.log("Making coffee ☕\n");

	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true);
		}, seconds * 1000);
	});
};

module.exports = makeCoffee;
