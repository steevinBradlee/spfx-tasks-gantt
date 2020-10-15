import * as React from 'react';
import { ITask } from '../../models/ITask';
import { getTheme, IIconProps, IDropdownOption, Dropdown, PanelType, Panel } from '@fluentui/react';
import styles from './ViewEditTaskPanel.module.scss';
import { TextField, MaskedTextField } from '@fluentui/react';
import { Stack, IStackProps, IStackStyles } from '@fluentui/react';
import EditableLabel from '../EditableLabel/EditableLabel';
import CalendarInput from '../CalendarInput/CalendarInput';
import calendarStyles from '../CalendarInput/CalendarInput.module.scss';
import { find } from '@microsoft/sp-lodash-subset';
import GanttPeoplePicker from '../GanttPeoplePicker/GanttPeoplePicker';
import peoplePickerStyles from '../GanttPeoplePicker/GanttPeoplePicker.module.scss';
import { IUser } from '../../models/IUser';
import NumberInput from '../NumberInput/NumberInput';
import { IPredecessor } from '../../models/IPredecessor';

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

interface IViewEditTaskPanelProps {
  task: ITask;
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => any;
  onPropertyChange: (taskId: number, propertyName: string, propertyValue: any) => any;
  onPersonPropertyChange: (taskId: number, propertyName: string, propertyValue: any) => any;
  onPredecessorsPropertyChange: (taskId: number, predecessors: IPredecessor[]) => any;
  statusOptions: IDropdownOption[];
  priorityOptions: IDropdownOption[];
  predecessorOptions: IDropdownOption[];
}

const ViewEditTaskPanel: React.FunctionComponent<IViewEditTaskPanelProps> = (props: IViewEditTaskPanelProps) => {
  const { isPanelOpen, setIsPanelOpen, task, predecessorOptions, onPropertyChange, onPersonPropertyChange, onPredecessorsPropertyChange, statusOptions, priorityOptions } = props;

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

  const [percentComplete, setPercentComplete] = React.useState(`${task.percentComplete * 100}`);
  const percentCompleteRef = React.useRef();

  const [status, setStatus] = React.useState(find(statusOptions, option => option.key === task.status));
  const statusRef = React.useRef();

  const [priority, setPriority] = React.useState(find(priorityOptions, option => option.key === task.priority));
  const priorityRef = React.useRef();

  let selectedPredecessorOptions: IDropdownOption[] = predecessorOptions.filter(preOpt => find(task.predecessors, pre => String(pre.id) === preOpt.key));
  const [predecessors, setPredecessors] = React.useState(selectedPredecessorOptions);
  const predecessorsRef = React.useRef();

  React.useEffect(() => {
    if (task.id !== taskId) {
      setTitle(task.title);
      setAssignedTo(task.assignedTo);
      setDescription(task.description);
      setStartDate(task.startDate);
      setDueDate(task.dueDate);
      setPercentComplete(`${task.percentComplete * 100}`);
      setStatus(find(statusOptions, option => option.key === task.status));
      let selectedPredecessorOptions: IDropdownOption[] = predecessorOptions.filter(preOpt => find(task.predecessors, pre => String(pre.id) === preOpt.key));
      setPredecessors(selectedPredecessorOptions);
    }
  }, [task]);

  return (
    <div>
      <Panel
        isOpen={isPanelOpen}
        type={PanelType.medium}
        closeButtonAriaLabel='Close'
        headerText='Edit Task'
        onDismiss={() => setIsPanelOpen(false)}
      >
        <div className={styles.container}>
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
                      setDescription(newValue);
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
                  onClickOutside={(newPercentComplete) => {
                    let newPercent = parseFloat(newPercentComplete) / 100;
                    onPropertyChange(task.id, 'percentComplete', newPercent);
                  }}
                >
                  <NumberInput
                    label={'% Complete'}
                    value={parseFloat(percentComplete)}
                    ref={percentCompleteRef}
                    onChange={(event) => {
                      setPercentComplete(event.currentTarget.value);
                    }}
                  />
                </EditableLabel>
              </div>
              <div>
                <EditableLabel
                  label={'Status'}
                  value={status}
                  displayValue={`${status.text}`}
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
              <div>
                <EditableLabel
                  label={'Priority'}
                  value={priority}
                  displayValue={`${priority.text}`}
                  type={'text'}
                  childRef={priorityRef}
                  onClickOutside={(newPriority) => onPropertyChange(task.id, 'priority', newPriority.key)}
                  relatedFocusTarget={DROPDOWN_CONTAINER_CLASSNAME}
                >
                  <Dropdown
                    placeholder='Select an option'
                    selectedKey={priority.key}
                    label='Priority'
                    options={priorityOptions}
                    onChange={(event, option) => {
                      setPriority(option);
                    }}
                    className={DROPDOWN_CONTAINER_CLASSNAME}
                  />
                </EditableLabel>
              </div>
              <div>
                <EditableLabel
                  label={'Predecessors'}
                  value={predecessors}
                  displayValue={predecessorsString(predecessors)}
                  type={'text'}
                  childRef={predecessorsRef}
                  onClickOutside={(newPredecessors) => onPredecessorsPropertyChange(task.id, newPredecessors.map(pre => ({id: pre.key, title: pre.text})))}
                  relatedFocusTarget={DROPDOWN_CONTAINER_CLASSNAME}
                >
                  <Dropdown
                    placeholder='Select task predecessors'
                    multiSelect
                    selectedKeys={predecessors.map(pre => `${pre.key}`)}
                    label='Predecessors'
                    options={predecessorOptions}
                    onChange={(event, option) => {
                      if (option) {
                        setPredecessors(
                          option.selected ? 
                            [...predecessors, option] : 
                            predecessors.filter(pre => pre.key !== option.key) 
                        );
                      }
                    }}
                    className={DROPDOWN_CONTAINER_CLASSNAME}
                  />
                </EditableLabel>
              </div>
            </Stack>
          </div>      
        </div>
      </Panel>
    </div>
  );
};

function predecessorsString(predecessors: IDropdownOption[]) {
  return predecessors.reduce((accumulator, currentValue, index) => {
    return accumulator + `${currentValue.text}${index < predecessors.length - 1 ? ', ' : ''}`;
  }, '');
}

export default ViewEditTaskPanel;