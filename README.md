<a href="https://codeship.com/projects/67868" target="_blank">
  <img src="https://img.shields.io/codeship/41810250-aa07-0132-fbf4-4e62e8945e03/master.svg"
       alt="Build Status" />
</a>
<a href="https://npmjs.org/package/react-autosuggest" target="_blank">
  <img src="https://img.shields.io/npm/v/react-autosuggest.svg"
       alt="NPM Version" />
</a>
<a href="https://npmjs.org/package/react-autosuggest" target="_blank">
  <img src="https://img.shields.io/npm/dm/react-autosuggest.svg"
       alt="NPM Downloads" />
</a>

# React Autosuggest

[WAI-ARIA compliant][wai-aria] React autosuggest component.


## Demo

* <a href="https://moroshko.github.io/react-autosuggest#basic-usage" target="_blank">Basic usage</a>
* <a href="https://moroshko.github.io/react-autosuggest#multiple-sections" target="_blank">Multiple sections</a>
* <a href="https://moroshko.github.io/react-autosuggest#async-example" target="_blank">Async example</a>
* <a href="https://moroshko.github.io/react-autosuggest#debounced-example" target="_blank">Debounced example</a>
* <a href="https://moroshko.github.io/react-autosuggest#caching-example" target="_blank">Caching example</a>

## Features

* Supports flux architecture (see [redux examples](https://github.com/moroshko/react-autosuggest/tree/master/demo/src/components/App/components))
* [WAI-ARIA accessible][wai-aria] (including ARIA attributes and keyboard interactions)
* Mobile friendly
* Supports [react-themeable](https://github.com/markdalgleish/react-themeable) for flexible styling
* Supports [multiple sections][multiple-sections] as well as [plain list][basic-usage] of suggestions
* Full control over [suggestion rendering](#renderSuggestionProp) (you can display extra data, images, whatever you want)
* Full control over [when to show the suggestions](#shouldRenderSuggestionsProp) (e.g. when user types 2 or more characters)
* [Pass through props to the input field](#inputPropsProp) (e.g. placeholder, type, onChange, onBlur)
* [onSuggestionSelected](#onSuggestionSelectedProp) hook
* Thoroughly tested

The following are not part of react-autosuggest, but can be easily implemented:

* Support for delayed requests (if request comes back after user types another letter, it will be ignored). [Example][async-example]
* In-memory caching (suggestions for a given input are retrieved only once). [Example][caching-example]

## Installation

```shell
npm install react-autosuggest --save
```

## Basic Usage

```js
import Autosuggest from 'react-autosuggest';

const suggestions = [{
  text: 'Apple'
}, {
  text: 'Banana'
}, {
  text: 'Cherry'
}, {
  text: 'Grapefruit'
}, {
  text: 'Lemon'
}];

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells
  return suggestion.text;                 // what should be the value of the input
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.text}</span>
  );
}

const inputProps = {
  value: inputValue,   // `inputValue` usually comes from application state
  onChange: onChange   // `onChange` will be called when input value changes
};

```
```xml
<Autosuggest suggestions={suggestions}
             getSuggestionValue={getSuggestionValue}
             renderSuggestion={renderSuggestion}
             inputProps={inputProps} />
```

## Props

* [`suggestions`](#suggestionsProp)
* [`getSuggestionValue`](#getSuggestionValueProp)
* [`renderSuggestion`](#renderSuggestionProp)
* [`inputProps`](#inputPropsProp)
* [`shouldRenderSuggestions`](#shouldRenderSuggestionsProp)
* [`multiSection`](#multiSectionProp)
* [`getSectionSuggestions`](#getSectionSuggestionsProp)
* [`renderSectionTitle`](#renderSectionTitleProp)
* [`onSuggestionSelected`](#onSuggestionSelectedProp)
* [`theme`](#themeProp)

<a name="suggestionsProp"></a>
#### suggestions (required)

Arbitrary array of suggestions to display. It's up to you what shape every suggestion takes. Normally, it would be an object or a string.

<a name="getSuggestionValueProp"></a>
#### getSuggestionValue (required)

When user navigates the suggestions using the Up and Down keys, [the input should display the highlighted suggestion][wai-aria]. You design how suggestion is modelled. Therefore, it's your responsibility to tell Autosuggest how to map suggestions to input values.

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

It's up to you to define how to render suggestions.

This function gets:

* `suggestion` - The suggestion to render
* `value` - The current value of the input
* `valueBeforeUpDown` - The value of the input prior to Up/Down interactions. It is useful if you want to highlight input's value in the suggestion (a.k.a the match), for example.

It should return a `ReactElement`. For example:

```js
function renderSuggestion(suggestion, value, valueBeforeUpDown) {
  return (
    <span>{suggestion.text}</span>
  );
}
```

<a name="inputPropsProp"></a>
#### inputProps (required)

Autosuggest is a [controlled component][controlled-component]. Therefore, you should pass at least a `value` and an `onChange` callback to the input field.



## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)

[wai-aria]: https://www.w3.org/TR/wai-aria-practices/#autocomplete
[controlled-component]: https://facebook.github.io/react/docs/forms.html#controlled-components
[basic-usage]: https://moroshko.github.io/react-autosuggest#basic-usage
[multiple-sections]: https://moroshko.github.io/react-autosuggest#multiple-sections
[async-example]: https://moroshko.github.io/react-autosuggest#async-example
[caching-example]: https://moroshko.github.io/react-autosuggest#caching-example

---

**TODO:**

* Write docs
* Examples:
  * Custom renderer (country flags)
  * Highlight matches (autosuggest-highlight)
  * Create list (remove selected item from suggestions)
  * No results
  * Mobile example
* Write tests
* Write upgrade guide
* Release 3.0
  * Publish to npm
  * Publish to gh-pages
* Add support for scrollbar

