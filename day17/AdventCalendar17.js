const compute = (step, iteration) => {

    let buffer = [0];
    let position = 0;
    for (let i = 1; i < iteration + 1; i++) {
        const length = buffer.length;
        // let newIndex = position;
        // for (let j = position; j < (position + step); j++) {
        //     newIndex = (newIndex + 1) % length;
        // }

        position = (((step % length) + position) % length) + 1;
        // buffer = [...buffer.slice(0, position), i, ...buffer.slice(position, length)];
        buffer.splice(position, 0, i);

    }
    return buffer[position + 1];
};

// const computeMin=(step,iteration)=>{let buffer=[0];let position=0;for(let i=1;i<iteration+1;i++){const length=buffer.length;let newIndex=(((step%length)+position)%length);position=newIndex+1;buffer=[...buffer.slice(0,position),i,...buffer.slice(position,length)];} return buffer[position+1];};

const iteration = 20170
const step = 343
let timeStart = process.hrtime();

console.log(compute(step, iteration));

let timeEnd = process.hrtime(timeStart);
console.info('Execution (hr): %ds %dms', timeEnd[0], timeEnd[1] / 1000000);