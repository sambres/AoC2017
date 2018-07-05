const fs = require("fs");

fs.readFile("./puzzle_input/15.txt", 'utf8', (err, data) => {
    let timeStart = process.hrtime();

    const input = data.split('\n').map(c => c.trim());
    console.log(compute(input))

    let timeEnd = process.hrtime(timeStart);
    console.info("Execution (hr): %ds %dms", timeEnd[0], timeEnd[1] / 1000000);
})

class Generator {
    constructor(inputString, factor, divisor, specificFactor) {
        let matches = inputString.match(/Generator (\w) starts with (\d+)/);
        console.log(matches[1], factor, divisor);

        this.factor = factor;
        this.name = matches[1];
        this.currentValue = matches[2];
        this.divisor = divisor;
        this.specificFactor = specificFactor;
    }

    computeNext() {
        do {
            this.currentValue = (this.currentValue * this.factor) % this.divisor;
        } while (this.currentValue % this.specificFactor !== 0)
        // console.log(this.name, this.currentValue, this.getLowestBits());
        return this.getLowestBits();
    }

    getLowestBits() {
        let val = this.currentValue.toString(2);
        return val.substring(val.length - 16, val.length);
    }
}

const compute = (input) => {
    const generatorA = new Generator(input[0], 16807, 2147483647, 4);
    const generatorB = new Generator(input[1], 48271, 2147483647, 8);


    let count = 0;
    for (let i = 0; i < 5 * 1000 * 1000; i++) {
        if (generatorA.computeNext() === generatorB.computeNext()) {
            console.log("Success", generatorA.getLowestBits(), generatorB.getLowestBits(), i);
            count++;
        }
    }
    return count;
}

// Solution 328