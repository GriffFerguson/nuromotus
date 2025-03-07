const { WebSocket } = require("ws");
const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({path: resolve(__dirname, "../safe.env")});

console.log("running, connecting to " + process.env.CONTROLLER_URL);

const socket = new WebSocket(process.env.CONTROLLER_URL);

socket.on("open", () => {
    socket.send(JSON.stringify({
        type: "MotorDrive",
        left: {
            speed: 50,
            direction: "forward"
        },
        right: {
            speed: 50,
            direction: "forward"
        }
    }))
    console.log("spinning")

    setTimeout(() => {
        console.log("stopping");
        ws.send(JSON.stringify({
            type: "MotorDrive",
            left: {
                speed: 25,
                direction: "forward"
            },
            right: {
                speed: 25,
                direction: "forward"
            }
        }))
        console.log("done!");
    }, 1000)
})