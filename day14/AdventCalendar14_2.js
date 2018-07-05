const knot = require("../day10/AdventCalendar10_2")

const getKnotHashBinary = (hash) => hash.split('').map(c => hexToBin(c)).join('');

const hexToBin = (input) => {
    return ("0000" + (parseInt(input, 16)).toString(2)).substr(-4);
}

const printMatrix = (matrix) => {


    for (let i = 0; i < matrix.length; i++) {
        if (i > 8) break;
        console.log(matrix[i].slice(0, 8).reduce((arr, current) => {
            if (current === true)
                return arr + '#';
            if (current === false) {
                return arr + '.';
            }
            return arr + current;
        }, ''));
    }

}

const countPositiveBits = (matrix) => matrix.reduce((agg, row) => agg + row.reduce((rowSum, item) => rowSum + item, 0), 0);

const buildDiskMatrix = (input) => {
    let length = 128;
    let matrix = [];
    for (let i = 0; i < length; i++) {
        let rowInput = input + '-' + i;
        let hash = knot.getKnotHash(rowInput);
        let row = getKnotHashBinary(hash);

        matrix.push(row.split('').map(c => c === '1'));
    }
    return matrix;
}

const findAdjacents = (matrix, x, y, regions, currentRegion) => {
    if (!regions[currentRegion - 1]) {
        regions[currentRegion - 1] = []
    }
    regions[currentRegion - 1].push({
        x,
        y
    });
    matrix[x][y] = currentRegion;

    if (matrix[x + 1] && matrix[x + 1][y] === true) {
        findAdjacents(matrix, x + 1, y, regions, currentRegion);
    }
    if (matrix[x - 1] && matrix[x - 1][y] === true) {
        findAdjacents(matrix, x - 1, y, regions, currentRegion);
    }

    if (matrix[x][y + 1] === true) {
        findAdjacents(matrix, x, y + 1, regions, currentRegion);
    }
    if (matrix[x][y - 1] === true) {
        findAdjacents(matrix, x, y - 1, regions, currentRegion);
    }
}

const compute = (input) => {
    let matrix = buildDiskMatrix(input);
    let regions = [];
    printMatrix(matrix);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === true) {
                findAdjacents(matrix, i, j, regions, regions.length + 1);

                printMatrix(matrix);
            }
        }
    }
    // printMatrix(matrix);

    return regions.length;
}

let input = 'oundnydw'

console.log(compute(input));

// Solution 1164