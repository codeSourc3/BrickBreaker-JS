/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import {State} from './state.js';
import {Globals, Game} from '../game.js';
import {Level1State} from './level1.js';
import {centerText, Button, ButtonGroup} from '../ui/components.js';
import { Pointer } from '../input/pointer.js';
import keyboard, { KeyboardManager, Keys } from '../input/keyboard.js';


const noop = () => {
    return;
};

class MainMenuState extends State {
    /**
     * 
     * @param {import('../game.js').Game} game 
     */
    constructor(game) {
        super("Main Menu", game);
        this.title = 'Brick Breaker JS';
        
        this.buttonGroup = new ButtonGroup(game.canvas, game.canvas.height / 3);
        this._selectedBtnIndex = 0;
        this._inputActionMap = new Map([
            ['w', 'moveup'],
            [Keys.ARROW_UP, 'moveup'],
            ['Up', 'moveup'],
            ['s', 'movedown'],
            [Keys.ARROW_DOWN, 'movedown'],
            ['Down', 'movedown'],
            [Keys.ENTER, 'selectcurrentbutton'],
            [Keys.SPACE, 'selectcurrentbutton']
        ]);

        this._keyDownHandler = key => {
            if (this._inputActionMap.has(key)) {
                const action = this._inputActionMap.get(key);
                switch (action) {
                    case 'moveup':
                        this.buttonGroup.moveUp();
                        break;
                    case 'movedown':
                        this.buttonGroup.moveDown();
                        break;
                    case 'selectcurrentbutton':
                        this.buttonGroup.selectCurrent();
                        break;
                    default:
                        noop();
                        break;
                }
            }
        };
        this.bindToSelf(this._keyDownHandler);
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
        if (this.buttonGroup.intersectsXY(pointer) && pointer.wasClicked) {
            this.buttonGroup.selectCurrent();
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
        keyboard.events.subscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
        //Globals.getCanvasElement().addEventListener('click', this.action);
        // Buttons take up the lower half of the screen.
        const startCb = () => {
            this.game.events.emit(Game.Events.SLEEP);
            this.game.events.emit(Game.Events.PUSH_STATE, new Level1State(this.game));
        };
        const buttonWidth = this.game.canvas.width / 6;
        const buttonHeight = this.game.canvas.height / 8;
        const buttonX = this.game.canvas.width / 2 - (this.game.canvas.width / 6) / 2;
        const startBtn = new Button('Start', 
            buttonX,
            this.game.canvas.height / 2,
            buttonWidth,
            buttonHeight
        );
        startBtn.handler = startCb.bind(this);
        this.buttonGroup.add(startBtn);
        this.addGameObject(this.buttonGroup);
    }
    

    /**
     * Called right before the state shuts down.
     * Can be used to clean up or save the state at that point.
     */
    onExit() {

        console.log('Exiting main menu');
        this._inputActionMap.clear();
        keyboard.events.unsubscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
        // addEventListener() and removeEventListener() weren't actually removing it.
        // This gives me more control anyway.
    }

    onSleep() {
        keyboard.events.unsubscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
    }

    onWakeUp() {
        keyboard.events.subscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
    }


    

}




export {MainMenuState};