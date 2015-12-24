# Upgrading from 2.x to 3.x

* `suggestions` are an array now, not a function
* `suggestionValue` become `getSuggestionValue`
* `suggestionRenderer` become `renderSuggestion` and the signature is slightly
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
* `showWhen` become `shouldRenderSuggestions`
* `inputAttributes` become `inputProps`
* `inputAttributes.onChange` become `inputProps.onChange` and the signature is
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
* `onSuggestionFocused` and `onSuggestionUnfocused` were removed
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

## Troubleshooting

If you are getting the following error:

> Uncaught Error: Invariant Violation: addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded

Try:

```
$ rm -rf node_modules
$ npm install
```
