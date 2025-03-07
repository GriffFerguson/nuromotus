import Output from "./motors";

let Speed = {
    left: 25,
    right: 25,
} 

export default function MotorDriver(data: WSMotorDriveRequest) {
    // left motor
    if (data.left.speed && data.left.speed >= 0 && data.left.speed <= 50) {
        Speed.left = data.left.speed;
        Output.Left.pwmWrite(data.left.speed)
    } else {
        Speed.left += data.left.increment || 0;
        Output.Left.pwmWrite(data.left.increment || 0);
    }

    // right motor
    if (data.right.speed && data.right.speed >= 0 && data.right.speed <= 50) {
        Speed.right = data.right.speed;
        Output.Left.pwmWrite(data.right.speed)
    } else {
        Speed.right += data.right.increment || 0;
        Output.Left.pwmWrite(data.right.increment || 0);
    }

}