const fs = require('fs');

fs.readFile('./puzzle_input/16.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}
	const input = formatInput(data);
	console.log(compute(input));

	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});

const formatInput = data => data.split(',');

const makeSpin = (programs, spin) => {
	let drift = programs.length - spin;
	return [...programs.slice(drift, programs.length), ...programs.slice(0, drift)];
};

const makeExchange = (programs, index1, index2) => {
	let temp = programs[index1];
	programs[index1] = programs[index2];
	programs[index2] = temp;
	return programs;
};

const makePartner = (programs, programA, programB) => {
	let index1 = programs.findIndex(p => p === programA);
	let index2 = programs.findIndex(p => p === programB);
	return makeExchange(programs, index1, index2);
};

const compute = input => {
	let programs = Array(16)
		.fill()
		.map((p, i) => String.fromCharCode(97 + i));
    console.log('   01234567890123456')
	for (let i = 0; i < input.length ; i++) {
		const move = input[i];
        const match = move.match(/(\w)(\w+)\/?(\w+)?/);
        // console.log(i, programs.join(''));
        // console.dir(match)
		switch (match[1]) {
			case 's':
				programs = makeSpin(programs, match[2]);
				break;
			case 'x':
				programs = makeExchange(programs, parseInt(match[2]), parseInt(match[3]));
				break;
			case 'p':
				programs = makePartner(programs, match[2], match[3]);
				break;
        }
    }
	return programs.join('');
};

//aojlebnckgihfdmp failed
//aibmedjhclofgknp failed
//iabmedjhclofgknp
