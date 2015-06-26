[![Build Status][status-image]][status-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

# React Autosuggest

[WAI-ARIA compliant][wai-aria] React autosuggest component.

## Live Examples

* <a href="https://moroshko.github.io/react-autosuggest" target="_blank">Basic example</a><br>
* <a href="https://moroshko.github.io/react-autosuggest#Custom renderer" target="_blank">Custom renderer</a><br>
* <a href="https://moroshko.github.io/react-autosuggest#Multiple sections" target="_blank">Multiple sections</a>
* <a href="https://moroshko.github.io/react-autosuggest#Events playground" target="_blank">Events playground</a>

## Features

* [WAI-ARIA accessible][wai-aria] (including ARIA attributes and keyboard interactions)
* Supports [multiple sections][multiple-sections] as well as [plain list of suggestions][basic-example]
* Supports delayed requests (if request comes back after user types another letter, it will be ignored)
* Full control over [suggestion rendering](#suggestionRendererOption) (you can display extra data, images, whatever you want)
* Full control over [styling](#styling) (we just provide the mechanics and classes for you)
* Full control over [when to show the suggestions](#showWhenOption) (e.g. when user types 2 or more characters)
* Various hooks: [onSuggestionSelected](#onSuggestionSelectedOption), [onSuggestionFocused](#onSuggestionFocusedOption), [onSuggestionUnfocused](#onSuggestionUnfocusedOption)
* Support for [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components) as well as [uncontrolled](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) state
* Ability to [pass props to the input field](#inputAttributesOption) (e.g. placeholder, onChange, onBlur)
* In-memory caching (we retrieve suggestions for a given input only once)
* Thoroughly tested (over 100 tests)

## Installation

```shell
npm install react-autosuggest --save
```

## Basic Usage

#### CommonJS module:

```js
import Autosuggest from 'react-autosuggest';

const suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];

function getSuggestions(input, callback) {
  const regex = new RegExp('^' + input, 'i');
  const suggestions = suburbs.filter(suburb => regex.test(suburb));

  setTimeout(() => callback(null, suggestions)), 300); // Emulate API call
}
```
```xml
<Autosuggest suggestions={getSuggestions} />
```

#### UMD module: 

Check out the [standalone example](https://github.com/moroshko/react-autosuggest/tree/master/examples/standalone).

## Options

* [`suggestions`](#suggestionsOption)
* [`suggestionRenderer`](#suggestionRendererOption)
* [`suggestionValue`](#suggestionValueOption)
* [`defaultValue`](#defaultValueOption)
* [`value`](#valueOption)
* [`showWhen`](#showWhenOption)
* [`onSuggestionSelected`](#onSuggestionSelectedOption)
* [`onSuggestionFocused`](#onSuggestionFocusedOption)
* [`onSuggestionUnfocused`](#onSuggestionUnfocusedOption)
* [`inputAttributes`](#inputAttributesOption)
* [`id`](#idOption)
* [`scrollBar`](#scrollBarOption)

<a name="suggestionsOption"></a>
#### suggestions (required)

Implement this function to tell `<Autosuggest />` which suggestions to display.

```js
function(input, callback) {
  ...
}
```

* `input` - Will be the value of the input field
* `callback` - Should be called once the suggestions are in hand, or error occurs.

  * Success example: `callback(null, `[\<suggestions>](#suggestions)`)`
  * Error example: `callback(new Error("Couldn't get locations"))`

<a name="suggestions"></a>
`<suggestions>` can have one of the following two formats:

* **To display a single section with no title:** `[`[\<suggestion>](#suggestion)`, `[\<suggestion>](#suggestion)`, ...]`
* **To display one or more sections with optional titles:** Array of objects with an optional `sectionName` and a mandatory `suggestions` keys, e.g.:

```js
[{
  suggestions: [<suggestion>, <suggestion>]   // This section won't have a title
}, {
  sectionName: 'Second section',
  suggestions: [<suggestion>, <suggestion>, <suggestion>]
}]
```

<a name="suggestion"></a>
`<suggestion>` can have one of the following two formats:

* String, e.g.: `'Mentone'`
* Object, e.g.: `{ suburb: 'Mentone', postcode: '3194' }`. This object cannot have a `suggestions` key. **You must implement [`suggestionRenderer`](#suggestionRendererOption) and [`suggestionValue`](#suggestionValueOption) in this case.**

<a name="suggestionRendererOption"></a>
#### suggestionRenderer (required when suggestions are objects)

This function will be used to render the suggestion. It should return `ReactElement` or a string.

```js
function(suggestion, input) {
  ...
}
```

* [`suggestion`](#suggestion) - The suggestion to render
* `input` - The value of the input field (e.g.: `'Men'`). If user interacts using the Up or Down keys at the moment, it will be the value of the input field **prior** to those interactions.

For example:

```js
function renderSuggestion(suggestion, input) { // In this example, 'suggestion' is a string
  return (                                     // and it returns a ReactElement
    <span><strong>{suggestion.slice(0, input.length)}</strong>{suggestion.slice(input.length)}</span>
  );
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             suggestionRenderer={renderSuggestion} />
```

<a name="suggestionValueOption"></a>
#### suggestionValue (required when suggestions are objects)

This function will be used to set the value of the input field when suggestion is selected. It has one parameter which is the suggestion object. This function is ignored when suggestions are strings.

For example:

```js
function getSuggestionValue(suggestionObj) {
  return suggestionObj.suburb + ' VIC ' + suggestionObj.postcode;
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             suggestionRenderer={renderSuggestion}
             suggestionValue={getSuggestionValue} />
```

<a name="defaultValueOption"></a>
#### defaultValue (optional)

This string sets the initial value of the text. The default is an empty string.

Set this value if you want to use the component in an [uncontrolled](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) manner (the component keeps track of its state internally).

For example:

```xml
<Autosuggest suggestions={getSuggestions}
             defaultValue="Mordialloc" />
```

Note: if you specify this option then you should not include a [`value`](#valueOption).

<a name="valueOption"></a>
#### value (optional)

This string determines the value of the currently-selected suggestion.

Set this value if you want to use the component in a [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components) manner (the component uses an outside source of state). The currently-selected suggestion text will update whenever this option is updated, so it is recommended that you use a combination of `value` and [`onSuggestionSelected`](#onSuggestionSelectedOption) to keep track of the selected state inside a parent component.

For example:

```js
// Inside a React component...
function getInitialState() {
  return { activeSuggestion: 'one' };
}
function getActiveSuggestion() {
  return this.state.activeSuggestion;
}
function setActiveSuggestion(suggestion) {
  this.setState({ activeSuggestion: suggestion });
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             value={getActiveSuggestion()}
             onSuggestionSelected={setActiveSuggestion} />
```

Note: if you specify this option then you should not include a [defaultValue](#defaultValueOption).

<a name="showWhenOption"></a>
#### showWhen (optional)

This function will be used to determine whether to show suggestions or not. It has one parameter which is the value of the input field (e.g.: `'m '`). The default is:

```js
function(input) {
  return input.trim().length > 0;
}
```

For example, this is how you could show suggestions only when user typed 2 or more characters:

```xml
<Autosuggest suggestions={getSuggestions}
             showWhen={input => input.trim().length >= 2} />
```

<a name="onSuggestionSelectedOption"></a>
#### onSuggestionSelected (optional)

This function will be called when suggestion is selected via mouse click or Enter.

```js
function(suggestion, event) {
  ...
}
```

* [`suggestion`](#suggestion) - The selected suggestion
* [`event`][event] - It can be used to call `event.preventDefault()` if the `<Autosuggest />` is inside a form and you don't want to submit the form once user selected a suggestion using Enter.

For example:

```js
function onSuggestionSelected(suggestion, event) {
  event.preventDefault();
  // Do other fancy stuff
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             onSuggestionSelected={onSuggestionSelected} />
```

<a name="onSuggestionFocusedOption"></a>
#### onSuggestionFocused (optional)

This function will be called when suggestion is focused via mouse hover or Up/Down keys.

```js
function(suggestion) {
  ...
}
```

* [suggestion](#suggestion) - The focused suggestion

For example:

```js
function onSuggestionFocused(suggestion) { // In this example 'suggestion' is a string
  console.log('Suggestion focused: [' + suggestion + ']');
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             onSuggestionFocused={onSuggestionFocused} />
```

<a name="onSuggestionUnfocusedOption"></a>
#### onSuggestionUnfocused (optional)

This function will be called when suggestion is unfocused.

```js
function(suggestion) {
  ...
}
```

* [suggestion](#suggestion) - The unfocused suggestion

For example:

```js
function onSuggestionUnfocused(suggestion) { // In this example 'suggestion' is a string
  console.log('Suggestion unfocused: [' + suggestion + ']');
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             onSuggestionUnfocused={onSuggestionUnfocused} />
```

<a name="inputAttributesOption"></a>
#### inputAttributes (optional)

Hash of attributes to pass to the input field. For example:

```js
const inputAttributes = {
  id: 'locations-autosuggest',
  name: 'locations-autosuggest',
  className: 'my-sweet-locations-autosuggest',
  placeholder: 'Enter locations...',
  onChange: value => console.log(`Input value changed to: ${value}`),
  onBlur: () => console.log('Input blurred')
};
```

```xml
<label htmlFor="locations-autosuggest">Where</label>
<Autosuggest suggestions={getSuggestions}
             inputAttributes={inputAttributes} />
```

<a name="idOption"></a>
#### id (required when multiple Autosuggests are rendered on a page)

The only reason `id` exists, is to set ARIA attributes (they require a unique id).

When rendering a single `<Autosuggest />`, don't set the `id` (it will be set to `'1'`, by default).

When rendering multiple `<Autosuggest />`s, make sure to give them unique `id`s. For example:

```xml
<Autosuggest id="source" suggestions={getSourceSuggestions} />
<Autosuggest id="destination" suggestions={getDestinationSuggestions} />
```

<a name="scrollBarOption"></a>
#### scrollBar (optional)

Set it to `true` only if suggestions container (`react-autosuggest__suggestions`) can have a scroll bar (e.g. if it has `height: 200px; overflow: auto`). Suggestions container must be a [positioned element](https://developer.mozilla.org/en-US/docs/Web/CSS/position) in this case. When set to `true`, suggestions container will adjust its scroll bar every time user interacts using the Up and Down keys (see the [this example](https://moroshko.github.io/react-autosuggest#Custom renderer)).

Defaults to `false`.

<a name="styling"></a>
## Styling

`<Autosuggest />` comes with no styles. You can use the following classes to style it:

* `react-autosuggest`
* `react-autosuggest__suggestions`
* `react-autosuggest__suggestion`
* `react-autosuggest__suggestion--focused`
* `react-autosuggest__suggestions-section`
* `react-autosuggest__suggestions-section-name`
* `react-autosuggest__suggestions-section-suggestions`

An example can be found in [`examples/src/Autosuggest.less`](https://github.com/moroshko/react-autosuggest/blob/master/examples/src/Autosuggest.less)

The following diagrams explain the classes above.

#### No sections

    +---| react-autosuggest |-------------------------+
    |                                                 |
    |  <input>                                        |
    |                                                 |
    |  +--| react-autosuggest__suggestions |-------+  |
    |  |                                           |  |
    |  |  +--| react-autosuggest__suggestion |--+  |  |
    |  |  |                                     |  |  |
    |  |  +-------------------------------------+  |  |
    |  |                                           |  |
    |  +-------------------------------------------+  |
    |                                                 |
    +-------------------------------------------------+


#### Multiple sections


    +---| react-autosuggest |----------------------------------------------------+
    |                                                                            |
    |  <input>                                                                   |
    |                                                                            |
    |  +--| react-autosuggest__suggestions |----------------------------------+  |
    |  |                                                                      |  |
    |  |  +--| react-autosuggest__suggestions-section |--------------------+  |  |
    |  |  |                                                                |  |  |
    |  |  |  +--| react-autosuggest__suggestions-section-name |---------+  |  |  |
    |  |  |  |                                                          |  |  |  |
    |  |  |  +----------------------------------------------------------+  |  |  |
    |  |  |                                                                |  |  |
    |  |  |  +--| react-autosuggest__suggestions-section-suggestions |--+  |  |  |
    |  |  |  |                                                          |  |  |  |
    |  |  |  |  +--| react-autosuggest__suggestion |-----------------+  |  |  |  |
    |  |  |  |  |                                                    |  |  |  |  |
    |  |  |  |  +----------------------------------------------------+  |  |  |  |
    |  |  |  |                                                          |  |  |  |
    |  |  |  +----------------------------------------------------------+  |  |  |
    |  |  |                                                                |  |  |
    |  |  +----------------------------------------------------------------+  |  |
    |  |                                                                      |  |
    |  +----------------------------------------------------------------------+  |
    |                                                                            |
    +----------------------------------------------------------------------------+

## Development

```shell
npm start
```

Now, open `http://localhost:3000/examples/dist/index.html` and start hacking!

## Running Tests

```shell
npm test
```

## License

[MIT](http://moroshko.mit-license.org)

[status-image]: https://img.shields.io/codeship/41810250-aa07-0132-fbf4-4e62e8945e03/master.svg
[status-url]: https://codeship.com/projects/67868
[npm-image]: https://img.shields.io/npm/v/react-autosuggest.svg
[npm-url]: https://npmjs.org/package/react-autosuggest
[downloads-image]: https://img.shields.io/npm/dm/react-autosuggest.svg
[downloads-url]: https://npmjs.org/package/react-autosuggest
[wai-aria]: https://www.w3.org/TR/wai-aria-practices/#autocomplete
[event]: https://facebook.github.io/react/docs/events.html#syntheticevent
[basic-example]: https://moroshko.github.io/react-autosuggest
[multiple-sections]: https://moroshko.github.io/react-autosuggest/#Multiple%20sections
