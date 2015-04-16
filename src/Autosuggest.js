'use strict';

import React, { Component, PropTypes, findDOMNode } from 'react';
import debounce from 'debounce';
import classnames from 'classnames';
import sectionIterator from './sectionIterator';

let lastSuggestionsInputValue = null, lastFocusedSuggestion = null, guid = 0;

export default class Autosuggest extends Component {
  constructor(props) {
    super();

    guid += 1;
    this.id = guid;
    this.cache = {};
    this.state = {
      value: props.inputAttributes.value || '',
      suggestions: null,
      focusedSectionIndex: null,    // Used when multiple sections are displayed
      focusedSuggestionIndex: null, // Index within a section
      valueBeforeUpDown: null       // When user interacts using the Up and Down keys,
                                    // this field remembers input's value prior to
                                    // interaction in order to revert back if ESC hit.
                                    // See: http://www.w3.org/TR/wai-aria-practices/#autocomplete
    };
    this.suggestionsFn = debounce(props.suggestions, 100);
  }

  resetSectionIterator(suggestions) {
    if (this.isMultipleSections(suggestions)) {
      sectionIterator.setData(suggestions.map( suggestion => suggestion.suggestions.length ));
    } else {
      sectionIterator.setData(suggestions === null ? [] : suggestions.length);
    }
  }

  isMultipleSections(suggestions) {
    return suggestions !== null &&
           suggestions.length > 0 &&
           typeof suggestions[0].suggestions !== 'undefined';
  }

  setSuggestionsState(suggestions) {
    this.resetSectionIterator(suggestions);
    this.setState({
      suggestions: suggestions,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    });
  }

  suggestionsExist(suggestions) {
    if (this.isMultipleSections(suggestions)) {
      return suggestions.some(section => section.suggestions.length > 0);
    }

    return suggestions !== null && suggestions.length > 0;
  }

  showSuggestions(input) {
    lastSuggestionsInputValue = input;

    if (!this.props.showWhen(input)) {
      this.setSuggestionsState(null);
    } else if (this.cache[input]) {
      this.setSuggestionsState(this.cache[input]);
    } else {
      this.suggestionsFn(input, (error, suggestions) => {
        // If input value changed, suggestions are not relevant anymore.
        if (lastSuggestionsInputValue !== input) {
          return;
        }

        if (error) {
          throw error;
        } else {
          if (!this.suggestionsExist(suggestions)) {
            suggestions = null;
          }

          this.cache[input] = suggestions;
          this.setSuggestionsState(suggestions);
        }
      });
    }
  }

  getSuggestion(sectionIndex, suggestionIndex) {
    if (this.isMultipleSections(this.state.suggestions)) {
      return this.state.suggestions[sectionIndex].suggestions[suggestionIndex];
    }

    return this.state.suggestions[suggestionIndex];
  }

  getSuggestionValue(sectionIndex, suggestionIndex) {
    let suggestion = this.getSuggestion(sectionIndex, suggestionIndex);

    if (typeof suggestion === 'object') {
      if (this.props.suggestionValue) {
        return this.props.suggestionValue(suggestion);
      }

      throw new Error('When <suggestion> is an object, you must implement the suggestionValue() function to specify how to set input\'s value when suggestion selected.');
    } else {
      return suggestion.toString();
    }
  }

  focusOnSuggestion(suggestionPosition) {
    let [sectionIndex, suggestionIndex] = suggestionPosition;
    let suggestion = this.getSuggestion(sectionIndex, suggestionIndex);
    let newState = {
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex,
      value: suggestionIndex === null
               ? this.state.valueBeforeUpDown
               : this.getSuggestionValue(sectionIndex, suggestionIndex)
    };

    // When users starts to interact with up/down keys, remember input's value.
    if (this.state.valueBeforeUpDown === null) {
      newState.valueBeforeUpDown = this.state.value;
    }

    this.setState(newState);

    this.props.onSuggestionUnfocused(lastFocusedSuggestion);
    lastFocusedSuggestion = suggestion;
    this.props.onSuggestionFocused(suggestion);
  }

  onInputChange(event) {
    let newValue = event.target.value;

    this.setState({
      value: newValue,
      valueBeforeUpDown: null
    });

    this.showSuggestions(newValue);
  }

  onInputKeyDown(event) {
    let newState, newSectionIndex, newSuggestionIndex;

    switch (event.keyCode) {
      case 13: // enter
        if (this.state.valueBeforeUpDown !== null && this.state.focusedSuggestionIndex !== null) {
          this.props.onSuggestionSelected(
            this.getSuggestion(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex),
            event
          );
        }

        this.setSuggestionsState(null);
        break;

      case 27: // escape
        newState = {
          suggestions: null,
          focusedSectionIndex: null,
          focusedSuggestionIndex: null,
          valueBeforeUpDown: null
        };

        if (this.state.valueBeforeUpDown !== null) {
          newState.value = this.state.valueBeforeUpDown;
        } else if (this.state.suggestions === null) {
          newState.value = '';
        }

        this.setState(newState);
        this.props.onSuggestionUnfocused(lastFocusedSuggestion);
        lastFocusedSuggestion = null;
        break;

      case 38: // up
        if (this.state.suggestions === null) {
          this.showSuggestions(this.state.value);
        } else {
          this.focusOnSuggestion(sectionIterator.prev([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
        }

        event.preventDefault(); // Prevent the cursor from jumping to input's start
        break;

      case 40: // down
        if (this.state.suggestions === null) {
          this.showSuggestions(this.state.value);
        } else {
          this.focusOnSuggestion(sectionIterator.next([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
        }

        break;
    }
  }

  onInputBlur() {
    this.setSuggestionsState(null);
  }

  onSuggestionMouseEnter(sectionIndex, suggestionIndex) {
    let suggestion = this.getSuggestion(sectionIndex, suggestionIndex);
    this.setState({
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex
    });

    lastFocusedSuggestion = suggestion;
    this.props.onSuggestionFocused(suggestion);
  }

  onSuggestionMouseLeave() {
    this.setState({
      focusedSectionIndex: null,
      focusedSuggestionIndex: null
    });

    this.props.onSuggestionUnfocused(lastFocusedSuggestion);
  }

  onSuggestionMouseDown(sectionIndex, suggestionIndex, event) {
    this.setState({
      value: this.getSuggestionValue(sectionIndex, suggestionIndex),
      suggestions: null,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, function() {
      // This code executes after the component is re-rendered
      setTimeout( () => findDOMNode(this.refs.input).focus() );
    });

    this.props.onSuggestionSelected(this.getSuggestion(sectionIndex, suggestionIndex), event);
  }

  getSuggestionId(sectionIndex, suggestionIndex) {
    if (suggestionIndex === null) {
      return null;
    }

    return 'react-autosuggest-' + this.id + '-suggestion-' +
           (sectionIndex === null ? '' : sectionIndex) + '-' + suggestionIndex;
  }

  renderSuggestionContent(suggestion) {
    if (this.props.suggestionRenderer) {
      return this.props.suggestionRenderer(suggestion, this.state.valueBeforeUpDown || this.state.value);
    }

    if (typeof suggestion === 'object') {
      throw new Error('When <suggestion> is an object, you must implement the suggestionRenderer() function to specify how to render it.');
    } else {
      return suggestion.toString();
    }
  }

  renderSuggestionsList(suggestions, sectionIndex) {
    return suggestions.map((suggestion, suggestionIndex) => {
      let classes = classnames({
        'react-autosuggest__suggestion': true,
        'react-autosuggest__suggestion--focused':
          sectionIndex === this.state.focusedSectionIndex &&
          suggestionIndex === this.state.focusedSuggestionIndex
      });
      let suggestionKey = 'suggestion-' + (sectionIndex === null ? '' : sectionIndex) +
                          '-' + suggestionIndex;

      return (
        <li id={this.getSuggestionId(sectionIndex, suggestionIndex)}
            className={classes}
            role="option"
            key={suggestionKey}
            onMouseEnter={() => this.onSuggestionMouseEnter(sectionIndex, suggestionIndex)}
            onMouseLeave={() => this.onSuggestionMouseLeave()}
            onMouseDown={event => this.onSuggestionMouseDown(sectionIndex, suggestionIndex, event)}>
          {this.renderSuggestionContent(suggestion)}
        </li>
      );
    });
  }

  renderSuggestions() {
    if (this.state.value === '' || this.state.suggestions === null) {
      return null;
    }

    if (this.isMultipleSections(this.state.suggestions)) {
      return (
        <div id={'react-autosuggest-' + this.id}
             className="react-autosuggest__suggestions"
             role="listbox">
          {this.state.suggestions.map((section, sectionIndex) => {
            let sectionName = section.sectionName ? (
              <div className="react-autosuggest__suggestions-section-name">
                {section.sectionName}
              </div>
            ) : null;

            return section.suggestions.length === 0 ? null : (
              <div className="react-autosuggest__suggestions-section"
                   key={'section-' + sectionIndex}>
                {sectionName}
                <ul className="react-autosuggest__suggestions-section-suggestions">
                  {this.renderSuggestionsList(section.suggestions, sectionIndex)}
                </ul>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <ul id={'react-autosuggest-' + this.id}
          className="react-autosuggest__suggestions"
          role="listbox">
        {this.renderSuggestionsList(this.state.suggestions, null)}
      </ul>
    );
  }

  render() {
    let ariaActivedescendant =
      this.getSuggestionId(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex);

    return (
      <div className="react-autosuggest">
        <input {...this.props.inputAttributes}
               type="text"
               value={this.state.value}
               autoComplete="off"
               role="combobox"
               aria-autocomplete="list"
               aria-owns={'react-autosuggest-' + this.id}
               aria-expanded={this.state.suggestions !== null}
               aria-activedescendant={ariaActivedescendant}
               ref="input"
               onChange={this.onInputChange.bind(this)}
               onKeyDown={this.onInputKeyDown.bind(this)}
               onBlur={this.onInputBlur.bind(this)} />
        {this.renderSuggestions()}
      </div>
    );
  }
}

Autosuggest.propTypes = {
  suggestions: PropTypes.func.isRequired,                // Function to get the suggestions
  suggestionRenderer: PropTypes.func,                    // Function that renders a given suggestion (must be implemented when suggestions are objects)
  suggestionValue: PropTypes.func,                       // Function that maps suggestion object to input value (must be implemented when suggestions are objects)
  showWhen: PropTypes.func,                              // Function that determines whether to show suggestions or not
  onSuggestionSelected: PropTypes.func,                  // This function is called when suggestion is selected via mouse click or Enter
  onSuggestionFocused: PropTypes.func,                   // This function is called when suggestion is focused via mouse hover or up/down keys
  onSuggestionUnfocused: PropTypes.func,                 // This function is called when suggestion is unfocused via mouse hover or up/down keys
  inputAttributes: PropTypes.objectOf(PropTypes.string)  // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
};

Autosuggest.defaultProps = {
  showWhen: input => input.trim().length > 0,
  onSuggestionSelected: () => {},
  onSuggestionFocused: () => {},
  onSuggestionUnfocused: () => {},
  inputAttributes: {}
};
