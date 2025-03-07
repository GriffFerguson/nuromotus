const ws = require("ws");
const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({path: resolve(__dirname, "../../safe.env")});

const socket = new WebSocket(process.env.CONTROLLER_URL);

ws.on("open", () => {
    ws.send(JSON.stringify({
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
})