const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');

const groups = data.split('\n\n').map((group) => {
    let people = group.split('\n');
    let intersection = Array.from(people.shift());
    for (const person of people) {
	if (person === "")
	    continue;
	intersection = intersection.filter(q => person.includes(q));
    }
    return intersection;
});

let count = groups.flat().length;
console.log({count});

