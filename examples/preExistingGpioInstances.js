import {Gpio}	from 'onoff';
import {P9813}	from '../index.js';

const sleepAtomic = ms => {
	const sab = new SharedArrayBuffer(4);
	const int32 = new Int32Array(sab);
	Atomics.wait(int32, 0, 0, ms); // Blocks the thread cleanly
};


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const dataPinNumber = 532;
const clockPinNumber = 533;


console.log('Initializing Data and Clock pins in external script');
const datGPIO = new Gpio(dataPinNumber, 'out');
const clkGPIO = new Gpio(clockPinNumber, 'out');


console.log('Creating new P9813 chain instances using the existing Data and Clock pin Gpio instances.');
sleepAtomic(1500);
console.log('(rather than passing in the Gpio numbers themselves and having the class initialize them)');
sleepAtomic(1500);
console.log('This can be useful in projects that use more than one type of GPIO peripheral at once, as you can better control unexport behavior on exit.');

const p9813Chain = new P9813({
	datPin: datGPIO,
	clkPin: clkGPIO,
	chainLength: 3,
	name: 'Pre-init Example Chain',
	delay: 0
});
sleepAtomic(2000);


console.log('Setting color of 1st module in chain ( p9813Chain[0] ) to red');
p9813Chain[0].setColor('#FF0000');
sleepAtomic(1000);

console.log('Setting color of 2nd module in chain ( p9813Chain[1] ) to green');
p9813Chain[1].setColor('#00FF00');
sleepAtomic(1000);

console.log('Setting color of 3rd module in chain ( p9813Chain[2] ) to blue');
p9813Chain[2].setColor('#0000FF');
sleepAtomic(2500);


console.log('Terminating...');
p9813Chain.terminate();