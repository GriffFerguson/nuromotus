import { Cortex } from ".";
import Log from "../logger";
import RPCRequest from "./rpc";
import * as Readline from "readline";
import { stdin, stdout } from "process";

const rl = Readline.createInterface(stdin, stdout);
let headsetID = "";

export function connectHeadset(data: RPCResponse) {
    // from headset query
    // error checking
    if (data.error || !data.result[0] || !data.result[0].connectedBy) {
        Log("Could not detect a connected headset\n" + data.error, 3);
    }

    let headsetIndex = 0;

    Log("Detected headset, preparing to connect", 0)

    let headsetList = (data.result as Array<any>).map(headset => {
        return headset.id;
    });

    console.log("---- Select a headset: ----");
    for (var i = 0; i < headsetList.length; i++) {
        console.log(`${i}: ${headsetList[i]}`)
    }

    rl.question("Type your selection: ", selection => {
        try {
            headsetIndex = parseInt(selection)

        } catch(error) {
            Log(`Invalid choice "${selection}"; connecting to default headset."`, 2);
        }
        Log(`Connecting to headset "${headsetList[headsetIndex]}"`, 0);

        // connect to headset
        // https://emotiv.gitbook.io/cortex-api/headset/controldevice
        headsetID = headsetList[headsetIndex];
        Cortex.send(RPCRequest(
            "controlDevice",
            {
                "command": "connect",
                "headset": headsetID
            },
            "connect_headset"
        ))
    })
}

export function authorizeCortex(data: RPCResponse) {
    if (data.error) {
        Log("Could not connect to headset due to API error\n" + data.error, 3);
    }

    if (data.result) {
        Log(`SUCCESS: Connected to headset ${headsetID}`, 0);
    } else {
        // basically does the safe thing as the `if (data.error)` above
        Log("Could not connect to headset\n" + data.error, 3);
    }

    Cortex.send(RPCRequest(
        "authorize",
        {
            "clientId": process.env.EMOTIV_ID,
            "clientSecret": process.env.EMOTIV_SECRET,
            "debit": 1
        },
        "authorize_cortex"
    ))

    return headsetID;
}

export function createCortexSession(data: RPCResponse, headset: string) {
    Log("SUCCESS: Received authorization from Cortex", 0);
    if (data.error) {
        Log("Could not get authorization from Cortex\n" + data.error, 3);
    }

    Cortex.send(RPCRequest(
        "createSession",
        {
            "cortexToken": data.result.cortexToken,
            "headset": headset,
            "status": "active"
        },
        "session_created"
    ))

    return data.result.cortexToken
}