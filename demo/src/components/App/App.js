import styles from './App.less';

import React from 'react';
import Header from 'Header/Header';
import Features from 'Features/Features';
import Playground from 'Playground/Playground';
import Footer from 'Footer/Footer';

export default function App() {
  return (
    <div className={styles.container}>
      <Header />
      <Features />
      <Playground />
      <Footer />
    </div>
  );
}
