const { WebSocket } = require("ws");
const { resolve } = require("path");
const readline = require("readline");
const {stdin, stdout} = require("process");
const dotenv = require("dotenv");
dotenv.config({path: resolve(__dirname, "../safe.env")});

console.log("running, connecting to " + process.env.CONTROLLER_URL);

const rl = new readline.createInterface({input: stdin, output: stdout})
const socket = new WebSocket(process.env.CONTROLLER_URL);

socket.on("open", () => {
    let left = "stop";
    let right = "stop"
    console.log("connected");
    rl.input.on("keypress", key => {
        if (key == "w") {
            left = "forward";
            right = "forward";
        } else if (key == "a") {
            left = "backward";
            right = "forward";
        } else if (key == "d") {
            left = "forward";
            right = "backward";
        } else if (key == "s") {
            left = "backward";
            right = "backward";
        } else {
            left = "stop";
            right = "stop";
        }

        socket.send(JSON.stringify({
            type: "MotorDrive",
            left: left,
            right: right
        }))
    })
})