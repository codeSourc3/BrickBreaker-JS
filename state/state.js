/**
 * Manages game state by implementing a version of the state machine.
 * @author Enzo Mayo
 * @since 12/09/2020
 */

import { GameObject } from "../entities/GameObject.js";
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

     size() {
        return this._states.length;
     }
 }

 /**
  * Base class that all States inherit from.
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
         /**
          * @type {(GameObject|UIObject)[]}
          */
         this._renderList = [];
         /**
          * @type {GameObject[]}
          */
         this._updateList = [];

         this._isSleeping = false;
     }

     get name() {
         return this._name;
     }

     get asleep() {
        return this._isSleeping;
     }

     /**
      * 
      * @param {Function} func 
      */
     bindToSelf(func) {
        if (typeof func === 'function' && func.name in this) {
            this[func.name] = this[func.name].bind(this);
        }
     }

     get game() {
        return this._game;
     }

     addToRenderList(gameObject) {
        if (gameObject instanceof GameObject || 'draw' in gameObject) {
            this._renderList.push(gameObject);
        }
     }

     addToUpdateList(gameObject) {
        if (gameObject instanceof GameObject) {
            this._updateList.push(gameObject);
        }
     }

     removeFromeUpdateList(gameObject) {
        if (gameObject instanceof GameObject && this._updateList.indexOf(gameObject) !== -1) {
            this._updateList.slice(this._updateList.indexOf(gameObject), 1);
        }
     }

     removeFromRenderList(gameObject) {
        if ((gameObject instanceof GameObject || 'draw' in gameObject) && this._renderList.indexOf(gameObject) !== -1) {
            this._renderList.slice(this._renderList.indexOf(gameObject), 1);
        }
     }

     addGameObject(gameObject) {
        if (gameObject instanceof GameObject) {
            this.addToRenderList(gameObject);
            this.addToUpdateList(gameObject);
        }
     }

     removeGameObject(gameObject) {
        if (gameObject instanceof GameObject) {
            this.removeFromRenderList(gameObject);
            this.removeFromeUpdateList(gameObject);
        }
     }

     /**
      * Called before render. Updates the game state.
      * 
      * @param {number} elapsed the elapsed amount of time.
      * 
      */
     updateState(elapsed) {
         this._updateList.forEach(updatable => {
            updatable.update(elapsed);
         });
     }

     /**
      * Called after render. Draws the state to the screen.
      * @param {CanvasRenderingContext2D} ctx the canvas context.
      */
     renderState(ctx) {
        this._renderList.forEach(renderable => {
            renderable.draw(ctx)
        })
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

     /**
      * Used to disable inputs
      */
     onSleep() {
        this._isSleeping = true;
     }

     /**
      * Called to wake up a state from sleep
      */
     onWakeUp() {
        this._isSleeping = false;
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

     
     sleep() {
        let state = this._states.top();
        if (state.onSleep) {
            state.onSleep();
        }
     }

     wakeUp() {
        let state = this._states.top();
        if (state.onWakeUp) {
            state.onWakeUp();
        }
     }

     get size() {
        return this._states.size();
     }

     get current() {
        return this._states.top();
     }
 }

 export {State, StateStack};