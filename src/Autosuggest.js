import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
         revealSuggestions, closeSuggestions } from './redux';
import Autowhatever from 'react-autowhatever';

function mapStateToProps(state) {
  return {
    isFocused: state.isFocused,
    isCollapsed: state.isCollapsed,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex,
    valueBeforeUpDown: state.valueBeforeUpDown
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
    inputChanged: shouldRenderSuggestions => {
      dispatch(inputChanged(shouldRenderSuggestions));
    },
    updateFocusedSuggestion: (sectionIndex, suggestionIndex, value) => {
      dispatch(updateFocusedSuggestion(sectionIndex, suggestionIndex, value));
    },
    revealSuggestions: () => {
      dispatch(revealSuggestions());
    },
    closeSuggestions: () => {
      dispatch(closeSuggestions());
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
    theme: PropTypes.object.isRequired,

    isFocused: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedSuggestionIndex: PropTypes.number,
    valueBeforeUpDown: PropTypes.string,

    inputFocused: PropTypes.func.isRequired,
    inputBlurred: PropTypes.func.isRequired,
    inputChanged: PropTypes.func.isRequired,
    updateFocusedSuggestion: PropTypes.func.isRequired,
    revealSuggestions: PropTypes.func.isRequired,
    closeSuggestions: PropTypes.func.isRequired
  };

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

  maybeEmitOnChange(event, newValue, method) {
    const { value, onChange } = this.props.inputProps;

    if (newValue !== value) {
      onChange && onChange(event, { newValue, method });
    }
  }

  willRenderSuggestions() {
    const { suggestions, inputProps, shouldRenderSuggestions } = this.props;
    const { value } = inputProps;

    return shouldRenderSuggestions(value) && suggestions.length > 0;
  }

  render() {
    const { suggestions, renderSuggestion, inputProps, shouldRenderSuggestions,
            onSuggestionSelected, multiSection, renderSectionTitle,
            getSectionSuggestions, theme, isFocused, isCollapsed,
            focusedSectionIndex, focusedSuggestionIndex, valueBeforeUpDown,
            inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
            revealSuggestions, closeSuggestions } = this.props;
    const { value, onBlur, onFocus, onKeyDown, onChange } = inputProps;
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

        inputChanged(shouldRenderSuggestions(value));
        this.maybeEmitOnChange(event, value, 'type');
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
              closeSuggestions();
              onSuggestionSelected(event, { suggestion: focusedSuggestion, method: 'enter' });
            }
            break;
          }

          case 'Escape':
            if (valueBeforeUpDown !== null) {
              this.maybeEmitOnChange(event, valueBeforeUpDown, 'escape');
            } else if (isCollapsed) {
              this.maybeEmitOnChange(event, '', 'escape');
            }

            closeSuggestions();
            break;
        }

        onKeyDown && onKeyDown(event);
      }
    };
    const itemProps = {
      onMouseEnter: (event, { sectionIndex, itemIndex }) => {
        updateFocusedSuggestion(sectionIndex, itemIndex);
      },
      onMouseLeave: () => {
        updateFocusedSuggestion(null, null);
      },
      onMouseDown: () => {
        this.justClickedOnSuggestion = true;
      },
      onClick: (event, { sectionIndex, itemIndex }) => {
        const focusedSuggestion = this.getFocusedSuggestion();
        const suggestionValue = this.getSuggestionValueByIndex(sectionIndex, itemIndex);

        onSuggestionSelected(event, { suggestion: focusedSuggestion, method: 'click' });
        this.maybeEmitOnChange(event, suggestionValue, 'click');
        closeSuggestions();
        this.input.focus();
        this.justClickedOnSuggestion = false;
      }
    };
    const renderItem = item => renderSuggestion(item, value, valueBeforeUpDown);

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
                    ref={autowhatever => {
                      if (autowhatever !== null) {
                        this.input = autowhatever.refs.input;
                      }
                    }} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autosuggest);
