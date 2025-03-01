type WSRequest = {
    type: "MotorDrive"
}

interface WSMotorDriveRequest extends WSRequest {
    motor: "left" | "right" | "dual",
    direction: "forward" | "backward",
    speed?: number,
    increment?: number
}