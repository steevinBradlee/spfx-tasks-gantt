import * as React from 'react';
import { Calendar, DayOfWeek, DateRangeType } from 'office-ui-fabric-react/lib/Calendar';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { addDays, getDateRangeArray } from 'office-ui-fabric-react/lib/utilities/dateMath/DateMath';
import styles from './CalendarInput.module.scss';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IIconProps, Callout, DirectionalHint, Icon, IconNames } from 'office-ui-fabric-react';
import { FocusTrapZone } from 'office-ui-fabric-react/lib/FocusTrapZone';

const dayPickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  goToToday: 'Go to today',
  weekNumberFormatString: 'Week number {0}',
  prevMonthAriaLabel: 'Previous month',
  nextMonthAriaLabel: 'Next month',
  prevYearAriaLabel: 'Previous year',
  nextYearAriaLabel: 'Next year',
  prevYearRangeAriaLabel: 'Previous year range',
  nextYearRangeAriaLabel: 'Next year range',
  closeButtonAriaLabel: 'Close',
};

interface ICalendarInputProps {
  label: string;
  value: Date;
  onSelected: (date: Date) => void;
}

const CalendarInput = (props: ICalendarInputProps) => {
  const { value, onSelected, label } = props;

  const [showCalendar, setShowCalendar] = React.useState(false);

  const inputRef: React.MutableRefObject<HTMLDivElement> = React.useRef();

  const iconProps: IIconProps = { 
    iconName: 'Calendar',
  };
  
  return (
    <div className={styles.calendarInput}>
      <div style={{position: 'relative'}} ref={inputRef} >
        <TextField 
          label={label} 
          value={value.toDateString()} 
        />
        <Icon 
          onClick={() => setShowCalendar(!showCalendar)} 
          iconName={IconNames.Calendar}
          className={styles.calendarIcon}
        />
      </div>
      {showCalendar &&
        <Callout
          isBeakVisible={false}
          gapSpace={0}
          doNotLayer={false}
          directionalHint={DirectionalHint.bottomLeftEdge}
          onDismiss={() => setShowCalendar(false)}
          setInitialFocus
          target={inputRef.current}
          className={styles.callout}
        >
          <Calendar
            onSelectDate={onSelected}
            showGoToToday={true}
            value={value}
            strings={dayPickerStrings}
            isMonthPickerVisible={false}
          />
        </Callout>
      }
    </div>
  );
};

export default CalendarInput;