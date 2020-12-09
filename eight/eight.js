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

for (let i = 0; i < program.length; i++) {
    const instruction = program[i];
    switch (instruction.op) {
    case "acc":
	continue;
    case "jmp":
	instruction.op = "nop";
        run(program);
	instruction.op = "jmp";
	break;
    case "nop":
	instruction.op = "jmp";
	run(program);
	instruction.op = "nop";
	break;
    }
}

function run(program) {
    let p = 0;
    let acc = 0;

    let already_run = new Set();

    function next(jmp) {
	if (already_run.has(jmp)) {
	    return false;
	}
	p = jmp;
	return true;
    }

    while (true) {
	if (p >= program.length) {
	    console.log({acc});
	    process.exit();
	}
	
	already_run.add(p);

	const instruction = program[p];
	switch (instruction.op) {
	case "nop":
	    if (!next(p + 1))
		return false;
	    break;
	case "acc":
	    acc += instruction.arg;
	    if (!next(p + 1))
		return false;
	    break;
	case "jmp":
	    if (!next(p + instruction.arg))
		return false;
	    break;
	}
    }
}
