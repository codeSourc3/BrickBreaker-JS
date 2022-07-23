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
        this.click = e => {
            this.buttons.forEach(btn => {
                btn.clickedOn(e);
            });
        };
        this.onPKeyPressed = e => {
            if (e.type === 'keypress' && e.key === 'P') {
                console.debug('Popping off pause menu');
                this.game.events.emit(Game.Events.POP_STATE);
                console.debug('Waking up previous state');
                this.game.events.emit(Game.Events.WAKE_UP_STATE);
            }
        };
        this.bindToSelf(this.onPKeyPressed);
        this.bindToSelf(this.click);
    }

    updateState(elapsed) {
        const pointer = Pointer.getInstance();
        if (!pointer.attached) {
            pointer.attach();
        }
        if (this.buttons[0].intersectsXY(pointer) && pointer.wasClicked) {
            this.buttons[0].handler();
            console.debug('Pause Menu was clicked');
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
        const resumeBtn = new Button('Resume', 
            this.game.canvas.width / 2 - (this.game.canvas.width / 6) / 2, 
            this.game.canvas.height / 3, 
            this.game.canvas.width / 6, 
            this.game.canvas.height / 8);
        resumeBtn.setHandler(() => {
            console.debug('Popping pause menu off stack');
            this.game.events.emit(Game.Events.POP_STATE);
            console.debug('Waking up previous state')
            this.game.events.emit(Game.Events.WAKE_UP_STATE);
        });
        resumeBtn.handler.bind(this);
        this.buttons.push(resumeBtn);
        this.addGameObject(resumeBtn);
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