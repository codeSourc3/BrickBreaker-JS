'use strict';
/*
Author: Enzo Mayo
Date: 11/04/2020
Description: Represents a brick breaker
game.
*/

import {Paddle} from './entities/paddle.js';
import {Ball} from './entities/ball.js';
import {Game} from './game.js';
import { Key } from './input/keyboard.js';
// setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');



// ball variables
const x = canvas.width / 2;
const y = canvas.height - 30;
const ballRadius = 10;
const ball = new Ball(x, y, ballRadius);


// paddle variables
const paddleHeight = 10;
const paddleWidth = 75;
const paddleX = (canvas.width - paddleWidth) / 2;
const paddle = new Paddle((canvas.width - paddleWidth) / 2, paddleHeight, paddleWidth);
// paddle movement variables


// Brick variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Player lives mechanic
let lives = 3;

// score variables
let score = 0;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            
            if (b.status == 1) {
                // if center of ball to be inside brick the following must = true
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert('YOU WIN, CONGRAGULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}




function drawBricks() {
    // optimization for drawing shapes to canvas.
    ctx.beginPath();
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                //ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                //ctx.closePath();
            }
        }
    }
    ctx.closePath();
}





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

/*
const Game = {
    _width: 320,
    _height: 480,
    _ratio: null,
    _currentWidth: null,
    _currentHeight: null,
    _canvas: null,
    _ctx: null,
    _currentScreen: new StartMenu(),
    input: {

    },

    init() {
        Game._ratio = Game._width / Game._height;
        Game._currentWidth = Game._width;
        Game._currentHeight = Game._height;
        Game._canvas = document.getElementById('game');

        Game._canvas.width = Game._width;
        Game._canvas.height = Game._height;

        Game._ctx = Game._canvas.getContext('2d');

        Game._ua = navigator.userAgent.toLowerCase();
        Game._android = Game._ua.indexOf('android') > -1 ? true : false;
        Game._ios = (Game._ua.indexOf('iphone') > -1 || Game._ua.indexOf('ipad') > -1) ? true : false;
        window.addEventListener('click', (e) => {
            e.preventDefault();
            Game.input.set(e);
        }, false);

        window.addEventListener('touchstart', (e) => {

        })

        Game.resize();
        Game.start();
    },
    resize() {
        Game.currentHeight = window.innerHeight;
        Game.currentWidth = Game.currentHeight * Game.ratio;

        Game.canvas.style.width = Game.currentWidth + 'px';
        Game.canvas.style.height = Game.currentHeight + 'px';

        if (Game.android || Game.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }
        window.setTimeout(function() {
            window.scrollTo(0, 1);
        });
    },
    start() {
        this._currentScreen = new StartMenu();
        this._currentScreen.draw(this.ctx);
    }
};
*/


// window.addEventListener('load', Game.init, false);
// window.addEventListener('resize', Game.resize, false);




// TODO: Create a class called Controls or Input
/**
 * Would support PointerEvents, MouseEvents, KeyborardEvents and the Gamepad API
 */


const output = document.getElementById('output');

Game.init('game');



//document.addEventListener('mousemove', mouseMoveHandler, false);
//document.addEventListener('keydown', paddle, false);
//document.addEventListener('keyup', paddle, false);
//gameLoop();

