let STARTING_VALUES = [15,12,0,14,3,1];

let seen_values = new Map();
let num_seen = 0;
let last_value = STARTING_VALUES.shift();

while (true) {
    num_seen++;
    if (STARTING_VALUES.length > 0) {
	seen_values.set(last_value, num_seen);
	last_value = STARTING_VALUES.shift();
	continue;
    }

    let value = 0;
    if (seen_values.has(last_value))
	value = num_seen - seen_values.get(last_value)

    seen_values.set(last_value, num_seen);
    if (num_seen % 10000 == 0)
	console.log(num_seen + ': ' + last_value);

    if (num_seen == 30000000)
	break;
    last_value = value;
}

console.log(num_seen + ': ' + last_value);
