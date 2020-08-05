import * as React from 'react';
import { ITask } from '../../models/ITask';
import * as d3 from 'd3';
import { scaleLinear, scaleTime, select } from 'd3';
import { IChartElement } from '../../models/IChartElement';
import { ISvgProps } from '../../models/ISvgProps';
import * as moment from 'moment';

interface IGanttChartProps {
  tasks: ITask[];
  onTaskClick: (taskId: number) => void;
}

export class GanttChart extends React.Component<IGanttChartProps, any> {

  private _svgRef: React.RefObject<SVGSVGElement> = React.createRef();
  private _elementHeight = 20;
  private _svgWidth = 1200;
  private _svgHeight = 400;
  private _fontSize = 12;

  constructor(props: IGanttChartProps) {
    super(props);
  }

  public componentDidMount() {
    this._createGanttChart(this._elementHeight, 'date', false, {
      width: this._svgWidth,
      height: this._svgHeight,
      fontSize: this._fontSize
    });
  }

  public componentDidUpdate() {
    this._createGanttChart(this._elementHeight, 'date', false, {
      width: this._svgWidth,
      height: this._svgHeight,
      fontSize: this._fontSize
    });
  }

  private _createGanttChart(elementHeight: number, sortMode: string, showRelations: false, svgOptions: any) {
    const { tasks } = this.props;
    const margin = (svgOptions && svgOptions.margin) || {
      top: elementHeight * 2,
      left: elementHeight * 2
    };
  
    const scaleWidth = ((svgOptions && svgOptions.width) || 600) - (margin.left * 2);
    const scaleHeight = Math.max((svgOptions && svgOptions.height) || 200, tasks.length * elementHeight * 2) - (margin.top * 2);
  
    const svgWidth = scaleWidth + (margin.left * 2);
    const svgHeight = scaleHeight + (margin.top * 2);
  
    const fontSize = (svgOptions && svgOptions.fontSize) || 12;

    let sortedTasks = tasks.slice(0);
    sortedTasks.sort((a, b) => {
      return a.startDate.getTime() - b.startDate.getTime();
    });

    const { minStart, maxEnd } = this._findDateBoundaries(sortedTasks);

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
    const { tasks, onTaskClick } = this.props;

    const xScale = scaleTime()
      .domain([svgProps.minStartDate, svgProps.maxEndDate])
      .range([0, svgProps.scaleWidth]);

    // Prepare data for every data element
    const rectangleData = this._createElementData(tasks, svgProps.elementHeight, xScale, svgProps.fontSize);

    const xAxis = d3.axisBottom(xScale);
    
    // Creat container for data points
    const g1 = select(this._svgRef.current).append('g').attr('transform', `translate(${svgProps.margin.left}, ${svgProps.margin.top})`);

    if (svgProps.showRelations) {

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
      //const dependsOn = d.
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
        tooltip: tooltip
      };
    });
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

  public render() {
    return (
      <svg ref={this._svgRef} width={this._svgWidth} height={this._svgHeight} >
      </svg>
    );
  }
}