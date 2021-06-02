/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { Globals } from "../game.js";
import { State } from "./state.js";
import {centerText} from '../ui/components.js';

export class WinGameState extends State {
    constructor() {
        super('YouWin');
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx the canvas context.
     */
    render(ctx) {
        const game = Globals.getGameDimensions();
        ctx.clearRect(0, 0, game.width, game.height);
        // Display 'Game Over' in center of screen
        ctx.save();
        const fontSize = '2em';
        ctx.font = `${fontSize} monospace`;
        centerText(ctx, Globals.getGameDimensions().height / 2, 'You Win!');
        ctx.restore();
    }


}
