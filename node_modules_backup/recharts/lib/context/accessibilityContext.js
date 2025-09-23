"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAccessibilityLayer = void 0;
var _hooks = require("../state/hooks");
var useAccessibilityLayer = () => (0, _hooks.useAppSelector)(state => state.rootProps.accessibilityLayer);
exports.useAccessibilityLayer = useAccessibilityLayer;