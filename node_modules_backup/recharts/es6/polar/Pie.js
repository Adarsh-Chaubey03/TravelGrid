var _excluded = ["onMouseEnter", "onClick", "onMouseLeave"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { PureComponent, useCallback, useMemo, useRef, useState } from 'react';
import get from 'es-toolkit/compat/get';
import { clsx } from 'clsx';
import { selectPieLegend, selectPieSectors } from '../state/selectors/pieSelectors';
import { useAppSelector } from '../state/hooks';
import { SetPolarGraphicalItem } from '../state/SetGraphicalItem';
import { Layer } from '../container/Layer';
import { Curve } from '../shape/Curve';
import { Text } from '../component/Text';
import { Cell } from '../component/Cell';
import { filterProps, findAllByType } from '../util/ReactUtils';
import { Global } from '../util/Global';
import { getMaxRadius, polarToCartesian } from '../util/PolarUtils';
import { getPercentValue, interpolateNumber, isNumber, mathSign, uniqueId } from '../util/DataUtils';
import { getTooltipNameProp, getValueByDataKey } from '../util/ChartUtils';
import { adaptEventsOfChild } from '../util/types';
import { Shape } from '../util/ActiveShapeUtils';
import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors';
import { SetPolarLegendPayload } from '../state/SetLegendPayload';
import { DATA_ITEM_DATAKEY_ATTRIBUTE_NAME, DATA_ITEM_INDEX_ATTRIBUTE_NAME } from '../util/Constants';
import { useAnimationId } from '../util/useAnimationId';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { Animate } from '../animation/Animate';

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

function SetPiePayloadLegend(props) {
  var presentationProps = useMemo(() => filterProps(props, false), [props]);
  var cells = useMemo(() => findAllByType(props.children, Cell), [props.children]);
  var pieSettings = useMemo(() => ({
    name: props.name,
    nameKey: props.nameKey,
    tooltipType: props.tooltipType,
    data: props.data,
    dataKey: props.dataKey,
    cx: props.cx,
    cy: props.cy,
    startAngle: props.startAngle,
    endAngle: props.endAngle,
    minAngle: props.minAngle,
    paddingAngle: props.paddingAngle,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    cornerRadius: props.cornerRadius,
    legendType: props.legendType,
    fill: props.fill,
    presentationProps
  }), [props.cornerRadius, props.cx, props.cy, props.data, props.dataKey, props.endAngle, props.innerRadius, props.minAngle, props.name, props.nameKey, props.outerRadius, props.paddingAngle, props.startAngle, props.tooltipType, props.legendType, props.fill, presentationProps]);
  var legendPayload = useAppSelector(state => selectPieLegend(state, pieSettings, cells));
  return /*#__PURE__*/React.createElement(SetPolarLegendPayload, {
    legendPayload: legendPayload
  });
}
function getTooltipEntrySettings(props) {
  var {
    dataKey,
    nameKey,
    sectors,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    tooltipType
  } = props;
  return {
    dataDefinedOnItem: sectors === null || sectors === void 0 ? void 0 : sectors.map(p => p.tooltipPayload),
    positions: sectors === null || sectors === void 0 ? void 0 : sectors.map(p => p.tooltipPosition),
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: fill,
      unit: '' // why doesn't Pie support unit?
    }
  };
}
var getTextAnchor = (x, cx) => {
  if (x > cx) {
    return 'start';
  }
  if (x < cx) {
    return 'end';
  }
  return 'middle';
};
var getOuterRadius = (dataPoint, outerRadius, maxPieRadius) => {
  if (typeof outerRadius === 'function') {
    return outerRadius(dataPoint);
  }
  return getPercentValue(outerRadius, maxPieRadius, maxPieRadius * 0.8);
};
var parseCoordinateOfPie = (item, offset, dataPoint) => {
  var {
    top,
    left,
    width,
    height
  } = offset;
  var maxPieRadius = getMaxRadius(width, height);
  var cx = left + getPercentValue(item.cx, width, width / 2);
  var cy = top + getPercentValue(item.cy, height, height / 2);
  var innerRadius = getPercentValue(item.innerRadius, maxPieRadius, 0);
  var outerRadius = getOuterRadius(dataPoint, item.outerRadius, maxPieRadius);
  var maxRadius = item.maxRadius || Math.sqrt(width * width + height * height) / 2;
  return {
    cx,
    cy,
    innerRadius,
    outerRadius,
    maxRadius
  };
};
var parseDeltaAngle = (startAngle, endAngle) => {
  var sign = mathSign(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  return sign * deltaAngle;
};
var renderLabelLineItem = (option, props) => {
  if (/*#__PURE__*/React.isValidElement(option)) {
    return /*#__PURE__*/React.cloneElement(option, props);
  }
  if (typeof option === 'function') {
    return option(props);
  }
  var className = clsx('recharts-pie-label-line', typeof option !== 'boolean' ? option.className : '');
  return /*#__PURE__*/React.createElement(Curve, _extends({}, props, {
    type: "linear",
    className: className
  }));
};
var renderLabelItem = (option, props, value) => {
  if (/*#__PURE__*/React.isValidElement(option)) {
    return /*#__PURE__*/React.cloneElement(option, props);
  }
  var label = value;
  if (typeof option === 'function') {
    label = option(props);
    if (/*#__PURE__*/React.isValidElement(label)) {
      return label;
    }
  }
  var className = clsx('recharts-pie-label-text', typeof option !== 'boolean' && typeof option !== 'function' ? option.className : '');
  return /*#__PURE__*/React.createElement(Text, _extends({}, props, {
    alignmentBaseline: "middle",
    className: className
  }), label);
};
function PieLabels(_ref) {
  var {
    sectors,
    props,
    showLabels
  } = _ref;
  var {
    label,
    labelLine,
    dataKey
  } = props;
  if (!showLabels || !label || !sectors) {
    return null;
  }
  var pieProps = filterProps(props, false);
  var customLabelProps = filterProps(label, false);
  var customLabelLineProps = filterProps(labelLine, false);
  var offsetRadius = typeof label === 'object' && 'offsetRadius' in label && label.offsetRadius || 20;
  var labels = sectors.map((entry, i) => {
    var midAngle = (entry.startAngle + entry.endAngle) / 2;
    var endPoint = polarToCartesian(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
    var labelProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
      stroke: 'none'
    }, customLabelProps), {}, {
      index: i,
      textAnchor: getTextAnchor(endPoint.x, entry.cx)
    }, endPoint);
    var lineProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
      fill: 'none',
      stroke: entry.fill
    }, customLabelLineProps), {}, {
      index: i,
      points: [polarToCartesian(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint],
      key: 'line'
    });
    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/no-array-index-key
      React.createElement(Layer, {
        key: "label-".concat(entry.startAngle, "-").concat(entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
      }, labelLine && renderLabelLineItem(labelLine, lineProps), renderLabelItem(label, labelProps, getValueByDataKey(entry, dataKey)))
    );
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-pie-labels"
  }, labels);
}
function PieSectors(props) {
  var {
    sectors,
    activeShape,
    inactiveShape: inactiveShapeProp,
    allOtherPieProps,
    showLabels
  } = props;
  var activeIndex = useAppSelector(selectActiveTooltipIndex);
  var {
      onMouseEnter: onMouseEnterFromProps,
      onClick: onItemClickFromProps,
      onMouseLeave: onMouseLeaveFromProps
    } = allOtherPieProps,
    restOfAllOtherProps = _objectWithoutProperties(allOtherPieProps, _excluded);
  var onMouseEnterFromContext = useMouseEnterItemDispatch(onMouseEnterFromProps, allOtherPieProps.dataKey);
  var onMouseLeaveFromContext = useMouseLeaveItemDispatch(onMouseLeaveFromProps);
  var onClickFromContext = useMouseClickItemDispatch(onItemClickFromProps, allOtherPieProps.dataKey);
  if (sectors == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, sectors.map((entry, i) => {
    if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1) return null;
    var isSectorActive = activeShape && String(i) === activeIndex;
    var inactiveShape = activeIndex ? inactiveShapeProp : null;
    var sectorOptions = isSectorActive ? activeShape : inactiveShape;
    var sectorProps = _objectSpread(_objectSpread({}, entry), {}, {
      stroke: entry.stroke,
      tabIndex: -1,
      [DATA_ITEM_INDEX_ATTRIBUTE_NAME]: i,
      [DATA_ITEM_DATAKEY_ATTRIBUTE_NAME]: allOtherPieProps.dataKey
    });
    return /*#__PURE__*/React.createElement(Layer, _extends({
      tabIndex: -1,
      className: "recharts-pie-sector"
    }, adaptEventsOfChild(restOfAllOtherProps, entry, i), {
      // @ts-expect-error the types need a bit of attention
      onMouseEnter: onMouseEnterFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onMouseLeave: onMouseLeaveFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onClick: onClickFromContext(entry, i)
      // eslint-disable-next-line react/no-array-index-key
      ,
      key: "sector-".concat(entry === null || entry === void 0 ? void 0 : entry.startAngle, "-").concat(entry === null || entry === void 0 ? void 0 : entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
    }), /*#__PURE__*/React.createElement(Shape, _extends({
      option: sectorOptions,
      isActive: isSectorActive,
      shapeType: "sector"
    }, sectorProps)));
  }), /*#__PURE__*/React.createElement(PieLabels, {
    sectors: sectors,
    props: allOtherPieProps,
    showLabels: showLabels
  }));
}
export function computePieSectors(_ref2) {
  var _pieSettings$paddingA;
  var {
    pieSettings,
    displayedData,
    cells,
    offset
  } = _ref2;
  var {
    cornerRadius,
    startAngle,
    endAngle,
    dataKey,
    nameKey,
    tooltipType
  } = pieSettings;
  var minAngle = Math.abs(pieSettings.minAngle);
  var deltaAngle = parseDeltaAngle(startAngle, endAngle);
  var absDeltaAngle = Math.abs(deltaAngle);
  var paddingAngle = displayedData.length <= 1 ? 0 : (_pieSettings$paddingA = pieSettings.paddingAngle) !== null && _pieSettings$paddingA !== void 0 ? _pieSettings$paddingA : 0;
  var notZeroItemCount = displayedData.filter(entry => getValueByDataKey(entry, dataKey, 0) !== 0).length;
  var totalPaddingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
  var realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPaddingAngle;
  var sum = displayedData.reduce((result, entry) => {
    var val = getValueByDataKey(entry, dataKey, 0);
    return result + (isNumber(val) ? val : 0);
  }, 0);
  var sectors;
  if (sum > 0) {
    var prev;
    sectors = displayedData.map((entry, i) => {
      var val = getValueByDataKey(entry, dataKey, 0);
      var name = getValueByDataKey(entry, nameKey, i);
      var coordinate = parseCoordinateOfPie(pieSettings, offset, entry);
      var percent = (isNumber(val) ? val : 0) / sum;
      var tempStartAngle;
      var entryWithCellInfo = _objectSpread(_objectSpread({}, entry), cells && cells[i] && cells[i].props);
      if (i) {
        tempStartAngle = prev.endAngle + mathSign(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
      } else {
        tempStartAngle = startAngle;
      }
      var tempEndAngle = tempStartAngle + mathSign(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
      var midAngle = (tempStartAngle + tempEndAngle) / 2;
      var middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
      var tooltipPayload = [{
        // @ts-expect-error getValueByDataKey does not validate the output type
        name,
        // @ts-expect-error getValueByDataKey does not validate the output type
        value: val,
        payload: entryWithCellInfo,
        dataKey,
        type: tooltipType
      }];
      var tooltipPosition = polarToCartesian(coordinate.cx, coordinate.cy, middleRadius, midAngle);
      prev = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieSettings.presentationProps), {}, {
        percent,
        cornerRadius,
        name,
        tooltipPayload,
        midAngle,
        middleRadius,
        tooltipPosition
      }, entryWithCellInfo), coordinate), {}, {
        value: getValueByDataKey(entry, dataKey),
        startAngle: tempStartAngle,
        endAngle: tempEndAngle,
        payload: entryWithCellInfo,
        paddingAngle: mathSign(deltaAngle) * paddingAngle
      });
      return prev;
    });
  }
  return sectors;
}
function SectorsWithAnimation(_ref3) {
  var {
    props,
    previousSectorsRef
  } = _ref3;
  var {
    sectors,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    activeShape,
    inactiveShape,
    onAnimationStart,
    onAnimationEnd
  } = props;
  var animationId = useAnimationId(props, 'recharts-pie-');
  var prevSectors = previousSectorsRef.current;
  var [isAnimating, setIsAnimating] = useState(true);
  var handleAnimationEnd = useCallback(() => {
    if (typeof onAnimationEnd === 'function') {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = useCallback(() => {
    if (typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  return /*#__PURE__*/React.createElement(Animate, {
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    from: {
      t: 0
    },
    to: {
      t: 1
    },
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    key: animationId
  }, _ref4 => {
    var {
      t
    } = _ref4;
    var stepData = [];
    var first = sectors && sectors[0];
    var curAngle = first.startAngle;
    sectors.forEach((entry, index) => {
      var prev = prevSectors && prevSectors[index];
      var paddingAngle = index > 0 ? get(entry, 'paddingAngle', 0) : 0;
      if (prev) {
        var angleIp = interpolateNumber(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle);
        var latest = _objectSpread(_objectSpread({}, entry), {}, {
          startAngle: curAngle + paddingAngle,
          endAngle: curAngle + angleIp(t) + paddingAngle
        });
        stepData.push(latest);
        curAngle = latest.endAngle;
      } else {
        var {
          endAngle,
          startAngle
        } = entry;
        var interpolatorAngle = interpolateNumber(0, endAngle - startAngle);
        var deltaAngle = interpolatorAngle(t);
        var _latest = _objectSpread(_objectSpread({}, entry), {}, {
          startAngle: curAngle + paddingAngle,
          endAngle: curAngle + deltaAngle + paddingAngle
        });
        stepData.push(_latest);
        curAngle = _latest.endAngle;
      }
    });

    // eslint-disable-next-line no-param-reassign
    previousSectorsRef.current = stepData;
    return /*#__PURE__*/React.createElement(Layer, null, /*#__PURE__*/React.createElement(PieSectors, {
      sectors: stepData,
      activeShape: activeShape,
      inactiveShape: inactiveShape,
      allOtherPieProps: props,
      showLabels: !isAnimating
    }));
  });
}
function RenderSectors(props) {
  var {
    sectors,
    isAnimationActive,
    activeShape,
    inactiveShape
  } = props;
  var previousSectorsRef = useRef(null);
  var prevSectors = previousSectorsRef.current;
  if (isAnimationActive && sectors && sectors.length && (!prevSectors || prevSectors !== sectors)) {
    return /*#__PURE__*/React.createElement(SectorsWithAnimation, {
      props: props,
      previousSectorsRef: previousSectorsRef
    });
  }
  return /*#__PURE__*/React.createElement(PieSectors, {
    sectors: sectors,
    activeShape: activeShape,
    inactiveShape: inactiveShape,
    allOtherPieProps: props,
    showLabels: true
  });
}
function PieWithTouchMove(props) {
  var {
    hide,
    className,
    rootTabIndex
  } = props;
  var layerClass = clsx('recharts-pie', className);
  if (hide) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Layer, {
    tabIndex: rootTabIndex,
    className: layerClass
  }, /*#__PURE__*/React.createElement(RenderSectors, props));
}
var defaultPieProps = {
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: 'ease',
  cx: '50%',
  cy: '50%',
  dataKey: 'value',
  endAngle: 360,
  fill: '#808080',
  hide: false,
  innerRadius: 0,
  isAnimationActive: !Global.isSsr,
  labelLine: true,
  legendType: 'rect',
  minAngle: 0,
  nameKey: 'name',
  outerRadius: '80%',
  paddingAngle: 0,
  rootTabIndex: 0,
  startAngle: 0,
  stroke: '#fff'
};
function PieImpl(props) {
  var propsWithDefaults = resolveDefaultProps(props, defaultPieProps);
  var cells = useMemo(() => findAllByType(props.children, Cell), [props.children]);
  var presentationProps = filterProps(propsWithDefaults, false);
  var pieSettings = useMemo(() => ({
    name: propsWithDefaults.name,
    nameKey: propsWithDefaults.nameKey,
    tooltipType: propsWithDefaults.tooltipType,
    data: propsWithDefaults.data,
    dataKey: propsWithDefaults.dataKey,
    cx: propsWithDefaults.cx,
    cy: propsWithDefaults.cy,
    startAngle: propsWithDefaults.startAngle,
    endAngle: propsWithDefaults.endAngle,
    minAngle: propsWithDefaults.minAngle,
    paddingAngle: propsWithDefaults.paddingAngle,
    innerRadius: propsWithDefaults.innerRadius,
    outerRadius: propsWithDefaults.outerRadius,
    cornerRadius: propsWithDefaults.cornerRadius,
    legendType: propsWithDefaults.legendType,
    fill: propsWithDefaults.fill,
    presentationProps
  }), [propsWithDefaults.cornerRadius, propsWithDefaults.cx, propsWithDefaults.cy, propsWithDefaults.data, propsWithDefaults.dataKey, propsWithDefaults.endAngle, propsWithDefaults.innerRadius, propsWithDefaults.minAngle, propsWithDefaults.name, propsWithDefaults.nameKey, propsWithDefaults.outerRadius, propsWithDefaults.paddingAngle, propsWithDefaults.startAngle, propsWithDefaults.tooltipType, propsWithDefaults.legendType, propsWithDefaults.fill, presentationProps]);
  var sectors = useAppSelector(state => selectPieSectors(state, pieSettings, cells));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
    fn: getTooltipEntrySettings,
    args: _objectSpread(_objectSpread({}, propsWithDefaults), {}, {
      sectors
    })
  }), /*#__PURE__*/React.createElement(PieWithTouchMove, _extends({}, propsWithDefaults, {
    sectors: sectors
  })));
}
export class Pie extends PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "id", uniqueId('recharts-pie-'));
  }
  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetPolarGraphicalItem, {
      data: this.props.data,
      dataKey: this.props.dataKey,
      hide: this.props.hide,
      angleAxisId: 0,
      radiusAxisId: 0,
      stackId: undefined,
      barSize: undefined,
      type: "pie"
    }), /*#__PURE__*/React.createElement(SetPiePayloadLegend, this.props), /*#__PURE__*/React.createElement(PieImpl, this.props), this.props.children);
  }
}
_defineProperty(Pie, "displayName", 'Pie');
_defineProperty(Pie, "defaultProps", defaultPieProps);