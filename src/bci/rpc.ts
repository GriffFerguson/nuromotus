export default function RPCRequest(
    method: string,
    params?: Object,
    id?: number | string
) {
    let data = JSON.stringify({
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: id
    })

    return data;
}