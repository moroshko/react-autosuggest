import styles from './App.less';

import React from 'react';
import Header from 'Header/Header';
import Features from 'Features/Features';
import Examples from 'Examples/Examples';
import Footer from 'Footer/Footer';

export default function App() {
  return (
    <div className={styles.container}>
      <Header />
      <Features />
      <Examples />
      <Footer />
    </div>
  );
}
