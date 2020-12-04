const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
});

let current_password = {};
let valid_passwords = 0;
rl.on('line', (line) => {
    if (line === '') {
	if (isValid(current_password)) {
	    console.log("valid", current_password);
	    valid_passwords++;
	}
	current_password = {};
	return;
    }
    const fields = line.split(' ');
    for (let field of fields) {
	const [key, value] = field.split(':');
	current_password[key] = value;
    }
});

rl.on('close', () => {
    if (isValid(current_password)) {
	console.log("valid", current_password);
	valid_passwords++;
    }
    console.log({valid_passwords});
});

const fields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid", "cid"];

function isValid(password) {
    let missing_fields = [];
    for (let field of fields) {
	if (!(field in password)) {
	    missing_fields.push(field);
	    continue;
	}
	if (!validate(field, password[field])) {
	    console.log("invalid", field, password[field]);
	    return false;
	}
    }
    if (missing_fields.length == 0)
	return true;
    if (missing_fields.length == 1 && missing_fields[0] === "cid")
	return true;
    return false;
}

function validate(field, value) {
    switch(field) {
    case "byr": {
	const year = Number.parseInt(value);
	return year >= 1920 && year <= 2002;
    }
    case "iyr": {
	const year = Number.parseInt(value);
	return year >= 2010 && year <= 2020;
    }
    case "eyr": {
	const year = Number.parseInt(value);
	return year >= 2020 && year <= 2030;
    }
    case "hgt": {
	const regex = /^(\d+)(cm|in)$/;
	const match = value.match(regex);
	if (!match)
	    return false;
	const unit = match[2];
	switch (unit) {
	case "cm":
	    const cm = Number.parseInt(match[1]);
	    return cm >= 150 && cm <= 193;
	case "in":
	    const inches = Number.parseInt(match[1]);
	    return inches >= 59 && inches <= 76;
	}
	break;
    }
    case "hcl": {
	return !!value.match(/^#[0-9a-f]{6}$/);
    }
    case "ecl": {
	return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value);
    }
    case "pid":
	return !!value.match(/^[0-9]{9}$/);
    case "cid":
	return true;
    }
    return false;
}
