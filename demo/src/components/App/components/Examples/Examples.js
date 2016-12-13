import styles from './Examples.less';

import React from 'react';
import Basic from 'Basic/Basic';
import MultipleSections from 'MultipleSections/MultipleSections';
import CustomRender from 'CustomRender/CustomRender';
import ScrollableContainer from 'ScrollableContainer/ScrollableContainer';
import TextareaRender from 'TextareaRender/TextareaRender';

const Examples = () => (
  <div className={styles.container}>
    <h2 className={styles.header}>
      Examples
    </h2>
    <Basic />
    <MultipleSections />
    <CustomRender />
    <ScrollableContainer />
    <TextareaRender />
  </div>
);

export default Examples;
