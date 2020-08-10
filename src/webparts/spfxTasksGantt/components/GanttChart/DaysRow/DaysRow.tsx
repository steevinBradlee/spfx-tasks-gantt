import * as React from 'react';
import styles from './DaysRow.module.scss';
import * as moment from 'moment';

interface IDaysRowProps {
  dayColumnWidth: number;
  minDate: moment.Moment;
  maxDate: moment.Moment;
}

const DaysRow = (props: IDaysRowProps) => {
  const { minDate, maxDate, dayColumnWidth } = props;

  let days = [];
  let date = minDate;
  while (date.isBefore(maxDate)) {
    days.push(date.date());
    date = date.add(1, 'day');
  }

  return (
    <div className={styles.daysRow}>
      {days.map(day => {
        let dayStyle: React.CSSProperties = {
          width: dayColumnWidth,
          flexBasis: dayColumnWidth
        };
        return (
          <div className={styles.day} style={dayStyle}>
            <div>{ day }</div>
          </div>
        );
      })}
    </div>
  );
}

export default DaysRow;