import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEqualArrays from 'shallow-equal/arrays';
import Autowhatever from 'react-autowhatever';
import { defaultTheme, mapToAutowhateverTheme } from './theme';

const alwaysTrue = () => true;
const defaultShouldRenderSuggestions = (value) => value.trim().length > 0;
const defaultRenderSuggestionsContainer = ({ containerProps, children }) => (
  <div {...containerProps}>{children}</div>
);
const updateHighlightedSuggestionAux = (
  state,
  props,
  sectionIndex,
  suggestionIndex,
  prevValue
) => {
  let { valueBeforeUpDown } = state;
  const { getSectionSuggestions, suggestions, multiSection } = props;

  if (suggestionIndex === null) {
    valueBeforeUpDown = null;
  } else if (valueBeforeUpDown === null && typeof prevValue !== 'undefined') {
    valueBeforeUpDown = prevValue;
  }

  return {
    highlightedSectionIndex: multiSection ? sectionIndex : null,
    highlightedSuggestionIndex: suggestionIndex,
    highlightedSuggestion:
      suggestionIndex === null
        ? null
        : multiSection
        ? getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex]
        : suggestions[suggestionIndex],
    valueBeforeUpDown,
  };
};
const willRenderSuggestionsAux = (props) => {
  const { suggestions, inputProps, shouldRenderSuggestions } = props;
  const { value } = inputProps;

  return suggestions.length > 0 && shouldRenderSuggestions(value);
};

const resetHighlightedSuggestionAux = (state, shouldResetValueBeforeUpDown) => {
  const { valueBeforeUpDown } = state;

  return {
    highlightedSectionIndex: null,
    highlightedSuggestionIndex: null,
    highlightedSuggestion: null,
    valueBeforeUpDown: shouldResetValueBeforeUpDown ? null : valueBeforeUpDown,
  };
};

export default class Autosuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    onSuggestionsFetchRequested: (props, propName) => {
      const onSuggestionsFetchRequested = props[propName];

      if (typeof onSuggestionsFetchRequested !== 'function') {
        throw new Error(
          "'onSuggestionsFetchRequested' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsFetchRequestedProp"
        );
      }
    },
    onSuggestionsClearRequested: (props, propName) => {
      const onSuggestionsClearRequested = props[propName];

      if (
        props.alwaysRenderSuggestions === false &&
        typeof onSuggestionsClearRequested !== 'function'
      ) {
        throw new Error(
          "'onSuggestionsClearRequested' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsClearRequestedProp"
        );
      }
    },
    onSuggestionSelected: PropTypes.func,
    onSuggestionHighlighted: PropTypes.func,
    renderInputComponent: PropTypes.func,
    renderSuggestionsContainer: PropTypes.func,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: (props, propName) => {
      const inputProps = props[propName];

      if (!Object.prototype.hasOwnProperty.call(inputProps, 'value')) {
        throw new Error("'inputProps' must have 'value'.");
      }

      if (!Object.prototype.hasOwnProperty.call(inputProps, 'onChange')) {
        throw new Error("'inputProps' must have 'onChange'.");
      }
    },
    shouldRenderSuggestions: PropTypes.func,
    alwaysRenderSuggestions: PropTypes.bool,
    multiSection: PropTypes.bool,
    renderSectionTitle: (props, propName) => {
      const renderSectionTitle = props[propName];

      if (
        props.multiSection === true &&
        typeof renderSectionTitle !== 'function'
      ) {
        throw new Error(
          "'renderSectionTitle' must be implemented. See: https://github.com/moroshko/react-autosuggest#renderSectionTitleProp"
        );
      }
    },
    getSectionSuggestions: (props, propName) => {
      const getSectionSuggestions = props[propName];

      if (
        props.multiSection === true &&
        typeof getSectionSuggestions !== 'function'
      ) {
        throw new Error(
          "'getSectionSuggestions' must be implemented. See: https://github.com/moroshko/react-autosuggest#getSectionSuggestionsProp"
        );
      }
    },
    focusInputOnSuggestionClick: PropTypes.bool,
    highlightFirstSuggestion: PropTypes.bool,
    theme: PropTypes.object,
    id: PropTypes.string,
  };

  static defaultProps = {
    renderSuggestionsContainer: defaultRenderSuggestionsContainer,
    shouldRenderSuggestions: defaultShouldRenderSuggestions,
    alwaysRenderSuggestions: false,
    multiSection: false,
    focusInputOnSuggestionClick: true,
    highlightFirstSuggestion: false,
    theme: defaultTheme,
    id: '1',
  };

  constructor(props) {
    super();

    this.state = {
      isFocused: false,
      isCollapsed: !props.alwaysRenderSuggestions,
      highlightedSectionIndex: null,
      highlightedSuggestionIndex: null,
      highlightedSuggestion: null,
      valueBeforeUpDown: null,
      prevSuggestions: props.suggestions,
      justPressedUpDown: false,
      justMouseEntered: false,
      justSelectedSuggestion: false,
    };

    this.pressedSuggestion = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      justPressedUpDown,
      justMouseEntered,
      justSelectedSuggestion,
      prevSuggestions,
      isCollapsed,
    } = prevState;
    const { suggestions, highlightFirstSuggestion } = nextProps;
    const derivedState = {
      justMouseEntered: false,
      justPressedUpDown: false,
      prevSuggestions: suggestions,
    };

    if (shallowEqualArrays(suggestions, prevSuggestions)) {
      if (
        suggestions.length > 0 &&
        highlightFirstSuggestion &&
        justMouseEntered === false &&
        justPressedUpDown === false
      ) {
        return {
          ...derivedState,
          ...updateHighlightedSuggestionAux(prevState, nextProps, 0, 0),
        };
      }
    } else {
      if (
        willRenderSuggestionsAux(nextProps) &&
        isCollapsed &&
        !justSelectedSuggestion
      ) {
        return { ...derivedState, ...{ isCollapsed: false } };
      } else {
        return {
          ...derivedState,
          ...resetHighlightedSuggestionAux(prevState, null),
        };
      }
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onDocumentMouseDown);
    document.addEventListener('mouseup', this.onDocumentMouseUp);

    this.input = this.autowhatever.input;
    this.suggestionsContainer = this.autowhatever.itemsContainer;
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      suggestions,
      onSuggestionHighlighted,
      highlightFirstSuggestion,
    } = this.props;

    if (
      !shallowEqualArrays(suggestions, prevProps.suggestions) &&
      suggestions.length > 0 &&
      highlightFirstSuggestion
    ) {
      this.highlightFirstSuggestion();
      return;
    }

    if (onSuggestionHighlighted) {
      const highlightedSuggestion = this.getHighlightedSuggestion();
      const prevHighlightedSuggestion = prevState.highlightedSuggestion;

      if (highlightedSuggestion != prevHighlightedSuggestion) {
        onSuggestionHighlighted({
          suggestion: highlightedSuggestion,
        });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onDocumentMouseDown);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  }

  updateHighlightedSuggestion(sectionIndex, suggestionIndex, prevValue) {
    this.setState((state) => {
      return updateHighlightedSuggestionAux(
        state,
        this.props,
        sectionIndex,
        suggestionIndex,
        prevValue
      );
    });
  }

  resetHighlightedSuggestion(shouldResetValueBeforeUpDown = true) {
    this.setState((state) => {
      return resetHighlightedSuggestionAux(state, shouldResetValueBeforeUpDown);
    });
  }

  revealSuggestions() {
    this.setState({
      isCollapsed: false,
    });
  }

  closeSuggestions() {
    this.setState({
      highlightedSectionIndex: null,
      highlightedSuggestionIndex: null,
      highlightedSuggestion: null,
      valueBeforeUpDown: null,
      isCollapsed: true,
    });
  }

  getSuggestion(sectionIndex, suggestionIndex) {
    const { suggestions, multiSection, getSectionSuggestions } = this.props;

    if (multiSection) {
      return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
    }

    return suggestions[suggestionIndex];
  }

  getHighlightedSuggestion() {
    const { highlightedSectionIndex, highlightedSuggestionIndex } = this.state;

    if (highlightedSuggestionIndex === null) {
      return null;
    }

    return this.getSuggestion(
      highlightedSectionIndex,
      highlightedSuggestionIndex
    );
  }

  getSuggestionValueByIndex(sectionIndex, suggestionIndex) {
    const { getSuggestionValue } = this.props;

    return getSuggestionValue(
      this.getSuggestion(sectionIndex, suggestionIndex)
    );
  }

  getSuggestionIndices(suggestionElement) {
    const sectionIndex = suggestionElement.getAttribute('data-section-index');
    const suggestionIndex = suggestionElement.getAttribute(
      'data-suggestion-index'
    );

    return {
      sectionIndex:
        typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null,
      suggestionIndex: parseInt(suggestionIndex, 10),
    };
  }

  onDocumentMouseDown = (event) => {
    this.justClickedOnSuggestionsContainer = false;

    let node =
      (event.detail && event.detail.target) || // This is for testing only. Please show me a better way to emulate this.
      event.target;

    while (node !== null && node !== document) {
      if (
        node.getAttribute &&
        node.getAttribute('data-suggestion-index') !== null
      ) {
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
      if (
        node.getAttribute &&
        node.getAttribute('data-suggestion-index') !== null
      ) {
        return node;
      }

      node = node.parentNode;
    } while (node !== null);

    console.error('Clicked element:', startNode); // eslint-disable-line no-console
    throw new Error("Couldn't find suggestion element");
  }

  maybeCallOnChange(event, newValue, method) {
    const { value, onChange } = this.props.inputProps;

    if (newValue !== value) {
      onChange(event, { newValue, method });
    }
  }

  willRenderSuggestions(props) {
    return willRenderSuggestionsAux(props);
  }

  storeAutowhateverRef = (autowhatever) => {
    if (autowhatever !== null) {
      this.autowhatever = autowhatever;
    }
  };

  onSuggestionMouseEnter = (event, { sectionIndex, itemIndex }) => {
    this.updateHighlightedSuggestion(sectionIndex, itemIndex);
    let { justSelectedSuggestion } = this.state;

    if (event.target === this.pressedSuggestion) {
      justSelectedSuggestion = true;
    }

    this.setState({ justMouseEntered: true, justSelectedSuggestion });
  };

  highlightFirstSuggestion = () => {
    this.updateHighlightedSuggestion(this.props.multiSection ? 0 : null, 0);
  };

  onDocumentMouseUp = () => {
    if (this.pressedSuggestion && !this.state.justSelectedSuggestion) {
      this.input.focus();
    }
    this.pressedSuggestion = null;
  };

  onSuggestionMouseDown = (event) => {
    // Checking if this.justSelectedSuggestion is already true to not duplicate touch events in chrome
    // See: https://github.com/facebook/react/issues/9809#issuecomment-413978405
    if (!this.state.justSelectedSuggestion) {
      this.pressedSuggestion = event.target;
      this.setState({ justSelectedSuggestion: true });
    }
  };

  onSuggestionsClearRequested = () => {
    const { onSuggestionsClearRequested } = this.props;

    onSuggestionsClearRequested && onSuggestionsClearRequested();
  };

  onSuggestionSelected = (event, data) => {
    const {
      alwaysRenderSuggestions,
      onSuggestionSelected,
      onSuggestionsFetchRequested,
    } = this.props;

    onSuggestionSelected && onSuggestionSelected(event, data);

    if (alwaysRenderSuggestions) {
      onSuggestionsFetchRequested({
        value: data.suggestionValue,
        reason: 'suggestion-selected',
      });
    } else {
      this.onSuggestionsClearRequested();
    }

    this.resetHighlightedSuggestion();
  };

  onSuggestionClick = (event) => {
    const { alwaysRenderSuggestions, focusInputOnSuggestionClick } = this.props;
    const { sectionIndex, suggestionIndex } = this.getSuggestionIndices(
      this.findSuggestionElement(event.target)
    );
    const clickedSuggestion = this.getSuggestion(sectionIndex, suggestionIndex);
    const clickedSuggestionValue = this.props.getSuggestionValue(
      clickedSuggestion
    );

    this.maybeCallOnChange(event, clickedSuggestionValue, 'click');
    this.onSuggestionSelected(event, {
      suggestion: clickedSuggestion,
      suggestionValue: clickedSuggestionValue,
      suggestionIndex: suggestionIndex,
      sectionIndex,
      method: 'click',
    });

    if (!alwaysRenderSuggestions) {
      this.closeSuggestions();
    }

    if (focusInputOnSuggestionClick === true) {
      this.input.focus();
    } else {
      this.onBlur();
    }

    this.setState({
      justSelectedSuggestion: false,
    });
  };

  onBlur = () => {
    const { inputProps, shouldRenderSuggestions } = this.props;
    const { value, onBlur } = inputProps;
    const highlightedSuggestion = this.getHighlightedSuggestion();
    const shouldRender = shouldRenderSuggestions(value);

    this.setState({
      isFocused: false,
      highlightedSectionIndex: null,
      highlightedSuggestionIndex: null,
      highlightedSuggestion: null,
      valueBeforeUpDown: null,
      isCollapsed: !shouldRender,
    });

    onBlur && onBlur(this.blurEvent, { highlightedSuggestion });
  };

  onSuggestionMouseLeave = (event) => {
    this.resetHighlightedSuggestion(false); // shouldResetValueBeforeUpDown

    if (
      this.state.justSelectedSuggestion &&
      event.target === this.pressedSuggestion
    ) {
      this.setState({ justSelectedSuggestion: false });
    }
  };

  onSuggestionTouchStart = () => {
    this.setState({ justSelectedSuggestion: true });
    // todo: event.preventDefault when https://github.com/facebook/react/issues/2043
    // todo: gets released so onSuggestionMouseDown won't fire in chrome
  };

  onSuggestionTouchMove = () => {
    this.setState({ justSelectedSuggestion: false });
    this.pressedSuggestion = null;
    this.input.focus();
  };

  itemProps = ({ sectionIndex, itemIndex }) => {
    return {
      'data-section-index': sectionIndex,
      'data-suggestion-index': itemIndex,
      onMouseEnter: this.onSuggestionMouseEnter,
      onMouseLeave: this.onSuggestionMouseLeave,
      onMouseDown: this.onSuggestionMouseDown,
      onTouchStart: this.onSuggestionTouchStart,
      onTouchMove: this.onSuggestionTouchMove,
      onClick: this.onSuggestionClick,
    };
  };

  getQuery() {
    const { inputProps } = this.props;
    const { value } = inputProps;
    const { valueBeforeUpDown } = this.state;

    return (valueBeforeUpDown === null ? value : valueBeforeUpDown).trim();
  }

  renderSuggestionsContainer = ({ containerProps, children }) => {
    const { renderSuggestionsContainer } = this.props;

    return renderSuggestionsContainer({
      containerProps,
      children,
      query: this.getQuery(),
    });
  };

  render() {
    const {
      suggestions,
      renderInputComponent,
      onSuggestionsFetchRequested,
      renderSuggestion,
      inputProps,
      multiSection,
      renderSectionTitle,
      id,
      getSectionSuggestions,
      theme,
      getSuggestionValue,
      alwaysRenderSuggestions,
      highlightFirstSuggestion,
    } = this.props;
    const {
      isFocused,
      isCollapsed,
      highlightedSectionIndex,
      highlightedSuggestionIndex,
      valueBeforeUpDown,
    } = this.state;
    const shouldRenderSuggestions = alwaysRenderSuggestions
      ? alwaysTrue
      : this.props.shouldRenderSuggestions;
    const { value, onFocus, onKeyDown } = inputProps;
    const willRenderSuggestions = this.willRenderSuggestions(this.props);
    const isOpen =
      alwaysRenderSuggestions ||
      (isFocused && !isCollapsed && willRenderSuggestions);
    const items = isOpen ? suggestions : [];
    const autowhateverInputProps = {
      ...inputProps,
      onFocus: (event) => {
        if (
          !this.state.justSelectedSuggestion &&
          !this.justClickedOnSuggestionsContainer
        ) {
          const shouldRender = shouldRenderSuggestions(value);

          this.setState({
            isFocused: true,
            isCollapsed: !shouldRender,
          });

          onFocus && onFocus(event);

          if (shouldRender) {
            onSuggestionsFetchRequested({ value, reason: 'input-focused' });
          }
        }
      },
      onBlur: (event) => {
        if (this.justClickedOnSuggestionsContainer) {
          this.input.focus();
          return;
        }

        this.blurEvent = event;

        if (!this.state.justSelectedSuggestion) {
          this.onBlur();
          this.onSuggestionsClearRequested();
        }
      },
      onChange: (event) => {
        const { value } = event.target;
        const shouldRender = shouldRenderSuggestions(value);

        this.maybeCallOnChange(event, value, 'type');

        if (this.suggestionsContainer) {
          this.suggestionsContainer.scrollTop = 0;
        }

        this.setState({
          ...(highlightFirstSuggestion
            ? {}
            : {
                highlightedSectionIndex: null,
                highlightedSuggestionIndex: null,
                highlightedSuggestion: null,
              }),
          valueBeforeUpDown: null,
          isCollapsed: !shouldRender,
        });

        if (shouldRender) {
          onSuggestionsFetchRequested({ value, reason: 'input-changed' });
        } else {
          this.onSuggestionsClearRequested();
        }
      },
      onKeyDown: (event, data) => {
        const { keyCode } = event;

        switch (keyCode) {
          case 40: // ArrowDown
          case 38: // ArrowUp
            if (isCollapsed) {
              if (shouldRenderSuggestions(value)) {
                onSuggestionsFetchRequested({
                  value,
                  reason: 'suggestions-revealed',
                });
                this.revealSuggestions();
              }
            } else if (suggestions.length > 0) {
              const {
                newHighlightedSectionIndex,
                newHighlightedItemIndex,
              } = data;

              let newValue;

              if (newHighlightedItemIndex === null) {
                // valueBeforeUpDown can be null if, for example, user
                // hovers on the first suggestion and then pressed Up.
                // If that happens, use the original input value.
                newValue =
                  valueBeforeUpDown === null ? value : valueBeforeUpDown;
              } else {
                newValue = this.getSuggestionValueByIndex(
                  newHighlightedSectionIndex,
                  newHighlightedItemIndex
                );
              }

              this.updateHighlightedSuggestion(
                newHighlightedSectionIndex,
                newHighlightedItemIndex,
                value
              );
              this.maybeCallOnChange(
                event,
                newValue,
                keyCode === 40 ? 'down' : 'up'
              );
            }

            event.preventDefault(); // Prevents the cursor from moving

            this.setState({ justPressedUpDown: true });

            break;

          // Enter
          case 13: {
            // See #388
            if (event.keyCode === 229) {
              break;
            }

            const highlightedSuggestion = this.getHighlightedSuggestion();

            if (isOpen && !alwaysRenderSuggestions) {
              this.closeSuggestions();
            }

            if (highlightedSuggestion != null) {
              const newValue = getSuggestionValue(highlightedSuggestion);

              this.maybeCallOnChange(event, newValue, 'enter');

              this.onSuggestionSelected(event, {
                suggestion: highlightedSuggestion,
                suggestionValue: newValue,
                suggestionIndex: highlightedSuggestionIndex,
                sectionIndex: highlightedSectionIndex,
                method: 'enter',
              });

              this.setState({ justSelectedSuggestion: true });
            }

            break;
          }

          // Escape
          case 27: {
            if (isOpen) {
              // If input.type === 'search', the browser clears the input
              // when Escape is pressed. We want to disable this default
              // behaviour so that, when suggestions are shown, we just hide
              // them, without clearing the input.
              event.preventDefault();
            }

            const willCloseSuggestions = isOpen && !alwaysRenderSuggestions;

            if (valueBeforeUpDown === null) {
              // Didn't interact with Up/Down
              if (!willCloseSuggestions) {
                const newValue = '';

                this.maybeCallOnChange(event, newValue, 'escape');

                if (shouldRenderSuggestions(newValue)) {
                  onSuggestionsFetchRequested({
                    value: newValue,
                    reason: 'escape-pressed',
                  });
                } else {
                  this.onSuggestionsClearRequested();
                }
              }
            } else {
              // Interacted with Up/Down
              this.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
            }

            if (willCloseSuggestions) {
              this.onSuggestionsClearRequested();
              this.closeSuggestions();
            } else {
              this.resetHighlightedSuggestion();
            }

            break;
          }
        }

        onKeyDown && onKeyDown(event);
      },
    };
    const renderSuggestionData = {
      query: this.getQuery(),
    };

    return (
      <Autowhatever
        multiSection={multiSection}
        items={items}
        renderInputComponent={renderInputComponent}
        renderItemsContainer={this.renderSuggestionsContainer}
        renderItem={renderSuggestion}
        renderItemData={renderSuggestionData}
        renderSectionTitle={renderSectionTitle}
        getSectionItems={getSectionSuggestions}
        highlightedSectionIndex={highlightedSectionIndex}
        highlightedItemIndex={highlightedSuggestionIndex}
        inputProps={autowhateverInputProps}
        itemProps={this.itemProps}
        theme={mapToAutowhateverTheme(theme)}
        id={id}
        ref={this.storeAutowhateverRef}
      />
    );
  }
}
