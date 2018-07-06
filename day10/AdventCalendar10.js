let timeStart = process.hrtime();

const input = '130,126,1,11,140,2,255,207,18,254,246,164,29,104,0,224';

const range = length => new Array(length).fill().map((v, i) => i);

const reverse = arr => arr.map((v, i) => arr[arr.length - i - 1]);

const computeLoopItem = (length, start, localList, listLength) => {
    let startIndex = start;
    let isOverflow = startIndex + length > listLength;
    let endIndex = isOverflow ? startIndex + length - listLength - 1 : startIndex + length - 1;

    return localList.map((value, index, arr) => {
        if (
            (isOverflow && (index >= startIndex || index <= endIndex)) ||
            (!isOverflow && (index >= startIndex && index <= endIndex))
        ) {
            let virtualIndex = (index - start + listLength) % listLength;
            let virtualReverseIndex = length - virtualIndex - 1;
            let reverseIndex = (virtualReverseIndex + start) % listLength;

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

const compute = (input) => {
    let lengthList = input.split(',').map(v => parseInt(v));

    let list = computeLoop(lengthList, range(256));

    return list[0] * list[1];
};

console.log(compute(input)); //38628
let timeEnd = process.hrtime(timeStart);
console.info("Adrien solution (hr): %ds %dms", timeEnd[0], timeEnd[1] / 1000000);

timeStart = process.hrtime();
const listJoel = [];
let currentPosition = 0;
let skipSize = 0;
let inputSequence; // = [225, 171, 131, 2, 35, 5, 0, 13, 1, 246, 54, 97, 255, 98, 254, 110];
inputSequence = '130,126,1,11,140,2,255,207,18,254,246,164,29,104,0,224'.split(',').map(v => parseInt(v));

for (let i = 0; i < 256; i++) {
    listJoel.push(i);
}

function overslice(array, startindex, count) {
    var retarray = [];
    var increment = (count >= 0) ? 1 : -1;
    count = Math.abs(count);
    for (var i = startindex, c = 0; c < count; i += increment, c++) {
        if (i < 0) i = array.length - 1;
        retarray.push(array[i % array.length]);
    }
    return retarray;
}


function doReplacement(lenght, subList) {
    let index = currentPosition;
    for (let i = 0; i < lenght; i++) {
        listJoel[index] = subList[i];
        index++;
        if (index == 256) {
            index = 0;
        }

    }
}

function reverseJoel(length) {
    if (currentPosition > 255) {
        currentPosition = currentPosition - 256;
    }

    let subList = overslice(listJoel, currentPosition, length);
    subList = subList.reverse();
    doReplacement(length, subList);
    currentPosition = currentPosition + length + skipSize;
    skipSize = skipSize + 1;
}

for (let i = 0; i < inputSequence.length; i++) {
    reverseJoel(inputSequence[i]);
}

console.log(listJoel[0] * listJoel[1]);

timeEnd = process.hrtime(timeStart);
console.info("Joel solution (hr): %ds %dms", timeEnd[0], timeEnd[1] / 1000000);