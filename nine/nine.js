const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

const PREAMBLE = 25;

let previous = [];
rl.on('line', (line) => {
    if (line === "") {
	console.log("no sum found");
	process.exit();
    }

    let number = Number.parseInt(line);

    if (previous.length < PREAMBLE) {
	previous.push(number);
	return;
    }

    if (!isSum(number)) {
	console.log(`${number} is not a sum`);
	process.exit();
    }
    previous.shift();
    previous.push(number);
})

function isSum(number) {
    for (let [i, n] of previous.entries()) {
	let j = previous.indexOf(number - n);
	if (j >= 0 && j != i)
	    return true;
    }
    return false;
}
    

