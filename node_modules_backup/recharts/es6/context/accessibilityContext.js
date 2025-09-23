import { useAppSelector } from '../state/hooks';
export var useAccessibilityLayer = () => useAppSelector(state => state.rootProps.accessibilityLayer);