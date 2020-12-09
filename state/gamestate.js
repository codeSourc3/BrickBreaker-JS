/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { Player } from '../entities/player.js';
import { LevelState } from "./LevelState.js";


class Level1State extends LevelState {
    constructor() {
        super(new Player(3), 'Level 1');
        
        
        // Different levels modify the brick field. Lives carry over.
    }

    
}
export {Level1State};