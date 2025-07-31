"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportBar = void 0;
var _react = require("react");
var _hooks = require("./hooks");
var _graphicalItemsSlice = require("./graphicalItemsSlice");
var ReportBar = () => {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _graphicalItemsSlice.addBar)());
    return () => {
      dispatch((0, _graphicalItemsSlice.removeBar)());
    };
  });
  return null;
};
exports.ReportBar = ReportBar;