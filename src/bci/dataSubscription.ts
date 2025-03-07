import { Cortex } from ".";
import Log from "../logger";
import processData from "./processing";
import RPCRequest from "./rpc";

export function subscribeToCommands(data: RPCResponse, cortexToken: string) {
    if (data.error) {
        Log(`Could not create/activate a Cortex session.\n${JSON.stringify(data.error)}`, 3);
    }
    
    let id = data.result.id;    // cortex session ID
    Log(`Session created and activated with ID "${id}"!`, 0);

    Cortex.send(RPCRequest(
        "subscribe",
        {
            "cortexToken": cortexToken,
            "session": id,
            "streams": ["com"]
        },
        "subscribe_mental_commands"
    ))

    Log("SUCCESS! Now subscribed to mental commands data stream and receiving data.", 0)

    return id;
}

export function listenForCommands(data: DataSample) {
    processData(data.com[0], data.com[1]);
    Log(`Command ${data.com[0]} has intensity ${data.com[1]}`, 0);
}