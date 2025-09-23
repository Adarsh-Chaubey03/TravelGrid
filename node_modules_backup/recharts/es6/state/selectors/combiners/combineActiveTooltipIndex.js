import { isWellBehavedNumber } from '../../../util/isWellBehavedNumber';
export var combineActiveTooltipIndex = (tooltipInteraction, chartData) => {
  var desiredIndex = tooltipInteraction === null || tooltipInteraction === void 0 ? void 0 : tooltipInteraction.index;
  if (desiredIndex == null) {
    return null;
  }
  var indexAsNumber = Number(desiredIndex);
  if (!isWellBehavedNumber(indexAsNumber)) {
    // this is for charts like Sankey and Treemap that do not support numerical indexes. We need a proper solution for this before we can start supporting keyboard events on these charts.
    return desiredIndex;
  }

  /*
   * Zero is a trivial limit for single-dimensional charts like Line and Area,
   * but this also needs a support for multidimensional charts like Sankey and Treemap! TODO
   */
  var lowerLimit = 0;
  var upperLimit = +Infinity;
  if (chartData.length > 0) {
    upperLimit = chartData.length - 1;
  }

  // now let's clamp the desiredIndex between the limits
  return String(Math.max(lowerLimit, Math.min(indexAsNumber, upperLimit)));
};