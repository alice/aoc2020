const fs = require('fs');
const assert = require('assert').strict;
const RULE_RE = /(?<idx>\d+): (?<rule>.*)$/;
const LETTER_RE = /"(?<letter>\w)"/;
const SUB_RULES_RE = /\d+(?: \d+)*(?: | \d+(?: \d+)+)*/;

let all_rules = [];
let letter_rules = [];

class Rule {
    constructor(number, {letter, sub_rules}) {
	this._number = number;
	this._letter = letter;
	this._sub_rules = sub_rules || [];
	this.recursive = false;
	for (let rule of this._sub_rules) {
	    if (!rule.includes(this._number))
		continue;
	    
	    this.recursive = true;
	    break;
	}

	this.dependencies = new Set();
	for (let sub_rule of this._sub_rules) {
	    for (let number of sub_rule) {
		this.dependencies.add(number);
	    }
	}

	this.dependent_rules = new Set();

	all_rules[number] = this;
	if (this._letter)
	    letter_rules.push(this);
    }

    addDependentRule(rule) {
	this.dependent_rules.add(rule);
    }

    notifyDependencies() {
	if (this._letter)
	    return;
	for (const sub_rule of this._sub_rules) {
	    for (const num of sub_rule) {
		all_rules[num].addDependentRule(this);
	    }
	}
    }

    consumeMatch(potential_match) {
	if (!this.recursive) {
	    let potential_partials = [];
	    for (let string of this._strings) {
		if (potential_match.length < string.length)
		    continue;
		if (potential_match.startsWith(string))
		    potential_partials.push(potential_match.slice(string.length));
	    }
	    return potential_partials;
	}

	// recursive case
	let potential_partials = []
	for (let sub_rule of this._sub_rules) {
	    let rules = sub_rule.map((n) => all_rules[n]);
	    let subrule_potential_partials = [potential_match];
	    while (rules.length) {
		let rule = rules.shift();
		let new_potential_partials = [];
		for (let potential_partial of subrule_potential_partials) {
		    new_potential_partials = new_potential_partials
			.concat(rule.consumeMatch(potential_partial));
		}
		subrule_potential_partials = new_potential_partials;
	    }
	    potential_partials = potential_partials.concat(subrule_potential_partials);
	}
	return potential_partials;
    }

    generateStrings() {
	if (this.recursive)
	    return null;
	
	if (this._strings)
	    return this._strings;
	
	if (this._letter) {
	    this._strings = [this._letter];
	    return this._strings;
	}

	this._strings = [];
	for (const sub_rule of this._sub_rules) {
	    let strings = [''];
	    for (const num of sub_rule) {
		let rule = all_rules[num];
		if (rule.recursive) {
		    this.recursive = true;
		    return null;
		}
		let sub_strings = all_rules[num].generateStrings();
		strings = strings.map((str) => sub_strings.map((sub_str) => str + sub_str))
		    .flat();
	    }
	    this._strings = this._strings.concat(strings);
	}
	return this._strings;
    }
}

const data = fs.readFileSync(0, 'utf-8');
let [rules_lines, messages_lines] = data.split('\n\n');

for (let rule_line of rules_lines.split('\n')) {
    let {idx, rule} = rule_line.match(RULE_RE).groups;
    const i = Number.parseInt(idx);
    const letter_match = rule.match(LETTER_RE);
    if (letter_match) {
	new Rule(i, {letter: letter_match.groups.letter});
	continue;
    }
    assert(rule.match(SUB_RULES_RE), rule);
    if (i === 8)
	rule = '42 | 42 8';
    if (i === 11)
	rule = '42 31 | 42 11 31';
    const rule_parts = rule.split(' | ');
    let sub_rules = [];
    for (let part of rule_parts)
	sub_rules.push(part.split(' ').map((str) => Number.parseInt(str)));
    new Rule(i, {sub_rules});
}

for (let rule of all_rules) {
    if (!rule)
	continue;
    rule.notifyDependencies();
}

let to_be_generated = letter_rules.slice();
while (to_be_generated.length) {
    let rule = to_be_generated.shift();
    rule.generateStrings();
    for (let dependent_rule of rule.dependent_rules) {
	dependent_rule.dependencies.delete(rule._number);
	if (dependent_rule.dependencies.size === 0) {
	    to_be_generated.push(dependent_rule);
	}
    }
}

let all_strings = new Set(all_rules[0].generateStrings());
let messages = messages_lines.split('\n');
let matching_messages = messages.filter((message) =>
					all_rules[0].consumeMatch(message).some((partial) =>
										partial === ''));
console.log(`${matching_messages.length} matching messages`);
