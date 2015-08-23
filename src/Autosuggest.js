import React, { Component, PropTypes } from 'react';
import { inputFocused, inputBlurred, updateFocusedSuggestion } from './flux/actionCreators';
import { connect } from 'react-redux';
import Autowhatever from 'react-autowhatever';
import createSectionIterator from 'section-iterator';

function mapStateToProps(state) {
  return {
    isFocused: state.isFocused,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex
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
    updateFocusedSuggestion: (sectionIndex, suggestionIndex) => {
      dispatch(updateFocusedSuggestion(sectionIndex, suggestionIndex));
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
    theme: PropTypes.object.isRequired,

    isFocused: PropTypes.bool.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedSuggestionIndex: PropTypes.number,

    inputFocused: PropTypes.func.isRequired,
    inputBlurred: PropTypes.func.isRequired,
    updateFocusedSuggestion: PropTypes.func.isRequired
  };

  getSuggestion(sectionIndex, suggestionIndex) {
    const { multiSection, suggestions, getSectionSuggestions } = this.props;

    if (multiSection) {
      return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
    }

    return suggestions[suggestionIndex];
  }

  getSuggestionValue(sectionIndex, suggestionIndex) {
    const { getSuggestionValue } = this.props;

    return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex));
  }

  render() {
    console.log('render');
    const { multiSection, shouldRenderSuggestions, suggestions,
            renderSuggestion, renderSectionTitle, getSectionSuggestions,
            inputProps, theme, isFocused, focusedSectionIndex, focusedSuggestionIndex,
            inputFocused, inputBlurred, updateFocusedSuggestion } = this.props;
    const { value, onBlur, onFocus, onKeyDown, onChange } = inputProps;
    const isOpen = isFocused && shouldRenderSuggestions(value) && suggestions.length > 0;
    const items = (isOpen ? suggestions : []);
    const sectionIterator = createSectionIterator({
      multiSection,
      data: multiSection ?
        suggestions.map(section => getSectionSuggestions(section).length) :
        suggestions.length
    });
    const autowhateverInputProps = {
      ...inputProps,
      onBlur: event => {
        inputBlurred();
        onBlur && onBlur(event);
      },
      onFocus: event => {
        inputFocused();
        onFocus && onFocus(event);
      },
      onChange: event => {
        onChange && onChange(event, event.target.value, 'type');
      },
      onKeyDown: event => {
        switch (event.key) {
          case 'ArrowDown': {
            const [nextFocusedSectionIndex, nextFocusedSuggestionIndex] =
              sectionIterator.next([focusedSectionIndex, focusedSuggestionIndex]);

            updateFocusedSuggestion(nextFocusedSectionIndex, nextFocusedSuggestionIndex);

            onChange && onChange(event, this.getSuggestionValue(nextFocusedSectionIndex, nextFocusedSuggestionIndex), 'up-down');
            event.preventDefault();
            break;
          }

          case 'ArrowUp': {
            const [nextFocusedSectionIndex, nextFocusedSuggestionIndex] =
              sectionIterator.prev([focusedSectionIndex, focusedSuggestionIndex]);

            updateFocusedSuggestion(nextFocusedSectionIndex, nextFocusedSuggestionIndex);

            onChange && onChange(event, this.getSuggestionValue(nextFocusedSectionIndex, nextFocusedSuggestionIndex), 'up-down');
            event.preventDefault();
            break;
          }
        }

        onKeyDown && onKeyDown(event);
      }
    };

    return (
      <Autowhatever multiSection={multiSection}
                    items={items}
                    renderItem={renderSuggestion}
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
