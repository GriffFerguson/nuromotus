type WSRequest = {
    type: "MotorDrive"
}

type MotorDirection = "forward" | "backward"
type MotorDriveRequestData = {
    speed?: number,
    increment?: number,
    direction: MotorDirection
}

interface WSMotorDriveRequest extends WSRequest {
    left: MotorDriveRequestData,
    right: MotorDriveRequestData
}

interface WSLEDTestRequest extends WSRequest {
    value: boolean
}