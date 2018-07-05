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
	let statPrograms = Array(16)
		.fill()
		.map((p, i) => String.fromCharCode(97 + i));
	let statProgramsString = statPrograms.join('');
	console.log('   01234567890123456')
console.log(input.length);
	const danceMoves = {};
	const iterations = 1000000000;
	let programs = statPrograms.slice(0, statPrograms.length);
	let programsString = '';

	for (let i = 0; i < iterations; i++) {
		programsString = programs.join('');
		if (!danceMoves[programsString]) {
			let newPrograms = makeDance(input, programs);
			danceMoves[programsString] = {
				order: newPrograms.join(''),
				index: i,
			}
			console.log(i, programsString, danceMoves[programsString].order);
		} else if (programsString === statProgramsString) {
			let cycle = i;
			let finalState = (iterations % cycle) - 1;
			console.log(cycle, finalState);
			for (const key in danceMoves) {
				if (danceMoves.hasOwnProperty(key)) {
					const move = danceMoves[key];
					if (move.index === finalState) {
						console.log(move.index)
						return move.order;
					}
				}
			}
		}
		programs = danceMoves[programsString].order.split('');
//0123456789123456
//abcdefghijklmnop
//abcdekghijflmnop
//iabmedjhclofgknp
	}
	return programs.join('');
};


const makeDance = (input, programs) => {
	for (let i = 0; i < input.length; i++) {
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
	return programs;
}

//1000000000 % 36 = 27,7 -> 28 = alopgdjeibhmfcnk failed
//1000000000 % 35 = 20 = bigkhdjfaoepmlnc failed
//