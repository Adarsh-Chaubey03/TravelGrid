import { createSlice } from '@reduxjs/toolkit';
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
var chartLayoutSlice = createSlice({
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
export var {
  setMargin,
  setLayout,
  setChartSize,
  setScale
} = chartLayoutSlice.actions;
export var chartLayoutReducer = chartLayoutSlice.reducer;