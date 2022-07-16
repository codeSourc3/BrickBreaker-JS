/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */

import {State, StateStack} from './state/state.js';
//import { Level1State } from "./state/gamestate.js";
import { MainMenuState } from "./state/mainmenustate.js";
import { Key } from './input/keyboard.js';
import {PubSub} from './eventemitter.js';

let globals;

/**
 * Class that sets up the canvas and starts the game loop.
 * Should handle resizing and orientation changes.
 */
class Game  {
		/**
		 * 
		 */
    _canvasWidth = 320;
    /**
     * 
		 */
    _canvasHeight = 240;
    /**
     * @type {HTMLCanvasElement}
		 */
    _canvas = null
    /**
     * @type {CanvasRenderingContext2D}
		 */
    _context = null;
    /**
     * 
		 */
    _gameMode = new StateStack();
    /**
     * 
		 */
    _frameId = 0;
    /**
     * 
		 */
    _ratio = 0;

    _paused = false;

    events = new PubSub();

    static Events = Object.freeze({
        PAUSE: 'pause-game',
        RESUME: 'resume-game',
        CHANGE_STATE: 'change-state',
        START: 'start-game'
    });
    
    constructor({canvasElement=document.querySelector('canvas')}={}) {
        this._canvas = canvasElement;
        this._ratio = this._canvasWidth / this._canvasHeight;
        this._canvas.width = this._canvasWidth;
        this._canvas.height = this._canvasHeight;
        this._context = this._canvas.getContext('2d');
        this.resize();

        const bindAllToSelf = (...propNames) => {
            propNames.forEach(prop => {
                this[prop] = this[prop].bind(this);
            });
        };
        bindAllToSelf('resize', 'update', 'startGame', 'pauseGame', 'resumeGame', 'onStateChange');
        const self = this;
        globals = {
            /**
             * @returns {StateStack} the games StateStack.
             */
            getGameInstance() {
                return self._gameMode;
            },
        
            /**
             * @returns {{width:number, height:number}}
             */
            getGameDimensions() {
                return {
                    width: self._canvasWidth,
                    height: self._canvasHeight
                };
            },
            /**
             * @returns {CanvasRenderingContext2D} the rendering context.
             */
            getContext() {
                return self._context;
            },
            /**
             * Pauses the current game state before canceling the current 
             * animation frame.
             */
            pauseGame() {
                self.pauseGame();
            },
            
            /**
             * Resumes the game and resumes the game state.
             */
            resumeGame() {
                self.resumeGame();
            },
            changeTo(state) {
                self._gameMode.pop();
                self._gameMode.push(state);
            },
        
            /**
             * @returns {HTMLCanvasElement} the canvas element.
             */
            getCanvasElement() {
                return self._canvas;
            },
        
        
            logError(errorContent) {
                document.getElementById('output').textContent = errorContent;
            }
        };
        this.events.subscribe(Game.Events.START, this.startGame);
        this.events.subscribe(Game.Events.PAUSE, this.pauseGame);
        this.events.subscribe(Game.Events.RESUME, this.resumeGame);
        this.events.subscribe(Game.Events.CHANGE_STATE, this.onStateChange);
    }

    /**
     * 
     * @param {State} state 
     */
    onStateChange(state) {
        this._gameMode.pop();
        this._gameMode.push(state);
    }

    

    /**
     * Internal method used for resizing the canvas when the document body is smaller
     * or larger than the canvas. Resizes to fit the aspect ratio of 4:3.
     * @private
     */
    resize() {
        this._canvasWidth = Math.floor(document.body.clientWidth);
        // Resize height in proportion to new width
        this._canvasHeight = Math.floor(this._canvasWidth / 3 );
        this._canvas.width = this._canvasWidth;
        this._canvas.height = this._canvasHeight;
    }

    /**
     * 
     */
    update(elapsed) {
        
        if (this._canvas.width !== document.documentElement.offsetWidth ) {
            this.resize();
        }
        if (!this._paused) {
            this._gameMode.update(elapsed);
        }
        this._gameMode.render(this._context);
        
        this._frameId = window.requestAnimationFrame(this.update);
        
    }

    /**
     * 
     */
    startGame() {
        this._gameMode.push(new MainMenuState(this));
        this.update();
    }

    /**
     * 
     */
    pauseGame() {
        //Game._frameId = window.cancelAnimationFrame(Game._frameId);
        this._paused = true;
        this._gameMode.pause();
    }

    /**
     * 
     */
    resumeGame() {
        //Game._frameId = window.requestAnimationFrame(Game.update);
        this._paused = false;
        this._gameMode.resume();
    }

    
}





export {Game as Game, globals as Globals};