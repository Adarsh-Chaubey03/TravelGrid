"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianGraphicalItemContext = void 0;
exports.ReportErrorBarSettings = ReportErrorBarSettings;
exports.SetErrorBarContext = SetErrorBarContext;
exports.useErrorBarContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _SetGraphicalItem = require("../state/SetGraphicalItem");
var _PanoramaContext = require("./PanoramaContext");
var _excluded = ["children"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var noop = () => {};
var ErrorBarDirectionDispatchContext = /*#__PURE__*/(0, _react.createContext)({
  addErrorBar: noop,
  removeErrorBar: noop
});
var initialContextState = {
  data: [],
  xAxisId: 'xAxis-0',
  yAxisId: 'yAxis-0',
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
};
var ErrorBarContext = /*#__PURE__*/(0, _react.createContext)(initialContextState);
function SetErrorBarContext(props) {
  var {
      children
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(ErrorBarContext.Provider, {
    value: rest
  }, children);
}
var useErrorBarContext = () => (0, _react.useContext)(ErrorBarContext);
exports.useErrorBarContext = useErrorBarContext;
var CartesianGraphicalItemContext = _ref => {
  var {
    children,
    xAxisId,
    yAxisId,
    zAxisId,
    dataKey,
    data,
    stackId,
    hide,
    type,
    barSize
  } = _ref;
  var [errorBars, updateErrorBars] = React.useState([]);
  // useCallback is necessary in these two because without it, the new function reference causes an infinite render loop
  var addErrorBar = (0, _react.useCallback)(errorBar => {
    updateErrorBars(prev => [...prev, errorBar]);
  }, [updateErrorBars]);
  var removeErrorBar = (0, _react.useCallback)(errorBar => {
    updateErrorBars(prev => prev.filter(eb => eb !== errorBar));
  }, [updateErrorBars]);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  return /*#__PURE__*/React.createElement(ErrorBarDirectionDispatchContext.Provider, {
    value: {
      addErrorBar,
      removeErrorBar
    }
  }, /*#__PURE__*/React.createElement(_SetGraphicalItem.SetCartesianGraphicalItem, {
    type: type,
    data: data,
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    zAxisId: zAxisId,
    dataKey: dataKey,
    errorBars: errorBars,
    stackId: stackId,
    hide: hide,
    barSize: barSize,
    isPanorama: isPanorama
  }), children);
};
exports.CartesianGraphicalItemContext = CartesianGraphicalItemContext;
function ReportErrorBarSettings(props) {
  var {
    addErrorBar,
    removeErrorBar
  } = (0, _react.useContext)(ErrorBarDirectionDispatchContext);
  (0, _react.useEffect)(() => {
    addErrorBar(props);
    return () => {
      removeErrorBar(props);
    };
  }, [addErrorBar, removeErrorBar, props]);
  return null;
}