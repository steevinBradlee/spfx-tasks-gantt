import * as moment from 'moment';

export interface ISvgProps {
  svgWidth: number;
  svgHeigth: number;
  scaleWidth: number;
  elementHeight: number;
  scaleHeight: number;
  fontSize: number;
  minStartDate: moment.Moment;
  maxEndDate: moment.Moment;
  margin: {
    top: number,
    bottom: number,
    left: number,
    right: number
  };
  showRelations: boolean;
}