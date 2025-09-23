import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { addTooltipEntrySettings, removeTooltipEntrySettings } from './tooltipSlice';
import { useIsPanorama } from '../context/PanoramaContext';
export function SetTooltipEntrySettings(_ref) {
  var {
    fn,
    args
  } = _ref;
  var dispatch = useAppDispatch();
  var isPanorama = useIsPanorama();
  useEffect(() => {
    if (isPanorama) {
      // Panorama graphical items should never contribute to Tooltip payload.
      return undefined;
    }
    var tooltipEntrySettings = fn(args);
    dispatch(addTooltipEntrySettings(tooltipEntrySettings));
    return () => {
      dispatch(removeTooltipEntrySettings(tooltipEntrySettings));
    };
  }, [fn, args, dispatch, isPanorama]);
  return null;
}