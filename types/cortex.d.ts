type RPCRequest = {
    jsonrpc: "2.0",
    method: string,
    params?: Object,
    id?: number | string
}

type RPCResponse = {
    jsonrpc: "2.0",
    result: any,
    error?: Object,
    warning?: {
        code: number,
        message: {
            headsetId?: string,
            behavior: string
        }
    }
    id: number | string,
}

type DataSample = {
    // data for the mental commands ("com") stream
    com: Array<
        "neutral" | "push" | "pull" | "left" | "right",
        number
    >,
    sid: string,    // session ID
    time: number
}