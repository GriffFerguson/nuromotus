import WebSocket from "ws";
import Log from "../logger";
import PWM from "../constants";
import { resolve } from "path";
const dotenv = require("dotenv");

// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});
if (!process.env.CONTROLLER_URL) {
    Log("Controller URL not provided; cannot connect to motor controller via WebSockets.", 3);
}

const MotorController = new WebSocket(process.env.CONTROLLER_URL!);

export default function processData(command: MentalCommands, intensity: number) {
    let Motors: WSMotorDriveRequest = {
        type: "MotorDrive",
        left: {
            speed: 0,
            increment: 0,
            direction: "forward"
        },
        right: {
            speed: 0,
            increment: 0,
            direction: "forward"
        }
    }

    if (command == "push") {        // move forward
        Motors.left.increment = PWM.increment;
        Motors.right.increment = PWM.increment;
        Motors.left.direction = "forward";
        Motors.right.direction = "forward";
    } else if (command == "pull") { // move backward
        Motors.left.increment = PWM.increment;
        Motors.right.increment = PWM.increment;
        Motors.left.direction = "backward";
        Motors.right.direction = "backward";
    } else if (command == "left") {
        Motors.left.speed = PWM.FORWARD;
        Motors.right.speed = PWM.BACKWARD;
        Motors.left.direction = "forward";
        Motors.right.direction = "backward";
    } else if (command =="right") {
        Motors.left.speed = PWM.BACKWARD;
        Motors.right.speed = PWM.FORWARD;
        Motors.left.direction = "backward";
        Motors.right.direction = "forward";
    } else if (command == "lift") { // led test
        console.log("BCI attempting to run LED test")
        MotorController.send(JSON.stringify({
            type: "LEDTest",
            value: (intensity > 0.4)
        }))
        return;
    } else {    // this includes neutral commands
        Motors.left.speed = PWM.OFF;
        Motors.right.speed = PWM.OFF;
    }

    MotorController.send(JSON.stringify(Motors))
}