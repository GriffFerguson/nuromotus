import WebSocket from "ws";
import { resolve } from "path";
import { RPCRequest } from "./rpc";
const dotenv = require("dotenv");

// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});
// Add secrets to env
dotenv.config({path: resolve(__dirname, "../../.env")});
console.log(process.env.CORTEX_URL)

const Cortex = new WebSocket(process.env.CORTEX_URL!);

Cortex.onmessage = (e) => {
    console.log(e);
    // TODO: implement proper connection to Motor Controller service
}

Cortex.onopen = (e) => {
    // begin by authenticating
    Cortex.send(RPCRequest(
        "requestAccess",
        {
            "clientID": process.env.EMOTIV_ID,
            "clientSecret": process.env.EMOTIV_SECRET
        }
    ))
}