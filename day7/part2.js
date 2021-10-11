import input from "./input";

console.info(input);

const branches = new Map();
const weights = new Map();
for (const line of input.split("\n")) {
  const match = line.match(/(\w+) \((\d+)\)( -> ([\w ,]+))?/);
  if (match[4]) {
    branches.set(match[1], match[4].split(", "));
  }
  weights.set(match[1], parseInt(match[2], 10));
}

let start;
for (const branch of branches.keys()) {
  start = branch;
  for (const bb of branches.entries()) {
    if (branch !== bb[0] && bb[1].includes(branch)) {
      start = undefined;
      break;
    }
  }
  if (start) {
    break;
  }
}
console.log("start", start);

const dive = (node) => {
  const branch = branches.get(node);
  let weight = weights.get(node);
  // console.log(node, branch, weight);

  if (branch) {
    const balances = [];

    for (const leaf of branch) {
      const leafWeight = dive(leaf);
      if (leafWeight === null) {
        return null;
      }

      const found = balances.find((b) => b.leafWeight === leafWeight);
      if (!found && balances.length <= 1) {
        balances.push({
          node,
          nodeWeight: weights.get(node),
          leaf,
          leafWeightOnly: weights.get(leaf),
          leafWeight
        });
      } else if (balances.length > 1) {
        const goodWeight = balances.find((b) => b.leafWeight === leafWeight);
        const badWeight = balances.find((b) => b.leafWeight !== leafWeight);
        console.log(balances);
        console.log("goodWeight", goodWeight);
        console.log("badWeight", badWeight);
        console.log(
          "Result: ",
          badWeight.leafWeightOnly +
            (goodWeight.leafWeight - badWeight.leafWeight)
        );
        return null;
      }

      weight += leafWeight;
    }
  }
  return weight;
};

dive(start);
