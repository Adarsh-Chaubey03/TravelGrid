var _excluded = ["children", "className", "width", "height", "style", "compact", "title", "desc"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { forwardRef } from 'react';
import { filterProps } from '../util/ReactUtils';
import { RootSurface } from '../container/RootSurface';
import { RechartsWrapper } from './RechartsWrapper';
import { ClipPathProvider } from '../container/ClipPathProvider';
export var CategoricalChart = /*#__PURE__*/forwardRef((props, ref) => {
  var {
      children,
      className,
      width,
      height,
      style,
      compact,
      title,
      desc
    } = props,
    others = _objectWithoutProperties(props, _excluded);
  var attrs = filterProps(others, false);

  // The "compact" mode is used as the panorama within Brush
  if (compact) {
    return /*#__PURE__*/React.createElement(RootSurface, {
      otherAttributes: attrs,
      title: title,
      desc: desc
    }, children);
  }
  return /*#__PURE__*/React.createElement(RechartsWrapper, {
    className: className,
    style: style,
    width: width,
    height: height,
    onClick: props.onClick,
    onMouseLeave: props.onMouseLeave,
    onMouseEnter: props.onMouseEnter,
    onMouseMove: props.onMouseMove,
    onMouseDown: props.onMouseDown,
    onMouseUp: props.onMouseUp,
    onContextMenu: props.onContextMenu,
    onDoubleClick: props.onDoubleClick,
    onTouchStart: props.onTouchStart,
    onTouchMove: props.onTouchMove,
    onTouchEnd: props.onTouchEnd
  }, /*#__PURE__*/React.createElement(RootSurface, {
    otherAttributes: attrs,
    title: title,
    desc: desc,
    ref: ref
  }, /*#__PURE__*/React.createElement(ClipPathProvider, null, children)));
});