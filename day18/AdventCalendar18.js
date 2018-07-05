const fs = require('fs');

fs.readFile('./puzzle_input/18.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}
	const input = formatInput(data);
	console.log(compute(input));

	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});

const formatInput = data =>
	data
		.split('\n')
		.map(c => c.match(/(\w{3}) (\w) ?(-?\w*)/))
		.map(m => ({
			command: m[1],
			name: m[2],
			arg: m[3],
		}));

const getArgValue = (arg, registries) => {
    // console.log(arg, registries);
	if (isNaN(parseInt(arg))) {
		return registries[arg] || 0;
	} else {
		return parseInt(arg);
	}
};

const compute = input => {
	let playedFq = null,
		recoverFq = null;
	let registries = {};
	let position = 0;

    // for(let i = 0; i < 15; i++) {
	while (position >= 0 && position < input.length && recoverFq === null) {
        let instruction = input[position];
        console.log(registries);
        console.log(instruction);
		({ playedFq, recoverFq } = doInstruction(instruction, registries, playedFq, recoverFq));

		if (instruction.command === 'jgz' && registries[instruction.name] > 0) {
			position += getArgValue(instruction.arg, registries);
		} else {
			position += 1;
		}
	}

	return recoverFq;
};


function doInstruction(instruction, registries, playedFq, recoverFq) {
	switch (instruction.command) {
		case 'snd':
			if (registries[instruction.name]) {
				playedFq = registries[instruction.name];
			}
			break;
		case 'set':
			registries[instruction.name] = getArgValue(instruction.arg, registries);
			break;
		case 'add':
			registries[instruction.name] =
				(registries[instruction.name] || 0) + getArgValue(instruction.arg, registries);
			break;
		case 'mul':
			registries[instruction.name] =
				getArgValue(instruction.name, registries) * getArgValue(instruction.arg, registries);
			break;
		case 'mod':
			registries[instruction.name] =
				getArgValue(instruction.name, registries) % getArgValue(instruction.arg, registries);
			break;
		case 'rcv':
			if (getArgValue(instruction.name, registries) > 0) {
				recoverFq = playedFq;
			}
			break;
	}
	return { playedFq, recoverFq };
}
//aojlebnckgihfdmp failed
//aibmedjhclofgknp failed
//iabmedjhclofgknp
