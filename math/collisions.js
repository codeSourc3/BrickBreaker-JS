export function isCircleCollidingWithRect({ x: circleX, y: circleY, radius }, { x: recX, y: recY, width: recWidth, height: recHeight }) {
    let distX = Math.abs(circleX - recX - recWidth / 2);
    let distY = Math.abs(circleY - recY - recHeight / 2);

    // if distance is > half circle + half rect, they are too far apart to be colliding.
    if (distX > (recWidth / 2 + radius)) return false;
    if (distY > (recHeight / 2 + radius)) return false;

    // if distance < half rect they are definitely colliding.
    if (distX <= (recWidth / 2)) return true;
    if (distY <= (recHeight / 2)) return true;

    // Test for collision at corner using Pythagorean theorem.
    const dx = distX - recWidth / 2;
    const dy = distY - recHeight / 2;
    return (dx * dx + dy * dy <= (radius * radius));
}