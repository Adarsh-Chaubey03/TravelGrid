import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { addBar, removeBar } from './graphicalItemsSlice';
export var ReportBar = () => {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addBar());
    return () => {
      dispatch(removeBar());
    };
  });
  return null;
};