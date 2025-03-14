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