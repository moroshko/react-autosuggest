'use strict';

import React from 'react';
import debounce from 'debounce';
import classnames from 'classnames';
import sectionIterator from './sectionIterator';

let { Component, PropTypes, findDOMNode } = React;
let lastSuggestionsInputValue = null, guid = 0;

class Autosuggest extends Component {
  constructor(props) {
    super(props);

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
    this.suggestionsFn = debounce(this.props.suggestions, 100);
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
      return suggestions.some(function(section) {
        return section.suggestions.length > 0;
      });
    }

    return suggestions !== null && suggestions.length > 0;
  }

  showSuggestions(input) {
    lastSuggestionsInputValue = input;

    if (input.length === 0) {
      this.setSuggestionsState(null);
    } else if (this.cache[input]) {
      this.setSuggestionsState(this.cache[input]);
    } else {
      this.suggestionsFn(input, function(error, suggestions) {
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
      }.bind(this));
    }
  }

  getSuggestionText(sectionIndex, suggestionIndex) {
    return findDOMNode(this.refs[this.getSuggestionKey(sectionIndex, suggestionIndex)]).textContent;
  }

  focusOnSuggestion(suggestionPosition) {
    let [sectionIndex, suggestionIndex] = suggestionPosition;
    let newState = {
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex,
      value: suggestionIndex === null
               ? this.state.valueBeforeUpDown
               : this.getSuggestionText(sectionIndex, suggestionIndex)
    };

    // When users starts to interact with up/down keys, remember input's value.
    if (this.state.valueBeforeUpDown === null) {
      newState.valueBeforeUpDown = this.state.value;
    }

    this.setState(newState);
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
    this.setState({
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex
    });
  }

  onSuggestionMouseLeave() {
    this.setState({
      focusedSectionIndex: null,
      focusedSuggestionIndex: null
    });
  }

  onSuggestionMouseDown(sectionIndex, suggestionIndex) {
    this.setState({
      value: this.getSuggestionText(sectionIndex, suggestionIndex),
      suggestions: null,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, function() {
      // This code executes after the component is re-rendered
      setTimeout(function() {
        findDOMNode(this.refs.input).focus();
      }.bind(this));
    });
  }

  getSuggestionId(sectionIndex, suggestionIndex) {
    if (suggestionIndex === null) {
      return null;
    }

    return 'react-autosuggest-' + this.id + '-suggestion-' +
           (sectionIndex === null ? '' : sectionIndex) + '-' + suggestionIndex;
  }

  getSuggestionKey(sectionIndex, suggestionIndex) {
    return 'suggestion-' + (sectionIndex === null ? '' : sectionIndex) +
           '-' + suggestionIndex;
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
    return suggestions.map(function(suggestion, suggestionIndex) {
      let classes = classnames({
        'react-autosuggest__suggestion': true,
        'react-autosuggest__suggestion--focused':
          sectionIndex === this.state.focusedSectionIndex &&
          suggestionIndex === this.state.focusedSuggestionIndex
      });
      let suggestionKey = this.getSuggestionKey(sectionIndex, suggestionIndex);

      return (
        <div id={this.getSuggestionId(sectionIndex, suggestionIndex)}
             className={classes}
             role="option"
             key={suggestionKey}
             ref={suggestionKey}
             onMouseEnter={this.onSuggestionMouseEnter.bind(this, sectionIndex, suggestionIndex)}
             onMouseLeave={this.onSuggestionMouseLeave.bind(this)}
             onMouseDown={this.onSuggestionMouseDown.bind(this, sectionIndex, suggestionIndex)}>
          {this.renderSuggestionContent(suggestion)}
        </div>
      );
    }, this);
  }

  renderSuggestions() {
    if (this.state.value === '' || this.state.suggestions === null) {
      return null;
    }

    let content;

    if (this.isMultipleSections(this.state.suggestions)) {
      content = this.state.suggestions.map(function(section, sectionIndex) {
        let sectionName = section.sectionName ? (
          <div className="react-autosuggest__suggestions-section-name">
            {section.sectionName}
          </div>
        ) : null;

        return section.suggestions.length === 0 ? null : (
          <div className="react-autosuggest__suggestions-section"
               key={'section-' + sectionIndex}>
            {sectionName}
            {this.renderSuggestionsList(section.suggestions, sectionIndex)}
          </div>
        );
      }, this);
    } else {
      content = this.renderSuggestionsList(this.state.suggestions, null);
    }

    return (
      <div id={'react-autosuggest-' + this.id}
           className="react-autosuggest__suggestions"
           role="listbox">
        {content}
      </div>
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
  inputAttributes: PropTypes.objectOf(PropTypes.string), // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
  suggestions: PropTypes.func.isRequired,                // Function to get the suggestions
  suggestionRenderer: PropTypes.func                     // Function to render a single suggestion
};

Autosuggest.defaultProps = {
  inputAttributes: {}
};

export default Autosuggest;
