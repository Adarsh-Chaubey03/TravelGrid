import { DataKey, NullableCoordinate } from '../../util/types';
import { BaseValue } from '../../cartesian/Area';
import { RechartsRootState } from '../store';
import { AxisId } from '../cartesianAxisSlice';
import { StackId } from '../../util/ChartUtils';
import { ChartData } from '../chartDataSlice';
import { NullablePoint } from '../../shape/Curve';
export interface AreaPointItem extends NullablePoint {
    x: number | null;
    y: number | null;
    value?: number | number[];
    payload?: any;
}
export type AreaSettings = {
    connectNulls: boolean;
    baseValue: BaseValue | undefined;
    dataKey: DataKey<any>;
    stackId: StackId | undefined;
    data: ChartData | undefined;
};
export type ComputedArea = {
    points: ReadonlyArray<AreaPointItem>;
    baseLine: number | NullableCoordinate[];
    isRange: boolean;
};
export declare const selectArea: (state: RechartsRootState, xAxisId: AxisId, yAxisId: AxisId, isPanorama: boolean, areaSettings: AreaSettings) => ComputedArea | undefined;
