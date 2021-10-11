import input from "./input";

const data = input
  .split("\n")
  .map((c) => c.split("\t").map((cc) => parseInt(cc.trim(), 10)));
console.log(data);

let sum = 0;
for (const row of data) {
  for (let i = 0; i < row.length; i++) {
    const x = row[i];
    let found = false;
    for (const y of row.slice(i + 1)) {
      if (x % y === 0) {
        console.log("x", x, y);
        sum += x / y;
        found = true;
        break;
      }
      if (y % x === 0) {
        console.log("y", x, y);
        sum += y / x;
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }
}
console.log("Result:", sum);
