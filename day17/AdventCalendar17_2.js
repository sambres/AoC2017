const find0 = buffer => {
	let index0 = buffer.findIndex(c => c === 0);
	console.log('index0:', index0, 'value after 0', buffer[index0 + 1], 'buffer[1]: ', buffer[1]);
};

const prettyprint = buffer => {
	// const split = 10;
	for (let i = 0; i < split; i++) {
		console.log(
			buffer
				.slice(i * (buffer.length / split), (i + 1) * (buffer.length / split))
				.map(c => c.toString().padStart(3))
				.join(' ') + '\n',
		);
	}
};
const compute = (step, iteration) => {
	let buffer = [0];
	let position = 0;
	let index0 = 0;
	for (let i = 1; i < iteration + 1; i++) {
		position = (((step % i) + position) % i) + 1;
		// buffer = [...buffer.slice(0, position), i, ...buffer.slice(position, length)];
		// buffer.splice(position, 0, i);

		if (position === 1) {
			index0 = i;
			// console.log('1 insert: ', i, position);
		}
		// console.log(buffer.join(' '));
		// if ((i % 10000) === 0) {
		//     console.log(i, buffer[1]);
		//     find0(buffer)
		// }
	}
	// prettyprint(buffer);
	// let index0 = buffer.findIndex(c => c === 0);
	// console.log('index0:', index0, 'value after 0', buffer[index0 + 1]);

	return index0;
};

const iteration = 50000000;
const step = 343;
let timeStart = process.hrtime();

console.log(compute(step, iteration));

let timeEnd = process.hrtime(timeStart);
console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);

// 121243 too low
// 416611 too low
// 761107
// 877804 too low
// 1680125
// 38564229  incorrect
// 1222153 incorrect
