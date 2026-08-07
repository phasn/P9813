import {P9813} from '../index.js';

const sleep_ms = ms => new Promise(r => setTimeout(r, ms));


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const chain = new P9813({ datPin:532, clkPin:533, chainLength:2, name:'P9813 Chain', delay:0 });


console.log('Setting color of 1st module in chain ( chain[0] ) to cyan');
chain.setColor(0, '#00ffff');
await sleep_ms(1000);

console.log('Setting color of 2nd module in chain ( chain[1] ) to magenta');
chain[1].setColor('#ff00ff');
await sleep_ms(1500);
console.log('\n');


// Targeting module as child object of parent chain
console.log('\tGetting the current color of 1st module in chain:');
await sleep_ms(500);

let module0Empty = chain.getColor(0);// Defaults to 'arr' if no return format is specified
let module0Hex = chain.getColor(0, 'hex');
let module0Arr = chain.getColor(0, 'arr');
let module0Obj = chain.getColor(0, 'obj');

console.info(module0Empty);
console.info(module0Hex);
console.info(module0Arr);
console.info(module0Obj);
await sleep_ms(1500);
console.log('\n');


// Targeting module directly
console.log('\tGetting the current color of 2nd module in chain:');
await sleep_ms(500);

let module1Empty = chain[1].getColor();// Defaults to 'arr' if no return format is specified
let module1Hex = chain[1].getColor('hex');
let module1Arr = chain[1].getColor('arr');
let module1Obj = chain[1].getColor('obj');

console.info(module1Empty);
console.info(module1Hex);
console.info(module1Arr);
console.info(module1Obj);
await sleep_ms(2000);
console.log('\n');


console.log('Terminating...');
chain.terminate();