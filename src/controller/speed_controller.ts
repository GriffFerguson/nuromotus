import PWM from "../constants";
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
        requestedSpeed.left = PWM.FORWARD;
    } else if (data.left == "backward") {
        requestedSpeed.left = PWM.BACKWARD;
    } else {
        requestedSpeed.left == PWM.MIDDLE;
    }

    // right motor
    if (data.right == "forward") {
        requestedSpeed.right = PWM.FORWARD;
    } else if (data.right == "backward") {
        requestedSpeed.right = PWM.BACKWARD;
    } else {
        requestedSpeed.right == PWM.MIDDLE;
    }
}

// every 100ms increase/decrease motor speed to accelerate to requested speed
setInterval(() => {
    // left motor
    if (Speed.left < requestedSpeed.left) {
        if (Speed.left == PWM.OFF) {
            Speed.left = PWM.MIDDLE += PWM.increment.left;
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
        if (Speed.left == PWM.OFF) {
            Speed.left = PWM.MIDDLE -= PWM.increment.left;
        } else if (Speed.left - PWM.increment.left < requestedSpeed.left) {
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
            Speed.right = PWM.MIDDLE += PWM.increment.right;
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
        if (Speed.right == PWM.OFF) {
            Speed.right = PWM.MIDDLE -= PWM.increment.right;
        } else if (Speed.right - PWM.increment.right < requestedSpeed.right) {
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