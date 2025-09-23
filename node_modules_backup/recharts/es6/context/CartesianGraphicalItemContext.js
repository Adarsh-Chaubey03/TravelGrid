var _excluded = ["children"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { createContext, useCallback, useContext, useEffect } from 'react';
import { SetCartesianGraphicalItem } from '../state/SetGraphicalItem';
import { useIsPanorama } from './PanoramaContext';
var noop = () => {};
var ErrorBarDirectionDispatchContext = /*#__PURE__*/createContext({
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
var ErrorBarContext = /*#__PURE__*/createContext(initialContextState);
export function SetErrorBarContext(props) {
  var {
      children
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(ErrorBarContext.Provider, {
    value: rest
  }, children);
}
export var useErrorBarContext = () => useContext(ErrorBarContext);
export var CartesianGraphicalItemContext = _ref => {
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
  var addErrorBar = useCallback(errorBar => {
    updateErrorBars(prev => [...prev, errorBar]);
  }, [updateErrorBars]);
  var removeErrorBar = useCallback(errorBar => {
    updateErrorBars(prev => prev.filter(eb => eb !== errorBar));
  }, [updateErrorBars]);
  var isPanorama = useIsPanorama();
  return /*#__PURE__*/React.createElement(ErrorBarDirectionDispatchContext.Provider, {
    value: {
      addErrorBar,
      removeErrorBar
    }
  }, /*#__PURE__*/React.createElement(SetCartesianGraphicalItem, {
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
export function ReportErrorBarSettings(props) {
  var {
    addErrorBar,
    removeErrorBar
  } = useContext(ErrorBarDirectionDispatchContext);
  useEffect(() => {
    addErrorBar(props);
    return () => {
      removeErrorBar(props);
    };
  }, [addErrorBar, removeErrorBar, props]);
  return null;
}