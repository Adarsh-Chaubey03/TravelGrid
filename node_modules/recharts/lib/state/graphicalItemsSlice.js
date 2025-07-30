"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceCartesianGraphicalItem = exports.removePolarGraphicalItem = exports.removeCartesianGraphicalItem = exports.removeBar = exports.graphicalItemsReducer = exports.addPolarGraphicalItem = exports.addCartesianGraphicalItem = exports.addBar = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _immer = require("immer");
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
var graphicalItemsSlice = (0, _toolkit.createSlice)({
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
      state.cartesianItems.push((0, _immer.castDraft)(action.payload));
    },
    replaceCartesianGraphicalItem(state, action) {
      var {
        prev,
        next
      } = action.payload;
      var index = (0, _toolkit.current)(state).cartesianItems.indexOf((0, _immer.castDraft)(prev));
      if (index > -1) {
        state.cartesianItems[index] = (0, _immer.castDraft)(next);
      }
    },
    removeCartesianGraphicalItem(state, action) {
      var index = (0, _toolkit.current)(state).cartesianItems.indexOf((0, _immer.castDraft)(action.payload));
      if (index > -1) {
        state.cartesianItems.splice(index, 1);
      }
    },
    addPolarGraphicalItem(state, action) {
      state.polarItems.push((0, _immer.castDraft)(action.payload));
    },
    removePolarGraphicalItem(state, action) {
      var index = (0, _toolkit.current)(state).polarItems.indexOf((0, _immer.castDraft)(action.payload));
      if (index > -1) {
        state.polarItems.splice(index, 1);
      }
    }
  }
});
var {
  addBar,
  removeBar,
  addCartesianGraphicalItem,
  replaceCartesianGraphicalItem,
  removeCartesianGraphicalItem,
  addPolarGraphicalItem,
  removePolarGraphicalItem
} = graphicalItemsSlice.actions;
exports.removePolarGraphicalItem = removePolarGraphicalItem;
exports.addPolarGraphicalItem = addPolarGraphicalItem;
exports.removeCartesianGraphicalItem = removeCartesianGraphicalItem;
exports.replaceCartesianGraphicalItem = replaceCartesianGraphicalItem;
exports.addCartesianGraphicalItem = addCartesianGraphicalItem;
exports.removeBar = removeBar;
exports.addBar = addBar;
var graphicalItemsReducer = exports.graphicalItemsReducer = graphicalItemsSlice.reducer;