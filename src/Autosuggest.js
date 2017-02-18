import React, { Component, PropTypes } from 'react';
import shallowEqualArrays from 'shallow-equal/arrays';
import Autowhatever from 'react-autowhatever';

const alwaysTrue = () => true;
const defaultShouldRenderSuggestions = value => value.trim().length > 0;
const defaultTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestionsList: 'react-autosuggest__suggestions-list',
  suggestion: 'react-autosuggest__suggestion',
  suggestionFocused: 'react-autosuggest__suggestion--focused',
  sectionContainer: 'react-autosuggest__section-container',
  sectionTitle: 'react-autosuggest__section-title'
};

const mapToAutowhateverTheme = theme => {
  let result = {};

  for (const key in theme) {
    switch (key) {
      case 'suggestionsContainer':
        result['itemsContainer'] = theme[key];
        break;

      case 'suggestion':
        result['item'] = theme[key];
        break;

      case 'suggestionFocused':
        result['itemFocused'] = theme[key];
        break;

      case 'suggestionsList':
        result['itemsList'] = theme[key];
        break;

      default:
        result[key] = theme[key];
    }
  }

  return result;
};

export default class Autosuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    onSuggestionsFetchRequested: (props, propName) => {
      const onSuggestionsFetchRequested = props[propName];

      if (typeof onSuggestionsFetchRequested !== 'function') {
        throw new Error('\'onSuggestionsFetchRequested\' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsFetchRequestedProp');
      }
    },
    onSuggestionsClearRequested: (props, propName) => {
      const onSuggestionsClearRequested = props[propName];

      if (props.alwaysRenderSuggestions === false && typeof onSuggestionsClearRequested !== 'function') {
        throw new Error('\'onSuggestionsClearRequested\' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsClearRequestedProp');
      }
    },
    onSuggestionSelected: PropTypes.func,
    renderInputComponent: PropTypes.func,
    renderSuggestionsContainer: PropTypes.func,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: (props, propName) => {
      const inputProps = props[propName];

      if (!inputProps.hasOwnProperty('value')) {
        throw new Error('\'inputProps\' must have \'value\'.');
      }

      if (!inputProps.hasOwnProperty('onChange')) {
        throw new Error('\'inputProps\' must have \'onChange\'.');
      }
    },
    shouldRenderSuggestions: PropTypes.func,
    alwaysRenderSuggestions: PropTypes.bool,
    multiSection: PropTypes.bool,
    renderSectionTitle: (props, propName) => {
      const renderSectionTitle = props[propName];

      if (props.multiSection === true && typeof renderSectionTitle !== 'function') {
        throw new Error('\'renderSectionTitle\' must be implemented. See: https://github.com/moroshko/react-autosuggest#renderSectionTitleProp');
      }
    },
    getSectionSuggestions: (props, propName) => {
      const getSectionSuggestions = props[propName];

      if (props.multiSection === true && typeof getSectionSuggestions !== 'function') {
        throw new Error('\'getSectionSuggestions\' must be implemented. See: https://github.com/moroshko/react-autosuggest#getSectionSuggestionsProp');
      }
    },
    focusInputOnSuggestionClick: PropTypes.bool,
    focusFirstSuggestion: PropTypes.bool,
    theme: PropTypes.object,
    id: PropTypes.string
  };

  static defaultProps = {
    shouldRenderSuggestions: defaultShouldRenderSuggestions,
    alwaysRenderSuggestions: false,
    multiSection: false,
    focusInputOnSuggestionClick: true,
    focusFirstSuggestion: false,
    theme: defaultTheme,
    id: '1'
  };

  constructor({ alwaysRenderSuggestions }) {
    super();

    this.state = {
      isFocused: false,
      isCollapsed: !alwaysRenderSuggestions,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    };

    this.justPressedUpDown = false;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onDocumentMouseDown);
  }

  componentWillReceiveProps(nextProps) {
    if (shallowEqualArrays(nextProps.suggestions, this.props.suggestions)) {
      if (nextProps.focusFirstSuggestion &&
          nextProps.suggestions.length > 0 &&
          this.justPressedUpDown === false) {
        this.focusFirstSuggestion();
      }
    } else {
      if (this.willRenderSuggestions(nextProps)) {
        if (nextProps.focusFirstSuggestion) {
          this.focusFirstSuggestion();
        }

        if (this.state.isCollapsed && !this.justSelectedSuggestion) {
          this.revealSuggestions();
        }
      } else {
        this.resetFocusedSuggestion();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onDocumentMouseDown);
  }

  inputFocused(shouldRender) {
    this.setState({
      isFocused: true,
      isCollapsed: !shouldRender
    });
  }

  inputBlurred(shouldRender) {
    this.setState({
      isFocused: false,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null,
      isCollapsed: !shouldRender
    });
  }

  inputChanged(shouldRender) {
    this.setState({
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null,
      isCollapsed: !shouldRender
    });
  }

  updateFocusedSuggestion(sectionIndex, suggestionIndex, prevValue) {
    let { valueBeforeUpDown } = this.state;

    if (suggestionIndex === null) {
      valueBeforeUpDown = null;
    } else if (valueBeforeUpDown === null && typeof prevValue !== 'undefined') {
      valueBeforeUpDown = prevValue;
    }

    this.setState({
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex,
      valueBeforeUpDown
    });
  }

  resetFocusedSuggestion(shouldResetValueBeforeUpDown = true) {
    const { valueBeforeUpDown } = this.state;

    this.setState({
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: shouldResetValueBeforeUpDown ? null : valueBeforeUpDown
    });
  }

  revealSuggestions() {
    this.setState({
      isCollapsed: false
    });
  }

  closeSuggestions() {
    this.setState({
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null,
      isCollapsed: true
    });
  }

  getSuggestion(sectionIndex, suggestionIndex) {
    const { suggestions, multiSection, getSectionSuggestions } = this.props;

    if (multiSection) {
      return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
    }

    return suggestions[suggestionIndex];
  }

  getFocusedSuggestion() {
    const { focusedSectionIndex, focusedSuggestionIndex } = this.state;

    if (focusedSuggestionIndex === null) {
      return null;
    }

    return this.getSuggestion(focusedSectionIndex, focusedSuggestionIndex);
  }

  getSuggestionValueByIndex(sectionIndex, suggestionIndex) {
    const { getSuggestionValue } = this.props;

    return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex));
  }

  getSuggestionIndices(suggestionElement) {
    const sectionIndex = suggestionElement.getAttribute('data-section-index');
    const suggestionIndex = suggestionElement.getAttribute('data-suggestion-index');

    return {
      sectionIndex: (typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null),
      suggestionIndex: parseInt(suggestionIndex, 10)
    };
  }

  onDocumentMouseDown = event => {
    this.justClickedOnSuggestionsContainer = false;

    let node =
      event.detail && event.detail.target || // This is for testing only. Please show me a better way to emulate this.
      event.target;

    while (node !== null && node !== document) {
      if (node.getAttribute('data-suggestion-index') !== null) {
        // Suggestion was clicked
        return;
      }

      if (node === this.suggestionsContainer) {
        // Something else inside suggestions container was clicked
        this.justClickedOnSuggestionsContainer = true;
        return;
      }

      node = node.parentNode;
    }
  };

  findSuggestionElement(startNode) {
    let node = startNode;

    do {
      if (node.getAttribute('data-suggestion-index') !== null) {
        return node;
      }

      node = node.parentNode;
    } while (node !== null);

    console.error('Clicked element:', startNode); // eslint-disable-line no-console
    throw new Error('Couldn\'t find suggestion element');
  }

  maybeCallOnChange(event, newValue, method) {
    const { value, onChange } = this.props.inputProps;

    if (newValue !== value) {
      onChange(event, { newValue, method });
    }
  }

  willRenderSuggestions(props) {
    const { suggestions, inputProps, shouldRenderSuggestions } = props;
    const { value } = inputProps;

    return suggestions.length > 0 && shouldRenderSuggestions(value);
  }

  storeReferences = autowhatever => {
    if (autowhatever !== null) {
      const { input, itemsContainer } = autowhatever;

      this.input = input;
      this.suggestionsContainer = itemsContainer;
    }
  };

  onSuggestionMouseEnter = (event, { sectionIndex, itemIndex }) => {
    this.updateFocusedSuggestion(sectionIndex, itemIndex);
  };

  focusFirstSuggestion = () => {
    this.updateFocusedSuggestion(this.props.multiSection ? 0 : null, 0);
  };

  onSuggestionMouseDown = () => {
    this.justSelectedSuggestion = true;
  };

  onSuggestionsClearRequested = () => {
    const { onSuggestionsClearRequested } = this.props;

    onSuggestionsClearRequested && onSuggestionsClearRequested();
  };

  onSuggestionSelected = (event, data) => {
    const { alwaysRenderSuggestions, onSuggestionSelected, onSuggestionsFetchRequested } = this.props;

    onSuggestionSelected && onSuggestionSelected(event, data);

    if (alwaysRenderSuggestions) {
      onSuggestionsFetchRequested({ value: data.suggestionValue });
    } else {
      this.onSuggestionsClearRequested();
    }

    this.resetFocusedSuggestion();
  };

  onSuggestionClick = event => {
    const { alwaysRenderSuggestions, focusInputOnSuggestionClick } = this.props;
    const { sectionIndex, suggestionIndex } =
      this.getSuggestionIndices(this.findSuggestionElement(event.target));
    const clickedSuggestion = this.getSuggestion(sectionIndex, suggestionIndex);
    const clickedSuggestionValue = this.props.getSuggestionValue(clickedSuggestion);

    this.maybeCallOnChange(event, clickedSuggestionValue, 'click');
    this.onSuggestionSelected(event, {
      suggestion: clickedSuggestion,
      suggestionValue: clickedSuggestionValue,
      suggestionIndex: suggestionIndex,
      sectionIndex,
      method: 'click'
    });

    if (!alwaysRenderSuggestions) {
      this.closeSuggestions();
    }

    if (focusInputOnSuggestionClick === true) {
      this.input.focus();
    } else {
      this.onBlur();
    }

    setTimeout(() => {
      this.justSelectedSuggestion = false;
    });
  };

  onBlur = () => {
    const { inputProps, shouldRenderSuggestions } = this.props;
    const { value, onBlur } = inputProps;
    const focusedSuggestion = this.getFocusedSuggestion();

    this.inputBlurred(shouldRenderSuggestions(value));
    onBlur && onBlur(this.blurEvent, { focusedSuggestion });
  };

  resetFocusedSuggestionOnMouseLeave = () => {
    this.resetFocusedSuggestion(false); // shouldResetValueBeforeUpDown
  };

  itemProps = ({ sectionIndex, itemIndex }) => {
    return {
      'data-section-index': sectionIndex,
      'data-suggestion-index': itemIndex,
      onMouseEnter: this.onSuggestionMouseEnter,
      onMouseLeave: this.resetFocusedSuggestionOnMouseLeave,
      onMouseDown: this.onSuggestionMouseDown,
      onTouchStart: this.onSuggestionMouseDown, // Because on iOS `onMouseDown` is not triggered
      onClick: this.onSuggestionClick
    };
  };

  render() {
    const {
      suggestions, renderInputComponent, renderSuggestionsContainer,
      onSuggestionsFetchRequested, renderSuggestion, inputProps, multiSection,
      renderSectionTitle, id, getSectionSuggestions, theme, getSuggestionValue,
      alwaysRenderSuggestions
    } = this.props;
    const {
      isFocused, isCollapsed, focusedSectionIndex, focusedSuggestionIndex, valueBeforeUpDown
    } = this.state;
    const shouldRenderSuggestions =
      alwaysRenderSuggestions ? alwaysTrue : this.props.shouldRenderSuggestions;
    const { value, onFocus, onKeyDown } = inputProps;
    const willRenderSuggestions = this.willRenderSuggestions(this.props);
    const isOpen = alwaysRenderSuggestions || isFocused && !isCollapsed && willRenderSuggestions;
    const items = (isOpen ? suggestions : []);
    const autowhateverInputProps = {
      ...inputProps,
      onFocus: event => {
        if (!this.justSelectedSuggestion && !this.justClickedOnSuggestionsContainer) {
          const shouldRender = shouldRenderSuggestions(value);

          this.inputFocused(shouldRender);
          onFocus && onFocus(event);

          if (shouldRender) {
            onSuggestionsFetchRequested({ value });
          }
        }
      },
      onBlur: event => {
        if (this.justClickedOnSuggestionsContainer) {
          this.input.focus();
          return;
        }

        this.blurEvent = event;

        if (!this.justSelectedSuggestion) {
          this.onBlur();
          this.onSuggestionsClearRequested();
        }
      },
      onChange: event => {
        const { value } = event.target;
        const shouldRender = shouldRenderSuggestions(value);

        this.maybeCallOnChange(event, value, 'type');
        this.inputChanged(shouldRender);

        if (shouldRender) {
          onSuggestionsFetchRequested({ value });
        } else {
          this.onSuggestionsClearRequested();
        }
      },
      onKeyDown: (event, data) => {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            if (isCollapsed) {
              if (shouldRenderSuggestions(value)) {
                onSuggestionsFetchRequested({ value });
                this.revealSuggestions();
              }
            } else if (suggestions.length > 0) {
              const { newFocusedSectionIndex, newFocusedItemIndex } = data;

              let newValue;

              if (newFocusedItemIndex === null) {
                // valueBeforeUpDown can be null if, for example, user
                // hovers on the first suggestion and then pressed Up.
                // If that happens, use the original input value.
                newValue = (valueBeforeUpDown === null ? value : valueBeforeUpDown);
              } else {
                newValue = this.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex);
              }

              this.updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, value);
              this.maybeCallOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
            }

            event.preventDefault(); // Prevents the cursor from moving

            this.justPressedUpDown = true;

            setTimeout(() => {
              this.justPressedUpDown = false;
            });

            break;

          case 'Enter': {
            const focusedSuggestion = this.getFocusedSuggestion();

            if (isOpen && !alwaysRenderSuggestions) {
              this.closeSuggestions();
            }

            if (focusedSuggestion !== null) {
              const newValue = getSuggestionValue(focusedSuggestion);

              this.maybeCallOnChange(event, newValue, 'enter');

              this.onSuggestionSelected(event, {
                suggestion: focusedSuggestion,
                suggestionValue: newValue,
                suggestionIndex: focusedSuggestionIndex,
                sectionIndex: focusedSectionIndex,
                method: 'enter'
              });

              this.justSelectedSuggestion = true;

              setTimeout(() => {
                this.justSelectedSuggestion = false;
              });
            }

            break;
          }

          case 'Escape': {
            if (isOpen) {
              // If input.type === 'search', the browser clears the input
              // when Escape is pressed. We want to disable this default
              // behaviour so that, when suggestions are shown, we just hide
              // them, without clearing the input.
              event.preventDefault();
            }

            const willCloseSuggestions = isOpen && !alwaysRenderSuggestions;

            if (valueBeforeUpDown === null) { // Didn't interact with Up/Down
              if (!willCloseSuggestions) {
                const newValue = '';

                this.maybeCallOnChange(event, newValue, 'escape');

                if (shouldRenderSuggestions(newValue)) {
                  onSuggestionsFetchRequested({ value: newValue });
                } else {
                  this.onSuggestionsClearRequested();
                }
              }
            } else { // Interacted with Up/Down
              this.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
            }

            if (willCloseSuggestions) {
              this.onSuggestionsClearRequested();
              this.closeSuggestions();
            } else {
              this.resetFocusedSuggestion();
            }

            break;
          }
        }

        onKeyDown && onKeyDown(event);
      }
    };
    const renderSuggestionData = {
      query: (valueBeforeUpDown || value).trim()
    };

    return (
      <Autowhatever
        multiSection={multiSection}
        items={items}
        renderInputComponent={renderInputComponent}
        renderItemsContainer={renderSuggestionsContainer}
        renderItem={renderSuggestion}
        renderItemData={renderSuggestionData}
        renderSectionTitle={renderSectionTitle}
        getSectionItems={getSectionSuggestions}
        focusedSectionIndex={focusedSectionIndex}
        focusedItemIndex={focusedSuggestionIndex}
        inputProps={autowhateverInputProps}
        itemProps={this.itemProps}
        theme={mapToAutowhateverTheme(theme)}
        id={id}
        ref={this.storeReferences}
      />
    );
  }
}
