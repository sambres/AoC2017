let input = '130,126,1,11,140,2,255,207,18,254,246,164,29,104,0,224';
//input = 'AoC 2017';
//input = '';
//input = '1,2,3';

const range = length => new Array(length).fill().map((v, i) => i);
const reverse = arr => arr.map((v, i) => arr[arr.length - i - 1]);

let inputList = range(256);

const computeLoopItem = (length, start, localList, listLength) => {
    let tempList = [];
    let startIndex = start;
    let isOverflow = startIndex + length > listLength;
    let endIndex = isOverflow ? startIndex + length - listLength - 1 : startIndex + length - 1;

    // console.log('startIndex: ', startIndex, 'endIndex: ', endIndex, 'borderIndex: ', borderIndex,
    //     'overflow: ', overflow, 'isOverflow: ', isOverflow, ', length: ', length, );
    return localList.map((value, index, arr) => {
        if (
            (isOverflow && (index >= startIndex || index <= endIndex)) ||
            (!isOverflow && (index >= startIndex && index <= endIndex))
        ) {
            let virtualIndex = (index - start + listLength) % listLength;
            let virtualReverseIndex = length - virtualIndex - 1;
            let reverseIndex = (virtualReverseIndex + start) % listLength;
            //      console.log("index: ", index, ", virtualIndex: ", virtualIndex, ", reverseIndex: ", reverseIndex);
            return arr[reverseIndex];
        } else {
            return value;
        }
    });
};

const computeLoop = (lengthList, list) => {
    const listLength = list.length;
    let start = 0;
    let skip = 0;
    let localList = list;
    for (const length of lengthList) {
        localList = computeLoopItem(length, start, localList, listLength);
        start = (start + skip + length) % listLength;
        skip++;
    }
    return localList;
};

const densifyList = (list) => {
    const result = [];
    for (let index = 0; index < 16; index++) {
        const subList = list.slice(index * 16, (index + 1) * 16);
        const hash = subList.reduce((a, b) => a ^ b);
        // console.log(subList, hash);
        result.push(hash);
    }
    return result;
}

const densifyList2 = (list) => {
    const result = [];

    for (let i = 0; i < 16; i++) {
        const o = list.slice(i * 16, i * 16 + 16).reduce((a, b) => a ^ b);
        result.push(o);
    }
    return result;
}

exports.getKnotHash = (input) => {
    let lengthList = input.split('').map(v => v.charCodeAt()).concat([17, 31, 73, 47, 23]);
    let numbers = inputList;
    let pos = 0,
        skip = 0,
        start = 0;
    //console.log(lengthList);
    for (let index = 0; index < 64; index++) {
        const listLength = numbers.length;

        for (const length of lengthList) {
            numbers = computeLoopItem(length, start, numbers, listLength);
            start = (start + skip + length) % listLength;
            skip++;
        }
        //numbers = computeLoop(lengthList, numbers);
        // for (const len of lengthList) {
        //     if (len > 1) {
        //         numbers = [...numbers.slice(pos), ...numbers.slice(0, pos)];
        //         numbers = [...numbers.slice(0, len).reverse(), ...numbers.slice(len)];
        //         numbers = [...numbers.slice(-pos), ...numbers.slice(0, -pos)];
        //     }
        //     pos = (pos + len + skip++) % 256;
        // }
    }
    //console.log(list.join(','));
    let denseList = densifyList(numbers);

    return getHexaHashOfArray(denseList);
};

const getHexa = n => n.toString(16).padStart(2, '0');

const getHexaHashOfArray = arr => arr.map(v => getHexa(v)).join('');

//console.log(densifyList(range(256)));

// console.log(getKnotHash('AoC 2017'));
// console.log(getKnotHash('1,2,3'));
// console.log(getKnotHash(input));