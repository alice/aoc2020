const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');

let adapters = data.split('\n').map((line) => Number.parseInt(line));
adapters.pop();
adapters.sort((a, b) => a - b);
adapters.unshift(0); // wall

const max_adapter = adapters[adapters.length - 1];
const device = max_adapter + 3;
adapters.push(device);

let diffs = [];
let prev_adapter = adapters.shift();
while (adapters.length > 0) {
    const adapter = adapters.shift();
    const diff = adapter - prev_adapter;
    diffs.push(diff);
    prev_adapter = adapter;
}

diffs.sort((a, b) => a - b);

let ones = diffs.indexOf(3);
let threes = diffs.length - ones;
let product = ones * threes;
console.log({ones, threes, product});
