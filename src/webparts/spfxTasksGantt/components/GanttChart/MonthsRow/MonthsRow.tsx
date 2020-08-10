import * as React from 'react';
import styles from './MonthsRow.module.scss';
import * as moment from 'moment';

interface IMonthsRowProps {
  dayColumnWidth: number;
  minDate: moment.Moment;
  maxDate: moment.Moment;
}

const MonthsRow = (props: IMonthsRowProps) => {
  const { minDate, maxDate, dayColumnWidth } = props;

  var monthDays = {};
  var date = minDate;
  do {
    let prevDate = moment(date);
    date = moment(date).endOf('month');
    if (date.isAfter(maxDate)) {
      monthDays[`${date.month()}_${date.year()}`] = Math.abs(prevDate.diff(maxDate, 'days')) + 1;
    }
    else {
      monthDays[`${date.month()}_${date.year()}`] = Math.abs(prevDate.diff(date, 'days')) + 1;
    }
    date = date.add(1, 'day');
  } while (date.isBefore(maxDate));

  return (
    <div className={styles.monthsRow}>
      {Object.keys(monthDays).map(monthYear => {
        let [month, year] = monthYear.split('_');
        let monthStyle: React.CSSProperties = {
          width: (monthDays[monthYear] * dayColumnWidth) + monthDays[monthYear] - 1,
          flexBasis: (monthDays[monthYear] * dayColumnWidth) + monthDays[monthYear] - 1
        };
        return (
          <div className={styles.month} style={monthStyle}>
            <div>
              <div>{ moment.months()[month] }</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const numberOfDaysInMonth = (minDate: moment.Moment, maxDate: moment.Moment, month: number): number => {
  if (minDate.month() === month) {
    return Math.abs(minDate.diff(minDate.endOf('month')));
  }
  else if (maxDate.month() === month) {
    return Math.abs(maxDate.startOf('month').diff(maxDate));
  } 
  else {
    return 0;
  }
}

export default MonthsRow;