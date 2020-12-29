const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let total = 0;
rl.on('line', (line) => {
    let result = parse(line);
    console.log({line, result});
    total += result;
});

rl.on('close', () => {
    console.log({result});
});
