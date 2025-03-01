import { Gpio as GPIO } from "pigpio";

// Compute pin numbers
const PINS = {
    Left: {
        forward: parseInt(process.env.LM1 || "24"),
        backward: parseInt(process.env.LM2 || "23"),
        speed: parseInt(process.env.LM_PWM || "25"),
    },
    Right: {
        forward: parseInt(process.env.RM1 || "17"),
        backward: parseInt(process.env.RM2 || "27"),
        speed: parseInt(process.env.RM_PWM || "22"),
    }
}

// setup 
const Output = {
    Left: {
        forward: new GPIO(PINS.Left.forward, {mode: GPIO.OUTPUT}),
        backward: new GPIO(PINS.Left.backward, {mode: GPIO.OUTPUT}),
        speed: new GPIO(PINS.Left.speed, {mode: GPIO.OUTPUT})
    },
    Right: {
        forward: new GPIO(PINS.Right.forward, {mode: GPIO.OUTPUT}),
        backward: new GPIO(PINS.Right.backward, {mode: GPIO.OUTPUT}),
        speed: new GPIO(PINS.Right.speed, {mode: GPIO.OUTPUT}),
    }
}


export default Output;