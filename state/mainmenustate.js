import {State} from './state.js';
import {Globals} from '../game.js';
import {Level1State} from './gamestate.js';
import {centerText, Button} from '../ui/components.js';



class MainMenuState extends State {
    constructor() {
        super("Main Menu");
        this.title = 'Brick Breaker JS';
        this.buttons = [];
        this.action = (e) => {
            // Due to StateMachine only calling onExit when a state is popped out.
            this.onExit(); 
            // TODO: Construct and pass in the player object, which is persisted across levels.
            Globals.getGameInstance().push(new Level1State());
        }
    }

    /**
      * Called before render. Updates the game state.
      */
     update() {
        // May resize any buttons.
    }

    /**
     * Called after render. Draws the state to the screen.
     * @param {CanvasRenderingContext2D} ctx the canvas rendering context.
     */
    render(ctx) {
        let dimensions = Globals.getGameDimensions();
        ctx.clearRect(0,0, dimensions.width, dimensions.height);
        // back up original state before altering any further.
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.font = '2em monospace';
        centerText(ctx, ctx.canvas.height / 4, this.title);
        
        
        ctx.restore();

        for (const btn of this.buttons) {
            btn.draw(ctx);
        }
    }

    /**
     * Can set up the environment here (event listeners, etc.)
     */
    onEnter() {
        

        console.log('Entering main menu state.');
        Globals.getCanvasElement().onclick = this.action;
        // Buttons take up the lower half of the screen.
        const startBtn = new Button('Start', 
        Globals.getCanvasElement().width / 2 - (Globals.getCanvasElement().width / 6) / 2, 
        Globals.getCanvasElement().height / 3, 
        Globals.getCanvasElement().width / 6, 
        Globals.getCanvasElement().height / 8);

        this.buttons.push(startBtn);
        
    }

    

    /**
     * Called right before the state shuts down.
     * Can be used to clean up or save the state at that point.
     */
    onExit() {

        console.log('Exiting main menu');
        // addEventListener() and removeEventListener() weren't actually removing it.
        // This gives me more control anyway.
        Globals.getCanvasElement().onclick = null;
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




export {MainMenuState};