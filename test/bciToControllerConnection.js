const {WebSocketServer} = require("ws");
const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({path: resolve(__dirname, "../safe.env")});

const PORT = parseInt(process.env.CONTROLLER_PORT || "8080")
const wss = new WebSocketServer({port: PORT});

wss.on("connection", socket => {
    socket.on("message", data => {
        console.log(JSON.parse(data));
    })
})