const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');

const instruction_re = /(?<op>\w{3}) (?<arg>[-+]\d+)/;

let program = [];
const lines = data.split('\n');
for (const line of lines) {
    if (line == '')
	break;
    let {op, arg} = line.match(instruction_re).groups;
    program.push({op, arg: Number.parseInt(arg)});
}

run(program);

function run(program) {
    let p = 0;
    let acc = 0;

    let already_run = new Set();

    function next(jmp) {
	if (already_run.has(jmp)) {
	    console.log({jmp, acc});
	    process.exit()
	}
	p = jmp;
	return true;
    }

    while (true) {
	already_run.add(p);

	const instruction = program[p];
	switch (instruction.op) {
	case "nop":
	    next(p + 1);
	    break;
	case "acc":
	    acc += instruction.arg;
	    next(p + 1);
	    break;
	case "jmp":
	    next(p + instruction.arg);
	    break;
	}
    }
}
