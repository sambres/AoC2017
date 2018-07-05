const {
	fn
} = require('../chaining.js');

const fs = require('fs');

fs.readFile('./puzzle_input/11.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}

	const input = formatInput(data);
	console.log(calculateHexDist(input)); //643
	// console.log(calculateHexDist(input.slice(0, 6623)));
	console.log(calculateFarthestPoint(input));

	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});

const formatInput = a => a.replace(/\n/g, '').split(',');

const dirMap = {
	nw: 0,
	n: 1,
	ne: 2,
	se: 3,
	s: 4,
	sw: 5,
};

const reverseDir = d => (d + 3) % 6;

const countDistances = list => {
	const dists = list.reduce(
		(a, b) => {
			let key = dirMap[b];
			a[key]++;
			return a;
		},
		//  [...Array(6).keys()]
		{
			0: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		},
	);
	return dists;
};

const simplifyOppositeDists = dists => {
	let newDists = {};

	for (let i = 0; i < 6; i++) {
		newDists[i] = Math.max(0, dists[i] - dists[reverseDir(i)]);
	}
	return newDists;
};

const findCenterDir = dists => {
	let points = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
	};
	for (let i = 0; i < 6; i++) {
		if (dists[i]) {
			points[i]++;
			if (dists[(i + 5) % 6]) {
				points[i]++;
			}
			if (dists[(i + 1) % 6]) {
				points[i]++;
			}
		}
	}
	// console.log(points);
	let max = -1;
	let maxIndex = -1;
	for (let i = 0; i < 6; i++) {
		if (points[i] > max) {
			max = points[i];
			maxIndex = i;
		}
	}
	return maxIndex;
	// return Object.values(points).reduce((a, b, i, arr) => (arr[a] > arr[i] ? a : i));
};

const simplifyDiagDists = dists => {
	const center = findCenterDir(dists);
	let left = (center + 5) % 6,
		right = (center + 1) % 6;
	// console.log(left, center, right);

	if (dists[left] === 0 || dists[right] === 0) {
		return dists;
	}
	if (dists[left] < dists[right]) {
		let x = left;
		left = right;
		right = x;
	}

	dists[center] += dists[right];
	dists[left] = dists[left] - dists[right];
	dists[right] = 0;

	return dists;
};

const calculateManDist = dists => {
	return Object.values(dists).reduce((a, b) => a + b);
};

const calculateHexDist = input => {
	return fn(input)
		.then(countDistances)
		.then(simplifyOppositeDists)
		.then(simplifyDiagDists)
		.then(calculateManDist).data;
};

const calculateFarthestPoint = input => {
	let max = 0;
	const distCollection = [];
	for (let i = 0; i < input.length; i++) {
		//console.log(i, input.slice(0, i));
		let value = calculateHexDist(input.slice(0, i));
		if (value > max) {
			max = value;
			if (value == 1737) {
				// console.log(i);
			}
		}
	}
	//console.log(distCollection.join(','));
	//return distCollection.reduce((a, b) => a > b ? a : b);
	return max;
};