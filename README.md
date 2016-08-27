<a href="https://codeship.com/projects/67868" target="_blank">
  <img src="https://img.shields.io/codeship/41810250-aa07-0132-fbf4-4e62e8945e03/master.svg?style=flat-square"
       alt="Build Status" />
</a>
<a href="https://codecov.io/gh/moroshko/react-autosuggest" target="_blank">
  <img src="https://img.shields.io/codecov/c/github/moroshko/react-autosuggest/master.svg" alt="Coverage Status">
</a>
<a href="https://www.bithound.io/github/moroshko/react-autosuggest" target="_blank">
  <img src="https://www.bithound.io/github/moroshko/react-autosuggest/badges/score.svg" alt="bitHound Overall Score">
</a>

<a href="http://issuestats.com/github/moroshko/react-autosuggest" target="_blank">
  <img src="http://issuestats.com/github/moroshko/react-autosuggest/badge/issue?style=flat-square"
       alt="Issues stats" />
</a>
<a href="http://issuestats.com/github/moroshko/react-autosuggest" target="_blank">
  <img src="https://img.shields.io/badge/pull%20requests%20closed%20in-5%20days-green.svg?style=flat-square"
       alt="Pull Requests stats" />
</a>

<a href="https://npmjs.org/package/react-autosuggest" target="_blank">
  <img src="https://img.shields.io/npm/dm/react-autosuggest.svg?style=flat-square"
       alt="NPM Downloads" />
</a>
<a href="https://npmjs.org/package/react-autosuggest" target="_blank">
  <img src="https://img.shields.io/npm/v/react-autosuggest.svg?style=flat-square"
       alt="NPM Version" />
</a>

# React Autosuggest

WAI-ARIA compliant autosuggest component built in React

## Demo

Check out the <a href="http://react-autosuggest.js.org" target="_blank">Homepage</a> and the <a href="http://codepen.io/collection/DkkYaQ" target="_blank">Codepen examples</a>.

## Features

* <a href="https://www.w3.org/TR/wai-aria-practices/#autocomplete" target="_blank">WAI-ARIA compliant</a>, with support for ARIA attributes and keyboard interactions
* Mobile friendly
* Plugs in nicely to Flux and <a href="http://redux.js.org" target="_blank">Redux</a> applications
* Full control over [suggestions rendering](#renderSuggestionProp)
* Suggestions can be presented as <a href="http://codepen.io/moroshko/pen/LGNJMy" target="_blank">plain list</a> or <a href="http://codepen.io/moroshko/pen/qbRNjV" target="_blank">multiple sections</a>
* Suggestions can be retrieved <a href="http://codepen.io/moroshko/pen/EPZpev" target="_blank">asynchronously</a>
* [Focus the first suggestion](#focusFirstSuggestionProp) in the list if you wish
* Supports styling using <a href="https://github.com/css-modules/css-modules" target="_blank">CSS Modules</a>, <a href="https://github.com/FormidableLabs/radium" target="_blank">Radium</a>, <a href="https://facebook.github.io/react/tips/inline-styles.html" target="_blank">Inline styles</a>, global CSS, [and more](#themeProp)
* You decide [when to show suggestions](#shouldRenderSuggestionsProp) (e.g. when user types 2 or more characters)
* [Always render suggestions](#alwaysRenderSuggestionsProp) (useful for mobile and modals)
* [Pass through arbitrary props to the input field](#inputPropsProp) (e.g. placeholder, type, [onChange](#inputPropsOnChange), [onBlur](#inputPropsOnBlur), or any other)
* Thoroughly tested

## Installation

```shell
npm install react-autosuggest --save
```

## Basic Usage

```js
import Autosuggest from 'react-autosuggest';

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'Elm',
    year: 2012
  },
  ...
];

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
}

function getSuggestionValue(suggestion) { // when suggestion is selected, this function tells
  return suggestion.name;                 // what should be the value of the input
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class Example extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps} />
    );
  }
}
```

## Props

* [`suggestions`](#suggestionsProp)
* [`onSuggestionsFetchRequested`](#onSuggestionsFetchRequestedProp)
* [`onSuggestionsClearRequested`](#onSuggestionsClearRequestedProp)
* [`onSuggestionSelected`](#onSuggestionSelectedProp)
* [`getSuggestionValue`](#getSuggestionValueProp)
* [`renderSuggestion`](#renderSuggestionProp)
* [`renderSuggestionsContainer`](#renderSuggestionsContainerProp)
* [`inputProps`](#inputPropsProp)
* [`shouldRenderSuggestions`](#shouldRenderSuggestionsProp)
* [`alwaysRenderSuggestions`](#alwaysRenderSuggestionsProp)
* [`multiSection`](#multiSectionProp)
* [`renderSectionTitle`](#renderSectionTitleProp)
* [`getSectionSuggestions`](#getSectionSuggestionsProp)
* [`focusInputOnSuggestionClick`](#focusInputOnSuggestionClickProp)
* [`focusFirstSuggestion`](#focusFirstSuggestionProp)
* [`theme`](#themeProp)
* [`id`](#idProp)

<a name="suggestionsProp"></a>
#### suggestions (required)

Array of suggestions to display. The only requirement is that `suggestions` is an array. Items in this array can take an arbitrary shape.

For a plain list of suggestions, every item in `suggestions` should be a single suggestion. It's up to you what shape every suggestion takes. For example:

```js
const suggestions = [
  {
    text: 'Apple'
  },
  {
    text: 'Banana'
  },
  {
    text: 'Cherry'
  },
  {
    text: 'Grapefruit'
  },
  {
    text: 'Lemon'
  }
];
```

To display [multiple sections](#multiSectionProp), every item in `suggestions` should be a single section. Again, it's up to you what shape every section takes. For example:

```js
const suggestions = [
  {
    title: 'A',
    suggestions: [
      {
        id: '100',
        text: 'Apple'
      },
      {
        id: '101',
        text: 'Apricot'
      }
    ]
  },
  {
    title: 'B',
    suggestions: [
      {
        id: '102',
        text: 'Banana'
      }
    ]
  },
  {
    title: 'C',
    suggestions: [
      {
        id: '103',
        text: 'Cherry'
      }
    ]
  }
];
```

<a name="onSuggestionsFetchRequestedProp"></a>
#### onSuggestionsFetchRequested (required)

This function will be called every time you need to update [`suggestions`](#suggestionsProp). It has the following signature:

```js
function onSuggestionsFetchRequested({ value })
```

where `value` is current value of the input.

<a name="onSuggestionsClearRequestedProp"></a>
#### onSuggestionsClearRequested (required unless `alwaysRenderSuggestions={true}`)

This function will be called every time you need to clear [`suggestions`](#suggestionsProp).

All you have to do in this function is to set `suggestions` to an empty array.

<a name="getSuggestionValueProp"></a>
#### getSuggestionValue (required)

When user navigates the suggestions using the <kbd>Up</kbd> and <kbd>Down</kbd> keys, <a href="https://www.w3.org/TR/wai-aria-practices/#autocomplete" target="_blank">the input should display the highlighted suggestion</a>. You design how suggestion is modelled. Therefore, it's your responsibility to tell Autosuggest how to map suggestions to input values.

This function gets the suggestion in question, and it should return a string. For example:

```js
function getSuggestionValue(suggestion) {
  return suggestion.text;
}
```

<a name="renderSuggestionProp"></a>
#### renderSuggestion (required)

Use your imagination to define how suggestions are rendered.

The signature is:

```js
function renderSuggestion(suggestion, { query })
```

where:

* `suggestion` - The suggestion to render
* `query` - Used to highlight the matching string. As user types in the input field, `query` will be equal to the trimmed value of the input. Then, if user interacts using the <kbd>Up</kbd> or <kbd>Down</kbd> keys, <a href="https://www.w3.org/TR/wai-aria-practices/#autocomplete" target="_blank">the input will get the value of the highlighted suggestion</a>, but `query` will remain to be equal to the trimmed value of the input prior to the <kbd>Up</kbd> and <kbd>Down</kbd> interactions.

It should return a string or a `ReactElement`. For example:

```js
function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.text}</span>
  );
}
```

**Important:** `renderSuggestion` must be a pure function (we optimize rendering performance based on this assumption).

<a name="renderSuggestionsContainerProp"></a>
#### renderSuggestionsContainer (optional)

You shouldn't use this function unless you want to customize the behaviour of the suggestions container. For example, you might want to add a custom text before/after the suggestions list, or [customize the scrolling behaviour of the suggestions container](https://github.com/moroshko/react-autosuggest/blob/master/FAQ.md#limitSuggestionsContainerScrolling).

The signature is:

```js
function renderSuggestionsContainer(props)
```

You should pass all the `props` to the topmost element that is returned from `renderSuggestionsContainer` with the following exceptions:

* `children` - these are the suggestions themselves. It's up to you where to render them.
* `ref` - when `renderSuggestionsContainer` returns a composite component (e.g. `<IsolatedScroll ... />` as opposed to a DOM node like `<div ... />`), you should call `ref` with the topmost element that the composite component renders.

Examples:

```js
function renderSuggestionsContainer({ children, ...rest }) {
  return (
    <div {...rest}>
      <p>
        Some text
      </p>
      {children}
    </div>
  );
}
```


```js
import IsolatedScroll from 'react-isolated-scroll';

function renderSuggestionsContainer({ ref, ...rest }) {
  const callRef = isolatedScroll => {
    if (isolatedScroll !== null) {
      ref(isolatedScroll.component);
    }
  };

  return (
    <IsolatedScroll {...rest} ref={callRef} />
  );
}
```

<a name="inputPropsProp"></a>
#### inputProps (required)

Autosuggest is a <a href="https://facebook.github.io/react/docs/forms.html#controlled-components" target="_blank">controlled component</a>. Therefore, you should pass at least a `value` and an `onChange` callback to the input field. You can pass any other props as well. For example:

```js
const inputProps = {
  value,          // usually comes from the application state
  onChange,       // called every time input value changes
  onBlur,         // called when input loses focus, e.g. when user presses Tab
  type: 'search',
  placeholder: 'Enter city or postcode'
};
```

<a name="inputPropsOnChange"></a>
##### inputProps.onChange (required)

The signature is:

```js
function onChange(event, { newValue, method })
```

where:

* `newValue` - the new value of the input field
* `method` - string describing how the change has occurred. The possible values are:
  * `'down'` - user pressed <kbd>Down</kbd>
  * `'up'` - user pressed <kbd>Up</kbd>
  * `'escape'` - user pressed <kbd>Escape</kbd>
  * `'enter'` - user pressed <kbd>Enter</kbd>
  * `'click'` - user clicked (or tapped) on suggestion
  * `'type'` - none of the methods above (usually means that user typed something, but can also be that they pressed Backspace, pasted something into the field, etc.)

<a name="inputPropsOnBlur"></a>
##### inputProps.onBlur (optional)

The signature is:

```js
function onBlur(event, { focusedSuggestion })
```

where:

* `focusedSuggestion` - the suggestion that was highlighted just before the input lost focus, or `null` if there was no highlighted suggestion.

<a name="shouldRenderSuggestionsProp"></a>
#### shouldRenderSuggestions (optional)

By default, suggestions are rendered when input field isn't blank. Feel free to override this behaviour.

This function gets the current value of the input, and it should return a boolean.

For example, to display suggestions only when input is at least 3 characters long, do:

```js
function shouldRenderSuggestions(value) {
  return value.trim().length > 2;
}
```

When `shouldRenderSuggestions` returns `true`, **suggestions will be rendered only when the input field is focused**.

If you would like to render suggestions regardless of whether the input field is focused or not, set `alwaysRenderSuggestions={true}` (`shouldRenderSuggestions` is ignored in this case).

<a name="alwaysRenderSuggestionsProp"></a>
#### alwaysRenderSuggestions (optional)

Set `alwaysRenderSuggestions={true}` if you'd like to always render the suggestions.

**Important:** Make sure to set the initial value of `suggestions` to match the initial value of `inputProps.value`.

<a name="multiSectionProp"></a>
#### multiSection (optional)

By default, Autosuggest renders a plain list of suggestions.

If you'd like to have multiple sections (with optional titles), set `multiSection={true}`.

<a name="renderSectionTitleProp"></a>
#### renderSectionTitle (required when `multiSection={true}`)

When rendering [multiple sections](#multiSectionProp), you need to tell Autosuggest how to render a section title.

This function gets the section to render (an item in the [suggestions](#suggestionsProp) array), and it should return a string or a `ReactElement`. For example:

```js
function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}
```

If `renderSectionTitle` returns `null` or `undefined`, section title is not rendered.

<a name="getSectionSuggestionsProp"></a>
#### getSectionSuggestions (required when `multiSection={true}`)

When rendering [multiple sections](#multiSectionProp), you need to tell Autosuggest where to find the suggestions for a given section.

This function gets the section to render (an item in the [suggestions](#suggestionsProp) array), and it should return an array of suggestions to render in the given section. For example:

```js
function getSectionSuggestions(section) {
  return section.suggestions;
}
```

**Note:** Sections with no suggestions are not rendered.

<a name="onSuggestionSelectedProp"></a>
#### onSuggestionSelected (optional)

This function is called when suggestion is selected. It has the following signature:

```js
function onSuggestionSelected(event, { suggestion, suggestionValue, sectionIndex, method })
```

where:

* `suggestion` - the selected suggestion
* `suggestionValue` - the value of the selected suggestion (equivalent to `getSuggestionValue(suggestion)`)
* `sectionIndex` - when rendering [multiple sections](#multiSectionProp), this will be the section index (in [`suggestions`](#suggestionsProp)) of the selected suggestion. Otherwise, it will be `null`.
* `method` - string describing how user selected the suggestion. The possible values are:
  * `'click'` - user clicked (or tapped) on the suggestion
  * `'enter'` - user selected the suggestion using <kbd>Enter</kbd>

<a name="focusInputOnSuggestionClickProp"></a>
#### focusInputOnSuggestionClick (optional)

By default, `focusInputOnSuggestionClick={true}`, which means that, every time suggestion is clicked (or tapped), the input field keeps the focus.

On mobile devices, when input is focused the native keyboard appears. You'll probably want to lose the focus when suggestion is tapped in order to hide the keyboard.

You can do something like this:

```xml
<Autosuggest focusInputOnSuggestionClick={!isMobile} ... />
```

where `isMobile` is a boolean describing whether Autosuggest operates on a mobile device or not. You can use [kaimallea/isMobile](https://github.com/kaimallea/isMobile), for example, to determine that.

<a name="focusFirstSuggestionProp"></a>
#### focusFirstSuggestion (optional)

When `focusFirstSuggestion={true}`, Autosuggest will automatically highlight the first suggestion. Defaults to `false`.

<a name="themeProp"></a>
#### theme (optional)

Autosuggest comes with no styles.

It uses <a href="https://github.com/markdalgleish/react-themeable" target="_blank">react-themeable</a> to allow you to style your Autosuggest component using <a href="https://github.com/css-modules/css-modules" target="_blank">CSS Modules</a>, <a href="https://github.com/FormidableLabs/radium" target="_blank">Radium</a>, <a href="https://github.com/js-next/react-style" target="_blank">React Style</a>, <a href="https://github.com/jsstyles/jss" target="_blank">JSS</a>, <a href="https://facebook.github.io/react/tips/inline-styles.html" target="_blank">Inline styles</a>, or even global CSS.

For example, to style the Autosuggest using CSS Modules, do:

```css
/* theme.css */

.container { ... }
.input { ... }
.suggestionsContainer { ... }
.suggestion { ... }
.suggestionFocused { ... }
...
```

```js
import theme from 'theme.css';
```
```xml
<Autosuggest theme={theme} ... />
```

When not specified, `theme` defaults to:

```js
{
  container:            'react-autosuggest__container',
  containerOpen:        'react-autosuggest__container--open',
  input:                'react-autosuggest__input',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestionsList:      'react-autosuggest__suggestions-list',
  suggestion:           'react-autosuggest__suggestion',
  suggestionFocused:    'react-autosuggest__suggestion--focused',
  sectionContainer:     'react-autosuggest__section-container',
  sectionTitle:         'react-autosuggest__section-title'
}
```

The following picture illustrates how `theme` keys correspond to Autosuggest DOM structure:

![DOM structure](dom-structure.png)

<a name="idProp"></a>
#### id (required when multiple Autosuggest components are rendered on a page)

The only reason `id` exists, is to set ARIA attributes (they require a unique id).

When rendering a single Autosuggest, don't set the `id` (it will be set to `'1'`, by default).

When rendering multiple Autosuggest components on a page, make sure to give them unique `id`s. For example:

```xml
<Autosuggest id="source" ... />
<Autosuggest id="destination" ... />
```

## Development

```shell
npm install
npm start
```

Now, open `http://localhost:3000/demo/dist/index.html` and start hacking!

## License

<a href="http://moroshko.mit-license.org" target="_blank">MIT</a>
