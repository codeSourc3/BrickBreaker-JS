import {UnimplementedMethod} from '../errors/errors.js'


class GameObject {

    
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     * 
     * @abstract
     */
    draw(context) {
        throw new UnimplementedMethod(GameObject, this.draw);
    }

    /**
     * 
     * @param {number} elapsed 
     */
    update(elapsed) {
        throw new UnimplementedMethod(GameObject, this.update);
    }

    
}

export {GameObject};