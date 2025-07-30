"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Treemap = Treemap;
exports.treemapPayloadSearcher = exports.computeNode = exports.addToTreemapNodeIndex = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _omit = _interopRequireDefault(require("es-toolkit/compat/omit"));
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _Layer = require("../container/Layer");
var _Surface = require("../container/Surface");
var _Polygon = require("../shape/Polygon");
var _Rectangle = require("../shape/Rectangle");
var _ChartUtils = require("../util/ChartUtils");
var _Constants = require("../util/Constants");
var _DataUtils = require("../util/DataUtils");
var _DOMUtils = require("../util/DOMUtils");
var _Global = require("../util/Global");
var _ReactUtils = require("../util/ReactUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _tooltipPortalContext = require("../context/tooltipPortalContext");
var _RechartsWrapper = require("./RechartsWrapper");
var _tooltipSlice = require("../state/tooltipSlice");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _RechartsStoreProvider = require("../state/RechartsStoreProvider");
var _hooks = require("../state/hooks");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var _Animate = require("../animation/Animate");
var _excluded = ["width", "height", "className", "style", "children", "type"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var NODE_VALUE_KEY = 'value';

/**
 * This is what end users defines as `data` on Treemap.
 */

/**
 * This is what is returned from `squarify`, the final treemap data structure
 * that gets rendered and is stored in
 */

var treemapPayloadSearcher = (data, activeIndex) => {
  return (0, _get.default)(data, activeIndex);
};
exports.treemapPayloadSearcher = treemapPayloadSearcher;
var addToTreemapNodeIndex = exports.addToTreemapNodeIndex = function addToTreemapNodeIndex(indexInChildrenArr) {
  var activeTooltipIndexSoFar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return "".concat(activeTooltipIndexSoFar, "children[").concat(indexInChildrenArr, "]");
};
var options = {
  chartName: 'Treemap',
  defaultTooltipEventType: 'item',
  validateTooltipEventTypes: ['item'],
  tooltipPayloadSearcher: treemapPayloadSearcher,
  eventEmitter: undefined
};
var computeNode = _ref => {
  var {
    depth,
    node,
    index,
    dataKey,
    nameKey,
    nestedActiveTooltipIndex
  } = _ref;
  var currentTooltipIndex = depth === 0 ? '' : addToTreemapNodeIndex(index, nestedActiveTooltipIndex);
  var {
    children
  } = node;
  var childDepth = depth + 1;
  var computedChildren = children && children.length ? children.map((child, i) => computeNode({
    depth: childDepth,
    node: child,
    index: i,
    dataKey,
    nameKey,
    nestedActiveTooltipIndex: currentTooltipIndex
  })) : null;
  var nodeValue;
  if (children && children.length) {
    nodeValue = computedChildren.reduce((result, child) => result + child[NODE_VALUE_KEY], 0);
  } else {
    // TODO need to verify dataKey
    nodeValue = (0, _DataUtils.isNan)(node[dataKey]) || node[dataKey] <= 0 ? 0 : node[dataKey];
  }
  return _objectSpread(_objectSpread({}, node), {}, {
    children: computedChildren,
    // @ts-expect-error getValueByDataKey does not validate the output type
    name: (0, _ChartUtils.getValueByDataKey)(node, nameKey, ''),
    [NODE_VALUE_KEY]: nodeValue,
    depth,
    index,
    tooltipIndex: currentTooltipIndex
  });
};
exports.computeNode = computeNode;
var filterRect = node => ({
  x: node.x,
  y: node.y,
  width: node.width,
  height: node.height
});

// Compute the area for each child based on value & scale.
var getAreaOfChildren = (children, areaValueRatio) => {
  var ratio = areaValueRatio < 0 ? 0 : areaValueRatio;
  return children.map(child => {
    var area = child[NODE_VALUE_KEY] * ratio;
    return _objectSpread(_objectSpread({}, child), {}, {
      area: (0, _DataUtils.isNan)(area) || area <= 0 ? 0 : area
    });
  });
};

// Computes the score for the specified row, as the worst aspect ratio.
var getWorstScore = (row, parentSize, aspectRatio) => {
  var parentArea = parentSize * parentSize;
  var rowArea = row.area * row.area;
  var {
    min,
    max
  } = row.reduce((result, child) => ({
    min: Math.min(result.min, child.area),
    max: Math.max(result.max, child.area)
  }), {
    min: Infinity,
    max: 0
  });
  return rowArea ? Math.max(parentArea * max * aspectRatio / rowArea, rowArea / (parentArea * min * aspectRatio)) : Infinity;
};
var horizontalPosition = (row, parentSize, parentRect, isFlush) => {
  var rowHeight = parentSize ? Math.round(row.area / parentSize) : 0;
  if (isFlush || rowHeight > parentRect.height) {
    rowHeight = parentRect.height;
  }
  var curX = parentRect.x;
  var child;
  for (var i = 0, len = row.length; i < len; i++) {
    child = row[i];
    child.x = curX;
    child.y = parentRect.y;
    child.height = rowHeight;
    child.width = Math.min(rowHeight ? Math.round(child.area / rowHeight) : 0, parentRect.x + parentRect.width - curX);
    curX += child.width;
  }
  // add the remain x to the last one of row
  child.width += parentRect.x + parentRect.width - curX;
  return _objectSpread(_objectSpread({}, parentRect), {}, {
    y: parentRect.y + rowHeight,
    height: parentRect.height - rowHeight
  });
};
var verticalPosition = (row, parentSize, parentRect, isFlush) => {
  var rowWidth = parentSize ? Math.round(row.area / parentSize) : 0;
  if (isFlush || rowWidth > parentRect.width) {
    rowWidth = parentRect.width;
  }
  var curY = parentRect.y;
  var child;
  for (var i = 0, len = row.length; i < len; i++) {
    child = row[i];
    child.x = parentRect.x;
    child.y = curY;
    child.width = rowWidth;
    child.height = Math.min(rowWidth ? Math.round(child.area / rowWidth) : 0, parentRect.y + parentRect.height - curY);
    curY += child.height;
  }
  if (child) {
    child.height += parentRect.y + parentRect.height - curY;
  }
  return _objectSpread(_objectSpread({}, parentRect), {}, {
    x: parentRect.x + rowWidth,
    width: parentRect.width - rowWidth
  });
};
var position = (row, parentSize, parentRect, isFlush) => {
  if (parentSize === parentRect.width) {
    return horizontalPosition(row, parentSize, parentRect, isFlush);
  }
  return verticalPosition(row, parentSize, parentRect, isFlush);
};

// Recursively arranges the specified node's children into squarified rows.
var squarify = (node, aspectRatio) => {
  var {
    children
  } = node;
  if (children && children.length) {
    var rect = filterRect(node);
    // maybe a bug
    var row = [];
    var best = Infinity; // the best row score so far
    var child, score; // the current row score
    var size = Math.min(rect.width, rect.height); // initial orientation
    var scaleChildren = getAreaOfChildren(children, rect.width * rect.height / node[NODE_VALUE_KEY]);
    var tempChildren = scaleChildren.slice();
    row.area = 0;
    while (tempChildren.length > 0) {
      // row first
      // eslint-disable-next-line prefer-destructuring
      row.push(child = tempChildren[0]);
      row.area += child.area;
      score = getWorstScore(row, size, aspectRatio);
      if (score <= best) {
        // continue with this orientation
        tempChildren.shift();
        best = score;
      } else {
        // abort, and try a different orientation
        row.area -= row.pop().area;
        rect = position(row, size, rect, false);
        size = Math.min(rect.width, rect.height);
        row.length = row.area = 0;
        best = Infinity;
      }
    }
    if (row.length) {
      rect = position(row, size, rect, true);
      row.length = row.area = 0;
    }
    return _objectSpread(_objectSpread({}, node), {}, {
      children: scaleChildren.map(c => squarify(c, aspectRatio))
    });
  }
  return node;
};
var defaultState = {
  isAnimationFinished: false,
  formatRoot: null,
  currentRoot: null,
  nestIndex: []
};
function ContentItem(_ref2) {
  var {
    content,
    nodeProps,
    type,
    colorPanel,
    onMouseEnter,
    onMouseLeave,
    onClick
  } = _ref2;
  if (/*#__PURE__*/React.isValidElement(content)) {
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onClick: onClick
    }, /*#__PURE__*/React.cloneElement(content, nodeProps));
  }
  if (typeof content === 'function') {
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onClick: onClick
    }, content(nodeProps));
  }
  // optimize default shape
  var {
    x,
    y,
    width,
    height,
    index
  } = nodeProps;
  var arrow = null;
  if (width > 10 && height > 10 && nodeProps.children && type === 'nest') {
    arrow = /*#__PURE__*/React.createElement(_Polygon.Polygon, {
      points: [{
        x: x + 2,
        y: y + height / 2
      }, {
        x: x + 6,
        y: y + height / 2 + 3
      }, {
        x: x + 2,
        y: y + height / 2 + 6
      }]
    });
  }
  var text = null;
  var nameSize = (0, _DOMUtils.getStringSize)(nodeProps.name);
  if (width > 20 && height > 20 && nameSize.width < width && nameSize.height < height) {
    text = /*#__PURE__*/React.createElement("text", {
      x: x + 8,
      y: y + height / 2 + 7,
      fontSize: 14
    }, nodeProps.name);
  }
  var colors = colorPanel || _Constants.COLOR_PANEL;
  return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(_Rectangle.Rectangle, _extends({
    fill: nodeProps.depth < 2 ? colors[index % colors.length] : 'rgba(255,255,255,0)',
    stroke: "#fff"
  }, (0, _omit.default)(nodeProps, ['children']), {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    "data-recharts-item-index": nodeProps.tooltipIndex
  })), arrow, text);
}
function ContentItemWithEvents(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var activeCoordinate = props.nodeProps ? {
    x: props.nodeProps.x + props.nodeProps.width / 2,
    y: props.nodeProps.y + props.nodeProps.height / 2
  } : null;
  var onMouseEnter = () => {
    dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
      activeIndex: props.nodeProps.tooltipIndex,
      activeDataKey: props.dataKey,
      activeCoordinate
    }));
  };
  var onMouseLeave = () => {
    // clearing state on mouseLeaveItem causes re-rendering issues
    // we don't actually want to do this for TreeMap - we clear state when we leave the entire chart instead
  };
  var onClick = () => {
    dispatch((0, _tooltipSlice.setActiveClickItemIndex)({
      activeIndex: props.nodeProps.tooltipIndex,
      activeDataKey: props.dataKey,
      activeCoordinate
    }));
  };
  return /*#__PURE__*/React.createElement(ContentItem, _extends({}, props, {
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onClick: onClick
  }));
}
function getTooltipEntrySettings(_ref3) {
  var {
    props,
    currentRoot
  } = _ref3;
  var {
    dataKey,
    nameKey,
    stroke,
    fill
  } = props;
  return {
    dataDefinedOnItem: currentRoot,
    positions: undefined,
    // TODO I think Treemap has the capability of computing positions and supporting defaultIndex? Except it doesn't yet
    settings: {
      stroke,
      strokeWidth: undefined,
      fill,
      dataKey,
      nameKey,
      name: undefined,
      // Each TreemapNode has its own name
      hide: false,
      type: undefined,
      color: fill,
      unit: ''
    }
  };
}

// Why is margin not a treemap prop? No clue. Probably it should be
var defaultTreemapMargin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
class TreemapWithState extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", _objectSpread({}, defaultState));
    _defineProperty(this, "handleAnimationEnd", () => {
      var {
        onAnimationEnd
      } = this.props;
      this.setState({
        isAnimationFinished: true
      });
      if (typeof onAnimationEnd === 'function') {
        onAnimationEnd();
      }
    });
    _defineProperty(this, "handleAnimationStart", () => {
      var {
        onAnimationStart
      } = this.props;
      this.setState({
        isAnimationFinished: false
      });
      if (typeof onAnimationStart === 'function') {
        onAnimationStart();
      }
    });
    _defineProperty(this, "handleTouchMove", (_state, e) => {
      var touchEvent = e.touches[0];
      var target = document.elementFromPoint(touchEvent.clientX, touchEvent.clientY);
      if (!target || !target.getAttribute) {
        return;
      }
      var itemIndex = target.getAttribute('data-recharts-item-index');
      var activeNode = treemapPayloadSearcher(this.state.formatRoot, itemIndex);
      if (!activeNode) {
        return;
      }
      var {
        dataKey,
        dispatch
      } = this.props;
      var activeCoordinate = {
        x: activeNode.x + activeNode.width / 2,
        y: activeNode.y + activeNode.height / 2
      };

      // Treemap does not support onTouchMove prop, but it could
      // onTouchMove?.(activeNode, Number(itemIndex), e);
      dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
        activeIndex: itemIndex,
        activeDataKey: dataKey,
        activeCoordinate
      }));
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.prevData || nextProps.type !== prevState.prevType || nextProps.width !== prevState.prevWidth || nextProps.height !== prevState.prevHeight || nextProps.dataKey !== prevState.prevDataKey || nextProps.aspectRatio !== prevState.prevAspectRatio) {
      var root = computeNode({
        depth: 0,
        // @ts-expect-error missing properties
        node: {
          children: nextProps.data,
          x: 0,
          y: 0,
          width: nextProps.width,
          height: nextProps.height
        },
        index: 0,
        dataKey: nextProps.dataKey,
        nameKey: nextProps.nameKey
      });
      var formatRoot = squarify(root, nextProps.aspectRatio);
      return _objectSpread(_objectSpread({}, prevState), {}, {
        formatRoot,
        currentRoot: root,
        nestIndex: [root],
        prevAspectRatio: nextProps.aspectRatio,
        prevData: nextProps.data,
        prevWidth: nextProps.width,
        prevHeight: nextProps.height,
        prevDataKey: nextProps.dataKey,
        prevType: nextProps.type
      });
    }
    return null;
  }
  handleMouseEnter(node, e) {
    e.persist();
    var {
      onMouseEnter
    } = this.props;
    if (onMouseEnter) {
      onMouseEnter(node, e);
    }
  }
  handleMouseLeave(node, e) {
    e.persist();
    var {
      onMouseLeave
    } = this.props;
    if (onMouseLeave) {
      onMouseLeave(node, e);
    }
  }
  handleClick(node) {
    var {
      onClick,
      type
    } = this.props;
    if (type === 'nest' && node.children) {
      var {
        width,
        height,
        dataKey,
        nameKey,
        aspectRatio
      } = this.props;
      var root = computeNode({
        depth: 0,
        node: _objectSpread(_objectSpread({}, node), {}, {
          x: 0,
          y: 0,
          width,
          height
        }),
        index: 0,
        dataKey,
        nameKey,
        // with Treemap nesting, should this continue nesting the index or start from empty string?
        nestedActiveTooltipIndex: node.tooltipIndex
      });
      var formatRoot = squarify(root, aspectRatio);
      var {
        nestIndex
      } = this.state;
      nestIndex.push(node);
      this.setState({
        formatRoot,
        currentRoot: root,
        nestIndex
      });
    }
    if (onClick) {
      onClick(node);
    }
  }
  handleNestIndex(node, i) {
    var {
      nestIndex
    } = this.state;
    var {
      width,
      height,
      dataKey,
      nameKey,
      aspectRatio
    } = this.props;
    var root = computeNode({
      depth: 0,
      node: _objectSpread(_objectSpread({}, node), {}, {
        x: 0,
        y: 0,
        width,
        height
      }),
      index: 0,
      dataKey,
      nameKey,
      // with Treemap nesting, should this continue nesting the index or start from empty string?
      nestedActiveTooltipIndex: node.tooltipIndex
    });
    var formatRoot = squarify(root, aspectRatio);
    nestIndex = nestIndex.slice(0, i + 1);
    this.setState({
      formatRoot,
      currentRoot: node,
      nestIndex
    });
  }
  renderItem(content, nodeProps, isLeaf) {
    var {
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      isUpdateAnimationActive,
      type,
      animationId,
      colorPanel,
      dataKey
    } = this.props;
    var {
      isAnimationFinished
    } = this.state;
    var {
      width,
      height,
      x,
      y,
      depth
    } = nodeProps;
    var translateX = parseInt("".concat((Math.random() * 2 - 1) * width), 10);
    var event = {};
    if (isLeaf || type === 'nest') {
      event = {
        onMouseEnter: this.handleMouseEnter.bind(this, nodeProps),
        onMouseLeave: this.handleMouseLeave.bind(this, nodeProps),
        onClick: this.handleClick.bind(this, nodeProps)
      };
    }
    if (!isAnimationActive) {
      return /*#__PURE__*/React.createElement(_Layer.Layer, event, /*#__PURE__*/React.createElement(ContentItemWithEvents, {
        content: content,
        dataKey: dataKey,
        nodeProps: _objectSpread(_objectSpread({}, nodeProps), {}, {
          isAnimationActive: false,
          isUpdateAnimationActive: false,
          width,
          height,
          x,
          y
        }),
        type: type,
        colorPanel: colorPanel
      }));
    }
    return /*#__PURE__*/React.createElement(_Animate.Animate, {
      begin: animationBegin,
      duration: animationDuration,
      isActive: isAnimationActive,
      easing: animationEasing,
      key: "treemap-".concat(animationId),
      from: {
        x,
        y,
        width,
        height
      },
      to: {
        x,
        y,
        width,
        height
      },
      onAnimationStart: this.handleAnimationStart,
      onAnimationEnd: this.handleAnimationEnd
    }, _ref4 => {
      var {
        x: currX,
        y: currY,
        width: currWidth,
        height: currHeight
      } = _ref4;
      return /*#__PURE__*/React.createElement(_Animate.Animate
      // @ts-expect-error TODO - fix the type error
      , {
        from: "translate(".concat(translateX, "px, ").concat(translateX, "px)")
        // @ts-expect-error TODO - fix the type error
        ,
        to: "translate(0, 0)",
        attributeName: "transform",
        begin: animationBegin,
        easing: animationEasing,
        isActive: isAnimationActive,
        duration: animationDuration
      }, /*#__PURE__*/React.createElement(_Layer.Layer, event, depth > 2 && !isAnimationFinished ? null : /*#__PURE__*/React.createElement(ContentItemWithEvents, {
        content: content,
        dataKey: dataKey,
        nodeProps: _objectSpread(_objectSpread({}, nodeProps), {}, {
          isAnimationActive,
          isUpdateAnimationActive: !isUpdateAnimationActive,
          width: currWidth,
          height: currHeight,
          x: currX,
          y: currY
        }),
        type: type,
        colorPanel: colorPanel
      })));
    });
  }
  renderNode(root, node) {
    var {
      content,
      type
    } = this.props;
    var nodeProps = _objectSpread(_objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(this.props, false)), node), {}, {
      root
    });
    var isLeaf = !node.children || !node.children.length;
    var {
      currentRoot
    } = this.state;
    var isCurrentRootChild = (currentRoot.children || []).filter(item => item.depth === node.depth && item.name === node.name);
    if (!isCurrentRootChild.length && root.depth && type === 'nest') {
      return null;
    }
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      key: "recharts-treemap-node-".concat(nodeProps.x, "-").concat(nodeProps.y, "-").concat(nodeProps.name),
      className: "recharts-treemap-depth-".concat(node.depth)
    }, this.renderItem(content, nodeProps, isLeaf), node.children && node.children.length ? node.children.map(child => this.renderNode(node, child)) : null);
  }
  renderAllNodes() {
    var {
      formatRoot
    } = this.state;
    if (!formatRoot) {
      return null;
    }
    return this.renderNode(formatRoot, formatRoot);
  }

  // render nest treemap
  renderNestIndex() {
    var {
      nameKey,
      nestIndexContent
    } = this.props;
    var {
      nestIndex
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: "recharts-treemap-nest-index-wrapper",
      style: {
        marginTop: '8px',
        textAlign: 'center'
      }
    }, nestIndex.map((item, i) => {
      // TODO need to verify nameKey type
      var name = (0, _get.default)(item, nameKey, 'root');
      var content = null;
      if (/*#__PURE__*/React.isValidElement(nestIndexContent)) {
        content = /*#__PURE__*/React.cloneElement(nestIndexContent, item, i);
      }
      if (typeof nestIndexContent === 'function') {
        content = nestIndexContent(item, i);
      } else {
        content = name;
      }
      return (
        /*#__PURE__*/
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        React.createElement("div", {
          onClick: this.handleNestIndex.bind(this, item, i),
          key: "nest-index-".concat((0, _DataUtils.uniqueId)()),
          className: "recharts-treemap-nest-index-box",
          style: {
            cursor: 'pointer',
            display: 'inline-block',
            padding: '0 7px',
            background: '#000',
            color: '#fff',
            marginRight: '3px'
          }
        }, content)
      );
    }));
  }
  render() {
    var _this$props = this.props,
      {
        width,
        height,
        className,
        style,
        children,
        type
      } = _this$props,
      others = _objectWithoutProperties(_this$props, _excluded);
    var attrs = (0, _ReactUtils.filterProps)(others, false);
    return /*#__PURE__*/React.createElement(_tooltipPortalContext.TooltipPortalContext.Provider, {
      value: this.state.tooltipPortal
    }, /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
      fn: getTooltipEntrySettings,
      args: {
        props: this.props,
        currentRoot: this.state.currentRoot
      }
    }), /*#__PURE__*/React.createElement(_RechartsWrapper.RechartsWrapper, {
      className: className,
      style: style,
      width: width,
      height: height,
      ref: node => {
        if (this.state.tooltipPortal == null) {
          this.setState({
            tooltipPortal: node
          });
        }
      },
      onMouseEnter: undefined,
      onMouseLeave: undefined,
      onClick: undefined,
      onMouseMove: undefined,
      onMouseDown: undefined,
      onMouseUp: undefined,
      onContextMenu: undefined,
      onDoubleClick: undefined,
      onTouchStart: undefined,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: undefined
    }, /*#__PURE__*/React.createElement(_Surface.Surface, _extends({}, attrs, {
      width: width,
      height: type === 'nest' ? height - 30 : height
    }), this.renderAllNodes(), children), type === 'nest' && this.renderNestIndex()));
  }
}
_defineProperty(TreemapWithState, "displayName", 'Treemap');
_defineProperty(TreemapWithState, "defaultProps", {
  aspectRatio: 0.5 * (1 + Math.sqrt(5)),
  dataKey: 'value',
  nameKey: 'name',
  type: 'flat',
  isAnimationActive: !_Global.Global.isSsr,
  isUpdateAnimationActive: !_Global.Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'linear'
});
function TreemapDispatchInject(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  return /*#__PURE__*/React.createElement(TreemapWithState, _extends({}, props, {
    dispatch: dispatch
  }));
}
function Treemap(props) {
  var _props$className;
  var {
    width,
    height
  } = props;
  if (!(0, _isWellBehavedNumber.isPositiveNumber)(width) || !(0, _isWellBehavedNumber.isPositiveNumber)(height)) {
    return null;
  }
  return /*#__PURE__*/React.createElement(_RechartsStoreProvider.RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_props$className = props.className) !== null && _props$className !== void 0 ? _props$className : 'Treemap'
  }, /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartSize, {
    width: width,
    height: height
  }), /*#__PURE__*/React.createElement(_chartLayoutContext.ReportChartMargin, {
    margin: defaultTreemapMargin
  }), /*#__PURE__*/React.createElement(TreemapDispatchInject, props));
}