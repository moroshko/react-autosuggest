import styles from './App.less';

import React from 'react';
import Header from 'Header/Header';
import Features from 'Features/Features';
import Examples from 'Examples/Examples';
/*
import DebouncedExample from 'DebouncedExample/DebouncedExample';
import CachingExample from 'CachingExample/CachingExample';*/
import Footer from 'Footer/Footer';

export default function App() {
  return (
    <div className={styles.container}>
      <Header />
      <Features />
      <Examples />
      {/*<div>
        <h2>Examples</h2>
        <ul>
          <li><a href="#debounced-example">Debounced example</a></li>
          <li><a href="#caching-example">Caching example</a></li>
        </ul>
      </div>
      <div className={styles.examplesContainer}>
        <DebouncedExample />
        <CachingExample />
      </div>*/}
      <Footer />
    </div>
  );
}
