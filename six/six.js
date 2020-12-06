const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');

let temp_questions = [];
const charCodeA = "a".charCodeAt(0);
for (let i = 0; i < 26; i++) {
    const charCode = charCodeA + i;
    temp_questions.push(String.fromCharCode(charCode));
}
const questions = temp_questions;
    
const groups = data.split('\n\n').map((group) => {
    let people = group.split('\n');
    let intersection= questions.slice();
    for (const person of people) {
	if (person === "")
	    continue;
	intersection = intersection.filter(q => person.includes(q));
    }
    return intersection;
});

let count = groups.reduce((acc, group) =>  acc + group.length, 0);
console.log({count});

