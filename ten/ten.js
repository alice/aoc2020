const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');
const WALL = 0;

let adapters = data.split('\n').map((line) => Number.parseInt(line));
adapters.pop(); // final newline/empty line
adapters.sort((a, b) => a - b);
adapters.unshift(WALL);

const max_adapter = adapters[adapters.length - 1];
const device = max_adapter + 3;
adapters.push(device);

let diffs = [];
let adapters_copy = adapters.slice();
let prev_adapter = adapters_copy.shift();
while (adapters_copy.length > 0) {
    const adapter = adapters_copy.shift();
    const diff = adapter - prev_adapter;
    diffs.push(diff);
    prev_adapter = adapter;
}

diffs.sort((a, b) => a - b);

let ones = diffs.indexOf(3);
let threes = diffs.length - ones;
let product = ones * threes;
console.log({ones, threes, product});

let partial_num_paths = new Map();
for (let adapter of adapters)
    partial_num_paths.set(adapter, 0);
partial_num_paths.set(device, 1);

adapters.reverse();

function accumulatePaths(end) {
    let start_index = adapters.indexOf(end);
    let end_num_paths = partial_num_paths.get(end);
    let valid_prev = [];

    for (let i = start_index + 1; adapters[i] >= (end - 3); i++)
	valid_prev.push(adapters[i]);

    for (let prev of valid_prev) {
	let prev_num_paths = partial_num_paths.get(prev);
	partial_num_paths.set(prev, prev_num_paths + end_num_paths);
    }
}

for (let adapter of adapters)
    accumulatePaths(adapter);

let num_paths = partial_num_paths.get(WALL);
console.log({num_paths});
