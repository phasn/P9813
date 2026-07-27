import {P9813} from '../index.js';

const sleep_ms = ms => {
	if(ms===undefined) throw new Error('TypeError: sleep_ms() takes exactly one argument (0 given)');
	let endTime = +new Date() + parseInt(ms);
	while(+new Date() < endTime);
};


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const p9813Chain = new P9813({ datPin:532, clkPin:533, chainLength:3, name:'P9813 Chain', delay:0 });


console.log('Setting color of all modules in chain to red');
p9813Chain.setColorAll('#FF0000');
sleep_ms(1000);

console.log('Setting color of all modules in chain to yellow');
p9813Chain.setColorAll('#FFFF00');
sleep_ms(1000);

console.log('Setting color of all modules in chain to green');
p9813Chain.setColorAll('#00FF00');
sleep_ms(1000);

console.log('Setting color of all modules in chain to cyan');
p9813Chain.setColorAll('#00FFFF');
sleep_ms(1000);

console.log('Setting color of all modules in chain to blue');
p9813Chain.setColorAll('#0000FF');
sleep_ms(1000);

console.log('Setting color of all modules in chain to magenta');
p9813Chain.setColorAll('#FF00FF');
sleep_ms(1000);

console.log('Setting color of all modules in chain to black');
p9813Chain.setColorAll('#000000');
sleep_ms(1000);

console.log('Setting color of all modules in chain to gray');
p9813Chain.setColorAll('#808080');
sleep_ms(1000);

console.log('Setting color of all modules in chain to silver');
p9813Chain.setColorAll('#C0C0C0');
sleep_ms(1000);

console.log('Setting color of all modules in chain to white');
p9813Chain.setColorAll('#FFFFFF');
sleep_ms(2500);