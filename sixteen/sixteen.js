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
    scanning_error_rate += errorRate;
    if (error_rate === 0)
	good_tickets.push(ticket);
}

console.log(scanning_error_rate);

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
