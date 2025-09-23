"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dot = void 0;
var React = _interopRequireWildcard(require("react"));
var _clsx = require("clsx");
var _types = require("../util/types");
var _ReactUtils = require("../util/ReactUtils");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /**
 * @fileOverview Dot
 */
var Dot = props => {
  var {
    cx,
    cy,
    r,
    className
  } = props;
  var layerClass = (0, _clsx.clsx)('recharts-dot', className);
  if (cx === +cx && cy === +cy && r === +r) {
    return /*#__PURE__*/React.createElement("circle", _extends({}, (0, _ReactUtils.filterProps)(props, false), (0, _types.adaptEventHandlers)(props), {
      className: layerClass,
      cx: cx,
      cy: cy,
      r: r
    }));
  }
  return null;
};
exports.Dot = Dot;