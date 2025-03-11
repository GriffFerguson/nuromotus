type WSRequest = {
    type: "MotorDrive" | "LEDTest"
}

type MotorDirection = "forward" | "backward" | "stop";

interface WSMotorDriveRequest extends WSRequest {
    left: MotorDirection,
    right: MotorDirection
}

interface WSLEDTestRequest extends WSRequest {
    value: boolean
}