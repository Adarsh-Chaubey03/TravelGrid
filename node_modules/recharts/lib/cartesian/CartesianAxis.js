"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _clsx = require("clsx");
var _ShallowEqual = require("../util/ShallowEqual");
var _Layer = require("../container/Layer");
var _Text = require("../component/Text");
var _Label = require("../component/Label");
var _DataUtils = require("../util/DataUtils");
var _types = require("../util/types");
var _ReactUtils = require("../util/ReactUtils");
var _getTicks = require("./getTicks");
var _excluded = ["viewBox"],
  _excluded2 = ["viewBox"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Cartesian Axis
 */
/** The orientation of the axis in correspondence to the chart */

/** A unit to be appended to a value */

/** The formatter function of tick */

/*
 * `viewBox` and `scale` are SVG attributes.
 * Recharts however - unfortunately - has its own attributes named `viewBox` and `scale`
 * that are completely different data shape and different purpose.
 */

class CartesianAxis extends _react.Component {
  constructor(props) {
    super(props);
    this.tickRefs = /*#__PURE__*/React.createRef();
    this.tickRefs.current = [];
    this.state = {
      fontSize: '',
      letterSpacing: ''
    };
  }
  shouldComponentUpdate(_ref, nextState) {
    var {
        viewBox
      } = _ref,
      restProps = _objectWithoutProperties(_ref, _excluded);
    // props.viewBox is sometimes generated every time -
    // check that specially as object equality is likely to fail
    var _this$props = this.props,
      {
        viewBox: viewBoxOld
      } = _this$props,
      restPropsOld = _objectWithoutProperties(_this$props, _excluded2);
    return !(0, _ShallowEqual.shallowEqual)(viewBox, viewBoxOld) || !(0, _ShallowEqual.shallowEqual)(restProps, restPropsOld) || !(0, _ShallowEqual.shallowEqual)(nextState, this.state);
  }

  /**
   * Calculate the coordinates of endpoints in ticks
   * @param  data The data of a simple tick
   * @return (x1, y1): The coordinate of endpoint close to tick text
   *  (x2, y2): The coordinate of endpoint close to axis
   */
  getTickLineCoord(data) {
    var {
      x,
      y,
      width,
      height,
      orientation,
      tickSize,
      mirror,
      tickMargin
    } = this.props;
    var x1, x2, y1, y2, tx, ty;
    var sign = mirror ? -1 : 1;
    var finalTickSize = data.tickSize || tickSize;
    var tickCoord = (0, _DataUtils.isNumber)(data.tickCoord) ? data.tickCoord : data.coordinate;
    switch (orientation) {
      case 'top':
        x1 = x2 = data.coordinate;
        y2 = y + +!mirror * height;
        y1 = y2 - sign * finalTickSize;
        ty = y1 - sign * tickMargin;
        tx = tickCoord;
        break;
      case 'left':
        y1 = y2 = data.coordinate;
        x2 = x + +!mirror * width;
        x1 = x2 - sign * finalTickSize;
        tx = x1 - sign * tickMargin;
        ty = tickCoord;
        break;
      case 'right':
        y1 = y2 = data.coordinate;
        x2 = x + +mirror * width;
        x1 = x2 + sign * finalTickSize;
        tx = x1 + sign * tickMargin;
        ty = tickCoord;
        break;
      default:
        x1 = x2 = data.coordinate;
        y2 = y + +mirror * height;
        y1 = y2 + sign * finalTickSize;
        ty = y1 + sign * tickMargin;
        tx = tickCoord;
        break;
    }
    return {
      line: {
        x1,
        y1,
        x2,
        y2
      },
      tick: {
        x: tx,
        y: ty
      }
    };
  }
  getTickTextAnchor() {
    var {
      orientation,
      mirror
    } = this.props;
    var textAnchor;
    switch (orientation) {
      case 'left':
        textAnchor = mirror ? 'start' : 'end';
        break;
      case 'right':
        textAnchor = mirror ? 'end' : 'start';
        break;
      default:
        textAnchor = 'middle';
        break;
    }
    return textAnchor;
  }
  getTickVerticalAnchor() {
    var {
      orientation,
      mirror
    } = this.props;
    switch (orientation) {
      case 'left':
      case 'right':
        return 'middle';
      case 'top':
        return mirror ? 'start' : 'end';
      default:
        return mirror ? 'end' : 'start';
    }
  }
  renderAxisLine() {
    var {
      x,
      y,
      width,
      height,
      orientation,
      mirror,
      axisLine
    } = this.props;
    var props = _objectSpread(_objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(this.props, false)), (0, _ReactUtils.filterProps)(axisLine, false)), {}, {
      fill: 'none'
    });
    if (orientation === 'top' || orientation === 'bottom') {
      var needHeight = +(orientation === 'top' && !mirror || orientation === 'bottom' && mirror);
      props = _objectSpread(_objectSpread({}, props), {}, {
        x1: x,
        y1: y + needHeight * height,
        x2: x + width,
        y2: y + needHeight * height
      });
    } else {
      var needWidth = +(orientation === 'left' && !mirror || orientation === 'right' && mirror);
      props = _objectSpread(_objectSpread({}, props), {}, {
        x1: x + needWidth * width,
        y1: y,
        x2: x + needWidth * width,
        y2: y + height
      });
    }
    return /*#__PURE__*/React.createElement("line", _extends({}, props, {
      className: (0, _clsx.clsx)('recharts-cartesian-axis-line', (0, _get.default)(axisLine, 'className'))
    }));
  }
  static renderTickItem(option, props, value) {
    var tickItem;
    var combinedClassName = (0, _clsx.clsx)(props.className, 'recharts-cartesian-axis-tick-value');
    if (/*#__PURE__*/React.isValidElement(option)) {
      tickItem = /*#__PURE__*/React.cloneElement(option, _objectSpread(_objectSpread({}, props), {}, {
        className: combinedClassName
      }));
    } else if (typeof option === 'function') {
      tickItem = option(_objectSpread(_objectSpread({}, props), {}, {
        className: combinedClassName
      }));
    } else {
      var className = 'recharts-cartesian-axis-tick-value';
      if (typeof option !== 'boolean') {
        className = (0, _clsx.clsx)(className, option.className);
      }
      tickItem = /*#__PURE__*/React.createElement(_Text.Text, _extends({}, props, {
        className: className
      }), value);
    }
    return tickItem;
  }

  /**
   * render the ticks
   * @param {string} fontSize Fontsize to consider for tick spacing
   * @param {string} letterSpacing Letter spacing to consider for tick spacing
   * @param {Array} ticks The ticks to actually render (overrides what was passed in props)
   * @return {ReactElement | null} renderedTicks
   */
  renderTicks(fontSize, letterSpacing) {
    var ticks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var {
      tickLine,
      stroke,
      tick,
      tickFormatter,
      unit
    } = this.props;
    // @ts-expect-error some properties are optional in props but required in getTicks
    var finalTicks = (0, _getTicks.getTicks)(_objectSpread(_objectSpread({}, this.props), {}, {
      ticks
    }), fontSize, letterSpacing);
    var textAnchor = this.getTickTextAnchor();
    var verticalAnchor = this.getTickVerticalAnchor();
    var axisProps = (0, _ReactUtils.filterProps)(this.props, false);
    var customTickProps = (0, _ReactUtils.filterProps)(tick, false);
    var tickLineProps = _objectSpread(_objectSpread({}, axisProps), {}, {
      fill: 'none'
    }, (0, _ReactUtils.filterProps)(tickLine, false));
    var items = finalTicks.map((entry, i) => {
      var {
        line: lineCoord,
        tick: tickCoord
      } = this.getTickLineCoord(entry);
      var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
        textAnchor,
        verticalAnchor
      }, axisProps), {}, {
        stroke: 'none',
        fill: stroke
      }, customTickProps), tickCoord), {}, {
        index: i,
        payload: entry,
        visibleTicksCount: finalTicks.length,
        tickFormatter
      });
      return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
        className: "recharts-cartesian-axis-tick",
        key: "tick-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
      }, (0, _types.adaptEventsOfChild)(this.props, entry, i)), tickLine && /*#__PURE__*/React.createElement("line", _extends({}, tickLineProps, lineCoord, {
        className: (0, _clsx.clsx)('recharts-cartesian-axis-tick-line', (0, _get.default)(tickLine, 'className'))
      })), tick && CartesianAxis.renderTickItem(tick, tickProps, "".concat(typeof tickFormatter === 'function' ? tickFormatter(entry.value, i) : entry.value).concat(unit || '')));
    });
    return items.length > 0 ? /*#__PURE__*/React.createElement("g", {
      className: "recharts-cartesian-axis-ticks"
    }, items) : null;
  }
  render() {
    var {
      axisLine,
      width,
      height,
      className,
      hide
    } = this.props;
    if (hide) {
      return null;
    }
    var {
      ticks
    } = this.props;

    /*
     * This is different condition from what validateWidthHeight is doing;
     * the CartesianAxis does allow width or height to be undefined.
     */
    if (width != null && width <= 0 || height != null && height <= 0) {
      return null;
    }
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: (0, _clsx.clsx)('recharts-cartesian-axis', className),
      ref: _ref2 => {
        if (_ref2) {
          var tickNodes = _ref2.getElementsByClassName('recharts-cartesian-axis-tick-value');
          this.tickRefs.current = Array.from(tickNodes);
          var tick = tickNodes[0];
          if (tick) {
            var calculatedFontSize = window.getComputedStyle(tick).fontSize;
            var calculatedLetterSpacing = window.getComputedStyle(tick).letterSpacing;
            if (calculatedFontSize !== this.state.fontSize || calculatedLetterSpacing !== this.state.letterSpacing) {
              this.setState({
                fontSize: window.getComputedStyle(tick).fontSize,
                letterSpacing: window.getComputedStyle(tick).letterSpacing
              });
            }
          }
        }
      }
    }, axisLine && this.renderAxisLine(), this.renderTicks(this.state.fontSize, this.state.letterSpacing, ticks), _Label.Label.renderCallByParent(this.props));
  }
}
exports.CartesianAxis = CartesianAxis;
_defineProperty(CartesianAxis, "displayName", 'CartesianAxis');
_defineProperty(CartesianAxis, "defaultProps", {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: 'bottom',
  // The ticks
  ticks: [],
  stroke: '#666',
  tickLine: true,
  axisLine: true,
  tick: true,
  mirror: false,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: 'preserveEnd'
});