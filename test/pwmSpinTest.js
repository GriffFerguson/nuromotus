const Output = require("../dist/controller/motors");

/* to run on RPi; tests individual PWM outputs */

// test for PWM_0 (Output.Right)
console.log("Starting test for PWM_0");
let PWM0_Pulse = 1450;  // start 50 below off, as the signal will be incremented by 50 before it gets sent for the first time
const PWM0_Test = setInterval(() => {
    PWM0_Pulse += 50
    if (PWM0_Pulse > 2000) {
        console.log("PWM_0 test complete. Sending stop signal (1500 microseconds)");
        Output.Left[0].servoWrite(1500);
        // Output.PWM_0[1].servoWrite(1500);
        console.log("PWM_0 stop signal sent, exiting test.")
        clearInterval(PWM0_Test);
        startPWM1Test();
        return;
    }
    console.log(`Sending pulse of ${PWM0_Pulse} microseconds (${((PWM0_Pulse - 1500) / 500) * 100}%)`);
    Output.Left[0].servoWrite(PWM0_Pulse);
    // Output.PWM_0[1].servoWrite(PWM0_Pulse);
}, 1000)

// test for PWM_1 (Output.Left)
function startPWM1Test() {
    console.log("Starting test for PWM_1");
    let PWM1_Pulse = 1450;  // start 50 below off, as the signal will be incremented by 50 before it gets sent for the first time
    const PWM1_Test = setInterval(() => {
        PWM1_Pulse += 50
        if (PWM1_Pulse > 2000) {
            console.log("PWM_1 test complete. Sending stop signal (1500 microseconds)");
            Output.Right[0].servoWrite(1500);
            // Output.PWM_1[1].servoWrite(1500);
            console.log("PWM_1 stop signal sent, exiting test.")
            clearInterval(PWM1_Test);
            return;
        }
        console.log(`Sending pulse of ${PWM1_Pulse} microseconds (${((PWM1_Pulse - 1500) / 500) * 100}%)`);
        Output.Right[0].servoWrite(PWM1_Pulse);
        // Output.PWM_1[1].servoWrite(PWM1_Pulse);
    }, 1000)
}