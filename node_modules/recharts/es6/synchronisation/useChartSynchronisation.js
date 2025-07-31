import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectEventEmitter, selectSyncId, selectSyncMethod } from '../state/selectors/rootPropsSelectors';
import { BRUSH_SYNC_EVENT, eventCenter, TOOLTIP_SYNC_EVENT } from '../util/Events';
import { createEventEmitter } from '../state/optionsSlice';
import { setSyncInteraction } from '../state/tooltipSlice';
import { selectTooltipDataKey } from '../state/selectors/selectors';
import { selectTooltipAxisTicks } from '../state/selectors/tooltipSelectors';
import { selectSynchronisedTooltipState } from './syncSelectors';
import { useChartLayout, useViewBox } from '../context/chartLayoutContext';
import { setDataStartEndIndexes } from '../state/chartDataSlice';
var noop = () => {};
function useTooltipSyncEventsListener() {
  var mySyncId = useAppSelector(selectSyncId);
  var myEventEmitter = useAppSelector(selectEventEmitter);
  var dispatch = useAppDispatch();
  var syncMethod = useAppSelector(selectSyncMethod);
  var tooltipTicks = useAppSelector(selectTooltipAxisTicks);
  var layout = useChartLayout();
  var viewBox = useViewBox();
  var className = useAppSelector(state => state.rootProps.className);
  useEffect(() => {
    if (mySyncId == null) {
      // This chart is not synchronised with any other chart so we don't need to listen for any events.
      return noop;
    }
    var listener = (incomingSyncId, action, emitter) => {
      if (myEventEmitter === emitter) {
        // We don't want to dispatch actions that we sent ourselves.
        return;
      }
      if (mySyncId !== incomingSyncId) {
        // This event is not for this chart
        return;
      }
      if (syncMethod === 'index') {
        dispatch(action);
        // This is the default behaviour, we don't need to do anything else.
        return;
      }
      if (tooltipTicks == null) {
        // for the other two sync methods, we need the ticks to be available
        return;
      }
      var activeTick;
      if (typeof syncMethod === 'function') {
        /*
         * This is what the data shape in 2.x CategoricalChartState used to look like.
         * In 3.x we store things differently but let's try to keep the old shape for compatibility.
         */
        var syncMethodParam = {
          activeTooltipIndex: action.payload.index == null ? undefined : Number(action.payload.index),
          isTooltipActive: action.payload.active,
          activeIndex: action.payload.index == null ? undefined : Number(action.payload.index),
          activeLabel: action.payload.label,
          activeDataKey: action.payload.dataKey,
          activeCoordinate: action.payload.coordinate
        };
        // Call a callback function. If there is an application specific algorithm
        var activeTooltipIndex = syncMethod(tooltipTicks, syncMethodParam);
        activeTick = tooltipTicks[activeTooltipIndex];
      } else if (syncMethod === 'value') {
        // labels are always strings, tick.value might be a string or a number, depending on axis type
        activeTick = tooltipTicks.find(tick => String(tick.value) === action.payload.label);
      }
      var {
        coordinate
      } = action.payload;
      if (activeTick == null || action.payload.active === false || coordinate == null || viewBox == null) {
        dispatch(setSyncInteraction({
          active: false,
          coordinate: undefined,
          dataKey: undefined,
          index: null,
          label: undefined
        }));
        return;
      }
      var {
        x,
        y
      } = coordinate;
      var validateChartX = Math.min(x, viewBox.x + viewBox.width);
      var validateChartY = Math.min(y, viewBox.y + viewBox.height);
      var activeCoordinate = {
        x: layout === 'horizontal' ? activeTick.coordinate : validateChartX,
        y: layout === 'horizontal' ? validateChartY : activeTick.coordinate
      };
      var syncAction = setSyncInteraction({
        active: action.payload.active,
        coordinate: activeCoordinate,
        dataKey: action.payload.dataKey,
        index: String(activeTick.index),
        label: action.payload.label
      });
      dispatch(syncAction);
    };
    eventCenter.on(TOOLTIP_SYNC_EVENT, listener);
    return () => {
      eventCenter.off(TOOLTIP_SYNC_EVENT, listener);
    };
  }, [className, dispatch, myEventEmitter, mySyncId, syncMethod, tooltipTicks, layout, viewBox]);
}
function useBrushSyncEventsListener() {
  var mySyncId = useAppSelector(selectSyncId);
  var myEventEmitter = useAppSelector(selectEventEmitter);
  var dispatch = useAppDispatch();
  useEffect(() => {
    if (mySyncId == null) {
      // This chart is not synchronised with any other chart so we don't need to listen for any events.
      return noop;
    }
    var listener = (incomingSyncId, action, emitter) => {
      if (myEventEmitter === emitter) {
        // We don't want to dispatch actions that we sent ourselves.
        return;
      }
      if (mySyncId === incomingSyncId) {
        dispatch(setDataStartEndIndexes(action));
      }
    };
    eventCenter.on(BRUSH_SYNC_EVENT, listener);
    return () => {
      eventCenter.off(BRUSH_SYNC_EVENT, listener);
    };
  }, [dispatch, myEventEmitter, mySyncId]);
}

/**
 * Will receive synchronisation events from other charts.
 *
 * Reads syncMethod from state and decides how to synchronise the tooltip based on that.
 *
 * @returns void
 */
export function useSynchronisedEventsFromOtherCharts() {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(createEventEmitter());
  }, [dispatch]);
  useTooltipSyncEventsListener();
  useBrushSyncEventsListener();
}

/**
 * Will send events to other charts.
 * If syncId is undefined, no events will be sent.
 *
 * This ignores the syncMethod, because that is set and computed on the receiving end.
 *
 * @param tooltipEventType from Tooltip
 * @param trigger from Tooltip
 * @param activeCoordinate from state
 * @param activeLabel from state
 * @param activeIndex from state
 * @param isTooltipActive from state
 * @returns void
 */
export function useTooltipChartSynchronisation(tooltipEventType, trigger, activeCoordinate, activeLabel, activeIndex, isTooltipActive) {
  var activeDataKey = useAppSelector(state => selectTooltipDataKey(state, tooltipEventType, trigger));
  var eventEmitterSymbol = useAppSelector(selectEventEmitter);
  var syncId = useAppSelector(selectSyncId);
  var syncMethod = useAppSelector(selectSyncMethod);
  var tooltipState = useAppSelector(selectSynchronisedTooltipState);
  var isReceivingSynchronisation = tooltipState === null || tooltipState === void 0 ? void 0 : tooltipState.active;
  useEffect(() => {
    if (isReceivingSynchronisation) {
      /*
       * This chart currently has active tooltip, synchronised from another chart.
       * Let's not send any outgoing synchronisation events while that's happening
       * to avoid infinite loops.
       */
      return;
    }
    if (syncId == null) {
      /*
       * syncId is not set, means that this chart is not synchronised with any other chart,
       * means we don't need to send synchronisation events
       */
      return;
    }
    if (eventEmitterSymbol == null) {
      /*
       * When using Recharts internal hooks and selectors outside charts context,
       * these properties will be undefined. Let's return silently instead of throwing an error.
       */
      return;
    }
    var syncAction = setSyncInteraction({
      active: isTooltipActive,
      coordinate: activeCoordinate,
      dataKey: activeDataKey,
      index: activeIndex,
      label: typeof activeLabel === 'number' ? String(activeLabel) : activeLabel
    });
    eventCenter.emit(TOOLTIP_SYNC_EVENT, syncId, syncAction, eventEmitterSymbol);
  }, [isReceivingSynchronisation, activeCoordinate, activeDataKey, activeIndex, activeLabel, eventEmitterSymbol, syncId, syncMethod, isTooltipActive]);
}
export function useBrushChartSynchronisation() {
  var syncId = useAppSelector(selectSyncId);
  var eventEmitterSymbol = useAppSelector(selectEventEmitter);
  var brushStartIndex = useAppSelector(state => state.chartData.dataStartIndex);
  var brushEndIndex = useAppSelector(state => state.chartData.dataEndIndex);
  useEffect(() => {
    if (syncId == null || brushStartIndex == null || brushEndIndex == null || eventEmitterSymbol == null) {
      return;
    }
    var syncAction = {
      startIndex: brushStartIndex,
      endIndex: brushEndIndex
    };
    eventCenter.emit(BRUSH_SYNC_EVENT, syncId, syncAction, eventEmitterSymbol);
  }, [brushEndIndex, brushStartIndex, eventEmitterSymbol, syncId]);
}