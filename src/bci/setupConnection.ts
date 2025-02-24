import { Cortex } from ".";
import { RPCRequest } from "./rpc";

let headset: string;


export function connectHeadset(data: RPCResponse) {
    // error checking
    if (data.error || !data.result[0] || !data.result[0].connected) {
        throw "Could not detect a connected headset\n" + data.error;
    }

    // connect to headset
    // https://emotiv.gitbook.io/cortex-api/headset/controldevice
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
        throw "Could not connect to headset\n" + data.error;
    }

    if (data.warning?.code == 104) {
        console.log(`SUCCESS: Connected to headset ${headset}`);
    } else {
        throw "Could not connect to headset\n" + data.error;
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
    if (data.error) {
        throw "Could not get authorization from Cortex\n" + data.error
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