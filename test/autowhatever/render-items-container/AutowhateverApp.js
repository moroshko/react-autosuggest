import React, { Component } from 'react';
import sinon from 'sinon';
import Autowhatever from '../../../src/Autowhatever';
import items from './items';

export const renderItem = (item) => item.text;

export const renderItemsContainer = sinon.spy(
  ({ containerProps, children }) => (
    <div {...containerProps}>
      {children}
      <div className="my-items-container-footer">Footer</div>
    </div>
  )
);

export default class AutowhateverApp extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
    };
  }

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
    };

    return (
      <Autowhatever
        id="my-id"
        renderItemsContainer={renderItemsContainer}
        items={items}
        renderItem={renderItem}
        inputProps={inputProps}
      />
    );
  }
}
