const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');

const groups = data.split('\n\n').map((group) => new Set(Array.from(group.replaceAll('\n', ''))));
let count = groups.reduce((acc, group) =>  acc + group.size, 0);
console.log({count});

