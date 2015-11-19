import styles from './App.less';
import theme from 'theme.less';

import React from 'react';
import Example0 from 'Example0/Example0';
import Example1 from 'Example1/Example1';
import Example2 from 'Example2/Example2';

export default function App() {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>
          React Autosuggest
        </h1>
        <h2 className={styles.subHeader}>
          Accessible and flexible React autosuggest component
        </h2>
      </div>
      <div className={styles.examplesContainer}>
        <div className={styles.exampleContainer}>
          <Example0 />
        </div>
        <div className={styles.exampleContainer}>
          <Example1 />
        </div>
        <div className={styles.exampleContainer}>
          <Example2 />
        </div>
      </div>
    </div>
  );
}
