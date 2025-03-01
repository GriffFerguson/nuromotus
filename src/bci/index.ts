import WebSocket from "ws";
import { resolve } from "path";
import { RPCRequest } from "./rpc";
import { connectHeadset, authorizeCortex, createCortexSession } from "./setupConnection";
import Log from "../logger";
const dotenv = require("dotenv");

// prevent unsecure TLS connection from preventing connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});
// Add secrets to env
dotenv.config({path: resolve(__dirname, "../../.env")});

export const Cortex = new WebSocket(process.env.CORTEX_URL!);

// send data to corresponding data handling functions based on RPC ID
Cortex.onmessage = (e) => {
    let data: RPCResponse = JSON.parse(e.data.toString());
    
    // functions found in setupConnections.ts
    // initial query to detect connected headset
    if (data.id == "initial_query") connectHeadset(data);
    // after headset is connected, authorize Cortex session
    else if (data.id == "connect_headset") authorizeCortex(data);
    // after cortex is authorized, create a session with the token
    else if (data.id == "authorize_cortex") createCortexSession(data);
    
    // TODO: implement proper connection to Motor Controller service
}

Cortex.on("open", () => {
    Log("Connection opened", 0);
    // begin by authenticating
    Cortex.send(RPCRequest(
        "requestAccess",
        {
            "clientId": process.env.EMOTIV_ID,
            "clientSecret": process.env.EMOTIV_SECRET
        }
    ))

    // connect headset
    // see https://emotiv.gitbook.io/cortex-api/headset/queryheadsets for response type
    let headset: string;
    Cortex.send(RPCRequest("queryHeadsets", {}, "initial_query"));
    // hand off to functions in setupConnections.ts (specifically connectHeadset)
})

Cortex.onerror = e => {
    Log(`Cortex API threw a fatal error!\n${e.error}\n${e.message}`, 3);
}