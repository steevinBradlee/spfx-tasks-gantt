import * as React from 'react';
import styles from './NumberInput.module.scss';

export interface INumberInputProps {
  label?: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.MutableRefObject<any>; 
}

const NumberInput = (props: INumberInputProps) => {
  const { label, value, onChange, ref } = props;
  return (
    <div className={styles.numberInput}>
      {label &&
        <label>{ label }</label>
      }
      <input 
        type='number'
        value={value} 
        onChange={event => {
          onChange(event);
        }} 
        ref={ref}
      />
    </div>
  );
};

export default NumberInput;