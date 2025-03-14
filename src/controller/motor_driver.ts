import PWM from "../constants";
import Output from "./motors";

let Speed = {
    left: PWM.OFF,
    right: PWM.OFF,
} 

export default function MotorDriver(data: WSMotorDriveRequest) {
    // left motor
    if (data.left == "forward") {
        if (Speed.left - PWM.increment.left < PWM.FORWARD) {
            if (Speed.left == 0) {
                Speed.left = PWM.MIDDLE - PWM.increment.left;
            } else {
                Speed.left = PWM.FORWARD;
            }
        } else {
            Speed.left -= PWM.increment.left;
        }
    } else if (data.left == "backward") {
        if (Speed.left == 0) {
            Speed.left = PWM.MIDDLE + PWM.increment.left;
        } else if (Speed.left + PWM.increment.left > PWM.BACKWARD) {
            Speed.left = PWM.BACKWARD
        } else {
            Speed.left += PWM.increment.left;
        }
    } else {
        Speed.left = PWM.OFF;
    }
    Output.Left.servoWrite(Speed.left);

    // right motor
    if (data.right == "forward") {
        if (Speed.right - PWM.increment.right < PWM.FORWARD) {
            if (Speed.right == 0) {
                Speed.right = PWM.MIDDLE - PWM.increment.right;
            } else {
                Speed.right = PWM.FORWARD;
            }
        } else {
            Speed.right -= PWM.increment.right;
        }
    } else if (data.right == "backward") {
        if (Speed.right == 0) {
            Speed.right = PWM.MIDDLE + PWM.increment.right;
        } else if (Speed.right + PWM.increment.right > PWM.BACKWARD) {
            Speed.right = PWM.BACKWARD
        } else {
            Speed.right += PWM.increment.right;
        }
    } else {
        Speed.right = PWM.OFF;
    }
    Output.Right.servoWrite(Speed.right);
}