import React, { Component, PropTypes } from 'react';
import { updateIsOpen, updateFocusedSuggestion } from './flux/actionCreators';
import { connect } from 'react-redux';
import Autowhatever from 'react-autowhatever';
import createSectionIterator from 'section-iterator';

function mapStateToProps(state) {
  return {
    isOpen: state.isOpen,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsOpen: isOpen => {
      dispatch(updateIsOpen(isOpen))
    },
    updateFocusedSuggestion: (sectionIndex, suggestionIndex) => {
      dispatch(updateFocusedSuggestion(sectionIndex, suggestionIndex))
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

    isOpen: PropTypes.bool.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedSuggestionIndex: PropTypes.number,

    updateIsOpen: PropTypes.func.isRequired,
    updateFocusedSuggestion: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.multiSection === this.props.multiSection &&
        nextProps.shouldRenderSuggestions === this.props.shouldRenderSuggestions &&
        nextProps.suggestions === this.props.suggestions &&
        nextProps.getSuggestionValue === this.props.getSuggestionValue &&
        nextProps.renderSuggestion === this.props.renderSuggestion &&
        nextProps.renderSectionTitle === this.props.renderSectionTitle &&
        nextProps.getSectionSuggestions === this.props.getSectionSuggestions &&
        nextProps.inputProps === this.props.inputProps &&
        nextProps.theme === this.props.theme) {
      return;
    }

    const { shouldRenderSuggestions, suggestions, inputProps, updateIsOpen } = nextProps;
    const isOpen = shouldRenderSuggestions(inputProps.value) && suggestions.length > 0;

    updateIsOpen(isOpen);
  }

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
    const { multiSection, shouldRenderSuggestions, suggestions,
            renderSuggestion, renderSectionTitle, getSectionSuggestions,
            inputProps, theme, isOpen, focusedSectionIndex,
            focusedSuggestionIndex, updateIsOpen, updateFocusedSuggestion } = this.props;
    const items = (isOpen ? suggestions : []);
    const { value, onBlur, onFocus, onKeyDown, onChange } = inputProps;
    const sectionIterator = createSectionIterator({
      multiSection,
      data: multiSection ?
        suggestions.map(section => getSectionSuggestions(section).length) :
        suggestions.length
    });
    const autowhateverInputProps = {
      ...inputProps,
      onBlur: event => {
        updateIsOpen(false);

        onBlur && onBlur(event);
      },
      onFocus: event => {
        const isOpen = shouldRenderSuggestions(value) && suggestions.length > 0;

        updateIsOpen(isOpen);

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
