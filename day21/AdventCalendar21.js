const fs = require('fs');

const DEBUG = false;
fs.readFile('./puzzle_input/21.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}

	const input = formatInput(data);
	console.log(input);
	console.log(compute(input));
	// splitArt(formatArt('#..#/..../..../#..#'), 2)
	// 	.map(a => console.log(serializeArt(a)));
	// console.log(findRule(formatArt('#../#.#/##.'), input));
	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
	console.info('Merge Execution (hr): %ds', accumulatedMergeTime);
	console.info('Split Execution (hr): %ds', accumulatedSplitTime);
	console.info('Find Execution (hr): %ds', accumulatedFindTime);
	console.info('Serialize Execution (hr): %ds', accumulatedSerTime);

});

const printArt = art => {
	//console.log(' ' + Array(art[0].length).fill().map((c, i) => i.toString().padStart(1)).join(''))
	for (let i = 0; i < art.length; i++) {
		console.log(art[i].map(c => c.padStart(1)).join(''));
	}
};

const formatArt = input => input.split('/').map(l => l.split(''));

const serializeArt = art => {
	let timeStart = process.hrtime();
	let res = art.map(l => l.join('')).join('');
	let timeEnd = process.hrtime(timeStart);
	accumulatedSerTime += timeEnd[0] + (timeEnd[1] / 1000000000)
	return res;
}

// const serializeArtBinary = art => art.map(l => l.join('')).map(c => c === '.' ? false : true).reduce((aggr, curr) => );

const formatInput = data => data.split('\n').map(l => {
	const r = l.split(' => ').map(l => l.trim())
	r[0] = r[0].replace(/\//g, '');
	return r;
}).reduce((aggr, current) => {
	aggr[current[0]] = current[1];
	return aggr;
}, {});

const splitArt = (art, split) => {
	let parts = [];
	for (let j = 0; j < art.length / split; j++) {
		for (let k = 0; k < art.length / split; k++) {
			let part = art
				.slice(j * split, (j + 1) * split)
				.map(r => r.slice(k * split, (k + 1) * split));
			// parts.push(serializeArt(part))
			parts.push(part);
		}
	}
	if (DEBUG) console.log('SPLIT DONE');
	if (DEBUG) console.log(parts.map(c => serializeArt(c)).join('\n'));
	return parts;
};

const copyTo = array => {
	let newArray = [];
	let n = array.length;
	for (let i = 0; i < n; i++) {
		let row = [];
		for (let j = 0; j < n; j++) {
			row.push(array[i][j]);
		}
		newArray.push(row);
	}
	return newArray;
};

const rotateArray = array => {
	let ret = copyTo(array);
	let n = array.length;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			ret[i][j] = array[n - j - 1][i];
		}
	}
	return ret;
};

const flipArray = array => {
	let ret = copyTo(array);
	let n = array.length;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			ret[i][n - j - 1] = array[i][j];
		}
	}
	return ret;
};

const findRule = (art, rules) => {
	let rule;
	let format = serializeArt(art);
	rule = rules[format];
	if (rule) {
		return rule;
	};
	let flip = copyTo(art);
	let rotate = copyTo(art);

	flip = flipArray(art);

	format = serializeArt(flip);
	rule = rules[format];
	if (rule) {
		format = serializeArt(art);
		rules[format] = rule;
		// rules.push([format, rule[1]]);
		return rule;
	}
	for (let i = 0; i < 3; i++) {
		rotate = rotateArray(rotate);

		format = serializeArt(rotate);
		rule = rules[format];
		if (rule) break;

		flip = flipArray(rotate);

		format = serializeArt(flip);
		rule = rules[format];
		if (rule) break;
	}
	format = serializeArt(art);

	rules[format] = rule;
	// rules.push([format, rule[1]]);
	if (DEBUG) console.log('RULE FOUND', serializeArt(art), rule);
	return rule;
};


const mergeArts = parts => {
	let canvas = [];
	let splitLength = parts[0].length;
	let newLength = Math.sqrt(parts.length) * splitLength;
	let sqrt = Math.sqrt(parts.length);
	if (DEBUG) console.log('splitLength', splitLength, 'newLength', newLength, 'sqrt', sqrt);
	if (parts.length > 1) {
		for (let j = 0; j < newLength; j++) {
			let row = [];
			for (let k = 0; k < newLength; k++) {
				let rx = (Math.floor(k / splitLength));
				let ry = Math.floor(j / splitLength) * (sqrt)
				let arrayindex = rx + ry;
				//if(DEBUG) console.log(j, k, arrayindex, 'rx', rx, 'ry', ry);
				row.push(parts[arrayindex][j % splitLength][k % splitLength]);
			}
			canvas.push(row);
		}
	} else {
		canvas = parts[0];
	}
	return canvas;
};

const mergeArtsMonitored = (parts) => {
	let timeStart = process.hrtime();
	let res = mergeArts(parts);
	let timeEnd = process.hrtime(timeStart);
	accumulatedMergeTime += timeEnd[0] + (timeEnd[1] / 1000000000)
	return res;
}


const findRuleMonitored = (art, rules) => {
	let timeStart = process.hrtime();
	let res = findRule(art, rules);
	let timeEnd = process.hrtime(timeStart);
	accumulatedFindTime += timeEnd[0] + (timeEnd[1] / 1000000000)
	return res;
}

const splitArtMonitored = (art, split) => {
	let timeStart = process.hrtime();
	let res = splitArt(art, split);
	let timeEnd = process.hrtime(timeStart);
	accumulatedSplitTime += timeEnd[0] + (timeEnd[1] / 1000000000)
	return res;
}

let accumulatedMergeTime = 0;
let accumulatedFindTime = 0;
let accumulatedSplitTime = 0;
let accumulatedSerTime = 0;

const compute = rules => {
	const start = `.#.\n..#\n###`.split('\n').map(c => c.split(''));
	printArt(start);
	let art = start;
	let parts = [];
	for (let i = 0; i < 18; i++) {
		console.log('\n**** ITERATION ' + (i + 1) + ' ****');
		let split = art.length % 2 === 0 ? 2 : 3;

		parts = splitArtMonitored(art, split);
		console.log(parts.length);
		for (let j = 0; j < parts.length; j++) {
			const part = parts[j];

			const ruleResult = findRuleMonitored(part, rules);
			// if (!ruleResult) {
			// 	console.log('BIG PROBLEM, rule not found', serializeArt(part));
			// 	return art;
			// }

			parts[j] = formatArt(ruleResult);
		}
		art = mergeArtsMonitored(parts);
		if (DEBUG) {
			console.log('RESULT');
			printArt(art);
		}
	}
	// console.log(rules.length)
	return art.reduce(
		(aggr, curr) => aggr + curr.reduce((count, current) => count + (current === '#'), 0),
		0,
	);
};

//part 1 179
//part 2 2766750