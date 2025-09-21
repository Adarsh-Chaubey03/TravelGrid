"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Animate = Animate;
exports.AnimationManagerContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _isEqual = _interopRequireDefault(require("es-toolkit/compat/isEqual"));
var _AnimationManager = require("./AnimationManager");
var _easing = require("./easing");
var _configUpdate = _interopRequireDefault(require("./configUpdate"));
var _util = require("./util");
var _timeoutController = require("./timeoutController");
var _excluded = ["children", "begin", "duration", "attributeName", "easing", "isActive", "from", "to", "canBegin", "onAnimationEnd", "shouldReAnimate", "onAnimationReStart", "animationManager"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function createDefaultAnimationManager() {
  return (0, _AnimationManager.createAnimateManager)(new _timeoutController.RequestAnimationFrameTimeoutController());
}
class AnimateImpl extends _react.PureComponent {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "mounted", false);
    _defineProperty(this, "manager", null);
    _defineProperty(this, "stopJSAnimation", null);
    _defineProperty(this, "unSubscribe", null);
    var {
      isActive,
      attributeName,
      from,
      to,
      children,
      duration,
      animationManager
    } = this.props;
    this.manager = animationManager;
    this.handleStyleChange = this.handleStyleChange.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
    if (!isActive || duration <= 0) {
      this.state = {
        style: {}
      };

      // if children is a function and animation is not active, set style to 'to'
      if (typeof children === 'function') {
        this.state = {
          style: to
        };
      }
      return;
    }
    if (from) {
      if (typeof children === 'function') {
        this.state = {
          style: from
        };
        return;
      }
      this.state = {
        style: attributeName ? {
          [attributeName]: from
        } : from
      };
    } else {
      this.state = {
        style: {}
      };
    }
  }
  componentDidMount() {
    var {
      isActive,
      canBegin
    } = this.props;
    this.mounted = true;
    if (!isActive || !canBegin) {
      return;
    }
    this.runAnimation(this.props);
  }
  componentDidUpdate(prevProps) {
    var {
      isActive,
      canBegin,
      attributeName,
      shouldReAnimate,
      to,
      from: currentFrom
    } = this.props;
    var {
      style
    } = this.state;
    if (!canBegin) {
      return;
    }
    if (!isActive) {
      var newState = {
        style: attributeName ? {
          [attributeName]: to
        } : to
      };
      if (this.state && style) {
        if (attributeName && style[attributeName] !== to || !attributeName && style !== to) {
          this.setState(newState);
        }
      }
      return;
    }
    if ((0, _isEqual.default)(prevProps.to, to) && prevProps.canBegin && prevProps.isActive) {
      return;
    }
    var isTriggered = !prevProps.canBegin || !prevProps.isActive;
    this.manager.stop();
    if (this.stopJSAnimation) {
      this.stopJSAnimation();
    }
    var from = isTriggered || shouldReAnimate ? currentFrom : prevProps.to;
    if (this.state && style) {
      var _newState = {
        style: attributeName ? {
          [attributeName]: from
        } : from
      };
      if (attributeName && style[attributeName] !== from || !attributeName && style !== from) {
        this.setState(_newState);
      }
    }
    this.runAnimation(_objectSpread(_objectSpread({}, this.props), {}, {
      from,
      begin: 0
    }));
  }
  componentWillUnmount() {
    this.mounted = false;
    var {
      onAnimationEnd
    } = this.props;
    if (this.unSubscribe) {
      this.unSubscribe();
    }
    this.manager.stop();
    if (this.stopJSAnimation) {
      this.stopJSAnimation();
    }
    if (onAnimationEnd) {
      onAnimationEnd();
    }
  }
  handleStyleChange(style) {
    this.changeStyle(style);
  }
  changeStyle(style) {
    if (this.mounted) {
      this.setState({
        style
      });
    }
  }
  runJSAnimation(props) {
    var {
      from,
      to,
      duration,
      easing,
      begin,
      onAnimationEnd,
      onAnimationStart
    } = props;
    var startAnimation = (0, _configUpdate.default)(from, to, (0, _easing.configEasing)(easing), duration, this.changeStyle, this.manager.getTimeoutController());
    var finalStartAnimation = () => {
      this.stopJSAnimation = startAnimation();
    };
    this.manager.start([onAnimationStart, begin, finalStartAnimation, duration, onAnimationEnd]);
  }
  runAnimation(props) {
    var {
      begin,
      duration,
      attributeName,
      to: propsTo,
      easing,
      onAnimationStart,
      onAnimationEnd,
      children
    } = props;
    this.unSubscribe = this.manager.subscribe(this.handleStyleChange);
    if (typeof easing === 'function' || typeof children === 'function' || easing === 'spring') {
      this.runJSAnimation(props);
      return;
    }
    var to = attributeName ? {
      [attributeName]: propsTo
    } : propsTo;
    var transition = (0, _util.getTransitionVal)(Object.keys(to), duration, easing);
    this.manager.start([onAnimationStart, begin, _objectSpread(_objectSpread({}, to), {}, {
      transition
    }), duration, onAnimationEnd]);
  }
  render() {
    var _this$props = this.props,
      {
        children,
        begin,
        duration,
        attributeName,
        easing,
        isActive,
        from,
        to,
        canBegin,
        onAnimationEnd,
        shouldReAnimate,
        onAnimationReStart,
        animationManager
      } = _this$props,
      others = _objectWithoutProperties(_this$props, _excluded);
    var count = _react.Children.count(children);
    var stateStyle = this.state.style;
    if (typeof children === 'function') {
      return children(stateStyle);
    }
    if (!isActive || count === 0 || duration <= 0) {
      return children;
    }
    var cloneContainer = container => {
      var {
        style = {},
        className
      } = container.props;
      var res = /*#__PURE__*/(0, _react.cloneElement)(container, _objectSpread(_objectSpread({}, others), {}, {
        style: _objectSpread(_objectSpread({}, style), stateStyle),
        className
      }));
      return res;
    };
    if (count === 1) {
      // @ts-expect-error TODO - fix the type error
      return cloneContainer(_react.Children.only(children));
    }

    // @ts-expect-error TODO - fix the type error
    return /*#__PURE__*/React.createElement("div", null, _react.Children.map(children, child => cloneContainer(child)));
  }
}
_defineProperty(AnimateImpl, "displayName", 'Animate');
_defineProperty(AnimateImpl, "defaultProps", {
  begin: 0,
  duration: 1000,
  attributeName: '',
  easing: 'ease',
  isActive: true,
  canBegin: true,
  onAnimationEnd: () => {},
  onAnimationStart: () => {}
});
var AnimationManagerContext = exports.AnimationManagerContext = /*#__PURE__*/(0, _react.createContext)(null);
function Animate(props) {
  var _ref, _props$animationManag;
  var contextAnimationManager = (0, _react.useContext)(AnimationManagerContext);
  return /*#__PURE__*/React.createElement(AnimateImpl, _extends({}, props, {
    animationManager: (_ref = (_props$animationManag = props.animationManager) !== null && _props$animationManag !== void 0 ? _props$animationManag : contextAnimationManager) !== null && _ref !== void 0 ? _ref : createDefaultAnimationManager()
  }));
}