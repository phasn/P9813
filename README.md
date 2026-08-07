# P9813

> [!IMPORTANT]
> From NPM v12 onward, NPM will require you to manually approve and then re-run any post-install build scripts when installing dependencies (see https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/). Steps for accomplishing this are included in [Installation](#installation).

> [!IMPORTANT]
> GPIO implementation can vary significantly from device to device, OS to OS, and in some cases, between different versions of the same OS on the same device. Because of this, figuring out the right pin numbering system/formula to use may take a bit of trial and error.

JavaScript GPIO bit-bang driver for chainable P9813 non-addressable LED strip controller modules from various companies such as Open-Smart, DIY More, Seeed Studio, etc.

![Assorted P9813 Modules](https://github.com/phasn/P9813/blob/main/examples/P9813ModuleAssortment.png "Assortment of common chainable P9813 modules")

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Troubleshooting \& Common Issues](#troubleshooting--common-issues)
- [To-Do](#to-do)
- [License](#license)

## Installation

```sh
npm install p9813

# If NPM gives you the following warning when installing
#    "npm warn install-scripts 1 package had install scripts blocked because they are not covered by allowScripts:""
# you'll need to run the following:
npm install-scripts approve epoll
npm rebuild
```

## Usage

A number of more detailed [example scripts](https://github.com/phasn/P9813/tree/main/examples) are available in the [github repo](https://github.com/phasn/P9813) (you'll need to adjust the pin numbers and chain lengths to reflect your specific setup).

### General usage:

```js
import {P9813} from 'p9813';

const chain = new P9813({ datPin:532, clkPin:533, chainLength:3 });


// Set the color of individual modules
chain[0].setColor('#ff0000');// Set the 1st module in the chain to red, using a hex code string for the input
chain.setColor(1, [0,255,0]);// Set the 2nd module in the chain to green, using a color array for the input
chain.setColor(2, {r:0, g:0, b:255});// Set the 3rd module in the chain to blue, using a color object for the input

// Get the current color of individual modules
chain.getColor(0);// Returns [255, 0, 0]
chain.getColor(1, 'obj');// Returns {r:0, g:255, b:0}
chain[2].getColor('hex');// Returns "#0000FF"

// Set the color of all modules in the chain at once
chain.setColorAll('#ffffff');// Set all modules to white

// Reset modules and unexport the GPIO instances used for the chain's data and clock pins
chain.terminate();// The chain will become unusable after this
```

## API

#### Class P9813({options})

- datPin - EITHER: An [onoff Gpio instance](https://www.npmjs.com/package/onoff#class-gpio) of the data pin with a direction of 'out', OR: the data pin's GPIO line number.
- clkPin - EITHER: An [onoff Gpio instance](https://www.npmjs.com/package/onoff#class-gpio) of the clock pin with a direction of 'out', OR: the clock pin's GPIO line number.
- chainLength - Total number of modules in the chain. Defaults to 1.
- name - Helpful for debugging when using more than one chain at a time. Defaults to 'P9813 Chain'.
- delay - Clock delay in milliseconds. Some boards and chips may send GPIO signals too quickly for modules to process, resulting in modules (usually ones further down in longer chains) occasionally missing commands. Adding delay in the driver's clock method may help with this. Defaults to 0.

Represents a chain of P9813 modules. At minimum, the options object must include values for `datPin` and `clkPin`.

```js
import {P9813} from 'p9813';

const chain = new P9813({ datPin:531, clkPin:538 });
const chain2 = new P9813({ datPin:532, clkPin:533, chainLength:4, name:'Chain 2', delay:0 });
```

Existing Gpio instances can also be passed as `datPin` and `clkPin` rather than having the class's constructor make them from their line numbers:

```js
import {Gpio} from 'onoff';
import {P9813} from 'p9813';

const dataGPIO = new Gpio(531, 'out');
const clockGPIO = new Gpio(538, 'out');

const chain = new P9813({ datPin:dataGPIO, clkPin:clockGPIO });
```

##### P9813.setColor(index, color)

- index - Chain index of the target module (0 = first module, 1 = second module, etc.)
- color - Color to set module to. May be in the form of a hex code string, a [r, g, b] color array, or a {r, g, b} color object.

Set the color of a single module.

```js
chain.setColor(0, [0,255,0]);// Set the 1st module in the chain to green, using a color array for the input
```

##### P9813.getColor(index, format)

- index - Chain index of the target module (0 = first module, 1 = second module, etc.)
- format - Format to return color in. Valid options include 'hex' for hex code strings, 'arr' for [r, g, b] color arrays, and 'obj' for {r, g, b} color objects. Defaults to 'arr'.

Get the current color of a single module.

```js
chain.getColor(1, 'arr');// Return a color array of the color of the 2nd module in the chain
chain.getColor(0);// Return the color of the 1st module in the chain (NOTE: Will default to 'arr' if no return format is specified)
```

##### P9813.setColorAll(color)

- color - Color to set all modules to. May be in the form of a hex code string, a [r, g, b] color array, or a {r, g, b} color object.

Set all modules in the chain to the same color.

```js
chain.setColorAll([255, 255, 255]);// Set the color of every module in the chain to white
```

##### P9813.terminate()

Reset all modules in the chain to #000000, then unexport and free up the GPIO pins being used by the chain (chain will no longer be usable).

```js
chain.terminate();// Chain will be unusable after this
```

#### Object P9813[index]

- index - Chain index of the target module (0 = first module, 1 = second module, etc.)

Represents an individual P9813 module. P9813 chain classes automatically generate child module objects at initialization equal to their own chainLength value. Targeting a module through its parent chain is exactly the same as targeting the module directly.

```js
chain.setColor(0, '#ff0000');
// Is the same as
chain[0].setColor('#ff0000');
```
and
```js
chain.getColor(0, 'hex');
// Is the same as
chain[0].getColor('hex');
```

##### P9813[index].setColor(color)

- color - Color to set module to. May be in the form of a hex code string, a [r, g, b] color array, or a {r, g, b} color object.

Exact same functionality as [P9813.setColor(index, color)](#p9813setcolorindex-color), but the index number is used as the name of a key in the parant chain rather than passed as a method parameter

```js
chain[1].setColor([0,0,255]);// Set the 2nd module in the chain to blue, using a color array for the input
```

##### P9813[index].getColor(format)

- format - Format to return color in. Valid options include 'hex', 'arr', and 'obj'. Defaults to 'arr' if no format is specified.

Exact same functionality as [P9813.getColor(index, format)](#p9813getcolorindex-format), but the index number is used as the name of a key in the parant chain rather than passed as a method parameter

```js
chain[2].getColor('hex');// Return a hex code string of the color of the 3rd module in the chain
```

## Troubleshooting & Common Issues

### Note Regarding Power Rating

It's worth mentioning that, although the official P9813 datasheet mentions that the chip itself can drive LEDs up to 24V, most modules on the market that integrate it seem to be designed to handle up to 12V.

### Error: EINVAL (Invalid GPIO pin number)

If you're seeing an error similar to this,
```
node:fs:2914
    return binding.writeFileUtf8(
                   ^

Error: EINVAL: invalid argument, write
```
it usually means the system can't find any GPIO pins with the line numbers you specified.

### Error: Could not locate the bindings file (NPM approval needed)

If you're seeing an error similar to this,
```
/.../<PROJECT_ROOT>/node_modules/bindings/bindings.js:126
  err = new Error(
        ^

Error: Could not locate the bindings file. Tried:
```
NPM needs you to approve and re-run the post-install build scripts for certain dependencies (in this case, `epoll`, used by `onoff`). Refer to [Installation](#installation).

### User doesn't have correct permissions

WIP

### Pins do not terminate correctly, leaving LED strips lit up after exit/shutdown

WIP

### Driver works properly once but fails on subsequent attempts until reboot (Missing GPIO unexport permissions OR Unusual board-specific GPIO implementation)

This behavior suggests one of the following:
- You have the correct permissions to open a GPIO pin, but for whatever reason you don't have the permissions needed to unexport/close or overwrite/take control of an in-use GPIO pin
- Your board has an unusual method for freeing up GPIO instances that `onoff` doesn't support. Subsequent attempts to use the driver are failing because it thinks the pins are already in use by something else which it isn't able to take control from.

A permanent solution for the latter can be tricky because it depends on how your board has implemented GPIO (if you're running into this issue, there's probably already some non-standard implementation going on).
The former, however, can be easily solved by running your script as superuser/administrator, or briefly re-opening and closing the pin as superuser/admin between uses with a script like the following:
```js
// (Run this as superuser)
import {Gpio} from 'onoff';
const problemPinNumber = 123;// Replace with your pin number
const problemGPIO = new Gpio(problemPinNumber, 'out');// Should be able to take control of the active pin
problemGPIO.unexport();
```

A helpful cli script that accomplishes this has been added as of v1.0.3. To use it, run the following, adjusting for your target GPIO number:

```sh
# Replace 123 with the target GPIO line number
sudo npm run forceUnexport "123"
```
or
```sh
# Replace 123 with the target GPIO line number
sudo node ./forceUnexport.js "123"
```

## To-Do

- Expand Troubleshooting & Common Issues section
- Add CLI tool to help with figuring out line numbers

## License

Copyright &copy; 2026, phasn <phasn@proton.me> (https://github.com/phasn).

Licensed under the [MIT License](LICENSE).
