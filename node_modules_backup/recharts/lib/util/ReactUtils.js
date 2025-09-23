"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterProps = exports.SCALE_TYPES = void 0;
exports.findAllByType = findAllByType;
exports.toArray = exports.isValidSpreadableProp = exports.isClipDot = exports.getDisplayName = void 0;
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _react = require("react");
var _reactIs = require("react-is");
var _DataUtils = require("./DataUtils");
var _types = require("./types");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var SCALE_TYPES = exports.SCALE_TYPES = ['auto', 'linear', 'pow', 'sqrt', 'log', 'identity', 'time', 'band', 'point', 'ordinal', 'quantile', 'quantize', 'utc', 'sequential', 'threshold'];

/**
 * @deprecated instead find another approach that does not depend on displayName.
 * Get the display name of a component
 * @param  {Object} Comp Specified Component
 * @return {String}      Display name of Component
 */
var getDisplayName = Comp => {
  if (typeof Comp === 'string') {
    return Comp;
  }
  if (!Comp) {
    return '';
  }
  return Comp.displayName || Comp.name || 'Component';
};

// `toArray` gets called multiple times during the render
// so we can memoize last invocation (since reference to `children` is the same)
exports.getDisplayName = getDisplayName;
var lastChildren = null;
var lastResult = null;

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * @param children do not use
 * @return deprecated do not use
 */
var toArray = children => {
  if (children === lastChildren && Array.isArray(lastResult)) {
    return lastResult;
  }
  var result = [];
  _react.Children.forEach(children, child => {
    if ((0, _DataUtils.isNullish)(child)) return;
    if ((0, _reactIs.isFragment)(child)) {
      result = result.concat(toArray(child.props.children));
    } else {
      // @ts-expect-error this could still be Iterable<ReactNode> and TS does not like that
      result.push(child);
    }
  });
  lastResult = result;
  lastChildren = children;
  return result;
};

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * Find and return all matched children by type.
 * `type` must be a React.ComponentType
 *
 * @param children do not use
 * @param type do not use
 * @return deprecated do not use
 */
exports.toArray = toArray;
function findAllByType(children, type) {
  var result = [];
  var types = [];
  if (Array.isArray(type)) {
    types = type.map(t => getDisplayName(t));
  } else {
    types = [getDisplayName(type)];
  }
  toArray(children).forEach(child => {
    var childType = (0, _get.default)(child, 'type.displayName') || (0, _get.default)(child, 'type.name');
    // ts-expect-error toArray and lodash.get are not compatible. Let's get rid of the whole findAllByType function
    if (types.indexOf(childType) !== -1) {
      result.push(child);
    }
  });
  return result;
}
var isClipDot = dot => {
  if (dot && typeof dot === 'object' && 'clipDot' in dot) {
    return Boolean(dot.clipDot);
  }
  return true;
};

/**
 * Checks if the property is valid to spread onto an SVG element or onto a specific component
 * @param {unknown} property property value currently being compared
 * @param {string} key property key currently being compared
 * @param {boolean} includeEvents if events are included in spreadable props
 * @param {boolean} svgElementType checks against map of SVG element types to attributes
 * @returns {boolean} is prop valid
 */
exports.isClipDot = isClipDot;
var isValidSpreadableProp = (property, key, includeEvents, svgElementType) => {
  var _ref;
  /**
   * If the svg element type is explicitly included, check against the filtered element key map
   * to determine if there are attributes that should only exist on that element type.
   * @todo Add an internal cjs version of https://github.com/wooorm/svg-element-attributes for full coverage.
   */
  var matchingElementTypeKeys = (_ref = svgElementType && (_types.FilteredElementKeyMap === null || _types.FilteredElementKeyMap === void 0 ? void 0 : _types.FilteredElementKeyMap[svgElementType])) !== null && _ref !== void 0 ? _ref : [];
  return key.startsWith('data-') || typeof property !== 'function' && (svgElementType && matchingElementTypeKeys.includes(key) || _types.SVGElementPropKeys.includes(key)) || includeEvents && _types.EventKeys.includes(key);
};
exports.isValidSpreadableProp = isValidSpreadableProp;
var filterProps = (props, includeEvents, svgElementType) => {
  if (!props || typeof props === 'function' || typeof props === 'boolean') {
    return null;
  }
  var inputProps = props;
  if (/*#__PURE__*/(0, _react.isValidElement)(props)) {
    inputProps = props.props;
  }
  if (typeof inputProps !== 'object' && typeof inputProps !== 'function') {
    return null;
  }
  var out = {};

  /**
   * Props are blindly spread onto SVG elements. This loop filters out properties that we don't want to spread.
   * Items filtered out are as follows:
   *   - functions in properties that are SVG attributes (functions are included when includeEvents is true)
   *   - props that are SVG attributes but don't matched the passed svgElementType
   *   - any prop that is not in SVGElementPropKeys (or in EventKeys if includeEvents is true)
   */
  Object.keys(inputProps).forEach(key => {
    var _inputProps;
    if (isValidSpreadableProp((_inputProps = inputProps) === null || _inputProps === void 0 ? void 0 : _inputProps[key], key, includeEvents, svgElementType)) {
      out[key] = inputProps[key];
    }
  });
  return out;
};
exports.filterProps = filterProps;