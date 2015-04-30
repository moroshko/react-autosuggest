'use strict';

import React, { Component, PropTypes } from 'react';
import utils from '../utils';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function getSuggestions(input, callback) {
  let escapedInput = utils.escapeRegexCharacters(input.trim());
  let lowercasedInput = input.trim().toLowerCase();
  let suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
  let suggestions = suburbs
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

export default class EventsPlayground extends Component {
  static propTypes = {
    onEventAdded: PropTypes.func.isRequired
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

  render() {
    let inputAttributes = {
      id: 'events-playground',
      placeholder: 'Where are you now?'
    };

    return (
      <div>
        <Autosuggest suggestions={getSuggestions}
                     onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                     onSuggestionFocused={this.onSuggestionFocused.bind(this)}
                     onSuggestionUnfocused={this.onSuggestionUnfocused.bind(this)}
                     inputAttributes={inputAttributes}
                     ref={ () => document.getElementById('events-playground').focus() } />
        <SourceCodeLink file="examples/src/EventsPlayground/EventsPlayground.js" />
      </div>
    );
  }
}
