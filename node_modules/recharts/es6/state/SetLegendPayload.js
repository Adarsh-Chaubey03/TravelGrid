import { useEffect } from 'react';
import { useIsPanorama } from '../context/PanoramaContext';
import { selectChartLayout } from '../context/chartLayoutContext';
import { useAppDispatch, useAppSelector } from './hooks';
import { addLegendPayload, removeLegendPayload } from './legendSlice';
var noop = () => {};
export function SetLegendPayload(_ref) {
  var {
    legendPayload
  } = _ref;
  var dispatch = useAppDispatch();
  var isPanorama = useIsPanorama();
  useEffect(() => {
    if (isPanorama) {
      return noop;
    }
    dispatch(addLegendPayload(legendPayload));
    return () => {
      dispatch(removeLegendPayload(legendPayload));
    };
  }, [dispatch, isPanorama, legendPayload]);
  return null;
}
export function SetPolarLegendPayload(_ref2) {
  var {
    legendPayload
  } = _ref2;
  var dispatch = useAppDispatch();
  var layout = useAppSelector(selectChartLayout);
  useEffect(() => {
    if (layout !== 'centric' && layout !== 'radial') {
      return noop;
    }
    dispatch(addLegendPayload(legendPayload));
    return () => {
      dispatch(removeLegendPayload(legendPayload));
    };
  }, [dispatch, layout, legendPayload]);
  return null;
}