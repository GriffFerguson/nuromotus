const GPIO = require("pigpio").Gpio;

console.log("Cleaning up GPIO pins.")
for (var pin = 0; pin < 28; pin++) {
    console.log(`Cleaning up GPIO ${pin}.`)
    let pinout = new GPIO(pin, {mode: GPIO.OUTPUT});
    pinout.GPIO(0);
}
console.log("Done.")