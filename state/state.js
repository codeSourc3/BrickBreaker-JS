/**
 * Manages game state by implementing a version of the state machine.
 * @author Enzo Mayo
 * @since 12/09/2020
 */

import { UnimplementedMethod } from "../errors/errors.js";
import { Game } from "../game.js";

 class StateList {
     constructor() {
         /**
          * @type {State[]}
          * @private
          */
         this._states = [];
     }

     /**
      * Removes the latest state from the list.
      */
     pop() {
         return this._states.pop();
     }

     /**
      * Appends a new state to the list.
      * @param {State} state 
      */
     push(state) {
         this._states.push(state);
     }

     /**
      * Returns the current state, which is the latest state.
      * @returns {State} the current state.
      */
     top() {
         return this._states[this._states.length - 1];
     }
 }

 /**
  * Base class that all States inherit from.
  * @interface
  */
 class State {
     /**
      * 
      * @param {string} name the name of the state
      * @param {Game} game the game instance of the state
      */
     constructor(name, game) {
         /**
          * @private
          */
         this._name = name;
         /**
          * @private
          */
         this._game = game;
     }

     get name() {
         return this._name;
     }

     get game() {
        return this._game;
     }

     /**
      * Called before render. Updates the game state.
      * 
      * @param {number} elapsed the elapsed amount of time.
      * 
      */
     updateState(elapsed) {
         throw new UnimplementedMethod(State, this.updateState);
     }

     /**
      * Called after render. Draws the state to the screen.
      * @param {CanvasRenderingContext2D} ctx the canvas context.
      */
     renderState(ctx) {
        throw new UnimplementedMethod(State, this.renderState);
     }

     /**
      * Can set up the environment here (event listeners, etc.)
      */
     onEnter() {

     }

     /**
      * Called right before the state shuts down.
      * Can be used to clean up or save the state at that point.
      */
     onExit() {

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

 class StateStack {
     constructor() {
         /**
          * @private
          */
         this._states = new StateList();
     }

     /**
      * 
      * @param {number} elapsed 
      */
     update(elapsed) {
         let state = this._states.top();
         if (state) {
             state.updateState(elapsed);
         }
     }

     render(ctx) {
         let state = this._states.top();
         if (state) {
             state.renderState(ctx);
         }
     }

     push(state) {
         this._states.push(state);
         state.onEnter();
     }

     pop() {
         let state = this._states.top();
         state.onExit();
         return this._states.pop();
     }

     pause() {
         let state = this._states.top();
         if (state.onPause) {
             state.onPause();
         }
     }

     resume() {
         let state = this._states.top();
         if (state.onResume) {
             state.onResume();
         }
     }
 }

 export {State, StateStack};