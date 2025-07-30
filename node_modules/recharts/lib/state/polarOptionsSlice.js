"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePolarOptions = exports.polarOptionsReducer = void 0;
var _toolkit = require("@reduxjs/toolkit");
var polarOptionsSlice = (0, _toolkit.createSlice)({
  name: 'polarOptions',
  initialState: null,
  reducers: {
    updatePolarOptions: (_state, action) => {
      return action.payload;
    }
  }
});
var {
  updatePolarOptions
} = polarOptionsSlice.actions;
exports.updatePolarOptions = updatePolarOptions;
var polarOptionsReducer = exports.polarOptionsReducer = polarOptionsSlice.reducer;