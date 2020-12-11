const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

const PREAMBLE = 25;

let previous = [];
let all_numbers = [];

rl.on('line', (line) => {
    if (line === "") {
	console.log("no weakness found");
	process.exit();
    }

    let number = Number.parseInt(line);
    all_numbers.push(number);

    if (previous.length < PREAMBLE) {
	previous.push(number);
	return;
    }

    if (!isSum(number)) {
	console.log(`${number} is not a sum`);
	let contiguous = findContiguous(number);
	let min = Math.min(...contiguous);
	let max = Math.max(...contiguous);
	console.log(`sum: ${min + max}`);
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
    
function findContiguous(number) {
    let contiguous = [];
    let it = all_numbers.values();
    let done = false;
    while (!done) {
	while (sum(contiguous) < number) {
	    let {value, done} = it.next();
	    if (done)
		break;
	    contiguous.push(value);
	}
	if (sum(contiguous) == number)
	    return contiguous;
	while (sum(contiguous) > number)
	    contiguous.shift();
    }
}

function sum(array) {
    return array.reduce((acc, curr) => acc + curr, 0);
}
