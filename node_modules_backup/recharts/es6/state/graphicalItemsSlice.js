import { createSlice, current } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

/**
 * ErrorBars have lot more settings but all the others are scoped to the component itself.
 * Only some of them required to be reported to the global store because XAxis and YAxis need to know
 * if the error bar is contributing to extending the axis domain.
 */

var initialState = {
  countOfBars: 0,
  cartesianItems: [],
  polarItems: []
};
var graphicalItemsSlice = createSlice({
  name: 'graphicalItems',
  initialState,
  reducers: {
    addBar(state) {
      state.countOfBars += 1;
    },
    removeBar(state) {
      state.countOfBars -= 1;
    },
    addCartesianGraphicalItem(state, action) {
      state.cartesianItems.push(castDraft(action.payload));
    },
    replaceCartesianGraphicalItem(state, action) {
      var {
        prev,
        next
      } = action.payload;
      var index = current(state).cartesianItems.indexOf(castDraft(prev));
      if (index > -1) {
        state.cartesianItems[index] = castDraft(next);
      }
    },
    removeCartesianGraphicalItem(state, action) {
      var index = current(state).cartesianItems.indexOf(castDraft(action.payload));
      if (index > -1) {
        state.cartesianItems.splice(index, 1);
      }
    },
    addPolarGraphicalItem(state, action) {
      state.polarItems.push(castDraft(action.payload));
    },
    removePolarGraphicalItem(state, action) {
      var index = current(state).polarItems.indexOf(castDraft(action.payload));
      if (index > -1) {
        state.polarItems.splice(index, 1);
      }
    }
  }
});
export var {
  addBar,
  removeBar,
  addCartesianGraphicalItem,
  replaceCartesianGraphicalItem,
  removeCartesianGraphicalItem,
  addPolarGraphicalItem,
  removePolarGraphicalItem
} = graphicalItemsSlice.actions;
export var graphicalItemsReducer = graphicalItemsSlice.reducer;