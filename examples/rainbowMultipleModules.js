import {P9813} from '../index.js';

const sleep_ms = ms => {
	if(ms===undefined) throw new Error('TypeError: sleep_ms() takes exactly one argument (0 given)');
	let endTime = +new Date() + parseInt(ms);
	while(+new Date() < endTime);
};


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const p9813Chain = new P9813({ datPin:532, clkPin:533, chainLength:3, name:'P9813 Chain', delay:0 });


let colorArr = [255, 0, 0];
let target = 1;

const setEach = arr => {
	p9813Chain[0].setColor([arr[0], arr[1], arr[2]]);
	p9813Chain[1].setColor([arr[2], arr[0], arr[1]]);
	p9813Chain[2].setColor([arr[1], arr[2], arr[0]]);
};

const main = () => {
	for(let i=0; i<4; i++){

		for(let up=0; up<255; up++){
			colorArr[target]++;
			setEach(colorArr);
		}
		target = target===0 ? 2 : target-1;

		for(let down=255; down>0; down--){
			colorArr[target]--;
			setEach(colorArr);
		}
		target = target===0 ? 2 : target-1;

	}
};


main();