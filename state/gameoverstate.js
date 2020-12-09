/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import {State} from './state.js';
import {centerText} from '../ui/components.js';
import {Globals} from '../game.js';

export class GameOverState extends State {
    constructor() {
        super('GameOver');

    }

    /**
      * Called before render. Updates the game state.
      */
     update() {

    }

    /**
     * Called after render. Draws the state to the screen.
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        ctx.clearRect(0, 0, Globals.getCanvasElement().width, Globals.getCanvasElement().height)
        // Display 'Game Over' in center of screen
        ctx.save();
        const fontSize = '2em';
        ctx.font = `${fontSize} monospace`;
        centerText(ctx, Globals.getGameDimensions().height / 2, 'Game Over');
        ctx.restore();
        // Display player's final score.

        // Display 'Back To Main Menu' button
    }

    /**
     * Can set up the environment here (event listeners, etc.)
     */
    onEnter() {

    }

    /**
     * Called right before the state shuts down.
     * Can be used to clean up or save the state at that point.
     */
    onExit() {

    }

    /**
     * Called when the game/state is paused.
     */
    onPause() {

    }

    /**
     * Called before the game is reinstated.
     */
    onResume() {

    }
}

