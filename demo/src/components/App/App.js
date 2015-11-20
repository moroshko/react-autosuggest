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
      <div>
        <h2>Examples</h2>
        <ul>
          <li><a href="#minimal-setup">Minimal setup</a></li>
          <li><a href="#multiple-sections">Multiple sections</a></li>
          <li><a href="#async-example">Async example</a></li>
        </ul>
      </div>
      <div className={styles.examplesContainer}>
        <Example0 />
        <Example1 />
        <Example2 />
      </div>
    </div>
  );
}
