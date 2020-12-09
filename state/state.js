/**
 * Manages game state by implementing a version of the state machine.
 * @author Enzo Mayo
 * @since 12/09/2020
 */

 class StateList {
     constructor() {
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
  */
 class State {
     constructor(name) {
         this._name = name;
     }

     /**
      * Called before render. Updates the game state.
      */
     update() {

     }

     /**
      * Called after render. Draws the state to the screen.
      */
     render(ctx) {

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
         this._states = new StateList();
     }

     update() {
         let state = this._states.top();
         if (state) {
             state.update();
         }
     }

     render(ctx) {
         let state = this._states.top();
         if (state) {
             state.render(ctx);
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