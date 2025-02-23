export function RPCRequest(
    method: string,
    params?: Object,
    id?: number | string
) {
    return JSON.stringify({
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: id
    })
}