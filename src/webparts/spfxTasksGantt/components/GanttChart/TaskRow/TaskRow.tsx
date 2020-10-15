import * as React from 'react';
import { ITask } from '../../../models/ITask';
import styles from './TaskRow.module.scss';
import * as moment from 'moment';
import { isEmpty } from '@microsoft/sp-lodash-subset';

interface ITaskRowProps {
  task: ITask;
  height: number;
  dayWidth: number;
  x: number;
  y: number;
  onTaskClick: (taskId: number) => void;
}

const TaskRow = (props: ITaskRowProps) => {
  const { task, x, y, height, dayWidth, onTaskClick } = props;

  let numberOfDays = Math.abs(moment(task.startDate).diff(moment(task.dueDate), 'days'));

  let taskRowStyle: React.CSSProperties = {
    top: y,
    left: x,
    height: height - 4,
    //borderRadius: height / 2,
    width: (dayWidth * numberOfDays) + numberOfDays
  };

  let completionStyle: React.CSSProperties = {
    width: (dayWidth * numberOfDays) * task.percentComplete,
    //borderRadius: height / 2,
  };

  let assignedToStyle: React.CSSProperties = {
    height: height - 4,
    width: height,
    //borderRadius: height / 2
  }

  let assignedToImage = !isEmpty(task.assignedTo) ? task.assignedTo[0].imageUrl : ''

  return (
    <div className={styles.taskRow} style={taskRowStyle} onClick={() => onTaskClick(task.id)}>
      <div className={styles.completionAmount} style={completionStyle}></div>
      {task.assignedTo &&
        <div className={`${styles.assignedTo}`} style={assignedToStyle}>
          {task.assignedTo.length === 1 ?
            <img src={task.assignedTo[0].imageUrl}/>
            :
            <div></div>
          }
        </div>
      }
    </div>
  );
}

export default TaskRow;