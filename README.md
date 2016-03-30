<a href="https://codeship.com/projects/67868" target="_blank">
  <img src="https://img.shields.io/codeship/41810250-aa07-0132-fbf4-4e62e8945e03/master.svg?style=flat-square"
       alt="Build Status" />
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
* Plugs in nicely to Flux and <a href="http://redux.js.org" target="_blank">redux</a> applications
* Full control over [suggestions rendering](#renderSuggestionProp)
* Suggestions can be presented as <a href="http://codepen.io/moroshko/pen/LGNJMy" target="_blank">plain list</a> or <a href="http://codepen.io/moroshko/pen/qbRNjV" target="_blank">multiple sections</a>
* Suggestions can be retrieved <a href="http://codepen.io/moroshko/pen/EPZpev" target="_blank">asynchronously</a>
* Supports styling using <a href="https://github.com/css-modules/css-modules" target="_blank">CSS Modules</a>, <a href="https://github.com/FormidableLabs/radium" target="_blank">Radium</a>, <a href="https://facebook.github.io/react/tips/inline-styles.html" target="_blank">Inline styles</a>, global CSS, [and more](#themeProp)
* You decide [when to show suggestions](#shouldRenderSuggestionsProp) (e.g. when user types 2 or more characters)
* [Pass through props to the input field](#inputPropsProp) (e.g. placeholder, type, onChange, onBlur)
* [onSuggestionSelected](#onSuggestionSelectedProp) hook
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

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells
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
      suggestions: getSuggestions('')
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value)
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest suggestions={suggestions}
                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps} />
    );
  }
}
```

## Props

* [`suggestions`](#suggestionsProp)
* [`onSuggestionsUpdateRequested`](#onSuggestionsUpdateRequestedProp)
* [`getSuggestionValue`](#getSuggestionValueProp)
* [`renderSuggestion`](#renderSuggestionProp)
* [`inputProps`](#inputPropsProp)
* [`shouldRenderSuggestions`](#shouldRenderSuggestionsProp)
* [`multiSection`](#multiSectionProp)
* [`renderSectionTitle`](#renderSectionTitleProp)
* [`getSectionSuggestions`](#getSectionSuggestionsProp)
* [`onSuggestionSelected`](#onSuggestionSelectedProp)
* [`focusInputOnSuggestionClick`](#focusInputOnSuggestionClickProp)
* [`theme`](#themeProp)
* [`id`](#idProp)

<a name="suggestionsProp"></a>
#### suggestions (required)

An array of suggestions to display.

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

**Note:**

* It's totally up to you what shape suggestions take!
* The initial value of `suggestions` should match the initial value of `inputProps.value`. This will make sure that, if input has a non-empty initial value, and it's focused, the right suggestions are displayed.

<a name="onSuggestionsUpdateRequestedProp"></a>
#### onSuggestionsUpdateRequested (optional)

Normally, you would want to update [`suggestions`](#suggestionsProp) as user types. You might also want to update suggestions when user selects a suggestion or the input loses focus (so that, next time the input gets focus, suggestions will be up to date).

Autosuggest will call `onSuggestionsUpdateRequested` every time it thinks you might want to update suggestions.

`onSuggestionsUpdateRequested` has the following signature:

```js
function onSuggestionsUpdateRequested({ value, reason })
```

where:

* `value` - The current value of the input
* `reason` - string describing why Autosuggest thinks you might want to update suggestions. The possible values are:
  * `'type'` - usually means that user typed something, but can also be that they pressed Backspace, pasted something into the field, etc.
  * `'click'` - user clicked (or tapped) a suggestion
  * `'enter'` - user pressed Enter
  * `'escape'` - user pressed Escape
  * `'blur'` - input lost focus

<a name="getSuggestionValueProp"></a>
#### getSuggestionValue (required)

When user navigates the suggestions using the Up and Down keys, <a href="https://www.w3.org/TR/wai-aria-practices/#autocomplete" target="_blank">the input should display the highlighted suggestion</a>. You design how suggestion is modelled. Therefore, it's your responsibility to tell Autosuggest how to map suggestions to input values.

This function gets:

* `suggestion` - The suggestion in question

It should return a string. For example:

```js
function getSuggestionValue(suggestion) {
  return suggestion.text;
}
```

<a name="renderSuggestionProp"></a>
#### renderSuggestion (required)

Use your imagination to define how suggestions are rendered.

`renderSuggestion` has the following signature:

```js
function renderSuggestion(suggestion, { value, valueBeforeUpDown })
```

where:

* `suggestion` - The suggestion to render
* `value` - The current value of the input
* `valueBeforeUpDown` - The value of the input prior to Up/Down interactions. If user didn't interact with Up/Down yet, it will be `null`. It is useful if you want to highlight input's value in the suggestion (a.k.a the match), for example.

It should return a `ReactElement`. For example:

```js
function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.text}</span>
  );
}
```

<a name="inputPropsProp"></a>
#### inputProps (required)

Autosuggest is a <a href="https://facebook.github.io/react/docs/forms.html#controlled-components" target="_blank">controlled component</a>. Therefore, you should pass at least a `value` and an `onChange` callback to the input field. You can pass additional props as well. For example:

```js
const inputProps = {
  value: inputValue,  // `inputValue` usually comes from application state
  onChange: onChange, // called when input value changes
  type: 'search',
  placeholder: 'Enter city or postcode'
};
```

`onChange` has the following signature:

```js
function onChange(event, { newValue, method })
```

where:

* `newValue` - the new value of the input field
* `method` - string describing how the change occurred. The possible values are:
  * `'down'` - user pressed Down
  * `'up'` - user pressed Up
  * `'escape'` - user pressed Escape
  * `'click'` - user clicked (or tapped) on suggestion
  * `'type'` - none of the methods above (usually means that user typed something, but can also be that they pressed Backspace, pasted something into the field, etc.)

<a name="shouldRenderSuggestionsProp"></a>
#### shouldRenderSuggestions (optional)

By default, suggestions are rendered when input field isn't blank. Feel free to override this behaviour.

This function gets:

* `value` - The current value of the input

It should return a boolean.

For example, to display suggestions only when input is at least 3 characters long, do:

```js
function shouldRenderSuggestions(value) {
  return value.trim().length > 2;
}
```

<a name="multiSectionProp"></a>
#### multiSection (optional)

By default, Autosuggest renders a plain list of suggestions.

If you'd like to have multiple sections (with optional titles), set `multiSection={true}`.

<a name="renderSectionTitleProp"></a>
#### renderSectionTitle (required when `multiSection={true}`)

When rendering [multiple sections](#multiSectionProp), you need to tell Autosuggest how to render a section title.

This function gets:

* `section` - The section to render (an item in the [suggestions](#suggestionsProp) array)


It should return a `ReactElement`. For example:

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

This function gets:

* `section` - The section to render (an item in the [suggestions](#suggestionsProp) array)


It should return an array of suggestions to render in the given section. For example:

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
  * `'enter'` - user selected the suggestion using Enter

<a name="focusInputOnSuggestionClickProp"></a>
#### focusInputOnSuggestionClick (optional)

By default, `focusInputOnSuggestionClick={true}`, which means that, every time suggestion is clicked, the input will get the focus back.

To prevent the focus going back to the input, set `focusInputOnSuggestionClick={false}`.

This may be useful on mobile devices where the keyboard appears when input is focused.

You might want to do something like this:

```xml
<Autosuggest focusInputOnSuggestionClick={!isMobile} ... />
```

where `isMobile` is a boolean describing whether Autosuggest operates on a mobile device or not. You can use [kaimallea/isMobile](https://github.com/kaimallea/isMobile), for example, to determine that.

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
  container:                   'react-autosuggest__container',
  containerOpen:               'react-autosuggest__container--open',
  input:                       'react-autosuggest__input',
  suggestionsContainer:        'react-autosuggest__suggestions-container',
  suggestion:                  'react-autosuggest__suggestion',
  suggestionFocused:           'react-autosuggest__suggestion--focused',
  sectionContainer:            'react-autosuggest__section-container',
  sectionTitle:                'react-autosuggest__section-title',
  sectionSuggestionsContainer: 'react-autosuggest__section-suggestions-container'
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

## Running Tests

```shell
npm test
```

## License

<a href="http://moroshko.mit-license.org" target="_blank">MIT</a>
