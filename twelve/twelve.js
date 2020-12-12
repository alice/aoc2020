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
let waypoint = [10, 1];

for (instruction of instructions) {
    const {action, value} = instruction.match(instr_re).groups;
    switch (action) {
    case 'F': {
	for ([axis, m] of waypoint.entries())
	    position[axis] += m * value;
	break;
    }
    case 'R': {
	let quarter_turns = value / 90;
	for (let i = 0; i < quarter_turns; i++) {
	    let temp_waypoint = [];
	    temp_waypoint[0] = waypoint[1];
	    temp_waypoint[1] = waypoint[0] * -1;
	    waypoint = temp_waypoint;
	}
	break;
    }
    case 'L': {
	let quarter_turns = value / 90;
	for (let i = 0; i < quarter_turns; i++) {
	    let temp_waypoint = [];
	    temp_waypoint[0] = waypoint[1] * -1;
	    temp_waypoint[1] = waypoint[0];
	    waypoint = temp_waypoint;
	}
	break;
    }
    default: {
	for ([axis, m] of HEADINGS[action].entries()) 
	    waypoint[axis] += m * value;
	break;
    }
    }
    console.log({action, value, waypoint, position});
}

let manhattan_distance = Math.abs(position[0]) + Math.abs(position[1]);
console.log({manhattan_distance});
