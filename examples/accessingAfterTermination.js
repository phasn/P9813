import {P9813} from '../index.js';

const sleepAtomic = ms => {
	const sab = new SharedArrayBuffer(4);
	const int32 = new Int32Array(sab);
	Atomics.wait(int32, 0, 0, ms);
};


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const chain = new P9813({ datPin:532, clkPin:533, chainLength:3, name:'Example Chain' });


chain.setColorAll('#ffff00');
sleepAtomic(1500);


console.log('Terminating...');
chain.terminate();
sleepAtomic(500);
console.info(`${chain.name} was successfully terminated!`);
sleepAtomic(1500);


// Various attempts to interact with chain after it's been terminated
console.log(`Attempting to run various methods in the now-terminated ${chain.name}...`);
sleepAtomic(500);

chain.setColor(1, '#ff0000');
sleepAtomic(500);
chain[1].setColor('#00ff00');
sleepAtomic(500);

chain.getColor(1, 'hex');
sleepAtomic(500);
chain[1].getColor('hex');
sleepAtomic(500);

chain.setColorAll('#0000ff');
sleepAtomic(500);

chain.reset();