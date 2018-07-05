const {
    fn
} = require('../chaining.js')
const fs = require('fs');

fs.readFile('./puzzle_input/11.txt', 'utf8', (err, data) => {
    let timeStart = process.hrtime();
    if (err) {
        throw err;
    }

    const input = formatInput(data);
    console.log(calculateHexDist(input)); //643

    let part0 = countDistances(input);
    console.log(part0);
    let part1 = simplifyOppositeDists(part0);
    console.log(part1);
    let part2 = simplifyDiagDists(part1);
    console.log(part2);
    let part3 = calculateManDist(part2);
    console.log(part3);

    let timeEnd = process.hrtime(timeStart);
    console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});
let formatInput = (a) => a.replace(/\n/g, '').split(',');

const countDistances = (list) => {
    const dists = list.reduce((a, b) => {
        if (a[b]) {
            a[b]++;
        } else {
            a[b] = 1;
        }
        return a;
    }, {
        n: 0,
        ne: 0,
        nw: 0,
        s: 0,
        se: 0,
        sw: 0,
    });
    return dists;
}

const simplifyOppositeDists = (dists) => {
    let newDists = {};
    newDists.n = Math.max(0, dists.n - dists.s);
    newDists.s = Math.max(0, dists.s - dists.n);
    newDists.ne = Math.max(0, dists.ne - dists.sw);
    newDists.sw = Math.max(0, dists.sw - dists.ne);
    newDists.nw = Math.max(0, dists.nw - dists.se);
    newDists.se = Math.max(0, dists.se - dists.nw);
    return newDists;
}

const simplifyDiagDists = (dists) => {
    if (dists.nw > dists.ne) {
        dists.n += dists.ne;
        dists.nw = dists.nw - dists.ne;
        dists.ne = 0;
    }

    return dists;
}

const calculateManDist = (dists) => {
    return (dists.n - dists.s) + (dists.ne - dists.sw) + (dists.nw - dists.se);
}

const calculateHexDist = (input) => {
    return fn(input)
        .then(countDistances)
        .then(simplifyOppositeDists)
        .then(simplifyDiagDists)
        .then(calculateManDist).data
}