import {P9813} from '../index.js';

const sleep_ms = ms => new Promise(r => setTimeout(r, ms));


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const chain1 = new P9813({ datPin:532, clkPin:533, chainLength:2, name:'Chain 1', delay:0 });
// GPIO line numbers 531 and 538 correspond with physical pins 35 (GPIO 19) and 37 (GPIO 26) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const chain2 = new P9813({ datPin:531, clkPin:538, chainLength:2, name:'Chain 2', delay:0 });


console.log('Setting color of chain 1 to red');
chain1.setColorAll('#FF0000');
console.log('Setting color of chain 2 to cyan');
chain2.setColorAll('#00FFFF');
await sleep_ms(1000);


console.log('Rotating colors...');
chain1.setColorAll('#FFFF00');
chain2.setColorAll('#0000FF');
await sleep_ms(500);

chain1.setColorAll('#00FF00');
chain2.setColorAll('#FF00FF');
await sleep_ms(500);

chain1.setColorAll('#00FFFF');
chain2.setColorAll('#FF0000');
await sleep_ms(500);

chain1.setColorAll('#0000FF');
chain2.setColorAll('#FFFF00');
await sleep_ms(500);

chain1.setColorAll('#FF00FF');
chain2.setColorAll('#00FF00');
await sleep_ms(500);

chain1.setColorAll('#FF0000');
chain2.setColorAll('#00FFFF');
await sleep_ms(2500);


console.log('Terminating...');
chain1.terminate();
chain2.terminate();