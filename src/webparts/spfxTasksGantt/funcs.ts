
const dateNoTime = (date: Date): Date => {
  let dateNoTime = new Date(date.toDateString());
  dateNoTime.setHours(0);
  dateNoTime.setMinutes(0);
  dateNoTime.setSeconds(0);
  dateNoTime.setMilliseconds(0);
  return dateNoTime;
};

const equalDatesNoTime = (date1: Date, date2: Date): boolean => {
  return dateNoTime(date1).getTime() === dateNoTime(date2).getTime();
};

export { equalDatesNoTime };