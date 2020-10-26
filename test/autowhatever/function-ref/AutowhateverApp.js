import React, { Component } from 'react';
import Autowhatever from '../../../src/Autowhatever';
import items from './items';

export const renderItem = (item) => item.text;

export default class AutowhateverApp extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
    };
  }

  storeAutowhateverReference = (autowhatever) => {
    if (autowhatever !== null) {
      this.autowhatever = autowhatever; // used by the getStoredInput() helper
    }
  };

  storeInputReference = (input) => {
    this.inputRef = input;
  };

  onChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    const { value } = this.state;
    const inputProps = {
      id: 'my-custom-input',
      value,
      onChange: this.onChange,
      ref: this.storeInputReference,
    };

    return (
      <Autowhatever
        items={items}
        renderItem={renderItem}
        inputProps={inputProps}
        ref={this.storeAutowhateverReference}
      />
    );
  }
}
