const fs = require('fs');
const DEBUG = true;

fs.readFile('./puzzle_input/25.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}
	const input = formatInput(data);
	console.log(compute(input));

	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});


const formatInput = data => {
	let machine = new Machine();
	let split = data.split('\n');
	let currentState = undefined;
	let currentStateState = undefined;

	for (let i = 0; i < split.length; i++) {
		let line = split[i];
		let match = undefined;
		if (match = line.match(/Begin in state (\w)./)) {
			machine.startState = match[1];
		} else if (match = line.match(/Perform a diagnostic checksum after (\d+) steps./)) {
			machine.steps = parseInt(match[1]);

		} else if (match = line.match(/In state (\w):/)) {
			currentState = match[1];
			machine.states[currentState] = {};
		} else if (match = line.match(/If the current value is (\w):/)) {
			currentStateState = match[1];
			machine.states[currentState][currentStateState] = {};
		} else if (match = line.match(/- Write the value (\d)./)) {
			machine.states[currentState][currentStateState].newValue = parseInt(match[1]);
		} else if (match = line.match(/- Move one slot to the (\w+)./)) {
			machine.states[currentState][currentStateState].move = match[1] === 'right' ? 1 : -1;
		} else if (match = line.match(/- Continue with state (\w)./)) {
			machine.states[currentState][currentStateState].newState = match[1];
		}
	}
	return machine;
}

class Machine {

	constructor() {
		this.startState = undefined;
		this.steps = undefined;
		this.states = {};
	}
}

const compute = machine => {
	let cursor = 0;
	let tape = {
		0: 0
	}
	let state = machine.startState;

	for (let step = 0; step < machine.steps; step++) {
		let currentValue = tape[cursor];
		let rules = machine.states[state][currentValue];
		tape[cursor] = rules.newValue;
		state = rules.newState;
		cursor += rules.move;
		
		if (!tape[cursor]) tape[cursor] = 0;
	}
	return Object.keys(tape).reduce((aggr, value) => aggr + parseInt(tape[value]), 0);

};