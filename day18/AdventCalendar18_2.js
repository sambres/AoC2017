const fs = require('fs');
const DEBUG = true;
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
	// .map(c => c.split(' ').map(r => r.trim()))
	.map(c => c.match(/(\w{3}) (-?\w) ?(-?\w*)/))
	.map(m => ({
		command: m[1],
		name: m[2],
		arg: m[3],
	}));

const getArgValue = (arg, registries) => {
	// console.log(arg,if (DEBUG)  registries);
	if (isNaN(parseInt(arg))) {
		return registries[arg] || 0;
	} else {
		return parseInt(arg);
	}
};

class ProgramNew {
	constructor(id, program) {
		this.id = id;
		this.program = program;
		this.registers = {
			p: id
		};
		for (let c of program) {
			if (isNaN(c.name) && !this.registers[c.name]) {
				console.log(c, c.name);
				this.registers[c.name] = 0;
			}
			if (isNaN(c.arg) && !this.registers[c.arg]) {
				console.log(c, c.arg);
				this.registers[c.arg] = 0;
			}
		}
		this.queue = [];
		this.position = 0;
		this.ended = false;
		this.waiting = false;
		this.sendCount = 0;
	}

	getValue(arg) {
		// console.log(arg,if (DEBUG)  registries);
		if (isNaN(parseInt(arg))) {
			return this.registers[arg] || 0;
		} else {
			return parseInt(arg);
		};
	}

	next(other) {
		if (this.ended) return;
		const instruction = this.program[this.position];
		// console.log(this.registers);
		// console.log(instruction);
		switch (instruction.command) {
			case 'snd':
				this.sendCount += 1;
				if (this.id == 1) console.log(this.sendCount);
				other.queue.push(this.getValue(instruction.name));
				break;
			case 'set':
				this.registers[instruction.name] = this.getValue(instruction.arg);
				break;
			case 'add':
				this.registers[instruction.name] =
					this.getValue(instruction.name) + this.getValue(instruction.arg);
				break;
			case 'mul':
				this.registers[instruction.name] =
					this.getValue(instruction.name) *
					this.getValue(instruction.arg);
				break;
			case 'mod':
				this.registers[instruction.name] =
					this.getValue(instruction.name) %
					this.getValue(instruction.arg);
				break;
			case 'rcv':
				if (this.queue.length > 0) {
					this.registers[instruction.name] = this.queue.shift();
					this.waiting = false;
				} else {
					console.log('WAITING');
					this.waiting = true;
					if (other.ended || other.waiting) this.ended =
						true;
					return;
				}
				break;
			case 'jgz':
				if (this.getValue(instruction.name) > 0) {
					this.position += this.getValue(instruction.arg);
					return;
				}
				break;
		}
		this.position++;

		if (this.position >= this.program.length) {
			this.ended = true;
		}
	}
}

const computeOld = input => {
	let registries1 = {
		p: 1,
	};
	let registries0 = {
		p: 0,
	};
	let queue1 = [],
		queue0 = [];
	let position0 = 0,
		position1 = 0;
	let isAwaiting0 = false,
		isAwaiting1 = true,
		hasSent0 = false,
		hasSent1 = false;
	let sent = 0;
	let j = 0;

	// for (let i = 0; i < 1500; i++) {
	while (
		position0 >= 0 &&
		position0 < input.length &&
		position1 >= 0 &&
		position1 < input.length &&
		j < 76186
	) {
		j++;
		// while (input[position0].command != 'rcv') {
		if (DEBUG) console.log('------- ' + (j) + ' --------');
		// if (isAwaiting1) {

		if (DEBUG) console.log('	***** 0	*****	');
		({
			isAwaiting: isAwaiting0,
			hasSent: hasSent0,
			position: position0,
		} = runProgram(input, position0, registries0, queue0, queue1));
		// if (isAwaiting0 && queue1.length > 0) {
		// 	isAwaiting1 = false;
		// }
		// }
		// if (isAwaiting0) {

		if (DEBUG) console.log('	***** 1	*****	');
		({
			isAwaiting: isAwaiting1,
			hasSent: hasSent1,
			position: position1,
		} = runProgram(input, position1, registries1, queue1, queue0));
		// if (isAwaiting1 && queue0.length > 0) {
		// 	isAwaiting0 = false;
		// }
		// }

		if (hasSent1) {
			console.log(sent++);
			hasSent1 = false;
		}
		if (isAwaiting0 && isAwaiting1) {
			console.log('DEADLOCK');
			break;
		}
		if (DEBUG) console.log(position0, position1)
	}
	return sent;
};


const compute = input => {
	let program0 = new ProgramNew(0, input);
	let program1 = new ProgramNew(1, input);
	let j = 0;

	// for (let i = 0; i < 1500; i++) {
	while (!(program0.ended && program1.ended) &&
		j < 76186) {
		if (DEBUG) console.log('------- ' + (j) + ' --------');
		j++;

		program0.next(program1);
		program1.next(program0);
	}
	return program1.sendCount;
};

function runProgram(input, position, registries, queue, otherQueue) {
	let instruction = input[position];
	if (DEBUG) {
		console.log(registries);
		console.log(instruction);
	}

	({
		isAwaiting,
		hasSent
	} = doInstruction(instruction, registries, queue, otherQueue));
	if (isAwaiting) {
		console.log('WAITING RECEIVED')
	}
	position = getNextPosition(instruction, registries, position, isAwaiting);

	return {
		isAwaiting,
		hasSent,
		position
	};
}

function getNextPosition(instruction, registries, position, isAwaiting) {
	if (isAwaiting) return position;
	if (instruction.command === 'jgz' && registries[instruction.name] > 0) {
		position += getArgValue(instruction.arg, registries);
	} else {
		position += 1;
	}
	return position;
}

function doInstruction(instruction, registries, queue, otherQueue) {
	let isAwaiting = false,
		hasSent = false;
	switch (instruction.command) {
		case 'snd':
			hasSent = true;
			otherQueue.push(getArgValue(instruction.name, registries));
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
				getArgValue(instruction.name, registries) *
				getArgValue(instruction.arg, registries);
			break;
		case 'mod':
			registries[instruction.name] =
				getArgValue(instruction.name, registries) %
				getArgValue(instruction.arg, registries);
			break;
		case 'rcv':
			if (queue.length > 0) {
				registries[instruction.name] = queue.shift();
				isAwaiting = false;
			} else {
				console.log('WAITING');
				isAwaiting = true;
			}
			break;
	}
	return {
		isAwaiting,
		hasSent,
	};
}

class Program {
	constructor(id, program) {
		this.id = id;
		this.program = program;
		this.registers = {
			p: id
		};
		for (let c of program) {
			if (c.length < 2) continue;
			for (let arg of c.slice(1)) {
				if (isNaN(arg) && this.registers[arg] ===
					undefined) {
					console.log(c, arg);
					this.registers[arg] = 0;
				}
			}
		}
		this.queue = [];
		this.i = 0;
		this.ended = false;
		this.waiting = false;
		this.sendCount = 0;
	}

	val(x) {
		let n = parseInt(x, 10);
		if (!isNaN(n)) return n;

		if (this.registers[x] === undefined) {
			this.registers[x] = 0;
		}
		return this.registers[x];
	}

	next(other) {
		if (this.ended) return;
		let c = this.program[this.i];
		if (c[0] === 'snd') {
			this.sendCount++;
			if (this.id == 1) console.log(this.sendCount);
			other.queue.push(this.val(c[1]));
		} else if (c[0] === 'set') {
			this.registers[c[1]] = this.val(c[2]);
		} else if (c[0] === 'add') {
			this.registers[c[1]] = this.val(c[1]) + this.val(c[
				2]);
		} else if (c[0] === 'mul') {
			this.registers[c[1]] = this.val(c[1]) * this.val(c[
				2]);
		} else if (c[0] === 'mod') {
			this.registers[c[1]] = this.val(c[1]) % this.val(c[
				2]);
		} else if (c[0] === 'rcv') {
			if (this.queue.length === 0) {
				this.waiting = true;
				if (other.ended || other.waiting) this.ended =
					true;
				return;
			}

			this.waiting = false;
			this.registers[c[1]] = this.queue.splice(0, 1)[0];
		} else if (c[0] === 'jgz') {
			if (this.val(c[1]) > 0) {
				this.i += this.val(c[2]);
				return;
			}
		}

		this.i++;
		if (this.i >= this.program.length) {
			this.ended = true;
		}
	}

}

const computeNew = (input) => {
	const program0 = new Program(0, input);
	const program1 = new Program(1, input);
	let j = 0;

	// for (let i = 0; i < 1500; i++) {
	while (!(program0.ended && program1.ended)) {
		// while (input[position0].command != 'rcv') {
		if (DEBUG) console.log('------- ' + (j++) + ' --------');

		program0.next(program1);
		program1.next(program0);

	}
	return program1.sendCount;
}
//130 too low
//884828 too high