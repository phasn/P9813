import {P9813} from '../index.js';


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const p9813Chain = new P9813({ datPin:532, clkPin:533 });


let colorArr = [255, 0, 0];
let target = 1;

const main = () => {
	for(let i=0; i<4; i++){

		for(let up=0; up<255; up++){
			colorArr[target]++;
			p9813Chain[0].setColor(colorArr);
		}
		target = target===0 ? 2 : target-1;

		for(let down=255; down>0; down--){
			colorArr[target]--;
			p9813Chain[0].setColor(colorArr);
		}
		target = target===0 ? 2 : target-1;

	}
};


main();


console.log('Terminating...');
p9813Chain.terminate();