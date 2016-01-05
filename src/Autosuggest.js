import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
         revealSuggestions, closeSuggestions } from './reducerAndActions';
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
  return {
    inputFocused: shouldRenderSuggestions => {
      dispatch(inputFocused(shouldRenderSuggestions));
    },
    inputBlurred: () => {
      dispatch(inputBlurred());
    },
    inputChanged: (shouldRenderSuggestions, lastAction) => {
      dispatch(inputChanged(shouldRenderSuggestions, lastAction));
    },
    updateFocusedSuggestion: (sectionIndex, suggestionIndex, value) => {
      dispatch(updateFocusedSuggestion(sectionIndex, suggestionIndex, value));
    },
    revealSuggestions: () => {
      dispatch(revealSuggestions());
    },
    closeSuggestions: lastAction => {
      dispatch(closeSuggestions(lastAction));
    }
  };
}

class Autosuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    shouldRenderSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    multiSection: PropTypes.bool.isRequired,
    renderSectionTitle: PropTypes.func.isRequired,
    getSectionSuggestions: PropTypes.func.isRequired,
    focusInputOnSuggestionClick: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,

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

  constructor(props) {
    super(props);

    this.saveInput = this.saveInput.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      const { suggestions, inputProps, shouldRenderSuggestions,
              isCollapsed, revealSuggestions, lastAction } = nextProps;
      const { value } = inputProps;

      if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter' &&
          suggestions.length > 0 && shouldRenderSuggestions(value)) {
        revealSuggestions();
      }
    }
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

  maybeEmitOnChange(event, newValue, method) {
    const { value, onChange } = this.props.inputProps;

    if (newValue !== value) {
      onChange && onChange(event, { newValue, method });
    }
  }

  willRenderSuggestions() {
    const { suggestions, inputProps, shouldRenderSuggestions } = this.props;
    const { value } = inputProps;

    return suggestions.length > 0 && shouldRenderSuggestions(value);
  }

  saveInput(autowhatever) {
    if (autowhatever !== null) {
      this.input = autowhatever.refs.input;
    }
  }

  render() {
    const {
      suggestions, renderSuggestion, inputProps, shouldRenderSuggestions,
      onSuggestionSelected, multiSection, renderSectionTitle, id,
      getSectionSuggestions, focusInputOnSuggestionClick, theme, isFocused,
      isCollapsed, focusedSectionIndex, focusedSuggestionIndex,
      valueBeforeUpDown, inputFocused, inputBlurred, inputChanged,
      updateFocusedSuggestion, revealSuggestions, closeSuggestions
    } = this.props;
    const { value, onBlur, onFocus, onKeyDown } = inputProps;
    const isOpen = isFocused && !isCollapsed && this.willRenderSuggestions();
    const items = (isOpen ? suggestions : []);
    const autowhateverInputProps = {
      ...inputProps,
      onFocus: event => {
        if (!this.justClickedOnSuggestion) {
          inputFocused(shouldRenderSuggestions(value));
          onFocus && onFocus(event);
        }
      },
      onBlur: event => {
        if (!this.justClickedOnSuggestion) {
          inputBlurred();
          onBlur && onBlur(event);
        }
      },
      onChange: event => {
        const { value } = event.target;
        const { shouldRenderSuggestions } = this.props;

        this.maybeEmitOnChange(event, value, 'type');
        inputChanged(shouldRenderSuggestions(value), 'type');
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
              const newValue = newFocusedItemIndex === null ?
                valueBeforeUpDown :
                this.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex);

              updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, value);
              this.maybeEmitOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
            }
            event.preventDefault();
            break;

          case 'Enter': {
            const focusedSuggestion = this.getFocusedSuggestion();

            if (focusedSuggestion !== null) {
              closeSuggestions('enter');
              onSuggestionSelected(event, {
                suggestion: focusedSuggestion,
                suggestionValue: value,
                method: 'enter'
              });
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
                this.maybeEmitOnChange(event, '', 'escape');
              }
            } else { // Interacted with Up/Down
              this.maybeEmitOnChange(event, valueBeforeUpDown, 'escape');
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

      onSuggestionSelected(event, {
        suggestion: clickedSuggestion,
        suggestionValue: clickedSuggestionValue,
        method: 'click'
      });
      this.maybeEmitOnChange(event, clickedSuggestionValue, 'click');
      closeSuggestions('click');

      if (focusInputOnSuggestionClick === true) {
        this.input.focus();
      }

      this.justClickedOnSuggestion = false;
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
