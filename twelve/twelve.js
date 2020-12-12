const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');

const instructions = data.split('\n');
instructions.pop();  // blank line

const HEADINGS = {
    E: [1, 0],
    S: [0, -1],
    W: [-1, 0],
    N: [0, 1]
};
const HEADING_LETTERS = Array.from(Object.keys(HEADINGS));

const instr_re = /(?<action>[NESWLRF])(?<value>\d+)/;
let position = [0, 0];
let heading = 'E';

for (instruction of instructions) {
    const {action, value} = instruction.match(instr_re).groups;
    switch (action) {
    case 'F': {
	for ([axis, m] of HEADINGS[heading].entries())
	    position[axis] += m * value;
	break;
    }
    case 'R': {
	const h = ((value / 90) + HEADING_LETTERS.indexOf(heading)) % HEADING_LETTERS.length;
	heading = HEADING_LETTERS[h];
	break;
    }
    case 'L': {
	const h = ((-value / 90) + HEADING_LETTERS.indexOf(heading) + HEADING_LETTERS.length)
	    % HEADING_LETTERS.length;
	heading = HEADING_LETTERS[h];
	break;
    }
    default: {
	for ([axis, m] of HEADINGS[action].entries()) 
	    position[axis] += m * value;
	break;
    }
    }
}

let manhattan_distance = Math.abs(position[0]) + Math.abs(position[1]);
console.log({manhattan_distance});
