[![Build Status][status-image]][status-url]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

# React Autosuggest

[WAI-ARIA compliant](http://www.w3.org/TR/wai-aria-practices/#autocomplete) React autosuggest component.

## Live Examples

* <a href="//moroshko.github.io/react-autosuggest" target="_blank">Basic example</a><br>
* <a href="//moroshko.github.io/react-autosuggest#Custom renderer" target="_blank">Custom renderer</a><br>
* <a href="//moroshko.github.io/react-autosuggest#Multiple sections" target="_blank">Multiple sections</a>
* <a href="//moroshko.github.io/react-autosuggest#2 or more characters" target="_blank">2 or more characters</a>

## Installation

```shell
npm install react-autosuggest --save
```

## Basic Usage

```javascript
import Autosuggest from 'react-autosuggest';

let suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];

function getSuggestions(input, callback) {
  let regex = new RegExp('^' + input, 'i');

  setTimeout(function() {
    callback(null, suburbs.filter( suburb => regex.test(suburb) ));
  }, 300);
}
```
```xml
<Autosuggest suggestions={getSuggestions} />
```

### Options

* [`suggestions`](#suggestionsOption)
* [`suggestionRenderer`](#suggestionRendererOption)
* [`suggestionValue`](#suggestionValueOption)
* [`showWhen`](#showWhenOption)
* [`onSuggestionSelected`](#onSuggestionSelectedOption)
* [`onSuggestionFocused`](#onSuggestionFocusedOption)
* [`inputAttributes`](#inputAttributesOption)

<a name="suggestionsOption"></a>
##### suggestions (required)

Implement this function to tell `Autosuggest` which suggestions to display.

```javascript
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

```javascript
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
##### suggestionRenderer (required when suggestions are objects)

This function will be used to render the suggestion. It should return `ReactElement` or a string.

```javascript
function(suggestion, input) {
  ...
}
```

* `suggestion` - The [suggestion](#suggestion) to render (string or object)
* `input` - The value of the input field (e.g.: `'Men'`). If user interacts using the Up or Down keys at the moment, it will be the value of the input field **prior** to those interactions.

For example:

```javascript
function renderSuggestion(suggestion, input) { // In this example 'suggestion' is a string
  return (
    <span><strong>{suggestion.slice(0, input.length)}</strong>{suggestion.slice(input.length)}</span>
  );
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             suggestionRenderer={renderSuggestion} />
```

<a name="suggestionValueOption"></a>
##### suggestionValue (required when suggestions are objects)

This function will be used to set the value of the input field when suggestion is selected. It has one parameter which is the suggestion object. This function is ignored when suggestions are strings.

For example:

```javascript
function getSuggestionValue(suggestionObj) {
  return suggestionObj.suburb + ' VIC ' + suggestionObj.postcode;
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             suggestionRenderer={renderSuggestion}
             suggestionValue={getSuggestionValue} />
```

<a name="showWhenOption"></a>
##### showWhen (optional)

This function will be used to determine whether to show suggestions or not. It has one parameter which is the value of the input field (e.g.: `'m '`). The default is:

```javascript
function(input) {
  return input.trim().length > 0;
}
```


For example, to show suggestions only if user typed 2 or more characters, do:

```javascript
function showWhen(input) {
  return input.trim().length >= 2;
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             showWhen={showWhen} />
```

<a name="onSuggestionSelectedOption"></a>
##### onSuggestionSelected (optional)

This function will be called when suggestion is selected via mouse click or Enter. It has one parameter which is the selected [suggestion](#suggestion) (string or object).

For example:

```javascript
function onSuggestionSelected(suggestion) { // In this example 'suggestion' is a string
  console.log('Suggestion selected: [' + suggestion + ']');
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             onSuggestionSelected={onSuggestionSelected} />
```

<a name="onSuggestionFocusedOption"></a>
##### onSuggestionFocused (optional)

This function will be called when suggestion is focused via mouse hover or up/down keys. It has one parameter which is the focused [suggestion](#suggestion) (string or object).

For example:

```javascript
function onSuggestionFocused(suggestion) { // In this example 'suggestion' is a string
  console.log('Suggestion focused: [' + suggestion + ']');
}
```

```xml
<Autosuggest suggestions={getSuggestions}
             onSuggestionFocused={onSuggestionFocused} />
```

<a name="inputAttributesOption"></a>
##### inputAttributes (optional)

Hash of attributes to pass to the input field. For example:

```javascript
let inputAttributes = {
  id: 'locations-autosuggest',
  name: 'locations-autosuggest',
  className: 'my-sweet-locations-autosuggest',
  placeholder: 'Enter locations...',
  value: 'Mordialloc'   // Initial value
};
```

```xml
<label htmlFor="locations-autosuggest">Where</label>
<Autosuggest suggestions={getSuggestions}
             inputAttributes={inputAttributes} />
```

## Styling

The `<Autosuggest />` component comes with no styles. You can use the following classes to style it:

* `react-autosuggest`
* `react-autosuggest__suggestions`
* `react-autosuggest__suggestion`
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

Now, open `http://localhost:3000/examples/dist/index.html`

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
