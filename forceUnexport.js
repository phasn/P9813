import process from 'node:process';
import {Gpio} from 'onoff';


console.warn("Consider re-running this as superuser if you aren't already doing so\n");

const problemPinNumber = parseInt(process.argv[2]);
if(Number.isNaN(problemPinNumber)) throw new Error('Error: Received non-number value for pin number argument');
let problemGPIO;


console.log(`Attempting to open or take control of GPIO with the line number '${problemPinNumber}'...\n`);
try{
	problemGPIO = new Gpio(problemPinNumber, 'out');
}catch(err){
	console.error(`Error: Couldn't find or take control of GPIO ${problemPinNumber}`);
	throw new Error(err);
}


console.info(`Successfully took control of GPIO ${problemPinNumber}...\n`);
console.log(`Attempting to forcefully close GPIO ${problemPinNumber}...\n`);
try{
	problemGPIO.unexport();
}catch(err){
	console.error(`Error: Couldn't close pin ${problemPinNumber} for some reason:\n`);
	throw new Error(err);
}


console.info(`GPIO ${problemPinNumber} appears to have been successfully closed.\nScript will now end.\n`);