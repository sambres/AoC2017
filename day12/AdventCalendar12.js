const fs = require('fs');


fs.readFile('./puzzle_input/12.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}

	inputGlobal = formatInput(data);

	let tree = new Node(0);

	let result = compute(inputGlobal);
	console.log(result);

	// buildTreeOld(inputGlobal, tree);

	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});

let inputGlobal;

const formatInput = input =>
	input.split('\n').map(s =>
		s
		.replace(/\d+ <-> /, '')
		.split(',')
		.map(v => parseInt(v)),
	);


class Node {
	constructor(value, parent, childs) {
		this.value = value;
		this.parent = parent;
		this.childs = [];
		if (childs) {
			this.addChilds(childs);
		}
	}

	addChilds(childs) {
		for (const child of childs) {
			this.addChild(child);
		}
	}
	addChild(child) {
		if (!this.childs.some(c => child === c.value)) {
			this.childs.push(new Node(child, this.value));
		}
	}

	hasChild(value) {
		if (value === this.value) {
			return true;
		} else {
			for (const child of this.childs) {
				if (child.hasChild(value)) {
					return true;
				}
			}
		}
		return false;
	}
}

const addNode = (parent, child, node) => {
	let success = false;

	// Si le node actuel est le parent
	if (node.value == parent && node.parent != child) {
		// On lui rajoute l'enfant
		node.addChild(child);
		return true;
	} else {
		// Sinon on passe au suivant
		for (const childNode of node.childs) {
			// if (addNode(parent, child, childNode)) return true;
			success = addNode(parent, child, childNode);
		}
	}
	return false;
};

const printTree = (tree, depth = 0) => {
	console.log('|', Array(depth + 1).join('->'), tree.value);
	if (tree.childs) {
		for (const child of tree.childs) {
			printTree(child, depth + 1);
		}
	}
};

const buildTreeOld = input => {
	let tree = new Node(0, undefined, input[0]);
	let successList = [];
	let cursor = 0;
	for (let i = 0; i < input.length; i++) {
		cursor = i;
		let childs = input[cursor];
		for (let j = 0; j < childs.length; j++) {
			console.log(cursor, childs[j]);
			if (addNode(cursor, childs[j], tree)) { // && !successList.some(c => c == cursor)) {
				successList.push(i);
			}
		}
	}
	printTree(tree);
	console.log(tree);
	console.log(successList.length + 1);
	console.log("true", tree.hasChild(5));
	console.log(tree.hasChild(0));
	console.log(tree.hasChild(1));
};

const addNodeFull = (tree, cursor, successList) => {
	let childs = inputGlobal[cursor];

	if (childs) {
		// console.log(cursor);
		for (let j = 0; j < childs.length; j++) {
			if (addNode(cursor, childs[j], tree) && !successList.some(c => c == cursor)) {
				successList.push(cursor);
			}
			if (!successList.some(c => c == childs[j])) {
				successList = addNodeFull(tree, childs[j], successList);
			}
		}
	} else {
		console.log('Childs error', cursor, childs);
	}

	return successList;
};

const buildTree = (input, tree) => {
	let cursor = 0;
	let childs = inputGlobal[cursor];
	let successList = [];
	successList = addNodeFull(tree, i, successList);
	// successList = addNodeFull(tree, 0, successList);

	printTree(tree);
	console.log(successList.length + 1);
};

const lookFor0 = (node, chain) => {
	// console.log(node);
	let childs = inputGlobal[node];
	if (childs.indexOf(0) !== -1) {
		return true;
	} else {
		for (const child of childs) {
			if (
				chain.indexOf(child) === -1 &&
				child !== node &&
				lookFor0(child, [child].concat(chain))
			) {
				return true;
			}
		}
	}
	return false;
};

const compute = input => {
	const successProcess = [];
	for (let i = 0; i < input.length; i++) {
		let childs = input[i];

		for (const child of childs) {
			if (successProcess.indexOf(child) === -1) {
				// console.log(child);
				let chain = [child]
				if (lookFor0(child, chain)) {
					successProcess.push(child);
				}
			}
		}
	}
	// console.log(successProcess);
	return successProcess.length;
};


// printTree(tree);