import styles from './App.less';
import theme from './theme.less';

import React, { Component } from 'react';
import Autowhatever from 'react-autowhatever';

const items = [{
  text: 'Apple'
}, {
  text: 'Banana'
}, {
  text: 'Cherry'
}, {
  text: 'Grapefruit'
}, {
  text: 'Lemon'
}];

function renderItem(item) {
  return (
    <span>{item.text}</span>
  );
}

const inputProps = {
  value: 'hello',
  onChange: event => console.log(event.target.value)
}

export default class App extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Autowhatever id={'1'}
                      isOpen={true}
                      items={items}
                      renderItem={renderItem}
                      inputProps={inputProps}
                      focusedItemIndex={2}
                      theme={theme} />
      </div>
    );
  }
}
