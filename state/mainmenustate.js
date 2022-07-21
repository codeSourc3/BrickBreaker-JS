/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import {State} from './state.js';
import {Globals, Game} from '../game.js';
import {Level1State} from './level1.js';
import {centerText, Button} from '../ui/components.js';
import { Pointer } from '../input/pointer.js';




class MainMenuState extends State {
    /**
     * 
     * @param {import('../game.js').Game} game 
     */
    constructor(game) {
        super("Main Menu", game);
        this.title = 'Brick Breaker JS';
        /**
         * @type {Button[]}
         */
        this.buttons = [];
        this.click = (e) => {
            for (const btn of this.buttons) {
                btn.clickedOn(e);
            }
        };
        this.action = this.click.bind(this);
    }

    /**
      * Called before render. Updates the game state.
      */
     updateState(elapsed) {
        // May resize any buttons.
        const pointer = Pointer.getInstance();
        if (!pointer.attached) {
            pointer.attach();
        }
        if (this.buttons[0].intersectsXY(pointer) && pointer.wasClicked) {
            this.buttons[0].handler();
        }
        super.updateState(elapsed);
    }

    /**
     * Called after render. Draws the state to the screen.
     * @param {CanvasRenderingContext2D} ctx the canvas rendering context.
     */
    renderState(ctx) {
        let dimensions = Globals.getGameDimensions();
        ctx.clearRect(0,0, dimensions.width, dimensions.height);
        // back up original state before altering any further.
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.font = '2em monospace';
        centerText(ctx, ctx.canvas.height / 4, this.title);
        
        
        ctx.restore();

        super.renderState(ctx);
    }

    /**
     * Can set up the environment here (event listeners, etc.)
     */
    onEnter() {
        

        console.log('Entering main menu state.');
        //Globals.getCanvasElement().addEventListener('click', this.action);
        // Buttons take up the lower half of the screen.
        const startBtn = new Button('Start', 
            Globals.getCanvasElement().width / 2 - (Globals.getCanvasElement().width / 6) / 2, 
            Globals.getCanvasElement().height / 3, 
            Globals.getCanvasElement().width / 6, 
            Globals.getCanvasElement().height / 8);
        startBtn.setHandler(() => {
            this.game.events.emit(Game.Events.SLEEP);
            this.game.events.emit(Game.Events.CHANGE_STATE, new Level1State(this.game));
        });
        startBtn.handler.bind(this);
        this.buttons.push(startBtn);
        this.addToRenderList(startBtn);
    }

    

    /**
     * Called right before the state shuts down.
     * Can be used to clean up or save the state at that point.
     */
    onExit() {

        console.log('Exiting main menu');
        // addEventListener() and removeEventListener() weren't actually removing it.
        // This gives me more control anyway.
        Globals.getCanvasElement().removeEventListener('click', this.action);
    }

    onSleep() {
        Globals.getCanvasElement().removeEventListener('click', this.action);
    }

    onWakeUp() {
        Globals.getCanvasElement().addEventListener('click', this.action);
    }


    

}




export {MainMenuState};