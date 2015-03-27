[ ![Codeship Status for moroshko/react-autosuggest](https://codeship.com/projects/41810250-aa07-0132-fbf4-4e62e8945e03/status?branch=master)](https://codeship.com/projects/67868)

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

# React Autosuggest

[WAI-ARIA compliant](http://www.w3.org/TR/wai-aria-practices/#autocomplete) React autosuggest component.

## Demo

<a href="//moroshko.github.io/react-autosuggest" target="_blank">Live Example</a>

## Installation

```bash
npm install react-autosuggest --save
```

## Usage

```javascript
var Autosuggest = require('react-autosuggest');

var suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];

function getSuburbs(input, callback) {
  var regex = new RegExp('^' + input, 'i');

  setTimeout(function() {
    callback(null, suburbs.filter(function(suburb) {
      return regex.test(suburb);
    }));
  }, 300);
}
```
```xml
<Autosuggest suggestions={getSuburbs} />
```

### Options

##### suggestions (required)

Function to get the suggestions.

```javascript
function(input, callback) {
  ...
}
```

* `input` - The value of the input field
* `callback` - Should be called once the suggestions are in hand, or error occurs.

  * Success example: `callback(null, <suggestions>)` (see `<suggestions>` format below)
  * Error example: `callback(new Error("Couldn't get locations"))`

`<suggestions>` can be have one of the following three formats:

* **Single section with no title:** Array of strings, e.g.: `['Mentone', 'Mentone East']`
* **Single section with no title:** Array of objects with `displayKey` for
  rendering, e.g.:
```javascript
[{
  name: "Mentone",
  data: "Anything",
  displayKey: "Mentone"
}, {
  name: "Altona Meadows",
  data: "More data",
  displayKey: "Alt. Meadows"
}]
```

* **One or more sections with optional titles:** Array of objects with an optional `sectionName` and a mandatory `suggestions` keys, e.g.:

```javascript
[{
  suggestions: ['Mentone', 'Mentone East']   // This section won't have a title
}, {
  sectionName: 'Second section',
  suggestions: ['Altona Meadows', 'University of Melbourne']
}]
```

##### suggestionRenderer (optional)

Function that renders a single suggestion.

```javascript
function(suggestion, input) {
  ...
}
```

* `suggestion` - The suggestion string (e.g. `'Mentone'`)
* `input` - The value of the input field (e.g. `'Men'`). If user interacts using the Up or Down keys, it will contain the value of the input field **prior** to those interactions.

For example:

```javascript
function renderLocation(suggestion, input) {
  return (
    <span><strong>{suggestion.slice(0, input.length)}</strong>{suggestion.slice(input.length)}</span>
  );
}
```

```xml
<Autosuggest suggestions={getLocations} suggestionRenderer={renderLocation} />
```

##### inputAttributes (optional)

Hash of attributes to pass to the input field. For example:

```javascript
var inputAttributes = {
  id: 'locations-autosuggest',
  name: 'locations-autosuggest',
  className: 'my-sweet-locations-autosuggest',
  placeholder: 'Enter locations...',
  value: 'Mordialloc'   // Initial value
};
```

```xml
<label htmlFor="locations-autosuggest">Where</label>
<Autosuggest inputAttributes={inputAttributes} suggestions={getLocations} />
```

## Styling

The `<Autosuggest />` component comes with no styles. You can use the following classes to style it:

* `react-autosuggest` - Component's wrapper. It includes both the input field and the suggestions list.
* `react-autosuggest__suggestions` - Suggestions list wrapper
* `react-autosuggest__suggestions-section` - Suggestions section wrapper (exists only when displaying multiple sections)
* `react-autosuggest__suggestions-section-name` - Suggestions section name wrapper (exists only when displaying multiple sections and `sectionName` is specified)
* `react-autosuggest__suggestion` - Single suggestion wrapper

Example: [`examples/src/Autosuggest.less`](https://github.com/moroshko/react-autosuggest/blob/master/examples/src/Autosuggest.less)

## Development

```bash
npm start
```

Now, open `http://localhost:3000/examples/dist/index.html`

## License

[MIT](http://moroshko.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/react-autosuggest.svg
[npm-url]: https://npmjs.org/package/react-autosuggest
[downloads-image]: https://img.shields.io/npm/dm/react-autosuggest.svg
[downloads-url]: https://npmjs.org/package/react-autosuggest
