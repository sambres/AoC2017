function app() {
    console.log('Hello World');
}

app();

if(process.argv.length >= 2) {
    let number = parseInt(process.argv[2]);
    
    const day = require(`./day${number}/AdventCalendar${number}.js`);
   
}