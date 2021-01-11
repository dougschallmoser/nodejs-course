const chalk = require('chalk');

const getNotes = require('./notes.js');

const msg = getNotes()
const greenMsg = chalk.red('Error!');

console.log(msg);
console.log(greenMsg);