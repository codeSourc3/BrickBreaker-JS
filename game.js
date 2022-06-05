/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */

import {State, StateStack} from './state/state.js';
//import { Level1State } from "./state/gamestate.js";
import { MainMenuState } from "./state/mainmenustate.js";
import { Key } from './input/keyboard.js';



/**
 * Class that sets up the canvas and starts the game loop.
 * Should handle resizing and orientation changes.
 */
const Game = {
		/**
		 * 
		 */
    _canvasWidth : 320,
    /**
     * 
		 */
    _canvasHeight : 240,
    /**
     * @type {HTMLCanvasElement}
		 */
    _canvas : null,
    /**
     * @type {CanvasRenderingContext2D}
		 */
    _context : null,
    /**
     * 
		 */
    _gameMode : new StateStack(),
    /**
     * 
		 */
    _frameId : 0,
    /**
     * 
		 */
    _ratio : null,

    _paused: false,
    

    /**
     * 
     * Initialize the game.
     */
    init() {
        let canvasElement = document.getElementsByTagName('canvas')[0];
        //console.info('Canvas element of ' + canvasElementId, canvasElement);
        Game._canvas = canvasElement;
        
        // these will change when the screen is resized.
        Game._ratio = Game._canvasWidth / Game._canvasHeight;
        console.log('Ratio: ', Game._ratio);
        Game._canvas.width = Game._canvasWidth;
        Game._canvas.height = Game._canvasHeight;
        Game._context = Game._canvas.getContext('2d');
        Game.resize();
        //window.addEventListener('resize', Game.resize);
        Game.startGame();
    },

    /**
     * Internal method used for resizing the canvas when the document body is smaller
     * or larger than the canvas. Resizes to fit the aspect ratio of 4:3.
     * @private
     */
    resize() {
        console.log('');
        console.log('Current Height: ', Game._canvasHeight, 'Current Width: ', Game._canvasWidth);
        Game._canvasWidth = Math.floor(document.body.clientWidth);
        // Resize height in proportion to new width
        Game._canvasHeight = Math.floor(Game._canvasWidth / 3 );
        Game._canvas.width = Game._canvasWidth;
        Game._canvas.height = Game._canvasHeight;
        console.log('Resized height: ', Game._canvasHeight, 'Resized width: ', Game._canvasWidth);
    },

    /**
     * 
     */
    update() {
        
        if (Game._canvas.width !== document.documentElement.offsetWidth ) {
            Game.resize();
        }
        if (!Game._paused) {
            Game._gameMode.update();
        }
        Game._gameMode.render(Game._context);
        
        Game._frameId = window.requestAnimationFrame(Game.update);
        
    },

    /**
     * 
     */
    startGame() {
        Game._gameMode.push(new MainMenuState());
        Game.update();
    },

    /**
     * 
     */
    pauseGame() {
        //Game._frameId = window.cancelAnimationFrame(Game._frameId);
        Game._paused = true;
    },

    /**
     * 
     */
    resumeGame() {
        //Game._frameId = window.requestAnimationFrame(Game.update);
        Game._paused = false;
    }

    
}

/**
 * Settings object
 */
Game.Settings = {

};

const Globals = {
    /**
     * @returns {StateStack} the games StateStack.
     */
    getGameInstance() {
        return Game._gameMode;
    },

    /**
     * @returns {{width:number, height:number}}
     */
    getGameDimensions() {
        return {
            width: Game._canvasWidth,
            height: Game._canvasHeight
        };
    },
    /**
     * @returns {CanvasRenderingContext2D} the rendering context.
     */
    getContext() {
        return Game._context;
    },
    /**
     * Pauses the current game state before canceling the current 
     * animation frame.
     */
    pauseGame() {
        Game._gameMode.pause();
        Game.pauseGame();
    },
    
    /**
     * Resumes the game and resumes the game state.
     */
    resumeGame() {
        Game.resumeGame();
        Game._gameMode.resume();
    },
    changeTo(state) {
        Game._gameMode.pop();
        Game._gameMode.push(state);
    },

    /**
     * @returns {HTMLCanvasElement} the canvas element.
     */
    getCanvasElement() {
        return Game._canvas;
    },


    logError(errorContent) {
        document.getElementById('output').textContent = errorContent;
    }
};


export {Game, Globals};