import {Globals} from '../game.js';

/**
 * 
 * @param {number} x the un
 * @param {number} y 
 * @returns 
 */
export function normalizePoint(x, y) {
    let {width: canvasWidth, height: canvasHeight} = Globals.getGameDimensions();
    let normalizedX = x / canvasWidth;
    let normalizedY = y / canvasHeight;
    //console.info(`Normalized X: ${normalizedX}, Normalized Y: ${normalizedY}`);
    return {
        x: normalizedX,
        y: normalizedY
    };
}

export function normalizeBox(x, y, width, height) {
    let {width: canvasWidth, height: canvasHeight} = Globals.getGameDimensions();
    let normalizedX = x / canvasWidth;
    let normalizedY = y / canvasHeight;
    let normalizedWidth = width / canvasWidth;
    let normalizedHeight = height / canvasHeight;
    //console.info(`Normalized: X: ${normalizedX}, Y: ${normalizedY}, Width: ${normalizedWidth}, Height: ${normalizedHeight}`);
    return {
        x: normalizedX,
        y: normalizedY,
        width: normalizedWidth,
        height: normalizedHeight
    };
}

export function rescaleBox({x, y, width, height}) {
    let {width: canvasWidth, height: canvasHeight} = Globals.getGameDimensions();
    let rescaledX = x * canvasWidth;
    let rescaledY = y * canvasHeight;
    let rescaledWidth = width * canvasWidth;
    let rescaledHeight = height * canvasHeight;
    // const infoStr = `Rescaled X: ${rescaledX}, Y:${rescaledY}, Width: ${rescaledWidth}, Height: ${rescaledHeight}`;
    // console.info(infoStr);
    return {
        x: rescaledX,
        y: rescaledY,
        width: rescaledWidth,
        height: rescaledHeight
    };
}

export function rescale(x, y) {
    let {width: canvasWidth, height: canvasHeight} = Globals.getGameDimensions();
    let rescaledX = x * canvasWidth;
    let rescaledY = y * canvasHeight;
    //console.info(`Rescaled X: ${rescaledX}, Normalized Y: ${rescaledY}`);
    return {
        x: rescaledX,
        y: rescaledY
    };
}

/**
 * 
 * @param {number} value 
 * @param {number} inMin 
 * @param {number} inMax 
 * @param {number} outMin 
 * @param {number} outMax 
 * @returns {number}
 */
export function scale(value, inMin, inMax, outMin, outMax) {
    const result = (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  
    if (result < outMin) {
      return outMin;
    } else if (result > outMax) {
      return outMax;
    }
  
    return result;
  }
