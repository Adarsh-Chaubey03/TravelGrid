var _excluded = ["component"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @fileOverview Customized
 */
import * as React from 'react';
import { isValidElement, cloneElement, createElement } from 'react';
import { Layer } from '../container/Layer';
import { warn } from '../util/LogUtils';
/**
 * custom svg elements by rechart instance props and state.
 * @returns {Object}   svg elements
 */
export function Customized(_ref) {
  var {
      component
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  var child;
  if (/*#__PURE__*/isValidElement(component)) {
    child = /*#__PURE__*/cloneElement(component, props);
  } else if (typeof component === 'function') {
    child = /*#__PURE__*/createElement(component, props);
  } else {
    warn(false, "Customized's props `component` must be React.element or Function, but got %s.", typeof component);
  }
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-customized-wrapper"
  }, child);
}
Customized.displayName = 'Customized';