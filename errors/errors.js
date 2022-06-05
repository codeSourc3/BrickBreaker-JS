/**
 * Used when a class's method was not implemented by an abstract class or interface.
 */
class UnimplementedMethod extends Error {
    
    /**
     * 
     * @param {Function} classConstructor 
     * @param {CallableFunction | Symbol} methodFunc 
     */
    constructor(classConstructor, methodFunc) {
        super(`A subclass of ${classConstructor.name} did not implement method #${typeof methodFunc === 'symbol' ? methodFunc.description : methodFunc.name}().`);
    }
}

export {UnimplementedMethod};