import WebSocket from "ws";
import Log from "../logger";
import PWM from "../values";

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
        Motors.left.speed = PWM.SPEED;
        Motors.right.speed = PWM.SPEED;
        Motors.left.direction = "forward";
        Motors.right.direction = "backward";
    } else if (command="right") {
        Motors.left.speed = PWM.SPEED;
        Motors.right.speed = PWM.SPEED;
        Motors.left.direction = "backward";
        Motors.right.direction = "forward";
    } else {    // this includes neutral commands
        Motors.left.speed = PWM.OFF;
        Motors.right.speed = PWM.OFF;
    }

    MotorController.send(JSON.stringify(Motors))
}