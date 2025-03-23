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
const TUNING_RATIO = (PWM.FORWARD / PWM.MIDDLE) - 1;

// FORWARD and BACKWARD speeds are multiplied by this value to control final speed
const TUNING = {
    left: 1,
    right: .8
};

export const TUNING_VALUES = {
    left: Math.round(TUNING.left * TUNING_RATIO),
    right: Math.round(TUNING.right * TUNING_RATIO)
}
