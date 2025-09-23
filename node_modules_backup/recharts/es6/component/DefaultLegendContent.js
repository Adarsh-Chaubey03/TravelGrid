function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @fileOverview Default Legend Content
 */
import * as React from 'react';
import { PureComponent } from 'react';
import { clsx } from 'clsx';
import { Surface } from '../container/Surface';
import { Symbols } from '../shape/Symbols';
import { adaptEventsOfChild } from '../util/types';
var SIZE = 32;
export class DefaultLegendContent extends PureComponent {
  /**
   * Render the path of icon
   * @param data Data of each legend item
   * @param iconType if defined, it will always render this icon. If undefined then it uses icon from data.type
   * @return Path element
   */
  renderIcon(data, iconType) {
    var {
      inactiveColor
    } = this.props;
    var halfSize = SIZE / 2;
    var sixthSize = SIZE / 6;
    var thirdSize = SIZE / 3;
    var color = data.inactive ? inactiveColor : data.color;
    var preferredIcon = iconType !== null && iconType !== void 0 ? iconType : data.type;
    if (preferredIcon === 'none') {
      return null;
    }
    if (preferredIcon === 'plainline') {
      return /*#__PURE__*/React.createElement("line", {
        strokeWidth: 4,
        fill: "none",
        stroke: color,
        strokeDasharray: data.payload.strokeDasharray,
        x1: 0,
        y1: halfSize,
        x2: SIZE,
        y2: halfSize,
        className: "recharts-legend-icon"
      });
    }
    if (preferredIcon === 'line') {
      return /*#__PURE__*/React.createElement("path", {
        strokeWidth: 4,
        fill: "none",
        stroke: color,
        d: "M0,".concat(halfSize, "h").concat(thirdSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(2 * thirdSize, ",").concat(halfSize, "\n            H").concat(SIZE, "M").concat(2 * thirdSize, ",").concat(halfSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(thirdSize, ",").concat(halfSize),
        className: "recharts-legend-icon"
      });
    }
    if (preferredIcon === 'rect') {
      return /*#__PURE__*/React.createElement("path", {
        stroke: "none",
        fill: color,
        d: "M0,".concat(SIZE / 8, "h").concat(SIZE, "v").concat(SIZE * 3 / 4, "h").concat(-SIZE, "z"),
        className: "recharts-legend-icon"
      });
    }
    if (/*#__PURE__*/React.isValidElement(data.legendIcon)) {
      var iconProps = _objectSpread({}, data);
      delete iconProps.legendIcon;
      return /*#__PURE__*/React.cloneElement(data.legendIcon, iconProps);
    }
    return /*#__PURE__*/React.createElement(Symbols, {
      fill: color,
      cx: halfSize,
      cy: halfSize,
      size: SIZE,
      sizeType: "diameter",
      type: preferredIcon
    });
  }

  /**
   * Draw items of legend
   * @return Items
   */
  renderItems() {
    var {
      payload,
      iconSize,
      layout,
      formatter,
      inactiveColor,
      iconType
    } = this.props;
    var viewBox = {
      x: 0,
      y: 0,
      width: SIZE,
      height: SIZE
    };
    var itemStyle = {
      display: layout === 'horizontal' ? 'inline-block' : 'block',
      marginRight: 10
    };
    var svgStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: 4
    };
    return payload.map((entry, i) => {
      var finalFormatter = entry.formatter || formatter;
      var className = clsx({
        'recharts-legend-item': true,
        ["legend-item-".concat(i)]: true,
        inactive: entry.inactive
      });
      if (entry.type === 'none') {
        return null;
      }
      var color = entry.inactive ? inactiveColor : entry.color;
      var finalValue = finalFormatter ? finalFormatter(entry.value, entry, i) : entry.value;
      return /*#__PURE__*/React.createElement("li", _extends({
        className: className,
        style: itemStyle
        // eslint-disable-next-line react/no-array-index-key
        ,
        key: "legend-item-".concat(i)
      }, adaptEventsOfChild(this.props, entry, i)), /*#__PURE__*/React.createElement(Surface, {
        width: iconSize,
        height: iconSize,
        viewBox: viewBox,
        style: svgStyle,
        "aria-label": "".concat(finalValue, " legend icon")
      }, this.renderIcon(entry, iconType)), /*#__PURE__*/React.createElement("span", {
        className: "recharts-legend-item-text",
        style: {
          color
        }
      }, finalValue));
    });
  }
  render() {
    var {
      payload,
      layout,
      align
    } = this.props;
    if (!payload || !payload.length) {
      return null;
    }
    var finalStyle = {
      padding: 0,
      margin: 0,
      textAlign: layout === 'horizontal' ? align : 'left'
    };
    return /*#__PURE__*/React.createElement("ul", {
      className: "recharts-default-legend",
      style: finalStyle
    }, this.renderItems());
  }
}
_defineProperty(DefaultLegendContent, "displayName", 'Legend');
_defineProperty(DefaultLegendContent, "defaultProps", {
  align: 'center',
  iconSize: 14,
  inactiveColor: '#ccc',
  layout: 'horizontal',
  verticalAlign: 'middle'
});