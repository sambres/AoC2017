const fs = require('fs');

fs.readFile('./puzzle_input/19.txt', 'utf8', (err, data) => {
	let timeStart = process.hrtime();
	if (err) {
		throw err;
	}

	const input = formatInput(data);
	// printMaze(input);
	console.log(compute(input));
	console.log(input.length, input[0].length) //201 202

	// console.log(walkPath(input, [0, 5], 'S'));

	let timeEnd = process.hrtime(timeStart);
	console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});


const printMaze = (maze) => {
	console.log(' ' + Array(maze[0].length).fill().map((c, i) => i.toString().padStart(2)).join(''))
	for (let i = 0; i < maze.length; i++) {
		console.log(i + maze[i].map(c => c.padStart(2)).join(''));
	}
}

const formatInput = (data) => data.split('\n').map(l => l.split(''));

class Packet {
	constructor(position) {
		this.position = position || [0, 0];
		this.end = false;
		this.direction = 'S';
		this.stepCount = 1;
		this.letters = ''
		this.dx = 1;
		this.dy = 0;
	}
}

const compute = (input) => {
	let startPoint = input[0].findIndex(c => c != ' ');
	let end = false;
	let direction = '';
	let packet = new Packet([0, startPoint]);

	while (!packet.end) {

		// for (let i = 0; i < 50; i++) {
		packet = walkPath(input, packet);
		// console.log(packet.position);
	}

	return packet.letters;
}


const walkPathOld = (maze, packet) => {
	const currentPoint = packet.position;
	let newPoint = undefined;
	let expectedCharacter = undefined;
	// console.log(packet);
	switch (packet.direction) {
		case 'N':
			if (currentPoint[0] - 1 < 0) packet.end = true;
			newPoint = [currentPoint[0] - 1, currentPoint[1]];
			break;
		case 'S':
			if (currentPoint[0] + 1 >= maze.length) packet.end = true;
			newPoint = [currentPoint[0] + 1, currentPoint[1]]
			break;
		case 'E':
			if (currentPoint[1] - 1 < 0) packet.end = true;
			newPoint = [currentPoint[0], currentPoint[1] - 1]
			break;
		case 'W':
			if (currentPoint[1] + 1 >= maze[currentPoint[0]].length) packet.end = true;
			newPoint = [currentPoint[0], currentPoint[1] + 1]
			break;
	}
	if (packet.end === true) {
		return packet;
	}
	packet.stepCount++;
	packet.position = newPoint;

	let nextPoint = undefined;
	switch (maze[newPoint[0]][newPoint[1]]) {
		case '-':
		case '|':
			break;
		case '+':
			switch (packet.direction) {
				case 'S':
				case 'N':
					nextPoint = maze[newPoint[0]][newPoint[1] + 1];
					if (nextPoint && (nextPoint === '-' || nextPoint.match(/\w/))) {
						if (nextPoint.match(/\w/)) {
							packet.letters += nextPoint;
						}
						packet.position[1] += 1;
						packet.direction = 'W';
						break;
					}
					nextPoint = maze[newPoint[0]][newPoint[1] - 1];
					if (nextPoint && (nextPoint === '-' || nextPoint.match(/\w/))) {
						if (nextPoint.match(/\w/)) {
							packet.letters += nextPoint;
						}
						packet.position[1] -= 1;
						packet.direction = 'E';
					}
					break;
				case 'E':
				case 'W':
					nextPoint = maze[newPoint[0] + 1][newPoint[1]];
					if (nextPoint && (nextPoint === '|' || nextPoint.match(/\w/))) {
						if (nextPoint.match(/\w/)) {
							packet.letters += nextPoint;
						}
						packet.direction = 'S';
						packet.position[0] += 1;
						break;
					}
					nextPoint = maze[newPoint[0] - 1][newPoint[1]];

					if (nextPoint && (nextPoint === '|' || nextPoint.match(/\w/))) {
						if (nextPoint.match(/\w/)) {
							packet.letters += nextPoint;
						}
						packet.direction = 'N';
						packet.position[0] -= 1;
					}
					break;
			}
			packet.stepCount++;
			break;
		case ' ':
			packet.end = true;
			break;
		default:
			if (maze[newPoint[0]][newPoint[1]].match(/\w/)) {
				console.log(packet);
				if (maze[newPoint[0]][newPoint[1]] == 'K') {
					console.log('END')
				}

				packet.letters += maze[newPoint[0]][newPoint[1]];

			}
			break;
	}
	return packet;
}


const walkPath = (maze, packet) => {
	const currentPoint = packet.position;
	let dx = packet.dx;
	let dy = packet.dy;
	let x = currentPoint[0];
	let y = currentPoint[1];
	let currentChar = maze[x][y];


	if (currentChar.match(/[A-Z]/)) {
		packet.letters += currentChar;
	} else if (currentChar === ' ') {
		packet.end = true;
	} else if (currentChar === '+') {
		if (dx === 0) {
			dy = 0;
			if (maze[x + 1][y] == '|') {
				dx = 1;
			} else {
				dx = -1;
			}
		} else {
			dx = 0;
			if (maze[x][y + 1] == '-') {
				dy = 1;
			} else {
				dy = -1;
			}
		}
		packet.dx = dx;
		packet.dy = dy;
	}
	packet.stepCount++;
	packet.position[0] += dx;
	packet.position[1] += dy;
	return packet;
}

// GEPYAWTMLK
// GEPYAWTMLK
// 17627 too low
// 17628