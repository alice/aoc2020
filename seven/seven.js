const fs = require('fs');

const name_re = "(?<name>\\w+ \\w+ bag)s?"
const inner_re = "(?:(?<number>\\d+) (?<bag>\\w+ \\w+ bag)s?|(?<none>no other bags))";
const inner_regex = new RegExp(inner_re);
const inner_regex_g = new RegExp(inner_re, 'g');
const contents_re = `(?<inner>(?:${inner_re}(?:, )?)+)`;
const rule_regex =  new RegExp(`${name_re} contain ${contents_re}.`);

class Bag {
    constructor(name, inner_list) {
	this.name = name;
	this.inner = [];
	this.inner_counts = new Map();
	this.outer = [];
	for (let inner of inner_list) {
	    const match = inner.match(inner_regex);
	    if (match.groups.bag) {
		this.inner.push(match.groups.bag);
		this.inner_counts.set(match.groups.bag, Number.parseInt(match.groups.number));
	    }
	}
    }

    add_outer(container) {
	this.outer.push(container);
    }
}


const data = fs.readFileSync(0, 'utf-8');
const rules = data.split('\n');
const bags = new Map();
for (const rule of rules) {
    if (rule === "")
	continue;
    const {name, inner} = rule.match(rule_regex).groups;
    const inner_list = [...inner.matchAll(inner_regex_g)].map(result => result[0]);
    let bag = new Bag(name, inner_list);
    bags.set(name, bag);
}

for (let bag of bags.values()) {
    for (let inner of bag.inner) {
	const inner_bag = bags.get(inner);
	inner_bag.add_outer(bag.name);
    }
}
    
let shiny_gold = bags.get("shiny gold bag");
let contains_shiny_gold = new Set();
let to_walk = shiny_gold.outer.slice();
while (to_walk.length > 0) {
    const bag_name = to_walk.shift();
    const bag = bags.get(bag_name);
    contains_shiny_gold.add(bag.name);
    if (bag.outer.length > 0)
	to_walk.push(...bag.outer);
}

console.log(contains_shiny_gold.size, "contain shiny gold");

function total_contains(bag_name) {
    const bag = bags.get(bag_name);
    let total = 1; // include the bag itself
    for (let [name, count] of bag.inner_counts) {
	const inner_bag_contains = total_contains(name);
	total += count * inner_bag_contains;
    }
    return total;
}

const shiny_gold_contains = total_contains("shiny gold bag") - 1; // subtract shiny gold
console.log({shiny_gold_contains});
