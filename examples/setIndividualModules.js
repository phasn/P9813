import {P9813} from '../index.js';

const sleep_ms = ms => {
	if(ms===undefined) throw new Error('TypeError: sleep_ms() takes exactly one argument (0 given)');
	let endTime = +new Date() + parseInt(ms);
	while(+new Date() < endTime);
};


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const p9813Chain = new P9813({ datPin:532, clkPin:533, chainLength:3, name:'P9813 Chain', delay:0 });


console.log('Setting color of 1st module in chain ( p9813Chain[0] ) to red');
p9813Chain[0].setColor('#FF0000');
sleep_ms(1000);

console.log('Setting color of 2nd module in chain ( p9813Chain[1] ) to green');
p9813Chain[1].setColor('#00FF00');
sleep_ms(1000);

console.log('Setting color of 3rd module in chain ( p9813Chain[2] ) to blue');
p9813Chain[2].setColor('#0000FF');
sleep_ms(1000);


console.log('Rotating colors...');
p9813Chain[0].setColor('#0000FF');
p9813Chain[1].setColor('#FF0000');
p9813Chain[2].setColor('#00FF00');
sleep_ms(1000);

p9813Chain[0].setColor('#00FF00');
p9813Chain[1].setColor('#0000FF');
p9813Chain[2].setColor('#FF0000');
sleep_ms(1000);

p9813Chain[0].setColor('#FF0000');
p9813Chain[1].setColor('#00FF00');
p9813Chain[2].setColor('#0000FF');
sleep_ms(1000);

p9813Chain[0].setColor('#FFFF00');
p9813Chain[1].setColor('#00FFFF');
p9813Chain[2].setColor('#FF00FF');
sleep_ms(1000);

p9813Chain[0].setColor('#FF00FF');
p9813Chain[1].setColor('#FFFF00');
p9813Chain[2].setColor('#00FFFF');
sleep_ms(1000);

p9813Chain[0].setColor('#00FFFF');
p9813Chain[1].setColor('#FF00FF');
p9813Chain[2].setColor('#FFFF00');
sleep_ms(1000);

p9813Chain[0].setColor('#FFFFFF');
p9813Chain[1].setColor('#FFFFFF');
p9813Chain[2].setColor('#FFFFFF');
sleep_ms(2500);