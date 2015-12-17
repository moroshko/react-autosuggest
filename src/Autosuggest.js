import React, { Component, PropTypes } from 'react';
import debounce from 'debounce';
import themeable from 'react-themeable';
import sectionIterator from './sectionIterator';

export default class Autosuggest extends Component {
  static propTypes = {
    value: PropTypes.string,                // Controlled value of the selected suggestion
    defaultValue: PropTypes.string,         // Initial value of the text
    suggestions: PropTypes.func.isRequired, // Function to get the suggestions
    suggestionRenderer: PropTypes.func,     // Function that renders a given suggestion (must be implemented when suggestions are objects)
    suggestionValue: PropTypes.func,        // Function that maps suggestion object to input value (must be implemented when suggestions are objects)
    showWhen: PropTypes.func,               // Function that determines whether to show suggestions or not
    onSuggestionSelected: PropTypes.func,   // This function is called when suggestion is selected via mouse click or Enter
    onSuggestionFocused: PropTypes.func,    // This function is called when suggestion is focused via mouse hover or Up/Down keys
    onSuggestionUnfocused: PropTypes.func,  // This function is called when suggestion is unfocused via mouse hover or Up/Down keys
    inputAttributes: PropTypes.object,      // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
    cache: PropTypes.bool,                  // Set it to false to disable in-memory caching
    id: PropTypes.string,                   // Used in aria-* attributes. If multiple Autosuggest's are rendered on a page, they must have unique ids.
    scrollBar: PropTypes.bool,              // Set it to true when the suggestions container can have a scroll bar
    theme: PropTypes.object                 // Custom theme. See: https://github.com/markdalgleish/react-themeable
  }

  static defaultProps = {
    showWhen: input => input.trim().length > 0,
    onSuggestionSelected: () => {},
    onSuggestionFocused: () => {},
    onSuggestionUnfocused: () => {},
    inputAttributes: {},
    cache: true,
    id: '1',
    scrollBar: false,
    theme: {
      root: 'react-autosuggest',
      suggestions: 'react-autosuggest__suggestions',
      suggestion: 'react-autosuggest__suggestion',
      suggestionIsFocused: 'react-autosuggest__suggestion--focused',
      section: 'react-autosuggest__suggestions-section',
      sectionName: 'react-autosuggest__suggestions-section-name',
      sectionSuggestions: 'react-autosuggest__suggestions-section-suggestions'
    }
  }

  constructor(props) {
    super();

    this.cache = {};
    this.state = {
      value: props.value || props.defaultValue || '',
      suggestions: null,
      focusedSectionIndex: null,    // Used when multiple sections are displayed
      focusedSuggestionIndex: null, // Index within a section
      valueBeforeUpDown: null       // When user interacts using the Up and Down keys,
                                    // this field remembers input's value prior to
                                    // interaction in order to revert back if ESC hit.
                                    // See: http://www.w3.org/TR/wai-aria-practices/#autocomplete
    };
    this.isControlledComponent = (typeof props.value !== 'undefined');
    this.suggestionsFn = debounce(props.suggestions, 100);
    this.onChange = props.inputAttributes.onChange || (() => {});
    this.onFocus = props.inputAttributes.onFocus || (() => {});
    this.onBlur = props.inputAttributes.onBlur || (() => {});
    this.lastSuggestionsInputValue = null; // Helps to deal with delayed requests
    this.justUnfocused = false; // Helps to avoid calling onSuggestionUnfocused
                                // twice when mouse is moving between suggestions
    this.justClickedOnSuggestion = false; // Helps not to call inputAttributes.onBlur
                                          // and showSuggestions() when suggestion is clicked.
                                          // Also helps not to call handleValueChange() in
                                          // componentWillReceiveProps() when suggestion is clicked.
    this.justPressedUpDown = false; // Helps not to call handleValueChange() in
                                    // componentWillReceiveProps() when Up or Down is pressed.
    this.justPressedEsc = false; // Helps not to call handleValueChange() in
                                 // componentWillReceiveProps() when ESC is pressed.
    this.onInputChange = ::this.onInputChange;
    this.onInputKeyDown = ::this.onInputKeyDown;
    this.onInputFocus = ::this.onInputFocus;
    this.onInputBlur = ::this.onInputBlur;
  }

  componentWillReceiveProps(nextProps) {
    if (this.isControlledComponent) {
      const inputValue = this.refs.input.value;

      if (nextProps.value !== inputValue &&
          !this.justClickedOnSuggestion && !this.justPressedUpDown && !this.justPressedEsc) {
        this.handleValueChange(nextProps.value);
      }
    }
  }

  resetSectionIterator(suggestions) {
    if (this.isMultipleSections(suggestions)) {
      sectionIterator.setData(suggestions.map(suggestion => suggestion.suggestions.length));
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
    } else if (this.props.cache && this.cache[cacheKey]) {
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

          if (this.props.cache) {
            this.cache[cacheKey] = suggestions;
          }

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

  scrollToElement(container, element, alignTo) {
    if (alignTo === 'bottom') {
      const scrollDelta = element.offsetTop +
                          element.offsetHeight -
                          container.scrollTop -
                          container.offsetHeight;

      if (scrollDelta > 0) {
        container.scrollTop += scrollDelta;
      }
    } else {
      const scrollDelta = container.scrollTop -
                          element.offsetTop;

      if (scrollDelta > 0) {
        container.scrollTop -= scrollDelta;
      }
    }
  }

  scrollToSuggestion(direction, sectionIndex, suggestionIndex) {
    let alignTo = (direction === 'down' ? 'bottom' : 'top');

    if (suggestionIndex === null) {
      if (direction === 'down') {
        alignTo = 'top';
        [sectionIndex, suggestionIndex] = sectionIterator.next([null, null]);
      } else {
        return;
      }
    } else {
      if (sectionIterator.isLast([sectionIndex, suggestionIndex]) &&
          direction === 'up') {
        alignTo = 'bottom';
      }
    }

    const suggestions = this.refs.suggestions;
    const suggestionRef = this.getSuggestionRef(sectionIndex, suggestionIndex);
    const suggestion = this.refs[suggestionRef];

    this.scrollToElement(suggestions, suggestion, alignTo);
  }

  focusOnSuggestionUsingKeyboard(direction, suggestionPosition) {
    const [sectionIndex, suggestionIndex] = suggestionPosition;
    const newState = {
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex,
      value: suggestionIndex === null
               ? this.state.valueBeforeUpDown
               : this.getSuggestionValue(sectionIndex, suggestionIndex)
    };

    this.justPressedUpDown = true;

    // When users starts to interact with Up/Down keys, remember input's value.
    if (this.state.valueBeforeUpDown === null) {
      newState.valueBeforeUpDown = this.state.value;
    }

    if (suggestionIndex === null) {
      this.onSuggestionUnfocused();
    } else {
      this.onSuggestionFocused(sectionIndex, suggestionIndex);
    }

    if (this.props.scrollBar) {
      this.scrollToSuggestion(direction, sectionIndex, suggestionIndex);
    }

    if (newState.value !== this.state.value) {
      this.onChange(newState.value);
    }

    this.setState(newState);

    setTimeout(() => this.justPressedUpDown = false);
  }

  onSuggestionSelected(event) {
    const focusedSuggestion = this.getFocusedSuggestion();

    this.props.onSuggestionUnfocused(focusedSuggestion);
    this.props.onSuggestionSelected(focusedSuggestion, event);
  }

  onInputChange(event) {
    const newValue = event.target.value;

    this.onSuggestionUnfocused();
    this.handleValueChange(newValue);
    this.showSuggestions(newValue);
  }

  handleValueChange(newValue) {
    if (newValue !== this.state.value) {
      this.onChange(newValue);
      this.setState({
        value: newValue
      });
    }
  }

  onInputKeyDown(event) {
    let newState;

    switch (event.keyCode) {
      case 13: // Enter
        if (this.state.valueBeforeUpDown !== null && this.suggestionIsFocused()) {
          this.onSuggestionSelected(event);
          this.setSuggestionsState(null);
        }
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
        this.justPressedEsc = true;

        if (typeof newState.value === 'string' && newState.value !== this.state.value) {
          this.onChange(newState.value);
        }

        this.setState(newState);

        setTimeout(() => this.justPressedEsc = false);
        break;

      case 38: // Up
        if (this.state.suggestions === null) {
          this.showSuggestions(this.state.value);
        } else {
          this.focusOnSuggestionUsingKeyboard(
            'up',
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
            'down',
            sectionIterator.next([this.state.focusedSectionIndex,
                                  this.state.focusedSuggestionIndex])
          );
        }

        break;
    }
  }

  onInputFocus(event) {
    if (!this.justClickedOnSuggestion) {
      this.showSuggestions(this.state.value);
    }

    this.onFocus(event);
  }

  onInputBlur(event) {
    this.onSuggestionUnfocused();

    if (!this.justClickedOnSuggestion) {
      this.onBlur(event);
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

    if (suggestionValue !== this.state.value) {
      this.onChange(suggestionValue);
    }

    this.setState({
      value: suggestionValue,
      suggestions: null,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, () => {
      // This code executes after the component is re-rendered
      setTimeout(() => {
        this.refs.input.focus();
        this.justClickedOnSuggestion = false;
      });
    });
  }

  getSuggestionId(sectionIndex, suggestionIndex) {
    if (suggestionIndex === null) {
      return null;
    }

    return 'react-autosuggest-' + this.props.id + '-' +
           this.getSuggestionRef(sectionIndex, suggestionIndex);
  }

  getSuggestionRef(sectionIndex, suggestionIndex) {
    return 'suggestion-' + (sectionIndex === null ? '' : sectionIndex) +
           '-' + suggestionIndex;
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

  renderSuggestionsList(theme, suggestions, sectionIndex) {
    return suggestions.map((suggestion, suggestionIndex) => {
      const styles = theme(suggestionIndex, 'suggestion',
        sectionIndex === this.state.focusedSectionIndex &&
        suggestionIndex === this.state.focusedSuggestionIndex &&
        'suggestionIsFocused'
      );
      const suggestionRef =
        this.getSuggestionRef(sectionIndex, suggestionIndex);

      return (
        <li id={this.getSuggestionId(sectionIndex, suggestionIndex)}
            {...styles}
            role="option"
            ref={suggestionRef}
            key={suggestionRef}
            onMouseEnter={() => this.onSuggestionMouseEnter(sectionIndex, suggestionIndex)}
            onMouseLeave={() => this.onSuggestionMouseLeave(sectionIndex, suggestionIndex)}
            onMouseDown={event => this.onSuggestionMouseDown(sectionIndex, suggestionIndex, event)}>
          {this.renderSuggestionContent(suggestion)}
        </li>
      );
    });
  }

  renderSuggestions(theme) {
    if (this.state.suggestions === null) {
      return null;
    }

    if (this.isMultipleSections(this.state.suggestions)) {
      return (
        <div id={'react-autosuggest-' + this.props.id}
             {...theme('suggestions', 'suggestions')}
             ref="suggestions"
             role="listbox">
          {this.state.suggestions.map((section, sectionIndex) => {
            const sectionName = section.sectionName ? (
              <div {...theme('sectionName-' + sectionIndex, 'sectionName')}>
                {section.sectionName}
              </div>
            ) : null;

            return section.suggestions.length === 0 ? null : (
              <div {...theme('section-' + sectionIndex, 'section')}
                   key={'section-' + sectionIndex}>
                {sectionName}
                <ul {...theme('sectionSuggestions-' + sectionIndex, 'sectionSuggestions')}>
                  {this.renderSuggestionsList(theme, section.suggestions, sectionIndex)}
                </ul>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <ul id={'react-autosuggest-' + this.props.id}
          {...theme('suggestions', 'suggestions')}
          ref="suggestions"
          role="listbox">
        {this.renderSuggestionsList(theme, this.state.suggestions, null)}
      </ul>
    );
  }

  render() {
    const { id, inputAttributes } = this.props;
    const { value, suggestions, focusedSectionIndex, focusedSuggestionIndex } = this.state;
    const theme = themeable(this.props.theme);
    const ariaActivedescendant = this.getSuggestionId(focusedSectionIndex, focusedSuggestionIndex);

    return (
      <div {...theme('root', 'root')}>
        <input {...inputAttributes}
               type={inputAttributes.type || 'text'}
               value={value}
               autoComplete="off"
               role="combobox"
               aria-autocomplete="list"
               aria-owns={'react-autosuggest-' + id}
               aria-expanded={suggestions !== null}
               aria-activedescendant={ariaActivedescendant}
               ref="input"
               onChange={this.onInputChange}
               onKeyDown={this.onInputKeyDown}
               onFocus={this.onInputFocus}
               onBlur={this.onInputBlur} />
        {this.renderSuggestions(theme)}
      </div>
    );
  }
}
