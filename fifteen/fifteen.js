const STARTING_VALUES = [15,12,0,14,3,1];

let seen_values = [];

while (seen_values.length < 2020) {
    if (seen_values.length < STARTING_VALUES.length) {
	seen_values.unshift(STARTING_VALUES[seen_values.length]);
	console.log(seen_values.length + ': ' + seen_values[0]);
	continue;
    }

    let last_value = seen_values.shift();
    let previous_index = seen_values.indexOf(last_value)
    seen_values.unshift(last_value);
    if (previous_index === -1)
	seen_values.unshift(0);
    else
	seen_values.unshift(previous_index + 1);
    console.log(seen_values.length + ': ' + seen_values[0]);
}
    
console.log(seen_values[0]);
