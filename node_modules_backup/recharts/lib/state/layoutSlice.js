"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setScale = exports.setMargin = exports.setLayout = exports.setChartSize = exports.chartLayoutReducer = void 0;
var _toolkit = require("@reduxjs/toolkit");
var initialState = {
  layoutType: 'horizontal',
  width: 0,
  height: 0,
  margin: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
  },
  scale: 1
};
var chartLayoutSlice = (0, _toolkit.createSlice)({
  name: 'chartLayout',
  initialState,
  reducers: {
    setLayout(state, action) {
      state.layoutType = action.payload;
    },
    setChartSize(state, action) {
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
    setMargin(state, action) {
      state.margin.top = action.payload.top;
      state.margin.right = action.payload.right;
      state.margin.bottom = action.payload.bottom;
      state.margin.left = action.payload.left;
    },
    setScale(state, action) {
      state.scale = action.payload;
    }
  }
});
var {
  setMargin,
  setLayout,
  setChartSize,
  setScale
} = chartLayoutSlice.actions;
exports.setScale = setScale;
exports.setChartSize = setChartSize;
exports.setLayout = setLayout;
exports.setMargin = setMargin;
var chartLayoutReducer = exports.chartLayoutReducer = chartLayoutSlice.reducer;