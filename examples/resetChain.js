import {P9813} from '../index.js';


// GPIO line numbers 532 and 533 correspond with physical pins 38 (GPIO 20) and 40 (GPIO 21) on a Raspberry Pi Zero 2 W installed with Raspberry Pi OS (Debian) 13
const p9813Chain = new P9813({ datPin:532, clkPin:533, chainLength:3 });


p9813Chain.setColorAll('#000000');


console.log('Terminating...');
p9813Chain.terminate();