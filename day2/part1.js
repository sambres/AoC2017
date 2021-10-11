import input from "./input";

console.log(input);

const data = input
  .split("\n")
  .map((c) => c.split("\t").map((cc) => parseInt(cc.trim(), 10)));

console.log(data);

let sum = 0;
for (const row of data) {
  const min = Math.min(...row);
  const max = Math.max(...row);
  console.log(min, max);
  sum += max - min;
}

console.log("Result:", sum);
