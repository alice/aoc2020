const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let BITMASK_RE = /^mask = (?<bitmask>[X01]+)$/
let MEM_RE = /^mem\[(?<loc>\d+)\] = (?<value>\d+)$/

let current_bit_mask = 0;
let current_mask_value = 0;
let memory = [];

rl.on('line', (line) => {
    let bitmask_match = line.match(BITMASK_RE);
    if (bitmask_match) {
	updateBitmask(bitmask_match.groups);
	return;
    }

    let mem_match = line.match(MEM_RE);
    if (mem_match) {
	updateMem(mem_match.groups);
	return;
    }
});

rl.on('close', () => {
    let total = 0;
    for (let value of memory) {
	if (value === undefined)
	    continue;
	total += value;
    }
    console.log({total});
});

function updateBitmask({bitmask}) {
    current_bit_mask = Number.parseInt(bitmask.replaceAll('1', '0').replaceAll('X', '1'), 2);
    current_mask_value = Number.parseInt(bitmask.replaceAll('X', '0'), 2);
}

function updateMem({loc, value}) {
    let masked_value = (value & current_bit_mask) + current_mask_value;
    memory[loc] = masked_value;
}
