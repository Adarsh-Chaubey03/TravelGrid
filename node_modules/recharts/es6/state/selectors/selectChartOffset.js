import { createSelector } from 'reselect';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
export var selectChartOffset = createSelector([selectChartOffsetInternal], offsetInternal => {
  if (!offsetInternal) {
    return undefined;
  }
  return {
    top: offsetInternal.top,
    bottom: offsetInternal.bottom,
    left: offsetInternal.left,
    right: offsetInternal.right
  };
});