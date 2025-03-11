import WebSocket from "ws";
import Log from "../logger";
import { resolve } from "path";
const dotenv = require("dotenv");

// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});
if (!process.env.CONTROLLER_URL) {
    Log("Controller URL not provided; cannot connect to motor controller via WebSockets.", 3);
}

const MotorController = new WebSocket(process.env.CONTROLLER_URL!);

let average: {
    left: MotorDirection,
    right: MotorDirection,
    sums: {
        left: Array<number>,
        right: Array<number>
    }
} = {
    left: "stop",
    right: "stop",
    sums: {
        left: [],
        right: []
    }
}

function calculateAverageCommand(left: number, right: number): void {
    // left motor
    average.sums.left.push(left);
    if (average.sums.left.length > 10) {
        average.sums.left.shift();
    }

    let leftTotal = 0 
    for (let value of average.sums.left) {
        leftTotal += value;
    }

    let leftAverage = Math.round(leftTotal / average.sums.left.length);

    switch(leftAverage) {
        case 1: // average is 1, or forward
            average.left = "forward";
            break;
        case -1:    // average is -1, or backward
            average.left = "backward";
            break;
        default:    // average is 0, or something weird, in which case stop
            average.left = "stop";
            break;
    }

    // right motor
    average.sums.right.push(left);
    if (average.sums.right.length > 10) {
        average.sums.right.shift();
    }

    let rightTotal = 0 
    for (let value of average.sums.right) {
        rightTotal += value;
    }

    let rightAverage = Math.round(leftTotal / average.sums.right.length);

    switch(rightAverage) {
        case 1: // average is 1, or forward
            average.right = "forward";
            break;
        case -1:    // average is -1, or backward
            average.right = "backward";
            break;
        default:    // average is 0, or something weird, in which case stop
            average.right = "stop";
            break;
    }
}

export default function processData(command: MentalCommands, intensity: number) {
    let Motors: WSMotorDriveRequest = {
        type: "MotorDrive",
        left: "stop",
        right: "stop"
    }

    if (command == "push") {        // move forward
        calculateAverageCommand(1, 1);
    } else if (command == "pull") { // move backward
        calculateAverageCommand(-1, -1);
    } else if (command == "left") { // turn left
        calculateAverageCommand(1, -1);
    } else if (command =="right") { // turn right
        calculateAverageCommand(-1, 1);
    } else if (command == "lift") { // led test
        console.log("BCI attempting to run LED test")
        MotorController.send(JSON.stringify({
            type: "LEDTest",
            value: (intensity > 0.4)
        }))
        return;
    } else {    // this includes neutral commands
        calculateAverageCommand(0, 0);
    }

    Motors.left = average.left;
    Motors.right = average.right;

    MotorController.send(JSON.stringify(Motors))
}