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


const formatInput = input => input.split('\n').map(l => l.split('').map(c => c === '#'));

const recordInfection = input => {
    const collection = {};
    const radius = (input.length - 1) / 2;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j]) {
                collection[(i - radius) + '-' + (j - radius)] = true;
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
    for (let i = 0; i < 70; i++) {
        if (getNode(infecteds, x, y)) {
            direction = directionsReverse[(directionsReverse.indexOf(direction) + 1) % 4];
            delete infecteds[x + ':' + y];
        } else {
            direction = directionsReverse[mod(directionsReverse.indexOf(direction) - 1, 4)];
            infecteds[x + ':' + y] = true;
            count++;
        }
        console.log(direction, directionsReverse.indexOf(direction),
         (directionsReverse.indexOf(direction) + 1) % 4, 
        directions[mod(directionsReverse.indexOf(direction) + 1, 4)]);
        switch (direction) {
            case 'N':
                x += 1;
                break;
            case 'S':
                x -= 1;
                break;
            case 'E':
                y -= 1;
                break;
            case 'w':
                y += 1;
                break;
        }
    }

    return count;
}