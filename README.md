# React Autosuggest

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

##### initialValue (optional)

Specifies the initial value of the input field. Defaults to `''`. For example:

```xml
<Autosuggest initialValue={'Mordialloc'} suggestions={getSuburbs} />
```

##### suggestions

Function to get the suggestions.

```javascript
function(input, callback) {
  ...
}
```

* `input` - The value of the input field
* `callback` - Should be called once the suggestions are in hand, or error occurs.

  * Success example: `callback(null, ['Mentone', 'Mentone East'])`
  * Error example - `callback(new Error("Couldn't get locations"))`

## Development

```bash
npm start
```

Now, open `http://localhost:3000/examples/dist/index.html`

## License

[MIT](http://mit-license.org)
