import {State} from './state.js';
import {Game} from '../game.js';
import { centerText, Button, ButtonGroup } from '../ui/components.js';
import {Pointer} from '../input/pointer.js';
import keyboard, { KeyboardManager, Keys } from '../input/keyboard.js';

const noop = () => {
    return;
};

class PauseMenu extends State {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super('Pause Menu', game);
        this.title = 'Paused';
        /**
         * @type {ButtonGroup}
         */
        this.buttonGroup = new ButtonGroup(game.canvas, game.canvas.height / 3);
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
                        console.info('Move up ', this.buttonGroup.currentSelected.text)
                        break;
                    case 'movedown':
                        this.buttonGroup.moveDown();
                        console.info('Move down ', this.buttonGroup.currentSelected.text);
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
        this.resumeCb = () => {
            this.game.events.emit(Game.Events.POP_STATE);
            console.debug('Waking up previous state');
            this.game.events.emit(Game.Events.WAKE_UP_STATE);
        };
        this.backToMenuCb = () => {
            console.debug('Back to menu was clicked');
            this.game.events.emit(Game.Events.POP_STATE);
            this.game.events.emit(Game.Events.POP_STATE);
            this.game.events.emit(Game.Events.WAKE_UP_STATE);
        };
        this.onPKeyPressed = key => {
            if (key === 'p') {
                this.resumeCb();
            }
        };
        this.bindToSelf(this.resumeCb);
        this.bindToSelf(this.backToMenuCb);
        this.bindToSelf(this.onPKeyPressed);
    }

    updateState(elapsed) {
        const pointer = Pointer.getInstance();
        if (!pointer.attached) {
            pointer.attach();
        }
        if (this.buttonGroup.intersectsXY(pointer) && pointer.wasClicked) {
            this.buttonGroup.selectCurrent();
        }
        super.updateState(elapsed);
    }

    renderState(ctx) {
        let dimensions = this.game.dimensions;
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.font = '2em monospace';
        centerText(ctx, ctx.canvas.height / 4, this.title);
        ctx.restore();

        super.renderState(ctx);
    }

    onEnter() {
        keyboard.events.subscribe(KeyboardManager.KEY_UP, this.onPKeyPressed);
        keyboard.events.subscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
        const buttonWidth = this.game.canvas.width / 6;
        const buttonHeight = this.game.canvas.height / 8;
        const buttonX = this.game.canvas.width / 2 - (this.game.canvas.width / 6) / 2;
        const resumeBtn = new Button('Resume', 
            buttonX, 
            this.game.canvas.height / 3, 
            buttonWidth, 
            buttonHeight);
        resumeBtn.setHandler(this.resumeCb);
        this.buttonGroup.add(resumeBtn);
        const backToMainMenuBtn = new Button('To Main Menu', 
            buttonX,
            this.game.canvas.height / 2,
            buttonWidth,
            buttonHeight
        );
        backToMainMenuBtn.setHandler(this.backToMenuCb);
        this.buttonGroup.add(backToMainMenuBtn);
        this.addGameObject(this.buttonGroup);
        console.assert(!this.asleep, 'Pause menu should not be asleep');
    }

    onExit() {
        keyboard.events.unsubscribe(KeyboardManager.KEY_UP, this.onPKeyPressed);
        keyboard.events.unsubscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
    }

    onWakeUp() {
        console.debug('PauseMenu\'s onWakeUp() should never be executed');
    }
}

export {PauseMenu};