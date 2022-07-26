export class Vec2 {
    constructor(x, y) {
        this.x = Number(x);
        this.y = Number(y);
    }

    /**
     * Scales an existing vector by a scale factor.
     * @param {Vec2} vec 
     * @param {number} scaleFactor 
     */
    static multiplyScalar(vec, scaleFactor) {
        vec.x *= scaleFactor;
        vec.y *= scaleFactor;
        return vec;
    }

    /**
     * 
     * @param {Vec2} vec 
     * @param {number} scalar 
     * @returns {Vec2}
     */
    static addScalar(vec, scalar) {
        vec.x += scalar;
        vec.y += scalar;
        return vec;
    }

    /**
     * 
     * @param {Vec2} vec 
     * @param {number} scalar 
     * @returns {Vec2}
     */
    static minusScalar(vec, scalar) {
        vec.x -= scalar;
        vec.y -= scalar;
        return vec;
    }

    /**
     * 
     * @param {Vec2} vec 
     * @param {number} scalar 
     * @returns {Vec2}
     */
    static divideByScalar(vec, scalar) {
        vec.x /= scalar;
        vec.y /= scalar;
        return vec;
    }

    /**
     * Inverts the Vector along the X-axis.
     * @param {Vec2} vec the vector to invert.
     * @returns {Vec2} the inverted vector
     */
    static invertX(vec) {
        vec.x = -vec.x;
        return vec;
    }

    /**
     * Inverts the vector along the Y-axis.
     * @param {Vec2} vec the vector to invert.
     * @returns {Vec2} the inverted vector.
     */
    static invertY(vec) {
        vec.y = -vec.y;
        return vec;
    }

    /**
     * Adds vec2 to vec1.
     * @param {Vec2} vec1 
     * @param {Vec2} vec2 
     */
    static add(vec1, vec2) {
        vec1.x += vec2.x;
        vec1.y += vec2.y;
        return vec1;
    }

    /**
     * 
     * @param {Vec2} vec1 
     * @param {Vec2} vec2 
     */
    static minus(vec1, vec2) {
        vec1.x -= vec2.x;
        vec1.y -= vec2.y;
        return vec1;
    }

    /**
     * 
     * @param {Vec2} vec1 
     * @param {Vec2} vec2 
     * @returns {Vec2}
     */
    static multiply(vec1, vec2) {
        vec1.x *= vec2.x;
        vec1.y *= vec2.y;
        return vec1;
    }

    /**
     * 
     * @param {Vec2} vec1 
     * @param {Vec2} vec2 
     * @returns {Vec2}
     */
    static divide(vec1, vec2) {
        vec1.x /= vec2.x;
        vec1.y /= vec2.y;
        return vec1;
    }
    
    /**
     * 
     * @param {Vec2} vec1 
     * @param {Vec2} vec2 
     * @returns {boolean}
     */
    static equals(vec1, vec2) {
        return vec1.x === vec2.x && vec1.y === vec2.y;
    }

    /**
     * 
     * @param {Vec2} vec1 
     * @param {Vec2} vec2 
     * @returns {number}
     */
    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    /**
     * 
     * @param {Vec2} vector the vector to find the length for.
     * @returns {number}
     */
    static length(vector) {
        return Math.sqrt(Vec2.dot(vector, vector));
    }

    /**
     * 
     * @param {Vec2} vec1 
     * @param {Vec2} vec2 
     * @param {number} fraction 
     */
    static lerp(vec1, vec2, fraction) {
        return vec2.minus(vec1).multiplyScalar(fraction).add(vec1);
    }


    /**
     * Adds a vector to the existing vector.
     * @param {Vec2} vec 
     * @returns {Vec2} the sum of the two vectors.
     */
    add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    /**
     * Subtracts the vector by another vector.
     * @param {Vec2} vec the vector to subtract by
     * @returns {Vec2} the subtracted vector.
     */
    minus(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    /**
     * 
     * @param {number} scalar 
     * @returns {Vec2}
     */
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }

    /**
     * 
     * @param {number} scalar 
     * @returns {Vec2}
     */
    minusScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }

    /**
     * 
     * @param {number} scalar 
     * @returns {Vec2}
     */
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * 
     * @param {number} scalar 
     * @returns {Vec2}
     */
    divideByScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }



    /**
     * Inverts the vector.
     * @returns {Vec2} the inverted vector.
     */
    invert() {
        return new Vec2(-this.x, -this.y);
    }

    invertX() {
        return new Vec2(-this.x, this.y);
    }

    invertY() {
        return new Vec2(this.x, -this.y);
    }

    /**
     * Calculates the length of the vector.
     * @returns {number} the length of the vector.
     */
    get length() {
        return Math.sqrt(this.dot(this));
    }

    /**
     * Finds the unit vector of the current vector.
     * 
     * @returns {Vec2} the unit vector.
     */
    get unit() {
        return this.divideByScalar(this.length);
    }

    /**
     * 
     * @param {Vec2} vector 
     * @returns {Vec2}
     */
    multiply(vector) {
        return new Vec2(this.x * vector.x, this.y * vector.y);
    }

    /**
     * 
     * @param {Vec2} vector another vector
     * @returns {Vec2}
     */
    divide(vector) {
        return new Vec2(this.x / vector.x, this.y / vector.y);
    }

    /**
     * 
     * @param {Vec2} vector 
     * @returns {boolean}
     */
    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }

    /**
     * Returns the dot product of a vector.
     * @param {Vec2} vector 
     * @returns {number}
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /**
     * 
     * @param {Vec2} vector the other vector to find the angle to.
     */
    angleTo(vector) {
        return Math.acos(this.dot(vector) / (this.length * vector.length));
    }

    /**
     * Clones the vector.
     * @returns {Vec2} a clone of the vector.
     */
    clone() {
        return new Vec2(this.x, this.y);
    }

    toString() {
        return `X: ${this.x}, Y: ${this.y}`;
    }
} 