/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import {State} from './state.js';
import {Globals, Game} from '../game.js';
import {Level1State} from './level1.js';
import {centerText, Button} from '../ui/components.js';
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
        /**
         * @type {Button[]}
         */
        this.buttons = [];
        this._selectedBtnIndex = 0;
        this.bindToSelf(this.moveDown);
        this.bindToSelf(this.moveUp);
        this.bindToSelf(this.selectCurrentButton);
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
                        this.moveUp();
                        console.info('Move up ', this._selectedBtnIndex)
                        break;
                    case 'movedown':
                        this.moveDown();
                        console.info('Move down ', this._selectedBtnIndex);
                        break;
                    case 'selectcurrentbutton':
                        this.selectCurrentButton();
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
        for (let i = 0; i < this.buttons.length; i++) {
            const btn = this.buttons[i];
            if (btn.intersectsXY(pointer)) {
                btn.hovering = true;
                this._selectedBtnIndex = i;
                if (pointer.wasClicked) {
                    btn.handler();
                }
            } else if (keyboard.lastRelevantInput < pointer.lastUpdated) {
                
                btn.hovering = false;
            }
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
        const startBtn = new Button('Start', 
            Globals.getCanvasElement().width / 2 - (Globals.getCanvasElement().width / 6) / 2, 
            Globals.getCanvasElement().height / 3, 
            Globals.getCanvasElement().width / 6, 
            Globals.getCanvasElement().height / 8);
        startBtn.setHandler(() => {
            this.game.events.emit(Game.Events.SLEEP);
            this.game.events.emit(Game.Events.PUSH_STATE, new Level1State(this.game));
        });
        startBtn.handler.bind(this);
        startBtn.onHover = elapsed => {
            startBtn.currentButtonColor = startBtn.hoverBackgroundColor;
            startBtn.currentTextColor = startBtn.hoverTextColor;
        };
        this.buttons.push(startBtn);
        this.addGameObject(startBtn);
    }

    /**
     * Attempts to move up the button group.
     * 
     */
    moveUp() {

        this.buttons[this._selectedBtnIndex].hovering = false;
        if (this._selectedBtnIndex > 0) {
            // have not reached first button.
            this._selectedBtnIndex--;
        }
        this.buttons[this._selectedBtnIndex].hovering = true;
    }

    moveDown() {

        this.buttons[this._selectedBtnIndex].hovering = false;
        if (this._selectedBtnIndex + 1 < this.buttons.length) {
            // have not reached last button
            this._selectedBtnIndex++;
        }
        this.buttons[this._selectedBtnIndex].hovering = true;
    }

    selectCurrentButton() {
        console.assert(
            this._selectedBtnIndex >= 0 && this._selectedBtnIndex < this.buttons.length,
             'Selected button not within range'
        );
        const selectedButton = this.buttons[this._selectedBtnIndex];
        if (selectedButton.handler !== undefined) {
            selectedButton.hovering = false;
            selectedButton.handler();
        }
        
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