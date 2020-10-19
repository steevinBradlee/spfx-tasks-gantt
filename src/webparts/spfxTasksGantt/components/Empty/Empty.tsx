import * as React from 'react';
import styles from './Empty.module.scss';
import { Icon, IconNames } from '@fluentui/react';

const Empty = () => {
  return (
    <div className={styles.empty}>
      <div>
        <Icon 
          iconName={IconNames.StackedBarChart}
        />
        <div>SPFx Gantt Chart</div>
      </div>
      <div>Select a Tasks list to add to this page.</div>
    </div>
  );

}

export default Empty;