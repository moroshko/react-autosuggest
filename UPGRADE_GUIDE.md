# Upgrading to 3.0

* `suggestions` are an array now, not a function
* `suggestionValue` become `getSuggestionValue`
* `suggestionRenderer` become `renderSuggestion` and the signature is slightly
  different now.

  In 2.0, the second argument was the current value of the input field, or the
  value of the input field prior to Up/Down interactions:

  ```js
  function renderSuggestion(suggestion, currentValueOrValueBeforeUpDown)
  ```

  In 3.0, the second argument is an object that contains both the current value
  of the input field, the the value of the input field prior to Up/Down interactions:

  ```js
  function renderSuggestion(suggestion, { value, valueBeforeUpDown })
  ```
* `showWhen` become `shouldRenderSuggestions`
* `inputAttributes` become `inputProps`
* `inputAttributes.onChange` become `inputProps.onChange` and the signature is
  slightly different now.

  In 2.0, the first argument was the new value:

  ```js
  function onChange(newValue)
  ```

  In 3.0, the first argument is the event, and the new value get be retrieved
  from the second argument:

  ```
  function onChange(event, { newValue, method })
  ```
* `onSuggestionFocused` and `onSuggestionUnfocused` were removed


## Troubleshooting

If you are getting the following error:

> Uncaught Error: Invariant Violation: addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded

Try:

```
$ rm -rf node_modules
$ npm install
```
