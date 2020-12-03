const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let valid_passwords = [];
rl.on('line', (line) => {
    let password = parsePassword(line);
});

function parsePassword(line) {
    const re = /(\d+)-(\d+) ([a-z]): ([a-z]+)/;
    const result = line.match(re);
    const n1 = Number.parseInt(result[1]);
    const n2 = Number.parseInt(result[2]);
    const letter = result[3];
    const text = result[4];
    /*
    let count = Array.from(text).reduce((acc, c) => c === letter ? acc + 1 : acc, 0);
    if (count >= n1 && count <= n2)
	valid_passwords.push(text);
    */

    if (xor(text[n1 - 1] == letter, text[n2 - 1] == letter))
	valid_passwords.push(text);
}

function xor(a, b) {
    return (a || b) && !(a && b);
}

rl.on('close', () => {
    console.log(valid_passwords.length, "valid passwords", valid_passwords);
});

