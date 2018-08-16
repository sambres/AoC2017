const fs = require('fs');
const DEBUG = true;

fs.readFile('./puzzle_input/23.txt', 'utf8', (err, data) => {
    let timeStart = process.hrtime();
    if (err) {
        throw err;
    }
    const input = formatInput(data);
    console.log(compute(input));

    let timeEnd = process.hrtime(timeStart);
    console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});

const formatInput = data =>
    data
    .split('\n')
    // .map(c => c.split(' ').map(r => r.trim()))
    .map(c => c.match(/(\w{3}) (-?\w) ?(-?\w*)/))
    .map(m => ({
        command: m[1],
        name: m[2],
        arg: m[3],
    }));

class Program {
    constructor(id, program) {
        this.id = id;
        this.program = program;
        this.registers = {
            a: id
        };
        for (let c of program) {
            if (isNaN(c.name) && !this.registers[c.name]) {
                this.registers[c.name] = 0;
            }
            if (isNaN(c.arg) && !this.registers[c.arg]) {
                this.registers[c.arg] = 0;
            }
        }
        this.queue = [];
        this.position = 0;
        this.mulCount = 0;
        this.ended = false;
        this.waiting = false;
    }

    getValue(arg) {
        // console.log(arg,if (DEBUG)  registries);
        if (isNaN(parseInt(arg))) {
            return this.registers[arg] || 0;
        } else {
            return parseInt(arg);
        };
    }

    next() {
        if (this.ended) return;
        const instruction = this.program[this.position];

        console.log(this.registers);
        console.log(this.position, instruction);
        switch (instruction.command) {
            case 'set':
                this.registers[instruction.name] = this.getValue(instruction.arg);
                break;
            case 'sub':
                this.registers[instruction.name] = this.getValue(instruction.name) - this.getValue(instruction.arg);
                break;
            case 'mul':
                this.mulCount++;
                this.registers[instruction.name] =
                    this.getValue(instruction.name) *
                    this.getValue(instruction.arg);
                break;
            case 'jnz':
                if (this.getValue(instruction.name) !== 0) {
                    this.position += this.getValue(instruction.arg);
                    if (this.position >= this.program.length) {
                        this.ended = true;
                    }
                    return;
                }
                break;
        }
        this.position++;

        if (this.position >= this.program.length) {
            this.ended = true;
        }
    }
}

const compute = (input) => {
    let r = {
        b: 99,
        c: 99,
        d: 0,
        f: 0,
        g: 0,
        h: 0
    }
    r['b'] = r['b'] * 100 + 100000
    r['c'] = r['b'] + 17000
    do {
        r['f'] = 1
        r['d'] = 2
        for (let d = r['d']; d * d < r['b']; ++d) {
            if (r['b'] % d === 0) {
                r['f'] = 0
                break
            }
        }
        if (r['f'] === 0) r['h']++
        r['g'] = r['b'] - r['c']
        r['b'] += 17
    } while (r['g'] !== 0)

    return r['h']
}
// 1 failed
// 0 failed fo part 2
// -1 failed for part 2
// 1 failed for part 2
// 1000 failed
// 1001 failed
// 999 failed

/*
{ a: 1,
  b: 109900,
  c: 126900,
  f: 0,
  d: 3541,
  e: 68764,
  g: 68764,
  h: 0 }


{ a: 0, b: 99, c: 99, f: 0, d: 0, e: 0, g: 0, h: 0 }
{ a: 1, b: 109900, c: 126900, f: 0, d: 0, e: 0, g: 0, h: 0 }


109900
*/