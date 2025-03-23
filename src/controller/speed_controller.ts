import PWM, { TUNING } from "../constants";
import Output from "./motors";

let Speed = {
    left: PWM.OFF,
    right: PWM.OFF,
}

let requestedSpeed = {
    left: PWM.OFF,
    right: PWM.OFF
}


export default function SpeedController(data: WSMotorDriveRequest) {
    // left motor
    if (data.left == "forward") {
        if (Speed.left == PWM.OFF || Speed.left == PWM.MIDDLE) {
            Speed.left = PWM.LIMIT.MIN;
            Output.Left.servoWrite(PWM.LIMIT.MIN);  // max operating speed going forward
            setTimeout(() => {
                requestedSpeed.left = PWM.FORWARD * TUNING.left;
            }, 80)
        } else {
            requestedSpeed.left = PWM.FORWARD * TUNING.left;
        }
    } else if (data.left == "backward") {
        requestedSpeed.left = PWM.BACKWARD * TUNING.left;
    } else {
        requestedSpeed.left = PWM.MIDDLE * TUNING.left;
    }

    // right motor
    if (data.right == "forward") {
        if (Speed.right == PWM.OFF || Speed.right == PWM.MIDDLE) {
            Speed.right = PWM.LIMIT.MIN;
            Output.Right.servoWrite(PWM.LIMIT.MIN);  // max operating speed going forward
            setTimeout(() => {
                requestedSpeed.right = PWM.FORWARD * TUNING.right;
            }, 80)
        } else {
            requestedSpeed.right = PWM.FORWARD * TUNING.right;
        }
    } else if (data.right == "backward") {
        requestedSpeed.right = PWM.BACKWARD * TUNING.right;
    } else {
        requestedSpeed.right = PWM.MIDDLE * TUNING.right;
    }
}

// every 100ms increase/decrease motor speed to accelerate to requested speed
setInterval(() => {
    // left motor
    if (Speed.left < requestedSpeed.left) {
        if (Speed.left == PWM.OFF) {
            if (requestedSpeed.left > PWM.MIDDLE) {
                Speed.left = PWM.MIDDLE + PWM.increment.left;
            } else {
                Speed.left = PWM.MIDDLE - PWM.increment.left;
            }
        } else if (Speed.left + PWM.increment.left > requestedSpeed.left) {
            Speed.left = requestedSpeed.left;
        } else if (Speed.left + PWM.increment.left > PWM.BACKWARD) {    // backward is the highest safe operating value
            Speed.left = PWM.BACKWARD;
        } else if (Speed.left + PWM.increment.left > PWM.LIMIT.MAX) {
            Speed.left = PWM.LIMIT.MAX;
        } else {
            Speed.left += PWM.increment.left;
        }
    } else if (Speed.left > requestedSpeed.left) {
        if (Speed.left - PWM.increment.left < requestedSpeed.left) {
            Speed.left = requestedSpeed.left;
        } else if (Speed.left - PWM.increment.left < PWM.FORWARD) {
            Speed.left = PWM.FORWARD;
        } else if (Speed.left - PWM.increment.left < PWM.LIMIT.MIN) {
            Speed.left = PWM.LIMIT.MIN;
        } else {
            Speed.left -= PWM.increment.left;
        }
    }

    // right motor
    if (Speed.right < requestedSpeed.right) {
        if (Speed.right == PWM.OFF) {
            if (requestedSpeed.left > PWM.MIDDLE) {
                Speed.right = PWM.MIDDLE + PWM.increment.left;
            } else {
                Speed.right = PWM.MIDDLE - PWM.increment.left;
            }
        } else if (Speed.right + PWM.increment.right > requestedSpeed.right) {
            Speed.right = requestedSpeed.right;
        } else if (Speed.right + PWM.increment.right > PWM.BACKWARD) {    // backward is the highest safe operating value
            Speed.right = PWM.BACKWARD;
        } else if (Speed.right + PWM.increment.right > PWM.LIMIT.MAX) {
            Speed.right = PWM.LIMIT.MAX;
        } else {
            Speed.right += PWM.increment.right;
        }
    } else if (Speed.right > requestedSpeed.right) {
        if (Speed.right - PWM.increment.right < requestedSpeed.right) {
            Speed.right = requestedSpeed.right;
        } else if (Speed.right - PWM.increment.right < PWM.FORWARD) {
            Speed.right = PWM.FORWARD;
        } else if (Speed.right - PWM.increment.right < PWM.LIMIT.MIN) {
            Speed.right = PWM.LIMIT.MIN;
        } else {
            Speed.right -= PWM.increment.right;
        }
    }

    // apply speed
    Output.Left.servoWrite(Speed.left);
    Output.Right.servoWrite(Speed.right);
}, 200)