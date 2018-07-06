const fs = require('fs');

const DEBUG = false;
fs.readFile('./puzzle_input/20.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}

	// console.log("Part 2", particles.length);

	const input = formatInput(data);
	// console.log(input);
	console.log(compute(input));

	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);

});

const formatInput = data => data.split('\n').map(a => {
	let matches = a.match(/p=<( ?-?\d+),( ?-?\d+),(-?\d+)>, v=<( ?-?\d+),(-?\d+),(-?\d+)>, a=<( ?-?\d+),(-?\d+),(-?\d+)>/);

	return {
		p: {
			x: parseInt(matches[1]),
			y: parseInt(matches[2]),
			z: parseInt(matches[3]),
		},
		v: {
			x: parseInt(matches[4]),
			y: parseInt(matches[5]),
			z: parseInt(matches[6]),
		},
		a: {
			x: parseInt(matches[7]),
			y: parseInt(matches[8]),
			z: parseInt(matches[9]),
		}
	};
})

function distance(p1) {
	return Math.abs(p1.p.x) + Math.abs(p1.p.y) + Math.abs(p1.p.z);
}

function compute(particules) {
	for (let i = 0; i < 10000; i++) {
		particules = particules.map(p => {
			if (!p) return;

			p.v.x += p.a.x;
			p.v.y += p.a.y;
			p.v.z += p.a.z;

			p.p.x += p.v.x;
			p.p.y += p.v.y;
			p.p.z += p.v.z;

			return p;
		})
	}

	let result = particules.reduce((acc, val, index) => {
		return distance(particules[acc]) > distance(val) ? index : acc;
	}, 0);

	return result;
}


// Solution part 1 91