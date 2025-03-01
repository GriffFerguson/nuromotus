import { Cortex } from ".";
import Log from "../logger";
import { RPCRequest } from "./rpc";

let headset: string;


export function connectHeadset(data: RPCResponse) {
    // from headset query
    // error checking
    if (data.error || !data.result[0] || !data.result[0].connectedBy) {
        Log("Could not detect a connected headset\n" + data.error, 3);
    }

    // connect to headset
    // https://emotiv.gitbook.io/cortex-api/headset/controldevice
    Log("Detected headset, preparing to connect", 0)
    headset = data.result[0].id
    Cortex.send(RPCRequest(
        "controlDevice",
        {
            "command": "connect",
            "headset": headset
        },
        "connect_headset"
    ))
}

export function authorizeCortex(data: RPCResponse) {
    if (data.error) {
        Log("Could not connect to headset due to API error\n" + data.error, 3);
    }

    if (data.result) {
        Log(`SUCCESS: Connected to headset ${headset}`, 0);
    } else {
        // basically does the safe thing as the `if (data.error)` above
        Log("Could not connect to headset\n" + data.error, 3);
    }

    Cortex.send(RPCRequest(
        "authorize",
        {
            "clientId": process.env.EMOTIV_ID,
            "clientSecret": process.env.EMOTIV_SECRET
        },
        "authorize_cortex"
    ))
}

export function createCortexSession(data: RPCResponse) {
    Log("SUCCESS: Received authorization from Cortex", 0);
    if (data.error) {
        Log("Could not get authorization from Cortex\n" + data.error, 3);
    }

    Cortex.send(RPCRequest(
        "createSession",
        {
            "cortexToken": data.result.cortexToken,
            "headsetId": headset,
            "status": "active"
        },
        "session_created"
    ))
}