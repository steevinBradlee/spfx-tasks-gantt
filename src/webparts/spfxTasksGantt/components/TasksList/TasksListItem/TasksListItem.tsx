import * as React from 'react';
import { ITask } from '../../../models/ITask';
import styles from './TasksListItem.module.scss';
import { Icon, IconNames, Text } from 'office-ui-fabric-react';

interface ITasksListItemProps {
  task: ITask;
  onClick: (taskId: number) => void;
  onToggleComplete: (taskId: number, isComplete: boolean) => void;
}

const TasksListItem = (props: ITasksListItemProps) => {
  const { task, onClick, onToggleComplete } = props;

  let isCompleted = task.status === 'Completed';

  return (
    <div className={`${styles.tasksListItem} ${isCompleted && styles.completed}`}>
      <Icon 
        iconName={isCompleted ? IconNames.CheckboxComposite : IconNames.Checkbox}
        onClick={() => {
          event.stopPropagation()
          onToggleComplete(task.id, !isCompleted);
        }}
      ></Icon>
      <Text 
        variant='mediumPlus' 
        onClick={(event) => {
          event.stopPropagation();
          onClick(task.id);
        }} 
      >{ task.title }</Text>
    </div>
  );
}

export default TasksListItem;