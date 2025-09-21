"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _cartesianAxisSlice = require("../state/cartesianAxisSlice");
var _hooks = require("../state/hooks");
var _axisSelectors = require("../state/selectors/axisSelectors");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function SetZAxisSettings(settings) {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _cartesianAxisSlice.addZAxis)(settings));
    return () => {
      dispatch((0, _cartesianAxisSlice.removeZAxis)(settings));
    };
  }, [settings, dispatch]);
  return null;
}
// eslint-disable-next-line react/prefer-stateless-function
class ZAxis extends _react.Component {
  render() {
    return /*#__PURE__*/React.createElement(SetZAxisSettings, {
      domain: this.props.domain,
      id: this.props.zAxisId,
      dataKey: this.props.dataKey,
      name: this.props.name,
      unit: this.props.unit,
      range: this.props.range,
      scale: this.props.scale,
      type: this.props.type,
      allowDuplicatedCategory: _axisSelectors.implicitZAxis.allowDuplicatedCategory,
      allowDataOverflow: _axisSelectors.implicitZAxis.allowDataOverflow,
      reversed: _axisSelectors.implicitZAxis.reversed,
      includeHidden: _axisSelectors.implicitZAxis.includeHidden
    });
  }
}
exports.ZAxis = ZAxis;
_defineProperty(ZAxis, "displayName", 'ZAxis');
_defineProperty(ZAxis, "defaultProps", {
  zAxisId: 0,
  range: _axisSelectors.implicitZAxis.range,
  scale: _axisSelectors.implicitZAxis.scale,
  type: _axisSelectors.implicitZAxis.type
});