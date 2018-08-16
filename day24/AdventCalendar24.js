const fs = require('fs');
const DEBUG = true;

fs.readFile('./puzzle_input/24_test.txt', 'utf8', (err, data) => {
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
	data.split('\n').map(p =>
		p
		.trim('\\r')
		.split('/')
		.map(e => parseInt(e)),
	);

const remove = (array, element) => {
	return array.filter(e => e !== element);
};
const printBridge = bridge => bridge.map(b => b.join('/')).join('--');

var called = 0;
const buildBridge = (components, bridge, currentPin) => {
	// console.log(called++);
	// let last = bridge[bridge.length];
	let nexts = components.filter(p => p[0] === currentPin || p[1] === currentPin);
	let bridgesFound = [];
	let bridgeFound = [];
	console.log(printBridge(bridge));
	//, 'currentPin: ', currentPin, 'found: ', bridgesFound.length);
	for (const component of nexts) {
		let newComponents = remove(components, component);
		let unusedPin = component[0] === currentPin ? component[1] : component[0];
		let newBridge = [...bridge, component];
		let found = buildBridge(newComponents, newBridge, unusedPin);
		// bridgesFound.push(newBridge, ...found);
		bridgeFound = getBetterBridge([newBridge, found, bridgeFound]);
	}
	return bridgeFound;
};

const calculateScore = bridge =>
	bridge.reduce((aggr, current) => aggr + current[0] + current[1], 0);

const getBetterBridgeLength = bridges =>
	bridges.reduce(
		(aggr, current, index, array) =>
		aggr >= calculateScore(current) ? aggr : calculateScore(current),
		0,
	);

const getBetterBridge = bridges =>
	bridges.reduce(
		(aggr, current, index, array) =>
		calculateScore(aggr) >= calculateScore(current) ? aggr : current, [],
	);


const buildBridgeNonRecursive = (components, bridge, currentPin) => {
	let next = components.slice();
	let remaining = components.slice();
	let previous = [];
	let bridgesFound = [];

	do {
		nexts = remaining.filter(p => p[0] === currentPin || p[1] === currentPin);

		for (const component of nexts) {
			remaining = remove(remaining, component);
			currentPin = component[0] === currentPin ? component[1] : component[0];
			bridge = bridge.push(component);
			let found = buildBridge(newComponents, newBridge, unusedPin);
			bridgesFound.push(newBridge, ...found);
		}

	} while (nexts);
};

const compute = input => {
	let bestBridge = [];
	let end = false;
	let starters = input.filter(p => p[0] === 0);

	// bridges = buildBridgeNonRecursive(input, [], 0);
	bestBridge = buildBridge(input, [], 0);
	return calculateScore(bestBridge);
	// return getBetterBridgeLength(bestBridge);
};

// 1116 failed too low