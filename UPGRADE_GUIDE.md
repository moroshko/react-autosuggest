# Upgrading from 2.x to 3.x

* `suggestions` are an array now, not a function. [See docs.](https://github.com/moroshko/react-autosuggest/tree/3.0#suggestionsProp)
* `suggestionValue` becomes `getSuggestionValue`
* `suggestionRenderer` becomes `renderSuggestion` and the signature is slightly
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
* `showWhen` becomes `shouldRenderSuggestions`
* `inputAttributes` becomes `inputProps`
* `inputAttributes.onChange` becomes `inputProps.onChange` and the signature is
  slightly different now.

  In 2.x, the first argument was the new value:

  ```js
  function onChange(newValue)
  ```

  In 3.x, the first argument is the event, and the new value get be retrieved
  from the second argument:

  ```js
  function onChange(event, { newValue, method })
  ```
* `value` becomes `inputProps.value`
* `defaultValue` was removed
* `onSuggestionFocused` and `onSuggestionUnfocused` were removed
* Bower support was removed
* Uncontrolled behaviour is not supported in 3.x
* `cache` was removed. Caching is not part of `react-autosuggest` anymore. You'll have to implement this yourself. [Example](http://codepen.io/moroshko/pen/JGEmeX)
* Input debouncing is not part of `react-autosuggest` anymore. You'll have to implement this yourself. [Example](http://codepen.io/moroshko/pen/KVaGJE)
* Support for delayed requests is not part of `react-autosuggest` anymore. You'll have to implement this yourself. [Example](http://codepen.io/moroshko/pen/EPZpev)
* `scrollBar` doesn't exist in 3.x yet, but hopefully will exist soon.
* Some `theme` properties have changed:

```
                2.x    3.x
 ------------------------------------
               root    container
        suggestions    suggestions-container
suggestionIsFocused    suggestion--focused
            section    section-container
        sectionName    section-title
 sectionSuggestions    section-suggestions-container
```
