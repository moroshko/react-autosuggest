import styles from './App.less';
import theme from 'theme.less';

import React from 'react';
import Header from 'Header/Header';
import BasicUsage from 'BasicUsage/BasicUsage';
import HighlightMatches from 'HighlightMatches/HighlightMatches';
import MultipleSections from 'MultipleSections/MultipleSections';
import AsyncExample from 'AsyncExample/AsyncExample';
import DebouncedExample from 'DebouncedExample/DebouncedExample';
import CachingExample from 'CachingExample/CachingExample';

export default function App() {
  return (
    <div className={styles.container}>
      <Header />
      <div>
        <h2>Examples</h2>
        <ul>
          <li><a href="#basic-usage">Basic usage</a></li>
          <li><a href="#highlight-matches">Highlight matches</a></li>
          <li><a href="#async-example">Async example</a></li>
          <li><a href="#multiple-sections">Multiple sections</a></li>
          <li><a href="#debounced-example">Debounced example</a></li>
          <li><a href="#caching-example">Caching example</a></li>
        </ul>
      </div>
      <div className={styles.examplesContainer}>
        <BasicUsage />
        <HighlightMatches />
        <AsyncExample />
        <MultipleSections />
        <DebouncedExample />
        <CachingExample />
      </div>
    </div>
  );
}
