import {State} from './state.js';
import {Globals, Game} from '../game.js';
import { centerText, Button } from '../ui/components.js';

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
        super.updateState(elapsed);
    }

    renderState(ctx) {
        let dimensions = Globals.getGameDimensions();
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.font = '2em monospace';
        centerText(ctx, ctx.canvas.height / 4, this.title);
        ctx.restore();

        super.renderState(ctx);
    }

    onEnter() {
        Globals.getCanvasElement().addEventListener('click', this.click);
        Globals.getCanvasElement().addEventListener('keypress', this.onPKeyPressed);
        const resumeBtn = new Button('Resume', 
            Globals.getCanvasElement().width / 2 - (Globals.getCanvasElement().width / 6) / 2, 
            Globals.getCanvasElement().height / 3, 
            Globals.getCanvasElement().width / 6, 
            Globals.getCanvasElement().height / 8);
        resumeBtn.setHandler(() => {
            console.debug('Popping pause menu off stack');
            this.game.events.emit(Game.Events.POP_STATE);
            console.debug('Waking up previous state')
            this.game.events.emit(Game.Events.WAKE_UP_STATE);
        });
        this.buttons.push(resumeBtn);
        super.addToRenderList(resumeBtn);
    }

    onExit() {
        Globals.getCanvasElement().removeEventListener('click', this.click);
        Globals.getCanvasElement().removeEventListener('keypress', this.onPKeyPressed);
    }

    onWakeUp() {
        console.debug('PauseMenu\'s onWakeUp() should never be executed');
    }
}

export {PauseMenu};