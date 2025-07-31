function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { createSlice } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

/**
 * Properties shared in X, Y, and Z axes
 */

/**
 * These are the external props, visible for users as they set them using our public API.
 * There is all sorts of internal computed things based on these, but they will come through selectors.
 *
 * Properties shared between X and Y axes
 */

/**
 * Z axis is special because it's never displayed. It controls the size of Scatter dots,
 * but it never displays ticks anywhere.
 */

var initialState = {
  xAxis: {},
  yAxis: {},
  zAxis: {}
};

/**
 * This is the slice where each individual Axis element pushes its own configuration.
 * Prefer to use this one instead of axisSlice.
 */
var cartesianAxisSlice = createSlice({
  name: 'cartesianAxis',
  initialState,
  reducers: {
    addXAxis(state, action) {
      state.xAxis[action.payload.id] = castDraft(action.payload);
    },
    removeXAxis(state, action) {
      delete state.xAxis[action.payload.id];
    },
    addYAxis(state, action) {
      state.yAxis[action.payload.id] = castDraft(action.payload);
    },
    removeYAxis(state, action) {
      delete state.yAxis[action.payload.id];
    },
    addZAxis(state, action) {
      state.zAxis[action.payload.id] = castDraft(action.payload);
    },
    removeZAxis(state, action) {
      delete state.zAxis[action.payload.id];
    },
    updateYAxisWidth(state, action) {
      var {
        id,
        width
      } = action.payload;
      if (state.yAxis[id]) {
        state.yAxis[id] = _objectSpread(_objectSpread({}, state.yAxis[id]), {}, {
          width
        });
      }
    }
  }
});
export var {
  addXAxis,
  removeXAxis,
  addYAxis,
  removeYAxis,
  addZAxis,
  removeZAxis,
  updateYAxisWidth
} = cartesianAxisSlice.actions;
export var cartesianAxisReducer = cartesianAxisSlice.reducer;