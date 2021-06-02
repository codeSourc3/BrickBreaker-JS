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
    static scale(vec, scaleFactor) {
        vec.x *= scaleFactor;
        vec.y *= scaleFactor;
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
     * Scales the vector by the scale factor.
     * @param {number} scaleFactor the factor to scale by.
     * @returns {Vec2} the new vector.
     */
    scale(scaleFactor) {
        return new Vec2(this.x * scaleFactor, this.y * scaleFactor);
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
     * Gets the distance from the other vector;
     * @param {Vec2} vector the other vector to measure the distance from.
     * @returns {number} the distance from the other vector.
     */
    distance(vector) {
        return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
    }
} 