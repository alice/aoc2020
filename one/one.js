const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let entries = [];
rl.on('line', (line) => {
    // parse line as number
    let entry = parseInt(line);
    entries.push(entry);
});

rl.on('close', () => {
    findEntries();
});

function findEntries() {
    for (let i = 0; i < entries.length; i++) {
	const entry1 = entries[i];
	entries.splice(i, 1);
	for (let j = 0; j < entries.length; j++) {
	    const entry2 = entries[j];
	    if (entry1 + entry2 > 2020)
		continue;
	    entries.splice(j, 1);
	    for (let entry3 of entries) {
		if (entry1 + entry2 + entry3 == 2020) {
		    console.log(entry1, "x", entry2, "x", entry3, "=", entry1 * entry2 * entry3);
		    return;
		}
	    }
	    entries.splice(j, 0, entry2)
	}
	entries.splice(i, 0, entry1);
    }
}
