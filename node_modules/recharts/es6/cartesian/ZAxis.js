function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { Component, useEffect } from 'react';
import { addZAxis, removeZAxis } from '../state/cartesianAxisSlice';
import { useAppDispatch } from '../state/hooks';
import { implicitZAxis } from '../state/selectors/axisSelectors';
function SetZAxisSettings(settings) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addZAxis(settings));
    return () => {
      dispatch(removeZAxis(settings));
    };
  }, [settings, dispatch]);
  return null;
}
// eslint-disable-next-line react/prefer-stateless-function
export class ZAxis extends Component {
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
      allowDuplicatedCategory: implicitZAxis.allowDuplicatedCategory,
      allowDataOverflow: implicitZAxis.allowDataOverflow,
      reversed: implicitZAxis.reversed,
      includeHidden: implicitZAxis.includeHidden
    });
  }
}
_defineProperty(ZAxis, "displayName", 'ZAxis');
_defineProperty(ZAxis, "defaultProps", {
  zAxisId: 0,
  range: implicitZAxis.range,
  scale: implicitZAxis.scale,
  type: implicitZAxis.type
});