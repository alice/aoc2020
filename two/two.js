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
    const [_, n1, n2, letter, text] = line.match(re);
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

