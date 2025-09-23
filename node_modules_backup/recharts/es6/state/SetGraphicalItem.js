function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { useEffect, useRef } from 'react';
import { useAppDispatch } from './hooks';
import { addCartesianGraphicalItem, addPolarGraphicalItem, removeCartesianGraphicalItem, removePolarGraphicalItem, replaceCartesianGraphicalItem } from './graphicalItemsSlice';
import { getNormalizedStackId } from '../util/ChartUtils';
export function SetCartesianGraphicalItem(props) {
  var dispatch = useAppDispatch();
  var prevPropsRef = useRef(null);
  useEffect(() => {
    var settings = _objectSpread(_objectSpread({}, props), {}, {
      stackId: getNormalizedStackId(props.stackId)
    });
    if (prevPropsRef.current === null) {
      dispatch(addCartesianGraphicalItem(settings));
    } else if (prevPropsRef.current !== settings) {
      dispatch(replaceCartesianGraphicalItem({
        prev: prevPropsRef.current,
        next: settings
      }));
    }
    prevPropsRef.current = settings;
  }, [dispatch, props]);
  useEffect(() => {
    return () => {
      if (prevPropsRef.current) {
        dispatch(removeCartesianGraphicalItem(prevPropsRef.current));
        /*
         * Here we have to reset the ref to null because in StrictMode, the effect will run twice,
         * but it will keep the same ref value from the first render.
         *
         * In browser, React will clear the ref after the first effect cleanup,
         * so that wouldn't be an issue.
         *
         * In StrictMode, however, the ref is kept,
         * and in the hook above the code checks for `prevPropsRef.current === null`
         * which would be false so it would not dispatch the `addCartesianGraphicalItem` action again.
         *
         * https://github.com/recharts/recharts/issues/6022
         */
        prevPropsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}
export function SetPolarGraphicalItem(props) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addPolarGraphicalItem(props));
    return () => {
      dispatch(removePolarGraphicalItem(props));
    };
  }, [dispatch, props]);
  return null;
}