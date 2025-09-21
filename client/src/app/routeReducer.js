import { combineReducers } from "@reduxjs/toolkit";
import { reviewApi } from "./reviewApi.js";

const routeReducer = combineReducers({
  [reviewApi.reducerPath]: reviewApi.reducer,
});

export default routeReducer;