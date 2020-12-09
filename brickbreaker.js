/*
Author: Enzo Mayo
Date: 11/04/2020
Description: Represents a brick breaker
game.
*/

import {Game} from './game.js';




class Controls {
    constructor() {
        this._inputs = new Map();
    }

    /**
     * 
     * @param {Event} event 
     * @param {Function} func 
     */
    bind(event, func) {
        if (this._inputs.has(event.type)) {
            this._inputs.get(event.type).push(func);
        } else {
            this._inputs.set(event.type, [func]);
        }
    }

    handleEvent(event) {
        for (const key of this._inputs.keys()) {
            if (key === event.type) {
                this._inputs.get(key).forEach(f => f(event));
            }
        }
    }
}






// TODO: Create a class called Controls or Input
/*
 * Would support PointerEvents, MouseEvents, KeyborardEvents and the Gamepad API
 */


const infoSections = document.querySelectorAll('.info');
const instructions = document.getElementById('instructions');



instructions.addEventListener('click', (e) => {
    let h1 = e.target.closest('h2');
    if (!h1) return;
    
    
    let clickedElement = [...infoSections].find(e => e.firstElementChild.textContent === h1.textContent);
    clickedElement.lastElementChild.classList.toggle('show');
    console.log(clickedElement.lastElementChild);
    
});

Game.init('game');