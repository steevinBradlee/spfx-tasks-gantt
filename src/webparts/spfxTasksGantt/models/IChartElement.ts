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
  predecessors: number[];
}