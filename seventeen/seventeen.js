const fs = require('fs');

class Grid {
    constructor({data, grid}) {
	if (grid) {
	    this._grid = new Set(grid._grid);
	    return;
	}
	if (!data)
	    throw ("must provide grid or data to Grid constructor");

	this._grid = new Set();
	let rows = data.split('\n');
	rows.pop(); // empty line

	// Initialise grid
	for (let [x, row] of rows.entries()) {
	    for (let [y, char] of row.split('').entries()) {
		if (char !== '#')
		    continue;
		const coords = {x, y, z: 0};
		this._grid.add(JSON.stringify(coords));
	    }
	}
    }

    has(coords) {
	return this._grid.has(JSON.stringify(coords));
    }

    delete(coords) {
	this._grid.delete(JSON.stringify(coords));
    }

    add(coords) {
	this._grid.add(JSON.stringify(coords));
    }

    get size() {
	return this._grid.size;
    }

    [Symbol.iterator]() {
	let it = this._grid[Symbol.iterator]();
	return {
	    next: () => {
		let next = it.next();
		if (next.done)
		    return next;
		return {
		    value: JSON.parse(next.value),
		    done: false
		}
	    }
	}
    }
}

const data = fs.readFileSync(0, 'utf-8');
let grid = new Grid({data});

function neighbours(coords) {
    let neighbours = [];
    for (let dx = -1; dx <= 1; dx++) {
	for (let dy = -1; dy <= 1; dy++) {
	    for (let dz = -1; dz <= 1; dz++) {
		if (dx === 0 && dy === 0 && dz === 0)
		    continue;
		let x = coords.x + dx;
		let y = coords.y + dy;
		let z = coords.z + dz;
		neighbours.push({x, y, z});
	    }
	}
    }
    return neighbours;
}

function addNeighbours(coords, new_grid) {
    for (neighbour of neighbours(coords))
	new_grid.add(neighbour);
}

function numOnNeighbours(coords) {
    let ns = neighbours(coords);
    return ns.reduce((acc, n) => { return grid.has(n) ? acc + 1 : acc; }, 0);
}

function isOnInNextCycle(coords) {
    let numNeighbours = numOnNeighbours(coords);
    switch (numNeighbours) {
    case 3:
	return true;
    case 2:
	return grid.has(coords);
    default:
	return false;
    }
}

for (let cycle = 1; cycle <= 6; cycle++) {
    let new_grid = new Grid({grid});
    for (let coords of grid) 
	addNeighbours(coords, new_grid);
    for (let coords of new_grid) {
	if (!isOnInNextCycle(coords))
	    new_grid.delete(coords);
    }
    grid = new_grid;
}

console.log(grid.size);

