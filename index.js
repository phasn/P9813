import process			from 'node:process';
import {Gpio}			from 'onoff';
import {convertColor}	from 'rgbcct-color-handler';

const sleep_ms = ms => new Promise(r => setTimeout(r, ms));


export class P9813{
	#writeBuf;
	#isTerminated;

	constructor({datPin, clkPin, chainLength=1, name='P9813 Chain', delay=0}){
		this.DAT = datPin instanceof Gpio && datPin.direction()==='out'	? datPin
				 : Number.isInteger(datPin) && datPin>=0				? new Gpio(datPin, 'out')
				 :														new Error('Error: Data pin number either invalid or not specified.');

		this.CLK = clkPin instanceof Gpio && clkPin.direction()==='out'	? clkPin
				 : Number.isInteger(clkPin) && clkPin>=0				? new Gpio(clkPin, 'out')
				 :														new Error('Error: Clock pin number either invalid or not specified.');
		if(this.DAT instanceof Error) throw this.DAT;
		if(this.CLK instanceof Error) throw this.CLK;

		this.chainLength	= chainLength;
		this.name			= name;
		this.delay			= parseInt(delay) ?? 0;
		this.#writeBuf		= new Uint8Array(this.chainLength * 3);
		this.#isTerminated	= false;
		this.#init();

		process.on('beforeExit', () => {
			this.terminate();
		});
	};

	#init(){
		let _this = this;
		for(let i=0; i<this.chainLength; i++){
			this[i] = {
				setColor(color){
					_this.setColor(i, color);
				},
				getColor(format='arr'){
					let color = _this.getColor(i, format);
					return color;
				}
			};
		}
		this.reset();
	};

	setColor(index, color){
		if(index===undefined) return console.error('Exception: Unable to set color because no module number was specified.');
		if(color===undefined) return console.error('Exception: Unable to set color because no color was specified.');
		this.#updateBuffer(index, color);
		this.#write();
	};

	getColor(index, format='arr'){
		index = parseInt(index);
		if(!Number.isInteger(index) || index>=this.chainLength || index<0) return console.error('Exception: Module index must be an integer equal to or greater than 0 and less than the module chain length.');

		let offset = index * 3;
		let rgb = [];

		for(let i=0; i<3; i++) rgb.push(this.#writeBuf[offset + i]);

		if(format==='hex') return convertColor([rgb[0], rgb[1], rgb[2]], 'hex');
		if(format==='obj') return {r:rgb[0], g:rgb[1], b:rgb[2]};
		return rgb;// if(format==='arr') return rgb;
	};

	setColorAll(color){
		if(color===undefined) return console.error('Exception: Unable to set chain color: No color was specified.');
		for(let i=0; i<this.chainLength; i++) this.#updateBuffer(i, color);
		this.#write();
	};

	// Basically the same as running this.setColorAll('#000000')
	// but slightly faster and skips the color interpteter
	reset(){
		this.#writeBuf.fill(0);
		this.#frame();
		for(let i=0; i<this.chainLength; i++){
			this.#writeByte(0xC0);
			for(let i=0; i<3; i++) this.#writeByte(0);
		}
		this.#frame();
	};

	terminate(){
		if(this.#isTerminated===true) return;

		try{
			console.log(`\nTerminating ${this.name}...`);
			this.reset();
			this.DAT.unexport();
			this.CLK.unexport();

			this.#isTerminated = true;

			const terminatedMsg = () => console.error(`Error: Unable to perform this action because chain '${this.name}' has already been terminated.`);
			this.setColor = this.getColor = this.setColorAll = this.reset = terminatedMsg;
			for(let i=0; i<this.chainLength; i++) this[i].setColor = this[i].getColor = terminatedMsg;
		}catch(err){
			console.error(`Error: Unable to terminate ${this.name} for some reason:\n`);
			console.error(err);
		}
	};

	// P9813 chips have no functionality for returning
	// data, so the write buffer is saved and referenced
	// between writes instead
	#updateBuffer(index, color){
		if(index===undefined) return console.error('Exception: Unable to update the write buffer because no module number was specified.');
		if(color===undefined) return console.error('Exception: Unable to update the write buffer because no color was specified.');

		let colorArr = convertColor(color, 'arr');
		if(!Array.isArray(colorArr)) return console.error('Exception: Could not parse color.');

		let offset = index * 3;
		for(let i=0; i<3; i++) this.#writeBuf[offset + i] = colorArr[i];
	};

	#write(){
		// 4 bytes: Begin data frame
		this.#frame();

		// 4 bytes * chainLength: (checksum, blue, green, red) per module
		for(let i=0; i<this.chainLength; i++){
			this.#writeToModule(
				this.#writeBuf[i*3],
				this.#writeBuf[i*3 + 1],
				this.#writeBuf[i*3 + 2]
			);
		}

		// 4 bytes: End data frame
		this.#frame();
	};

	#frame(){
		// Send x32 zeros
		this.DAT.writeSync(0);
		for(let i=0; i<32; i++) this.#clock();
	};

	#clock(){
		this.CLK.writeSync(0);
		await sleep_ms(this.delay);
		this.CLK.writeSync(1);
		await sleep_ms(this.delay);
	};

	#writeToModule(r, g, b){
		// Send a checksum byte with the format "1 1 ~B7 ~B6 ~G7 ~G6 ~R7 ~R6"
		let checksum = 0xC0; // 0b11000000;
		checksum |= (b >> 6 & 3) << 4;
		checksum |= (g >> 6 & 3) << 2;
		checksum |= (r >> 6 & 3);

		this.#writeByte(checksum);

		// Send the 3 color channels
		this.#writeByte(b);
		this.#writeByte(g);
		this.#writeByte(r);
	};

	#writeByte(b){
		if(b===0){
			// Fast send 8x zeros
			this.DAT.writeSync(0);
			for(let i=0; i<8; i++)	this.#clock();
		}else{
			// Send each bit, MSB first
			for(let i=0; i<8; i++){
				if((b & 0x80)!==0)	this.DAT.writeSync(1);
				else				this.DAT.writeSync(0);
				this.#clock();

				// Next bit
				b <<= 1;
			}
		}
	};
};


export default P9813;