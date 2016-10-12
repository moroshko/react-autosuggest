# Upgrading from 5.x to 6.x

* `onSuggestionsUpdateRequested` was replaced with `onSuggestionsFetchRequested` and `onSuggestionsClearRequested`

  ```diff
  - onSuggestionsUpdateRequested = ({ value, reason }) => {
  + onSuggestionsFetchRequested = ({ value }) => {   // `reason` is not exposed anymore
      this.setState({
        suggestions: getSuggestions(value)
      });
    };
  
  + onSuggestionsClearRequested = () => {
  +   this.setState({
  +     suggestions: []
  +   });
  + };
  
    <Autosuggest
  -   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
  +   onSuggestionsFetchRequested={this.onSuggestionsUpdateRequested}
  +   onSuggestionsClearRequested={this.onSuggestionsClearRequested}
      ...
    />
  ```
  
  `onSuggestionsFetchRequested` is very similar to `onSuggestionsUpdateRequested`, except that it doesn't expose `reason` anymore.
  
  `onSuggestionsClearRequested` must be specified (unless you set `alwaysRenderSuggestions={true}`), and all it has to do is to set `suggestions` to an empty array.


# Upgrading from 2.x to 3.x

* `suggestions` are an array now, not a function. [See docs.](https://github.com/moroshko/react-autosuggest/blob/master/README.md#suggestionsProp)
* `suggestionValue` was renamed to `getSuggestionValue`
* `suggestionRenderer` was renamed to `renderSuggestion` and the signature is slightly
  different now.

  In 2.x, the second argument was the current value of the input field, or the
  value of the input field prior to Up/Down interactions:

  ```js
  function renderSuggestion(suggestion, currentValueOrValueBeforeUpDown)
  ```

  In 3.x, the second argument is an object that contains both the current value
  of the input field, the the value of the input field prior to Up/Down interactions:

  ```js
  function renderSuggestion(suggestion, { value, valueBeforeUpDown })
  ```
* `showWhen` was renamed to `shouldRenderSuggestions`
* `inputAttributes` was renamed to `inputProps`
* `inputAttributes.onChange` was renamed to `inputProps.onChange` and the signature is
  slightly different now.

  In 2.x, the first argument was the new value:

  ```js
  function onChange(newValue)
  ```

  In 3.x, the first argument is the event, and the new value can be retrieved
  from the second argument:

  ```js
  function onChange(event, { newValue })
  ```
* `value` was renamed to `inputProps.value`
* `onSuggestionFocused` and `onSuggestionUnfocused` were removed
* Bower support was removed
* Uncontrolled behaviour is not supported in 3.x, and therefore `defaultValue` was removed
* `cache` was removed. Caching is not part of `react-autosuggest` anymore. You'll have to implement this yourself. [Example](http://codepen.io/moroshko/pen/JGEmeX)
* Input debouncing is not part of `react-autosuggest` anymore. You'll have to implement this yourself. [Example](http://codepen.io/moroshko/pen/KVaGJE)
* Support for delayed requests is not part of `react-autosuggest` anymore. You'll have to implement this yourself. [Example](http://codepen.io/moroshko/pen/EPZpev)
* Some `theme` properties have changed:

```
                2.x    3.x
 ------------------------------------
               root    container
        suggestions    suggestionsContainer
suggestionIsFocused    suggestionFocused
            section    sectionContainer
        sectionName    sectionTitle
 sectionSuggestions    sectionSuggestionsContainer
```
