import styles from './App.less';
import theme from 'theme.less';

import React from 'react';
import MinimalSetup from 'MinimalSetup/MinimalSetup';
import MultipleSections from 'MultipleSections/MultipleSections';
import AsyncExample from 'AsyncExample/AsyncExample';
import DebouncedExample from 'DebouncedExample/DebouncedExample';
import CachingExample from 'CachingExample/CachingExample';

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
          <li><a href="#debounced-example">Debounced example</a></li>
          <li><a href="#caching-example">Caching example</a></li>
        </ul>
      </div>
      <div className={styles.examplesContainer}>
        <MinimalSetup />
        <MultipleSections />
        <AsyncExample />
        <DebouncedExample />
        <CachingExample />
      </div>
    </div>
  );
}
