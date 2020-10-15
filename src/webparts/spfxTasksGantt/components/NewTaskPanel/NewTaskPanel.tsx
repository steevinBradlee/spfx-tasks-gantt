import * as React from 'react';
import { IDropdownOption, Dropdown, PanelType, Panel, DefaultButton, PrimaryButton } from '@fluentui/react';
import styles from './NewTaskPanel.module.scss';
import { TextField } from '@fluentui/react';
import CalendarInput from '../CalendarInput/CalendarInput';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import GanttPeoplePicker from '../GanttPeoplePicker/GanttPeoplePicker';
import { IUser } from '../../models/IUser';
import NumberInput from '../NumberInput/NumberInput';

const DROPDOWN_CONTAINER_CLASSNAME = '.ms-Callout.ms-Dropdown-callout';

interface INewTaskPanelProps {
  isPanelOpen: boolean;
  setIsPanelOpen: (isOpen: boolean) => any;
  onSubmit: (taskProperties: any) => any;
  statusOptions: IDropdownOption[];
  priorityOptions: IDropdownOption[];
  predecessorOptions: IDropdownOption[];
}

const NewTaskPanel = (props: INewTaskPanelProps) => {
  const { isPanelOpen, setIsPanelOpen, predecessorOptions, onSubmit, statusOptions, priorityOptions } = props;

  const [isValid, setIsValid] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const titleRef = React.useRef();

  const [assignedTo, setAssignedTo] = React.useState([]);
  //const assignedToRef = React.useRef();

  const [startDate, setStartDate] = React.useState(new Date());
  //const startDateRef = React.useRef();

  const [dueDate, setDueDate] = React.useState(new Date());
  //const dueDateRef = React.useRef();

  const [description, setDescription] = React.useState('');
  //const descriptionRef = React.useRef();

  const [percentComplete, setPercentComplete] = React.useState(0);
  //const percentCompleteRef = React.useRef();

  const [status, setStatus] = React.useState(null);
  //const statusRef = React.useRef();

  const [priority, setPriority] = React.useState(null);
  //const priorityRef = React.useRef();

  const [predecessors, setPredecessors] = React.useState([]);
  //const predecessorsRef = React.useRef();

  /* React.useEffect(() => {
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
  }, [task]); */
  /* const submitForm = (taskProperties: any) => {
    if (!isEmpty(taskProperties.title)) {
      onSubmit(taskProperties);
    }
  } */

  return (
    <div>
      <Panel
        isOpen={isPanelOpen}
        type={PanelType.medium}
        closeButtonAriaLabel='Close'
        headerText='New Task'
        onDismiss={() => setIsPanelOpen(false)}
      >
        <div className={styles.container}>
          <div className={styles.body}>
            <form onSubmit={(event) => {
              event.preventDefault();
              const taskProperties = {
                title: title,
                description: description,
                percentComplete: percentComplete,
                startDate: startDate,
                dueDate: dueDate,
                status: status.text,
                predecessors: predecessors,
                assignedTo: assignedTo,
                priority: priority.text
              }
              if (isValid) {
                onSubmit(taskProperties);
                setIsPanelOpen(false);
              }
            }}>
              <div>
                <div>
                  <TextField 
                    label='Title' 
                    value={title} 
                    onChange={(event, newValue) => {
                      setTitle(newValue);
                      setIsValid(!isEmpty(newValue));
                    }} 
                    required
                    //errorMessage={`You can't leave this blank`}
                    autoFocus
                    componentRef={titleRef}
                    
                    /* onGetErrorMessage={value => {
                      return titleRef.current && !isFocused(titleRef.current) ? (isEmpty(value) ? `You can't leave this blank` : '') : '';
                    }} */
                  />
                </div>
                <div>
                  <GanttPeoplePicker 
                    label={'Assigned To'}
                    value={assignedTo}
                    onSelected={(newAssignedTo: IUser[]) => {
                      setAssignedTo(newAssignedTo);
                    }}
                  />
                </div>
                <div>
                  <CalendarInput
                    label='Start Date'
                    value={startDate}
                    onSelected={(newDate: Date) => {
                      setStartDate(newDate);
                    }}
                  />
                </div>
                <div>
                  <CalendarInput
                    label='Due Date'
                    value={dueDate}
                    onSelected={(newDate: Date) => {
                      setDueDate(newDate);
                    }}
                  />
                </div>
                <div>
                  <TextField 
                    label='Description' 
                    value={description} 
                    onChange={(event, newValue) => {
                      setDescription(newValue);
                    }} 
                  />
                </div>
                <div>
                  <NumberInput
                    label={'% Complete'}
                    value={percentComplete}
                    onChange={(event) => {
                      setPercentComplete(parseFloat(event.currentTarget.value));
                    }}
                  />
                </div>
                <div>
                  <Dropdown
                    placeholder='Select an option'
                    //selectedKey={status.key}
                    label='Status'
                    options={statusOptions}
                    onChange={(event, option) => {
                      setStatus(option);
                    }}
                    className={DROPDOWN_CONTAINER_CLASSNAME}
                  />
                </div>
                <div>
                  <Dropdown
                    placeholder='Select an option'
                    //selectedKey={priority.key}
                    label='Priority'
                    options={priorityOptions}
                    onChange={(event, option) => {
                      setPriority(option);
                    }}
                    className={DROPDOWN_CONTAINER_CLASSNAME}
                  />
                </div>
                <div>
                  <Dropdown
                    placeholder='Select task predecessors'
                    multiSelect
                    //selectedKeys={predecessors.map(pre => `${pre.key}`)}
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
                </div>
              </div>
              <div className={styles.footer}>
                <PrimaryButton disabled={!isValid} text='Save' type='submit'/* onClick={() => setIsPanelOpen(false)} */ />
                <DefaultButton text='Cancel' onClick={() => setIsPanelOpen(false)} />
              </div>
            </form>
          </div>      
        </div>
      </Panel>
    </div>
  );
};

/* function isFocused(element: HTMLElement): boolean {
  return element.contains(document.activeElement as Element);
} */

export default NewTaskPanel;