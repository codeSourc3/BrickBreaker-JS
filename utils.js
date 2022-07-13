const loggingOutput = document.querySelector('#output');
class Logger {
    static log(contents) {
        loggingOutput.innerHTML = contents;
    }
}

export {Logger};