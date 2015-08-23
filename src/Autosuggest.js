import React, { Component, PropTypes } from 'react';
import { inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
         revealSuggestions, selectSuggestion } from './flux/actionCreators';
import { connect } from 'react-redux';
import Autowhatever from 'react-autowhatever';
import createSectionIterator from 'section-iterator';

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
    selectSuggestion: () => {
      dispatch(selectSuggestion());
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
    selectSuggestion: PropTypes.func.isRequired
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

  render() {
    const { multiSection, shouldRenderSuggestions, suggestions,
            renderSuggestion, renderSectionTitle, getSectionSuggestions,
            inputProps, onSuggestionSelected, theme, isFocused, isCollapsed,
            focusedSectionIndex, focusedSuggestionIndex, valueBeforeUpDown,
            inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
            revealSuggestions, selectSuggestion } = this.props;
    const { value, onBlur, onFocus, onKeyDown, onChange } = inputProps;
    const isOpen = isFocused && !isCollapsed &&
                   shouldRenderSuggestions(value) && suggestions.length > 0;
    const items = (isOpen ? suggestions : []);
    const sectionIterator = createSectionIterator({
      multiSection,
      data: multiSection ?
        suggestions.map(section => getSectionSuggestions(section).length) :
        suggestions.length
    });
    const autowhateverInputProps = {
      ...inputProps,
      onFocus: event => {
        inputFocused();
        onFocus && onFocus(event);
      },
      onBlur: event => {
        inputBlurred();
        onBlur && onBlur(event);
      },
      onChange: event => {
        const { value } = event.target;

        inputChanged(!shouldRenderSuggestions(value));
        onChange && onChange(event, value, 'type');
      },
      onKeyDown: event => {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            if (isCollapsed) {
              if (shouldRenderSuggestions(value) && suggestions.length > 0) {
                revealSuggestions();
              }
            } else {
              const nextPrev = (event.key === 'ArrowDown' ? 'next' : 'prev');
              const [nextFocusedSectionIndex, nextFocusedSuggestionIndex] =
                sectionIterator[nextPrev]([focusedSectionIndex, focusedSuggestionIndex]);
              const newValue = nextFocusedSuggestionIndex === null ?
                valueBeforeUpDown :
                this.getSuggestionValue(nextFocusedSectionIndex, nextFocusedSuggestionIndex);

              updateFocusedSuggestion(nextFocusedSectionIndex, nextFocusedSuggestionIndex, value);
              onChange && onChange(event, newValue, 'up-down');
            }
            event.preventDefault();
            break;

          case 'Enter': {
            const focusedSuggestion = this.getFocusedSuggestion();

            if (focusedSuggestion !== null) {
              selectSuggestion();
              onSuggestionSelected(event, focusedSuggestion);
            }
            break;
          }

          case 'Escape':
            break;
        }

        onKeyDown && onKeyDown(event);
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
                    theme={theme} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autosuggest);
