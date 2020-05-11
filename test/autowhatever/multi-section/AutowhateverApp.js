import React, { Component } from 'react';
import sinon from 'sinon';
import Autowhatever from '../../../src/Autowhatever';
import sections from './sections';

let app;

export const renderSectionTitle = sinon.spy((section) => (
  <strong>{section.title}</strong>
));

export const getSectionItems = sinon.spy((section) => section.items);

export const renderItem = sinon.spy((item) => <span>{item.text}</span>);

export const onKeyDown = sinon.spy(
  (event, { newHighlightedSectionIndex, newHighlightedItemIndex }) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      app.setState({
        highlightedSectionIndex: newHighlightedSectionIndex,
        highlightedItemIndex: newHighlightedItemIndex,
      });
    }
  }
);

export default class AutowhateverApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      highlightedSectionIndex: null,
      highlightedItemIndex: null,
    };
  }

  storeAutowhateverReference = (autowhatever) => {
    if (autowhatever !== null) {
      this.autowhatever = autowhatever;
    }
  };

  onChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    const { value, highlightedSectionIndex, highlightedItemIndex } = this.state;
    const inputProps = {
      value,
      onChange: this.onChange,
      onKeyDown,
    };

    return (
      <Autowhatever
        multiSection={true}
        items={sections}
        renderSectionTitle={renderSectionTitle}
        getSectionItems={getSectionItems}
        renderItem={renderItem}
        inputProps={inputProps}
        highlightedSectionIndex={highlightedSectionIndex}
        highlightedItemIndex={highlightedItemIndex}
        ref={this.storeAutowhateverReference}
      />
    );
  }
}
