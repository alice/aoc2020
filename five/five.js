const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let all_ids = [];
rl.on('line', (line) => {
    const binary = line.replaceAll('L', '0').replaceAll('R', '1')
                       .replaceAll('F', '0').replaceAll('B', '1');
    const id = Number.parseInt(binary, 2);
    all_ids.push(id);
});

rl.on('close', () => {
    all_ids.sort((m, n) => m - n);
    const max_id = all_ids[all_ids.length - 1];
    console.log({max_id});

    let prev_id = all_ids.shift();
    for (let id of all_ids) {
	if (id - prev_id !== 1) {
	    const seat_id = prev_id + 1;
	    console.log({seat_id});
	    break;
	}
	prev_id = id;
    }
});

