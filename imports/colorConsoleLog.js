const redText = "\x1b[31m";
const greenText = "\x1b[32m";
const resetText = "\x1b[0m";
const bgBlue = "\x1b[46m";

const greenConsoleLog = text => {
	console.log(`${greenText}${text}${resetText}`);
};

const redConsoleLog = text => {
	console.log(`${redText}${text}${resetText}`);
};

const blueBgConsoleLog = text => {
	console.log(`${bgBlue}${text}${resetText}`);
};

module.exports = { greenConsoleLog, redConsoleLog, blueBgConsoleLog };
