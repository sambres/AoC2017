const fs = require('fs');

fs.readFile('./puzzle_input/13.txt', 'utf8', (err, data) => {
    let timeStart = process.hrtime();
    if (err) {
        throw err;
    }

    const depthRanges = formatInput(data);

    console.log(depthRanges);
    console.log(compute(depthRanges));

    let timeEnd = process.hrtime(timeStart);
    console.info("Execution (hr): %ds %dms", timeEnd[0], timeEnd[1] / 1000000);

});

const formatInput = i => i.split('\n').map(s => s.match(/(\d+): (\d+)/)).reduce((a, b) => {
    a[b[1]] = b[2];
    return a;
}, {});


const isDelayValid = (depthRanges, maxDepth, delay) => {
    return !Array(maxDepth + 1).fill(0).some((r, index) => getRadarPosition(depthRanges, index, index + delay) === 0)
}


const printRadars = (depthRanges, radars, position) => {
    let maxRange = Math.max(...Object.values(depthRanges));
    for (let i = -1; i < maxRange; i++) {
        let string = '';
        for (let d = 0; d < radars.length; d++) {
            let radar = radars[d];

            if (i === -1) {
                string += ` ${d}  `;
            } else if (depthRanges[d] === undefined) {
                if (i === 0) {
                    if (position === d) {
                        string += `(.) `;
                    } else {
                        string += `... `;
                    }
                } else {
                    string += `    `;
                }
            } else if (i >= depthRanges[d]) {
                string += `    `;
            } else if (i < depthRanges[d]) {
                if (radar === i) {
                    if (position === d && i === 0) {
                        string += `(S) `;
                    } else {
                        string += `[S] `;
                    }
                } else {
                    if (position === d && i === 0) {
                        string += `( ) `;
                    } else {
                        string += `[ ] `;
                    }
                }
            }
        }
        console.log(string);
    }
}

const advanceRadars = (depthRanges, radars, step) => radars.map((p, i) => getRadarPosition(depthRanges, i, step))

const getRadarPosition = (depthRanges, index, step) => {
    let r = (depthRanges[index] || 1) - 1;
    p = step;
    return ((Math.floor(p / r) + 1) % 2) * (p % r) + ((Math.floor(p / r)) % 2) * (r - (p % r));
}

const compute = (depthRanges) => {
    const maxDepth = Math.max(...Object.keys(depthRanges))
    let radarPositions = Array(maxDepth + 1).fill(0);

    let collision = false;
    let pathNotFound = true;
    let delay = 0;
    while (pathNotFound) {
        if (isDelayValid(depthRanges, maxDepth, delay)) {
            radarPositions = Array(maxDepth + 1).fill(0);

            pathNotFound = false;
        } else {
            delay++;
        }
    }
    return delay;
}


// Solution 3921270


// console.log("RadarPositions", radarPositions);

// console.log(isDelayValid(3921270))
// console.log(compute());