const { WebSocket } = require("ws");
const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({path: resolve(__dirname, "../safe.env")});

console.log("running, connecting to " + process.env.CONTROLLER_URL);

const socket = new WebSocket(process.env.CONTROLLER_URL);

socket.on("open", () => {
    socket.send(JSON.stringify({
        type: "MotorDrive",
        left: "forward",
        right: "forward"
    }))
    console.log("spinning")

    setTimeout(() => {
        console.log("stopping");
        socket.send(JSON.stringify({
            type: "MotorDrive",
            left: "stop",
            right: "stop"
        }))
        console.log("done!");
    }, 5000)
})