/*
Author: Enzo Mayo
Date: 11/04/2020
Description: Represents a brick breaker
game.
*/

import {Game} from './game.js';

const infoSections = document.querySelectorAll('.info');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', (e) => {
    let h1 = e.target.closest('h2');
    if (!h1) return;
    
    
    let clickedElement = [...infoSections].find(e => e.firstElementChild.textContent === h1.textContent);
    clickedElement.lastElementChild.classList.toggle('show');
    console.log(clickedElement.lastElementChild);
    
});

const game = new Game();
game.startGame();