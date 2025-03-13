import PWM from "../constants";
import Output from "./motors";

let Speed = {
    left: PWM.OFF,
    right: PWM.OFF,
} 

export default function MotorDriver(data: WSMotorDriveRequest) {
    // left motor
    if (data.left == "forward") {
        if (Speed.left - PWM.increment < PWM.FORWARD) {
            Speed.left = PWM.FORWARD;
        } else {
            Speed.left -= PWM.increment;
        }
    } else if (data.left == "backward") {
        if (Speed.left + PWM.increment > PWM.BACKWARD) {
            Speed.left = PWM.BACKWARD;
        } else {
            Speed.left += PWM.increment;
        }
    } else {
        Speed.left = PWM.OFF;
    }
    Output.Left.servoWrite(Speed.left);

    // right motor
    if (data.right == "forward") {
        if (Speed.right - PWM.increment < PWM.FORWARD) {
            Speed.right = PWM.FORWARD;
        } else {
            Speed.right -= PWM.increment;
        }
    } else if (data.right == "backward") {
        if (Speed.right + PWM.increment > PWM.BACKWARD) {
            Speed.right = PWM.BACKWARD;
        } else {
            Speed.right += PWM.increment;
        }
    } else {
        Speed.right = PWM.OFF;
    }
    Output.Right.servoWrite(Speed.right);
}