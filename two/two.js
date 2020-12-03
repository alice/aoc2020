const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let passwords = [];
let valid_passwords = [];
rl.on('line', (line) => {
    let password = parsePassword(line);
    passwords.push(password);
});

function parsePassword(line) {
    const re = /(\d+)-(\d+) ([a-z]): ([a-z]+)/;
    const result = line.match(re);
    const lower_bound = result[1];
    const upper_bound = result[2];
    const letter = result[3];
    const text = result[4];
    let count = Array.from(text).reduce((acc, c) => c === letter ? acc + 1 : acc, 0);
    if (count >= lower_bound && count <= upper_bound)
	valid_passwords.push(text);
    passwords.push({lower_bound, upper_bound, letter, text});
}

rl.on('close', () => {
    console.log(valid_passwords.length, "valid passwords");
});

