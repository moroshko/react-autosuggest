'use strict';

import React from 'react';
import classnames from 'classnames';
import sectionIterator from './sectionIterator';

var guid = 0;

class Autosuggest extends React.Component {
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
  }

  resetSectionIterator(suggestions) {
    if (this.isMultipleSections(suggestions)) {
      sectionIterator.setData(suggestions.map(function(suggestion) {
        return suggestion.suggestions.length;
      }));
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

    return suggestions.length > 0;
  }

  showSuggestions(input) {
    if (input.length === 0) {
      this.setSuggestionsState(null);
    } else if (this.cache[input]) {
      this.setSuggestionsState(this.cache[input]);
    } else {
      this.props.suggestions(input, function(error, suggestions) {
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

  getSuggestion(sectionIndex, suggestionIndex) {
    return this.isMultipleSections(this.state.suggestions)
      ? this.state.suggestions[sectionIndex].suggestions[suggestionIndex]
      : this.state.suggestions[suggestionIndex];
  }

  stripHTML(html) {
    var div = document.createElement('div');

    div.innerHTML = html;

    return div.textContent;
  }

  suggestionToString(suggestion) {
    var renderedSuggestion = this.renderSuggestion(suggestion);

    if (React.isValidElement(renderedSuggestion)) {
      return this.stripHTML(React.renderToStaticMarkup(renderedSuggestion));
    } else {
      return renderedSuggestion;
    }
  }

  focusOnSuggestion(suggestionPosition) {
    var [sectionIndex, suggestionIndex] = suggestionPosition;
    var newState = {
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex,
      value: suggestionIndex === null
               ? this.state.valueBeforeUpDown
               : this.suggestionToString(this.getSuggestion(sectionIndex, suggestionIndex))
    };

    // When users starts to interact with up/down keys, remember input's value.
    if (this.state.valueBeforeUpDown === null) {
      newState.valueBeforeUpDown = this.state.value;
    }

    this.setState(newState);
  }

  onInputChange(event) {
    var newValue = event.target.value;

    this.setState({
      value: newValue,
      valueBeforeUpDown: null
    });

    this.showSuggestions(newValue);
  }

  onInputKeyDown(event) {
    var newState, newSectionIndex, newSuggestionIndex;

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

  onSuggestionMouseDown(suggestion) {
    this.setState({
      value: suggestion,
      suggestions: null,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, function() {
      // This code executes after the component is re-rendered
      setTimeout(function() {
        React.findDOMNode(this.refs.input).focus();
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

  renderSuggestion(suggestion) {
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
      var classes = classnames({
        'react-autosuggest__suggestion': true,
        'react-autosuggest__suggestion--focused':
          sectionIndex === this.state.focusedSectionIndex &&
          suggestionIndex === this.state.focusedSuggestionIndex
      });

      return (
        <div id={this.getSuggestionId(sectionIndex, suggestionIndex)}
             className={classes}
             role="option"
             key={'suggestion-' + (suggestionIndex === null ? '' : suggestionIndex) + '-' + suggestionIndex}
             onMouseEnter={this.onSuggestionMouseEnter.bind(this, sectionIndex, suggestionIndex)}
             onMouseLeave={this.onSuggestionMouseLeave.bind(this)}
             onMouseDown={this.onSuggestionMouseDown.bind(this, suggestion)}>
          {this.renderSuggestion(suggestion)}
        </div>
      );
    }, this);
  }

  renderSuggestions() {
    if (this.state.value === '' || this.state.suggestions === null) {
      return null;
    }

    var content;

    if (this.isMultipleSections(this.state.suggestions)) {
      content = this.state.suggestions.map(function(section, sectionIndex) {
        var sectionName = section.sectionName ? (
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
    var ariaActivedescendant =
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
  inputAttributes: React.PropTypes.objectOf(React.PropTypes.string), // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
  suggestions: React.PropTypes.func.isRequired,                      // Function to get the suggestions
  suggestionRenderer: React.PropTypes.func                           // Function to render a single suggestion
};

Autosuggest.defaultProps = {
  inputAttributes: {}
};

export default Autosuggest;
