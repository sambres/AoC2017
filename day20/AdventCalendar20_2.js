const fs = require('fs');

const DEBUG = false;
fs.readFile('./puzzle_input/20.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}

	// console.log("Part 2", particles.length);

	const input = formatInput(data);
	console.log(input);
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


function update(particles) {
	particles.forEach(particle => {
		particle.v.x += particle.a.x;
		particle.v.y += particle.a.y;
		particle.v.z += particle.a.z;

		particle.p.x += particle.v.x;
		particle.p.y += particle.v.y;
		particle.p.z += particle.v.z;
	});

	// collisions
	let collisions = [];
	for (let i = 0; i < particles.length; i++) {
		for (let j = 1; j < particles.length; j++) {
			if (i === j) continue;
			const a = particles[i];
			const b = particles[j];

			if (a.p.x === b.p.x && a.p.y === b.p.y && a.p.z === b.p.z) {
				collisions = collisions.concat(i, j);
			}
		}
	}

	let newParticles = [];
	for (let i = 0; i < particles.length; i++) {
		if (!collisions.includes(i)) {
			newParticles.push(particles[i]);
		}
	}
	return newParticles;
}

function dists(particles) {
	return particles.map(particle => {
		return (
			Math.abs(particle.p.x) + Math.abs(particle.p.y) + Math.abs(particle.p.z)
		);
	});
}


const compute = particles => {
	let closest = dists(particles);
	const MAX = 1000;
	for (var i = 0; i < MAX; i++) {
		particles = update(particles);
		const d = dists(particles);
		d.forEach((dd, index) => {
			if (closest[index] < dd) {
				closest[index] = dd;
			}
		});
		if (i % 1000 === 0) {
			console.log(i, particles.length, i / MAX * 100);
		}
	}

	// let min = Number.MAX_SAFE_INTEGER;
	// let minIndex = 0;
	// closest.forEach((v, idx) => {
	// 	if (v < min) {
	// 		minIndex = idx;
	// 		min = v;
	// 	}
	// });

	return particles.length;
};

// Solution part 2 567