"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduxDevtoolsJsonStringifyReplacer = reduxDevtoolsJsonStringifyReplacer;
function reduxDevtoolsJsonStringifyReplacer(_key, value) {
  if (value instanceof HTMLElement) {
    return "HTMLElement <".concat(value.tagName, " class=\"").concat(value.className, "\">");
  }
  if (value === window) {
    return 'global.window';
  }
  return value;
}