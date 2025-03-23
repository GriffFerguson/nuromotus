# NÜROMOTUS

Welcome to the code repository for the NÜROMOTUS mind-controlled wheelchair! This is a mono-repo containing code for both the brain-computer interface (BCI) and the motor controller (controller), in addition to all test scripts.

This README documentation is primarily intended for reference by NUROMOTUS team members.

PNPM is used as the package manager. All source code for the `bci` and `controller` can be found in their respective folders in the `src` folder. The root script for the `bci` is `index.ts`, and the root script for the `controller` is `server.ts`. All source code is written in TypeScript and compiled to JavaScript. All tests are written in JavaScript.

## Development
### Fine-tuning motor speeds
In the file `src/constants.ts`, change the values for the `left` and `right` properties on the `TUNING` object. This influences what the requested speeds are within the speed controller to assist with getting the chair to move in a consistent direction.

Adjusting these values will require a restart of the controller server on the RPi after each change.

**Do not change the values listed in the `PWM` object.** These directly control the speeds for both motors and do not allow for fine control of the underlying operations of the motors. The only values that allow for fine control of individual motors in the `PWM` object are the parameters within `increment`, however these only control acceleration of the motors and have no reliable impact on final speed.

## Testing
### Interactive Motor Driver
The Interactive Motor Driver allows the motor controller to be tested using WASD-style controls.

**To run the test:**
The basic structure of the test requires the controller server to be running on the Raspberry Pi (`sudo pnpn dev:controller`), and then the test script (`pnpm test:interactive_motor_driver`) will attempt to connect to the motor controller server using whatever address is specified in the `CONTROLLER_URL` environment variable found in `safe.env`. 

**NOTE:** all commands must be run from the project root. For example, on the pi, the project root will be displayed in terminal as `/home/adamt/nuromotus` when running the command `pwd`, or in the terminal prompt as `~/nuromotus`. If you see a prompt stating "corepack will now install pnpm", you are in the wrong directory and none of this will work.

1. On the Raspberry Pi, launch the NUROMOTUS wireless network using either the desktop shortcut or the following command in terminal: `sudo nmcli con up NUROMOTUS`.
2. Start the motor controller by typing `sudo pnpm dev:controller` in a terminal on the Pi. **Do not close the terminal window.**
3. Using the default values found in `safe.env`, you can now run the test script from either the Pi or any other device connected to the NUROMOTUS network (if prompted for a password to connect, try "nuromotus"). To run the test: `pnpm test:interactive_motor_driver` in an empty terminal window on the device you wish to control the motors from.
<br>
**NOTE:** do not run the test script until the terminal window running the controller (as started in step 2) displays a message stating "`server running on port 8080`". This may take several minutes to display.
4. Instructions will appear on the screen stating what keys do what and how the script functions.
<br>
**WARNING:** the controller operates on a single speed that can be toggled on and off. Pressing a command key will immediately cause the motors to accelerate to that single speed and continue at that speed until a stop signal is sent.
5. To exit the test script, press `Ctrl + C` twice.
6. To exit the controller, press `Ctrl + C` once.

__Issues? Open an issue request on this GitHub or contact me.__