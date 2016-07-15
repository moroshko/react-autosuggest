import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './reducerAndActions';
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

function extractTouchCoordinates({ changedTouches }) {
  return { x: changedTouches[0].pageX, y: changedTouches[0].pageY };
}

class Autosuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    onSuggestionsUpdateRequested: PropTypes.func.isRequired,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    shouldRenderSuggestions: PropTypes.func.isRequired,
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

  constructor() {
    super();

    this.saveInput = this.saveInput.bind(this);
    this.onDocumentTouchStart = this.onDocumentTouchStart.bind(this);
    this.onDocumentTouchEnd = this.onDocumentTouchEnd.bind(this);
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);

    this.justTouchedInput = false;
    this.touchStart = null;
    this.justClickedOnSuggestion = false;
  }

  componentDidMount() {
    global.window.addEventListener('touchstart', this.onDocumentTouchStart, false);
    global.window.addEventListener('touchend', this.onDocumentTouchEnd, false);
    global.window.addEventListener('mouseup', this.onDocumentMouseUp, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      const { suggestions, inputProps, shouldRenderSuggestions,
              isCollapsed, revealSuggestions, lastAction } = nextProps;
      const { value } = inputProps;

      if (suggestions.length > 0 && shouldRenderSuggestions(value)) {
        this.maybeFocusFirstSuggestion();

        if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter') {
          revealSuggestions();
        }
      }
    }
  }

  componentWillUnmount() {
    global.window.removeEventListener('touchstart', this.onDocumentTouchStart, false);
    global.window.removeEventListener('touchend', this.onDocumentTouchEnd, false);
    global.window.removeEventListener('mouseup', this.onDocumentMouseUp, false);
  }

  onDocumentTouchStart(event) {
    this.touchStart = this.touchStart || extractTouchCoordinates(event);
  }

  onDocumentTouchEnd(event) {
    const { x, y } = extractTouchCoordinates(event);

    if (this.props.isFocused && !this.justTouchedInput && !this.justClickedOnSuggestion &&
      this.touchStart) {
      const dx = Math.abs(x - this.touchStart.x);
      const dy = Math.abs(y - this.touchStart.y);

      if (dx < 20 && dy < 20) {
        this.input.blur();
      }
    }
    this.justTouchedInput = false;
    this.touchStart = null;
    setTimeout(() => this.justClickedOnSuggestion = false);
  }

  onDocumentMouseUp() {
    setTimeout(() => this.justClickedOnSuggestion = false);
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

  willRenderSuggestions() {
    const { suggestions, inputProps, shouldRenderSuggestions } = this.props;
    const { value } = inputProps;

    return suggestions.length > 0 && shouldRenderSuggestions(value);
  }

  saveInput(autowhatever) {
    if (autowhatever !== null) {
      const input = autowhatever.refs.input;

      this.input = input;
      this.props.inputRef(input);
    }
  }

  render() {
    const {
      suggestions, renderSuggestion, inputProps, shouldRenderSuggestions,
      onSuggestionSelected, multiSection, renderSectionTitle, id,
      getSectionSuggestions, focusInputOnSuggestionClick, theme, isFocused,
      isCollapsed, focusedSectionIndex, focusedSuggestionIndex,
      valueBeforeUpDown, inputFocused, inputBlurred, inputChanged,
      updateFocusedSuggestion, revealSuggestions, closeSuggestions,
      getSuggestionValue
    } = this.props;
    const { value, onBlur, onFocus, onKeyDown } = inputProps;
    const isOpen = isFocused && !isCollapsed && this.willRenderSuggestions();
    const items = (isOpen ? suggestions : []);
    const autowhateverInputProps = {
      ...inputProps,
      onTouchStart: () => this.justTouchedInput = true,
      onFocus: event => {
        if (!this.justClickedOnSuggestion) {
          inputFocused(shouldRenderSuggestions(value));
          onFocus && onFocus(event);

          if (suggestions.length > 0) {
            this.maybeFocusFirstSuggestion();
          }
        }
      },
      onBlur: event => {
        this.onBlurEvent = event;

        if (!this.justClickedOnSuggestion) {
          inputBlurred();
          onBlur && onBlur(event);

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
              if (this.willRenderSuggestions()) {
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

            closeSuggestions('enter');

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
              if (!isOpen) {
                this.maybeCallOnChange(event, '', 'escape');
                this.maybeCallOnSuggestionsUpdateRequested({ value: '', reason: 'escape' });
              }
            } else { // Interacted with Up/Down
              this.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
            }

            closeSuggestions('escape');
            break;
        }

        onKeyDown && onKeyDown(event);
      }
    };
    const onMouseEnter = (event, { sectionIndex, itemIndex }) => {
      updateFocusedSuggestion(sectionIndex, itemIndex);
    };
    const onMouseLeave = () => {
      updateFocusedSuggestion(null, null);
    };
    const onMouseDown = () => {
      this.justClickedOnSuggestion = true;
    };
    const onClick = event => {
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
        inputBlurred();
        onBlur && onBlur(this.onBlurEvent);
      }

      this.maybeCallOnSuggestionsUpdateRequested({ value: clickedSuggestionValue, reason: 'click' });
    };
    const itemProps = ({ sectionIndex, itemIndex }) => {
      return {
        'data-section-index': sectionIndex,
        'data-suggestion-index': itemIndex,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onTouchStart: onMouseDown, // Because on iOS `onMouseDown` is not triggered
        onClick
      };
    };
    const renderItem = item => renderSuggestion(item, { value, valueBeforeUpDown });

    return (
      <Autowhatever multiSection={multiSection}
                    items={items}
                    renderItem={renderItem}
                    renderSectionTitle={renderSectionTitle}
                    getSectionItems={getSectionSuggestions}
                    focusedSectionIndex={focusedSectionIndex}
                    focusedItemIndex={focusedSuggestionIndex}
                    inputProps={autowhateverInputProps}
                    itemProps={itemProps}
                    theme={theme}
                    id={id}
                    ref={this.saveInput} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autosuggest);
