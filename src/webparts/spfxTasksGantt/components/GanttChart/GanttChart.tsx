import * as React from 'react';
import { ITask } from '../../models/ITask';
import styles from './GanttChart.module.scss';
import * as moment from 'moment';
import MonthsRow from './MonthsRow/MonthsRow';
import DaysRow from './DaysRow/DaysRow';
import TaskRow from './TaskRow/TaskRow';

interface IGanttChartProps {
  tasks: ITask[];
  onTaskClick: (taskId: number) => void;
}

const GanttChart = (props: IGanttChartProps) => {
  const { tasks, onTaskClick } = props;

  const columnWidth = 28;
  const rowHeight = 25;

  const { minStart, maxEnd } = findDateBoundaries(tasks);
  const paddedStart = minStart.subtract(5, 'days');
  const paddedEnd = maxEnd.add(5, 'days');

  let days = [];
  let date = moment(paddedStart);
  while (date.isBefore(paddedEnd)) {
    days.push(date.date());
    date = date.add(1, 'day');
  }

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${days.length}, ${columnWidth + 1}px)`,
    gridTemplateRows: `repeat(${tasks.length}, ${rowHeight}px)`
  }

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
        days={days}
      />
      <div className={styles.chart} >
        <div className={styles.grid} style={gridStyle}>
          {tasks.map(row => {
            return days.map((col, colIndex) => (
              <div className={`${styles.cell} ${colIndex === 0 ? styles.first : ''}`} /* style={{height: `${rowHeight}px`}} */></div>
            ))
          })}
        </div>
        {tasks.map((task, index) => {
          let numDaysFromStart = numDaysBetween(paddedStart, moment(task.startDate));
          return (
            <TaskRow 
              task={task} 
              height={rowHeight}
              dayWidth={columnWidth}
              x={(numDaysFromStart * columnWidth) + numDaysFromStart}
              y={(index * rowHeight) + 2}
              onTaskClick={onTaskClick}
            />
          );
        })}
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

const numDaysBetween = (date1: moment.Moment, date2: moment.Moment): number => {
  return Math.abs(date1.diff(date2, 'days'));
}

export default GanttChart;