import {P9813} from '../index.js';

const sleepAtomic = ms => {
	const sab = new SharedArrayBuffer(4);
	const int32 = new Int32Array(sab);
	Atomics.wait(int32, 0, 0, ms);
};


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const p9813Chain = new P9813({ datPin:532, clkPin:533, chainLength:3, name:'P9813 Chain', delay:0 });


console.log('Setting color of all modules in chain to red');
p9813Chain.setColorAll('#FF0000');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to yellow');
p9813Chain.setColorAll('#FFFF00');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to green');
p9813Chain.setColorAll('#00FF00');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to cyan');
p9813Chain.setColorAll('#00FFFF');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to blue');
p9813Chain.setColorAll('#0000FF');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to magenta');
p9813Chain.setColorAll('#FF00FF');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to black');
p9813Chain.setColorAll('#000000');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to gray');
p9813Chain.setColorAll('#808080');
sleepAtomic(1000);

console.log('Setting color of all modules in chain to white');
p9813Chain.setColorAll('#FFFFFF');
sleepAtomic(2500);


console.log('Terminating...');
p9813Chain.terminate();