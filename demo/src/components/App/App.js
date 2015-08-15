import styles from './App.less';
import theme from 'theme.less';

import React, { Component } from 'react';
import Example0 from 'Example0/Example0';

export default class App extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h1 className={styles.header}>
            React Autosuggest
          </h1>
          <h2 className={styles.subHeader}>
            Accessible and flexible React Autosuggest component
          </h2>
        </div>
        <div className={styles.examplesContainer}>
          <div className={styles.exampleContainer}>
            <Example0 />
          </div>
        </div>
      </div>
    );
  }
}
