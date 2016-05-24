import styles from './Select.less';
import theme from './theme.less';

import React, { Component } from 'react';
import Link from 'Link/Link';
import Autosuggest from 'AutosuggestContainer';
import options from './options';

function identity(x) {
  return x;
}

function always() {
  return true;
}

function renderInput(inputProps) {
  return (
    <div {...inputProps}><span className={theme.arrow}>{inputProps.value.label}</span></div>
  );
}

function renderSuggestion(suggestion, { value }) {
  const highlight = suggestion === value;

  return (
    <span className={`${theme.option} ${highlight ? theme.optionHighlighted : ''}`}>
      {highlight ? <span className={theme.icon} /> : null}
      {suggestion.label}
    </span>
  );
}

export default class Select extends Component {
  constructor() {
    super();

    this.state = {
      value: options[0],
      displayValue: null
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event, { suggestion }) {
    this.setState({
      value: suggestion,
      displayValue: null
    });
  }

  render() {
    const { value, displayValue } = this.state;
    const inputProps = {
      tabIndex: 0,
      autoComplete: null,
      type: null,
      value: (displayValue || value),
      onChange: (_, { newValue }) => this.setState({ displayValue: newValue }),
      onBlur: () => this.setState({ displayValue: null })
    };

    return (
      <div id="basic-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Select List
          </div>
          <div className={styles.description}>
            Can also mimic the behaviour of a select list, useful if you want to reuse styles for
            select and autocomplete components.
          </div>
          <Link className={styles.codepenLink}
                href="http://codepen.io/moroshko/pen/LGNJMy" underline={false}>
            Codepen
          </Link>
        </div>
        <div className={styles.autosuggest}>
          Option:
          <Autosuggest suggestions={options}
                       shouldRenderSuggestions={always}
                       getSuggestionValue={identity}
                       renderSuggestion={renderSuggestion}
                       renderInput={renderInput}
                       onSuggestionSelected={this.onChange}
                       inputProps={inputProps}
                       wrapItemFocus={false}
                       blurOnSuggestionSelect={true}
                       focusInputOnSuggestionClick={false}
                       theme={theme}
                       id="select-example" />
        </div>
      </div>
    );
  }
}
