const fs = require('fs');

fs.readFile('./puzzle_input/12.txt', 'utf8', (err, data) => {
    let timeStart = process.hrtime();
    if (err) {
        throw err;
    }

    inputGlobal = formatInput(data);

    let tree = new eNode(0);

    buildTree(inputGlobal, tree);

    let timeEnd = process.hrtime(timeStart);
    console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);
});

let inputGlobal;

const formatInput = input =>
    input.split('\n').map(s =>
        s
        .replace(/\d+ <-> /, '')
        .split(',')
        .map(v => parseInt(v)),
    );

class eNode {
    constructor(value, parent, childs) {
        this.value = value;
        this.parent = parent;
        this.childs = [];
        if (childs) {
            this.addChilds(childs);
        }
    }

    addChilds(childs) {
        for (const child of childs) {
            this.addChild(child);
        }
    }

    addChild(child) {
        if (!this.childs.some(c => child === c.value)) {
            this.childs.push(new eNode(child, this.value));
        }
    }

    getChild(child) {
        let index = this.childs.findIndex(c => c.value === child);
        if (index !== -1) {
            return this.childs[index];
        }
        return undefined;
    }

    getNodes(list) {
        list = list || [];
        if (list.indexOf(this.value) === -1) {
            list.push(this.value)
        }
        for (const child of this.childs) {
            list = child.getNodes(list);
        }
        return list;
    }

    hasChild(value) {
        if (value === this.value) {
            return true;
        } else {
            for (const child of this.childs) {
                if (child.hasChild(value)) {
                    return true;
                }
            }
        }
        return false;

    }

}

const addNode = (parent, child, node) => {
    let success = false;
    if (node == undefined) console.log(parent, child, node)
    // Si le node actuel est le parent
    if (node.value == parent && node.parent != child) {
        // On lui rajoute l'enfant
        node.addChild(child);
        return true;
    } else {
        // Sinon on passe au suivant
        for (const childNode of node.childs) {
            // if (addNode(parent, child, childNode)) return true;
            success = addNode(parent, child, childNode);
        }
    }
    return false;
};

const printTree = (tree, depth = 0) => {
    console.log('|', Array(depth + 1).join('->'), tree.value);
    if (tree.childs) {
        for (const child of tree.childs) {
            printTree(child, depth + 1);
        }
    }
};

const buildTreeOld = input => {
    let tree = new eNode(0, undefined, input[0]);
    let successList = [];
    let cursor = 0;
    for (let i = 0; i < input.length; i++) {
        cursor = i;
        let childs = input[cursor];
        for (let j = 0; j < childs.length; j++) {
            console.log(cursor, childs[j]);
            if (addNode(cursor, childs[j], tree)) { // && !successList.some(c => c == cursor)) {
                successList.push(i);
            }
        }
    }
    printTree(tree);
    console.log(tree);
    console.log(successList.length + 1);
};

const addNodeFull = (tree, node, cursor, successList) => {
    let childs = inputGlobal[cursor];
    // console.log(cursor, childs);
    for (const child of childs) {
        // console.log("Has Child ? ",  cursor, child, tree.hasChild(child))
        if (!tree.hasChild(child)) {
            if (addNode(cursor, child, node)) {
                successList.push(cursor);
                successList = addNodeFull(tree, node.getChild(child), child, successList);
            }
        }
    }

    return successList;
};

const buildTree = (input, tree) => {
    let cursor = 0;
    let childs = inputGlobal[cursor];
    let successList = [];
    let treeCollection = [];
    while (cursor >= 0) {
        // while (successList.length !== input.length) {
        // for (let i = 0; i < 5; i++) {
        let newTree = new eNode(cursor);
        let newSuccessList = [];
        newSuccessList = addNodeFull(newTree, newTree, cursor, newSuccessList);
        // printTree(newTree);
        newSuccessList = newTree.getNodes();
        console.log("New SucessList", newSuccessList);

        treeCollection.push(newTree);
        successList = newSuccessList.concat(successList, cursor).reduce((a, b) => {
            if (a.indexOf(b) === -1) {
                a.push(b);
            }
            return a;
        }, [])


        // successList = newSuccessList.filter(i => successList.indexOf(i) === -1)
        //     .concat(successList, cursor);
        // Prochain numéro
        cursor = input.findIndex((c, i) => successList.indexOf(i) === -1);

        console.log("NewCursor:", cursor, "Test cursor", successList.indexOf(cursor));
        console.log("Collection Length", successList.length)
    }
    // successList = addNodeFull(tree, 0, successList);

    // printTree(tree);

    console.log(successList);
    console.log(successList.length + 1);
    console.log("Group Number:", treeCollection.length);
};



// printTree(tree);