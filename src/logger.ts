/* Log Levels
 * 0: Debug
 * 1: Warn
 * 2: Error
 * 3: Fatal error
 */
export default function Log(message: string | number | null | undefined, level: 0 | 1 | 2 | 3) {
    let levelStr = "";

    switch (level) {
        case 0:
            levelStr = "DEBUG";
            break;
        case 1:
            levelStr = "WARNING";
            break;
        case 2: 
            levelStr = "ERROR";
            break;
        case 3: 
            levelStr = "FATAL";
            break;
    }
    
    console.log(`[${levelStr}] ${message}`)

    if (level == 3) {
        throw "Exiting code due to fatal error";
    }
}