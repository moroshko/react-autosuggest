import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shallowEqualArrays from 'shallow-equal/arrays';
import { actionCreators } from './redux';
import Autowhatever from 'react-autowhatever';

function mapStateToProps(state) {
  return {
    isFocused: state.isFocused,
    isCollapsed: state.isCollapsed,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex,
    valueBeforeUpDown: state.valueBeforeUpDown,
    lastAction: state.lastAction
  };
}

class Autosuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    renderSuggestionsContainer: PropTypes.func,
    onSuggestionsUpdateRequested: PropTypes.func.isRequired,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    shouldRenderSuggestions: PropTypes.func.isRequired,
    alwaysRenderSuggestions: PropTypes.bool.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    multiSection: PropTypes.bool.isRequired,
    renderSectionTitle: PropTypes.func.isRequired,
    getSectionSuggestions: PropTypes.func.isRequired,
    focusInputOnSuggestionClick: PropTypes.bool.isRequired,
    focusFirstSuggestion: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    inputRef: PropTypes.func.isRequired,

    isFocused: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedSuggestionIndex: PropTypes.number,
    valueBeforeUpDown: PropTypes.string,
    lastAction: PropTypes.string,

    inputFocused: PropTypes.func.isRequired,
    inputBlurred: PropTypes.func.isRequired,
    inputChanged: PropTypes.func.isRequired,
    updateFocusedSuggestion: PropTypes.func.isRequired,
    revealSuggestions: PropTypes.func.isRequired,
    closeSuggestions: PropTypes.func.isRequired
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.onDocumentMouseDown);
  }

  componentWillReceiveProps(nextProps) {
    if (shallowEqualArrays(nextProps.suggestions, this.props.suggestions)) {
      const suggestionsBecomeVisible =
        !this.willRenderSuggestions(this.props) && this.willRenderSuggestions(nextProps);

      if (suggestionsBecomeVisible) {
        this.maybeFocusFirstSuggestion();
      }
    } else {
      if (this.willRenderSuggestions(nextProps)) {
        this.maybeFocusFirstSuggestion();

        const { isCollapsed, revealSuggestions, lastAction } = nextProps;

        if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter') {
          revealSuggestions();
        }
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onDocumentMouseDown);
  }

  getSuggestion(sectionIndex, suggestionIndex) {
    const { suggestions, multiSection, getSectionSuggestions } = this.props;

    if (multiSection) {
      return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
    }

    return suggestions[suggestionIndex];
  }

  getFocusedSuggestion() {
    const { focusedSectionIndex, focusedSuggestionIndex } = this.props;

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
      event.detail.target || // This is for testing only. Please show be a better way to emulate this.
      event.target;

    do {
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
    } while (node !== document);
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
      onChange && onChange(event, { newValue, method });
    }
  }

  maybeCallOnSuggestionsUpdateRequested(data) {
    const { onSuggestionsUpdateRequested, shouldRenderSuggestions } = this.props;

    if (shouldRenderSuggestions(data.value)) {
      onSuggestionsUpdateRequested(data);
    }
  }

  maybeFocusFirstSuggestion() {
    const { focusFirstSuggestion, multiSection, updateFocusedSuggestion } = this.props;

    if (focusFirstSuggestion) {
      updateFocusedSuggestion(multiSection ? 0 : null, 0);
    }
  }

  willRenderSuggestions(props) {
    const { suggestions, inputProps, shouldRenderSuggestions } = props;
    const { value } = inputProps;

    return suggestions.length > 0 && shouldRenderSuggestions(value);
  }

  storeReferences = autowhatever => {
    if (autowhatever !== null) {
      const { input } = autowhatever;

      this.input = input;
      this.props.inputRef(input);

      this.suggestionsContainer = autowhatever.itemsContainer;
    }
  };

  onSuggestionMouseEnter = (event, { sectionIndex, itemIndex }) => {
    this.props.updateFocusedSuggestion(sectionIndex, itemIndex);
  };

  onSuggestionMouseLeave = () => {
    this.props.updateFocusedSuggestion(null, null);
  };

  onSuggestionMouseDown = () => {
    this.justClickedOnSuggestion = true;
  };

  onSuggestionClick = event => {
    const { onSuggestionSelected, focusInputOnSuggestionClick, closeSuggestions } = this.props;
    const { sectionIndex, suggestionIndex } =
      this.getSuggestionIndices(this.findSuggestionElement(event.target));
    const clickedSuggestion = this.getSuggestion(sectionIndex, suggestionIndex);
    const clickedSuggestionValue = this.props.getSuggestionValue(clickedSuggestion);

    this.maybeCallOnChange(event, clickedSuggestionValue, 'click');
    onSuggestionSelected(event, {
      suggestion: clickedSuggestion,
      suggestionValue: clickedSuggestionValue,
      sectionIndex,
      method: 'click'
    });
    closeSuggestions('click');

    if (focusInputOnSuggestionClick === true) {
      this.input.focus();
    } else {
      this.onBlur();
    }

    this.maybeCallOnSuggestionsUpdateRequested({ value: clickedSuggestionValue, reason: 'click' });

    setTimeout(() => {
      this.justClickedOnSuggestion = false;
    });
  };

  onBlur = () => {
    const { inputProps, shouldRenderSuggestions, inputBlurred } = this.props;
    const { value, onBlur } = inputProps;
    const focusedSuggestion = this.getFocusedSuggestion();

    inputBlurred(shouldRenderSuggestions(value));
    onBlur && onBlur(this.blurEvent, { focusedSuggestion });
  };

  itemProps = ({ sectionIndex, itemIndex }) => {
    return {
      'data-section-index': sectionIndex,
      'data-suggestion-index': itemIndex,
      onMouseEnter: this.onSuggestionMouseEnter,
      onMouseLeave: this.onSuggestionMouseLeave,
      onMouseDown: this.onSuggestionMouseDown,
      onTouchStart: this.onSuggestionMouseDown, // Because on iOS `onMouseDown` is not triggered
      onClick: this.onSuggestionClick
    };
  };

  render() {
    const {
      suggestions, renderSuggestionsContainer, renderSuggestion, inputProps,
      shouldRenderSuggestions, onSuggestionSelected, multiSection, renderSectionTitle,
      id, getSectionSuggestions, theme, isFocused, isCollapsed, focusedSectionIndex,
      focusedSuggestionIndex, valueBeforeUpDown, inputFocused, inputChanged,
      updateFocusedSuggestion, revealSuggestions, closeSuggestions, getSuggestionValue,
      alwaysRenderSuggestions
    } = this.props;
    const { value, onFocus, onKeyDown } = inputProps;
    const willRenderSuggestions = this.willRenderSuggestions(this.props);
    const isOpen = alwaysRenderSuggestions || isFocused && !isCollapsed && willRenderSuggestions;
    const items = (isOpen ? suggestions : []);
    const autowhateverInputProps = {
      ...inputProps,
      onFocus: event => {
        if (!this.justClickedOnSuggestion && !this.justClickedOnSuggestionsContainer) {
          inputFocused(shouldRenderSuggestions(value));
          onFocus && onFocus(event);

          if (suggestions.length > 0) {
            this.maybeFocusFirstSuggestion();
          }
        }
      },
      onBlur: event => {
        if (this.justClickedOnSuggestionsContainer) {
          this.input.focus();
          return;
        }

        this.blurEvent = event;

        if (!this.justClickedOnSuggestion) {
          this.onBlur();

          if (valueBeforeUpDown !== null && value !== valueBeforeUpDown) {
            this.maybeCallOnSuggestionsUpdateRequested({ value, reason: 'blur' });
          }
        }
      },
      onChange: event => {
        const { value } = event.target;
        const { shouldRenderSuggestions } = this.props;

        this.maybeCallOnChange(event, value, 'type');
        inputChanged(shouldRenderSuggestions(value), 'type');
        this.maybeCallOnSuggestionsUpdateRequested({ value, reason: 'type' });
      },
      onKeyDown: (event, data) => {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            if (isCollapsed) {
              if (willRenderSuggestions) {
                revealSuggestions();
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

              updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, value);
              this.maybeCallOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
            }
            event.preventDefault();
            break;

          case 'Enter': {
            const focusedSuggestion = this.getFocusedSuggestion();

            if (isOpen && !alwaysRenderSuggestions) {
              closeSuggestions('enter');
            }

            if (focusedSuggestion !== null) {
              const newValue = getSuggestionValue(focusedSuggestion);

              onSuggestionSelected(event, {
                suggestion: focusedSuggestion,
                suggestionValue: newValue,
                sectionIndex: focusedSectionIndex,
                method: 'enter'
              });

              this.maybeCallOnChange(event, newValue, 'enter');
              this.maybeCallOnSuggestionsUpdateRequested({ value: newValue, reason: 'enter' });
            }
            break;
          }

          case 'Escape':
            if (isOpen) {
              // If input.type === 'search', the browser clears the input
              // when Escape is pressed. We want to disable this default
              // behaviour so that, when suggestions are shown, we just hide
              // them, without clearing the input.
              event.preventDefault();
            }

            if (valueBeforeUpDown === null) { // Didn't interact with Up/Down
              if (alwaysRenderSuggestions || !isOpen) {
                this.maybeCallOnChange(event, '', 'escape');
                this.maybeCallOnSuggestionsUpdateRequested({ value: '', reason: 'escape' });
              }
            } else { // Interacted with Up/Down
              this.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
            }

            if (isOpen && !alwaysRenderSuggestions) {
              closeSuggestions('escape');
            } else {
              updateFocusedSuggestion(null, null);
            }

            break;
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
        renderItemsContainer={renderSuggestionsContainer}
        renderItem={renderSuggestion}
        renderItemData={renderSuggestionData}
        renderSectionTitle={renderSectionTitle}
        getSectionItems={getSectionSuggestions}
        focusedSectionIndex={focusedSectionIndex}
        focusedItemIndex={focusedSuggestionIndex}
        inputProps={autowhateverInputProps}
        itemProps={this.itemProps}
        theme={theme}
        id={id}
        ref={this.storeReferences} />
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Autosuggest);
