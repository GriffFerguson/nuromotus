const PWM = {
    OFF: 0,
    MIDDLE: 1500,
    BACKWARD: 1750,
    FORWARD: 1250,
    increment: {
        left: 100,
        right: 100
    },
    LIMIT: {
        MIN: 1000,
        MAX: 2000
    }
}

export default PWM;

/* for motor speed fine tuning */
const SPEED_RANGE = {
    forward: PWM.FORWARD - PWM.MIDDLE,
    backward: PWM.BACKWARD - PWM.MIDDLE
}

// FORWARD and BACKWARD speeds are multiplied by this value to control final speed
const TUNING = {
    left: 1,
    right: .8
};

export const TUNED_SPEEDS = {
    left: {
        forward: PWM.MIDDLE + Math.round(SPEED_RANGE.forward * TUNING.left),
        backward: PWM.MIDDLE + Math.round(SPEED_RANGE.backward * TUNING.left)
    },
    right: {
        forward: PWM.MIDDLE + Math.round(SPEED_RANGE.forward * TUNING.right),
        backward: PWM.MIDDLE + Math.round(SPEED_RANGE.backward * TUNING.right)
    },
}