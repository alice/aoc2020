const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8').split('\n');

const earliest = Number.parseInt(data[0]);
const buses_raw = data[1].split(',');

let buses = [];
for (let bus_raw of buses_raw) {
    if (bus_raw === 'x')
	continue;
    let id = Number.parseInt(bus_raw);
    buses.push({id, wait: (Math.ceil(earliest / id) * id) - earliest });
}

buses.sort((bus1, bus2) => bus1.wait - bus2.wait);
let bus = buses[0];
console.log({bus});
console.log(`result: ${bus.id * bus.wait}`);


    
