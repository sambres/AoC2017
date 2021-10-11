import input from "./input";

console.info(input);

const branch = new Set();
const node = new Set();
for (const line of input.split("\n")) {
  const match = line.match(/(\w+) \((\d+)\)( -> ([\w ,]+))?/);
  if (match[4]) {
    branch.add(match[1]);
    for (const x of match[4].split(", ")) {
      node.add(x);
    }
  }
}

for (const x of branch.keys()) {
  if (!node.has(x)) {
    console.log("Result: ", x);
  }
}
