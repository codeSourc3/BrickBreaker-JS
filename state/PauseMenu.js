import {State} from './state.js';
import {Globals, Game} from '../game.js';
import { centerText, Button } from '../ui/components.js';
import {Pointer} from '../input/pointer.js';

class PauseMenu extends State {
    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {
        super('Pause Menu', game);
        this.title = 'Paused';
        /**
         * @type {Button[]}
         */
        this.buttons = [];
        
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
        this.onPKeyPressed = e => {
            if (e.type === 'keypress' && e.key === 'P') {
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
        for (let i = 0, len = this.buttons.length; i < len; i++) {
            if (this.buttons[i].intersectsXY(pointer) && pointer.wasClicked) {
                this.buttons[i].handler();
                console.debug(`Pause Menu button ${this.buttons[i].text} was clicked.`);
                break;
            }
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

        this.game.canvas.addEventListener('keypress', this.onPKeyPressed);
        const buttonWidth = this.game.canvas.width / 6;
        const buttonHeight = this.game.canvas.height / 8;
        const buttonX = this.game.canvas.width / 2 - (this.game.canvas.width / 6) / 2;
        const resumeBtn = new Button('Resume', 
            buttonX, 
            this.game.canvas.height / 3, 
            buttonWidth, 
            buttonHeight);
        resumeBtn.setHandler(this.resumeCb);
        this.buttons.push(resumeBtn);
        this.addGameObject(resumeBtn);
        const backToMainMenuBtn = new Button('To Main Menu', 
            buttonX,
            this.game.canvas.height / 2,
            buttonWidth,
            buttonHeight
        );
        backToMainMenuBtn.setHandler(this.backToMenuCb);
        this.buttons.push(backToMainMenuBtn);
        this.addGameObject(backToMainMenuBtn);
        console.assert(!this.asleep, 'Pause menu should not be asleep');
    }

    onExit() {
        this.game.canvas.removeEventListener('keypress', this.onPKeyPressed);
    }

    onWakeUp() {
        console.debug('PauseMenu\'s onWakeUp() should never be executed');
    }
}

export {PauseMenu};