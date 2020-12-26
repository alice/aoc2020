const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let MAX_BITS = 36;
let BITMASK_RE = /^mask = (?<bitmask>[X01]+)$/
let MEM_RE = /^mem\[(?<loc>\d+)\] = (?<value>\d+)$/

let current_floating_bits = [];
let current_mask_value = 0;
let memory = new Map();

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
    let total = BigInt(0);
    for (let value of memory.values())
	total += value;

    console.log({total});
});

function updateBitmask({bitmask}) {
    // If the bitmask bit is X, the corresponding memory address bit is floating.
    let floating_bits = BigInt(`0b${bitmask.replaceAll('1', '0').replaceAll('X', '1')}`);
    current_floating_bits = [];
    let mask = 1n;
    for (let i = 0; i < MAX_BITS; i++) {
	if (floating_bits & mask) {
	    current_floating_bits.push(mask);
	}
	mask <<= 1n;
    }

    // If the bitmask bit is 0, the corresponding memory address bit is unchanged.
    // If the bitmask bit is 1, the corresponding memory address bit is overwritten with 1.
    current_mask_value = BigInt(`0b${bitmask.replaceAll('X', '0')}`);
}

function updateMem({loc, value}) {
    let masked_loc = (BigInt(loc) | current_mask_value);
    let floated_locs = [masked_loc];
    for (let floating_bit of current_floating_bits) {
	let new_floated_locs = [];
	for (let floated_loc of floated_locs) {
	    new_floated_locs.push(floated_loc ^ floating_bit);
	    new_floated_locs.push(floated_loc);
	}
	floated_locs = new_floated_locs;
    }

    let parsed_value = BigInt(value);
    for (let loc of floated_locs)
	memory.set(loc, parsed_value);
}
