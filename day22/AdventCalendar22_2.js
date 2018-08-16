const fs = require('fs');

const DEBUG = false;
fs.readFile('./puzzle_input/22.txt', 'utf8', (err, data) => {
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
    });

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
};

const formatInput = input =>
    input.split('\n').map(l =>
        l
        .trim()
        .split('')
        .map(c => c === '#'),
    );

const recordInfection = input => {
    const collection = {};
    const radius = (input.length - 1) / 2;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j]) {
                collection[j - radius + ':' + (-i + radius)] = '#';
            }
        }
    }
    return collection;
};

const recordInfectionMap = input => {
    const collection = new Map();
    const radius = (input.length - 1) / 2;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j]) {
                // collection.set([(j - radius), ((-i) + radius)], '#');
                collection.set(j - radius + ':' + (-i + radius), '#');
                // collection[(j - radius) + ':' + ((-i) + radius)] = '#';
            }
        }
    }
    return collection;
};

const getNode = (collection, x, y) => collection.get(x + ':' + y);

const directionsReverse = ['N', 'W', 'S', 'E'];

const writeNodeFile = infecteds => {
    let content = '';
    let max = 0,
        min = 0;

    // Object.keys(infecteds).forEach(key => {
    infecteds.forEach((v, key) => {
        let [total, x, y] = key.match(/(-?\d+):(-?\d+)/);
        x = parseInt(x);
        y = parseInt(y);
        min = x < min ? x : min;
        min = y < min ? y : min;
        max = x > max ? x : max;
        max = y > max ? y : max;
    });

    for (let i = max; i >= min; i--) {
        let row = '';
        for (let j = min; j <= max; j++) {
            // if(currentX == j && currentY == i) row += '[';
            // else row += ' ';
            row += getNode(infecteds, j, i) || '.';
            // if(currentX == j && currentY == i) row += ']';
            // else row += ' ';
        }
        content += row + '\n';
    }
    fs.writeFile('result.txt', content, 'utf8', err => {});
};

const statesCollection = [
    ['.', -2],
    ['F', 0],
    ['A', 0],
    ['E', -1],
    ['I', -2],
    ['#', -1]
];

// let states = {
//     '.': {
//         move: 1,
//         // newState: 'F'
//     },
//     F: {
//         move: 1,
//         // newState: 'W'
//     },
//     W: {
//         move: -1,
//         // newState: '#'
//     },
//     '#': {
//         move: -1,
//         // newState: '.'
//     },
// };

const initStates = (states) => {
    let temp = {};
    states.map((s, index, array) => {
        let nextIndex = index === array.length - 1 ? 0 : index + 1;

        temp[s[0]] = {
            move: s[1],
            newState: array[nextIndex][0]
        }
    });
    return temp;
}

const mod = (i, n) => ((i % n) + n) % n;

const moveDirection = (dir, change) =>
    directionsReverse[mod(directionsReverse.indexOf(dir) + change, 4)];

const compute = input => {
    let infecteds = recordInfectionMap(input);
    let states = initStates(statesCollection);
    let x = 0,
        y = 0;
    let dx = 1,
        dy = 0;
    let direction = 'N';
    let count = 0;
    console.log(states)
    for (let i = 0; i < 10000; i++) {
        // printInfected(infecteds, x, y);
        let key = x + ':' + y;
        let state = infecteds.get(key);
        let newState = states[state || '.'];
        infecteds.set(key, newState.newState);
        direction = moveDirection(direction, newState.move);

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
    writeNodeFile(infecteds);

    return count;
};
// 2512225