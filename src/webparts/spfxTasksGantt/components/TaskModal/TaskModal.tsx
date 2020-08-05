import * as React from 'react';
import { ITask } from '../../models/ITask';
import { IconButton, getTheme, Modal, IIconProps, IDropdownOption, Dropdown, IPersonaProps } from 'office-ui-fabric-react';
import styles from './TaskModal.module.scss';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import EditableLabel from '../EditableLabel/EditableLabel';
import CalendarInput from '../CalendarInput/CalendarInput';
import calendarStyles from '../CalendarInput/CalendarInput.module.scss';
import { find } from '@microsoft/sp-lodash-subset';
import GanttPeoplePicker from '../GanttPeoplePicker/GanttPeoplePicker';
import peoplePickerStyles from '../GanttPeoplePicker/GanttPeoplePicker.module.scss';
import { IUser } from '../../models/IUser';

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const theme = getTheme();
const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const stackTokens = { childrenGap: 50 };
const iconProps = { iconName: 'Calendar' };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};

const DROPDOWN_CONTAINER_CLASSNAME = '.ms-Callout.ms-Dropdown-callout';

interface ITaskModalProps {
  task: ITask;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => any;
  onPropertyChange: (taskId: number, propertyName: string, propertyValue: any) => any;
  onPersonPropertyChange: (taskId: number, propertyName: string, propertyValue: any) => any;
  statusOptions: IDropdownOption[];
}

const TaskModal: React.FunctionComponent<ITaskModalProps> = (props: ITaskModalProps) => {
  const { isModalOpen, setIsModalOpen, task, onPropertyChange, onPersonPropertyChange, statusOptions } = props;

  const [taskId, setTaskId] = React.useState(task.id);

  const [title, setTitle] = React.useState(task.title);
  const titleRef = React.useRef();

  const [assignedTo, setAssignedTo] = React.useState(task.assignedTo);
  const assignedToRef = React.useRef();

  const [startDate, setStartDate] = React.useState(task.startDate);
  const startDateRef = React.useRef();

  const [dueDate, setDueDate] = React.useState(task.dueDate);
  const dueDateRef = React.useRef();

  const [description, setDescription] = React.useState(task.description);
  const descriptionRef = React.useRef();

  const [percentComplete, setPercentComplete] = React.useState(task.percentComplete);
  const percentCompleteRef = React.useRef();

  const [status, setStatus] = React.useState(find(statusOptions, option => option.key === task.status));
  const statusRef = React.useRef();

  React.useEffect(() => {
    if (task.id !== taskId) {
      setTitle(task.title);
      setAssignedTo(task.assignedTo);
      setDescription(task.description);
      setStartDate(task.startDate);
      setDueDate(task.dueDate);
      setPercentComplete(task.percentComplete);
      setStatus(find(statusOptions, option => option.key === task.status));
    }
  }, [task]);

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        isBlocking={false}
        containerClassName={styles.modalContainer}
        styles={{
          main: {
            maxWidth: '768px'
          }
        }}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <Stack tokens={stackTokens}>
              <Stack.Item align='end'>
                <IconButton
                  styles={iconButtonStyles}
                  iconProps={cancelIcon}
                  ariaLabel='Close task modal'
                  onClick={() => setIsModalOpen(false)}
                />
              </Stack.Item>
            </Stack>
          </div>
          <div className={styles.body}>
            <Stack>
              <div>
                <EditableLabel
                  label={'Title'}
                  value={title}
                  type={'text'}
                  childRef={titleRef}
                  onClickOutside={(newTitle) => onPropertyChange(task.id, 'title', newTitle)}
                >
                  <TextField 
                    label='Title' 
                    value={title} 
                    onChange={(event, newValue) => {
                      setTitle(newValue);
                    }} 
                    componentRef={titleRef}
                  />
                </EditableLabel>
              </div>
              <div>
                <EditableLabel
                  label={'Assigned To'}
                  value={assignedTo}
                  displayValue={assignedTo.map(user => user.text).join(', ')}
                  type={'text'}
                  childRef={assignedToRef}
                  onClickOutside={(newAssignedTo) => onPersonPropertyChange(task.id, 'assignedTo', newAssignedTo)}
                  relatedFocusTarget={`.${peoplePickerStyles.callout}`}
                >
                  <GanttPeoplePicker 
                    label={'Assigned To'}
                    value={assignedTo}
                    onSelected={(newAssignedTo: IUser[]) => {
                      setAssignedTo(newAssignedTo);
                    }}
                  />
                </EditableLabel>  
              </div>
              <div>
                <EditableLabel
                  label={'Start Date'}
                  value={startDate.toDateString()}
                  type={'date'}
                  childRef={startDateRef}
                  onClickOutside={(newStartDate) => onPropertyChange(task.id, 'startDate', new Date(newStartDate))}
                  relatedFocusTarget={`.${calendarStyles.callout}`}
                >
                  <CalendarInput
                    label='Start Date'
                    value={startDate}
                    onSelected={(newDate: Date) => {
                      setStartDate(newDate);
                    }}
                  />
                </EditableLabel>
              </div>
              <div>
                <EditableLabel
                  label={'Due Date'}
                  value={dueDate.toDateString()}
                  type={'date'}
                  childRef={dueDateRef}
                  onClickOutside={(newDueDate) => onPropertyChange(task.id, 'dueDate', new Date(newDueDate))}
                  relatedFocusTarget={`.${calendarStyles.callout}`}
                >
                  <CalendarInput
                    label='Due Date'
                    value={dueDate}
                    onSelected={(newDate: Date) => {
                      setDueDate(newDate);
                    }}
                  />
                </EditableLabel>
              </div>
              <div>
                <EditableLabel
                  label={'Description'}
                  value={description}
                  type={'textarea'}
                  childRef={descriptionRef}
                  onClickOutside={(newDescription) => onPropertyChange(task.id, 'description', newDescription)}
                >
                  <TextField 
                    label='Description' 
                    value={description} 
                    onChange={(event, newValue) => {
                      setTitle(newValue);
                    }} 
                    componentRef={descriptionRef}
                  />
                </EditableLabel>
              </div>
              <div>
                <EditableLabel
                  label={'% Complete'}
                  value={`${percentComplete}`}
                  type={'text'}
                  childRef={percentCompleteRef}
                  onClickOutside={(newPercentComplete) => onPropertyChange(task.id, 'percentComplete', newPercentComplete)}
                >
                  <TextField 
                    label='% Complete' 
                    value={`${percentComplete}`} 
                    onChange={(event, newValue) => {
                      setPercentComplete(parseInt(newValue));
                    }} 
                    componentRef={percentCompleteRef}
                  />
                </EditableLabel>
              </div>
              <div>
                <EditableLabel
                  label={'Status'}
                  value={`${status.text}`}
                  type={'text'}
                  childRef={statusRef}
                  onClickOutside={(newStatus) => onPropertyChange(task.id, 'status', newStatus.key)}
                  relatedFocusTarget={DROPDOWN_CONTAINER_CLASSNAME}
                >
                  <Dropdown
                    placeholder='Select an option'
                    selectedKey={status.key}
                    label='Status'
                    options={statusOptions}
                    onChange={(event, option) => {
                      setStatus(option);
                    }}
                    className={DROPDOWN_CONTAINER_CLASSNAME}
                  />
                </EditableLabel>
              </div>
            </Stack>
          </div>
          <div className={styles.footer}>
          </div>          
        </div>
      </Modal>
    </div>
  );
};

export default TaskModal;