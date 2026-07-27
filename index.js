import {Gpio}			from 'onoff';
import {convertColor}	from 'rgbcct-color-handler';

const sleep_ms = ms => {
	if(ms===undefined) throw new Error('TypeError: sleep_ms() takes exactly one argument (0 given)');
	let endTime = +new Date() + parseInt(ms);
	while(+new Date() < endTime);
};


export class P9813{
	constructor({datPin, clkPin, chainLength=1, name='P9813 Chain', delay=0}){
		if(!Number.isInteger(datPin) || datPin<0) throw new Error('ERROR: Data pin number either invalid or not specified');
		if(!Number.isInteger(clkPin) || clkPin<0) throw new Error('ERROR: Clock pin number either invalid or not specified');

		this.DAT			= new Gpio(datPin, 'out');
		this.CLK			= new Gpio(clkPin, 'out');
		this.chainLength	= chainLength;
		this.name			= name;
		this.delay			= parseInt(delay) ?? 0;
		this.buf			= new Uint8Array(this.chainLength * 3);

		this.init();
	};

	init(){
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

		process.on('beforeExit', () => {
			this.terminate();
		});
	};

	setColor(index, color){
		if(index===undefined) return console.error('ERROR: Unable to set color: No module number was specified');
		if(color===undefined) return console.error('ERROR: Unable to set color: No color was specified');
		this.updateBuffer(index, color);
		this.write();
	};

	getColor(index, format='arr'){
		index = parseInt(index);
		if(!Number.isInteger(index) || index>=this.chainLength || index<0) return console.error('ERROR: Module index must be an integer equal to or greater than 0 and less than the module chain length');

		let offset = index * 3;
		let rgb = [];

		for(let i=0; i<3; i++) rgb.push(this.buf[offset + i]);

		if(format==='hex') return convertColor([rgb[0], rgb[1], rgb[2]], 'hex');
		if(format==='obj') return {r:rgb[0], g:rgb[1], b:rgb[2]};
	//	if(format==='arr') return rgb;

		return rgb;
	};

	setColorAll(color){
		if(color===undefined) return console.error('ERROR: Unable to set chain color: No color was specified');
		for(let i=0; i<this.chainLength; i++) this.updateBuffer(i, color);
		this.write();
	};

	terminate(){
		console.log(`\nTerminating ${this.name}...`);
		this.reset();
		this.DAT.unexport();
		this.CLK.unexport();
	};



	// Basically the same as running this.setColorAll('#000000')
	// but slightly faster and skips the color interpteter entirely
	reset(){
		this.buf.fill(0);
		// Begin data frame 4 bytes
		this.frame();
		// 4 bytes for each led (checksum, blue, green, red)
		for(let i=0; i<this.chainLength; i++){
			this.writeByte(0xC0);
			for(let i=0; i<3; i++) this.writeByte(0);
		}
		// End data frame 4 bytes
		this.frame();
	};

	// P9813 chips have no functionality for returning
	// data, so the update buffer is referenced instead
	updateBuffer(index, color){
		if(index===undefined) return console.error('ERROR: Unable to update the write buffer: No module number was specified');
		if(color===undefined) return console.error('ERROR: Unable to update the write buffer: No color was specified');

		let colorArr = convertColor(color, 'arr');
		if(!Array.isArray(colorArr)) return console.error('ERROR: Could not parse color');

		let offset = index * 3;
		for(let i=0; i<3; i++) this.buf[offset + i] = colorArr[i];
	};

	write(){
		// Begin data frame 4 bytes
		this.frame();

		// 4 bytes for each module (checksum, blue, green, red)
		for(let i=0; i<this.chainLength; i++){
			this.writeToModule(
				this.buf[i*3],
				this.buf[i*3 + 1],
				this.buf[i*3 + 2]
			);
		}

		// End data frame 4 bytes
		this.frame();
	};



	frame(){
		// Send x32 zeros
		this.DAT.writeSync(0);
		for(let i=0; i<32; i++) this.clock();
	};

	clock(){
		this.CLK.writeSync(0);
		sleep_ms(this.delay);
		this.CLK.writeSync(1);
		sleep_ms(this.delay);
	};

	writeToModule(r, g, b){
		// Send a checksum byte with the format "1 1 ~B7 ~B6 ~G7 ~G6 ~R7 ~R6"
		// The checksum color bits should bitwise NOT the data color bits
		let checksum = 0xC0; // 0b11000000;
		checksum |= (b >> 6 & 3) << 4;
		checksum |= (g >> 6 & 3) << 2;
		checksum |= (r >> 6 & 3);

		this.writeByte(checksum);

		// Send the 3 colors
		this.writeByte(b);
		this.writeByte(g);
		this.writeByte(r);
	};

	writeByte(b){
		if(b===0){
			// Fast send 8x zeros
			this.DAT.writeSync(0);
			for(let i=0; i<8; i++)	this.clock();
		}else{
			// Send each bit, MSB first
			for(let i=0; i<8; i++){
				if((b & 0x80)!==0)	this.DAT.writeSync(1);
				else				this.DAT.writeSync(0);
				this.clock();

				// On to the next bit
				b <<= 1;
			}
		}
	};
};


export default P9813;