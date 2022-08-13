const loggingOutput = document.querySelector('#output');
class Logger {
    static log(contents) {
        loggingOutput.innerHTML = contents;
    }
}

function template(strings, ...keys) {
    return (...values) => {
        let dict = values[values.length - 1] || [];
        let result = [strings[0]];
        keys.forEach((key, index) => {
            let value = Number.isFinite(key) ? values[key] : dict[key];
            result.push(value, strings[index + 1]);
        });
        return result.join('');
    };
}

/**
 * 
 * @this 
 * @param {Function} func 
 * @param {any} thisObj 
 * @param  {...any} args 
 */
export function defer(func, thisObj, ...args) {
    setTimeout(func.bind(thisObj), 0.01, ...args);
}

export {Logger, template};