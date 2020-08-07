import * as React from 'react';
import { ITask } from '../../models/ITask';
import { ILine } from '../../models/ILine';
import * as d3 from 'd3';
import { scaleLinear, scaleTime, select } from 'd3';
import { IChartElement } from '../../models/IChartElement';
import { ISvgProps } from '../../models/ISvgProps';
import * as moment from 'moment';
import { flatten } from '@microsoft/sp-lodash-subset';
import styles from './GanttChart.module.scss';

interface IGanttChartProps {
  tasks: ITask[];
  onTaskClick: (taskId: number) => void;
}

interface IGanttChartState {
  tasks: ITask[];
}

export class GanttChart extends React.Component<IGanttChartProps, IGanttChartState> {

  private _svgRef: React.RefObject<SVGSVGElement> = React.createRef();
  private _elementHeight = 20;
  private _svgWidth = 1200;
  private _svgHeight = 400;
  private _fontSize = 12;

  constructor(props: IGanttChartProps) {
    super(props);
  }

  public componentDidMount() {
    const { tasks } = this.props;
    let sortedTasks = tasks.slice(0);
    sortedTasks.sort((a, b) => {
      return a.startDate.getTime() - b.startDate.getTime();
    });
    this.setState({
      tasks: sortedTasks
    }, () => {
      this._createGanttChart(this._elementHeight, 'date', true, {
        width: this._svgWidth,
        height: this._svgHeight,
        fontSize: this._fontSize
      });
    });
  }

  public componentDidUpdate(prevProps) {
    const { tasks } = this.props;
    let sortedTasks = tasks.slice(0);
    if (JSON.stringify(sortedTasks) !== JSON.stringify(prevProps.tasks)) {
      sortedTasks.sort((a, b) => {
        return a.startDate.getTime() - b.startDate.getTime();
      });
      this.setState({
        tasks: sortedTasks
      }, () => {
        this._createGanttChart(this._elementHeight, 'date', true, {
          width: this._svgWidth,
          height: this._svgHeight,
          fontSize: this._fontSize
        });
      });
    }
  }

  private _createGanttChart(elementHeight: number, sortMode: string, showRelations: boolean, svgOptions: any) {
    const { tasks } = this.state;
    const margin = (svgOptions && svgOptions.margin) || {
      top: elementHeight * 2,
      left: elementHeight * 2
    };
  
    const scaleWidth = ((svgOptions && svgOptions.width) || 600) - (margin.left * 2);
    const scaleHeight = Math.max((svgOptions && svgOptions.height) || 200, tasks.length * elementHeight * 2) - (margin.top * 2);
  
    const svgWidth = scaleWidth + (margin.left * 2);
    const svgHeight = scaleHeight + (margin.top * 2);
  
    const fontSize = (svgOptions && svgOptions.fontSize) || 12;

    const { minStart, maxEnd } = this._findDateBoundaries(tasks);

    minStart.subtract(2, 'days');
    maxEnd.add(2, 'days');

    const svgProps: ISvgProps = {
      svgWidth: svgWidth,
      svgHeigth: svgHeight,
      scaleHeight: scaleHeight,
      scaleWidth: scaleWidth,
      elementHeight: elementHeight,
      fontSize: fontSize,
      minStartDate: minStart,
      maxEndDate: maxEnd,
      margin: margin,
      showRelations: showRelations
    };

    this._createChartSvg(svgProps);
  }

  private _createChartSvg(svgProps: ISvgProps) {
    const { onTaskClick } = this.props;
    const { tasks } = this.state;

    const xScale = scaleTime()
      .domain([svgProps.minStartDate, svgProps.maxEndDate])
      .range([0, svgProps.scaleWidth]);

    // Prepare data for every data element
    const rectangleData = this._createElementData(tasks, svgProps.elementHeight, xScale, svgProps.fontSize);

    const xAxis = d3.axisBottom(xScale);
    
    // Creat container for data points
    const g1 = select(this._svgRef.current).append('g').attr('transform', `translate(${svgProps.margin.left}, ${svgProps.margin.top})`);

    if (svgProps.showRelations) {
      // create data describing connections' lines
      const polylineData = this._createPolylineData(rectangleData, svgProps.elementHeight);

      const linesContainer = g1.append('g').attr('transform', `translate(0,${svgProps.margin.top})`);

      linesContainer
        .selectAll('polyline')
        .data(polylineData)
        .enter()
        .append('polyline')
        .style('fill', 'none')
        .style('stroke', d => d.color)
        .attr('points', d => d.points);
    }

    const barsContainer = g1.append('g').attr('transform', `translate(0, ${svgProps.margin.top})`);

    g1.append('g').call(xAxis);

    const bars = barsContainer
      .selectAll('g')
      .data(rectangleData)
      .enter()
      .append('g');

    bars
      .append('rect')
      .attr('rx', svgProps.elementHeight / 2)
      .attr('ry', svgProps.elementHeight / 2)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .style('fill', '#ddd')
      .style('stroke', 'black')
      .on('click', (d: IChartElement) => {
        onTaskClick(d.id);
      });

    bars
      .append('text')
      .style('fill', 'black')
      .style('font-family', 'sans-serif')
      .attr('x', d => d.labelX)
      .attr('y', d => d.labelY)
      .text(d => d.label);

    bars
      .append('title')
      .text(d => d.tooltip);
  } 

  private _createElementData(data: ITask[], elementHeight: number, xScale: d3.ScaleTime<number, number>, fontSize: number): IChartElement[] {
    return data.map((d, i) => {
      const x = xScale(d.startDate);
      const xEnd = xScale(d.dueDate);
      const y = i * elementHeight * 1.5;
      const width = xEnd - x;
      const height = elementHeight;

      const charWidth = (width / fontSize);
      const tooltip = d.title;

      const singleCharWidth = fontSize * 0.5;
      const singleCharHeight = fontSize * 0.45;

      let label = d.title;

      if (label.length > charWidth) {
        label = label.split('').slice(0, charWidth - 3).join('') + '...';
      }

      const labelX = x + ((width / 2)) - ((label.length) / 2) * singleCharWidth;
      const labelY = y + ((height / 2) + singleCharHeight);

      return {
        x: x,
        y: y,
        xEnd: xEnd,
        id: d.id,
        width: width,
        height: height,
        label: label,
        labelX: labelX,
        labelY: labelY,
        tooltip: tooltip,
        predecessors: d.predecessors
      };
    });
  }

  private _createPolylineData(rectangleData: IChartElement[], elementHeight: number): ILine[] {
    // prepare dependencies polyline data
    const cachedData = this._createDataCacheById(rectangleData);
  
    // used to calculate offsets between elements later
    const storedConnections = rectangleData.reduce((acc, e) => ({ ...acc, [e.id]: 0 }), {});
  
    // create data describing connections' lines
    let lineDataNested =  rectangleData.map(d =>
      d.predecessors
        .map(pre => cachedData[pre.id] as IChartElement)
        .map(parent => {
          const color = '#' + (Math.max(0.1, Math.min(0.9, Math.random())) * 0xFFF << 0).toString(16);
  
          // increase the amount rows occupied by both parent and current element (d)
          storedConnections[parent.id]++;
          storedConnections[d.id]++;
  
          const deltaParentConnections = storedConnections[parent.id] * (elementHeight / 4);
          const deltaChildConnections = storedConnections[d.id] * (elementHeight / 4);
  
          const points = [
            d.x, (d.y + (elementHeight / 2)),
            d.x - deltaChildConnections, (d.y + (elementHeight / 2)),
            d.x - deltaChildConnections, (d.y - (elementHeight * 0.25)),
            parent.xEnd + deltaParentConnections, (d.y - (elementHeight * 0.25)),
            parent.xEnd + deltaParentConnections, (parent.y + (elementHeight / 2)),
            parent.xEnd, (parent.y + (elementHeight / 2))
          ];
  
          let line: ILine = {
            points: points.join(','),
            color
          };

          return line;
        })
    );

    const lineData = flatten(lineDataNested);
    return lineData;
  }

  private _findDateBoundaries(data: ITask[]): { minStart: moment.Moment, maxEnd: moment.Moment } {
    let minStartDate, maxEndDate;
    data.forEach(({ startDate, dueDate }) => {
      if (!minStartDate || moment(startDate).isBefore(minStartDate)) minStartDate = moment(startDate);
  
      if (!minStartDate || moment(dueDate).isBefore(minStartDate)) minStartDate = moment(dueDate);
  
      if (!maxEndDate || moment(dueDate).isAfter(maxEndDate)) maxEndDate = moment(dueDate);
  
      if (!maxEndDate || moment(startDate).isAfter(maxEndDate)) maxEndDate = moment(startDate);
    });
  
    return {
      minStart: minStartDate,
      maxEnd: maxEndDate
    };
  }

  private _createDataCacheById(data: IChartElement[]) {
    // Return array of chart elements in the form, [id: chartElement, ...]
    return data.reduce((cache, elt) => ({ ...cache, [elt.id]: elt }), {});
  }

  public render() {
    return (
      <div className={styles.ganttChart}>
        <svg ref={this._svgRef} width={this._svgWidth} height={this._svgHeight} >
        </svg>
      </div>
    );
  }
}