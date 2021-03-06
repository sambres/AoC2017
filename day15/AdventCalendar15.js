const fs = require("fs");

fs.readFile("./puzzle_input/15.txt", 'utf8', (err, data) => {
    let timeStart = process.hrtime();

    const input = data.split('\n').map(c => c.trim());
    console.log(compute(input))

    let timeEnd = process.hrtime(timeStart);
    console.info("Execution (hr): %ds %dms", timeEnd[0], timeEnd[1] / 1000000);
})

class Generator {

    constructor(inputString, factor, divisor) {
        let matches = inputString.match(/Generator (\w) starts with (\d+)/);
        console.log(matches[1], factor, divisor);

        this.factor = factor;
        this.name = matches[1];
        this.currentValue = matches[2];
        this.currentLowestBits = this.computeLowestBits();
        this.divisor = divisor;
    }

    computeNext() {
        this.currentValue = (this.currentValue * this.factor) % this.divisor;
        return this.computeLowestBits();
    }

    computeLowestBits() {
        return this.currentLowestBits = (this.currentValue & 0xFFFF);
        // let val = this.currentValue.toString(2);
        // return this.currentLowestBits = val.substring(val.length - 16, val.length);
    }

    getLowestBits() {
        return this.currentLowestBits;
    }
}

const compute = (input) => {
    const generatorA = new Generator(input[0], 16807, 2147483647);
    const generatorB = new Generator(input[1], 48271, 2147483647);
    const mask = 0xFFFF; // ou 0xFFFF
    const regex = /Generator \w starts with (\d+)/;

    let a = parseInt(input[0].match(regex)[1]);
    let b = parseInt(input[1].match(regex)[1]);
    let count = 0;
    for (let i = 0; i < 1000 * 1000 * 40; i++) {

        /* Fast Solution */
        a = (a * 16807) % 2147483647;
        b = (b * 48271) % 2147483647;

        if ((a & mask) === (b & mask)) {
            console.log("Success", a & mask, b & mask);
            count += 1;
        }

        /* Slow Solution
        generatorA.computeNext();
        generatorB.computeNext();

        if (generatorA.computeLowestBits() === generatorB.computeLowestBits()) {
            // console.log("Success", generatorA.getLowestBits(), generatorB.getLowestBits());
            count++;
        }
        */
    }
    return count;
}

// Solution 594