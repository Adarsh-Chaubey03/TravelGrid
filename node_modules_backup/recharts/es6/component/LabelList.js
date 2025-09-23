var _excluded = ["valueAccessor"],
  _excluded2 = ["data", "dataKey", "clockWise", "id", "textBreakAll"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { cloneElement } from 'react';
import last from 'es-toolkit/compat/last';
import { Label, isLabelContentAFunction } from './Label';
import { Layer } from '../container/Layer';
import { findAllByType, filterProps } from '../util/ReactUtils';
import { getValueByDataKey } from '../util/ChartUtils';
import { isNullish } from '../util/DataUtils';
var defaultAccessor = entry => Array.isArray(entry.value) ? last(entry.value) : entry.value;
export function LabelList(_ref) {
  var {
      valueAccessor = defaultAccessor
    } = _ref,
    restProps = _objectWithoutProperties(_ref, _excluded);
  var {
      data,
      dataKey,
      clockWise,
      id,
      textBreakAll
    } = restProps,
    others = _objectWithoutProperties(restProps, _excluded2);
  if (!data || !data.length) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-label-list"
  }, data.map((entry, index) => {
    var value = isNullish(dataKey) ? valueAccessor(entry, index) : getValueByDataKey(entry && entry.payload, dataKey);
    var idProps = isNullish(id) ? {} : {
      id: "".concat(id, "-").concat(index)
    };
    return /*#__PURE__*/React.createElement(Label, _extends({}, filterProps(entry, true), others, idProps, {
      parentViewBox: entry.parentViewBox,
      value: value,
      textBreakAll: textBreakAll,
      viewBox: Label.parseViewBox(isNullish(clockWise) ? entry : _objectSpread(_objectSpread({}, entry), {}, {
        clockWise
      })),
      key: "label-".concat(index) // eslint-disable-line react/no-array-index-key
      ,
      index: index
    }));
  }));
}
LabelList.displayName = 'LabelList';
function parseLabelList(label, data) {
  if (!label) {
    return null;
  }
  if (label === true) {
    return /*#__PURE__*/React.createElement(LabelList, {
      key: "labelList-implicit",
      data: data
    });
  }
  if (/*#__PURE__*/React.isValidElement(label) || isLabelContentAFunction(label)) {
    return /*#__PURE__*/React.createElement(LabelList, {
      key: "labelList-implicit",
      data: data,
      content: label
    });
  }
  if (typeof label === 'object') {
    return /*#__PURE__*/React.createElement(LabelList, _extends({
      data: data
    }, label, {
      key: "labelList-implicit"
    }));
  }
  return null;
}
function renderCallByParent(parentProps, data) {
  var checkPropsLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (!parentProps || !parentProps.children && checkPropsLabel && !parentProps.label) {
    return null;
  }
  var {
    children
  } = parentProps;
  var explicitChildren = findAllByType(children, LabelList).map((child, index) => /*#__PURE__*/cloneElement(child, {
    data,
    // eslint-disable-next-line react/no-array-index-key
    key: "labelList-".concat(index)
  }));
  if (!checkPropsLabel) {
    return explicitChildren;
  }
  var implicitLabelList = parseLabelList(parentProps.label, data);
  return [implicitLabelList, ...explicitChildren];
}
LabelList.renderCallByParent = renderCallByParent;