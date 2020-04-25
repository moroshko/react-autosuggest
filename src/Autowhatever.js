import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createSectionIterator from 'section-iterator';
import themeable from 'react-themeable';
import SectionTitle from './SectionTitle';
import ItemList from './ItemList';

const emptyObject = {};
const defaultRenderInputComponent = (props) => <input {...props} />;
const defaultRenderItemsContainer = ({ containerProps, children }) => (
  <div {...containerProps}>{children}</div>
);
const defaultTheme = {
  container: 'react-autowhatever__container',
  containerOpen: 'react-autowhatever__container--open',
  input: 'react-autowhatever__input',
  inputOpen: 'react-autowhatever__input--open',
  inputFocused: 'react-autowhatever__input--focused',
  itemsContainer: 'react-autowhatever__items-container',
  itemsContainerOpen: 'react-autowhatever__items-container--open',
  itemsList: 'react-autowhatever__items-list',
  item: 'react-autowhatever__item',
  itemFirst: 'react-autowhatever__item--first',
  itemHighlighted: 'react-autowhatever__item--highlighted',
  sectionContainer: 'react-autowhatever__section-container',
  sectionContainerFirst: 'react-autowhatever__section-container--first',
  sectionTitle: 'react-autowhatever__section-title',
};

export default class Autowhatever extends Component {
  static propTypes = {
    id: PropTypes.string, // Used in aria-* attributes. If multiple Autowhatever's are rendered on a page, they must have unique ids.
    multiSection: PropTypes.bool, // Indicates whether a multi section layout should be rendered.
    renderInputComponent: PropTypes.func, // When specified, it is used to render the input element.
    renderItemsContainer: PropTypes.func, // Renders the items container.
    items: PropTypes.array.isRequired, // Array of items or sections to render.
    renderItem: PropTypes.func.isRequired, // This function renders a single item.
    renderItemData: PropTypes.object, // Arbitrary data that will be passed to renderItem()
    renderSectionTitle: PropTypes.func.isRequired, // This function gets a section and renders its title.
    getSectionItems: PropTypes.func.isRequired, // This function gets a section and returns its items, which will be passed into `renderItem` for rendering.
    containerProps: PropTypes.object, // Arbitrary container props
    inputProps: PropTypes.object, // Arbitrary input props
    itemProps: PropTypes.oneOfType([
      // Arbitrary item props
      PropTypes.object,
      PropTypes.func,
    ]),
    highlightedSectionIndex: PropTypes.number, // Section index of the highlighted item
    highlightedItemIndex: PropTypes.number, // Highlighted item index (within a section)
    theme: PropTypes.oneOfType([
      // Styles. See: https://github.com/markdalgleish/react-themeable
      PropTypes.object,
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    id: '1',
    multiSection: false,
    renderInputComponent: defaultRenderInputComponent,
    renderItemsContainer: defaultRenderItemsContainer,
    renderItemData: emptyObject,
    containerProps: emptyObject,
    inputProps: emptyObject,
    itemProps: emptyObject,
    highlightedSectionIndex: null,
    highlightedItemIndex: null,
    theme: defaultTheme,
  };

  constructor(props) {
    super(props);

    this.highlightedItem = null;

    this.state = {
      isInputFocused: false,
    };

    this.setSectionsItems(props);
    this.setSectionIterator(props);
    this.setTheme(props);
  }

  componentDidMount() {
    this.ensureHighlightedItemIsVisible();
  }

  // eslint-disable-next-line camelcase, react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.setSectionsItems(nextProps);
    }

    if (
      nextProps.items !== this.props.items ||
      nextProps.multiSection !== this.props.multiSection
    ) {
      this.setSectionIterator(nextProps);
    }

    if (nextProps.theme !== this.props.theme) {
      this.setTheme(nextProps);
    }
  }

  componentDidUpdate() {
    this.ensureHighlightedItemIsVisible();
  }

  setSectionsItems(props) {
    if (props.multiSection) {
      this.sectionsItems = props.items.map((section) =>
        props.getSectionItems(section)
      );
      this.sectionsLengths = this.sectionsItems.map((items) => items.length);
      this.allSectionsAreEmpty = this.sectionsLengths.every(
        (itemsCount) => itemsCount === 0
      );
    }
  }

  setSectionIterator(props) {
    this.sectionIterator = createSectionIterator({
      multiSection: props.multiSection,
      data: props.multiSection ? this.sectionsLengths : props.items.length,
    });
  }

  setTheme(props) {
    this.theme = themeable(props.theme);
  }

  storeInputReference = (input) => {
    if (input !== null) {
      this.input = input;
    }

    const userRef = this.props.inputProps.ref;

    if (userRef) {
      if (typeof userRef === 'function') {
        userRef(input);
      } else if (
        typeof userRef === 'object' &&
        Object.prototype.hasOwnProperty.call(userRef, 'current')
      ) {
        userRef.current = input;
      }
    }
  };

  storeItemsContainerReference = (itemsContainer) => {
    if (itemsContainer !== null) {
      this.itemsContainer = itemsContainer;
    }
  };

  onHighlightedItemChange = (highlightedItem) => {
    this.highlightedItem = highlightedItem;
  };

  getItemId = (sectionIndex, itemIndex) => {
    if (itemIndex === null) {
      return null;
    }

    const { id } = this.props;
    const section = sectionIndex === null ? '' : `section-${sectionIndex}`;

    return `react-autowhatever-${id}-${section}-item-${itemIndex}`;
  };

  renderSections() {
    if (this.allSectionsAreEmpty) {
      return null;
    }

    const { theme } = this;
    const {
      id,
      items,
      renderItem,
      renderItemData,
      renderSectionTitle,
      highlightedSectionIndex,
      highlightedItemIndex,
      itemProps,
    } = this.props;

    return items.map((section, sectionIndex) => {
      const keyPrefix = `react-autowhatever-${id}-`;
      const sectionKeyPrefix = `${keyPrefix}section-${sectionIndex}-`;
      const isFirstSection = sectionIndex === 0;

      // `key` is provided by theme()
      /* eslint-disable react/jsx-key */
      return (
        <div
          {...theme(
            `${sectionKeyPrefix}container`,
            'sectionContainer',
            isFirstSection && 'sectionContainerFirst'
          )}
        >
          <SectionTitle
            section={section}
            renderSectionTitle={renderSectionTitle}
            theme={theme}
            sectionKeyPrefix={sectionKeyPrefix}
          />
          <ItemList
            items={this.sectionsItems[sectionIndex]}
            itemProps={itemProps}
            renderItem={renderItem}
            renderItemData={renderItemData}
            sectionIndex={sectionIndex}
            highlightedItemIndex={
              highlightedSectionIndex === sectionIndex
                ? highlightedItemIndex
                : null
            }
            onHighlightedItemChange={this.onHighlightedItemChange}
            getItemId={this.getItemId}
            theme={theme}
            keyPrefix={keyPrefix}
            ref={this.storeItemsListReference}
          />
        </div>
      );
      /* eslint-enable react/jsx-key */
    });
  }

  renderItems() {
    const { items } = this.props;

    if (items.length === 0) {
      return null;
    }

    const { theme } = this;
    const {
      id,
      renderItem,
      renderItemData,
      highlightedSectionIndex,
      highlightedItemIndex,
      itemProps,
    } = this.props;

    return (
      <ItemList
        items={items}
        itemProps={itemProps}
        renderItem={renderItem}
        renderItemData={renderItemData}
        highlightedItemIndex={
          highlightedSectionIndex === null ? highlightedItemIndex : null
        }
        onHighlightedItemChange={this.onHighlightedItemChange}
        getItemId={this.getItemId}
        theme={theme}
        keyPrefix={`react-autowhatever-${id}-`}
      />
    );
  }

  onFocus = (event) => {
    const { inputProps } = this.props;

    this.setState({
      isInputFocused: true,
    });

    inputProps.onFocus && inputProps.onFocus(event);
  };

  onBlur = (event) => {
    const { inputProps } = this.props;

    this.setState({
      isInputFocused: false,
    });

    inputProps.onBlur && inputProps.onBlur(event);
  };

  onKeyDown = (event) => {
    const {
      inputProps,
      highlightedSectionIndex,
      highlightedItemIndex,
    } = this.props;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        const nextPrev = event.key === 'ArrowDown' ? 'next' : 'prev';
        const [
          newHighlightedSectionIndex,
          newHighlightedItemIndex,
        ] = this.sectionIterator[nextPrev]([
          highlightedSectionIndex,
          highlightedItemIndex,
        ]);

        inputProps.onKeyDown(event, {
          newHighlightedSectionIndex,
          newHighlightedItemIndex,
        });
        break;
      }

      default:
        inputProps.onKeyDown(event, {
          highlightedSectionIndex,
          highlightedItemIndex,
        });
    }
  };

  ensureHighlightedItemIsVisible() {
    const { highlightedItem } = this;

    if (!highlightedItem) {
      return;
    }

    const { itemsContainer } = this;
    const itemOffsetRelativeToContainer =
      highlightedItem.offsetParent === itemsContainer
        ? highlightedItem.offsetTop
        : highlightedItem.offsetTop - itemsContainer.offsetTop;

    let { scrollTop } = itemsContainer; // Top of the visible area

    if (itemOffsetRelativeToContainer < scrollTop) {
      // Item is off the top of the visible area
      scrollTop = itemOffsetRelativeToContainer;
    } else if (
      itemOffsetRelativeToContainer + highlightedItem.offsetHeight >
      scrollTop + itemsContainer.offsetHeight
    ) {
      // Item is off the bottom of the visible area
      scrollTop =
        itemOffsetRelativeToContainer +
        highlightedItem.offsetHeight -
        itemsContainer.offsetHeight;
    }

    if (scrollTop !== itemsContainer.scrollTop) {
      itemsContainer.scrollTop = scrollTop;
    }
  }

  render() {
    const { theme } = this;
    const {
      id,
      multiSection,
      renderInputComponent,
      renderItemsContainer,
      highlightedSectionIndex,
      highlightedItemIndex,
    } = this.props;
    const { isInputFocused } = this.state;
    const renderedItems = multiSection
      ? this.renderSections()
      : this.renderItems();
    const isOpen = renderedItems !== null;
    const ariaActivedescendant = this.getItemId(
      highlightedSectionIndex,
      highlightedItemIndex
    );
    const itemsContainerId = `react-autowhatever-${id}`;
    const containerProps = {
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-owns': itemsContainerId,
      'aria-expanded': isOpen,
      ...theme(
        `react-autowhatever-${id}-container`,
        'container',
        isOpen && 'containerOpen'
      ),
      ...this.props.containerProps,
    };
    const inputComponent = renderInputComponent({
      type: 'text',
      value: '',
      autoComplete: 'off',
      'aria-autocomplete': 'list',
      'aria-controls': itemsContainerId,
      'aria-activedescendant': ariaActivedescendant,
      ...theme(
        `react-autowhatever-${id}-input`,
        'input',
        isOpen && 'inputOpen',
        isInputFocused && 'inputFocused'
      ),
      ...this.props.inputProps,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onKeyDown: this.props.inputProps.onKeyDown && this.onKeyDown,
      ref: this.storeInputReference,
    });
    const itemsContainer = renderItemsContainer({
      containerProps: {
        id: itemsContainerId,
        role: 'listbox',
        ...theme(
          `react-autowhatever-${id}-items-container`,
          'itemsContainer',
          isOpen && 'itemsContainerOpen'
        ),
        ref: this.storeItemsContainerReference,
      },
      children: renderedItems,
    });

    return (
      <div {...containerProps}>
        {inputComponent}
        {itemsContainer}
      </div>
    );
  }
}
