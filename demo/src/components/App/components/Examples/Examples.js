import styles from './Examples.less';

import React from 'react';
import Basic from 'Basic/Basic';
import MultipleSections from 'MultipleSections/MultipleSections';
import CustomRender from 'CustomRender/CustomRender';
import ScrollableContainer from 'ScrollableContainer/ScrollableContainer';

const Examples = () =>
  <div className={styles.container}>
    <h2 className={styles.header}>Examples</h2>
    <Basic />
    <MultipleSections />
    <CustomRender />
    <ScrollableContainer />
  </div>;

export default Examples;
