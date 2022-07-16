/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { Bricks } from '../entities/bricks.js';
import { Player } from '../entities/player.js';
import { RunningGameState } from "./gamestate.js";
import { levels } from './leveldata.js';

class Level1State extends RunningGameState {
    /**
     * 
     * @param {import('../game.js').Game} game 
     */
    constructor(game) {
        super(new Player(3), game, Bricks.fromArray(levels[0]), 'Level 1');
        
        
        // Different levels modify the brick field. Lives carry over.
    }


    
}
export {Level1State};