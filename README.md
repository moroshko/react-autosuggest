# React Autosuggest

[WAI-ARIA compliant](http://www.w3.org/TR/wai-aria-practices/#autocomplete) React autosuggest component.

## Demo

[Live Examples](http://moroshko.github.io/react-autosuggest)

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

##### inputId (optional)

The `id` of the input field. For example:

```xml
<label htmlFor="locations-autosuggest">Where</label>
<Autosuggest inputId="locations-autosuggest" suggestions={getLocations} />
```

##### initialValue (optional)

Specifies the initial value of the input field. Defaults to `''`. For example:

```xml
<Autosuggest initialValue="Mordialloc" suggestions={getSuburbs} />
```

##### suggestions (required)

Function to get the suggestions.

```javascript
function(input, callback) {
  ...
}
```

* `input` - The value of the input field
* `callback` - Should be called once the suggestions are in hand, or error occurs.

  * Success example: `callback(null, ['Mentone', 'Mentone East'])`
  * Error example: `callback(new Error("Couldn't get locations"))`

##### suggestionRenderer (optional)

Function that renders a single suggestion.

```javascript
function(suggestion, input) {
  ...
}
```

* `suggestion` - The suggestion (e.g. `'Mentone'`)
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


## Styling

The `<Autosuggest />` component comes with no styles. You can use the following classes to style it:

* `react-autosuggest` - Component's wrapper. It includes both the input field and the suggestions list.
* `react-autosuggest__suggestions` - Suggestions list wrapper
* `react-autosuggest__suggestion` - Single suggestion wrapper

Example: [`examples/src/Autosuggest.less`](https://github.com/moroshko/react-autosuggest/blob/master/examples/src/Autosuggest.less)

## Development

```bash
npm start
```

Now, open `http://localhost:3000/examples/dist/index.html`

## License

[MIT](http://mit-license.org)
