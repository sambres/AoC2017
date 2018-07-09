const fs = require('fs');

const DEBUG = false;
fs.readFile('./puzzle_input/22_test.txt', 'utf8', (err, data) => {
    let timeStart = process.hrtime();
    if (err) {
        throw err;
    }

    const input = formatInput(data);
    // console.log(input);
    console.log(compute(input));

    let timeEnd = process.hrtime(timeStart);
    console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);

});

const printInfected = (infecteds, currentX, currentY) => {
    let max = 0,
        min = 0;

    Object.keys(infecteds).forEach(key => {
        let [total, x, y] = key.match(/(-?\d+):(-?\d+)/);
        x = parseInt(x);
        y = parseInt(y);
        min = x < min ? x : min;
        min = y < min ? y : min;
        max = x > max ? x : max;
        max = y > max ? y : max;
    })

    for (let i = max; i >= min; i--) {
        let row = '';
        for (let j = min; j <= max; j++) {
            // if(currentX == j && currentY == i) row += '[';
            // else row += ' ';
            row += getNode(infecteds, j, i) || '.';
            // if(currentX == j && currentY == i) row += ']';
            // else row += ' ';
        }
        console.log(row);
    }
}

const formatInput = input => input.split('\n').map(l => l.trim().split('').map(c => c === '#'));

const recordInfection = input => {
    const collection = {};
    const radius = (input.length - 1) / 2;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j]) {
                collection[(j - radius) + ':' + ((-i) + radius)] = '#';
            }
        }
    }
    return collection;
}

const getNode = (collection, x, y) => collection[x + ':' + y]

const directions = {
    'N': 0,
    'W': 1,
    'S': 2,
    'E': 3
}

const directionsReverse = ['N', 'W', 'S', 'E']

const mod = (i, n) => ((i % n) + n) % n

const compute = (input) => {
    let infecteds = recordInfection(input);
    let x = 0,
        y = 0;
    let dx = 1,
        dy = 0;
    let direction = 'N';
    let count = 0;
    for (let i = 0; i < 10000000; i++) {
        // printInfected(infecteds, x, y);
        // switch (getNode(infecteds, x, y)) {
        switch (infecteds[x + ':' + y]) {
            case 'W':
                // Weakened
                infecteds[x + ':' + y] = '#';
                count++;
                // console.log(count);
                break;
            case 'F':
                direction = directionsReverse[mod(directionsReverse.indexOf(direction) - 2, 4)];
                delete infecteds[x + ':' + y];
                break;
            case '#':
                direction = directionsReverse[(directionsReverse.indexOf(direction) + 1) % 4];
                infecteds[x + ':' + y] = 'F';
                break;
            default:
                direction = directionsReverse[mod(directionsReverse.indexOf(direction) - 1, 4)];
                infecteds[x + ':' + y] = 'W';
                break;

        }
        // console.log(direction, x, y);

        switch (direction) {
            case 'N':
                y += 1;
                break;
            case 'S':
                y -= 1;
                break;
            case 'E':
                x -= 1;
                break;
            case 'W':
                x += 1;
                break;
        }
    }
    // writeNodeFile(infecteds);

    return count;
}