const fs = require('fs');
const clone = require('rfdc')();

const data = fs.readFileSync(0, 'utf-8');

const FLOOR = '.';
const EMPTY_SEAT = 'L';
const OCCUPIED_SEAT = '#';

let prev_map = data.split('\n');
prev_map.pop();  // final blank line
for (let [row, str] of prev_map.entries())
    prev_map[row] = str.split('');

let map = step(prev_map);

let MAX = 1000;
let count = 0;
while(!mapsEqual(prev_map, map) && count < MAX) {
    prev_map = map;
    map = step(prev_map);
    count++
}
let occupied_seats = countSeats(map);
console.log({count, occupied_seats});

function step(prev_map) {
    let map = [];
    for (let [row, data] of prev_map.entries()) {
	map.push([]);
	for (let [col, _] of data.entries()) {
	    if (prev_map[row][col] === FLOOR) {
		map[row].push(FLOOR);
		continue;
	    }

	    let neighbours = countNeighbours(row, col, prev_map);
	    if (neighbours === 0) {
		map[row].push(OCCUPIED_SEAT);
	    } else if (neighbours >= 5) {
		map[row].push(EMPTY_SEAT);
	    } else {
		map[row].push(prev_map[row][col]);
	    }
	}
    }
    return map;
}

function countNeighbours(row, col, prev_map) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
	for (let dc = -1; dc <= 1; dc++) {
	    if (dr === 0 && dc === 0)
		continue;
	    let r = row + dr;
	    let c = col + dc;
	    while (r >= 0 && r < prev_map.length &&
		   c >= 0 && c < prev_map[0].length) {
		if (prev_map[r][c] === FLOOR) {
		    r += dr;
		    c += dc;
		    continue;
		}
		if (prev_map[r][c] === OCCUPIED_SEAT)
		    count++;
		break;
	    }
	}	
    }
    return count;
}

function mapsEqual(prev_map, map) {
    let prev_str = prev_map.map((row) => row.join('')).join('\n');
    let curr_str = map.map((row) => row.join('')).join('\n');
    return prev_str === curr_str;
}

function countSeats(map) {
    return map.reduce((acc, row) => acc + row.reduce((acc, pos) => pos === OCCUPIED_SEAT ? acc + 1 : acc, 0), 0);
}

function logMap(obj) {
    for (let key in obj) {
	let str = `\n${key}:\n`;
	let value = obj[key];
	str = str.concat(value.map((row) => row.join('')).join('\n'));
	console.log(str);
    }
}


	
