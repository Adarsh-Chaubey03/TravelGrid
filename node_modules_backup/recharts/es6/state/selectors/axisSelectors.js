function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { createSelector } from 'reselect';
import range from 'es-toolkit/compat/range';
import * as d3Scales from 'victory-vendor/d3-scale';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { checkDomainOfScale, getDomainOfStackGroups, getStackedData, getValueByDataKey, isCategoricalAxis } from '../../util/ChartUtils';
import { selectChartDataWithIndexes, selectChartDataWithIndexesIfNotInPanorama } from './dataSelectors';
import { isWellFormedNumberDomain, numericalDomainSpecifiedWithoutRequiringData, parseNumericalUserDomain } from '../../util/isDomainSpecifiedByUser';
import { getPercentValue, hasDuplicate, isNan, isNumber, isNumOrStr, mathSign, upperFirst } from '../../util/DataUtils';
import { isWellBehavedNumber } from '../../util/isWellBehavedNumber';
import { getNiceTickValues, getTickValuesFixedDomain } from '../../util/scale';
import { selectChartHeight, selectChartWidth } from './containerSelectors';
import { selectAllXAxes, selectAllYAxes } from './selectAllAxes';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
import { selectBrushDimensions, selectBrushSettings } from './brushSelectors';
import { selectBarCategoryGap, selectChartName, selectStackOffsetType } from './rootPropsSelectors';
import { selectAngleAxis, selectAngleAxisRange, selectRadiusAxis, selectRadiusAxisRange } from './polarAxisSelectors';
import { pickAxisType } from './pickAxisType';
import { pickAxisId } from './pickAxisId';
import { combineAxisRangeWithReverse } from './combiners/combineAxisRangeWithReverse';
import { DEFAULT_Y_AXIS_WIDTH } from '../../util/Constants';
var defaultNumericDomain = [0, 'auto'];

/**
 * angle, radius, X, Y, and Z axes all have domain and range and scale and associated settings
 */

/**
 * X and Y axes have ticks. Z axis is never displayed and so it lacks ticks
 * and tick settings.
 */

/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
export var implicitXAxis = {
  allowDataOverflow: false,
  allowDecimals: true,
  allowDuplicatedCategory: true,
  angle: 0,
  dataKey: undefined,
  domain: undefined,
  height: 30,
  hide: true,
  id: 0,
  includeHidden: false,
  interval: 'preserveEnd',
  minTickGap: 5,
  mirror: false,
  name: undefined,
  orientation: 'bottom',
  padding: {
    left: 0,
    right: 0
  },
  reversed: false,
  scale: 'auto',
  tick: true,
  tickCount: 5,
  tickFormatter: undefined,
  ticks: undefined,
  type: 'category',
  unit: undefined
};
export var selectXAxisSettings = (state, axisId) => {
  var axis = state.cartesianAxis.xAxis[axisId];
  if (axis == null) {
    return implicitXAxis;
  }
  return axis;
};

/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
export var implicitYAxis = {
  allowDataOverflow: false,
  allowDecimals: true,
  allowDuplicatedCategory: true,
  angle: 0,
  dataKey: undefined,
  domain: defaultNumericDomain,
  hide: true,
  id: 0,
  includeHidden: false,
  interval: 'preserveEnd',
  minTickGap: 5,
  mirror: false,
  name: undefined,
  orientation: 'left',
  padding: {
    top: 0,
    bottom: 0
  },
  reversed: false,
  scale: 'auto',
  tick: true,
  tickCount: 5,
  tickFormatter: undefined,
  ticks: undefined,
  type: 'number',
  unit: undefined,
  width: DEFAULT_Y_AXIS_WIDTH
};
export var selectYAxisSettings = (state, axisId) => {
  var axis = state.cartesianAxis.yAxis[axisId];
  if (axis == null) {
    return implicitYAxis;
  }
  return axis;
};
export var implicitZAxis = {
  domain: [0, 'auto'],
  includeHidden: false,
  reversed: false,
  allowDataOverflow: false,
  allowDuplicatedCategory: false,
  dataKey: undefined,
  id: 0,
  name: '',
  range: [64, 64],
  scale: 'auto',
  type: 'number',
  unit: ''
};
export var selectZAxisSettings = (state, axisId) => {
  var axis = state.cartesianAxis.zAxis[axisId];
  if (axis == null) {
    return implicitZAxis;
  }
  return axis;
};
export var selectBaseAxis = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    case 'zAxis':
      {
        return selectZAxisSettings(state, axisId);
      }
    case 'angleAxis':
      {
        return selectAngleAxis(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxis(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};
var selectCartesianAxisSettings = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};

/**
 * Selects either an X or Y axis. Doesn't work with Z axis - for that, instead use selectBaseAxis.
 * @param state Root state
 * @param axisType xAxis | yAxis
 * @param axisId xAxisId | yAxisId
 * @returns axis settings object
 */
export var selectAxisSettings = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    case 'angleAxis':
      {
        return selectAngleAxis(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxis(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};

/**
 * @param state RechartsRootState
 * @return boolean true if there is at least one Bar or RadialBar
 */
export var selectHasBar = state => state.graphicalItems.countOfBars > 0;

/**
 * Filters CartesianGraphicalItemSettings by the relevant axis ID
 * @param axisType 'xAxis' | 'yAxis' | 'zAxis' | 'radiusAxis' | 'angleAxis'
 * @param axisId from props, defaults to 0
 *
 * @returns Predicate function that return true for CartesianGraphicalItemSettings that are relevant to the specified axis
 */
export function itemAxisPredicate(axisType, axisId) {
  return item => {
    switch (axisType) {
      case 'xAxis':
        // This is sensitive to the data type, as 0 !== '0'. I wonder if we should be more flexible. How does 2.x branch behave? TODO write test for that
        return 'xAxisId' in item && item.xAxisId === axisId;
      case 'yAxis':
        return 'yAxisId' in item && item.yAxisId === axisId;
      case 'zAxis':
        return 'zAxisId' in item && item.zAxisId === axisId;
      case 'angleAxis':
        return 'angleAxisId' in item && item.angleAxisId === axisId;
      case 'radiusAxis':
        return 'radiusAxisId' in item && item.radiusAxisId === axisId;
      default:
        return false;
    }
  };
}
export var selectUnfilteredCartesianItems = state => state.graphicalItems.cartesianItems;
var selectAxisPredicate = createSelector([pickAxisType, pickAxisId], itemAxisPredicate);
export var combineGraphicalItemsSettings = (graphicalItems, axisSettings, axisPredicate) => graphicalItems.filter(axisPredicate).filter(item => {
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.includeHidden) === true) {
    return true;
  }
  return !item.hide;
});
export var selectCartesianItemsSettings = createSelector([selectUnfilteredCartesianItems, selectBaseAxis, selectAxisPredicate], combineGraphicalItemsSettings);
export var filterGraphicalNotStackedItems = cartesianItems => cartesianItems.filter(item => item.stackId === undefined);
var selectCartesianItemsSettingsExceptStacked = createSelector([selectCartesianItemsSettings], filterGraphicalNotStackedItems);
export var combineGraphicalItemsData = cartesianItems => cartesianItems.map(item => item.data).filter(Boolean).flat(1);

/**
 * This is a "cheap" selector - it returns the data but doesn't iterate them, so it is not sensitive on the array length.
 * Also does not apply dataKey yet.
 * @param state RechartsRootState
 * @returns data defined on the chart graphical items, such as Line or Scatter or Pie, and filtered with appropriate dataKey
 */
export var selectCartesianGraphicalItemsData = createSelector([selectCartesianItemsSettings], combineGraphicalItemsData);
export var combineDisplayedData = (graphicalItemsData, _ref) => {
  var {
    chartData = [],
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (graphicalItemsData.length > 0) {
    /*
     * There is no slicing when data is defined on graphical items. Why?
     * Because Brush ignores data defined on graphical items,
     * and does not render.
     * So Brush will never show up in a Scatter chart for example.
     * This is something we will need to fix.
     *
     * Now, when the root chart data is not defined, the dataEndIndex is 0,
     * which means the itemsData will be sliced to an empty array anyway.
     * But that's an implementation detail, and we can fix that too.
     *
     * Also, in absence of Axis dataKey, we use the dataKey from each item, respectively.
     * This is the usual pattern for numerical axis, that is the one where bars go up:
     * users don't specify any dataKey by default and expect the axis to "just match the data".
     */
    return graphicalItemsData;
  }
  return chartData.slice(dataStartIndex, dataEndIndex + 1);
};

/**
 * This selector will return all data there is in the chart: graphical items, chart root, all together.
 * Useful for figuring out an axis domain (because that needs to know of everything),
 * not useful for rendering individual graphical elements (because they need to know which data is theirs and which is not).
 *
 * This function will discard the original indexes, so it is also not useful for anything that depends on ordering.
 */
export var selectDisplayedData = createSelector([selectCartesianGraphicalItemsData, selectChartDataWithIndexesIfNotInPanorama], combineDisplayedData);
export var combineAppliedValues = (data, axisSettings, items) => {
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: getValueByDataKey(item, axisSettings.dataKey)
    }));
  }
  if (items.length > 0) {
    return items.map(item => item.dataKey).flatMap(dataKey => data.map(entry => ({
      value: getValueByDataKey(entry, dataKey)
    })));
  }
  return data.map(entry => ({
    value: entry
  }));
};

/**
 * This selector will return all values with the appropriate dataKey applied on them.
 * Which dataKey is appropriate depends on where it is defined.
 *
 * This is an expensive selector - it will iterate all data and compute their value using the provided dataKey.
 */
export var selectAllAppliedValues = createSelector([selectDisplayedData, selectBaseAxis, selectCartesianItemsSettings], combineAppliedValues);
export function isErrorBarRelevantForAxisType(axisType, errorBar) {
  switch (axisType) {
    case 'xAxis':
      return errorBar.direction === 'x';
    case 'yAxis':
      return errorBar.direction === 'y';
    default:
      return false;
  }
}

/**
 * This is type of "error" in chart. It is set by using ErrorBar, and it can represent confidence interval,
 * or gap in the data, or standard deviation, or quartiles in boxplot, or whiskers or whatever.
 *
 * We will internally represent it as a tuple of two numbers, where the first number is the lower bound and the second number is the upper bound.
 *
 * It is also true that the first number should be lower than or equal to the associated "main value",
 * and the second number should be higher than or equal to the associated "main value".
 */

export function fromMainValueToError(value) {
  if (isNumber(value) && Number.isFinite(value)) {
    return [value, value];
  }
  if (Array.isArray(value)) {
    var minError = Math.min(...value);
    var maxError = Math.max(...value);
    if (!isNan(minError) && !isNan(maxError) && Number.isFinite(minError) && Number.isFinite(maxError)) {
      return [minError, maxError];
    }
  }
  return undefined;
}
function onlyAllowNumbers(data) {
  return data.filter(v => isNumOrStr(v) || v instanceof Date).map(Number).filter(n => isNan(n) === false);
}

/**
 * @param entry One item in the 'data' array. Could be anything really - this is defined externally. This is the raw, before dataKey application
 * @param appliedValue This is the result of applying the 'main' dataKey on the `entry`.
 * @param relevantErrorBars Error bars that are relevant for the current axis and layout and all that.
 * @return either undefined or an array of ErrorValue
 */
export function getErrorDomainByDataKey(entry, appliedValue, relevantErrorBars) {
  if (!relevantErrorBars || typeof appliedValue !== 'number' || isNan(appliedValue)) {
    return [];
  }
  if (!relevantErrorBars.length) {
    return [];
  }
  return onlyAllowNumbers(relevantErrorBars.flatMap(eb => {
    var errorValue = getValueByDataKey(entry, eb.dataKey);
    var lowBound, highBound;
    if (Array.isArray(errorValue)) {
      [lowBound, highBound] = errorValue;
    } else {
      lowBound = highBound = errorValue;
    }
    if (!isWellBehavedNumber(lowBound) || !isWellBehavedNumber(highBound)) {
      return undefined;
    }
    return [appliedValue - lowBound, appliedValue + highBound];
  }));
}
export var combineStackGroups = (displayedData, items, stackOffsetType) => {
  var initialItemsGroups = {};
  var itemsGroup = items.reduce((acc, item) => {
    if (item.stackId == null) {
      return acc;
    }
    if (acc[item.stackId] == null) {
      acc[item.stackId] = [];
    }
    acc[item.stackId].push(item);
    return acc;
  }, initialItemsGroups);
  return Object.fromEntries(Object.entries(itemsGroup).map(_ref2 => {
    var [stackId, graphicalItems] = _ref2;
    var dataKeys = graphicalItems.map(i => i.dataKey);
    return [stackId, {
      // @ts-expect-error getStackedData requires that the input is array of objects, Recharts does not test for that
      stackedData: getStackedData(displayedData, dataKeys, stackOffsetType),
      graphicalItems
    }];
  }));
};
/**
 * Stack groups are groups of graphical items that stack on each other.
 * Stack is a function of axis type (X, Y), axis ID, and stack ID.
 * Graphical items that do not have a stack ID are not going to be present in stack groups.
 */
export var selectStackGroups = createSelector([selectDisplayedData, selectCartesianItemsSettings, selectStackOffsetType], combineStackGroups);
export var combineDomainOfStackGroups = (stackGroups, _ref3, axisType) => {
  var {
    dataStartIndex,
    dataEndIndex
  } = _ref3;
  if (axisType === 'zAxis') {
    // ZAxis ignores stacks
    return undefined;
  }
  var domainOfStackGroups = getDomainOfStackGroups(stackGroups, dataStartIndex, dataEndIndex);
  if (domainOfStackGroups != null && domainOfStackGroups[0] === 0 && domainOfStackGroups[1] === 0) {
    return undefined;
  }
  return domainOfStackGroups;
};
export var selectDomainOfStackGroups = createSelector([selectStackGroups, selectChartDataWithIndexes, pickAxisType], combineDomainOfStackGroups);
export var combineAppliedNumericalValuesIncludingErrorValues = (data, axisSettings, items, axisType) => {
  if (items.length > 0) {
    return data.flatMap(entry => {
      return items.flatMap(item => {
        var _item$errorBars, _axisSettings$dataKey;
        var relevantErrorBars = (_item$errorBars = item.errorBars) === null || _item$errorBars === void 0 ? void 0 : _item$errorBars.filter(errorBar => isErrorBarRelevantForAxisType(axisType, errorBar));
        var valueByDataKey = getValueByDataKey(entry, (_axisSettings$dataKey = axisSettings.dataKey) !== null && _axisSettings$dataKey !== void 0 ? _axisSettings$dataKey : item.dataKey);
        return {
          value: valueByDataKey,
          errorDomain: getErrorDomainByDataKey(entry, valueByDataKey, relevantErrorBars)
        };
      });
    }).filter(Boolean);
  }
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: getValueByDataKey(item, axisSettings.dataKey),
      errorDomain: []
    }));
  }
  return data.map(entry => ({
    value: entry,
    errorDomain: []
  }));
};
export var selectAllAppliedNumericalValuesIncludingErrorValues = createSelector(selectDisplayedData, selectBaseAxis, selectCartesianItemsSettingsExceptStacked, pickAxisType, combineAppliedNumericalValuesIncludingErrorValues);
function onlyAllowNumbersAndStringsAndDates(item) {
  var {
    value
  } = item;
  if (isNumOrStr(value) || value instanceof Date) {
    return value;
  }
  return undefined;
}
var computeNumericalDomain = dataWithErrorDomains => {
  var allDataSquished = dataWithErrorDomains
  // This flatMap has to be flat because we're creating a new array in the return value
  .flatMap(d => [d.value, d.errorDomain])
  // This flat is needed because a) errorDomain is an array, and b) value may be a number, or it may be a range (for Area, for example)
  .flat(1);
  var onlyNumbers = onlyAllowNumbers(allDataSquished);
  if (onlyNumbers.length === 0) {
    return undefined;
  }
  return [Math.min(...onlyNumbers), Math.max(...onlyNumbers)];
};
var computeDomainOfTypeCategory = (allDataSquished, axisSettings, isCategorical) => {
  var categoricalDomain = allDataSquished.map(onlyAllowNumbersAndStringsAndDates).filter(v => v != null);
  if (isCategorical && (axisSettings.dataKey == null || axisSettings.allowDuplicatedCategory && hasDuplicate(categoricalDomain))) {
    /*
     * 1. In an absence of dataKey, Recharts will use array indexes as its categorical domain
     * 2. When category axis has duplicated text, serial numbers are used to generate scale
     */
    return range(0, allDataSquished.length);
  }
  if (axisSettings.allowDuplicatedCategory) {
    return categoricalDomain;
  }
  return Array.from(new Set(categoricalDomain));
};
export var getDomainDefinition = axisSettings => {
  var _axisSettings$domain;
  if (axisSettings == null || !('domain' in axisSettings)) {
    return defaultNumericDomain;
  }
  if (axisSettings.domain != null) {
    return axisSettings.domain;
  }
  if (axisSettings.ticks != null) {
    if (axisSettings.type === 'number') {
      var allValues = onlyAllowNumbers(axisSettings.ticks);
      return [Math.min(...allValues), Math.max(...allValues)];
    }
    if (axisSettings.type === 'category') {
      return axisSettings.ticks.map(String);
    }
  }
  return (_axisSettings$domain = axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.domain) !== null && _axisSettings$domain !== void 0 ? _axisSettings$domain : defaultNumericDomain;
};
export var mergeDomains = function mergeDomains() {
  for (var _len = arguments.length, domains = new Array(_len), _key = 0; _key < _len; _key++) {
    domains[_key] = arguments[_key];
  }
  var allDomains = domains.filter(Boolean);
  if (allDomains.length === 0) {
    return undefined;
  }
  var allValues = allDomains.flat();
  var min = Math.min(...allValues);
  var max = Math.max(...allValues);
  return [min, max];
};
export var selectReferenceDots = state => state.referenceElements.dots;
export var filterReferenceElements = (elements, axisType, axisId) => {
  return elements.filter(el => el.ifOverflow === 'extendDomain').filter(el => {
    if (axisType === 'xAxis') {
      return el.xAxisId === axisId;
    }
    return el.yAxisId === axisId;
  });
};
export var selectReferenceDotsByAxis = createSelector([selectReferenceDots, pickAxisType, pickAxisId], filterReferenceElements);
export var selectReferenceAreas = state => state.referenceElements.areas;
export var selectReferenceAreasByAxis = createSelector([selectReferenceAreas, pickAxisType, pickAxisId], filterReferenceElements);
export var selectReferenceLines = state => state.referenceElements.lines;
export var selectReferenceLinesByAxis = createSelector([selectReferenceLines, pickAxisType, pickAxisId], filterReferenceElements);
export var combineDotsDomain = (dots, axisType) => {
  var allCoords = onlyAllowNumbers(dots.map(dot => axisType === 'xAxis' ? dot.x : dot.y));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
var selectReferenceDotsDomain = createSelector(selectReferenceDotsByAxis, pickAxisType, combineDotsDomain);
export var combineAreasDomain = (areas, axisType) => {
  var allCoords = onlyAllowNumbers(areas.flatMap(area => [axisType === 'xAxis' ? area.x1 : area.y1, axisType === 'xAxis' ? area.x2 : area.y2]));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
var selectReferenceAreasDomain = createSelector([selectReferenceAreasByAxis, pickAxisType], combineAreasDomain);
export var combineLinesDomain = (lines, axisType) => {
  var allCoords = onlyAllowNumbers(lines.map(line => axisType === 'xAxis' ? line.x : line.y));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
var selectReferenceLinesDomain = createSelector(selectReferenceLinesByAxis, pickAxisType, combineLinesDomain);
var selectReferenceElementsDomain = createSelector(selectReferenceDotsDomain, selectReferenceLinesDomain, selectReferenceAreasDomain, (dotsDomain, linesDomain, areasDomain) => {
  return mergeDomains(dotsDomain, areasDomain, linesDomain);
});
export var selectDomainDefinition = createSelector([selectBaseAxis], getDomainDefinition);
export var combineNumericalDomain = (axisSettings, domainDefinition, domainOfStackGroups, allDataWithErrorDomains, referenceElementsDomain) => {
  var domainFromUserPreference = numericalDomainSpecifiedWithoutRequiringData(domainDefinition, axisSettings.allowDataOverflow);
  if (domainFromUserPreference != null) {
    // We're done! No need to compute anything else.
    return domainFromUserPreference;
  }
  return parseNumericalUserDomain(domainDefinition, mergeDomains(domainOfStackGroups, referenceElementsDomain, computeNumericalDomain(allDataWithErrorDomains)), axisSettings.allowDataOverflow);
};
var selectNumericalDomain = createSelector([selectBaseAxis, selectDomainDefinition, selectDomainOfStackGroups, selectAllAppliedNumericalValuesIncludingErrorValues, selectReferenceElementsDomain], combineNumericalDomain);

/**
 * Expand by design maps everything between 0 and 1,
 * there is nothing to compute.
 * See https://d3js.org/d3-shape/stack#stack-offsets
 */
var expandDomain = [0, 1];
export var combineAxisDomain = (axisSettings, layout, displayedData, allAppliedValues, stackOffsetType, axisType, numericalDomain) => {
  if (axisSettings == null || displayedData == null || displayedData.length === 0) {
    return undefined;
  }
  var {
    dataKey,
    type
  } = axisSettings;
  var isCategorical = isCategoricalAxis(layout, axisType);
  if (isCategorical && dataKey == null) {
    return range(0, displayedData.length);
  }
  if (type === 'category') {
    return computeDomainOfTypeCategory(allAppliedValues, axisSettings, isCategorical);
  }
  if (stackOffsetType === 'expand') {
    return expandDomain;
  }
  return numericalDomain;
};
export var selectAxisDomain = createSelector([selectBaseAxis, selectChartLayout, selectDisplayedData, selectAllAppliedValues, selectStackOffsetType, pickAxisType, selectNumericalDomain], combineAxisDomain);
export var combineRealScaleType = (axisConfig, layout, hasBar, chartType, axisType) => {
  if (axisConfig == null) {
    return undefined;
  }
  var {
    scale,
    type
  } = axisConfig;
  if (scale === 'auto') {
    if (layout === 'radial' && axisType === 'radiusAxis') {
      return 'band';
    }
    if (layout === 'radial' && axisType === 'angleAxis') {
      return 'linear';
    }
    if (type === 'category' && chartType && (chartType.indexOf('LineChart') >= 0 || chartType.indexOf('AreaChart') >= 0 || chartType.indexOf('ComposedChart') >= 0 && !hasBar)) {
      return 'point';
    }
    if (type === 'category') {
      return 'band';
    }
    return 'linear';
  }
  if (typeof scale === 'string') {
    var name = "scale".concat(upperFirst(scale));
    return name in d3Scales ? name : 'point';
  }
  return undefined;
};
export var selectRealScaleType = createSelector([selectBaseAxis, selectChartLayout, selectHasBar, selectChartName, pickAxisType], combineRealScaleType);
function getD3ScaleFromType(realScaleType) {
  if (realScaleType == null) {
    return undefined;
  }
  if (realScaleType in d3Scales) {
    // @ts-expect-error we should do better type verification here
    return d3Scales[realScaleType]();
  }
  var name = "scale".concat(upperFirst(realScaleType));
  if (name in d3Scales) {
    // @ts-expect-error we should do better type verification here
    return d3Scales[name]();
  }
  return undefined;
}
export function combineScaleFunction(axis, realScaleType, axisDomain, axisRange) {
  if (axisDomain == null || axisRange == null) {
    return undefined;
  }
  if (typeof axis.scale === 'function') {
    // @ts-expect-error we're going to assume here that if axis.scale is a function then it is a d3Scale function
    return axis.scale.copy().domain(axisDomain).range(axisRange);
  }
  var d3ScaleFunction = getD3ScaleFromType(realScaleType);
  if (d3ScaleFunction == null) {
    return undefined;
  }
  var scale = d3ScaleFunction.domain(axisDomain).range(axisRange);
  // I don't like this function because it mutates the scale. We should come up with a way to compute the domain up front.
  checkDomainOfScale(scale);
  return scale;
}
export var combineNiceTicks = (axisDomain, axisSettings, realScaleType) => {
  var domainDefinition = getDomainDefinition(axisSettings);
  if (realScaleType !== 'auto' && realScaleType !== 'linear') {
    return undefined;
  }
  if (axisSettings != null && axisSettings.tickCount && Array.isArray(domainDefinition) && (domainDefinition[0] === 'auto' || domainDefinition[1] === 'auto') && isWellFormedNumberDomain(axisDomain)) {
    return getNiceTickValues(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals);
  }
  if (axisSettings != null && axisSettings.tickCount && axisSettings.type === 'number' && isWellFormedNumberDomain(axisDomain)) {
    return getTickValuesFixedDomain(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals);
  }
  return undefined;
};
export var selectNiceTicks = createSelector([selectAxisDomain, selectAxisSettings, selectRealScaleType], combineNiceTicks);
export var combineAxisDomainWithNiceTicks = (axisSettings, domain, niceTicks, axisType) => {
  if (
  /*
   * Angle axis for some reason uses nice ticks when rendering axis tick labels,
   * but doesn't use nice ticks for extending domain like all the other axes do.
   * Not really sure why? Is there a good reason,
   * or is it just because someone added support for nice ticks to the other axes and forgot this one?
   */
  axisType !== 'angleAxis' && (axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.type) === 'number' && isWellFormedNumberDomain(domain) && Array.isArray(niceTicks) && niceTicks.length > 0) {
    var minFromDomain = domain[0];
    var minFromTicks = niceTicks[0];
    var maxFromDomain = domain[1];
    var maxFromTicks = niceTicks[niceTicks.length - 1];
    return [Math.min(minFromDomain, minFromTicks), Math.max(maxFromDomain, maxFromTicks)];
  }
  return domain;
};
export var selectAxisDomainIncludingNiceTicks = createSelector([selectBaseAxis, selectAxisDomain, selectNiceTicks, pickAxisType], combineAxisDomainWithNiceTicks);

/**
 * Returns the smallest gap, between two numbers in the data, as a ratio of the whole range (max - min).
 * Ignores domain provided by user and only considers domain from data.
 *
 * The result is a number between 0 and 1.
 */
export var selectSmallestDistanceBetweenValues = createSelector(selectAllAppliedValues, selectBaseAxis, (allDataSquished, axisSettings) => {
  if (!axisSettings || axisSettings.type !== 'number') {
    return undefined;
  }
  var smallestDistanceBetweenValues = Infinity;
  var sortedValues = Array.from(onlyAllowNumbers(allDataSquished.map(d => d.value))).sort((a, b) => a - b);
  if (sortedValues.length < 2) {
    return Infinity;
  }
  var diff = sortedValues[sortedValues.length - 1] - sortedValues[0];
  if (diff === 0) {
    return Infinity;
  }
  // Only do n - 1 distance calculations because there's only n - 1 distances between n values.
  for (var i = 0; i < sortedValues.length - 1; i++) {
    var distance = sortedValues[i + 1] - sortedValues[i];
    smallestDistanceBetweenValues = Math.min(smallestDistanceBetweenValues, distance);
  }
  return smallestDistanceBetweenValues / diff;
});
var selectCalculatedPadding = createSelector(selectSmallestDistanceBetweenValues, selectChartLayout, selectBarCategoryGap, selectChartOffsetInternal, (_1, _2, _3, padding) => padding, (smallestDistanceInPercent, layout, barCategoryGap, offset, padding) => {
  if (!isWellBehavedNumber(smallestDistanceInPercent)) {
    return 0;
  }
  var rangeWidth = layout === 'vertical' ? offset.height : offset.width;
  if (padding === 'gap') {
    return smallestDistanceInPercent * rangeWidth / 2;
  }
  if (padding === 'no-gap') {
    var gap = getPercentValue(barCategoryGap, smallestDistanceInPercent * rangeWidth);
    var halfBand = smallestDistanceInPercent * rangeWidth / 2;
    return halfBand - gap - (halfBand - gap) / rangeWidth * gap;
  }
  return 0;
});
export var selectCalculatedXAxisPadding = (state, axisId) => {
  var xAxisSettings = selectXAxisSettings(state, axisId);
  if (xAxisSettings == null || typeof xAxisSettings.padding !== 'string') {
    return 0;
  }
  return selectCalculatedPadding(state, 'xAxis', axisId, xAxisSettings.padding);
};
export var selectCalculatedYAxisPadding = (state, axisId) => {
  var yAxisSettings = selectYAxisSettings(state, axisId);
  if (yAxisSettings == null || typeof yAxisSettings.padding !== 'string') {
    return 0;
  }
  return selectCalculatedPadding(state, 'yAxis', axisId, yAxisSettings.padding);
};
var selectXAxisPadding = createSelector(selectXAxisSettings, selectCalculatedXAxisPadding, (xAxisSettings, calculated) => {
  var _padding$left, _padding$right;
  if (xAxisSettings == null) {
    return {
      left: 0,
      right: 0
    };
  }
  var {
    padding
  } = xAxisSettings;
  if (typeof padding === 'string') {
    return {
      left: calculated,
      right: calculated
    };
  }
  return {
    left: ((_padding$left = padding.left) !== null && _padding$left !== void 0 ? _padding$left : 0) + calculated,
    right: ((_padding$right = padding.right) !== null && _padding$right !== void 0 ? _padding$right : 0) + calculated
  };
});
var selectYAxisPadding = createSelector(selectYAxisSettings, selectCalculatedYAxisPadding, (yAxisSettings, calculated) => {
  var _padding$top, _padding$bottom;
  if (yAxisSettings == null) {
    return {
      top: 0,
      bottom: 0
    };
  }
  var {
    padding
  } = yAxisSettings;
  if (typeof padding === 'string') {
    return {
      top: calculated,
      bottom: calculated
    };
  }
  return {
    top: ((_padding$top = padding.top) !== null && _padding$top !== void 0 ? _padding$top : 0) + calculated,
    bottom: ((_padding$bottom = padding.bottom) !== null && _padding$bottom !== void 0 ? _padding$bottom : 0) + calculated
  };
});
export var combineXAxisRange = createSelector([selectChartOffsetInternal, selectXAxisPadding, selectBrushDimensions, selectBrushSettings, (_state, _axisId, isPanorama) => isPanorama], (offset, padding, brushDimensions, _ref4, isPanorama) => {
  var {
    padding: brushPadding
  } = _ref4;
  if (isPanorama) {
    return [brushPadding.left, brushDimensions.width - brushPadding.right];
  }
  return [offset.left + padding.left, offset.left + offset.width - padding.right];
});
export var combineYAxisRange = createSelector([selectChartOffsetInternal, selectChartLayout, selectYAxisPadding, selectBrushDimensions, selectBrushSettings, (_state, _axisId, isPanorama) => isPanorama], (offset, layout, padding, brushDimensions, _ref5, isPanorama) => {
  var {
    padding: brushPadding
  } = _ref5;
  if (isPanorama) {
    return [brushDimensions.height - brushPadding.bottom, brushPadding.top];
  }
  if (layout === 'horizontal') {
    return [offset.top + offset.height - padding.bottom, offset.top + padding.top];
  }
  return [offset.top + padding.top, offset.top + offset.height - padding.bottom];
});
export var selectAxisRange = (state, axisType, axisId, isPanorama) => {
  var _selectZAxisSettings;
  switch (axisType) {
    case 'xAxis':
      return combineXAxisRange(state, axisId, isPanorama);
    case 'yAxis':
      return combineYAxisRange(state, axisId, isPanorama);
    case 'zAxis':
      return (_selectZAxisSettings = selectZAxisSettings(state, axisId)) === null || _selectZAxisSettings === void 0 ? void 0 : _selectZAxisSettings.range;
    case 'angleAxis':
      return selectAngleAxisRange(state);
    case 'radiusAxis':
      return selectRadiusAxisRange(state, axisId);
    default:
      return undefined;
  }
};
export var selectAxisRangeWithReverse = createSelector([selectBaseAxis, selectAxisRange], combineAxisRangeWithReverse);
export var selectAxisScale = createSelector([selectBaseAxis, selectRealScaleType, selectAxisDomainIncludingNiceTicks, selectAxisRangeWithReverse], combineScaleFunction);
export var selectErrorBarsSettings = createSelector(selectCartesianItemsSettings, pickAxisType, (items, axisType) => {
  return items.flatMap(item => {
    var _item$errorBars2;
    return (_item$errorBars2 = item.errorBars) !== null && _item$errorBars2 !== void 0 ? _item$errorBars2 : [];
  }).filter(e => {
    return isErrorBarRelevantForAxisType(axisType, e);
  });
});
function compareIds(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}
var pickAxisOrientation = (_state, orientation) => orientation;
var pickMirror = (_state, _orientation, mirror) => mirror;
var selectAllXAxesWithOffsetType = createSelector(selectAllXAxes, pickAxisOrientation, pickMirror, (allAxes, orientation, mirror) => allAxes.filter(axis => axis.orientation === orientation).filter(axis => axis.mirror === mirror).sort(compareIds));
var selectAllYAxesWithOffsetType = createSelector(selectAllYAxes, pickAxisOrientation, pickMirror, (allAxes, orientation, mirror) => allAxes.filter(axis => axis.orientation === orientation).filter(axis => axis.mirror === mirror).sort(compareIds));
var getXAxisSize = (offset, axisSettings) => {
  return {
    width: offset.width,
    height: axisSettings.height
  };
};
var getYAxisSize = (offset, axisSettings) => {
  var width = typeof axisSettings.width === 'number' ? axisSettings.width : DEFAULT_Y_AXIS_WIDTH;
  return {
    width,
    height: offset.height
  };
};
export var selectXAxisSize = createSelector(selectChartOffsetInternal, selectXAxisSettings, getXAxisSize);
var combineXAxisPositionStartingPoint = (offset, orientation, chartHeight) => {
  switch (orientation) {
    case 'top':
      return offset.top;
    case 'bottom':
      return chartHeight - offset.bottom;
    default:
      return 0;
  }
};
var combineYAxisPositionStartingPoint = (offset, orientation, chartWidth) => {
  switch (orientation) {
    case 'left':
      return offset.left;
    case 'right':
      return chartWidth - offset.right;
    default:
      return 0;
  }
};
export var selectAllXAxesOffsetSteps = createSelector(selectChartHeight, selectChartOffsetInternal, selectAllXAxesWithOffsetType, pickAxisOrientation, pickMirror, (chartHeight, offset, allAxesWithSameOffsetType, orientation, mirror) => {
  var steps = {};
  var position;
  allAxesWithSameOffsetType.forEach(axis => {
    var axisSize = getXAxisSize(offset, axis);
    if (position == null) {
      position = combineXAxisPositionStartingPoint(offset, orientation, chartHeight);
    }
    var needSpace = orientation === 'top' && !mirror || orientation === 'bottom' && mirror;
    steps[axis.id] = position - Number(needSpace) * axisSize.height;
    position += (needSpace ? -1 : 1) * axisSize.height;
  });
  return steps;
});
export var selectAllYAxesOffsetSteps = createSelector(selectChartWidth, selectChartOffsetInternal, selectAllYAxesWithOffsetType, pickAxisOrientation, pickMirror, (chartWidth, offset, allAxesWithSameOffsetType, orientation, mirror) => {
  var steps = {};
  var position;
  allAxesWithSameOffsetType.forEach(axis => {
    var axisSize = getYAxisSize(offset, axis);
    if (position == null) {
      position = combineYAxisPositionStartingPoint(offset, orientation, chartWidth);
    }
    var needSpace = orientation === 'left' && !mirror || orientation === 'right' && mirror;
    steps[axis.id] = position - Number(needSpace) * axisSize.width;
    position += (needSpace ? -1 : 1) * axisSize.width;
  });
  return steps;
});
export var selectXAxisPosition = (state, axisId) => {
  var offset = selectChartOffsetInternal(state);
  var axisSettings = selectXAxisSettings(state, axisId);
  if (axisSettings == null) {
    return undefined;
  }
  var allSteps = selectAllXAxesOffsetSteps(state, axisSettings.orientation, axisSettings.mirror);
  var stepOfThisAxis = allSteps[axisId];
  if (stepOfThisAxis == null) {
    return {
      x: offset.left,
      y: 0
    };
  }
  return {
    x: offset.left,
    y: stepOfThisAxis
  };
};
export var selectYAxisPosition = (state, axisId) => {
  var offset = selectChartOffsetInternal(state);
  var axisSettings = selectYAxisSettings(state, axisId);
  if (axisSettings == null) {
    return undefined;
  }
  var allSteps = selectAllYAxesOffsetSteps(state, axisSettings.orientation, axisSettings.mirror);
  var stepOfThisAxis = allSteps[axisId];
  if (stepOfThisAxis == null) {
    return {
      x: 0,
      y: offset.top
    };
  }
  return {
    x: stepOfThisAxis,
    y: offset.top
  };
};
export var selectYAxisSize = createSelector(selectChartOffsetInternal, selectYAxisSettings, (offset, axisSettings) => {
  var width = typeof axisSettings.width === 'number' ? axisSettings.width : DEFAULT_Y_AXIS_WIDTH;
  return {
    width,
    height: offset.height
  };
});
export var selectCartesianAxisSize = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSize(state, axisId).width;
      }
    case 'yAxis':
      {
        return selectYAxisSize(state, axisId).height;
      }
    default:
      {
        return undefined;
      }
  }
};
export var combineDuplicateDomain = (chartLayout, appliedValues, axis, axisType) => {
  if (axis == null) {
    return undefined;
  }
  var {
    allowDuplicatedCategory,
    type,
    dataKey
  } = axis;
  var isCategorical = isCategoricalAxis(chartLayout, axisType);
  var allData = appliedValues.map(av => av.value);
  if (dataKey && isCategorical && type === 'category' && allowDuplicatedCategory && hasDuplicate(allData)) {
    return allData;
  }
  return undefined;
};
export var selectDuplicateDomain = createSelector([selectChartLayout, selectAllAppliedValues, selectBaseAxis, pickAxisType], combineDuplicateDomain);
export var combineCategoricalDomain = (layout, appliedValues, axis, axisType) => {
  if (axis == null || axis.dataKey == null) {
    return undefined;
  }
  var {
    type,
    scale
  } = axis;
  var isCategorical = isCategoricalAxis(layout, axisType);
  if (isCategorical && (type === 'number' || scale !== 'auto')) {
    return appliedValues.map(d => d.value);
  }
  return undefined;
};
export var selectCategoricalDomain = createSelector([selectChartLayout, selectAllAppliedValues, selectAxisSettings, pickAxisType], combineCategoricalDomain);
export var selectAxisPropsNeededForCartesianGridTicksGenerator = createSelector([selectChartLayout, selectCartesianAxisSettings, selectRealScaleType, selectAxisScale, selectDuplicateDomain, selectCategoricalDomain, selectAxisRange, selectNiceTicks, pickAxisType], (layout, axis, realScaleType, scale, duplicateDomain, categoricalDomain, axisRange, niceTicks, axisType) => {
  if (axis == null) {
    return null;
  }
  var isCategorical = isCategoricalAxis(layout, axisType);
  return {
    angle: axis.angle,
    interval: axis.interval,
    minTickGap: axis.minTickGap,
    orientation: axis.orientation,
    tick: axis.tick,
    tickCount: axis.tickCount,
    tickFormatter: axis.tickFormatter,
    ticks: axis.ticks,
    type: axis.type,
    unit: axis.unit,
    axisType,
    categoricalDomain,
    duplicateDomain,
    isCategorical,
    niceTicks,
    range: axisRange,
    realScaleType,
    scale
  };
});
export var combineAxisTicks = (layout, axis, realScaleType, scale, niceTicks, axisRange, duplicateDomain, categoricalDomain, axisType) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  var isCategorical = isCategoricalAxis(layout, axisType);
  var {
    type,
    ticks,
    tickCount
  } = axis;

  // This is testing for `scaleBand` but for band axis the type is reported as `band` so this looks like a dead code with a workaround elsewhere?
  var offsetForBand = realScaleType === 'scaleBand' && typeof scale.bandwidth === 'function' ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && axisRange != null && axisRange.length >= 2 ? mathSign(axisRange[0] - axisRange[1]) * 2 * offset : offset;

  // The ticks set by user should only affect the ticks adjacent to axis line
  var ticksOrNiceTicks = ticks || niceTicks;
  if (ticksOrNiceTicks) {
    var result = ticksOrNiceTicks.map((entry, index) => {
      var scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
      return {
        index,
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: scale(scaleContent) + offset,
        value: entry,
        offset
      };
    });
    return result.filter(row => !isNan(row.coordinate));
  }

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      index,
      offset
    }));
  }
  if (scale.ticks) {
    return scale.ticks(tickCount)
    // @ts-expect-error why does the offset go here? The type does not require it
    .map(entry => ({
      coordinate: scale(entry) + offset,
      value: entry,
      offset
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset
  }));
};
export var selectTicksOfAxis = createSelector([selectChartLayout, selectAxisSettings, selectRealScaleType, selectAxisScale, selectNiceTicks, selectAxisRange, selectDuplicateDomain, selectCategoricalDomain, pickAxisType], combineAxisTicks);
export var combineGraphicalItemTicks = (layout, axis, scale, axisRange, duplicateDomain, categoricalDomain, axisType) => {
  if (axis == null || scale == null || axisRange == null || axisRange[0] === axisRange[1]) {
    return undefined;
  }
  var isCategorical = isCategoricalAxis(layout, axisType);
  var {
    tickCount
  } = axis;
  var offset = 0;
  offset = axisType === 'angleAxis' && (axisRange === null || axisRange === void 0 ? void 0 : axisRange.length) >= 2 ? mathSign(axisRange[0] - axisRange[1]) * 2 * offset : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      index,
      offset
    }));
  }
  if (scale.ticks) {
    return scale.ticks(tickCount)
    // @ts-expect-error why does the offset go here? The type does not require it
    .map(entry => ({
      coordinate: scale(entry) + offset,
      value: entry,
      offset
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset
  }));
};
export var selectTicksOfGraphicalItem = createSelector([selectChartLayout, selectAxisSettings, selectAxisScale, selectAxisRange, selectDuplicateDomain, selectCategoricalDomain, pickAxisType], combineGraphicalItemTicks);
export var selectAxisWithScale = createSelector(selectBaseAxis, selectAxisScale, (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});
var selectZAxisScale = createSelector([selectBaseAxis, selectRealScaleType, selectAxisDomain, selectAxisRangeWithReverse], combineScaleFunction);
export var selectZAxisWithScale = createSelector((state, _axisType, axisId) => selectZAxisSettings(state, axisId), selectZAxisScale, (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread(_objectSpread({}, axis), {}, {
    scale
  });
});

/**
 * We are also going to need to implement polar chart directions if we want to support keyboard controls for those.
 */

export var selectChartDirection = createSelector([selectChartLayout, selectAllXAxes, selectAllYAxes], (layout, allXAxes, allYAxes) => {
  switch (layout) {
    case 'horizontal':
      {
        return allXAxes.some(axis => axis.reversed) ? 'right-to-left' : 'left-to-right';
      }
    case 'vertical':
      {
        return allYAxes.some(axis => axis.reversed) ? 'bottom-to-top' : 'top-to-bottom';
      }
    // TODO: make this better. For now, right arrow triggers "forward", left arrow "back"
    // however, the tooltip moves an unintuitive direction because of how the indices are rendered
    case 'centric':
    case 'radial':
      {
        return 'left-to-right';
      }
    default:
      {
        return undefined;
      }
  }
});