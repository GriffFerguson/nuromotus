import { Gpio as GPIO } from "pigpio";
import { resolve } from "path";
import Log from "../logger";
const dotenv = require("dotenv");
// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});

// Compute pin numbers
const PINS = {
    Left: [
        // [0] and [1] must match signals
        parseInt(process.env.LM_PWM1 || "13"),
        parseInt(process.env.LM_PWM2 || "19")
    ],
    Right: [
        // [0] and [1] must match signals
        parseInt(process.env.RM_PWM1 || "12"),
        parseInt(process.env.RM_PWM2 || "18")
    ],
    Power: {
        Left: [
            // always on, power for left motor
            parseInt(process.env.LM_POWER1 || "22"),
            parseInt(process.env.LM_POWER2 || "27")
        ],
        Right: [
            // always on, power for right motor
            parseInt(process.env.RM_POWER1 || "5"),
            parseInt(process.env.RM_POWER2 || "6")
        ]
    },
    // always on, power for voltage converter
    Converter: parseInt(process.env.CONVERTER || "17")
}

// setup 
const Output = {
    Left:   // PWM_1
        new GPIO(PINS.Left[0], {mode: GPIO.OUTPUT}),
    Right:  // PWM_0
        new GPIO(PINS.Right[0], {mode: GPIO.OUTPUT}),
    Power: {
        Left: [
            new GPIO(PINS.Power.Left[0], {mode: GPIO.OUTPUT}),
            new GPIO(PINS.Power.Left[1], {mode: GPIO.OUTPUT})
        ],
        Right: [
            new GPIO(PINS.Power.Right[0], {mode: GPIO.OUTPUT}),
            new GPIO(PINS.Power.Right[1], {mode: GPIO.OUTPUT})
        ],
    },
    Converter: new GPIO(PINS.Converter, {mode: GPIO.OUTPUT}),
    LED: new GPIO(2, {mode: GPIO.OUTPUT})
}

Output.Converter.digitalWrite(1);   // always on to ensure voltage shifters are active
// power for motors, always on (2 motors per side)
Output.Power.Left[0].digitalWrite(1);
Output.Power.Left[1].digitalWrite(1);
Output.Power.Right[0].digitalWrite(1);
Output.Power.Right[1].digitalWrite(1);
Log("Converter and all power outputs enabled with digital write of 1 (full)", 1);

export default Output;