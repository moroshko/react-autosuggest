import styles from './TextareaRender.less';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'AutosuggestContainer';

const data = [
  { label: 'Alice' },
  { label: 'Bob' }
];

const getTokenForSuggestions = (str, caretPosition) => {
  let word;

  let left  = str.slice(0, caretPosition).search(/\S+$/);
  let right = str.slice(caretPosition).search(/\s/);

  if (right < 0) {
    word = str.slice(left);
  } else {
    word = str.slice(left, right + caretPosition);
  }

  if (!word || word.trim().length < 2 || word[0] !== '@') {
    return null;
  }

  word = word.trim().toLowerCase().slice(1);

  if (word.length > 0) {
    return word;
  } else {
    return null;
  }
};

const fetchSuggestions = (token) => {
  return data.filter(item => item.label.toLowerCase().slice(0, token.length) === token).map(item => ({ ...item, completion: item.label.slice(token.length) }));
};

const getSuggestionValue = suggestion => suggestion.completion;

const renderSuggestion = suggestion => (
  <span>{suggestion.label}</span>
);

const renderInputComponent = inputProps => (
  <textarea {...inputProps} />
);

export default class TextareaRender extends Component {

  constructor() {
    super();

    this.state = {
      text: '',
      suggestions: []
    };
  }

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    const node     = ReactDOM.findDOMNode(this.refs.autosuggest);
    const textarea = node.querySelector('textarea');

    if (textarea) {
      const token = getTokenForSuggestions(value, textarea.selectionStart);

      if (token !== null) {
        this.setState({ suggestions: fetchSuggestions(token) });
      } else {
        this.setState({ suggestions: [] });
      }
    }
  };

  onSuggestionSelected = (e, { suggestionValue, method }) => {
    const node     = ReactDOM.findDOMNode(this.refs.autosuggest);
    const textarea = node.querySelector('textarea');

    if (textarea) {
      const str = this.state.text;
      this.setState({ text: [str.slice(0, textarea.selectionStart), suggestionValue, str.slice(textarea.selectionStart)].join('') });
    }
  };

  handleChange = e => {
    this.setState({ text: e.target.value });
  };

  render () {
    const inputProps = {
      value: this.state.text,
      onChange: this.handleChange
    };

    return (
      <div id="textarea-render-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Textarea
          </div>
          <div className={styles.description}>
            Try typing a text with @alice or @bob
          </div>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest
            ref='autosuggest'
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderInputComponent={renderInputComponent}
            inputProps={inputProps}
          />
        </div>
      </div>
    );
  }
}
