const fs = require('fs');

const RANGE_RE = /^(?<name>[\w\s]+): (?<a>\d+)-(?<b>\d+) or (?<c>\d+)-(?<d>\d+)$/;
const TICKET_RE = /^(\d+)(?:,(\d+))*$/;
const SEPARATOR_RE = /\n\n[\w\s]+:\n/;

const data = fs.readFileSync(0, 'utf-8');

let data_segments = data.split(SEPARATOR_RE);
let range_lines = data_segments[0].split('\n');

let named_ranges = new Map();

for (let range_line of range_lines) {
    let match = range_line.match(RANGE_RE);
    if (!match)
	throw(`didn't match RE: ${range_line}`);

    let {name, a, b, c, d} = match.groups;
    named_ranges.set(name, [{low: a, high: b}, {low: c, high: d}]);
}

let nearby_tickets = data_segments[2].split('\n')
    .map(line => line.split(',')
	 .map((s) => Number.parseInt(s)));
nearby_tickets.pop(); // empty line

let scanning_error_rate = 0;
let good_tickets = [];
for (let ticket of nearby_tickets) {
    let error_rate = errorRate(ticket);
    scanning_error_rate += error_rate;
    if (error_rate === 0)
	good_tickets.push(ticket);
}

console.log({scanning_error_rate});

let positions_valid_for = [];
for (let i = 0; i < good_tickets[0].length; i++) {
    positions_valid_for[i] = new Set();
    for (let name of named_ranges.keys())
	positions_valid_for[i].add(name);
}

for (let ticket of good_tickets) {
    for (let p = 0; p < ticket.length; p++) {
	for (let [name, ranges] of named_ranges) {
	    if (!isValidForRanges(ticket[p], ranges))
		positions_valid_for[p].delete(name);
	}    
    }
}

let position_names = [];
while (true) {
    let found_name = false;
    for (let p = 0; p < good_tickets[0].length; p++) {
	if (positions_valid_for[p].size !== 1)
	    continue;
	let name = positions_valid_for[p].values().next().value; // seriously
	found_name = true;
	position_names[p] = name;
	for (let set of positions_valid_for)
	    set.delete(name);
    }
    if (!found_name)
	break;
}

let my_ticket = data_segments[1].split(',').map((s) => Number.parseInt(s));
let departure_total = 1;
for (let [p, name] of position_names.entries()) {
    if (!name)
	continue;
    if (!name.startsWith('departure'))
	continue;
    let value = my_ticket[p];
    departure_total *= value;
}

console.log({departure_total});

function errorRate(ticket) {
    let error_rate = 0;
    for (let value of ticket) {
	let valid = false;
	for (let ranges of named_ranges.values())
	    valid ||= isValidForRanges(value, ranges);
	if (!valid)
	    error_rate += value;
    }
    return error_rate;
}

function isValidForRanges(value, ranges) {
    for (let range of ranges) {
	if (value >= range.low && value <= range.high)
	    return true;
    }
    return false;
}
