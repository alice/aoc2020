const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let grid = [];
rl.on('line', (line) => {
    grid.push(line);
});

rl.on('close', () => {
    let total = 1;
    total *= test(1, 1);
    total *= test(3, 1);
    total *= test(5, 1);
    total *= test(7, 1);
    total *= test(1, 2);
    console.log("grand total", total);
});

function test(right, down) {
    let [r, c] = [0, 0];
    let trees = 0;
    while (r < grid.length) {
	if (grid[r][c] === '#')
	    trees++;
	r += down;
	c += right;
	c %= grid[0].length;
    }
    console.log({right, down}, trees, "trees");
    return trees;
}
