import React, { Component, PropTypes } from 'react';
import { inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
         revealSuggestions, closeSuggestions } from './flux/actionCreators';
import { connect } from 'react-redux';
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
    inputFocused: () => {
      dispatch(inputFocused());
    },
    inputBlurred: () => {
      dispatch(inputBlurred());
    },
    inputChanged: shouldCollapse => {
      dispatch(inputChanged(shouldCollapse));
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
    multiSection: PropTypes.bool.isRequired,
    shouldRenderSuggestions: PropTypes.func.isRequired,
    suggestions: PropTypes.array.isRequired,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    renderSectionTitle: PropTypes.func.isRequired,
    getSectionSuggestions: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
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
    const { multiSection, suggestions, getSectionSuggestions } = this.props;

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

  getSuggestionValue(sectionIndex, suggestionIndex) {
    const { getSuggestionValue } = this.props;

    return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex));
  }

  maybeEmitOnChange(event, newValue, method) {
    const { value, onChange } = this.props.inputProps;

    if (newValue !== value) {
      onChange && onChange(event, { newValue, method });
    }
  }

  render() {
    const { multiSection, shouldRenderSuggestions, suggestions,
            renderSuggestion, renderSectionTitle, getSectionSuggestions,
            inputProps, onSuggestionSelected, theme, isFocused, isCollapsed,
            focusedSectionIndex, focusedSuggestionIndex, valueBeforeUpDown,
            inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
            revealSuggestions, closeSuggestions } = this.props;
    const { value, onBlur, onFocus, onKeyDown, onChange } = inputProps;
    const isOpen = isFocused && !isCollapsed &&
                   shouldRenderSuggestions(value) && suggestions.length > 0;
    const items = (isOpen ? suggestions : []);
    const autowhateverInputProps = {
      ...inputProps,
      onFocus: event => {
        if (!this.justClickedOnSuggestion) {
          inputFocused();
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

        inputChanged(!shouldRenderSuggestions(value));
        this.maybeEmitOnChange(event, value, 'type');
      },
      onKeyDown: (event, data) => {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            if (isCollapsed) {
              if (shouldRenderSuggestions(value) && suggestions.length > 0) {
                revealSuggestions();
              }
            } else {
              const { newFocusedSectionIndex, newFocusedItemIndex } = data;
              const newValue = newFocusedItemIndex === null ?
                valueBeforeUpDown :
                this.getSuggestionValue(newFocusedSectionIndex, newFocusedItemIndex);

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
      onMouseDown: (event, { sectionIndex, itemIndex }) => {
        const focusedSuggestion = this.getFocusedSuggestion();
        const suggestionValue = this.getSuggestionValue(sectionIndex, itemIndex);

        onSuggestionSelected(event, { suggestion: focusedSuggestion, method: 'click' });
        this.maybeEmitOnChange(event, suggestionValue, 'click');
        closeSuggestions();

        this.justClickedOnSuggestion = true;

        setTimeout(() => {
          this.input.focus();
          this.justClickedOnSuggestion = false;
        });
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
