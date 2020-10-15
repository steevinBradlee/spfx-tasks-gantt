import * as React from 'react';
import { ITask } from '../../models/ITask';
import styles from './TasksList.module.scss';
import { Stack, StackItem, IStackTokens, IStackItemTokens } from 'office-ui-fabric-react';
import TasksListItem from './TasksListItem/TasksListItem';

interface ITasksListProps {
  tasks: ITask[];
  onTaskClick: (taskId: number) => void;
  onTaskCompletionToggle: (taskId: number, isComplete: boolean) => void;
}

/* const stackTokens: IStackTokens = {
  childrenGap: 12
};

const stackItemTokens: IStackItemTokens = {
  margin: 18
}; */

const TasksList = (props: ITasksListProps) => {
  const { tasks, onTaskClick, onTaskCompletionToggle } = props;
  return (
    <div className={styles.tasksList}>
      <Stack>
        {tasks.map((task, index) => (
          <StackItem>
            <TasksListItem 
              task={task}
              onClick={onTaskClick}
              onToggleComplete={onTaskCompletionToggle}
            />
          </StackItem>
        ))}
      </Stack>
    </div>
  );
}

export default TasksList;