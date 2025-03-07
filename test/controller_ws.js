const {WebSocketServer} = require("ws");
dotenv.config({path: resolve(__dirname, "../../safe.env")});

const PORT = parseInt(process.env.CONTROLLER_PORT || "8080")
const wss = new WebSocketServer({port: PORT});

wss.on("message", data => {
    console.log(JSON.stringify(data));
})