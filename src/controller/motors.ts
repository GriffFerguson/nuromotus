import { Gpio as GPIO, configureClock, CLOCK_PWM } from "pigpio";

// configure PWM
configureClock(10, CLOCK_PWM);


// Compute pin numbers
const PINS = {
    Left: parseInt(process.env.LM_PWM || "13"),
    Right: parseInt(process.env.RM_PWM || "12"),
    Converter: parseInt(process.env.RM_PWM || "17")
}

// setup 
const Output = {
    Left: new GPIO(PINS.Left, {mode: GPIO.OUTPUT}),
    Right: new GPIO(PINS.Right, {mode: GPIO.OUTPUT}),
    Converter: new GPIO(PINS.Converter, {mode: GPIO.OUTPUT}),
    LED: new GPIO(2, {mode: GPIO.OUTPUT})
}

Output.Converter.digitalWrite(1);   // always on to ensure voltage shifters are active
// set PWM frequency (2000Hz or 0.5ms)
Output.Left.pwmFrequency(2000);
Output.Right.pwmFrequency(2000);
// set PWM range
Output.Left.pwmRange(50);
Output.Right.pwmRange(50);

export default Output;