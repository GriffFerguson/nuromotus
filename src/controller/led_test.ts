import Output from "./motors";

export default function LEDTest(value: boolean) {
    Output.LED.digitalWrite(value ? 1 : 0);
}