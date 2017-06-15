import styles from './App.less';

import React from 'react';
import Header from 'Header/Header';
import Features from 'Features/Features';
import Examples from 'Examples/Examples';
import Footer from 'Footer/Footer';

const App = () =>
  <div className={styles.container}>
    <Header />
    <Features />
    <Examples />
    <Footer />
  </div>;

export default App;
