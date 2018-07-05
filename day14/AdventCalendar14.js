const knot = require("../day10/AdventCalendar10_2")

const getKnotHashBinary = (hash) => hash.split('').map(c => hexToBin(c)).join('');

const hexToBin = (input) => {
    return ("0000" + (parseInt(input, 16)).toString(2)).substr(-4);
}

const printMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        if (i > 8) break;
        console.log(matrix[i].slice(0, 8).reduce((arr, current) => arr + (current ? '#' : '.'), ''));
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

const compute = (input) => {
    let matrix = buildDiskMatrix(input);
    printMatrix(matrix);

    return countPositiveBits(matrix);
}

let input = 'oundnydw'

console.log(compute(input));

// Solution 8106