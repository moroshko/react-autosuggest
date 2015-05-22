'use strict';

import React, { Component, PropTypes } from 'react';
import utils from '../utils';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function getSuggestions(input, callback) {
  const escapedInput = utils.escapeRegexCharacters(input.trim());
  const lowercasedInput = input.trim().toLowerCase();
  const suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
  const suggestions = suburbs
    .filter( suburbObj => suburbMatchRegex.test(suburbObj.suburb) )
    .sort( (suburbObj1, suburbObj2) =>
      suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput) -
      suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput)
    )
    .slice(0, 7)
    .map( suburbObj => suburbObj.suburb );

  // 'suggestions' will be an array of strings, e.g.:
  //   ['Mentone', 'Mill Park', 'Mordialloc']

  setTimeout(() => callback(null, suggestions), 300);
}

export default class EventsPlayground extends Component { // eslint-disable-line no-shadow
  static propTypes = {
    onEventAdded: PropTypes.func.isRequired
  }

  componentDidMount() {
    document.getElementById('events-playground').focus();
  }

  onSuggestionSelected(suggestion, event) {
    this.props.onEventAdded({
      type: 'suggestion-selected',
      suggestion: suggestion,
      event: event
    });
  }

  onSuggestionFocused(suggestion) {
    this.props.onEventAdded({
      type: 'suggestion-focused',
      suggestion: suggestion
    });
  }

  onSuggestionUnfocused(suggestion) {
    this.props.onEventAdded({
      type: 'suggestion-unfocused',
      suggestion: suggestion
    });
  }

  onInputChanged(value) {
    this.props.onEventAdded({
      type: 'input-changed',
      value: value
    });
  }

  onInputBlurred() {
    this.props.onEventAdded({
      type: 'input-blurred'
    });
  }

  render() {
    const inputAttributes = {
      id: 'events-playground',
      placeholder: 'Where are you now?',
      onChange: ::this.onInputChanged,
      onBlur: ::this.onInputBlurred
    };

    return (
      <div>
        <Autosuggest suggestions={getSuggestions}
                     onSuggestionSelected={::this.onSuggestionSelected}
                     onSuggestionFocused={::this.onSuggestionFocused}
                     onSuggestionUnfocused={::this.onSuggestionUnfocused}
                     inputAttributes={inputAttributes} />
        <SourceCodeLink file="examples/src/EventsPlayground/EventsPlayground.js" />
      </div>
    );
  }
}
