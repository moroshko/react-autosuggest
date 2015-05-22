'use strict';

import React, { Component, PropTypes, findDOMNode } from 'react';
import debounce from 'debounce';
import classnames from 'classnames';
import sectionIterator from './sectionIterator';

export default class Autosuggest extends Component { // eslint-disable-line no-shadow
  static propTypes = {
    suggestions: PropTypes.func.isRequired, // Function to get the suggestions
    suggestionRenderer: PropTypes.func,     // Function that renders a given suggestion (must be implemented when suggestions are objects)
    suggestionValue: PropTypes.func,        // Function that maps suggestion object to input value (must be implemented when suggestions are objects)
    showWhen: PropTypes.func,               // Function that determines whether to show suggestions or not
    onSuggestionSelected: PropTypes.func,   // This function is called when suggestion is selected via mouse click or Enter
    onSuggestionFocused: PropTypes.func,    // This function is called when suggestion is focused via mouse hover or Up/Down keys
    onSuggestionUnfocused: PropTypes.func,  // This function is called when suggestion is unfocused via mouse hover or Up/Down keys
    inputAttributes: PropTypes.object,      // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
    id: PropTypes.string                    // Used in aria-* attributes. If multiple Autosuggest's are rendered on a page, they must have unique ids.
  }

  static defaultProps = {
    showWhen: input => input.trim().length > 0,
    onSuggestionSelected: () => {},
    onSuggestionFocused: () => {},
    onSuggestionUnfocused: () => {},
    inputAttributes: {},
    id: '1'
  }

  constructor(props) {
    super();

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
    this.onChange = props.inputAttributes.onChange || (() => {});
    this.onBlur = props.inputAttributes.onBlur || (() => {});
    this.lastSuggestionsInputValue = null; // Helps to deal with delayed requests
    this.justUnfocused = false; // Helps to avoid calling onSuggestionUnfocused
                                // twice when mouse is moving between suggestions
    this.justClickedOnSuggestion = false; // Helps not to call inputAttributes.onBlur
                                        // when suggestion is clicked
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
    const cacheKey = input.toLowerCase();

    this.lastSuggestionsInputValue = input;

    if (!this.props.showWhen(input)) {
      this.setSuggestionsState(null);
    } else if (this.cache[cacheKey]) {
      this.setSuggestionsState(this.cache[cacheKey]);
    } else {
      this.suggestionsFn(input, (error, suggestions) => {
        // If input value changed, suggestions are not relevant anymore.
        if (this.lastSuggestionsInputValue !== input) {
          return;
        }

        if (error) {
          throw error;
        } else {
          if (!this.suggestionsExist(suggestions)) {
            suggestions = null;
          }

          this.cache[cacheKey] = suggestions;
          this.setSuggestionsState(suggestions);
        }
      });
    }
  }

  suggestionIsFocused() {
    return this.state.focusedSuggestionIndex !== null;
  }

  getSuggestion(sectionIndex, suggestionIndex) {
    if (this.isMultipleSections(this.state.suggestions)) {
      return this.state.suggestions[sectionIndex].suggestions[suggestionIndex];
    }

    return this.state.suggestions[suggestionIndex];
  }

  getFocusedSuggestion() {
    if (this.suggestionIsFocused()) {
      return this.getSuggestion(this.state.focusedSectionIndex,
                                this.state.focusedSuggestionIndex);
    }

    return null;
  }

  getSuggestionValue(sectionIndex, suggestionIndex) {
    const suggestion = this.getSuggestion(sectionIndex, suggestionIndex);

    if (typeof suggestion === 'object') {
      if (this.props.suggestionValue) {
        return this.props.suggestionValue(suggestion);
      }

      throw new Error('When <suggestion> is an object, you must implement the suggestionValue() function to specify how to set input\'s value when suggestion selected.');
    } else {
      return suggestion.toString();
    }
  }

  onSuggestionUnfocused() {
    const focusedSuggestion = this.getFocusedSuggestion();

    if (focusedSuggestion !== null && !this.justUnfocused) {
      this.props.onSuggestionUnfocused(focusedSuggestion);
      this.justUnfocused = true;
    }
  }

  onSuggestionFocused(sectionIndex, suggestionIndex) {
    this.onSuggestionUnfocused();

    const suggestion = this.getSuggestion(sectionIndex, suggestionIndex);

    this.props.onSuggestionFocused(suggestion);
    this.justUnfocused = false;
  }

  focusOnSuggestionUsingKeyboard(suggestionPosition) {
    const [sectionIndex, suggestionIndex] = suggestionPosition;
    const newState = {
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex,
      value: suggestionIndex === null
               ? this.state.valueBeforeUpDown
               : this.getSuggestionValue(sectionIndex, suggestionIndex)
    };

    // When users starts to interact with Up/Down keys, remember input's value.
    if (this.state.valueBeforeUpDown === null) {
      newState.valueBeforeUpDown = this.state.value;
    }

    if (suggestionIndex === null) {
      this.onSuggestionUnfocused();
    } else {
      this.onSuggestionFocused(sectionIndex, suggestionIndex);
    }

    this.onChange(newState.value);
    this.setState(newState);
  }

  onSuggestionSelected(event) {
    const focusedSuggestion = this.getFocusedSuggestion();

    this.props.onSuggestionUnfocused(focusedSuggestion);
    this.props.onSuggestionSelected(focusedSuggestion, event);
  }

  onInputChange(event) {
    const newValue = event.target.value;

    this.onSuggestionUnfocused();
    this.onChange(newValue);

    this.setState({
      value: newValue,
      valueBeforeUpDown: null
    });

    this.showSuggestions(newValue);
  }

  onInputKeyDown(event) {
    let newState;

    switch (event.keyCode) {
      case 13: // Enter
        if (this.state.valueBeforeUpDown !== null && this.suggestionIsFocused()) {
          this.onSuggestionSelected(event);
        }

        this.setSuggestionsState(null);
        break;

      case 27: // ESC
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

        this.onSuggestionUnfocused();

        if (typeof newState.value === 'string' && newState.value !== this.state.value) {
          this.onChange(newState.value);
        }

        this.setState(newState);
        break;

      case 38: // Up
        if (this.state.suggestions === null) {
          this.showSuggestions(this.state.value);
        } else {
          this.focusOnSuggestionUsingKeyboard(
            sectionIterator.prev([this.state.focusedSectionIndex,
                                  this.state.focusedSuggestionIndex])
          );
        }

        event.preventDefault(); // Prevent the cursor from jumping to input's start
        break;

      case 40: // Down
        if (this.state.suggestions === null) {
          this.showSuggestions(this.state.value);
        } else {
          this.focusOnSuggestionUsingKeyboard(
            sectionIterator.next([this.state.focusedSectionIndex,
                                  this.state.focusedSuggestionIndex])
          );
        }

        break;
    }
  }

  onInputBlur() {
    this.onSuggestionUnfocused();

    if (!this.justClickedOnSuggestion) {
      this.onBlur();
    }

    this.setSuggestionsState(null);
  }

  isSuggestionFocused(sectionIndex, suggestionIndex) {
    return sectionIndex === this.state.focusedSectionIndex &&
           suggestionIndex === this.state.focusedSuggestionIndex;
  }

  onSuggestionMouseEnter(sectionIndex, suggestionIndex) {
    if (!this.isSuggestionFocused(sectionIndex, suggestionIndex)) {
      this.onSuggestionFocused(sectionIndex, suggestionIndex);
    }

    this.setState({
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex
    });
  }

  onSuggestionMouseLeave(sectionIndex, suggestionIndex) {
    if (this.isSuggestionFocused(sectionIndex, suggestionIndex)) {
      this.onSuggestionUnfocused();
    }

    this.setState({
      focusedSectionIndex: null,
      focusedSuggestionIndex: null
    });
  }

  onSuggestionMouseDown(sectionIndex, suggestionIndex, event) {
    const suggestionValue = this.getSuggestionValue(sectionIndex, suggestionIndex);

    this.justClickedOnSuggestion = true;

    this.onSuggestionSelected(event);
    this.onChange(suggestionValue);
    this.setState({
      value: suggestionValue,
      suggestions: null,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, () => {
      // This code executes after the component is re-rendered
      setTimeout(() => {
        findDOMNode(this.refs.input).focus();
        this.justClickedOnSuggestion = false;
      });
    });
  }

  getSuggestionId(sectionIndex, suggestionIndex) {
    if (suggestionIndex === null) {
      return null;
    }

    return 'react-autosuggest-' + this.props.id + '-suggestion-' +
           (sectionIndex === null ? '' : sectionIndex) + '-' + suggestionIndex;
  }

  renderSuggestionContent(suggestion) {
    if (this.props.suggestionRenderer) {
      return this.props.suggestionRenderer(
        suggestion,
        this.state.valueBeforeUpDown || this.state.value
      );
    }

    if (typeof suggestion === 'object') {
      throw new Error('When <suggestion> is an object, you must implement the suggestionRenderer() function to specify how to render it.');
    } else {
      return suggestion.toString();
    }
  }

  renderSuggestionsList(suggestions, sectionIndex) {
    return suggestions.map((suggestion, suggestionIndex) => {
      const classes = classnames({
        'react-autosuggest__suggestion': true,
        'react-autosuggest__suggestion--focused':
          sectionIndex === this.state.focusedSectionIndex &&
          suggestionIndex === this.state.focusedSuggestionIndex
      });
      const suggestionKey =
        'suggestion-' + (sectionIndex === null ? '' : sectionIndex) +
        '-' + suggestionIndex;

      return (
        <li id={this.getSuggestionId(sectionIndex, suggestionIndex)}
            className={classes}
            role="option"
            key={suggestionKey}
            onMouseEnter={() => this.onSuggestionMouseEnter(sectionIndex, suggestionIndex)}
            onMouseLeave={() => this.onSuggestionMouseLeave(sectionIndex, suggestionIndex)}
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
        <div id={'react-autosuggest-' + this.props.id}
             className="react-autosuggest__suggestions"
             role="listbox">
          {this.state.suggestions.map((section, sectionIndex) => {
            const sectionName = section.sectionName ? (
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
      <ul id={'react-autosuggest-' + this.props.id}
          className="react-autosuggest__suggestions"
          role="listbox">
        {this.renderSuggestionsList(this.state.suggestions, null)}
      </ul>
    );
  }

  render() {
    const ariaActivedescendant =
      this.getSuggestionId(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex);

    return (
      <div className="react-autosuggest">
        <input {...this.props.inputAttributes}
               type="text"
               value={this.state.value}
               autoComplete="off"
               role="combobox"
               aria-autocomplete="list"
               aria-owns={'react-autosuggest-' + this.props.id}
               aria-expanded={this.state.suggestions !== null}
               aria-activedescendant={ariaActivedescendant}
               ref="input"
               onChange={::this.onInputChange}
               onKeyDown={::this.onInputKeyDown}
               onBlur={::this.onInputBlur} />
        {this.renderSuggestions()}
      </div>
    );
  }
}
