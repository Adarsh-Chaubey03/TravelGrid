import { createSlice } from '@reduxjs/toolkit';
var polarOptionsSlice = createSlice({
  name: 'polarOptions',
  initialState: null,
  reducers: {
    updatePolarOptions: (_state, action) => {
      return action.payload;
    }
  }
});
export var {
  updatePolarOptions
} = polarOptionsSlice.actions;
export var polarOptionsReducer = polarOptionsSlice.reducer;