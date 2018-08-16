function app() {
    console.log('Hello World');
}

app();
console.log(process.argv)
if(process.argv.length >= 2) {
    let part = process.argv[2];
    let number = parseInt(process.argv[2]);
    
    const day = require(`./day${number}/AdventCalendar${part}.js`);
   
}