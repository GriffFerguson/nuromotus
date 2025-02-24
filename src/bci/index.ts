import WebSocket from "ws";
import { resolve } from "path";
import { RPCRequest } from "./rpc";
import { connectHeadset, authorizeCortex, createCortexSession } from "./setupConnection";
const dotenv = require("dotenv");

// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});
// Add secrets to env
dotenv.config({path: resolve(__dirname, "../../.env")});
console.log(process.env.CORTEX_URL)

export const Cortex = new WebSocket(process.env.CORTEX_URL!);

// send data to corresponding data handling functions based on RPC ID
Cortex.onmessage = (e) => {
    let data: RPCResponse = JSON.parse(e.data.toString());
    
    // functions found in setupConnections.ts
    // initial query to detect connected headset
    if (data.id == "initial_query") connectHeadset(data);
    // after headset is connected, authorize Cortex session
    else if (data.id == "connect_headset") authorizeCortex(data)
    // after cortex is authorized, create a session with the token
    else if (data.id == "authorize_cortex") createCortexSession(data)
    
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

    // connect headset
    // see https://emotiv.gitbook.io/cortex-api/headset/queryheadsets for response type
    let headset: string;
    Cortex.send(RPCRequest("queryHeadsets", {}, "initial_query"));
    // hand off to functions in setupConnections.ts (specifically connectHeadset)
}