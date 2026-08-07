import {P9813} from '../index.js';

const sleep_ms = ms => new Promise(r => setTimeout(r, ms));


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const chain = new P9813({ datPin:532, clkPin:533, chainLength:3, name:'Example Chain' });


chain.setColorAll('#ffff00');
await sleep_ms(1500);


console.log('Terminating...');
chain.terminate();
await sleep_ms(500);
console.info(`${chain.name} was successfully terminated!`);
await sleep_ms(1500);


// Various attempts to interact with chain after it's been terminated
console.log(`Attempting to run various methods in the now-terminated ${chain.name}...`);
await sleep_ms(500);

chain.setColor(1, '#ff0000');
await sleep_ms(500);
chain[1].setColor('#00ff00');
await sleep_ms(500);

chain.getColor(1, 'hex');
await sleep_ms(500);
chain[1].getColor('hex');
await sleep_ms(500);

chain.setColorAll('#0000ff');
await sleep_ms(500);

chain.reset();