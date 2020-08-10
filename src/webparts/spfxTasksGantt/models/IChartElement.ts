import { IPredecessor } from './IPredecessor';

export interface IChartElement {
  x: number;
  y: number;
  xEnd: number;
  width: number;
  height: number;
  id: number;
  label: string;
  labelX: number;
  labelY: number;
  tooltip: string;
  predecessors: IPredecessor[];
  completionPercentage: number;
  image?: string;
}