import { configureStore } from "@reduxjs/toolkit";
import routeReducer from "./routeReducer.js";
import { reviewApi } from "./reviewApi.js";


const appStore = configureStore({
  reducer: routeReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      reviewApi.middleware,
    ),
});


export default appStore;