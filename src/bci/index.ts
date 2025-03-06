import WebSocket from "ws";
import { resolve } from "path";
import RPCRequest from "./rpc";
import { connectHeadset, authorizeCortex, createCortexSession } from "./setupConnection";
import Log from "../logger";
import { listenForCommands, subscribeToCommands } from "./dataSubscription";
const dotenv = require("dotenv");

// prevent unsecure TLS connection from preventing connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Add generic information to env
dotenv.config({path: resolve(__dirname, "../../safe.env")});
// Add secrets to env
dotenv.config({path: resolve(__dirname, "../../.env")});

export const Cortex = new WebSocket(process.env.CORTEX_URL!);

let params = {
    headset: "",        // headseet ID, received during "initial_query"
    cortexToken: "",    //  Cortex access token, received during "connect_headset"
    sessionID: "",      // session ID, received during "session_created"
}

// send data to corresponding data handling functions based on RPC ID
Cortex.onmessage = (e) => {
    let data: RPCResponse = JSON.parse(e.data.toString());
    
    // functions found in setupConnections.ts
    // initial query to detect connected headset
    if (data.id == "initial_query") connectHeadset(data);
    // after headset is connected, authorize Cortex session
    else if (data.id == "connect_headset") {
        params.headset = authorizeCortex(data);
    }
    // after cortex is authorized, create a session with the token
    else if (data.id == "authorize_cortex") {
        params.cortexToken = createCortexSession(data, params.headset);
    }
    // once the session is created, subscribe to the "mental commands (`com`) data stream"
    else if (data.id == "session_created") {
        params.sessionID = subscribeToCommands(data, params.cortexToken);
    }
    // after subscription to the mental commands data stream, process data on every packet returned
    else if ((data as unknown as DataSample).com) listenForCommands(data as unknown as DataSample);
    // handling for unknown messages
    else Log(`Received unknown message from Cortex: "${JSON.stringify(data)}"`, 1)
    
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

// close session before process exits
process.on("exit", () => {
    Cortex.send(RPCRequest(
        "unsubscribe",
        {
            "cortexToken": params.cortexToken,
            "session": params.sessionID,
            "status": ["com"]
        },
        "process_exit_unsubscribe"
    ));
    Cortex.send(RPCRequest(
        "updateSession",
        {
            "cortexToken": params.cortexToken,
            "session": params.sessionID,
            "status": "close"
        },
        "process_exit_close_session"
    ));
    Log("Cortex mental commands data stream unsubscribed and session closed; process is exiting.", 2)
})