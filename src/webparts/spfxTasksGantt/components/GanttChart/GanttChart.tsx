import * as React from 'react';
import { ITask } from '../../models/ITask';
import styles from './GanttChart.module.scss';
import * as moment from 'moment';
import MonthsRow from './MonthsRow/MonthsRow';
import DaysRow from './DaysRow/DaysRow';
import TaskRow from './TaskRow/TaskRow';

interface IGanttChartProps {
  tasks: ITask[];
}

const GanttChart = (props: IGanttChartProps) => {
  const { tasks } = props;

  const columnWidth = 28;
  const rowHeight = 25;

  const { minStart, maxEnd } = findDateBoundaries(tasks);
  const paddedStart = minStart.subtract(5, 'days');
  const paddedEnd = maxEnd.add(5, 'days');

  return (
    <div className={styles.ganttChart}>
      <MonthsRow 
        minDate={paddedStart}
        maxDate={paddedEnd}
        dayColumnWidth={columnWidth}
      />
      <DaysRow 
        minDate={paddedStart}
        maxDate={paddedEnd}
        dayColumnWidth={columnWidth}
      />
      <div className={styles.chart} style={{height: tasks.length * rowHeight}} >
        {tasks.map((task, index) => (
          <TaskRow 
            task={task} 
            height={rowHeight}
            dayWidth={28}
            x={0}
            y={index * rowHeight}
          />
        ))}
      </div>
    </div>
  );
}

const findDateBoundaries = (data: ITask[]): { minStart: moment.Moment, maxEnd: moment.Moment } => {
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

export default GanttChart;