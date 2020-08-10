import * as React from 'react';
import { ITask } from '../../../models/ITask';
import styles from './TaskRow.module.scss';
import * as moment from 'moment';

interface ITaskRowProps {
  task: ITask;
  height: number;
  dayWidth: number;
  x: number;
  y: number;
}

const TaskRow = (props: ITaskRowProps) => {
  const { task, x, y, height, dayWidth } = props;

  let numberOfDays = Math.abs(moment(task.startDate).diff(moment(task.dueDate), 'days'));

  let taskRowStyle: React.CSSProperties = {
    top: y,
    height: height,
    borderRadius: height / 2,
    width: dayWidth * numberOfDays
  };

  return (
    <div className={styles.taskRow} style={taskRowStyle}>
      <div></div>
    </div>
  );
}

export default TaskRow;