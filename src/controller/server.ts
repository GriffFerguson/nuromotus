import { WebSocketServer } from "ws";
import { resolve } from "path";
import Log from "../logger";
import MotorDriver from "./motor_driver";
import LEDTest from "./led_test";
const dotenv = require("dotenv");
// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});
// Add secrets to env
dotenv.config({path: resolve(__dirname, "../../.env")});

const PORT = parseInt(process.env.CONTROLLER_PORT || "8080")
const Server = new WebSocketServer({port: PORT});
Log("Started WebSocket server on port " + PORT, 0);

Server.on("connection", socket => {
    Log("Incoming connection", 1);
    socket.on("message", (raw) => {
        let req: WSRequest;
        try {
            req = JSON.parse(raw.toString());

            if (!req.type) {
                throw "No valid \"type\" property; invalid request.";
            }
        } catch (error) {
            Log("Received test non-JSON message; assuming test message.\n" + raw.toString() + "\nProcessed with error: " + error, 1)
            return;
        }

        if (req.type == "MotorDrive") {
            let data: WSMotorDriveRequest = (req as WSMotorDriveRequest);
            MotorDriver(data);
        } else if (req.type == "LEDTest") {
            let data: WSLEDTestRequest = (req as WSLEDTestRequest);
            Log(`Received LED test signal with value ${data.value}`, 1);
            LEDTest(data.value);
        }
    })
})